import React from "react";
import ClientLiveblocksProvider from "./ClientLiveblocksProvider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ClientLiveblocksProvider>{children}</ClientLiveblocksProvider>
    </>
  );
};

export default DashboardLayout;
