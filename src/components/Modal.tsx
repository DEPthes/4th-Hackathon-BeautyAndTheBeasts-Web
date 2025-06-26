import React from "react";
import ModalImg from "../assets/images/Modal.png";
import NoBtn from "../assets/images/NoBtn.png";
import YesBtn from "../assets/images/YesBtn.png";
import { IoPlay } from "react-icons/io5";

interface ModalProps {
  isOpen?: (value: boolean) => void;
  open?: boolean;
  onYes?: () => void;
  onNo?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, open, onYes, onNo }) => {
  if (!open) return null; // 모달이 닫혀 있으면 아무것도 렌더링하지 않음

  const handleNo = () => {
    if (onNo) onNo();
    if (isOpen) isOpen(false);
  };

  const handleYes = () => {
    if (onYes) onYes();
    if (isOpen) isOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center mx-auto ">
      <img src={ModalImg} className=" relative w-[350px]" />
      <div className="absolute rounded-lg shadow-lg p-6 max-w-md w-[320px] mr-[20px] flex flex-col">
        <div className=" mb-7">
          <span className="font-[DungGeunMo] text-red-500 text-3xl"> 칭찬</span>
          <span className="font-[DungGeunMo] text-white text-3xl">
            이 성에 안 차?
          </span>
        </div>
        <div className=" flex flex-row mx-auto mb-5 ">
          <div className="relative">
            <img
              src={NoBtn}
              className="mr-5 cursor-pointer"
              onClick={handleNo}
            />
            <p className="absolute font-[DungGeunMo] text-red-500 text-3xl -mt-12 ml-8 cursor-pointer focus:outline-none active:scale-95">
              No
            </p>
          </div>
          <div className="relative">
            <img src={YesBtn} className=" cursor-pointer" onClick={handleYes} />
            <div className="flex justify-center items-center absolute -mt-11.5 ml-8 pointer-events-none">
              <IoPlay className="mr-3 text-red-500 text-2xl" />
              <p className=" font-[DungGeunMo] text-red-500 text-3xl cursor-pointer">
                Yes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
