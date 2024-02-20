import mongoose from 'mongoose'

const modulePermissionsSchema = new mongoose.Schema(
  {
    id: String,
    dashboard: Object,
    posts: Object,
    categories: Object,
    tags: Object,
    images: Object,
    users: Object,
    roles: Object,
    draft: Object,
    clientUser: Object,
    inActive: Boolean,
  },
  { timestamps: true }
);

const ModulePermissions =
  mongoose.models?.modulePermissions ||
  mongoose.model("modulePermissions", modulePermissionsSchema);
  export default ModulePermissions;
