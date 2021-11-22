import { createApp } from './app'

export default context => {
  const { app } = createApp()
  return app
}
if (module.hot) {
    console.log('module')
  module.hot.accept();
}
