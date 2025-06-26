import { Layout } from "../components/Layout"
import ErrorLogo from "../assets/images/ErrorLogo.svg";
import Warning from "../assets/images/WarningBtn.svg";
import ErrorBox from "../assets/images/ErrorBox.svg";
import RefreshBtn from "../assets/images/RefreshBtn.svg";
import Play from "../assets/images/Play.svg";

export const ErrorPage = () => {
  return (
    <Layout className="hidden">
      <div className="flex flex-col justify-center items-center h-5/5">
        <img src={ErrorLogo} className=" w-4/5" />
        <div className="relative w-4/5 mt-20">
          <img src={ErrorBox} className=" w-5/5" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className=" flex flex-row mt-35 mb-8">
            <img src={Warning} className=" w-20 mr-6" />
            <p className="text-white text-2xl mt-auto font-[DungGeunMo]">지금은 곤란하다,<br />다시 시도해달라.</p>
          </div>
          <button
            className="bg-contain bg-center text-red-500 font-[DungGeunMo] text-4xl flex items-center justify-center ml-23">
            <img src={RefreshBtn} className="w-50 relative" />
            <div className="flex flex-row absolute cursor-pointer" >
              <img src={Play} className="mr-5" />
              <p>REFRESH</p>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  )
}