import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/health-check')({
  GET: () => {
    console.log('Health checked')
    return new Response('OK')
  },
})
