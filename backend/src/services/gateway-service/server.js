const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Instead of origin: true, be more specific in production
// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'http://localhost:3000',
//     'https://geonex.site',
//     'https://api.geonex.site',
//     'https://www.geonex.site'
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept', 'Origin'],
//   exposedHeaders: ['Set-Cookie']
// }));

app.use(cors({
  origin: true, 
  credentials: true
}));

app.set('trust proxy', true);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware (you might need: npm install cookie-parser)
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Environment detection
const isDocker = process.env.DOCKER_ENV === 'true' || process.env.NODE_ENV === 'production';

// Service mappings
const services = {
  auth: isDocker ? 'http://auth-service:5002' : 'http://localhost:5002',
  devices: isDocker ? 'http://device-service:5003' : 'http://localhost:5003',
  projects: isDocker ? 'http://project-service:5004' : 'http://localhost:5004',
  points: isDocker ? 'http://point-service:5005' : 'http://localhost:5005',
  export: isDocker ? 'http://export-service:5006' : 'http://localhost:5006',
  notifications: isDocker ? 'http://notification-service:5008' : 'http://localhost:5008',
};

// Enhanced logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.cookies && Object.keys(req.cookies).length > 0) {
    console.log('Cookies:', req.cookies);
  }
  next();
});

// Generic route handler function
async function forwardRequest(req, res, serviceName, preserveApiPath = true) {
  try {
    const serviceUrl = services[serviceName];
    if (!serviceUrl) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Build the target URL - preserve the full API path
    let targetPath;
    if (preserveApiPath) {
      // Keep the full path including /api/serviceName/
      targetPath = req.url;
    } else {
      // Remove /api/serviceName/ prefix (old behavior)
      targetPath = req.url.replace(`/api/${serviceName}`, '');
    }
    
    const targetUrl = `${serviceUrl}${targetPath.startsWith('/') ? targetPath : '/' + targetPath}`;

    console.log(`[FORWARD] ${req.method} ${req.url} -> ${targetUrl}`);

    // Prepare headers - preserve all important headers
    const forwardHeaders = {
      ...req.headers,
      host: new URL(serviceUrl).host, // Update host header
      'x-forwarded-for': req.ip,
      'x-forwarded-proto': req.protocol,
      'x-forwarded-host': req.get('host'),
      'x-real-ip': req.ip
    };

    // Remove headers that might cause issues
    delete forwardHeaders['content-length'];

    // Prepare request config
    const config = {
      method: req.method,
      url: targetUrl,
      headers: forwardHeaders,
      timeout: 30000,
      withCredentials: true,
      responseType: 'arraybuffer', 
      validateStatus: function (status) {
        return status < 500; // Don't throw for 4xx errors
      }
    };

    // Add body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH','DELETE'].includes(req.method.toUpperCase())) {
      config.data = req.body;
    }

    // Add query parameters
    if (Object.keys(req.query).length > 0) {
      config.params = req.query;
    }

    console.log('Request config:', JSON.stringify({
      method: config.method,
      url: config.url,
      headers: config.headers,
      hasData: !!config.data
    }, null, 2));

    // Make the request
    const response = await axios(config);

    console.log(`[RESPONSE] ${response.status} from ${serviceName}`);

    // Forward response headers (especially important for auth)
    Object.keys(response.headers).forEach(key => {
      if (key.toLowerCase() !== 'transfer-encoding') {
        res.set(key, response.headers[key]);
      }
    });

    // Forward cookies explicitly
    if (response.headers['set-cookie']) {
      res.set('Set-Cookie', response.headers['set-cookie']);
    }

    // res.status(response.status).json(response.data);


    const isAttachment = response.headers['content-disposition']?.includes('attachment');

    if (isAttachment) {
      // Handle file download
      res.status(response.status);
      Object.entries(response.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      if (Buffer.isBuffer(response.data)) {
        res.send(response.data);
      } else {
        res.send(Buffer.from(response.data));
      }

    } else {
      // ✅ Handle JSON/API response as usual
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        res.status(response.status).json(JSON.parse(Buffer.from(response.data).toString()));
      } else {
        res.status(response.status).send(Buffer.from(response.data).toString());
      }
    }


  } catch (error) {
    console.error(`[ERROR] Request to ${serviceName} failed:`, error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: 'Service Unavailable',
        message: `${serviceName} service is not available`,
        service: serviceName
      });
    } else if (error.code === 'ETIMEDOUT') {
      res.status(504).json({
        error: 'Gateway Timeout',
        message: `${serviceName} service timeout`,
        service: serviceName
      });
    } else {
      res.status(502).json({
        error: 'Bad Gateway',
        message: `Error communicating with ${serviceName} service`,
        service: serviceName,
        details: error.message
      });
    }
  }
}

// Auth routes (most critical for your issue)
app.all('/api/auth/*', (req, res) => forwardRequest(req, res, 'auth'));
app.all('/api/user/*', (req, res) => forwardRequest(req, res, 'auth'));

// Other service routes
app.all('/api/devices/*', (req, res) => forwardRequest(req, res, 'devices'));
app.all('/api/projects/*', (req, res) => forwardRequest(req, res, 'projects'));

app.all('/api/points/*', (req, res) => forwardRequest(req, res, 'points'));

app.all('/api/points', (req, res) => forwardRequest(req, res, 'points'));

app.all('/api/export/*', (req, res) => forwardRequest(req, res, 'export'));
app.all('/api/notifications/*', (req, res) => forwardRequest(req, res, 'notifications'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: isDocker ? 'docker' : 'local',
    services: services
  });
});

// Routes info
app.get('/routes', (req, res) => {
  res.json({
    services: services,
    environment: isDocker ? 'docker' : 'local'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route Not Found',
    path: req.originalUrl,
    availableServices: Object.keys(services)
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple Gateway running on port ${PORT}`);
  console.log(`📍 Environment: ${isDocker ? 'Docker' : 'Local'}`);
  console.log('\n🔗 Services:');
  Object.keys(services).forEach(service => {
    console.log(`   /api/${service}/* -> ${services[service]}`);
  });
  console.log('\n✅ Gateway ready!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));