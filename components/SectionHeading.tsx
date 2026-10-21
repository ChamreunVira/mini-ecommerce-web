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
        <h1 className="text-xl font-medium">{title}</h1>
        {description && <p className="text-[16px] text-gray-800">{description}</p>}
      </div>
      {/* action */}
      <div>{children}</div>
    </div>
  );
}
