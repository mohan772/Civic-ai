const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');
const Complaint = require('./models/Complaint');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_ai';

async function purgeAllTickets() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Delete all documents from the Ticket collection
    const ticketResult = await Ticket.deleteMany({});
    console.log(`Deleted ${ticketResult.deletedCount} tickets from database.`);

    // 2. Clear ticket-related fields from all complaints so they can be re-accepted if needed
    const complaintResult = await Complaint.updateMany(
      {}, 
      { 
        $set: { status: 'Pending' }, 
        $unset: { ticketId: "", ticketStatus: "" } 
      }
    );
    console.log(`Reset ${complaintResult.modifiedCount} complaints to Pending status.`);

    console.log('Database cleanup complete. You can now test the manual Accept workflow.');
    process.exit(0);
  } catch (err) {
    console.error('Error during purge:', err.message);
    process.exit(1);
  }
}

purgeAllTickets();
