import React from "react";

type AppContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const AppContainer: React.FC<AppContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`max-w-7xl mx-auto px-3 ${className}`}>{children}</div>
  );
};
