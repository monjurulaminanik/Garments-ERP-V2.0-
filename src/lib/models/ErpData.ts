import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { ErpData } from "@/lib/types";

/**
 * We deliberately store the ENTIRE ERP dataset as a single document with a
 * `Mixed` payload rather than modelling every collection separately. This
 * keeps the data model trivial to evolve (new modules just add a new array
 * to the JSON blob) and keeps read/write to a single round trip, which is
 * ideal for a small-factory ERP running on Vercel serverless functions.
 */
export interface ErpDataDocument extends Document {
  key: string;
  data: ErpData;
  updatedAt: Date;
  createdAt: Date;
}

const ErpDataSchema = new Schema<ErpDataDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main",
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
    collection: "erp_data",
  }
);

export const ErpDataModel: Model<ErpDataDocument> =
  (mongoose.models.ErpData as Model<ErpDataDocument>) ||
  mongoose.model<ErpDataDocument>("ErpData", ErpDataSchema);

export default ErpDataModel;
