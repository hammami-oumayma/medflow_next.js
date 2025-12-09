import mongoose, { Schema } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },

    medications: [
      {
        name: String,
        dosage: String,
        duration: String,
      },
    ],

    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);
