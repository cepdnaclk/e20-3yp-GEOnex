//UNIT TEST: GET USER DATA

const { getUserData } = require('../src/controllers/userController');
const User = require('../src/models/User');

jest.mock('../../device-service/src/models/Device', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock('../../device-service/src/models/Alert', () => ({
  find: jest.fn(),
}));


jest.mock('../src/models/User');

describe('Unit Test: getUserData', () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      userId: '123456',
    };

    res = {
      json: jest.fn(),
    };

    mockUser = {
      _id: '123456',
      name: 'John Doe',
      isAccountVerified: true,
    };
  });

  it('should return error if user not found', async () => {
    User.findById.mockResolvedValue(null);

    await getUserData(req, res);

    expect(User.findById).toHaveBeenCalledWith('123456');
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found',
    });
  });

  it('should return user data successfully', async () => {
    User.findById.mockResolvedValue(mockUser);

    await getUserData(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      userData: {
        name: 'John Doe',
        userId: '123456',
        isAccountVerified: true,
      },
    });
  });

  it('should handle errors in try-catch block', async () => {
    User.findById.mockRejectedValue(new Error('DB error'));

    await getUserData(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'DB error',
    });
  });
});

// UNIT TEST: ADD DEVICE TO USER

/*const { addDeviceToUser } = require('../src/controllers/userController');


const Device = {
  findOne: jest.fn(),
};

describe('Unit Test: addDeviceToUser', () => {
  let req, res, userMock, deviceMock;

  beforeEach(() => {
    req = {
      params: { userId: 'user123' },
      body: { DeviceCode: 'dev-001' },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    jest.clearAllMocks(); // Clear mocks before each test

    userMock = {
      _id: 'user123',
      connectedDevices: [],
      save: jest.fn(),
    };

    deviceMock = {
      _id: 'device123',
      DeviceCode: 'dev-001',
    };
  });

  it('should return 404 if user not found', async () => {
    User.findById.mockResolvedValue(null);

    await addDeviceToUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 404 if device not found', async () => {
    User.findById.mockResolvedValue(userMock);
    Device.findOne.mockResolvedValue(null);

    await addDeviceToUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Device not found' });
  });

  it('should return 400 if device is already assigned to user', async () => {
    userMock.connectedDevices = [deviceMock._id];

    User.findById.mockResolvedValue(userMock);
    Device.findOne.mockResolvedValue(deviceMock);

    await addDeviceToUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Device is already assigned to this user',
    });
  });

  it('should assign device to user successfully', async () => {
    userMock.connectedDevices = [];

    User.findById.mockResolvedValue(userMock);
    Device.findOne.mockResolvedValue(deviceMock);

    await addDeviceToUser(req, res);

    expect(userMock.connectedDevices).toContain(deviceMock._id);
    expect(userMock.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Device added to user successfully',
      connectedDevices: userMock.connectedDevices,
    });
  });

  it('should handle internal server error', async () => {
    User.findById.mockRejectedValue(new Error('DB error'));

    await addDeviceToUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    });
  });
});

*/

//UNIT TEST: GET USER DEVICES

const { getUserDevices } = require('../src/controllers/userController'); // Update path

describe('Unit Test: getUserDevices', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { userId: 'user123' },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it('should return 404 if user not found', async () => {
    User.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

    await getUserDevices(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 404 if no devices are connected', async () => {
    const userMock = {
      connectedDevices: [],
    };

    User.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(userMock) });

    await getUserDevices(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No devices found for this user' });
  });

  it('should return 200 and connected devices if present', async () => {
    const userMock = {
      connectedDevices: [{ _id: 'dev1', name: 'Device 1' }],
    };

    User.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(userMock) });

    await getUserDevices(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      connectedDevices: userMock.connectedDevices,
    });
  });

  it('should handle internal server error', async () => {
    User.findById.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error('DB error')) });

    await getUserDevices(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});


//UNIT TEST: REMOVE DEVICE FROM USER

const { removeDeviceFromUser } = require('../src/controllers/userController');

describe('removeDeviceFromUser', () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      params: { userId: 'user123' },
      body: { deviceId: 'device456' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockUser = {
      connectedDevices: ['device456'],
      save: jest.fn(),
    };

    User.findById.mockResolvedValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if user is not found', async () => {
    User.findById.mockResolvedValue(null);

    await removeDeviceFromUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 400 if device is not assigned to user', async () => {
    mockUser.connectedDevices = ['otherDevice'];

    await removeDeviceFromUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Device is not assigned to this user' });
  });

  it('should remove device from user and return success', async () => {
    await removeDeviceFromUser(req, res);

    expect(mockUser.connectedDevices).not.toContain('device456');
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Device removed from user successfully',
      connectedDevices: mockUser.connectedDevices
    });
  });

  it('should return 500 on server error', async () => {
    User.findById.mockRejectedValue(new Error('DB error'));

    await removeDeviceFromUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});


// UNIT TEST: GET USER BASES

const { getUserBases } = require('../src/controllers/userController');

