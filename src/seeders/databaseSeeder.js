const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Event = require('../models/event.model');
const Announcement = require('../models/announcement.model');
require('dotenv').config();

// Connect to MongoDB with updated options
mongoose.connect('mongodb://127.0.0.1:27017/participant-dashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Helper Functions
const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateRandomName = () => {
    const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const generateRandomEmail = (name, index) => {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
    return `${name.toLowerCase().replace(' ', '.')}${index}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

const generateRandomLocation = () => {
    return ['Virtual', 'Tech Hub', 'Innovation Center', 'Conference Hall'][Math.floor(Math.random() * 4)];
};

const generateRandomEventTitle = (index) => {
    const topics = ['Web Development', 'AI/ML', 'Cloud Computing', 'Cybersecurity'];
    const types = ['Workshop', 'Hackathon', 'Seminar', 'Conference'];
    return `${topics[index % topics.length]} ${types[index % types.length]} ${Math.floor(index / 4) + 1}`;
};

// Seed Database
async function seedDatabase() {
    try {
        console.log('Starting database seeding...');
        
        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Event.deleteMany({}),
            Announcement.deleteMany({})
        ]);

        // Generate and hash passwords in parallel
        const hashedPassword = await bcrypt.hash('password123', 12);
        
        // Prepare user data
        const organizerData = Array(20).fill(null).map((_, i) => {
            const name = generateRandomName();
            return {
                name,
                email: generateRandomEmail(name, `org${i}`),
                password: hashedPassword,
                role: 'organizer'
            };
        });

        const participantData = Array(100).fill(null).map((_, i) => {
            const name = generateRandomName();
            return {
                name,
                email: generateRandomEmail(name, `part${i}`),
                password: hashedPassword,
                role: 'participant'
            };
        });

        // Bulk insert users
        console.log('Creating users...');
        const [organizers, participants] = await Promise.all([
            User.insertMany(organizerData),
            User.insertMany(participantData)
        ]);

        // Prepare event data
        const eventData = Array(50).fill(null).map((_, i) => {
            const startDate = generateRandomDate(new Date('2025-03-01'), new Date('2025-12-31'));
            const endDate = new Date(startDate.getTime() + (Math.random() * 7 * 24 * 60 * 60 * 1000));
            
            return {
                title: generateRandomEventTitle(i),
                description: `Event ${i + 1} description`,
                startDate,
                endDate,
                location: generateRandomLocation(),
                capacity: Math.floor(Math.random() * 100) + 50,
                organizer: organizers[i % organizers.length]._id,
                tasks: Array(3).fill(null).map((_, j) => ({
                    title: `Task ${j + 1}`,
                    description: 'Complete this task',
                    dueDate: generateRandomDate(startDate, endDate),
                    points: Math.floor(Math.random() * 30) + 10
                })),
                status: startDate > new Date() ? 'upcoming' : 'ongoing'
            };
        });

        // Bulk insert events
        console.log('Creating events...');
        const events = await Event.insertMany(eventData);

        // Prepare announcement data
        const announcementData = Array(100).fill(null).map((_, i) => ({
            title: `Announcement ${i + 1}`,
            content: 'Important information about the event',
            priority: ['low', 'medium', 'high'][i % 3],
            event: events[i % events.length]._id,
            author: organizers[i % organizers.length]._id
        }));

        // Bulk insert announcements
        console.log('Creating announcements...');
        await Announcement.insertMany(announcementData);

        // Bulk update participants with events and progress
        console.log('Assigning events and progress to participants...');
        const participantUpdates = participants.map(participant => {
            const numEvents = Math.floor(Math.random() * 3) + 1;
            const assignedEvents = events
                .sort(() => 0.5 - Math.random())
                .slice(0, numEvents);

            return {
                updateOne: {
                    filter: { _id: participant._id },
                    update: {
                        $set: {
                            events: assignedEvents.map(e => e._id),
                            progress: assignedEvents.map(event => ({
                                event: event._id,
                                completedTasks: event.tasks
                                    .filter(() => Math.random() > 0.5)
                                    .map(task => task._id),
                                status: ['not-started', 'in-progress', 'completed'][Math.floor(Math.random() * 3)]
                            }))
                        }
                    }
                }
            };
        });

        await User.bulkWrite(participantUpdates);

        console.log('\nDatabase seeded successfully!');
        console.log('\nSummary:');
        console.log(`- Created ${organizerData.length} organizers`);
        console.log(`- Created ${participantData.length} participants`);
        console.log(`- Created ${eventData.length} events`);
        console.log(`- Created ${announcementData.length} announcements`);
        console.log('\nTest Account (password: password123):');
        console.log(`Organizer - Email: ${organizerData[0].email}`);
        console.log(`Participant - Email: ${participantData[0].email}`);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
