import React from 'react';

interface SectionHeadingProps {
  children?: React.ReactNode;
  title: string;
  description?: string;
  badge?: string;
}

export default function SectionHeading({ children, title, description, badge }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {badge && (
          <span className="mb-1.5 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#C8102E]">
            {badge}
          </span>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500 sm:text-base">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
