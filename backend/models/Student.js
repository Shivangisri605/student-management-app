const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone : {
        type: String,
        required: true,
    },
    age : {
        type: Number,
        required: true,
    },
    rollNo : {
        type: String,
        required: true,
        unique:true,
    },
    collegeName: { 
        type: String, 
        required: true 
    },
    // For "Subject - Dropdown (Multi subjects which want to choose)"
    subjects: [{ 
        type: String,
        required: true,
     }],
    regId: { 
        type: String,
        unique: true, 
    },
    bio: {
        type: String,
        required: true,
    },
},
{ timestamps: true });

module.exports = mongoose.model('Student', studentSchema);