const fs = require("fs");
const path = require("path");
const MFS = require("memory-fs");
const webpack = require("webpack");
const chokidar = require("chokidar");
const clientConfig = require("./webpack.client.config");
const serverConfig = require("./webpack.server.config");
const webpackHotMiddleware = require("webpack-hot-middleware");

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
module.exports = function setupDevServer(app, templatePath, cb) {
  // webpack包
  let bundle;
  // 模板
  let template;
  // 客户端清单
  let clientManifest;
  // resolve
  let ready;
  const readyPromise = new Promise((r) => {
    ready = r;
  });

  const update = () => {
      // 当服务的bundle与客户端快照clientManifest都生成完成后，调用回调生成renderer
    if (bundle && clientManifest) {
      ready();
      cb(bundle, {
        template,
        clientManifest,
      });
    }
  };

  // read template from disk and watch
  template = fs.readFileSync(templatePath, "utf-8");
//   console.log('template',template)
  // 监控模板变化 生成新的模板信息
  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8");
    update();
  });

  // modify client config to work with hot middleware
  // 配置热更新
  // Add 'webpack-hot-middleware/client' into the entry array.
  // This connects to the server to receive notifications when the bundle rebuilds and then updates your client bundle accordingly.
//   clientConfig.entry.app = [
//     clientConfig.entry.app,
//     "webpack-hot-middleware/client"];
//   clientConfig.output.filename = "[name][hash].js";
//   clientConfig.plugins.push(
//     new webpack.HotModuleReplacementPlugin(),
//     // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
//     new webpack.NoEmitOnErrorsPlugin()
//   );

  // dev middleware
  // 生成一个与webpack的compiler绑定的中间件，然后在express启动的服务app中调用这个中间件
  // 对更改的文件进行监控,在内存内自动打包
  const clientCompiler = webpack(clientConfig);
  const devMiddleware = require("webpack-dev-middleware")(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true,
    serverSideRender: true 
  });
  app.use(devMiddleware);
  // hot middleware
  app.use(
    webpackHotMiddleware(clientCompiler)
  );
  clientCompiler.plugin("done", (stats) => {
    stats = stats.toJson();
    stats.errors.forEach((err) => console.error(err));
    stats.warnings.forEach((err) => console.warn(err));
    if (stats.errors.length) return;
    clientManifest = JSON.parse(
      readFile(devMiddleware.fileSystem, "vue-ssr-client-manifest.json")
    );
    update();
  });

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;
    // read bundle generated by vue-ssr-webpack-plugin
    bundle = JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json"));
    update();
  });

  return readyPromise;
};