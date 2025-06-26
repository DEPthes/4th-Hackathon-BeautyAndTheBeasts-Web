import { cn } from "../utils/classname";

interface FooterProp {
  className?: string;
}

export const Footer: React.FC<FooterProp> = ({ className }) => {
  return (
    <>
      <div
        className={cn("flex items-center h-30 w-full px-4 m-auto", className)}
      >
        <div className="relative border-white h-16">
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white"></div>
          <p className="font-[DungGeunMo] text-[#D8D8D8] text-[1.25rem] pl-4 leading-5">
            18:28
          </p>
          <p className="font-[DungGeunMo] text-[#D8D8D8] text-[1.25rem] pl-4 pb-4">
            Jun.26.2025
          </p>
        </div>
        <div className="relative flex flex-col items-center ml-auto pr-4 h-16 border-white">
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white"></div>
          <p className="font-[DungGeunMo] text-[#D8D8D8] text-0.5xl mt-auto mb-4">
            By. 미녀와 야수들
          </p>
        </div>
      </div>
    </>
  );
};
