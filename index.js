const { PrismaClient } = require('@prisma/client')
const Express = require("express")

const App = Express()

const prisma = new PrismaClient()

const {createHash} = require('crypto')

const SHA256 = (MSG) => createHash("sha256").update(MSG).digest("hex")

App.get("/version", (req, res) => {
  return res.send("v1")
})

App.get("/authenticate", async (req, res) => {
  const {a, b, c} = req.query
  if(!a) return res.send("Missing [a] query")
  if(!b) return res.send("Missing [b] query")
  if(!c) return res.send("Missing [c] query")

  const Key = a
  const Seed = b
  const Project = c

  const Response = await prisma.license.findFirst({
    where: {
      id: Key,
      projectId: Project
    }
  })

  if(!Response) return res.send("Invalid session.")

  var ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

  const IPAuth = SHA256(ip)

  if (Response.auth === IPAuth) {
    return res.send({
      success: true,
      free: Response.free,
      validator: SHA256(Seed)
    })
  }
  

  return res.send("Hello world!")
})

const PORT = process.env.PORT || 3000

App.listen(PORT, () => {
  console.log("Started")
})