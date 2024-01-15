import { type AppType } from "next/app";
import { type Session } from "next-auth";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AppConstants from "../constants/app.constants";

config.autoAddCss = false;

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>{AppConstants.appTitle}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta
          name="description"
          content={`${AppConstants.appTitle} - ${AppConstants.appDescription}`}
        />
        <meta
          name="keywords"
          content={`${AppConstants.appTitle} image sharing`}
        />
        <link
          href="/favicon-32x32.ico"
          rel="icon"
          type="image/ico"
          sizes="32x32"
        />
        <meta name="theme-color" content="#eeeeee" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
