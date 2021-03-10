import React from 'react';
import { render } from 'react-dom';

const App = () => (
  <section>
    <h1>Webpack Dev Server Reproducible #3040</h1>
    <p>
      Check
      {' '}
      <a href="https://github.com/webpack/webpack-dev-server/issues/3040">bug report</a>
      {' '}
      on Github.
    </p>
  </section>
);

render(
  <App />,
  document.getElementById('app'),
);
