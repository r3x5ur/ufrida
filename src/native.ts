export const binding = (() => {
  try {
    return require('../build/Release/frida_binding.node')
  } catch (e) {
    console.error('Bindings not found, Please reinstall the package.')
  }
})()
