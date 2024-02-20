import mongoose, {Schema} from 'mongoose'

const rolesSchema = new mongoose.Schema(
  {
    id: String,
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    inActive: Boolean,
  },
  { timestamps: true },
);

const Roles =  mongoose.models?.Roles || mongoose.model("Roles", rolesSchema);
export default Roles;

