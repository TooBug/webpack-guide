# 分片

> 状态：草稿

![chunks](../images/chapter3/chunks/1.1.png)

example1中使用了`require.ensure`和AMD动态`require`两种方式，来建立分割点，代码在此处被分片。


```javascript
var a=require('./a');
a.sayHello();

require.ensure(['./b'], function(require){
    var b = require('./b');
    b.sayHello(); 
});

require(['./c'], function(c){
    c.sayHello();
});

```

打包后的代码：

- bundle.js -> main.js + a.js
- 1.bundle.js -> b.js
- 2.bundle.js -> c.js

## 多入口

多入口的情况下：

- 入口1 bundle.main1.js -> main.js + a.js
- 入口2 bundle.main2.js -> main2.js + a.js
- 1.bundle.1.js -> b.js
- 2.bundle.2.js -> c.js

可见公共代码a.js并没有被提取出来。

> 因此分片只是分片，并没有代码自动优化作用。