const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../../../config/nodemailer.js');
const { register } = require('../controllers/authController');
const { WELCOME_EMAIL,EMAIL_VERIFY_TEMPLATE} = require('../../../config/emailTemplate');

// 🧪 Mock external dependencies
jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../../config/nodemailer.js', () => ({
  sendMail: jest.fn(() => Promise.resolve('Email sent')),
}));
jest.mock('../../../config/emailTemplate', () => ({
  WELCOME_EMAIL: '<p>Welcome {{email}}</p>',
  EMAIL_VERIFY_TEMPLATE: '<p>Your OTP is {{otp}} for {{email}}</p>',
  PASSWORD_RESET_TEMPLATE: '<p>Your OTP is {{otp}} for {{email}}</p>',
}));


describe('Unit Test: register', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test User',
        email: 'test@email.com',
        password: '123456',
      },
    };

    res = {
      json: jest.fn(),
      cookie: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should return error if missing details', async () => {
    req.body = {}; // Missing all required fields

    await register(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Missing Details',
    });
  });

  it('should return error if password is too short', async () => {
    req.body.password = '123'; // Too short

    await register(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  });

  it('should return error if user already exists', async () => {
    User.findOne.mockResolvedValue({ email: req.body.email }); // Simulate existing user

    await register(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User already exists',
    });
  });

  it('should register user and send welcome email', async () => {
    // Mocks
    User.findOne.mockResolvedValue(null); // No existing user
    bcrypt.hash.mockResolvedValue('hashed_password'); // Password hashing
    jwt.sign.mockReturnValue('mock_token'); // JWT token

    const saveMock = jest.fn().mockResolvedValue();
    const mockUser = {
      save: saveMock,
      _id: 'user123',
      email: req.body.email,
    };

    User.mockImplementation(() => mockUser);

    await register(req, res);

    // Check hashing
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);

    // Check JWT
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 'user123' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Check cookie setting
    expect(res.cookie).toHaveBeenCalledWith(
      'token',
      'mock_token',
      expect.objectContaining({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: expect.any(String),
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
    );

    // Check email sending
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.SENDER_EMAIL,
      to: req.body.email,
      subject: 'Welcome to GEOnex',
      html: expect.stringContaining(req.body.email),
    });

    // Final response
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});


// UNIT TEST: LOGIN

const { login } = require('../controllers/authController');

describe('Unit Test: login', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      json: jest.fn(),
      cookie: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return error if email or password is missing', async () => {
    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email and password are required',
    });
  });

  it('should return error if user not found', async () => {
    req.body = { email: 'test@example.com', password: '1234' };
    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid email',
    });
  });

  it('should return error if password does not match', async () => {
    req.body = { email: 'test@example.com', password: 'wrongpass' };

    User.findOne.mockResolvedValue({ email: 'test@example.com', password: 'hashed_password' });
    bcrypt.compare.mockResolvedValue(false); // simulate wrong password

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid password',
    });
  });

  it('should return error if account is not verified', async () => {
    req.body = { email: 'test@example.com', password: '1234' };

    User.findOne.mockResolvedValue({ password: 'hashed_password', isAccountVerified: false });
    bcrypt.compare.mockResolvedValue(true);

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Please verify your account first.',
    });
  });

  it('should login successfully and set token cookie', async () => {
    req.body = { email: 'test@example.com', password: '1234' };

    const mockUser = {
      _id: 'user123',
      password: 'hashed_password',
      isAccountVerified: true,
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mock_token');

    await login(req, res);

    expect(res.cookie).toHaveBeenCalledWith(
      'token',
      'mock_token',
      expect.objectContaining({
        httpOnly: true,
        secure: false, // depends on NODE_ENV
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
    );

    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});

//UNIT TEST-LOGOUT
const { logout } = require('../controllers/authController');

describe('Unit Test: logout', () => {
  let req, res;

  beforeEach(() => {
    req = {}; // No request body needed for logout
    res = {
      clearCookie: jest.fn(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should clear the token cookie and return success message', async () => {
    await logout(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith('token', expect.objectContaining({
      httpOnly: true,
      secure: false, // Adjust based on NODE_ENV
      sameSite: 'strict',
    }));

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Logged out',
    });
  });

  it('should return error message on exception', async () => {
    res.clearCookie.mockImplementation(() => {
      throw new Error('Something went wrong');
    });

    await logout(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong',
    });
  });
});


//UNIT TEST-VERIFY OTP
const {sendVerifyOtp} = require('../controllers/authController');

describe('Unit Test: sendVerifyOtp', () => {
  let req, res;

  beforeEach(() => {
    req = {
      userId: 'mockUserId',
    };
    res = {
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should return error if user is already verified', async () => {
    User.findById.mockResolvedValue({
      isAccountVerified: true,
    });

    await sendVerifyOtp(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Account Already verified',
    });
  });

  it('should generate OTP, update user and send email', async () => {
    const saveMock = jest.fn();
    const mockUser = {
      email: 'test@email.com',
      isAccountVerified: false,
      save: saveMock,
    };

    User.findById.mockResolvedValue(mockUser);

    await sendVerifyOtp(req, res);

    expect(mockUser.verifyOtp).toMatch(/^\d{6}$/);
    expect(mockUser.verifyOtpExpireAt).toBeGreaterThan(Date.now());

    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.SENDER_EMAIL,
      to: 'test@email.com',
      subject: 'Account Verification OTP',
      html: expect.stringContaining(mockUser.email),
    });

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Verification OTP sent to the email',
    });
  });

  it('should return error if exception is thrown', async () => {
    User.findById.mockRejectedValue(new Error('DB error'));

    await sendVerifyOtp(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'DB error',
    });
  });
});

