import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Flight from './models/Flight.js';
import Booking from './models/Booking.js';

dotenv.config();

connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await Flight.deleteMany();
        await Booking.deleteMany();

        const adminUser = new User({
            name: 'Admin',
            email: 'admin@skyreserve.com',
            password: 'admin123', // Will be hashed by pre-save middleware
            role: 'admin',
        });

        const standardUser = new User({
            name: 'Demo User',
            email: 'user@skyreserve.com',
            password: 'user123', // Will be hashed by pre-save middleware
            role: 'user',
        });

        await adminUser.save();
        await standardUser.save();

        const cities = ['Hyderabad', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Goa'];
        const flights = [];

        for (let i = 1; i <= 50; i++) {
            const fromCity = cities[Math.floor(Math.random() * cities.length)];
            let toCity = cities[Math.floor(Math.random() * cities.length)];
            while (fromCity === toCity) {
                toCity = cities[Math.floor(Math.random() * cities.length)];
            }

            const depDate = new Date();
            depDate.setDate(depDate.getDate() + Math.floor(Math.random() * 30)); // Random day within next 30 days
            depDate.setHours(1 + Math.floor(Math.random() * 22), Math.floor(Math.random() * 60), 0); // Random hour/minute

            const arrDate = new Date(depDate);
            arrDate.setHours(arrDate.getHours() + Math.floor(Math.random() * 3) + 1); // Flight duration 1 to 4 hours

            const totalSeats = 100 + Math.floor(Math.random() * 100);

            flights.push({
                flightNumber: `SR${100 + i}`,
                airline: 'SkyReserve Airlines',
                from: fromCity,
                to: toCity,
                departureTime: depDate,
                arrivalTime: arrDate,
                totalSeats: totalSeats,
                availableSeats: totalSeats,
                price: 2500 + Math.floor(Math.random() * 6500), // Random price between 2500 and 9000
                status: 'Scheduled',
            });
        }

        await Flight.insertMany(flights);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
