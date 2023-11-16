// path : mealchoice/src/components/Layout.tsx

import React from "react";
import "tailwindcss/tailwind.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="">레이아웃</div>
      {children}
    </>
  );
};

export default Layout;
