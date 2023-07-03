/* eslint-disable import/prefer-default-export */
export function numericOptions(count: number) {
  return (
    <>
      {Array.from(Array(count))
        .map((_val, index) => index + 1)
        .map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
    </>
  );
}
