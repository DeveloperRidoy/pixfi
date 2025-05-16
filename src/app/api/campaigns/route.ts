import AppResponse from "@/lib/server/AppResponse";
import catchAsync from "@/lib/server/catchAsync";
import connectDB from "@/lib/server/connectDB";
import Campaign from "@/mongoose/models/Campaign";
import { guard } from "@/lib/server/middleware/guard";
import { EUserRole } from "@/types/user.types";
import AppError from "@/lib/server/AppError";
import { uploadImage } from "@/lib/server/s3UploadHandler";

// GET /api/campaigns
export const GET = catchAsync(async () => {
  // connect db
  await connectDB();

  // Fetch campaigns from the database
  const campaigns = await Campaign.find({}).populate("organizer");

  // Return the campaigns in the response
  return new AppResponse(200, "Campaigns fetched successfully", { campaigns });
});

// app/api/campaigns/route.ts

export const POST = catchAsync(async (req) => {
  // Authenticate & authorize
  const user = await guard(req);
  if (user.role !== EUserRole.ADMIN && user.role !== EUserRole.ORGANIZER) {
    throw new AppError(403, "Forbidden");
  }

  // Connect DB
  await connectDB();

  // Get form data
  const formData = await req.formData();
  const data = JSON.parse(formData.get("data") as string);
  const imageFile = formData.get("image") as File;

  // Create DB record
  const campaign = await Campaign.create({
    title: data.title,
    description: data.description,
    donationGoal: data.donationGoal,
    tilePrice: data.tilePrice,
    gridSize: data.gridSize,
    refundPolicy: data.refundPolicy,
    escrowEnabled: data.escrowEnabled,
    settings: {
      cooldown: data.cooldown,
      lockDuration: data.lockDuration,
    },
    organizer: user._id,
    imageTemplateUrl: "/",
  });

  // handle image upload if provided
  if (imageFile && imageFile.size > 0) {
    const url = await uploadImage({
      file: imageFile,
      folder: `campaigns/${campaign._id}/image`,
      width: 700,
    });

    // Update campaign with image URL
    campaign.imageTemplateUrl = url;
    await campaign.save();
    await campaign.populate("leaderboard.user"); // populate user data in leaderboard
  }

  // Return response
  return new AppResponse(201, "Campaign created successfully", {
    doc: campaign,
  });
});
