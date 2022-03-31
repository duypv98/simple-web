import { Document, model, Model, Schema, Types } from "mongoose";
import UserToken from "../../../models/UserToken";
import { userModelName } from "./User";

export const userTokenModelName = 'UserToken';

export interface UserTokenDocument extends UserToken, Document {
  _id: string;
}

const userTokenSchema = new Schema<UserTokenDocument>({
  userId: {
    type: Types.ObjectId,
    ref: userModelName
  },
  accessToken: String,
  refreshToken: String
}, {
  versionKey: false,
  timestamps: true
});

const UserTokenModel = model(userTokenModelName, userTokenSchema);

export default UserTokenModel;