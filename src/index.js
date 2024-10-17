import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NavigationProvider } from './context/navigation';
import './index.css';
import { registerLicense } from '@syncfusion/ej2-base';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter as Router } from 'react-router-dom';

// Registering Syncfusion license key
registerLicense(
  'ORg4AjUWIQA/Gnt2UlhhQlVMfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX9Td0NjXXpdcHddQGdV'
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <NavigationProvider>
      <Router>
        <App />
      </Router>
    </NavigationProvider>
  </Provider>
);
