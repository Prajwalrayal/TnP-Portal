"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/reducers/userSlice";
import { useRouter } from "next/navigation";

const PasswordValidationModal = () => {
  return (
    <div className="group relative flex items-center justify-center">
      <Image
        height={16}
        width={16}
        alt="info"
        src={"/info.png"}
        className="w-4 h-4 cursor-pointer opacity-70 mb-[0.2rem]"
      />
      <span className="z-[1000] w-[25rem] absolute top-0 left-[-7.35rem] scale-0 rounded bg-neutral-100 shadow-lg p-2 text-xs text-gray-900 group-hover:scale-100 transition-all">
        <span className="flex items-center justify-start gap-1">
          <p>{"1️⃣"}</p>
          Password should be atleast 6 digit long.
        </span>
        <span className="flex items-center justify-start gap-1">
          <p>{"2️⃣"}</p>
          Password should contain atleast one uppercase letter.
        </span>
        <span className="flex items-center justify-start gap-1">
          <p>{"3️⃣"}</p>
          Password should contain atleast one lowercase letter.
        </span>
        <span className="flex items-center justify-start gap-1">
          <p>{"4️⃣"}</p>
          Password should contain one digit.
        </span>
        <span className="flex items-center justify-start gap-1">
          <p>{"5️⃣"}</p>
          Password should contain one special symbol.
        </span>
      </span>
    </div>
  );
};

const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [emailid, setEmailid] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [errorcause, setErrorcause] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const validEmail = /^\d{2}[A-Za-z]{3}\d{3}$/;
  const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{6,}$/;
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isAuthenticated) router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const signupuser = (
    emailid: string,
    password: string,
    confirmpassword: string
  ) => {
    setErrorcause("");
    const emailexp = emailid.split("@");
    if (
      !(
        emailexp.length == 2 &&
        emailexp[1] == "iiitdmj.ac.in" &&
        validEmail.test(emailexp[0])
      )
    ) {
      setFormError("Enter valid institute email id.");
      setErrorcause("email");
    } else if (password != confirmpassword) {
      setFormError("Password and confirm pasword should match.");
      setErrorcause("password");
    } else if (!validPassword.test(password)) {
      setFormError("Invalid Password.");
      setErrorcause("password");
    } else {
      dispatch(registerUser({ emailid, password }));
      setErrorcause("");
    }
  };
  useEffect(() => {
    if (error) {
      if (error.toLowerCase().includes("password")) {
        setErrorcause("password");
      } else if (error.toLowerCase().includes("email")) {
        setErrorcause("email");
      }
    }
  }, [error]);

  return (
    <div
      className={classNames({
        "h-screen w-screen flex items-center justify-center": true,
        "bg-[url('/auth-bg.jpg')]": true,
        "bg-center bg-cover bg-no-repeat": true,
      })}
    >
      <div className="bg-white rounded-lg w-96 shadow-lg">
        <div className="flex flex-col-reverse gap-y-3 sm:flex-row justify-center sm:justify-between items-center text-center w-full px-10 py-4">
          <h1 className="text-3xl kanit font-semibold text-neutral-700">
            SignUp
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
          {(error || formError) && (
            <div
              className={`my-3 text-center text-base bg-red-500 text-white rounded-lg p-1`}
            >
              {error ? error : formError ? formError : null}
            </div>
          )}
          <div className="mb-6">
            <label htmlFor="email" className="text-gray-500">
              Institute Email ID
            </label>
            <input
              id="email"
              type="email"
              className={`w-full border-b-2 border-gray-300 focus:border-green-800 outline-none dark:text-[#1A1A1C] ${
                errorcause == "email" ? "border-red-500" : null
              }`}
              required
              onChange={(e) => setEmailid(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-start gap-1">
              <label htmlFor="password" className="text-gray-500">
                Password
              </label>
              <PasswordValidationModal />
            </div>
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
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="text-gray-500">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`w-full border-b-2 border-gray-300 focus:border-green-800 outline-none dark:text-[#1A1A1C] ${
                errorcause == "password" ? "border-red-500" : null
              }`}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {loading ? (
            <div className={`flex items-center justify-center h-10`}>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neutral-200 border-solid" />
            </div>
          ) : (
            <button
              title="submit"
              type="submit"
              value="SignUp"
              className="w-full bg-green-800 text-white font-bold py-2 rounded-lg cursor-pointer hover:bg-green-secondary"
              onClick={(e) => {
                e.preventDefault();
                setFormError(null);
                setErrorcause("");
                signupuser(emailid, password, confirmpassword);
              }}
            >
              {"Sign Up"}
            </button>
          )}
          <div className="mt-6 text-center text-base text-gray-600">
            {"Already have an account? "}
            <Link
              href="/login"
              className="text-green-800 hover:underline font-bold"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
