import mongoose from 'mongoose';

const { Schema } = mongoose;

const timesheetSchema = new Schema(
  {
    description: { type: String, requiered: true },
    date: { type: Date, requiered: true },
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
    hours: { type: Number, requiered: true },
    project: { type: Schema.Types.ObjectId, ref: 'Projects' },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
  },
  { timestamps: true },
);

export default mongoose.model('Timesheet', timesheetSchema);
