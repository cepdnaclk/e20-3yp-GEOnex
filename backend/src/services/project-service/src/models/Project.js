const mongoose = require("mongoose");


const projectSchema = new mongoose.Schema({
  User_Id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  Name: { type: String, required: true },
  Created_On: { type: Date, required: true },
  Last_Modified: { type: Date, required: true },
  Status: { type: String, default: "Active" },
  Survey_Time: { type: String, required: false },
  Description: { type: String, required: false },
  Total_Points: { type: Number, default: 0 },
  Sections: { type: [String], default: ["default"] },
  BaseStation: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  ClientDevices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true }],
  Points: [{ type: mongoose.Schema.Types.ObjectId, ref: "Point" }],
  baseMode: { type: String, default: "auto" },
  baseLatitude: { type: Number, default: null },
  baseLongitude: { type: Number, default: null },
});


  const Project = mongoose.model("Project", projectSchema);
  module.exports = Project;