//UNIT TEST-VERIFY EMAIL

const { verifyEmail } = require('../controllers/authController');

describe('Unit Test: verifyEmail', () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      userId: '123',
      body: { otp: '654321' }
    };

    res = {
      json: jest.fn()
    };

    mockUser = {
      verifyOtp: '654321',
      verifyOtpExpireAt: Date.now() + 10000,
      isAccountVerified: false,
      save: jest.fn()
    };

    User.findById = jest.fn();
  });

  it('should return error if missing userId or OTP', async () => {
    req.userId = null;
    await verifyEmail(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Missing Details'
    });
  });

  it('should return error if user not found', async () => {
    User.findById.mockResolvedValue(null);
    await verifyEmail(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found'
    });
  });

  it('should return error if OTP is invalid', async () => {
    mockUser.verifyOtp = '999999'; // Mismatched OTP
    User.findById.mockResolvedValue(mockUser);

    await verifyEmail(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid OTP'
    });
  });

  it('should return error if OTP is expired', async () => {
    mockUser.verifyOtp = '654321';
    mockUser.verifyOtpExpireAt = Date.now() - 10000; // expired
    User.findById.mockResolvedValue(mockUser);

    await verifyEmail(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'OTP Expired'
    });
  });

  it('should verify email successfully if OTP is valid and not expired', async () => {
    User.findById.mockResolvedValue(mockUser);

    await verifyEmail(req, res);

    expect(mockUser.isAccountVerified).toBe(true);
    expect(mockUser.verifyOtp).toBe('');
    expect(mockUser.verifyOtpExpireAt).toBe(0);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Email verified successfully'
    });
  });

  it('should handle exceptions and return error', async () => {
    User.findById.mockRejectedValue(new Error('DB Error'));
    await verifyEmail(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'DB Error'
    });
  });
});

//UNIT TEST:IS AUTHENTICATED
const { isAuthenticated } = require('../controllers/authController');

describe('Unit Test: isAuthenticated', () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      userId: '123',
    };
    res = {
      json: jest.fn(),
    };

    mockUser = {
      _id: '123',
      isAccountVerified: true,
    };

    User.findById = jest.fn();
  });

  it('should return error if user not found', async () => {
    User.findById.mockResolvedValue(null);

    await isAuthenticated(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found.',
    });
  });

  it('should return not verified if user has not verified account', async () => {
    mockUser.isAccountVerified = false;
    User.findById.mockResolvedValue(mockUser);

    await isAuthenticated(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      verified: false,
      message: 'Please verify your account first.',
    });
  });

  it('should return success if user is authenticated and verified', async () => {
    User.findById.mockResolvedValue(mockUser);

    await isAuthenticated(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      verified: true,
    });
  });

  it('should return error on exception', async () => {
    User.findById.mockRejectedValue(new Error('DB error'));

    await isAuthenticated(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'DB error',
    });
  });
});

