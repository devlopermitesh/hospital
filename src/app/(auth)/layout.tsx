import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col items-center items-center">
      {children}
    </section>
  );
};
export default Layout;
