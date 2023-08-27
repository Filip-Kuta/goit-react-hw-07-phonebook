import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'components/store';
import './index.css';
import ContactApp from 'components/ContactApp';

ReactDOM.render(
  <Provider store={store}>
    <ContactApp />
  </Provider>,
  document.getElementById('root')
);
