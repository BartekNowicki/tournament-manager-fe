/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */

import { appHeight } from "../../utils/settings";

interface IMainWrapperProps {
  children: JSX.Element[];
}

const MainWrapper: React.FC<IMainWrapperProps> = ({
  children,
}): JSX.Element => {
  const primaryMainBg = "bg-transparent";

  return (
    <div
      className={`max-w-7xl mx-auto border border-black ${primaryMainBg} ${appHeight}`}
    >
      {children}
    </div>
  );
};

export default MainWrapper;
