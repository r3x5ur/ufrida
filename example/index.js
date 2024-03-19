const uFrida = require('../')
const { scriptSource } = require('./script')

const sleep = (d) => new Promise((r) => setTimeout(r, d))

;(async () => {
  const pid = await uFrida.spawn('C:\\Windows\\notepad.exe', { argv: ['', 'C:\\Windows\\win.ini'] })
  await sleep(100)
  const session = await uFrida.attach(pid)
  const script = await session.createScript(scriptSource)
  script.message.connect((msg) => console.log(msg.payload))
  await script.load()
  await uFrida.resume(pid)
  setTimeout(() => uFrida.kill(pid), 5000)
})()
