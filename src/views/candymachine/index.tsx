import { FC } from "react"
import { FetchCandyMachine } from "../../components/FetchCandyMachine"

export const CandyMachineView: FC = ({}) => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <FetchCandyMachine />
        </div>
      </div>
    </div>
  )
}
