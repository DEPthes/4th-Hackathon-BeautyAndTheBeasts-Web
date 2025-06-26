import { Layout } from "../components/Layout";

export const HomePage = () => {
  return (
    <Layout extraclassName="">
      <div className="text-2xl font-bold">오늘 하루 입력하기</div>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md placeholder:text-gray-400"
        placeholder="오늘 하루 입력하기"
      />
    </Layout>
  );
};
