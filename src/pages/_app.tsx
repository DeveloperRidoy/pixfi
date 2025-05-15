import type { AppProps } from "next/app";
import "@/app/globals.css";
import Layout from "@/components/layouts/Layout";
import AuthProvider from "@/providers/AuthProvider";
import ToastComponent from "@/components/ToastComponent";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider user={pageProps.user}>
      <ToastComponent />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
