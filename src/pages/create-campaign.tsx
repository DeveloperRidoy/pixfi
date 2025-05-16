import BecomeOrganizerForm from "@/components/forms/BecomeOrganizerForm";
import CampaignForm from "@/components/forms/CampaignForm";
import { useAuthContext } from "@/context/AuthContext";
import serverSidePropsHandler from "@/lib/server/serverSidePropsHandler";
import { EApiRequestMethod } from "@/types/api.types";
import { EAuthStatus, IUser } from "@/types/user.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCampaign() {
  const router = useRouter();

  const { user, setUser } = useAuthContext();

  const [isOrganizer, setIsOrganizer] = useState(
    user?.role === "organizer" || user?.role === "admin"
  );

  if (!user) return router.push("/login");

  const onSuccess = () => {
    router.push("/");
  };

  const handleBecomeOrganizerSuccess = (user: IUser) => {
    setIsOrganizer(true);
    setUser(user);
  };

  if (!isOrganizer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5">
        <BecomeOrganizerForm
          user={user}
          onSuccess={handleBecomeOrganizerSuccess}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#f9fafb] px-4 py-12">
  <div className="max-w-2xl w-full space-y-10 bg-white px-6 py-10 md:px-10 rounded-2xl shadow-md border border-gray-200">
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-semibold text-gray-900">Create a Campaign</h1>
      <p className="text-sm text-gray-500">
        Fill in the campaign details below to create a new campaign.
      </p>
    </div>

    <CampaignForm
      requestUrl="api/campaigns"
      requestMethod={EApiRequestMethod.POST}
      onSuccess={onSuccess}
    />
  </div>
</div>

  );
}

export const getServerSideProps = serverSidePropsHandler({
  access: EAuthStatus.AUTHENTICATED,
});
