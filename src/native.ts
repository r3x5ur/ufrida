export const binding = (() => {
  try {
    try {
      return require('../build/Release/frida_binding.node')
    } catch (e) {
      return require('../build/frida_binding.node')
    }
  } catch (e) {
    console.error('Bindings not found, Please reinstall the package.')
  }
})()
