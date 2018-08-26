Webpack delete no js entries plugin
===================================

If you build your app with multiply entries with no js files, e.g. entry only with styles, output of your app contains empty js files for that entry.

This Webpack plugin will delete empty js files from output.

This plugin will be applied only for entries with no js files.




## Installation

:small_orange_diamond: This plugin works with Webpack 4+.

```shell
npm install webpack-delete-no-js-entries-plugin --save-dev
```




## Usage

In your webpack config, require the plugin then add an instance to the `plugins` array.

```js
const WebpackDeleteNoJsEntriesPlugin = require('webpack-delete-no-js-entries-plugin');

module.exports = {
  
  entry: {
    // 'app' entry with js file
    app: [
      './app.js',
      './app.sass',
    ],
    // 'page' entry with no js point
    page: [
      './page.sass'
    ],
  },
  
  output: {
    path: path.join( __dirname, 'dist' ),
    filename: '[name]-[hash].js',
    chunkFilename: '[id]-[chunkhash].js',
  },
  
  module: {
    // Your loader rules go here.
  },

  plugins: [
    new WebpackDeleteNoJsEntriesPlugin(),
  ],

};
```




## Sample output

:small_orange_diamond: With this plugin applied, webpack output of `page` entry will without `page.js` file, but with `page.css`:

```
"app.js"
"app.css"
"page.css"
```

If you build app without this plugin, webpack output of `page` entry will be with empty `page.js` file:

```
"app.js"
"app.css"
"page.js" <-- empty js file
"page.css"
```
