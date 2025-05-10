import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KG Slots",
  description: "Agência de Influencers",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
