import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from '@/routers/AppRouter'
import QueryProvider from '@/providers/QueryProvider'
import { Provider } from 'react-redux'
import { store } from '@/config/store'
import ThemeProvider from '@/context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryProvider>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </QueryProvider>
  </Provider>
)
