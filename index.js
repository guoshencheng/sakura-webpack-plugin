var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var mkdirp = require('mkdirp');

module.exports = function(opt) {
  opt = opt || {};
  const prefix = (opt && opt.prefix) || "";
  const filePath = (opt && opt.filePath) || cwd;
  const single = opt && !!opt.single;
  const resourceFileName = opt.resourceFileName || "sakura.resources.json";
  return function() {
    this.plugin('done', function(stats) {
      var namedChunks = stats.compilation.namedChunks;
      var hash = stats.hash;
      var resources 
      if (single) {
        const isMap = Object.prototype.toString.call(namedChunks) === '[object Map]';
        const keys = isMap ? Array.from(namedChunks.keys()) : Object.keys(namedChunks);
        resources = keys.reduce((pre, key) => {
          var chunk = isMap ? namedChunks.get(key) : namedChunks[key];
          const styles = chunk.files.filter(item => /\.css$/.test(item)).map(item => prefix + item);
          const javascripts = chunk.files.filter(item => /\.js$/.test(item)).map(item => prefix + item);
          pre.styles = pre.styles.concat(styles);
          pre.javascripts = pre.javascripts.concat(javascripts);
          return pre;
        }, { styles: [], javascripts: [], hash })
      } else {
        resources = Object.keys(namedChunks).reduce((pre, key) => {
          var chunk = namedChunks[key];
          const styles = chunk.files.filter(item => /\.css$/.test(item)).map(item => prefix + item);
          const javascripts = chunk.files.filter(item => /\.js$/.test(item)).map(item => prefix + item);
          var resource = {
            styles, javascripts
          }
          return Object.assign(pre, {
            [key]: resource
          })
        }, { hash })
      }
      mkdirp(filePath, (err) => {
        if (err) {
          console.log(err);
        } else {
          fs.writeFileSync(path.resolve(filePath, `./${resourceFileName}`), JSON.stringify(resources, null, "  "));
        }
      })
    })
  }
}
