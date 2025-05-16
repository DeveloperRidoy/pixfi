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
  <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
  <p className="text-base text-gray-600 mb-6">{campaign.description}</p>

  {/* Campaign Metadata */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 border border-gray-200 rounded-xl shadow-sm mb-10">
    <div><span className="text-gray-500 text-sm">🎯 Goal</span><p className="font-medium text-gray-800">${campaign.donationGoal.toLocaleString()}</p></div>
    <div><span className="text-gray-500 text-sm">💰 Tile Price</span><p className="font-medium text-gray-800">${campaign.tilePrice}</p></div>
    <div><span className="text-gray-500 text-sm">🧩 Grid</span><p className="font-medium text-gray-800">{campaign.gridSize.width} × {campaign.gridSize.height}</p></div>
    <div><span className="text-gray-500 text-sm">🔁 Refund Policy</span><p className="font-medium text-gray-800 capitalize">{campaign.refundPolicy}</p></div>
    <div><span className="text-gray-500 text-sm">🔒 Escrow</span><p className="font-medium text-gray-800">{campaign.escrowEnabled ? "Yes" : "No"}</p></div>
    <div><span className="text-gray-500 text-sm">📈 Funds Raised</span><p className="font-medium text-gray-800">${campaign.currentFunds.toLocaleString()}</p></div>
    <div><span className="text-gray-500 text-sm">👥 Contributors</span><p className="font-medium text-gray-800">{campaign.contributorsCount}</p></div>
    <div><span className="text-gray-500 text-sm">🟢 Status</span><p className="font-medium text-gray-800">{campaign.isCompleted ? "Completed" : "Active"}</p></div>
  </div>

  {/* Pixel Canvas */}
  <div className="mt-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">🖌️ Put your pixel!</h2>
    <PixelCanvas campaign={campaign} onDonate={(data) => setCampaign(data)} />
  </div>

  {/* Leaderboard */}
  <div className="mt-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">🏆 Leaderboard</h2>
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Tiles</th>
            <th className="px-4 py-3 text-left">Donated</th>
          </tr>
        </thead>
        <tbody>
          {campaign.leaderboard
            .toSorted((a, b) => b.amountDonated - a.amountDonated)
            .map((entry, index) => (
              <tr key={entry.user._id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-3 font-medium text-gray-700">{index + 1}</td>
                <td className="px-4 py-3 text-gray-800">{entry.user.name}</td>
                <td className="px-4 py-3 text-gray-700">{entry.tilesPlaced}</td>
                <td className="px-4 py-3 text-gray-700">${entry.amountDonated}</td>
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
