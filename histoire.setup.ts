import './src/index.css'

export function setupVue3({ app }) {
  app.provide('test', 'hello')
  // app.use(...)
}
