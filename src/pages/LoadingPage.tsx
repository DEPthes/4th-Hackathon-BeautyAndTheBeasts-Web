import React from "react";
import { Layout } from "../components/Layout";
import LoadingImg from "../assets/images/Loading.png";
import LoadingBar from "../components/LoadingBar";

const LoadingPage: React.FC = () => {
  return (
    <Layout showHeader={true} showFooter={true}>
      <div className="flex flex-col items-center justify-center flex-1">
        {/* 이미지와 텍스트를 겹치는 컨테이너 */}
        <div className="relative flex items-center justify-center">
          {/* 배경 이미지 */}
          <img src={LoadingImg} alt="Loading" className="w-4/5 max-w-md" />

          {/* 이미지 위에 겹쳐지는 텍스트 */}
          <div className="absolute top-3 flex items-center justify-center">
            <div className="flex flex-row items-center">
              <span className="font-[DungGeunMo] text-red-500 text-4xl mr-3">
                칭찬
              </span>
              <span className="font-[DungGeunMo] text-white text-4xl">
                착즙 중...
              </span>
            </div>
          </div>
        </div>

        {/* 로딩바를 이미지 하단에 배치 */}
        <div className="w-4/5 max-w-md mt-2">
          <LoadingBar />
        </div>
      </div>
    </Layout>
  );
};

export default LoadingPage;
