// Libraries
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from 'react-hot-loader';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

// Components
import NextApp from './NextApp';
import registerServiceWorker from './registerServiceWorker';

// Styles
import { style } from './consoleStyle.js';

function noop() { }

if (process.env.NODE_ENV !== 'development') {

  disableReactDevTools()
  console.log("%cPlease do not share your console data to anyone", style);
  console.log = noop;
  console.warn = noop;
  console.error = noop;
}

// Wrap the rendering in a function:
const render = Component => {
  // console.log(getDateTimeOfClientTimeZone(Date(), 'YYYY/MM/DD H:m:s ZZ'))
  ReactDOM.render(
    // Wrap App inside AppContainer
    <AppContainer>
      <NextApp />
    </AppContainer>,
    document.getElementById('root')
  );
};

// Do this once
registerServiceWorker();
// unregister();
// Render once
render(NextApp);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./NextApp', () => {
    render(NextApp);
  });
}
