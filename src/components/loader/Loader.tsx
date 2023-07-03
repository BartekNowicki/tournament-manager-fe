/* eslint-disable react/function-component-definition */
const Loader: React.FC = (): JSX.Element => {
  return (
    <div className="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 loaderBackgroundImage">
      <div className="border-t-transparent border-solid animate-spin  rounded-full border-amber-800 border-8 h-64 w-64" />
    </div>
  );
};

export default Loader;
