import HeaderHeart from "../assets/images/HeaderHeart.svg?url";
import LeftArrow from "../assets/images/LeftArrow.svg?url";
import { cn } from "../utils/classname";

interface HeaderProp {
  className?: string;
  isHomePage?: boolean;
  onBackClick?: () => void;
}

export const Header: React.FC<HeaderProp> = ({
  className,
  isHomePage = false,
  onBackClick,
}) => {
  return (
    <>
      <div
        className={cn("flex items-center h-30 w-full px-4 m-auto", className)}
      >
        <div className="relative border-white">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white"></div>

          {isHomePage ? (
            // Home 페이지: REC 표시
            <p className="font-[DungGeunMo] text-red-500 text-3xl pl-4 pt-4 h-20">
              ● REC
            </p>
          ) : (
            // 다른 페이지: BACK 버튼 표시
            <div
              className="flex direction-row cursor-pointer h-20"
              onClick={onBackClick}
            >
              <img className="ml-4 h-7 mt-5" src={LeftArrow} alt="Back Arrow" />
              <p className="font-[DungGeunMo] mt-4 text-red-500 text-3xl pl-4 h-20">
                Back
              </p>
            </div>
          )}
        </div>

        <div className="relative flex flex-col items-center ml-auto pr-4 pt-6 h-20 border-white">
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white"></div>
          <img src={HeaderHeart} alt="Heart Icon" />
          <p className="font-[DungGeunMo] text-[#D8D8D8] text-[1.25rem] mt-1.5">
            00:00:00:01
          </p>
        </div>
      </div>
    </>
  );
};
