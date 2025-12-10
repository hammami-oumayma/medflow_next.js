import mongoose, { Schema, models } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    medicines: [
      {
        name: String,
        dosage: String,
      },
    ],
    notes: String,

    // 🟩 AJOUT ICI
    amount: {
      type: Number,
      required: false,
      default: 0,
    },
    status: {
      type: String,
      enum: ["non-payée", "payée", "en attente"],
      default: "non-payée",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);
