import React from "react";
import ModalImg from "../assets/images/Modal.png";
import { Layout } from "./Layout";
import NoBtn from "../assets/images/NoBtn.png";
import YesBtn from "../assets/images/YesBtn.png";
import Play from "../assets/images/Play.svg";

interface ModalProps {
  isOpen?: (value: boolean) => void;
  open?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, open }) => {
  // if (!open) return null; // 모달이 닫혀 있으면 아무것도 렌더링하지 않음

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center mx-auto ">
      <img src={ModalImg} className=" relative w-[350px]" />
      <div className="absolute rounded-lg shadow-lg p-6 max-w-md w-[320px] mr-[20px] flex flex-col">
        <div className=" mb-7">
          <span className="font-[DungGeunMo] text-red-500 text-3xl"> 칭찬</span>
          <span className="font-[DungGeunMo] text-white text-3xl">이 성에 안 차?</span>
        </div>
        <div className=" flex flex-row mx-auto mb-5 ">
          <div className="relative"><img src={NoBtn} className="mr-5 cursor-pointer" /><p className="absolute font-[DungGeunMo] text-red-500 text-3xl -mt-12 ml-8 cursor-pointer">No</p></div>
          <div className="relative"><img src={YesBtn} className=" cursor-pointer" /><div className="flex flex-row absolute -mt-12 ml-10"><img src={Play} className="mr-5" /><p className=" font-[DungGeunMo] text-red-500 text-3xl cursor-pointer">Yes</p></div></div>
        </div>
      </div>
    </div>
  );
};
