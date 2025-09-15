'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
}

export default function Dropdown({ trigger, children, align = 'left' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer au clic externe
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      <div
        className={`
          absolute mt-2 min-w-[10rem] rounded-2xl border bg-white shadow-lg ring-1 ring-black/5 z-20 
          transform transition-all duration-200 origin-top
          ${align === 'right' ? 'right-0' : 'left-0'}
          ${open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}
        `}
      >
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
}
