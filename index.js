var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var mkdirp = require('mkdirp');

module.exports = function(opt) {
  const prefix = (opt && opt.prefix) || "";
  const filePath = (opt && opt.filePath) || cwd;
  return function() {
    this.plugin('done', function(stats) {
      var namedChunks = stats.compilation.namedChunks;
      var resources = Object.keys(namedChunks).reduce((pre, key) => {
        var chunk = namedChunks[key];
        const styles = chunk.files.filter(item => /\.css$/.test(item)).map(item => prefix + item);
        const javascripts = chunk.files.filter(item => /\.js$/.test(item)).map(item => prefix + item);
        var resource = {
          styles, javascripts
        }
        return Object.assign(pre, {
          [key]: resource
        })
      }, {})
      mkdirp(filePath, (err) => {
        if (err) {
          console.log(err);
        } else {
          fs.writeFileSync(path.resolve(filePath, "./sakura.resources.json"), JSON.stringify(resources, null, "  "));
        }
      })
    })
  }
}

