'use client';
import React from 'react';
import { ConfirmProvider as Provider } from "material-ui-confirm";

function ConfirmProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
  
    return <Provider>{children}</Provider>
}

export default ConfirmProvider
