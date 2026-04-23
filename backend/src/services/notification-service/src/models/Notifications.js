const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to the User model
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["base_connected", "survey_created", "project_updated", "system_alert", "general","warning"],
    default: "general"
  },
  link: {
    type: String,
    default: "" // optional URL or path to navigate when clicked
  },
  read: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Notifications = mongoose.models.Notifications || mongoose.model("Notifications", notificationsSchema);
module.exports = Notifications;

