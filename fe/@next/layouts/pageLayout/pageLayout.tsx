import { FC } from "react";
import Navbar from "@/components/ui/navbar";
import { PageLayoutTemplate } from "@next/templates";

interface Props {
  children: React.ReactNode;
}

export const PageLayout: FC<Props> = ({ children }) => {
  return <PageLayoutTemplate>{children}</PageLayoutTemplate>;
};
