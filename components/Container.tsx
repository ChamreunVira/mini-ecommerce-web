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
    <div className={`max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
  );
};
