const originalAppend = document.head.appendChild;
document.head.appendChild = function (el) {
  if (el.tagName === "SCRIPT") {
    console.trace("SCRIPT ADDED:", el.src);
  }
  return originalAppend.call(this, el);
};

window.require = undefined;
window.define = undefined;

import React from 'react'
import {createRoot} from "react-dom/client"
import App from './App'

const root = createRoot(document.getElementById('root'));
root.render(<App />)