//UNIT TEST: SEND RESET OTP

const { sendResetOtp } = require('../controllers/authController');

describe('Unit Test: sendResetOtp', () => {
  let req, res;

  beforeAll(() => {
    process.env.SENDER_EMAIL = 'noreply@geonex.com';
  });

  beforeEach(() => {
    req = { body: { email: 'test@email.com' } };
    res = { json: jest.fn() };
    jest.clearAllMocks();
  });

  it('should return error if email is missing', async () => {
    req.body = {}; // No email
    await sendResetOtp(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email is required',
    });
  });

  it('should return error if user not found', async () => {
    User.findOne.mockResolvedValue(null); // No user found
    await sendResetOtp(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found',
    });
  });

  it('should generate OTP, update user and send email', async () => {
    const saveMock = jest.fn().mockResolvedValue();
    const mockUser = {
      email: req.body.email,
      save: saveMock,
    };

    User.findOne.mockResolvedValue(mockUser);

    await sendResetOtp(req, res);

    // Assert OTP format
    expect(mockUser.resetOtp).toMatch(/^\d{6}$/);
    expect(mockUser.resetOtpExpiredAt).toBeGreaterThan(Date.now());

    // Assert mail sent
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.SENDER_EMAIL,
      to: req.body.email,
      subject: 'Password Reset OTP',
      html: expect.stringContaining(req.body.email),
    });

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'OTP send to your email',
    });
  });

  it('should return error on exception', async () => {
    User.findOne.mockRejectedValue(new Error('DB error'));

    await sendResetOtp(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'DB error',
    });
  });
});


//UNIT TEST: RESET PASSWORD

const { resetPassword } = require('../controllers/authController');

describe('Unit Test: resetPassword', () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@email.com',
        otp: '123456',
        newPassword: 'newPass123',
      },
    };
    res = {
      json: jest.fn(),
    };

    mockUser = {
      email: 'test@email.com',
      resetOtp: '123456',
      resetOtpExpiredAt: Date.now() + 10000, // valid future time
      save: jest.fn(),
    };

    User.findOne.mockReset();
    bcrypt.hash.mockClear();
  });

  it('should return error if any field is missing', async () => {
    req.body = {};
    await resetPassword(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email,OTP and new password required',
    });
  });

  it('should return error if user not found', async () => {
    User.findOne.mockResolvedValue(null);
    await resetPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@email.com' });
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found',
    });
  });

  it('should return error if OTP is invalid or empty', async () => {
    mockUser.resetOtp = '';
    User.findOne.mockResolvedValue(mockUser);

    await resetPassword(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid OTP',
    });
  });

  it('should return error if OTP is expired', async () => {
    mockUser.resetOtp = '123456';
    mockUser.resetOtpExpiredAt = Date.now() - 1000; // past time
    User.findOne.mockResolvedValue(mockUser);

    await resetPassword(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'OTP expired',
    });
  });

  it('should reset password successfully', async () => {
    mockUser.resetOtp = '123456';
    mockUser.resetOtpExpiredAt = Date.now() + 10000; // valid
    User.findOne.mockResolvedValue(mockUser);

    await resetPassword(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('newPass123', 10);
    expect(mockUser.password).toBe('hashed_password');
    expect(mockUser.resetOtp).toBe('');
    expect(mockUser.resetOtpExpiredAt).toBe(0);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Password has been reset successfully',
    });
  });

  it('should handle server errors', async () => {
    User.findOne.mockRejectedValue(new Error('DB error'));

    await resetPassword(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'DB error',
    });
  });
});

// INTEGRATION TEST: REGISTER ROUTE
/*describe('Integration Test: Auth Routes', () => {

  it('should fail registration with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Missing Details');
  });

  // You can extend tests for login, logout, sendverifyotp etc.
}); */


