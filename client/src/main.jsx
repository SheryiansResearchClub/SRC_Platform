import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from '@/routers/AppRouter'
import QueryProvider from '@/providers/QueryProvider'
import { Provider } from 'react-redux'
import { store } from '@/config/store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  </Provider>
)