import Navbar from "@/components/ui/navbar";
import { FunctionComponent } from "react";

interface Props {
  children: React.ReactNode;
}

export const PageLayoutTemplate: FunctionComponent<Props> = ({
  children,
}: Props) => {
  return (
    <body
      className="w-full h-screen "
      style={{
        overflowY: "scroll",
        // backgroundColor: "#f7f9ff",
        backgroundColor: "#eceef5",
      }}
    >
      {/* <div className="w-full h-32 flex relative bg-gradient-to-r from-header-grad-1 from-50% via-header-grad-2 via-10% to-header-grad-3 to-90% ..."> */}
      <div className="w-full h-32 flex relative">
        <div className="m-auto p-[30px] w-[1440px] z-10">
          <div className="w-[1380px] ">
            <div className="w-full">
              <Navbar />
              <div className="mt-[17px]">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};