describe('getUserBases', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return base stations when user is found', async () => {
    const mockBaseStations = [
      { Type: 'base', name: 'Base1' },
      { Type: 'sensor', name: 'Sensor1' },
      { Type: 'base', name: 'Base2' }
    ];

    const mockUser = {
      connectedDevices: mockBaseStations
    };

    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockUser)
    });

    const req = { params: { userId: '123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserBases(req, res);

    expect(User.findById).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      connectedDevices: [
        { Type: 'base', name: 'Base1' },
        { Type: 'base', name: 'Base2' }
      ]
    });
  });

  it('should return 404 if user not found', async () => {
    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    const req = { params: { userId: '123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserBases(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 500 on DB error', async () => {
    User.findById.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValue(new Error('DB error'))
    }));

    const req = { params: { userId: '123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserBases(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

});

//UNIT TEST: GET USER CLIENT DEVICES

const { getUserClientDevices } = require('../src/controllers/userController');

describe('getUserClientDevices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return client devices when user is found', async () => {
    const mockDevices = [
      { Type: 'rover', name: 'Client1' },
      { Type: 'base', name: 'Base1' },
      { Type: 'rover', name: 'Client2' }
    ];

    const mockUser = {
      connectedDevices: mockDevices
    };

    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockUser)
    });

    const req = { params: { userId: '123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserClientDevices(req, res);

    expect(User.findById).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      connectedDevices: [
        { Type: 'rover', name: 'Client1' },
        { Type: 'rover', name: 'Client2' }
      ]
    });
  });

  it('should return 404 if user is not found', async () => {
    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    const req = { params: { userId: 'notfound' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserClientDevices(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 500 on DB error', async () => {
    User.findById.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValue(new Error('DB error'))
    }));

    const req = { params: { userId: '123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserClientDevices(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

//UNIT TEST:GET USER REGISTER DEVICES

/*const { getUserRegisteredDevices } = require('../src/controllers/userController');

describe('getUserRegisteredDevices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return devices if found for the user', async () => {
    const mockDevices = [
      { id: '1', name: 'Device A', Registered_User_Id: 'user123' },
      { id: '2', name: 'Device B', Registered_User_Id: 'user123' }
    ];

    Device.find.mockResolvedValue(mockDevices);

    const req = { params: { userId: 'user123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserRegisteredDevices(req, res);

    expect(Device.find).toHaveBeenCalledWith({ Registered_User_Id: 'user123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ devices: mockDevices });
  });

  it('should return 404 if no devices are found', async () => {
    Device.find.mockResolvedValue([]);

    const req = { params: { userId: 'user123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserRegisteredDevices(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Registered devices not found' });
  });

  it('should return 500 if there is a database error', async () => {
    Device.find.mockRejectedValue(new Error('DB failure'));

    const req = { params: { userId: 'user123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserRegisteredDevices(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

//UNIT TEST: GET USER DEVICE ALERTS

const { getUserDeviceAlerts } = require('../src/controllers/userController');

jest.mock('../../device-service/src/models/Alert', () => ({
  find: jest.fn()
}));

// ✅ Now import the mocked modules
const Alert = require('../../device-service/src/models/Alert');

describe('getUserDeviceAlerts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the latest 5 alerts for user devices', async () => {
    const mockUser = {
      _id: 'user123',
      connectedDevices: [{ _id: 'device1' }, { _id: 'device2' }]
    };

    const mockAlerts = [
      { _id: 'alert1', deviceId: 'device1', message: 'Low battery' },
      { _id: 'alert2', deviceId: 'device2', message: 'Disconnected' }
    ];

    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockUser)
    });

    Alert.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockAlerts)
    });

    const req = { params: { userId: 'user123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserDeviceAlerts(req, res);

    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(Alert.find).toHaveBeenCalledWith({
      deviceId: { $in: ['device1', 'device2'] }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ alerts: mockAlerts });
  });

  it('should return 404 if user is not found', async () => {
    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    const req = { params: { userId: 'user123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserDeviceAlerts(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return a message if no alerts found', async () => {
    const mockUser = {
      _id: 'user123',
      connectedDevices: [{ _id: 'device1' }, { _id: 'device2' }]
    };

    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockUser)
    });

    Alert.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([])
    });

    const req = { params: { userId: 'user123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserDeviceAlerts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'No alerts found for user devices' });
  });

  it('should handle internal server errors', async () => {
    User.findById.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error('Database error'))
    });

    const req = { params: { userId: 'user123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserDeviceAlerts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});



const { addDeviceToUser } = require('../src/controllers/userController');

describe('Unit Test: addDeviceToUser', () => {
  let req, res, userMock, deviceMock;

  beforeEach(() => {
    req = {
      params: { userId: 'user123' },
      body: { DeviceCode: 'dev-001' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();

    userMock = {
      _id: 'user123',
      connectedDevices: [],
      save: jest.fn(),
    };

    deviceMock = {
      _id: 'device123',
      DeviceCode: 'dev-001',
    };
  });

  it('should return 404 if user not found', async () => {
    User.findById.mockResolvedValue(null);

    await addDeviceToUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 404 if device not found', async () => {
    User.findById.mockResolvedValue(userMock);
    Device.findOne.mockResolvedValue(null);

    await addDeviceToUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Device not found' });
  });

  it('should return 400 if device already assigned', async () => {
    userMock.connectedDevices = ['device123'];
    User.findById.mockResolvedValue(userMock);
    Device.findOne.mockResolvedValue(deviceMock);

    await addDeviceToUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Device is already assigned to this user',
    });
  });

  it('should assign device to user successfully', async () => {
    User.findById.mockResolvedValue(userMock);
    Device.findOne.mockResolvedValue(deviceMock);

    await addDeviceToUser(req, res);

    expect(userMock.connectedDevices).toContain(deviceMock._id);
    expect(userMock.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Device added to user successfully',
      connectedDevices: userMock.connectedDevices,
    });
  });

  it('should handle internal server error', async () => {
    User.findById.mockRejectedValue(new Error('DB error'));

    await addDeviceToUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    });
  });
});

*/
