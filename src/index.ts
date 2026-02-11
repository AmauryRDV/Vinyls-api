import { serve } from '@hono/node-server'
import app from './app.js'
import { DbConnect } from './db.js'

const port = 3000

DbConnect().then(() => {
  serve({
    fetch: app.fetch,
    port
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })
})
