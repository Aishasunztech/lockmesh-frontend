import React from "react";
import ReactDOM from "react-dom";

import NextApp from './NextApp';

import {style} from './consoleStyle.js';

import registerServiceWorker from './registerServiceWorker';
// Add this import:
import {AppContainer} from 'react-hot-loader';

function noop() { }

if (process.env.NODE_ENV !== 'development') {

  console.log("%cPlease do not share your console data to anyone", style);
  
  console.log = noop;
  console.warn = noop;
  console.error = noop;
}

// Wrap the rendering in a function:
const render = Component => {
  ReactDOM.render(
    // Wrap App inside AppContainer
    <AppContainer>
      <NextApp/>
    </AppContainer>,
    document.getElementById('root')
  );
};

// Do this once
registerServiceWorker();
// unregister();
// Render once
render();

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./NextApp', () => {
    render(NextApp);
  });
}
