import mongoose, { Schema } from "mongoose";

const InvoiceSchema = new Schema(
  {
    prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },

    description: { type: String, default: "Consultation & prescription" },

    status: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);
