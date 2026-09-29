import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ThemeProvider from './theme/ThemeProvider.jsx'
// Side-effect import: the stylesheet is the whole point of the line, and there
// is no value to bind. It stays first so the styles are in place before the
// app's first commit.
// oxlint-disable-next-line import/no-unassigned-import
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
