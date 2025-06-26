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
      <span className="absolute top-6 pr-5 flex items-center justify-center text-red-500 font-bold text-4xl">
        <RiPlayFill />
        <span className="ml-3">START</span>
      </span>
    </div>
  );
};

export default StartButton;
