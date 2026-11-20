import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useId, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface CustomSelectProps {
  value: string | number;
  onChange: (e: any) => void;
  options?: SelectOption[];
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  'aria-label'?: string;
}

interface DropdownPosition {
  top: number;
  left?: number;
  right?: number;
  minWidth: number;
  maxHeight: number;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  children,
  placeholder = 'Select...',
  className = '',
  disabled = false,
  name,
  id,
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [position, setPosition] = useState<DropdownPosition | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  const searchStringRef = useRef<string>('');

  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;

  // Parse options from either `options` prop or `children` containing <option> tags
  const parsedOptions = useMemo<SelectOption[]>(() => {
    if (options && options.length > 0) {
      return options;
    }
    const result: SelectOption[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const childProps = child.props as any;
        const optValue =
          childProps.value !== undefined ? childProps.value : childProps.children;
        result.push({
          value: optValue,
          label: childProps.children !== undefined ? childProps.children : String(optValue),
          disabled: Boolean(childProps.disabled),
        });
      }
    });
    return result;
  }, [options, children]);

  // Find selected option
  const selectedOption = useMemo(() => {
    return parsedOptions.find((opt) => String(opt.value) === String(value));
  }, [parsedOptions, value]);

  const selectedLabel = selectedOption
    ? selectedOption.label
    : value !== undefined && value !== ''
    ? value
    : placeholder;

  // Synchronous position calculation based on current trigger rect
  const calculatePosition = useCallback((): DropdownPosition | null => {
    if (!triggerRef.current) return null;
    const rect = triggerRef.current.getBoundingClientRect();

    // Use documentElement client width to exclude system scrollbar width
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollbarWidth = Math.max(0, window.innerWidth - viewportWidth);

    const margin = 12;
    const rightMargin = Math.max(margin, scrollbarWidth + margin);

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const gap = 6;

    // Estimate panel height based on parsedOptions if not yet measured
    const measuredHeight = panelRef.current ? panelRef.current.offsetHeight : parsedOptions.length * 40 + 16;
    const panelHeight = Math.min(260, measuredHeight);

    // Flip upward if space below is limited (< 220px) and space above is larger
    const shouldFlip = spaceBelow < 220 && spaceAbove > spaceBelow;

    const top = shouldFlip
      ? Math.max(margin, rect.top - panelHeight - gap)
      : rect.bottom + gap;

    const availableHeight = shouldFlip ? spaceAbove - gap - margin : spaceBelow - gap - margin;

    // Check if trigger is positioned in the right half of the screen
    const triggerCenter = rect.left + rect.width / 2;
    const isRightHalf = triggerCenter > viewportWidth / 2;

    if (isRightHalf) {
      // Right-aligned to trigger's right edge
      const distanceFromRight = viewportWidth - rect.right;
      const right = Math.max(rightMargin, distanceFromRight);
      return {
        top,
        right,
        left: undefined,
        minWidth: rect.width,
        maxHeight: Math.min(260, Math.max(120, availableHeight)),
      };
    } else {
      // Left-aligned to trigger's left edge
      const left = Math.max(margin, rect.left);
      return {
        top,
        left,
        right: undefined,
        minWidth: rect.width,
        maxHeight: Math.min(260, Math.max(120, availableHeight)),
      };
    }
  }, [parsedOptions.length]);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    const pos = calculatePosition();
    if (pos) {
      setPosition(pos);
      setIsOpen(true);
    }
  }, [disabled, calculatePosition]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setPosition(null);
  }, []);

  const toggle = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [disabled, isOpen, closeDropdown, openDropdown]);

  // Recalculate position synchronously before paint whenever open
  useLayoutEffect(() => {
    if (isOpen) {
      const pos = calculatePosition();
      if (pos) {
        setPosition(pos);
      }
    }
  }, [isOpen, calculatePosition]);

  // Listen for scroll & resize when opened
  useEffect(() => {
    if (!isOpen) return;

    const update = () => {
      const pos = calculatePosition();
      if (pos) {
        setPosition(pos);
      }
    };

    const handleScroll = (e: Event) => {
      if (panelRef.current && panelRef.current.contains(e.target as Node)) {
        return; // Allow internal scrolling within the dropdown list
      }
      update();
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', update);
    };
  }, [isOpen, calculatePosition]);

  // Outside click & Escape handlers
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        closeDropdown();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdown();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeDropdown]);

  // Set initial focused index when opening
  useEffect(() => {
    if (isOpen) {
      const currentIndex = parsedOptions.findIndex(
        (opt) => String(opt.value) === String(value)
      );
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [isOpen, parsedOptions, value]);

  // Auto-scroll focused item into view
  useEffect(() => {
    if (!isOpen || focusedIndex < 0 || !panelRef.current) return;
    const items = panelRef.current.querySelectorAll('[role="option"]');
    const targetItem = items[focusedIndex] as HTMLElement | undefined;
    if (targetItem) {
      targetItem.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, focusedIndex]);

  const handleSelect = (optionValue: string | number) => {
    const syntheticEvent = {
      target: {
        value: optionValue,
        name,
      },
      currentTarget: {
        value: optionValue,
        name,
      },
      value: optionValue,
    };
    onChange(syntheticEvent);
    closeDropdown();
    triggerRef.current?.focus();
  };

  // Keyboard navigation on trigger button
  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => {
        let next = prev + 1;
        while (next < parsedOptions.length && parsedOptions[next].disabled) {
          next++;
        }
        return next < parsedOptions.length ? next : prev;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => {
        let next = prev - 1;
        while (next >= 0 && parsedOptions[next].disabled) {
          next--;
        }
        return next >= 0 ? next : prev;
      });
    } else if (e.key === 'Home') {
      e.preventDefault();
      const first = parsedOptions.findIndex((o) => !o.disabled);
      if (first >= 0) setFocusedIndex(first);
    } else if (e.key === 'End') {
      e.preventDefault();
      for (let i = parsedOptions.length - 1; i >= 0; i--) {
        if (!parsedOptions[i].disabled) {
          setFocusedIndex(i);
          break;
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < parsedOptions.length) {
        const targetOption = parsedOptions[focusedIndex];
        if (!targetOption.disabled) {
          handleSelect(targetOption.value);
        }
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Type-ahead search
      e.preventDefault();
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
      searchStringRef.current += e.key.toLowerCase();
      searchTimeoutRef.current = window.setTimeout(() => {
        searchStringRef.current = '';
      }, 500);

      const matchIndex = parsedOptions.findIndex((opt) => {
        if (opt.disabled) return false;
        const text =
          typeof opt.label === 'string'
            ? opt.label
            : String(opt.value);
        return text.toLowerCase().startsWith(searchStringRef.current);
      });

      if (matchIndex >= 0) {
        setFocusedIndex(matchIndex);
      }
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={selectId}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        className={`inline-flex items-center justify-between gap-2 text-left select-none transition-all ${className} ${
          isOpen ? 'ring-2 ring-secondary border-transparent' : ''
        }`}
      >
        <span className="truncate block flex-1">{selectedLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-ink/50 flex-shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            id={listboxId}
            role="listbox"
            aria-activedescendant={
              focusedIndex >= 0 ? `${selectId}-opt-${focusedIndex}` : undefined
            }
            tabIndex={-1}
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: position.left !== undefined ? `${position.left}px` : undefined,
              right: position.right !== undefined ? `${position.right}px` : undefined,
              minWidth: `${position.minWidth}px`,
              width: 'max-content',
              maxWidth: 'calc(100vw - 24px)',
              maxHeight: `${position.maxHeight}px`,
              zIndex: 9999,
              transition: 'none',
              animation: 'dropdownFadeIn 120ms ease-out forwards',
            }}
            className="bg-white border border-primary/15 rounded-2xl shadow-card-hover p-1 overflow-hidden flex flex-col select-none"
          >
            <div
              className="overflow-y-auto w-full custom-themed-dropdown-list flex flex-col gap-0.5"
              style={{
                maxHeight: `${position.maxHeight - 8}px`,
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(82, 119, 129, 0.25) transparent',
              }}
            >
              {parsedOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);
                const isFocused = focusedIndex === idx;

                return (
                  <div
                    key={`${opt.value}-${idx}`}
                    id={`${selectId}-opt-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled}
                    onClick={() => {
                      if (!opt.disabled) {
                        handleSelect(opt.value);
                      }
                    }}
                    onMouseEnter={() => {
                      if (!opt.disabled) {
                        setFocusedIndex(idx);
                      }
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 text-xs font-sans rounded-xl cursor-pointer min-h-[40px] transition-colors leading-tight ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed text-ink/40'
                        : isSelected
                        ? 'bg-secondary text-white font-medium'
                        : isFocused
                        ? 'bg-secondary/10 text-ink'
                        : 'text-ink hover:bg-secondary/10'
                    }`}
                  >
                    <span className="whitespace-nowrap flex-1">{opt.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 stroke-[2.5] text-white flex-shrink-0 ml-2.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
