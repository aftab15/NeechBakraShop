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
                background: '#111',
                color: '#F0EBE3',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '13px',
                borderRadius: '3px',
              },
              success: {
                iconTheme: { primary: '#FF3500', secondary: '#111' },
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
