const fs = require("fs");
const path = require("path");
const express = require("express");
const { createBundleRenderer } = require("vue-server-renderer");

const resolve = (file) => path.resolve(__dirname, file);
// 是否是生产环境
const isProd = process.env.NODE_ENV === "production";
// 模板路径
const templatePath = resolve("./index.template.html");

let renderer;

let setupPromise;

let bundle, clientManifest;

const app = express();

const createRenderer = (bundle, options) => {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      basedir: resolve("./dist"),
      // recommended for performance
      runInNewContext: false,
    })
  );
};

// 如果是生产环境直接取打包好的文件
if (isProd) {
  bundle = require("../dist/vue-ssr-server-bundle.json");
  clientManifest = require("../dist/vue-ssr-client-manifest.json");
} else {
  //注意：只需要生成一次promise，之后走的都是promise的回调
  setupPromise = require("../build/setup-dev-server")(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options);
    }
  );
}

const handleError = (err,res) => {
  if (err.url) {
    res.redirect(err.url);
  } else if (err.code === 404) {
    res.status(404).send("404 | Page Not Found");
  } else {
    console.log(err)
    res.status(500).send("500 | Internal Server Error");
  }
};



const render = async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const context = {
    title: "vue ssr demo", // default title
    url: req.url,
    metas: `
    <meta charset="utf-8">
  `,
  };
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err,res);
    }
    res.send(html);
  });
};

const appRender = (req, res) => {
  if (isProd) {
    render(req, res);
    return;
  }
  setupPromise.then(render(req, res));
};

app.get("*", appRender);

const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
