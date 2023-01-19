import React, { FC } from 'react'
const Loading: FC = ({}) => {
    return(
        <div className="flex flex-col items-center justify-center w-30 h-70">
            <video autoPlay loop muted>
                <source src="/LoadingPage.mp4" type="video/mp4" />
            </video>
        </div>
    )
}
export default Loading;