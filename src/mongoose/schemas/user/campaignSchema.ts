import { Schema } from "mongoose";
import { TCampaignDocument } from "@/types/campaign.types";

const TilePlacementSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    color: { type: String, required: true },
    donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    emoji: { type: String },
    placedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const LeaderboardEntrySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tilesPlaced: { type: Number, required: true },
    amountDonated: { type: Number, required: true },
    badge: { type: String },
  },
  { _id: false }
);

const campaignSchema = new Schema<TCampaignDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageTemplateUrl: { type: String },

    gridSize: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },

    donationGoal: { type: Number, required: true },
    tilePrice: { type: Number, required: true },

    settings: {
      cooldown: { type: Number },
      lockDuration: { type: Number },
      restrictedZones: [
        {
          x: Number,
          y: Number,
          width: Number,
          height: Number,
        },
      ],
      priorityZones: [
        {
          x: Number,
          y: Number,
          width: Number,
          height: Number,
        },
      ],
    },

    refundPolicy: {
      type: String,
      enum: ["full", "partial", "none"],
      required: true,
    },

    escrowEnabled: { type: Boolean, default: true },

    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },

    createdAt: { type: Date, default: Date.now },
    endsAt: { type: Date },

    canvasPreviewUrl: { type: String },
    metadataCID: { type: String },

    currentFunds: { type: Number, default: 0 },
    contributorsCount: { type: Number, default: 0 },

    tilePlacements: [TilePlacementSchema],
    leaderboard: [LeaderboardEntrySchema],

    isCompleted: { type: Boolean, default: false },
    nftMinted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default campaignSchema;
