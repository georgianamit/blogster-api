import * as express from 'express'
import { Request, Response } from 'express'

const app = express()

app.use(express.static('public'))

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'it works',
  })
})

export default app
