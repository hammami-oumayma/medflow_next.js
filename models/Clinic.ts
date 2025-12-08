import mongoose, { Schema } from "mongoose";

const ClinicSchema = new Schema(
  {
    name: { type: String, required: true },
    address: String,
    phone: String,
    email: String,
  },
  { timestamps: true }
);

export default mongoose.models.Clinic || mongoose.model("Clinic", ClinicSchema);
