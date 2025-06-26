import HeaderHeart from "../assets/images/HeaderHeart.svg";
import LeftArrow from "../assets/images/LeftArrow.svg";
import { cn } from "../utils/classname";

interface HeaderProp {
  className?: string;
}

export const Header: React.FC<HeaderProp> = ({ className }) => {
  return (
    <>
      <div className={cn("flex items-center h-40 w-4/5 m-auto", className)}>
        <div className="relative border-white">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white"></div>
          {/* <p className="font-[DungGeunMo] text-red-500 text-3xl pl-4 pt-4 h-20">● REC</p> */}
          <div className="flex direction-row cursor-pointer h-20"><img className=" ml-4  h-7 mt-5" src={LeftArrow} /><p className="font-[DungGeunMo] mt-4 text-red-500 text-3xl pl-4 h-20">Back</p></div>
        </div>
        <div className="relative flex flex-col items-center ml-auto pr-4 pt-6 h-20 border-white">
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white"></div>
          <img src={HeaderHeart} />
          <p className="font-[DungGeunMo] text-[#D8D8D8] text-[1.25rem] mt-1.5">00:00:00:01</p>
        </div>
      </div>
      <div className={cn("mx-auto", className)}>
        <span className="font-[DungGeunMo] text-white text-3xl">네, 그게</span>
        <span className="font-[DungGeunMo] text-red-500 text-3xl"> 칭찬</span>
        <span className="font-[DungGeunMo] text-white text-3xl">입니다.ㅣ</span>
      </div>
    </>
  );
};
