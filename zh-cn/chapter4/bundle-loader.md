# bundle-loader

bundle-loader是一个用来在运行时异步加载模块的loader。

```javascript
// 在require bundle时，浏览器会加载它
var waitForChunk = require("bundle!./file.js");

// 等待加载，在回调中使用
waitForChunk(function(file) {
    // 这里可以使用file，就像是用下面的代码require进来一样
    // var file = require("./file.js");
});

// todo：这句注释说的是？
// wraps the require in a require.ensure block
```

上面的例子中，在`require`时文件就会加载，如果你想在使用的时候再加载的话，可以这样：

```javascript
var load = require("bundle?lazy!./file.js");

// 只有在调用load的时候才会真正加载
load(function(file) {

});
```

但前面我们已经在“分片”相关的内容中知道，将代码分片之后，本身就是异步加载的。为什么要使用bundle-loader呢？

这是因为webpack在进行分片的时候，会根据“分割点”，分片配置项等各种情况选择性地将各个模块打包在一起。例如：

```javascript
require(["./f1", "./f2"], function(f1, f2) {/*...*/});
```

在打包的时候，`f1`和`f2`会被打包到同一个文件中去（也可能还有其它的文件一起），这样加载的时候`f1`和`f2`是一起加载的。

而如果使用bundle-loader的话，则是独立的文件和独立的请求：

```javascript
var f1 = require("bundle!./f1");
var f2 = require("bundle!./f2");
```

`f1`和`f2`是独立打包和请求的。

这有什么意义呢？是的，如果`f1`和`f2`都是确定的，当然是打包到一起更好，能很好地减少浏览器发起的请求，加快页面加载速度。但如果模块名是动态的呢？

```javascript
function loadPage(pageName, callback) {
  try {
    require(["./pages/" + pageName], function(page) {
      callback(null, page);
    });
  } catch(e) {
    calback(e);
  }
}
```

这种情况下webpack为了保证不管`pageName`传什么都能正确加载，会将`./pages/`目录下的所有文件打包到一个文件中去，而很多时候，我们更希望每传一个`pageName`就动态加载一个文件，而不是全部加载。此时就可以用bundle-loader解决：

```javascript
function loadPage(pageName, callback) {
  try {
    var pageBundle = require("bundle!./pages/" + pageName)
  } catch(e) {
    return callback(e);
  }
  pageBundle(function(page) { callback(null, page); })
}
```

每个模块会被打包到一个独立的文件中去，加载时也只会加载一个模块的内容。

