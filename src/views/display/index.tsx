import { FC } from "react";
import { FetchNft } from "../../components/FetchNft";

export const DisplayView: FC = ({}) => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold upcoming_h1 text-transparent bg-clip-text bg-gradient-to-tr">
          Upcoming Events
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <FetchNft />
        </div>
      </div>
    </div>
  );
};
