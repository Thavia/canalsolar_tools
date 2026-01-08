import { useEffect, useMemo, useRef, useState } from 'react';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function SearchableSelect(props: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  allowClear?: boolean;
  className?: string;
}) {
  const {
    value,
    onChange,
    options,
    placeholder = 'Selecione…',
    disabled,
    searchable = true,
    allowClear = true,
    className,
  } = props;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const selected = useMemo(() => options.find((o) => o.value === value) || null, [options, value]);

  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return options;
    return options.filter((o) => {
      const hay = `${o.label} ${o.value} ${o.keywords || ''}`;
      return norm(hay).includes(q);
    });
  }, [options, query]);

  const firstSelectableIndex = useMemo(() => {
    for (let i = 0; i < filtered.length; i++) {
      if (!filtered[i]?.disabled) return i;
    }
    return 0;
  }, [filtered]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(firstSelectableIndex);
  }, [firstSelectableIndex, open]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => searchRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const pick = (opt: Option) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  };

  const moveActive = (delta: number) => {
    if (filtered.length === 0) return;
    let idx = activeIndex;
    for (let tries = 0; tries < filtered.length; tries++) {
      idx = (idx + delta + filtered.length) % filtered.length;
      if (!filtered[idx]?.disabled) {
        setActiveIndex(idx);
        return;
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[activeIndex];
      if (opt) pick(opt);
    }
  };

  return (
    <div ref={rootRef} className={cx('relative', className)} onKeyDown={onKeyDown}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cx(
          'w-full flex items-center justify-between gap-3',
          'px-3 py-2 rounded-lg',
          'bg-white/10 border border-white/15',
          'text-left text-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-400/60',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cx('truncate', selected ? 'text-white' : 'text-white/50')}>{selected?.label || placeholder}</span>

        <span className="flex items-center gap-2 shrink-0">
          {allowClear && value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange('');
                setQuery('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange('');
                  setQuery('');
                }
              }}
              className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/15"
              title="Limpar"
            >
              ×
            </span>
          )}
          <span className={cx('text-white/70 transition-transform', open && 'rotate-180')}>▾</span>
        </span>
      </button>

      {open && (
        <div
          className={cx(
            'absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/15 shadow-xl',
            'bg-primary-950/95 backdrop-blur'
          )}
        >
          {searchable && (
            <div className="p-2 border-b border-white/10">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar…"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400/60"
              />
            </div>
          )}

          <ul role="listbox" className="max-h-[320px] overflow-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-white/60">Nenhuma opção</li>
            ) : (
              filtered.map((opt, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => {
                      // mousedown para evitar que o botão perca foco antes do click
                      e.preventDefault();
                      pick(opt);
                    }}
                    className={cx(
                      'px-3 py-2 rounded-lg text-sm cursor-pointer select-none',
                      opt.disabled && 'opacity-50 cursor-not-allowed',
                      isActive ? 'bg-white/10 text-white' : 'text-white/85 hover:bg-white/10',
                      isSelected && 'border border-primary-400/40'
                    )}
                    title={opt.label}
                  >
                    <div className="truncate">{opt.label}</div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

