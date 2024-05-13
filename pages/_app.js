// pages/_app.js

import React from 'react';
import '../styles/globals.css'; // Import global styles here

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
