import { Document } from "mongoose";
import { IUser } from "./user.types";

export interface ICampaign {
  _id: string;
  title: string;
  description: string;
  imageTemplateUrl?: string; // stored in IPFS
  gridSize: {
    width: number;
    height: number;
  };
  donationGoal: number; // total in USD
  tilePrice: number; // e.g. $1 per tile
  settings?: {
    cooldown?: number;
    lockDuration?: number;
    restrictedZones?: { x: number; y: number; width: number; height: number }[];
    priorityZones?: { x: number; y: number; width: number; height: number }[];
  };
  refundPolicy: "full" | "partial" | "none";
  escrowEnabled: boolean;
  organizer: IUser; // full user object
  createdAt: Date;
  endsAt?: Date;
  canvasPreviewUrl?: string;
  metadataCID?: string; // IPFS hash
  currentFunds: number;
  contributorsCount: number;
  tilePlacements: ITilePlacement[];
  leaderboard: ILeaderboardEntry[];
  isCompleted: boolean;
  nftMinted: boolean;
}

// embedded tile placement history
export interface ITilePlacement {
  x: number;
  y: number;
  color: string;
  donor: IUser; // full user object
  message?: string;
  emoji?: string;
  placedAt: Date;
}

// donor leaderboard entries
export interface ILeaderboardEntry {
  user: IUser;
  tilesPlaced: number;
  amountDonated: number;
  badge?: string;
}

export type TCampaignDocument = ICampaign & Document;
