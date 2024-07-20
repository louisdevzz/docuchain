import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import { Bree_Serif } from "next/font/google"
import Head from "next/head";

const bree = Bree_Serif({subsets:['latin'],weight:["400"]})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={bree.className}>
      <Head>
        <title>BlockCertify</title>
      </Head>
      <ToastContainer />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}