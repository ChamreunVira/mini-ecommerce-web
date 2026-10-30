import React from 'react';

interface SectionHeadingProps {
  children?: React.ReactNode;
  title: string;
  description?: string;
}

export default function SectionHeading({ children, title, description }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between">
      {/* detail */}
      <div>
        <h2 className="text-xl font-medium">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
      {/* action */}
      <div>{children}</div>
    </div>
  );
}
