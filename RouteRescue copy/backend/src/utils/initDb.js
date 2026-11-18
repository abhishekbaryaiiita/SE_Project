import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

import User from '../models/User.js';
import City from '../models/City.js';
import Transport from '../models/Transport.js';
import Hotel from '../models/Hotel.js';
import Journey from '../models/Journey.js';
import Feedback from '../models/Feedback.js';
import JourneyRequest from '../models/JourneyRequest.js';
import { cities as seedCities, transport as seedTransport, hotels as seedHotels } from './seedData.js';
import { readData, writeData } from './dataStore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CITY_COORDINATES = {
  Mumbai: [19.076, 72.8777],
  Pune: [18.5204, 73.8567],
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Vadodara: [22.3072, 73.1812],
  Delhi: [28.6139, 77.209],
  Jaipur: [26.9124, 75.7873],
  Udaipur: [24.5854, 73.7125],
  Indore: [22.7196, 75.8577],
  Bhopal: [23.2599, 77.4126],
  Nagpur: [21.1458, 79.0882],
  Hyderabad: [17.385, 78.4867],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Lucknow: [26.8467, 80.9462],
  Prayagraj: [25.4358, 81.8463],
  Varanasi: [25.3176, 82.9739],
  Agra: [27.1767, 78.0081],
  Goa: [15.2993, 74.124]
};

export async function initDb() {
  try {
    // 1. Ensure Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@routerescue.local').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await User.create({
        id: `admin-${randomUUID()}`,
        name: 'RouteRescue Admin',
        email: adminEmail,
        phone: '9999999999',
        passwordHash,
        role: 'admin',
        preferences: {
          preferredMode: 'Any',
          budgetRange: 'Moderate',
          journeyType: 'Balanced',
          accommodationType: 'Any'
        }
      });
      console.log(`[RouteRescue] Admin account created: ${adminEmail}`);
    }

    // 2. Ensure Cities
    const cityCount = await City.countDocuments();
    if (cityCount === 0) {
      let fileCities = [];
      try {
        fileCities = await readData('cities');
      } catch (err) {
        fileCities = [];
      }

      const sourceCities = fileCities.length >= seedCities.length ? fileCities : seedCities;
      const operations = sourceCities.map((city, idx) => {
        const coords = CITY_COORDINATES[city.name] || [city.latitude || 20, city.longitude || 78];
        return {
          updateOne: {
            filter: { name: city.name },
            update: {
              $set: {
                id: city.id || `C${idx + 1}`,
                name: city.name,
                state: city.state || '',
                country: city.country || 'India',
                latitude: city.latitude || coords[0],
                longitude: city.longitude || coords[1],
                available: city.available !== false
              }
            },
            upsert: true
          }
        };
      });

      if (operations.length) {
        await City.bulkWrite(operations);
        console.log(`[RouteRescue] Seeded ${operations.length} cities to MongoDB.`);
      }

      // Also ensure cities.json has these cities
      const allDbCities = await City.find().lean();
      await writeData('cities', allDbCities);
    }

    // 3. Ensure Transport
    const transportCount = await Transport.countDocuments();
    if (transportCount === 0) {
      let fileTransport = [];
      try {
        fileTransport = await readData('transport');
      } catch {
        fileTransport = [];
      }
      const sourceTransport = fileTransport.length >= seedTransport.length ? fileTransport : seedTransport;
      const operations = sourceTransport.map((t, idx) => ({
        updateOne: {
          filter: { id: t.id || `T-${idx + 1}` },
          update: {
            $set: {
              id: t.id || `T-${idx + 1}`,
              from: t.from,
              to: t.to,
              mode: t.mode,
              service: t.service,
              departure: t.departure,
              arrival: t.arrival,
              durationHours: Number(t.durationHours) || 1,
              distanceKm: Number(t.distanceKm) || 100,
              farePerPerson: Number(t.farePerPerson) || 500,
              available: t.available !== false,
              days: t.days || ['Daily']
            }
          },
          upsert: true
        }
      }));

      if (operations.length) {
        await Transport.bulkWrite(operations);
        console.log(`[RouteRescue] Seeded ${operations.length} transport connections to MongoDB.`);
      }
    }

    // 4. Ensure Hotels
    const hotelCount = await Hotel.countDocuments();
    if (hotelCount === 0) {
      let fileHotels = [];
      try {
        fileHotels = await readData('hotels');
      } catch {
        fileHotels = [];
      }
      const sourceHotels = fileHotels.length >= seedHotels.length ? fileHotels : seedHotels;
      const operations = sourceHotels.map((h, idx) => ({
        updateOne: {
          filter: { id: h.id || `H-${idx + 1}` },
          update: {
            $set: {
              id: h.id || `H-${idx + 1}`,
              name: h.name,
              city: h.city,
              pricePerNight: Number(h.pricePerNight) || 1200,
              rating: Number(h.rating) || 4.0,
              type: h.type || 'Standard',
              facilities: h.facilities || ['Wi-Fi', 'Air conditioning'],
              description: h.description || `Comfortable stay in ${h.city}.`,
              available: h.available !== false
            }
          },
          upsert: true
        }
      }));

      if (operations.length) {
        await Hotel.bulkWrite(operations);
        console.log(`[RouteRescue] Seeded ${operations.length} hotels to MongoDB.`);
      }
    }

    // 5. Ensure Sample Journeys if available
    const journeyCount = await Journey.countDocuments();
    if (journeyCount === 0) {
      try {
        const fileJourneys = await readData('journeys');
        if (Array.isArray(fileJourneys) && fileJourneys.length > 0) {
          const ops = fileJourneys.map(j => ({
            updateOne: {
              filter: { id: j.id },
              update: { $set: j },
              upsert: true
            }
          }));
          await Journey.bulkWrite(ops);
          console.log(`[RouteRescue] Seeded ${ops.length} journeys to MongoDB.`);
        }
      } catch {
        // Optional
      }
    }

    // 6. Ensure Feedback
    const feedbackCount = await Feedback.countDocuments();
    if (feedbackCount === 0) {
      try {
        const fileFeedback = await readData('feedback');
        if (Array.isArray(fileFeedback) && fileFeedback.length > 0) {
          const ops = fileFeedback.map(f => ({
            updateOne: {
              filter: { id: f.id },
              update: { $set: f },
              upsert: true
            }
          }));
          await Feedback.bulkWrite(ops);
        }
      } catch {
        // Optional
      }
    }

    console.log('[RouteRescue] Database verified and synchronized.');
  } catch (error) {
    console.error('[RouteRescue] Database initialization warning:', error.message);
  }
}
