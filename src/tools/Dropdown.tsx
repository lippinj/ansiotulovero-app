interface DropdownProps {
  current: string;
  options: string[];
  set: (value: string) => void;
  style?: string;
}
export function Dropdown({ current, options, set, style }: DropdownProps) {
  style = style ?? "border-1 p-1 pl-2 ml-auto mr-auto mt-1 mb-1 rounded-md";
  return (
    <select
      value={current}
      onChange={(e) => set(e.target.value)}
      className={style}
    >
      {options.map((opt) => (
        <option value={opt} key={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
