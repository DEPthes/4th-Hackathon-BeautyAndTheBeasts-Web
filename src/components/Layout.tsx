import { cn } from "../utils/classname";
import BackGroundImage from "./BackGroundImage";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="relative min-h-screen w-full">
      {/* 전체 화면 배경 */}
      <BackGroundImage />

      {/* 콘텐츠 컨테이너 */}
      <div className="relative z-10 flex flex-col min-h-screen mx-auto max-w-[500px] bg-transparent">
        <Header />
        <main className={cn("flex-1", className)}>{children}</main>
      </div>
    </div>
  );
};
