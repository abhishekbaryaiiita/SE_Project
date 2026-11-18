
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

import User from '../models/User.js';
import connectDB from '../config/db.js';
import { readData, writeData } from './dataStore.js';
import { cities, transport, hotels } from './seedData.js';

const email = (
  process.env.ADMIN_EMAIL || 'admin@routerescue.local'
).trim().toLowerCase();

const password = process.env.ADMIN_PASSWORD || 'Admin@123';

if (!email || !password) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required.');
}

await connectDB();

try {
  // Create or update the configured admin account in MongoDB.
  const passwordHash = await bcrypt.hash(password, 12);

  let admin = await User.findOne({ email });

  if (admin) {
    admin.name = 'RouteRescue Admin';
    admin.phone = admin.phone || '9999999999';
    admin.passwordHash = passwordHash;
    admin.role = 'admin';

    await admin.save();

    console.log(`Admin account updated: ${email}`);
  } else {
    await User.create({
      id: `admin-${randomUUID()}`,
      name: 'RouteRescue Admin',
      email,
      phone: '9999999999',
      passwordHash,
      role: 'admin',
      preferences: {}
    });

    console.log(`Admin account created: ${email}`);
  }

  // Seed static JSON data only when the respective files are empty.
  const staticData = [
    ['cities', cities],
    ['transport', transport],
    ['hotels', hotels]
  ];

  for (const [name, data] of staticData) {
    const existing = await readData(name);

    if (existing.length === 0 && data.length > 0) {
      await writeData(name, data);
      console.log(`Seeded ${name}`);
    }
  }

  console.log('RouteRescue seeding completed successfully.');
  const { initDb } = await import('./initDb.js');
  await initDb();
} catch (error) {
  console.error('Seeding failed:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
