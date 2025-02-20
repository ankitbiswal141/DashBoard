const express = require('express');
const User = require('../models/user.model');
const Event = require('../models/event.model');
const router = express.Router();

// Get user's progress for all events
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'progress.event',
                select: 'title startDate endDate tasks'
            });

        res.json({
            success: true,
            data: user.progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching progress',
            error: error.message
        });
    }
});

// Get progress for specific event
router.get('/:eventId', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const progress = user.progress.find(
            p => p.event.toString() === req.params.eventId
        );

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress not found for this event'
            });
        }

        // Populate event details
        await User.populate(user, {
            path: 'progress.event',
            select: 'title startDate endDate tasks'
        });

        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching event progress',
            error: error.message
        });
    }
});

// Update task completion status
router.post('/:eventId/tasks/:taskId', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Find or create progress record for this event
        let progress = user.progress.find(
            p => p.event.toString() === req.params.eventId
        );

        if (!progress) {
            progress = {
                event: req.params.eventId,
                completedTasks: [],
                status: 'not-started'
            };
            user.progress.push(progress);
        }

        // Update completed tasks
        const taskExists = event.tasks.some(
            task => task._id.toString() === req.params.taskId
        );

        if (!taskExists) {
            return res.status(404).json({
                success: false,
                message: 'Task not found in event'
            });
        }

        const taskCompleted = progress.completedTasks.includes(req.params.taskId);
        
        if (!taskCompleted) {
            progress.completedTasks.push(req.params.taskId);
            
            // Update progress status
            const completionRate = progress.completedTasks.length / event.tasks.length;
            if (completionRate === 1) {
                progress.status = 'completed';
            } else if (completionRate > 0) {
                progress.status = 'in-progress';
            }
        }

        await user.save();

        res.json({
            success: true,
            message: 'Task completion status updated',
            data: progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating task completion',
            error: error.message
        });
    }
});

module.exports = router;
