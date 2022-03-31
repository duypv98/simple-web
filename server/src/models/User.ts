import { Document, model, Model, Schema } from "mongoose";
import User from "../../../models/User";

export const userModelName = 'User';

export interface UserDocument extends User, Document {
  _id: string;
}

const userSchema = new Schema<UserDocument>({
  name: String,
  email: String,
  password: String
}, {
  versionKey: false,
  timestamps: true
});

const UserModel = model(userModelName, userSchema);

export default UserModel;