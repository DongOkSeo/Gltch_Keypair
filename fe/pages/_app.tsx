import { FC } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { PersistGate } from "redux-persist/integration/react";
import { createStore } from "@store";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { appWithTranslation } from "next-i18next";
import type { Page } from "@types";
import { MainLayout } from "@layouts";
import { PageLayout } from "@next/layouts/pageLayout";

interface PropsWithLayouts extends AppProps {
  Component: Page;
}
const store = createStore;
const persistor = persistStore(store);

const MyApp: FC<PropsWithLayouts> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Provider {...{ store }}>
      <PersistGate loading={null} persistor={persistor}>
        <MainLayout>{getLayout(<Component {...pageProps} />)} </MainLayout>
      </PersistGate>
    </Provider>
  );
};

export default appWithTranslation(MyApp);
