import serverSidePropsHandler from "@/lib/server/serverSidePropsHandler";
import { EAuthStatus } from "@/types/user.types";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen gap-5 w-full">
      <h1 className="text-4xl font-bold mt-10">Welcome to My Next.js App</h1>
      <p className="text-lg text-center max-w-2xl">
        This is a simple example of a Next.js application with a responsive
        layout and a navigation bar.
      </p>
      <div className="flex flex-col items-center gap-4 mt-10">
        <a href="/about" className="text-blue-500 hover:underline">
          Learn more about us
        </a>
        <a href="/contact" className="text-blue-500 hover:underline">
          Contact us
        </a>
      </div>
    </div>
  );
}

export const getServerSideProps = serverSidePropsHandler({
  access: EAuthStatus.ANY,
});
