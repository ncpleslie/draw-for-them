import { ChangeEvent, PropsWithChildren } from "react";

interface FocusableInputProps {
  type: React.HTMLInputTypeAttribute | undefined;
  id: string;
  placeholder: string;
  onChange: (e: ChangeEvent) => void;
  onFocus: () => void;
}

const FocusableInput: React.FC<PropsWithChildren<FocusableInputProps>> = ({
  type,
  id,
  placeholder,
  onChange,
  onFocus,
}) => {
  return (
    <div className="flex w-full flex-col">
      <input
        className="neu-container rounded-xl px-3 py-2 text-icon-hover focus:border-icon-active focus:outline-none"
        type={type}
        id={id}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={onChange}
      />
    </div>
  );
};

export default FocusableInput;
