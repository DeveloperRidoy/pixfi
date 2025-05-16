import { Model, model, models } from "mongoose";
import { ICampaign } from "@/types/campaign.types";
import campaignSchema from "../schemas/user/campaignSchema";

const Campaign =
  (models.Campaign as Model<ICampaign>) ||
  model<ICampaign>("Campaign", campaignSchema);

export default Campaign;
