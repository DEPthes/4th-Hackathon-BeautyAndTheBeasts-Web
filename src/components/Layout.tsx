import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 mx-auto max-w-[500px]">
      <Header className={className} />
      <main className="flex-1">{children}</main>
      <Footer className={className} />
    </div>
  );
};
