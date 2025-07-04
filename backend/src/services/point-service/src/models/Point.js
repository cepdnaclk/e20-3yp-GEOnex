const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    ProjectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "projects", 
        required: true 
    },
    Name: { 
        type: String, 
        required: true 
    },
    Type: { 
        type: String, 
        default: "recorded" 
    },
    Latitude: { 
        type: Number, 
        required: true 
    },
    Longitude: { 
        type: Number, 
        required: true 
    },
    Accuracy: { 
        type: String, 
        default: null 
    },
    Timestamp: { 
        type: Date, 
        required: true 
    },
    PointStatus: { 
        type: String, 
        default: "default" 
    },
    Device:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "devices", 
        required: false 
    },
    Section: {
        type: String,
        default: "default"
    }

    
}, { timestamps: true });

module.exports = mongoose.model('Point', pointSchema);