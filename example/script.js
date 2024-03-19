function scriptMain() {
  const CreateFileWFn = Process.getModuleByName('KERNEL32.DLL').getExportByName('CreateFileW')
  const GENERIC_ALL = 0x10000000
  const GENERIC_EXECUTE = 0x20000000
  const GENERIC_WRITE = 0x40000000
  const GENERIC_READ = 0x80000000

  Interceptor.attach(CreateFileWFn, {
    onEnter(args) {
      let message = 'CreateFileW: ' + args[0].readUtf16String() + ' MODE: '
      if ((args[1] & GENERIC_ALL) !== 0) message += 'GENERIC_ALL'
      if ((args[1] & GENERIC_EXECUTE) !== 0) message += 'GENERIC_EXECUTE'
      if ((args[1] & GENERIC_WRITE) !== 0) message += 'GENERIC_WRITE'
      if ((args[1] & GENERIC_READ) !== 0) message += 'GENERIC_READ'
      if (args[1] < GENERIC_ALL) message += 'NULL'
      send(message)
    },
  })
}

exports.scriptSource = `(${scriptMain.toString()})();`
