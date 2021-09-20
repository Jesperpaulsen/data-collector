import { app } from './app'

const start = () => {
  app.listen(3333, () => {
    console.log('Listening on port 3333')
  })
}

start()
