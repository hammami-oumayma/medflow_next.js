import mongoose, { Schema, models } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medications: [
      {
        name: String,
        dosage: String,
        duration: String,
      },
    ],

    notes: String,

    amount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["non-payée", "payée", "en attente"],
      default: "non-payée",
    },
  },
  { timestamps: true }
);

export default models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);
