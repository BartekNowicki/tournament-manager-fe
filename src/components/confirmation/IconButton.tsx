/* eslint-disable react/require-default-props */
/* eslint-disable react/button-has-type */
interface Props {
  children: React.ReactNode;
  classNameProps: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function IconButton(props: Props) {
  const { children, onClick, classNameProps } = props;
  return (
    <button
      onClick={onClick}
      className={`focus:outline-none focus:border-none hover:bg-gray-400 hover:bg-opacity-25 p-2 rounded-full inline-flex items-center ${classNameProps}`}
    >
      {children}
    </button>
  );
}
