import Link from "next/link";
import Image from "next/image";
import { ICampaign } from "@/types/campaign.types";
import serverSidePropsHandler from "@/lib/server/serverSidePropsHandler";
import { EAuthStatus } from "@/types/user.types";
import connectDB from "@/lib/server/connectDB";
import Campaign from "@/mongoose/models/Campaign";
import stringifyAndParse from "@/lib/stringifyAndParse";

type HomeProps = {
  campaigns: ICampaign[];
};

export default function Home({ campaigns }: Readonly<HomeProps>) {
  return (
  <div className="flex flex-col items-center min-h-screen gap-6 w-full px-4 py-10 bg-[#f9fafb]">
  <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Active Campaigns</h1>

  {campaigns.length === 0 ? (
    <p className="text-gray-500 mt-6 text-base">No campaigns available yet.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
      {campaigns.map((campaign) => (
        <Link
          href={`/campaigns/${campaign._id}`}
          key={campaign._id}
          className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200"
        >
          {campaign.imageTemplateUrl && (
            <Image
              src={campaign.imageTemplateUrl.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
              )}
              alt={campaign.title}
              width={600}
              height={400}
              className="w-full h-52 object-contain"
            />
          )}
          <div className="p-5">
            <h2 className="text-lg font-medium text-gray-900">{campaign.title}</h2>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {campaign.description}
            </p>
            <p className="mt-3 text-xs text-gray-500">
              🎯 Goal: <span className="font-medium text-gray-700">${campaign.donationGoal.toLocaleString()}</span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>

  );
}

export const getServerSideProps = serverSidePropsHandler({
  access: EAuthStatus.ANY,
  fn: async () => {
    await connectDB();
    const campaigns = await Campaign.find();
    return {
      campaigns: stringifyAndParse(campaigns),
    };
  },
});
