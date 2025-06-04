const request = require('supertest');
//const app = require('../../../../server'); // Your Express app
const mongoose = require('mongoose');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter=require('../src/config/nodemailer.js');

jest.mock('../src/models/User'); // Mocking DB model
jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => 'hashed_password'),
  compare: jest.fn(() => true),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock_token'),
}));
jest.mock('../src/config/nodemailer.js', () => ({
  sendMail: jest.fn(() => Promise.resolve('Email sent')),
}));

// UNIT TEST: REGISTER
const { register} = require('../src/controllers/authController');

describe('Unit Test: Register', () => {
  it('should return error if missing details', async () => {
    const req = { body: {} };
    const res = { json: jest.fn() };

    await register(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Missing Details',
    });
  });

  it('should return error if user already registered', async () => {
  // Simulate that a user with the given email already exists
    User.findOne.mockResolvedValue({ email: 'test@email.com' });

    const req = { body: { name: 'Test', email: 'test@email.com', password: '123456' } };
    const res = { json: jest.fn() };

    await register(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User already exists',
    });
  });

  it('should register a user successfully', async () => {
    User.findOne.mockResolvedValue(null);
    const saveMock = jest.fn();
    User.mockImplementation(() => ({
      save: saveMock,
      _id: '1234',
    }));

    const req = {
      body: { name: 'Test', email: 'test@email.com', password: '123456' },
    };
    const res = {
      json: jest.fn(),
      cookie: jest.fn(),
    };

    await register(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});


// UNIT TEST: LOGIN

const { login } = require('../src/controllers/authController');

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
        //sameSite: 'strict',
        //maxAge: 7 * 24 * 60 * 60 * 1000,
      })
    );

    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});

//UNIT TEST-LOGOUT
const { logout } = require('../src/controllers/authController');

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
      //sameSite: 'strict',
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
const {sendVerifyOtp} = require('../src/controllers/authController');

describe('Unit Test: sendVerifyOtp', () => {
  let req, res, mockUser;

  beforeEach(() => {
    jest.clearAllMocks();

    req = { userId: '123' };
    res = { json: jest.fn() };

    mockUser = {
      isAccountVerified: false,
      email: 'test@email.com',
      save: jest.fn(),
    };

    User.findById.mockResolvedValue(mockUser);
  });

  it('should return success if OTP is sent', async () => {
    await sendVerifyOtp(req, res);

    expect(User.findById).toHaveBeenCalledWith('123');
    expect(mockUser.verifyOtp).toBeDefined();
    expect(mockUser.verifyOtpExpireAt).toBeGreaterThan(Date.now());
    expect(mockUser.save).toHaveBeenCalled();
    expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'test@email.com',
      subject: 'Account Verification OTP',
    }));
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Verification OTP sent to the email',
    });
  });

  it('should return error if account already verified', async () => {
    mockUser.isAccountVerified = true;

    await sendVerifyOtp(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Account Already verified',
    });
  });

  it('should return error on exception', async () => {
    User.findById.mockRejectedValue(new Error('DB error'));

    await sendVerifyOtp(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'DB error',
    });
  });
});


//UNIT TEST-VERIFY EMAIL

const { verifyEmail } = require('../src/controllers/authController');

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
const { isAuthenticated } = require('../src/controllers/authController');

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

const { sendResetOtp } = require('../src/controllers/authController');

describe('Unit Test: sendResetOtp', () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@email.com',
      },
    };
    res = {
      json: jest.fn(),
    };

    mockUser = {
      email: 'test@email.com',
      save: jest.fn(),
    };

    User.findOne.mockReset();
    transporter.sendMail.mockClear();
  });

  it('should return error if email is missing', async () => {
    req.body.email = '';

    await sendResetOtp(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email is required',
    });
  });

  it('should return error if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    await sendResetOtp(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@email.com' });
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found',
    });
  });

  it('should send OTP successfully', async () => {
    User.findOne.mockResolvedValue(mockUser);

    await sendResetOtp(req, res);

    expect(mockUser.resetOtp).toBeDefined();
    expect(mockUser.resetOtpExpiredAt).toBeGreaterThan(Date.now());
    expect(mockUser.save).toHaveBeenCalled();
    expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'test@email.com',
      subject: 'Password Reset OTP',
    }));
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

const { resetPassword } = require('../src/controllers/authController');

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


