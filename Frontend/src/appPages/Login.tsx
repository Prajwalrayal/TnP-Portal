"use client";

import { useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/reducers/userSlice";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [emailid, setEmailid] = useState("");
  const [password, setPassword] = useState("");
  const [errorcause, setErrorcause] = useState("");
  // const [rememberme, setRememberMe] = useState(false);
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (error) {
      if (error.toLowerCase().includes("password")) {
        setErrorcause("password");
      } else if (error.toLowerCase().includes("email")) {
        setErrorcause("email");
      }
    }
  }, [error]);

  const handleLogin = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(loginUser({ emailid, password }));
  };

  useEffect(() => {
    if (isAuthenticated) router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div
      className={classNames({
        "h-screen w-screen flex items-center justify-center": true,
        "bg-[url('/auth-bg.jpg')]": true,
        "bg-center bg-cover bg-no-repeat": true,
      })}
    >
      <div className="bg-white rounded-lg shadow-lg w-[95vw] min-mobile-sm:w-96">
        <div className="flex flex-col-reverse gap-y-3 sm:flex-row justify-center sm:justify-between items-center text-center w-full px-10 py-4">
          <h1 className="text-3xl kanit font-semibold text-neutral-700">
            Login
          </h1>
          <Image
            alt="logo"
            height={28}
            width={160}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/IIIT_logo.png`}
            className="h-full max-w-[160px]"
          />
        </div>
        <hr className="" />
        <form className="px-6 py-4">
          <div className="mb-6">
            <label htmlFor="email" className="text-gray-500">
              Email id
            </label>
            <input
              id="email"
              type="text"
              className={`w-full border-b-2 border-gray-300 focus:border-green-800 outline-none dark:text-[#1A1A1C] ${
                errorcause == "email" ? "border-red-500" : null
              }`}
              required
              onChange={(e) => setEmailid(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="text-gray-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`w-full border-b-2 border-gray-300 focus:border-green-800 outline-none dark:text-[#1A1A1C] ${
                errorcause == "password" ? "border-red-500" : null
              }`}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* <div className="flex items-center mb-6">
            <div className="flex-1 text-sm text-gray-600">
              <Link
                href="/resetpassword"
                className="text-green-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="checkb1">
              <input
                type="checkbox"
                id="remember"
                className="form-checkbox"
                onChange={(e) => {
                  setRememberMe(e.target.checked);
                }}
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember Me
              </label>
            </div>
          </div> */}
          {loading ? (
            <div className={`flex items-center justify-center h-10`}>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neutral-200 border-solid" />
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-green-800 text-white font-bold py-2 rounded-lg cursor-pointer hover:bg-green-secondary"
              onClick={handleLogin}
              title="Submit"
            >
              {"Login"}
            </button>
          )}
          <div className="mt-6 text-center text-base text-gray-600">
            {"Don't have an account? "}
            <Link
              href="/register"
              className="text-green-800 hover:underline font-bold"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
