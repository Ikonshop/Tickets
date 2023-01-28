import React, { FC } from "react";
import styles from "../../styles/custom.module.css";
const Loading: FC = ({}) => {
  return (
    <div>
      {/* <video className={styles.loading_video} autoPlay loop muted>
                <source src="/LoadingPage.mp4" type="video/mp4" />
            </video> */}
      <img src="/loader.gif" className={styles.loader} />
    </div>
  );
};
export default Loading;
