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
    <div className="flex flex-col items-center min-h-screen gap-5 w-full p-6">
      <h1 className="text-4xl font-bold mt-10">Active Campaigns</h1>

      {campaigns.length === 0 ? (
        <p className="text-gray-500 mt-4">No campaigns available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-6xl">
          {campaigns.map((campaign) => (
            <Link
              href={`/campaigns/${campaign._id}`}
              key={campaign._id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-md transition bg-white"
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
                  className="w-full object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{campaign.title}</h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {campaign.description}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Goal: ${campaign.donationGoal.toLocaleString()}
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
