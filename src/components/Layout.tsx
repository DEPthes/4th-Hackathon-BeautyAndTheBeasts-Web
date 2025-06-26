import { cn } from "../utils/classname";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 mx-auto max-w-[500px]">
      <Header />
      <main className={cn("flex-1", className)}>{children}</main>
      <Footer />
    </div>
  );
};
