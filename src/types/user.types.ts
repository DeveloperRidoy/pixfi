export interface IUserPhoto {
  alt: string;
  url: string;
}

export enum EUserRole {
  ADMIN = "admin",
  USER = "user",
  ORGANIZER = "organizer",
}

export enum EAuthStatus {
  UNAUTHENTICATED = "unauthenticated",
  AUTHENTICATED = "authenticated",
  ANY = "any",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role?: EUserRole;
  password?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  phone?: number;
  dateOfBirth?: Date | string;
  photo?: IUserPhoto;
  bio?: string;
  disabled?: boolean;
  subscribeToEmails: boolean;

  // PixFi-specific
  walletAddress?: string;
  campaignsCreated?: string[]; // campaign IDs
  tilesPlaced?: number;
  totalDonated?: number;
}

export type TUserDocument = IUser & Document;
