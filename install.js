const { arch, platform } = require('node:os')
const path = require('node:path')
const https = require('node:https')
const fs = require('node:fs/promises')
const tar = require('tar')
const { HttpsProxyAgent } = require('https-proxy-agent')
const { name } = JSON.parse(require('fs').readFileSync('package.json', 'utf8'))

const logPrefix = `[${name}]`
const error = (...args) => console.error(logPrefix, ...args)
const warn = (...args) => console.warn(logPrefix, ...args)
const log = (...args) => console.warn(logPrefix, ...args)

// 从环境变量中读取代理 URL
const proxyUrl = process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY

if (!proxyUrl) {
  warn('Environment variable HTTPS_PROXY or HTTP_PROXY not set.')
}
let agent

/**
 * @param {string | URL} url
 * @param {import('https').RequestOptions & {showProgress?:boolean; progressPrefix?:string}} [options]
 * @return {Promise<Buffer>}
 * */
function _get(url, options) {
  options = options || {}
  if (proxyUrl) {
    if (!agent) agent = new HttpsProxyAgent(proxyUrl)
    options.agent = agent
  }
  options.headers = options.headers || {}
  options.headers['User-Agent'] = options.headers['User-Agent'] || 'Mozilla/5.0'

  let pIndex = 0
  const progress = (p, prefix) => {
    const is_1 = p === -1
    p = Math.abs(p)
    const colorGreen = '\x1b[32m'
    const colorBlue = '\x1b[34m'
    const colorYellow = '\x1b[33m'
    const bgGrey = '\x1b[100m'
    const colorBolder = '\x1b[1m'
    const colorEnd = '\x1b[0m'
    const tl = Math.floor(process.stdout.columns / 2)
    const cur = Math.floor(tl * p)

    let line = '='.repeat(cur)
    if (cur < tl - 1) line += '>'
    if (is_1) pIndex = 0
    const g1 = `${colorBlue}${prefix || 'Fetching'}${colorEnd}`
    const g_ = `${colorGreen}${colorBolder}${'|/-\\'.split('')[pIndex++ % 4]}${colorEnd}`
    const g2 = `[${bgGrey}${line.padEnd(tl - 1, ' ')}${colorEnd}]`
    const g3 = `${colorYellow}${(p * 100).toFixed(2)}%${colorEnd}`

    process.stdout.write(`\r${logPrefix} ${g1} ${g_} ${g2}${g3}`)
    process.stdout.clearLine && process.stdout.clearLine(1) // 清除光标右侧
    if (is_1) process.stdout.write('\n')
  }

  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      const chunks = []
      const headers = res.headers
      const contentLength = +headers['content-length'] || 0
      let currentLength = 0
      if (res.statusCode >= 400) {
        reject(new Error(`Failed to fetch ${url}, status code: ${res.statusCode}`))
        return
      }
      // follow redirect
      if (res.statusCode > 300 && res.statusCode < 400 && headers.location) {
        return _get(headers.location, options).then(resolve, reject)
      }
      res.on('data', (chunk) => {
        chunks.push(chunk)
        if (!options.showProgress) return
        currentLength += chunk.length
        progress(currentLength / contentLength, options.progressPrefix)
      })
      res.on('error', (err) => {
        if (options.showProgress) progress(-1, 'Fail')
        reject(err)
      })
      res.on('end', () => {
        if (options.showProgress) progress(-1, 'Done')
        resolve(Buffer.concat(chunks))
      })
    })
  })
}

async function installBinding() {
  const downTemp = `https://github.com/frida/frida/releases/download/%v/frida-v%v-node-v%d-%p-%a.tar.gz`

  log(`Getting binding download url`)
  const data = await _get('https://api.github.com/repos/frida/frida/releases/latest')
  const { tag_name, assets } = JSON.parse(data.toString('utf8'))
  const moduleVersionList = assets
    .filter((item) => item.name.indexOf('-node-') !== -1)
    .map((item) => item.name.match(/node-v(\d+)/)[1])
  const mod = process.versions.modules
  if (moduleVersionList.indexOf(mod) === -1) {
    const version = await _get('https://raw.githubusercontent.com/nodejs/node/main/doc/abi_version_registry.json')
    const mods = JSON.parse(version.toString())['NODE_MODULE_VERSION']
    const filteredMods = mods
      .filter((item) => moduleVersionList.indexOf(String(item.modules)) !== -1)
      .map((item) => 'v' + item.versions)
    error(`No binding found for Node.js version ${process.version}`)
    error(`Support Node.js versions: ${filteredMods.join(', ')}`)
    process.exit(-1)
  }

  const download = downTemp
    .replace(/%v/g, tag_name)
    .replace(/%d/g, mod)
    .replace(/%p/g, platform())
    .replace(/%a/g, arch())

  const filename = path.basename(download)
  log(`Starting download from ${download}`)
  const buffer = await _get(download, { showProgress: true, progressPrefix: `Downloading` })
  await fs.writeFile(filename, buffer)
  // 解压文件
  log(`Extracting ${filename}`)
  await tar.x({ file: filename })
  await fs.unlink(filename)
  log(`Binding installed successfully`)
}

;(async () => {
  try {
    try {
      require('./build/Release/frida_binding')
    } catch (e) {
      await installBinding()
    }
  } catch (e) {
    error(e)
    process.exit(-1)
  }
})()
