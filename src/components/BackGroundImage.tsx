import BackgroundSvg from "@/assets/images/Background.svg?url";
import { cn } from "../utils/classname";

interface BackGroundImageProps {
  className?: string;
}

const BackGroundImage = ({ className }: BackGroundImageProps) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat ",
        className
      )}
      style={{
        backgroundImage: `url(${BackgroundSvg})`,
        backgroundAttachment: "fixed",
      }}
    />
  );
};

export default BackGroundImage;
