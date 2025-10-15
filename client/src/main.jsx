import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from '@/routers/AppRouter'
import QueryProvider from '@/providers/QueryProvider'
import StoreProvider from '@/providers/StoreProvider'

createRoot(document.getElementById('root')).render(
  <StoreProvider>
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  </StoreProvider>
)