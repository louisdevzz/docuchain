import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <ToastContainer />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}