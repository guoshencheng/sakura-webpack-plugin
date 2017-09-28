## Sakura-webpack-plugin

###### a webpack plugin to sumary resources into a file, the file is to be used by sakura-cli

##### Usage
```javascript

var SakuraWebpackPlugin = require("sakura-webpack-plugin");
plugins:[
  new SakuraWebpackPlugin({
    prefix: "http://xxx.xxxx.xxx/",
    single: true,
    resourceFilename: "custom.resources.json"
  })
]
```

### CHANGELOG

##### 2017/09/28

- Add a option to custom resourceFilename
