const { PrismaClient } = require('@prisma/client')
const Express = require("express")

const App = Express()

App.get("/version", (req, res) => {
  console.log("a")
  res.send("v1")
})

App.get("/authenticate", (req, res) => {
  console.log("b")
  return res.send("Hello world!")
})

const PORT = process.env.PORT || 3000

App.listen(PORT, () => {
  console.log("Started")
})