import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

// QueryClient is the cache manager for all server data fetched via TanStack Query.
// One instance is created here and shared across the entire app via QueryClientProvider.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // data stays "fresh" for 60s — no refetch on component remount within that window
      retry: 1,             // retry a failed request once before showing an error
    },
  },
})

// createRoot mounts the React app onto the <div id="root"> in index.html.
// Every component below is wrapped in these three providers:
//   StrictMode       — highlights potential bugs in development (double-renders on purpose)
//   QueryClientProvider — makes the query cache available to any component via useQuery/useMutation
//   BrowserRouter    — enables client-side routing (URL changes without full page reloads)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
