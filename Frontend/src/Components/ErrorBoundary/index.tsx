"use client";

import { useAppDispatch } from "@/redux/hooks";
import { updateCurrentSection } from "@/redux/reducers/sectionSlice";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

export default function ErrorBoundaryWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
}

const ErrorFallback = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <main className="grid h-full w-full place-items-center bg-white dark:bg-neutral-900">
        <div className="text-center">
          <p className="text-base font-semibold text-primary">OOPS</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
            Something went wrong
          </h1>
          <p className="mt-6 text-base leading-7 text-primary dark:bg-n">
            {"We're sorry, but something went wrong. Please try again later."}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                dispatch(updateCurrentSection(0));
                router.replace("/");
                if (typeof window !== "undefined") window.location.reload();
              }}
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-hover shadow-sm hover:brightness-95 cursor-pointer"
            >
              Go back home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
