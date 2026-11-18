import React from 'react';

interface ToggleSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  'aria-label'?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  'aria-label': ariaLabel,
}) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`w-[38px] h-[22px] rounded-full p-[2px] transition-colors relative flex items-center focus:outline-none focus:ring-2 focus:ring-secondary ${
        checked ? 'bg-[#527781]' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`w-[18px] h-[18px] rounded-full bg-white shadow-xs transition-transform transform ${
          checked ? 'translate-x-[16px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
