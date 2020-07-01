import * as http from 'http'
import app from './app'
import * as dotenv from 'dotenv'
dotenv.config()

const server = http.createServer(app)
let currentApp = app

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
  console.log(`server ready at http://localhost:${PORT}`)
})

if (module.hot) {
  module.hot.accept('./app', () => {
    try {
      server.removeListener('request', currentApp)
      server.on('request', app)
      currentApp = app
    } catch (error) {
      console.log(error)
    }
  })
  module.hot.accept()

  module.hot.dispose(() => server.close())
}
