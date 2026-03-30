import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || "";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db();
    const users = database.collection('users');
    const allUsers = await users.find({}).toArray();
    console.log("Database Users:");
    allUsers.forEach(u => {
      console.log(`Email: ${u.email}, Username: ${u.username}, Role: ${u.role}`);
    });
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
