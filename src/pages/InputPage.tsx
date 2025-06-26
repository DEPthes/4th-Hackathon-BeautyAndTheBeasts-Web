import InputFeild from "../assets/images/InputFeild.svg";
import { Layout } from "../components/Layout";
import Submit from "../assets/images/SubmitBtn.svg";

export const InputPage = () => {
  return (
    <Layout>
      <div className="flex flex-col">
        <img src={InputFeild} className="w-9/10 mx-auto " />
        <div className=" flex items-center mt-5">
          <img src={Submit} className=" mx-auto" />
          <p className="absolute text-red-500 font-[DungGeunMo] text-4xl ml-[125px]">칭찬 착즙하기</p>
        </div>
      </div>
    </Layout>
  )
}