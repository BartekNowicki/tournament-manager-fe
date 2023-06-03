interface ICheckPlayerRowProps {
  handleCheck(e: React.ChangeEvent<HTMLInputElement>): void;
  id: number;
  isChecked: (id: number) => boolean;
}
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const MyTest: React.FC<ICheckPlayerRowProps> = ({
  handleCheck,
  id,
  isChecked,
}): JSX.Element => {
  return (
    <th>
      <label>
        <input
          type="checkbox"
          className="checkbox"
          id={id.toString()}
          checked={isChecked(id)}
          onChange={handleCheck}
        />
      </label>
    </th>
  );
};

export default MyTest;
