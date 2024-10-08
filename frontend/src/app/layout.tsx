"use client";

import "@/styles/globals.css";
import { Rubik } from "next/font/google";
import { ReduxProviders } from "@/redux/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundaryWrapper, LoadingSpinner } from "@/Components";
import { Suspense } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import classNames from "classnames";

const rubik = Rubik({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content={`IIITDMJ Placement Cell Internal Dashboard`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.png`}
        />
        <link
          rel="shortcut icon"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.png`}
        />
        <title>{"IIITDMJ Placement Cell"}</title>
      </head>
      <body
        className={classNames({
          [rubik.className]: true,
          "bg-[url('/BG-1.png')] dark:bg-[url('/BG.png')]": false,
          "bg-center bg-cover bg-no-repeat": true,
        })}
        suppressHydrationWarning={true}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ProgressBar
            height="4px"
            color="#1b1b1b"
            options={{ showSpinner: true }}
            shallowRouting
          />
          <ReduxProviders>
            <ErrorBoundaryWrapper>
              <div
                className={classNames({
                  "relative max-w-screen max-h-screen gap-x-0": true,
                  "flex flex-row items-start mobile:justify-start justify-end":
                    true,
                })}
              >
                <div
                  className={classNames({
                    [`relative h-screen w-screen flex flex-col items-start justify-between mobile:items-center`]:
                      true,
                    "mobile:w-[100vw] no-scrollbar overflow-x-hidden": true,
                  })}
                >
                  {children}
                </div>
              </div>
            </ErrorBoundaryWrapper>
            <ToastContainer autoClose={1000} hideProgressBar />
          </ReduxProviders>
        </Suspense>
      </body>
    </html>
  );
}
