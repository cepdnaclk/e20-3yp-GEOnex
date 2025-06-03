const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    Device_Id: { type: mongoose.Schema.Types.ObjectId, ref: "Device",required: false },
    DeviceCode: { type: String, required: true, unique: true },
    Name: { type: String, required: true },
    Status: { type: String, enum: ["Online", "Offline", "Active", "Registered"], required: true, default: "Registered" },
    Type: { type: String, required: true },
    Battery_Percentage: { type: Number, min: 0, max: 100, required: false },
    Signal_Strength: { type: String, required: false },
    Last_Update: { type: Date, default: Date.now },
    Registered_User_Id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    Registered_Date: { type: Date, default: Date.now },
    Active_Project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
   
  });

const Device = mongoose.models.Device || mongoose.model("Device", deviceSchema);
module.exports = Device;
