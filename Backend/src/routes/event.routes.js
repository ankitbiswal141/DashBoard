const express = require('express');
const Event = require('../models/event.model');
const { isOrganizer } = require('../middleware/auth');
const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'name email')
            .sort({ startDate: 1 });

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email')
            .populate('participants', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    }
});

// Create new event (organizer only)
router.post('/', isOrganizer, async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            organizer: req.user.id
        };

        const event = await Event.create(eventData);
        
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
});

// Update event (organizer only)
router.put('/:id', isOrganizer, async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, organizer: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found or unauthorized'
            });
        }

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
});

// Register for event
router.post('/:id/register', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.participants.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'Already registered for this event'
            });
        }

        if (event.participants.length >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Event is at full capacity'
            });
        }

        event.participants.push(req.user.id);
        await event.save();

        res.json({
            success: true,
            message: 'Successfully registered for event'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering for event',
            error: error.message
        });
    }
});

module.exports = router;
