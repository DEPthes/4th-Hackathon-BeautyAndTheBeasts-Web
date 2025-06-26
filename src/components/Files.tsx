import { cn } from "../utils/classname";
import FileImage from "@/assets/images/Files.png";
interface FilesProps {
  className?: string;
}

const Files = ({ className }: FilesProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="w-fit h-full object-contain relative">
          <img src={FileImage} alt="Files" />
          <div className="bg-stone-900 h-[170px] w-[270px] absolute top-35 left-10 opacity-40"></div>
          <div className="text-white text-xl font-bold absolute top-43 left-18">
            무엇이든 칭찬으로
            <br />
            바꿔드립니다...?
          </div>
        </div>
      </div>
    </div>
  );
};

export default Files;
