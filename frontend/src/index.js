// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import {BrowserRouter} from 'react-router-dom';

// ReactDOM.render(
//   <BrowserRouter>
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   </BrowserRouter>,
//   document.getElementById('root')
// );



// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );


import React from 'react';
import { createRoot } from 'react-dom/client';  // Updated import for React 18+
import './index.css';  // Global CSS for the app
import App from './App';
import { BrowserRouter } from 'react-router-dom';  // Import for routing

const container = document.getElementById('root');  // Get the root container element
const root = createRoot(container);  // Create a root container for React 18+

// Render the app within StrictMode and BrowserRouter
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

