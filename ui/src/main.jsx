import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

(window?.extensionsAPI?.registerResourceExtension) ?
  window.extensionsAPI.registerResourceExtension(
    App, "", "Pod", "Files", { icon: "fa-solid fa-file" }
  ) : ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
