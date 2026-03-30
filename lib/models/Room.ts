import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  totalRooms: { type: Number, default: 5 },
  availableRooms: { type: Number, default: 5 },
  isAvailable: { type: Boolean, default: true }
});

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
