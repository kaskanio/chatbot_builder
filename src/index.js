import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NavigationProvider } from './context/navigation';
import './index.css';
import { registerLicense } from '@syncfusion/ej2-base';
import { Provider } from 'react-redux';
import { store } from './store';

// Registering Syncfusion license key
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NGaF1cWGhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEZjUH9YcXdWQ2NcUUBzXg=='
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    {' '}
    <NavigationProvider>
      <App />
    </NavigationProvider>
  </Provider>
);
