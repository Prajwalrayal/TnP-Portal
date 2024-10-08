"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardPage from "@/appPages/Dashboard";
import { useAppSelector } from "@/redux/hooks";

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (pathname === "/") return;
    localStorage.removeItem("persist:root");
    console.clear();
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DashboardPage />;
};

export default Home;
