"use client";

import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

export function ReduxProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<></>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
