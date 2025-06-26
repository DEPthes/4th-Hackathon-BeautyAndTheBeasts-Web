import { Layout } from "./Layout"
import LoadingImg from "../assets/images/Loading.png";
import LoadingBar from "./LoadingBar";

export const Loading = () => {
  return (
    <Layout>
      <div className="flex flex-col h-5/5">
        <div className="flex flex-row bg-black mx-auto mt-auto">
          <span className="font-[DungGeunMo] text-red-500 text-4xl mr-3">칭찬</span>
          <span className="font-[DungGeunMo] text-white text-4xl">착즙 중...</span>
        </div>
        <div className="bg-black mx-auto w-4/5 mb-auto">
          <img src={LoadingImg} />
          <LoadingBar />
        </div>
      </div>
    </Layout>
  )
}