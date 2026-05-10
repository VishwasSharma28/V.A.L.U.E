'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ListItem {
  id: string | number;
  label: string;
  subtitle?: string;
  value?: string;
  badge?: string;
  color?: string;
}

interface AnimatedListProps {
  items: ListItem[];
  onItemSelect?: (item: ListItem) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  displayScrollbar?: boolean;
}

export default function AnimatedList({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = false,
}: AnimatedListProps) {
  const [selected, setSelected] = useState<string | number | null>(
    items[0]?.id ?? null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const selectItem = useCallback(
    (item: ListItem) => {
      setSelected(item.id);
      onItemSelect?.(item);
    },
    [onItemSelect]
  );

  useEffect(() => {
    if (!enableArrowNavigation) return;

    const handleKey = (e: KeyboardEvent) => {
      const idx = items.findIndex((it) => it.id === selected);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[Math.min(idx + 1, items.length - 1)];
        if (next) selectItem(next);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[Math.max(idx - 1, 0)];
        if (prev) selectItem(prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, items, enableArrowNavigation, selectItem]);

  return (
    <div className="relative h-full flex flex-col">
      {showGradients && (
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />
      )}

      <div
        ref={containerRef}
        className={`flex-1 overflow-y-auto pr-1 ${
          displayScrollbar ? '' : 'scrollbar-hide'
        }`}
        style={{ scrollbarWidth: displayScrollbar ? 'thin' : 'none' }}
      >
        <AnimatePresence initial={false}>
          {items.map((item, i) => {
            const isSelected = item.id === selected;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.28, delay: i * 0.04, ease: 'easeOut' }}
                onClick={() => selectItem(item)}
                className={`relative cursor-pointer rounded-2xl p-4 mb-2 transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#1A1A1A] border border-[#3D7A6A]/40'
                    : 'bg-transparent border border-transparent hover:bg-[#111111] hover:border-white/5'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#3D7A6A] rounded-full"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                )}

                <div className="flex items-center justify-between pl-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.color && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                      <p
                        className={`text-sm font-semibold truncate ${
                          isSelected ? 'text-white' : 'text-zinc-300'
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-zinc-500 mt-0.5 pl-4 truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end ml-2 flex-shrink-0">
                    {item.value && (
                      <span className="text-sm font-mono text-zinc-300">
                        {item.value}
                      </span>
                    )}
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 mt-1">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {showGradients && (
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
      )}
    </div>
  );
}
