import { cn } from "../utils/classname";
import BackGroundImage from "./BackGroundImage";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  extraclassName?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showBackground?: boolean;
  isHomePage?: boolean;
  onBackClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  extraclassName,
  showHeader = true,
  showFooter = true,
  showBackground = true,
  isHomePage = false,
  onBackClick,
}) => {
  return (
    <div className="relative min-h-screen w-full">
      {/* 전체 화면 배경 */}
      {showBackground && <BackGroundImage />}

      {/* 콘텐츠 컨테이너 */}
      <div
        className={cn(
          "relative z-10 flex flex-col min-h-screen mx-auto max-w-[500px]",
          showBackground ? "bg-transparent" : "bg-gray-100",
          extraclassName
        )}
      >
        {showHeader && (
          <Header
            className={extraclassName}
            isHomePage={isHomePage}
            onBackClick={onBackClick}
          />
        )}
        <main className={cn("flex-1", className)}>{children}</main>
        {showFooter && <Footer className={extraclassName} />}
      </div>
    </div>
  );
};
