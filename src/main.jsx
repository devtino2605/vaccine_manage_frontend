import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import Root from './App.jsx';
import { store } from './redux/store.js';
import enUS from 'antd/locale/en_US';

import './index.css';
import { ConfigProvider } from 'antd';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
import { App } from 'antd';

root.render(

  <React.StrictMode>
    <App>
      <ConfigProvider locale={enUS}>
        <Provider store={store}>
          <Root />
        </Provider>
      </ConfigProvider>
    </App>
  </React.StrictMode>,
);