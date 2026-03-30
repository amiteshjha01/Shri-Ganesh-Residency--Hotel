import mongoose from 'mongoose';

const AddonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  roomName: { type: String, required: true },
  roomId: { type: String, required: true }, // Map to 'deluxe', etc.
  totalAmount: { type: Number, required: true },
  tokenAmount: { type: Number, default: 500 },
  remainingAmount: { type: Number, required: true },
  addons: [AddonSchema],
  addonTotal: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true }, // totalAmount + addonTotal
  paymentStatus: { type: String, enum: ['token_paid', 'fully_paid', 'pending'], default: 'token_paid' },
  bookingStatus: { type: String, enum: ['confirmed', 'cancelled', 'checked_in', 'checked_out'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
