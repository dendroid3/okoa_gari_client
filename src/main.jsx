import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/output.css'
import App from './App.jsx'
import Providers from './store/redux-provider.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
    
  </StrictMode>,
)
