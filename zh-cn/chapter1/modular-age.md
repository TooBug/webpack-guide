# 模块化时代

在忍受了命名空间一大串的名字很多年之后，终于有了模块化。促使模块化诞生的另一个因素是依赖管理的问题。

## 限制

浏览器对资源加载有同源策略限制，也不支持编程化加载资源。（支持加载，不告诉你加载结果，自己猜。）

最终大部分加载器选择通过`<script>`标签加载，然后通过各种hack判断是否加载完成。

## AMD

require.js将AMD发扬光大，成为AMD事实标准。

模块定义和使用：

```javascript
define(id?, dependencies?, function factory(){

    return moduleContent;

});
```

优点：浏览器直接使用。

## Common.js / CMD

Common.js模块定义和使用：

```javascript
var dependency = require('xxx');

// 模块定义
exports.xxx = xxx;

// 或者
module.exports = moduleContent;
```

CMD模块定义和使用：

```javascript
define(function(require, exports, module) {
    var a = require('./a')
    var b = require('./b') // 依赖可以就近书写
})
```

## UMD

```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['b'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('b'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.b);
    }
}(this, function (b) {
    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {};
}));
```

## 问题

基于运行时，部分实现依赖于hack，没有可靠的基础，虽然有完善的测试，但还是会碰到意外情况。

浏览器端限制多，导致hack多，配置项多。

优化工具不够好用。

无法复用生态圈，需要额外适配。

