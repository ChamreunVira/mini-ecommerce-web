import React from "react";
import { AppContainer } from "./Container";

const AppFooter = () => {
  return (
    <AppContainer className="w-full h-25 flex justify-between items-center">
      <h3 className="text-[16px]">
        <span className="font-semibold text-indigo-600">v</span>St4re
      </h3>
      <div className="text-sm">2026, Copyright by @ChamreunVira</div>
    </AppContainer>
  );
};

export default AppFooter;
