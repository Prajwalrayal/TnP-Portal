"use client";

import { useRouter } from "next-nprogress-bar";
import { IoCaretBackOutline } from "react-icons/io5";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div
      className={
        "w-screen h-screen flex items-center justify-center flex-col gap-y-2"
      }
    >
      <h1 className="text-[6rem] min-mobile-sm:text-[10rem] sm:text-[14rem] md:text-[20rem] text-blue-700 font-bold bound">
        404
      </h1>
      <p
        className={
          "text-neutral-600 text-sm min-mobile-sm:text-md sm:text-xl font-semibold w-[min(40rem_,_90vw)] text-center"
        }
      >
        {
          "Oops! The page you are looking for might have been removed or had it's name changed or is temporarily unavailabe."
        }
      </p>
      <button
        type="button"
        onClick={() => router.back()}
        className="text-neutral-800 relative z-10 px-8 py-2 my-6 bound flex justify-center items-center gap-2 text-xl hover:bg-green-800 hover:text-neutral-100 rounded-full"
      >
        <IoCaretBackOutline className="w-[1.5rem] h-[1.5rem]" />
        Go Back
      </button>
    </div>
  );
};

export default NotFoundPage;
