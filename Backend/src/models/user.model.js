const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['participant', 'organizer'],
        default: 'participant'
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    progress: [{
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        completedTasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }],
        status: {
            type: String,
            enum: ['not-started', 'in-progress', 'completed'],
            default: 'not-started'
        }
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
