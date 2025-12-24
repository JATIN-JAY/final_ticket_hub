import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const sampleEvents = [
  {
    title: "Summer Music Festival 2024",
    description:
      "Join us for the biggest summer music festival featuring top artists from around the world. Experience unforgettable performances under the stars with amazing light shows and world-class sound systems.",
    location: "Central Park, New York",
    date: new Date("2024-07-15"),
    time: "18:00",
    posterImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    rows: 10,
    columns: 12,
    totalSeats: 120,
    availableSeats: 120,
    pricePerSeat: 75,
    category: "concert",
    seatMap: Array(10)
      .fill(null)
      .map(() => Array(12).fill("available")),
  },
  {
    title: "Tech Conference 2024",
    description:
      "Annual technology conference featuring keynotes from industry leaders, interactive workshops, product demos, and unparalleled networking opportunities with tech professionals.",
    location: "Convention Center, San Francisco",
    date: new Date("2024-09-20"),
    time: "09:00",
    posterImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    rows: 15,
    columns: 20,
    totalSeats: 300,
    availableSeats: 300,
    pricePerSeat: 150,
    category: "conference",
    seatMap: Array(15)
      .fill(null)
      .map(() => Array(20).fill("available")),
  },
  {
    title: "Broadway Musical: The Phantom",
    description:
      "Experience the timeless classic with stunning performances, elaborate costumes, and beautiful music. A masterpiece of theater that has captivated audiences for decades.",
    location: "Broadway Theater, New York",
    date: new Date("2024-08-10"),
    time: "19:30",
    posterImage:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800",
    rows: 12,
    columns: 15,
    totalSeats: 180,
    availableSeats: 180,
    pricePerSeat: 120,
    category: "theater",
    seatMap: Array(12)
      .fill(null)
      .map(() => Array(15).fill("available")),
  },
  {
    title: "NBA Finals Game 7",
    description:
      "Witness history in the making! The championship-deciding game with the best teams in basketball. Don't miss this epic showdown that will determine the champion.",
    location: "Staples Center, Los Angeles",
    date: new Date("2024-06-20"),
    time: "20:00",
    posterImage:
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800",
    rows: 20,
    columns: 25,
    totalSeats: 500,
    availableSeats: 500,
    pricePerSeat: 250,
    category: "sports",
    seatMap: Array(20)
      .fill(null)
      .map(() => Array(25).fill("available")),
  },
  {
    title: "Comedy Night Live",
    description:
      "Laugh out loud with the best comedians in the business. A night of non-stop entertainment featuring stand-up comedy, improvisations, and special guest appearances.",
    location: "Comedy Club, Chicago",
    date: new Date("2024-07-05"),
    time: "21:00",
    posterImage:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800",
    rows: 8,
    columns: 10,
    totalSeats: 80,
    availableSeats: 80,
    pricePerSeat: 40,
    category: "other",
    seatMap: Array(8)
      .fill(null)
      .map(() => Array(10).fill("available")),
  },
  {
    title: "Jazz Evening with Legends",
    description:
      "An intimate evening with jazz legends. Enjoy smooth melodies, sophisticated arrangements, and the magical atmosphere of live jazz performance.",
    location: "Blue Note Jazz Club, New York",
    date: new Date("2024-08-25"),
    time: "20:30",
    posterImage:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800",
    rows: 6,
    columns: 8,
    totalSeats: 48,
    availableSeats: 48,
    pricePerSeat: 65,
    category: "concert",
    seatMap: Array(6)
      .fill(null)
      .map(() => Array(8).fill("available")),
  },
  {
    title: "World Cup Final 2024",
    description:
      "The most anticipated football match of the year! Watch the world's best teams compete for ultimate glory in this thrilling championship finale.",
    location: "Wembley Stadium, London",
    date: new Date("2024-12-18"),
    time: "15:00",
    posterImage:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
    rows: 25,
    columns: 30,
    totalSeats: 750,
    availableSeats: 750,
    pricePerSeat: 300,
    category: "sports",
    seatMap: Array(25)
      .fill(null)
      .map(() => Array(30).fill("available")),
  },
  {
    title: "Art & Design Symposium",
    description:
      "Explore the intersection of art and technology. Features presentations from renowned designers, interactive installations, and hands-on workshops.",
    location: "Museum of Modern Art, New York",
    date: new Date("2024-10-15"),
    time: "10:00",
    posterImage:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
    rows: 10,
    columns: 15,
    totalSeats: 150,
    availableSeats: 150,
    pricePerSeat: 85,
    category: "conference",
    seatMap: Array(10)
      .fill(null)
      .map(() => Array(15).fill("available")),
  },
];

const seedData = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await Event.deleteMany();
    await User.deleteMany();

    console.log("🗑️  Cleared existing data");

    // Create sample admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      phone: "+1234567890",
      role: "admin",
    });

    console.log("👤 Created admin user");

    // Create sample regular users
    const user1 = await User.create({
      name: "John Doe",
      email: "user@example.com",
      password: "user123",
      phone: "+1234567890",
    });

    const user2 = await User.create({
      name: "Jane Smith",
      email: "jane@example.com",
      password: "jane123",
      phone: "+1987654321",
    });

    console.log("👥 Created sample users");

    // Insert sample events
    const events = await Event.insertMany(sampleEvents);

    console.log(`🎉 Created ${events.length} sample events`);
    console.log("\n✅ Database seeded successfully!");
    console.log("\n📧 Test Credentials:");
    console.log("   Admin: admin@example.com / admin123");
    console.log("   User1: user@example.com / user123");
    console.log("   User2: jane@example.com / jane123");
    console.log("\n🎟️  Sample Events Created:");
    events.forEach((event) => {
      console.log(`   - ${event.title} (${event.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
