import "../../styles/globals.css";
import type { AppProps } from "next/app";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import { useEffect } from "react";
import { parseCookies, setCookie } from "nookies";
import { v4 as uuidv4 } from "uuid";

function MyApp({ Component, pageProps }: AppProps) {
  // Generate random user ID in cookies if none exists yet
  useEffect(() => {
    const cookies: { userID?: string } = parseCookies();
    if (!cookies.userID) {
      setCookie(null, "userID", uuidv4());
    }
  }, []);

  return (
    <LayoutWrapper>
      <Component {...pageProps} />
    </LayoutWrapper>
  );
}

export default MyApp;
