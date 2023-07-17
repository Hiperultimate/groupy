import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import NavBar from "../components/NavBar";

import { api } from "~/utils/api";

import { RecoilRoot } from "recoil";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <NavBar />
        <Component {...pageProps} />
      </SessionProvider>
    </RecoilRoot>
  );
};

export default api.withTRPC(MyApp);
