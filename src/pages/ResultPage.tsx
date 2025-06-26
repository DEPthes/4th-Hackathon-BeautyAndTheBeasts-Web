import { Layout } from "../components/Layout"
import DummyImg from "../assets/images/DummyImg.png";
import Background from "../assets/images/ResultBackground.png";
import ResultBtn from "../assets/images/ResultBtn.png";
import WhitePlay from "../assets/images/WhitePlay.png";
import DownLoad from "../assets/images/Download.png";
import RecBtn from "../assets/images/RecResultBtn.png";

export const ResultPage = () => {
  return (
    <Layout>
      <div className="flex flex-col w-5/5">
        <div className="mx-auto">
          <span className="font-[DungGeunMo] text-red-500 text-4xl mr-3"> 칭찬</span>
          <span className="font-[DungGeunMo] text-white text-4xl">낋여왔다네</span>
        </div>
        <div className="flex flex-col mx-auto w-5/5">
          <img src={DummyImg} className="w-2/5 mx-auto mt-5 z-10" />
          <img src={Background} className="w-9/10 mx-auto -mt-6" />
          <img src={DownLoad} className="bg-black w-5" />
          <img src={WhitePlay} className="bg-black w-5" />
        </div>
        <div className="flex flex-row mx-auto w-9/10 mt-10">
          <div className="mx-auto"><img src={ResultBtn} className=" h-20" /><p className="font-[DungGeunMo] text-red-500 text-4xl mr-3 -mt-15 ml-6">결과 공유하기</p></div>
          <img src={RecBtn} className="mx-auto h-20" />
        </div>
      </div>
    </Layout>
  )
}