import { ChangeEvent, PropsWithChildren, useState } from "react";

interface FocusableInputProps {
  type: React.HTMLInputTypeAttribute | undefined;
  id: string;
  placeholder?: string;
  required?: boolean;
  name?: string;
  onChange?: (e: ChangeEvent) => void;
  onFocus?: () => void;
}

const FocusableInput: React.FC<PropsWithChildren<FocusableInputProps>> = ({
  type,
  id,
  placeholder,
  required,
  name,
  onChange,
  onFocus,
}) => {
  const [value, setValue] = useState("");

  const update = (e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setValue(value);
    onChange?.(e);
  };

  return (
    <div className="flex w-full flex-col">
      <input
        className="neu-container rounded-xl px-3 py-2 text-icon-hover focus:border-icon-active focus:outline-none"
        style={{
          WebkitAppearance: "none",
        }}
        type={type}
        id={id}
        placeholder={placeholder}
        required={required}
        name={name}
        onFocus={onFocus}
        onChange={update}
        value={value}
      />
    </div>
  );
};

export default FocusableInput;
