import mongoose from 'mongoose';

const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    lastName: { type: String, required: true, lowercase: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Admins', adminSchema);
