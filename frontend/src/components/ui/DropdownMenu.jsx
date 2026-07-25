import { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

/**
 * A flexible dropdown menu built on a trigger + floating panel pattern.
 *
 * Usage:
 *   <DropdownMenu trigger={<button>Open</button>}>
 *     <DropdownItem onClick={...}>Item</DropdownItem>
 *   </DropdownMenu>
 */
export function DropdownMenu({ trigger, children, align = 'right', className }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return

    function handleOutsideClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {trigger}
      </div>

      {/* Panel */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className={cn(
            'absolute z-50 mt-2 min-w-[180px] rounded-xl py-1',
            'bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]',
            'shadow-2xl',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * Individual item within a DropdownMenu.
 */
export function DropdownItem({ children, onClick, className, danger = false, disabled = false }) {
  return (
    <button
      role="menuitem"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left',
        'transition-colors duration-100 cursor-pointer',
        danger
          ? 'text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10'
          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-hover)]',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  )
}

/**
 * Visual separator between dropdown sections.
 */
export function DropdownSeparator() {
  return <hr className="my-1 border-[var(--color-border-default)]" role="separator" />
}

/**
 * Non-clickable header section within the dropdown.
 */
export function DropdownHeader({ children, className }) {
  return (
    <div
      className={cn(
        'px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider',
        className,
      )}
    >
      {children}
    </div>
  )
}
