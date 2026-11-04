import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

export const Permission = mongoose.model("Permission", permissionSchema);

