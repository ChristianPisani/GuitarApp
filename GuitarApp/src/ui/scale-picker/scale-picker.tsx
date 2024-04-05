import { availableScales } from "../../data/scales";
import { Scale } from "../../types/musical-terms";

export const ScalePicker = (props: { onChange: (scale: Scale) => void }) => {
  const { onChange } = props;

  return (
    <select
      onChange={(e) => {
        onChange(availableScales[Number(e.target.value)]);
      }}
      className={"p-3 bg-gray-100 border-gray-900 border-2 self-center"}
    >
      {availableScales.map((scale, index) => (
        <option key={index} value={index}>
          {scale.name}
        </option>
      ))}
    </select>
  );
};
