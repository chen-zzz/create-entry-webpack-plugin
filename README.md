# create-entry-webpack-plugin
生成一个能加载webpack打包后的文件的entry.js入口文件的webpack plugin

### 安装
```bash
npm i create-entry-webpack-plugin
```
### 使用
``` javascript
// -- webpack.config.js

const CreateEntryWebpackPlugin = require('create-entry-webpack-plugin')
{
  plugins: [
    // 使用插件
    new CreateEntryWebpackPlugin({
      // base path or some cdn path
      // 选填，默认为 webpackConfig.output.publicPath
      publicPath: 'https://some-cdn.com/',
      // output filename
      // 选填 默认为 entry.js
      filename: 'entry.all.js',
      // extend js 输出的js将继承该文件的内容
      // 选填
      template: 'src/globa.js'
    })
  ]
}
```

``` javascript
// -- src/globa.js
// some code 
console.log('hello world');
console.log('this is global.js');
// somecode end
```
#### output:
``` javascript
// -- entry.all.js

// some code 
console.log('hello world');
console.log('this is global.js');
// somecode end
document.write('<link href="https://some-cdn.com/static/css/app.5eb9a2c055fcbaf3bc6a97196ecad219.css" rel="stylesheet">');
document.write('<script src="https://some-cdn.com/static/js/manifest.a945431f91462ff82432.js"></script>');
document.write('<script src="https://some-cdn.com/static/js/vendor.31f9200e79e3d96817a0.js"></script>');
document.write('<script src="https://some-cdn.com/static/js/app.0d14f3ec481e402593b9.js"></script>');

```
