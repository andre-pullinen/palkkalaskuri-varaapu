const requireModule = require.context('.', true, /\.json$/)
const locales = {}

requireModule.keys().forEach(filename => {
  const path = filename.split('/')
  if (!locales[path[1]]) {
    locales[path[1]] = {}
  }
  locales[path[1]][path[2].replace('.json', '')] = requireModule(filename).default || requireModule(filename)
})
export default locales
