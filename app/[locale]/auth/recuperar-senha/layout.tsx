import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KG Slots Next Js",
  description: "KG Slots is a popular dashboard template.",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
