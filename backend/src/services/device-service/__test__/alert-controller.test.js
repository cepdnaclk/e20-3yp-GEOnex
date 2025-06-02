const { createAlert } = require('../controllers/alertController');
const Alert = require('../models/Alert');

jest.mock('../models/Alert'); // Mock the Alert model

describe('createAlert', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                deviceId: 'device123',
                status: 'low battery',
                code: '101',
                created_At: new Date(),
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('should create and return a new alert with status 201', async () => {
        const savedAlert = {
            _id: 'alert123',
            ...req.body
        };

        // Mock Alert constructor and save method
        Alert.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(savedAlert),
        }));

        await createAlert(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(savedAlert);
    });

    it('should return 500 if an error occurs during alert creation', async () => {
        Alert.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('DB error')),
        }));

        await createAlert(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server error",
            error: "DB error"
        });
    });
});
