import { Layout } from "../components/Layout"

export const ResultPage = () => {
  return (
    <Layout>
      <div className="flex flex-col w-5/5 mx-">
        <div>
          <span className="font-[DungGeunMo] text-red-500 text-4xl mr-3"> 칭찬</span>
          <span className="font-[DungGeunMo] text-white text-4xl">낋여왔다네</span>
        </div>
      </div>
    </Layout>
  )
}