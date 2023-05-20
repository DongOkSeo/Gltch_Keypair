import { useEffect, useState } from "react";
import { useAppSelector } from "@hooks";

export const GetTheme = () => {
  const getTheme = useAppSelector((state: any) => state.theme);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    if (getTheme.theme.toLowerCase().includes("light")) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [getTheme.theme]);

  return theme;
};
