import { Button } from "@mui/material";
import { createTheme } from "@mui/material//styles";
import React, { useMemo, useState } from "react";
import { getColors, commonColorInterface } from "./colors";
declare module "@mui/material/styles/createPalette" {
  interface CommonColors extends commonColorInterface {}
}
export const themeSetting = (mode: any) => {
  const colors = getColors(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: { main: colors.primary },
            background: {
              default: colors.background,
            },
            error: { main: colors.error },
            warning: { main: colors.warning },
            success: { main: colors.success },
            text: {
              primary: colors.common.blackWhiteAccent,
            },
            common: {
              ...colors.common,
            },
          }
        : {
            primary: { main: colors.primary },
            background: {
              default: colors.background,
            },
            error: { main: colors.error },
            warning: { main: colors.warning },
            success: { main: colors.success },
            text: {
              primary: colors.common.blackWhiteAccent,
            },
            common: {
              ...colors.common,
              textField: colors.common.textField,
            },
          }),
    },
    typography: {
      fontFamily: "Inter",
      h1: {},
      h2: {},
      h3: {
        fontWeight: 500,
        fontSize: "24px",
      },
      h4: {
        fontWeight: 600,
        fontSize: "16px",
      },
      h5: {
        fontWeight: 500,
        fontSize: "16px",
      },
      h6: {
        fontWeight: 500,
        fontSize: "14px",
      },
      subtitle1: {
        fontWeight: 600,
        fontSize: "14px",
      },
      button: {
        color: colors.button,
        background: colors.primary,
        fontWeight: 500,
        fontSize: "18px",
        border: "1px solid",
        borderColor: colors.common.border,
      },
    },
  };
};
