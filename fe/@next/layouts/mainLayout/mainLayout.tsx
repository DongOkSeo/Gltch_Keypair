import { CssBaseline } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
};
