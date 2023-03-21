/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
// import styles from "./mainWrapper.module.css";

interface IMainWrapperProps {
  children: JSX.Element[];
}

const MainWrapper: React.FC<IMainWrapperProps> = ({
  children,
}): JSX.Element => {
  const primaryMainBg = "bg-transparent";
  return (
    <div className={`max-w-7xl mx-auto border border-black ${primaryMainBg}`}>
      {children}
    </div>
  );
};

export default MainWrapper;
