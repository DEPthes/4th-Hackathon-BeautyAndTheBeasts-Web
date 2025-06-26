import Files from "../components/Files";
import { Layout } from "../components/Layout";
import StartButton from "../components/StartButton";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Layout className="flex flex-col items-center justify-start gap-10">
      <div className="text-3xl font-bold text-white pt-15">
        네, 그게 <span className="text-red-500">칭찬</span>입니다.
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
