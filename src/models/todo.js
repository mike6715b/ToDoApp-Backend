import * as mongoose from "mongoose";
import schema_pkg from "mongoose";

const { Schema } = schema_pkg;

const todoSchema = new Schema(
  {
    created_by_id: { type: String, required: true },
    created_by_username: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default schema_pkg.model("Todo", todoSchema);
