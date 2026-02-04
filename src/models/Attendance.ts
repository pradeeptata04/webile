import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
    employeeId: mongoose.Types.ObjectId;
    date: Date;
    status: 'present' | 'absent';
    inTime?: string;
    outTime?: string;
    markedBy: mongoose.Types.ObjectId;
}

const AttendanceSchema: Schema = new Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
    inTime: { type: String, default: '' },
    outTime: { type: String, default: '' },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

// Compound index to ensure one record per employee per day
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
export default Attendance;
