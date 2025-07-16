const Alert = require('../models/Alert.js');

const createAlert = async (req, res) => {

    try {
        const { deviceId, status, code, created_At } = req.body;

        const newAlert = new Alert({
            deviceId,
            status,
            code,
            created_At: created_At || new Date() 
        });

        const addedAlert = await newAlert.save();

        console.log("$ Created Alert:", addedAlert);
        res.status(201).json(addedAlert);
    } catch (error) {
        console.error("Error creating alert:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createAlert };
