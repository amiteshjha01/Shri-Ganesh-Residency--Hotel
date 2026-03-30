import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Room from '@/lib/models/Room';
import { ROOMS } from '@/lib/constants';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-this';

const DEFAULT_USERS = [
  {
    email: 'sriganeshresidencytpt@gmail.com',
    password: 'Admin@sgr.com#123456',
    role: 'admin'
  },
  {
    email: 'superadmin@sgr.com',
    password: 'Admin@171018',
    role: 'super_admin'
  }
];

async function seedInitialData() {
  // Seed Users
  for (const user of DEFAULT_USERS) {
    let dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await new User({ ...user, password: hashedPassword }).save();
    }
  }

  // Seed Rooms
  for (const room of ROOMS) {
    const exists = await Room.findOne({ roomId: room.id.toString() });
    if (!exists) {
      await new Room({
        roomId: room.id.toString(),
        name: room.name,
        isAvailable: true,
        unavailableDates: []
      }).save();
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('--- LOGIN PIPELINE START ---');
    
    console.log('Step 1: Connecting to Database...');
    const db = await connectDB();
    if (!db) {
       console.error('Database connection failed: MONGO_URI likely missing');
       return NextResponse.json({ message: 'Database connectivity absent' }, { status: 500 });
    }
    console.log('Step 1: Successful');
    
    console.log('Step 2: Executing Seed Lifecycle...');
    await seedInitialData();
    console.log('Step 2: Successful');
    
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      console.warn('Login attempt aborted: Field requirements unmet');
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    console.log(`Step 3: Identity Search for: ${email}`);
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.error(`Step 3: Failure - User ${email} not found in directory`);
      return NextResponse.json({ message: 'Invalid credentials - identity unknown' }, { status: 401 });
    }
    console.log('Step 3: Successful');

    console.log('Step 4: Cryptographic Key Verification...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error(`Step 4: Failure - Key mismatch for ${email}`);
      return NextResponse.json({ message: 'Invalid credentials - key mismatch' }, { status: 401 });
    }
    console.log('Step 4: Successful');

    console.log('Step 5: Generating Security Token...');
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('Step 5: Successful');

    const response = NextResponse.json({ 
      success: true, 
      user: { email: user.email, role: user.role } 
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: true, // Force secure in prod
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    });

    console.log('--- LOGIN PIPELINE TERMINATED SUCCESS ---');
    return response;

  } catch (error: any) {
    console.error('--- CRITICAL FAILURE IN LOGIN PIPELINE ---');
    console.error('Origin Error:', error.message);
    console.error('Stack Trace:', error.stack);
    return NextResponse.json({ 
      message: 'Internal server failure during authentication', 
      error: error.message 
    }, { status: 500 });
  }
}
