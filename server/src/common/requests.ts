import { Request } from "express";

export type Credentials = {
  userId: string;
  userName: string;
}

export interface AuthRequest extends Request {
  credentials?: Credentials
}