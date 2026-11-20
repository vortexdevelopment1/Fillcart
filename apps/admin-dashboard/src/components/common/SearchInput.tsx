
import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
}

/**
 * Shared Search Input Component with Clear (X) button
 *
 * - Appears with leading search icon on the left.
 * - Shows an interactive Clear (X) button on the right ONLY when input has text.
 * - Clicking (X) clears value, triggers onChange(''), and returns focus to input.
 * - Pressing Escape key while focused clears the text.
 * - Adequate right padding prevents long text from sliding under the X button.
 * - Ellipsis prevents text from overflowing boundaries.
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  containerClassName = '',
  onKeyDown,
  ...restProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      e.preventDefault();
      e.stopPropagation();
      onChange('');
    }
    onKeyDown?.(e);
  };

  const hasValue = Boolean(value && value.length > 0);

  return (
    <div className={`relative flex items-center min-w-0 ${containerClassName}`}>
      {/* Leading Search Icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/40 pointer-events-none flex-shrink-0" />

      {/* Text Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full min-w-0 pl-9 pr-8 text-xs font-sans text-ink placeholder:text-ink/40 focus:outline-none transition-all truncate ${className}`}
        style={{
          paddingLeft: '36px',
          paddingRight: hasValue ? '32px' : '14px',
          ...restProps.style,
        }}
        {...restProps}
      />

      {/* Clear (X) Button - Only rendered when input has text */}
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          tabIndex={-1}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-6 sm:h-6 min-w-[28px] min-h-[28px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-full text-ink/40 hover:text-ink hover:bg-black/[0.06] transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer"
        >
          <X className="w-3.5 h-3.5 flex-shrink-0 stroke-[2]" />
        </button>
      )}
    </div>
  );
};
