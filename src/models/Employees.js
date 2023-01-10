import mongoose from 'mongoose';

const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    lastName: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    projects: [
      { type: Schema.Types.ObjectId, ref: 'Projects' },
    ],
    status: { type: Boolean, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Employee', employeeSchema);
