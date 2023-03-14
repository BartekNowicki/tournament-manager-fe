/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
import styles from "./mainWrapper.module.css";

interface IMainWrapperProps {
  children: JSX.Element[];
}

const MainWrapper: React.FC<IMainWrapperProps> = ({
  children,
}): JSX.Element => {
  return <div className={styles.mainWrapper}>{children}</div>;
};

export default MainWrapper;
