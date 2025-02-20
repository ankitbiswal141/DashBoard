const express = require('express');
const Announcement = require('../models/announcement.model');
const { isOrganizer } = require('../middleware/auth');
const router = express.Router();

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const { eventId } = req.query;
        const query = eventId ? { event: eventId } : {};

        const announcements = await Announcement.find(query)
            .populate('author', 'name email')
            .populate('event', 'title')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: announcements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching announcements',
            error: error.message
        });
    }
});

// Create new announcement (organizer only)
router.post('/', isOrganizer, async (req, res) => {
    try {
        const announcementData = {
            ...req.body,
            author: req.user.id
        };

        const announcement = await Announcement.create(announcementData);
        
        // Emit socket event for real-time updates
        req.app.get('io').emit('newAnnouncement', {
            eventId: announcement.event,
            announcement
        });

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating announcement',
            error: error.message
        });
    }
});

// Mark announcement as read
router.post('/:id/read', async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Check if user has already read the announcement
        const alreadyRead = announcement.readBy.some(
            read => read.user.toString() === req.user.id
        );

        if (!alreadyRead) {
            announcement.readBy.push({
                user: req.user.id,
                readAt: new Date()
            });
            await announcement.save();
        }

        res.json({
            success: true,
            message: 'Announcement marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error marking announcement as read',
            error: error.message
        });
    }
});

module.exports = router;
