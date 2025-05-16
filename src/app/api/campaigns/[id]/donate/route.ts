import connectDB from "@/lib/server/connectDB";
import Campaign from "@/mongoose/models/Campaign";
import getUser from "@/lib/server/getUser";
import { ECookieName } from "@/types/api.types";
import AppResponse from "@/lib/server/AppResponse";
import catchAsync from "@/lib/server/catchAsync";
import { cookies } from "next/headers";

export const POST = catchAsync(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    await connectDB();

    // extract id
    const { id } = await params;

    const user = await getUser((await cookies()).get(ECookieName.AUTH)?.value);

    if (!user) {
      return new AppResponse(401, "Unauthorized");
    }

    const { x, y, color } = await req.json();

    if (x === undefined || y === undefined || !color) {
      return new AppResponse(400, "Missing pixel data");
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return new AppResponse(404, "Campaign not found");
    }

    const newTile = {
      x,
      y,
      color,
      donor: user,
      placedAt: new Date(),
    };

    campaign.tilePlacements.push(newTile);
    campaign.currentFunds += campaign.tilePrice;
    campaign.contributorsCount += 1;

    // Optionally update leaderboard
    const existingEntry = campaign.leaderboard.find(
      (entry) => entry.user.toString() === user._id.toString()
    );

    if (existingEntry) {
      existingEntry.tilesPlaced += 1;
      existingEntry.amountDonated += campaign.tilePrice;
    } else {
      campaign.leaderboard.push({
        user: user,
        tilesPlaced: 1,
        amountDonated: campaign.tilePrice,
      });
    }

    await campaign.save();
    await campaign.populate("leaderboard.user"); // populate user data in leaderboard

    return new AppResponse(200, "Donation recorded", { doc: campaign });
  }
);
