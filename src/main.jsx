import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './app/store'
import App from './App'
import './index.css'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ConvexProvider client={convex}>
        <Provider store={store}>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1a1a1a',
                color: '#e8e8e8',
                border: '1px solid rgba(57,255,20,0.3)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#39ff14', secondary: '#0a0a0a' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' },
              },
            }}
          />
        </Provider>
      </ConvexProvider>
    </ConvexAuthProvider>
  </StrictMode>,
)
