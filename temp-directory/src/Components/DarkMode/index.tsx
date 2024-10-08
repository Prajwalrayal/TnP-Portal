import React from "react";
import styles from "./DarkMode.module.css";
import classNames from "classnames";
import Image from "next/image";

let prefersDark = false;

const DarkMode = () => {
  const [theme, setTheme] = React.useState("light");

  const setDark = () => {
    document.documentElement.setAttribute("data-theme", "dark");
  };

  const setLight = () => {
    document.documentElement.setAttribute("data-theme", "light");
  };

  if (typeof window !== "undefined") {
    prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  const defaultDark = theme === "dark" || (theme === null && prefersDark);

  if (defaultDark) {
    setDark();
  }

  const toggleTheme = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.currentTarget.dataset.theme === "light") {
      setDark();
    } else {
      setLight();
    }
  };

  return (
    <div
      className={classNames({
        [styles.darkMode]: true,
        "p-1 rounded-lg": true,
        "bg-primary": true,
        "shadow-md": true,
      })}
      data-theme={theme}
      onClick={(event) => {
        setTheme((currentTheme) =>
          currentTheme === "light" ? "dark" : "light"
        );
        toggleTheme(event);
      }}
    >
      <Image
        width={28}
        height={28}
        src={`${theme === "light" ? "/dark-mode.png" : "/moon.png"}`}
        alt={"switch"}
        className={classNames({
          "mobile:w-6 mobile:h-6 w-7 h-7 brightness-0 invert dark:invert-0":
            true,
          "!cursor-pointer": true,
        })}
      />
    </div>
  );
};

export default DarkMode;
