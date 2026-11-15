'use client';
import * as featureStyleFunctions from '@/features/navigation/styles/MobileNav.f983e191.styles.js';

import inlineStyles from '@/features/navigation/styles/MobileNav.styles';


import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon, ChevronDown, Brain, Code2 } from 'lucide-react';
import { T, getTheme, setTheme } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';

export default function MobileNav({ title, accent, items, extras, dropdownItems, zBase = 0 }) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const Z_BAR = 999998 + zBase;
  const Z_OVERLAY = 999999 + zBase;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!isMobile) return null;

  const active = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleClick = (item) => {
    if (item.onClick) { item.onClick(); setOpen(false); return; }
    if (item.href) router.push(item.href);
    setOpen(false);
  };

  return (
    <>
      {/* ── Fixed top bar ── */}
      <div style={featureStyleFunctions.s0({Z_BAR,T})}>
        <button onClick={() => setOpen(true)} style={featureStyleFunctions.s1({T})}>
          <Menu size={20} />
        </button>
        <div style={featureStyleFunctions.s2({T})}>
          {title}
        </div>
        <button onClick={() => setTheme(getTheme() === 'dark' ? 'light' : 'dark')} style={featureStyleFunctions.s3({T})}>
          {getTheme() === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* ── Centered menu overlay ── */}
      {open && (
        <div style={featureStyleFunctions.s4({Z_OVERLAY})} onClick={() => setOpen(false)}>
          <div 
            className="no-scrollbar"
            style={featureStyleFunctions.s5({T})} onClick={e => e.stopPropagation()}>
            {/* Close */}
            <div style={inlineStyles.s0}>
              <button onClick={() => setOpen(false)} style={featureStyleFunctions.s6({T})}>
                <X size={18} />
              </button>
            </div>

            {/* Dropdown for Tutor page main menu options */}
            {dropdownItems && dropdownItems.length > 0 && (
              <div style={inlineStyles.s1}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={featureStyleFunctions.s7({accent,T,dropdownOpen})}
                >
                  <div style={inlineStyles.s2}>
                    {title.includes('General') ? <Brain size={16} /> : <Code2 size={16} />}
                    <span>{title}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    style={featureStyleFunctions.s8({dropdownOpen})}
                  />
                </button>

                <div style={featureStyleFunctions.s9({dropdownOpen,T})}>
                  {dropdownItems.map(({ id, Icon, label }) => {
                    const activeItem = active(id);
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          router.push(id);
                          setOpen(false);
                        }}
                        style={featureStyleFunctions.s10({activeItem,accent,T})}
                        onMouseEnter={e => { if (!activeItem) e.currentTarget.style.background = T.s2; }}
                        onMouseLeave={e => { if (!activeItem) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Icon size={15} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation items */}
            {items && items.length > 0 && (
              <div style={featureStyleFunctions.s11({extras})}>
                {items.map((item) => {
                  const isActive = active(item.href || '');
                  return (
                    <button key={item.href || item.label}
                      onClick={() => handleClick(item)}
                      style={featureStyleFunctions.s12({isActive,accent,T})}>
                      {item.Icon && <item.Icon size={18} />}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Extras (page-specific settings) */}
            {(() => {
              const extraList = typeof extras === 'function' ? extras(() => setOpen(false)) : extras;
              if (!extraList || extraList.length === 0) return null;
              return (
                <div style={featureStyleFunctions.s13({T})}>
                  {extraList.map((section, i) => (
                    <div key={i} style={featureStyleFunctions.s14({i,extraList})}>
                      {section}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
