const path = require("path");
const fs = require('fs')
const MFS = require("memory-fs");
const webpack = require("webpack");
// 读取客户端配置
const clientConfig = require("./webpack.client.config");
// 读取服务端配置
const serverConfig = require("./webpack.server.config");
// 热更新插件
const webpackHotMiddleware = require("webpack-hot-middleware");

// 读取文件
const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), "utf-8");
  } catch (e) {}
};
/* 
app 服务器
templatePath:模板
cb:回调方法
*/
module.exports = function setupDevServer(app,templatePath,callback) {
  // webpack包
  let bundle;
  // 客户端清单
  let clientManifest;
  // 模板
  let template;
  return new Promise((resolve) => {
    const r = ()=>{
        if (bundle && clientManifest) {
            resolve()
            callback(bundle,{
                clientManifest,
                template
            })
        }
    }
    template = fs.readFileSync(templatePath, 'utf-8')
    // 生成一个与webpack的compiler绑定的中间件，然后在express启动的服务app中调用这个中间件
    // 对更改的文件进行监控,在内存内自动打包
    const clientCompiler = webpack(clientConfig);
    const devMiddleware = require("webpack-dev-middleware")(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      noInfo: true,
      serverSideRender: true,
    });
    app.use(devMiddleware);
    // hot middleware
    app.use(webpackHotMiddleware(clientCompiler));
    clientCompiler.plugin("done", (stats) => {
      stats = stats.toJson();
      stats.errors.forEach((err) => console.error(err));
      stats.warnings.forEach((err) => console.warn(err));
      if (stats.errors.length) return;
      clientManifest = JSON.parse(
        readFile(devMiddleware.fileSystem, "vue-ssr-client-manifest.json")
      );
      r();
    });

    const serverCompiler = webpack(serverConfig);
    // 获取内存中的文件
    const mfs = new MFS();
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
      if (err) throw err;
      stats = stats.toJson();
      if (stats.errors.length) return;
      bundle = JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json"));
      r();
    });
  });
};
