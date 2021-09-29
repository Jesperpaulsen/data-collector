import { app } from './app'

const start = () => {
  const port = process.env.PORT || 3333
  const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Process terminated')
    })
  })
}

start()
