import Files from "../components/Files";
import { Layout } from "../components/Layout";
import StartButton from "../components/StartButton";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Layout
      className="flex flex-col items-center justify-start gap-10"
      isHomePage={true}
    >
      <div>
        <div className="mx-auto">
          <span className="font-[DungGeunMo] text-white text-3xl">
            네, 그게
          </span>
          <span className="font-[DungGeunMo] text-red-500 text-3xl"> 칭찬</span>
          <span className="font-[DungGeunMo] text-white text-3xl">
            입니다.ㅣ
          </span>
        </div>
      </div>
      <Files />
      <StartButton
        onClick={() => {
          navigate("/input");
        }}
      />
    </Layout>
  );
};

export default HomePage;
