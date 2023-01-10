import mongoose from 'mongoose';

const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
    clientName: { type: String, required: true },
    employees: [{
      employeeId: { type: Schema.Types.ObjectId, required: true, ref: 'Employee' },
      role: { type: String, enum: ['DEV', 'QA', 'PM', 'TL'], required: true },
      rate: { type: Number, required: true },
    }],
    status: { type: Boolean, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Projects', projectSchema);
