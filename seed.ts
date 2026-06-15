import dbConnect from './src/lib/dbConnect';
import User from './src/models/User';
import bcrypt from 'bcryptjs';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

async function seed() {
  await dbConnect();

  const employeeEmail = "emp@jisnudigital.com";
  const clientEmail = "client@example.com";

  // Check if employee exists
  const existingEmp = await User.findOne({ email: employeeEmail });
  if (!existingEmp) {
    const hashedPassword = await bcrypt.hash("Jisnu123!", 12);
    await User.create({
      email: employeeEmail,
      password: hashedPassword,
      name: "Jisnu Employee",
      role: "employee",
    });
    console.log("Created employee account:", employeeEmail);
  }

  // Check if client exists
  const existingClient = await User.findOne({ email: clientEmail });
  if (!existingClient) {
    const hashedPassword = await bcrypt.hash("Client123!", 12);
    await User.create({
      email: clientEmail,
      password: hashedPassword,
      name: "Example Client",
      role: "client",
      clientId: "EXAMPLE_CLIENT_ID",
    });
    console.log("Created client account:", clientEmail);
  }

  console.log("Seeding complete. You can now log in.");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
