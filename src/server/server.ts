import app from './app.js'
import uiMiddleware from './middleware/ui.middleware.js'

const port = process.env.PORT || 5173

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(uiMiddleware)

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
