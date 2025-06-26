import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  extraclassName?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, extraclassName }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 mx-auto max-w-[500px]">
      <Header className={extraclassName} />
      <main className="flex-1">{children}</main>
      <Footer className={extraclassName} />
    </div>
  );
};
