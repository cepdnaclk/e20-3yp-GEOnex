const { createDevice, getDeviceById, updateDevice, checkDeviceInUse } = require('../controllers/deviceController');
const Device = require('../models/Device');
const { getDb } = require('../db');
const { ObjectId } = require('mongodb');

jest.mock('../models/Device');
jest.mock('../db');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('createDevice', () => {
  it('should return 400 if device already exists', async () => {
    const req = {
      body: {
        DeviceCode: 'DC001',
        Name: 'DeviceA',
        Type: 'Tracker',
        Registered_User_Id: 'user123',
      }
    };
    const res = mockRes();

    Device.findOne.mockResolvedValue({ Name: 'DeviceA' });

    await createDevice(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "A device with this name is already registered for this user.",
    });
  });

  it('should save new device if not exists', async () => {
    const req = {
      body: {
        DeviceCode: 'DC001',
        Name: 'DeviceB',
        Type: 'Sensor',
        Registered_User_Id: 'user456',
      }
    };
    const res = mockRes();
    const mockSave = jest.fn().mockResolvedValue('device saved');
    Device.findOne.mockResolvedValue(null);
    Device.mockImplementation(() => ({ save: mockSave }));

    await createDevice(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith('device saved');
  });
});

describe('getDeviceById', () => {
  it('should return device if found', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = mockRes();
    const mockDevice = { _id: '507f1f77bcf86cd799439011', Name: 'DeviceX' };

    getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockResolvedValue(mockDevice),
      }),
    });

    await getDeviceById(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, device: mockDevice });
  });

  it('should return 404 if device not found', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = mockRes();

    getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockResolvedValue(null),
      }),
    });

    await getDeviceById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Device not found' });
  });
});

describe('updateDevice', () => {
  it('should update device fields and return success', async () => {
    const req = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: { Name: 'UpdatedName', Battery_Percentage: 80 },
    };
    const res = mockRes();

    getDb.mockReturnValue({
      collection: () => ({
        updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
      }),
    });

    await updateDevice(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Device updated successfully' });
  });

  it('should return 404 if device not found for update', async () => {
    const req = {
      params: { id: '507f1f77bcf86cd799439099' },
      body: {},
    };
    const res = mockRes();

    getDb.mockReturnValue({
      collection: () => ({
        updateOne: jest.fn().mockResolvedValue({ matchedCount: 0 }),
      }),
    });

    await updateDevice(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Device not found' });
  });
});

describe('checkDeviceInUse', () => {
  it('should return true if device is active', async () => {
    const req = { params: { deviceCode: 'DC001' } };
    const res = mockRes();

    getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockResolvedValue({ Status: 'Active' }),
      }),
    });

    await checkDeviceInUse(req, res);
    expect(res.json).toHaveBeenCalledWith({ isInUse: true });
  });

  it('should return 404 if device not found', async () => {
    const req = { params: { deviceCode: 'notfound' } };
    const res = mockRes();

    getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockResolvedValue(null),
      }),
    });

    await checkDeviceInUse(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Device not found' });
  });
});
