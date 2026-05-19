import React, { useState } from 'react';
import { HelpCircle, PlayCircle } from 'lucide-react';

interface HomeHelpWidgetProps {
  isDark: boolean;
  onStartTutorial: () => void;
}

export const HomeHelpWidget: React.FC<HomeHelpWidgetProps> = ({ isDark, onStartTutorial }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      {open && (
        <div
          className={
            `mb-3 w-[340px] max-w-[calc(100vw-48px)] rounded-2xl border shadow-xl ` +
            (isDark
              ? 'bg-[#060c18]/95 border-white/10 text-white'
              : 'bg-white/95 border-gray-200 text-slate-900')
          }
          style={{
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <div className="px-4 pt-4 pb-2 flex items-start gap-3">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.18em] opacity-70">Manual</div>
              <div className="text-base font-semibold leading-snug">How to use CampusGuide</div>
            </div>
            <button
              className={
                `ml-auto text-xs font-medium px-2 py-1 rounded-lg transition-colors ` +
                (isDark ? 'hover:bg-white/10' : 'hover:bg-black/5')
              }
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <div className={
            `px-4 pb-3 text-sm leading-relaxed ` +
            (isDark ? 'text-white/85' : 'text-slate-700')
          }>
            <ul className="space-y-2">
              <li>
                <span className="font-semibold">Search:</span> type a building or service name to get results.
              </li>
              <li>
                <span className="font-semibold">Categories:</span> open Categories to explore Academic, Libraries, Dining, Sports, Student Centers, and Health.
              </li>
              <li>
                <span className="font-semibold">Voice:</span> tap the mic in Search to speak your query (if supported).
              </li>
            </ul>
          </div>

          <div className="px-4 pb-4 flex items-center justify-between gap-3">
            <button
              className={
                `inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ` +
                (isDark
                  ? 'bg-white/10 hover:bg-white/15 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900')
              }
              onClick={() => {
                setOpen(false);
                onStartTutorial();
              }}
            >
              <PlayCircle className="w-4 h-4" />
              Start tutorial
            </button>

            <div className={
              `text-xs opacity-70 ` +
              (isDark ? 'text-white/70' : 'text-slate-500')
            }>
              Landing page only
            </div>
          </div>
        </div>
      )}

      <button
        className={
          `inline-flex items-center gap-2 px-3 py-2 rounded-full border shadow-lg transition-colors ` +
          (isDark
            ? 'bg-[#060c18]/90 border-white/10 text-white hover:bg-[#060c18]'
            : 'bg-white/90 border-gray-200 text-slate-900 hover:bg-white')
        }
        style={{
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Help and manual"
      >
        <HelpCircle className={"w-4 h-4 " + (isDark ? 'text-cyan-300/90' : 'text-blue-600')} />
        <span className="text-xs font-semibold">Help</span>
      </button>
    </div>
  );
};
