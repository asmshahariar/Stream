import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index to automatically expire visitors after 5 minutes of inactivity (for "online" count)
// But wait, the user wants "Today's Visitors" and "Total Visitors", so we shouldn't delete them.
// Instead, we will keep them and query by lastActive for "online".

export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
