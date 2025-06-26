import { RiPlayFill } from "react-icons/ri";
import { cn } from "../utils/classname";
import StartButtonSvg from "@/assets/images/StartButton.svg?url";

interface StartButtonProps {
  className?: string;
  onClick?: () => void;
}

const StartButton = ({ className, onClick }: StartButtonProps) => {
  return (
    <div
      className={cn(
        "w-full h-full cursor-pointer flex items-center justify-center relative",
        className
      )}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
    >
      <img src={StartButtonSvg} alt="StartButton" />
      <span className="absolute top-1.5 pr-10 flex items-center justify-center font-[DungGeunMo] text-red-500 font-bold text-[50px]">
        <RiPlayFill className="text-[35px]" />
        <span className="ml-3">START</span>
      </span>
    </div>
  );
};

export default StartButton;
