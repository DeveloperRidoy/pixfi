import { ICampaign } from "@/types/campaign.types";
import { IUser } from "@/types/user.types";
import connectDB from "@/lib/server/connectDB";
import getUser from "@/lib/server/getUser";
import stringifyAndParse from "@/lib/stringifyAndParse";
import Campaign from "@/mongoose/models/Campaign";
import { ECookieName } from "@/types/api.types";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";

const PixelCanvas = dynamic(() => import("@/components/PixelCanvas/index"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <p className="text-gray-500">Loading canvas...</p>
    </div>
  ),
});

type CampaignPageProps = {
  user?: IUser | null;
  campaign: ICampaign;
};

export default function CampaignPage({
  campaign: initialCampaign,
}: Readonly<CampaignPageProps>) {
  const [campaign, setCampaign] = useState<ICampaign>(initialCampaign);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>

      <p className="text-gray-700 mb-6">{campaign.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <strong>Goal:</strong> ${campaign.donationGoal.toLocaleString()}
        </div>
        <div>
          <strong>Tile Price:</strong> ${campaign.tilePrice}
        </div>
        <div>
          <strong>Grid:</strong> {campaign.gridSize.width} ×{" "}
          {campaign.gridSize.height}
        </div>
        <div>
          <strong>Refund Policy:</strong> {campaign.refundPolicy}
        </div>
        <div>
          <strong>Escrow:</strong> {campaign.escrowEnabled ? "Yes" : "No"}
        </div>
        <div>
          <strong>Funds Raised:</strong> $
          {campaign.currentFunds.toLocaleString()}
        </div>
        <div>
          <strong>Contributors:</strong> {campaign.contributorsCount}
        </div>
        <div>
          <strong>Status:</strong>{" "}
          {campaign.isCompleted ? "Completed" : "Active"}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Put your pixel!</h2>
        <PixelCanvas
          campaign={campaign}
          onDonate={(data) => setCampaign(data)}
        />
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded-md shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Tiles Placed</th>
                <th className="px-4 py-2 border-b">Amount Donated</th>
              </tr>
            </thead>
            <tbody>
              {campaign.leaderboard
                .toSorted((a, b) => b.amountDonated - a.amountDonated) // optional: sort by top donor
                .map((entry, index) => (
                  <tr key={entry.user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">{entry.user.name}</td>
                    <td className="px-4 py-2 border-b">{entry.tilesPlaced}</td>
                    <td className="px-4 py-2 border-b">
                      ${entry.amountDonated}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// SERVER-SIDE DATA FETCHING
export const getServerSideProps: GetServerSideProps = async ({
  query: { id },
  req,
}) => {
  await connectDB();
  const user = await getUser(req.cookies[ECookieName.AUTH]);

  const campaign = await Campaign.findById(id).populate(
    "organizer leaderboard.user"
  );

  if (!campaign) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: stringifyAndParse(user),
      campaign: stringifyAndParse(campaign),
    } as CampaignPageProps,
  };
};
