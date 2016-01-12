# 基本配置项

## `entry`和`output`

首先我们写一个简单的配置文件，将前面我们用到的命令行参数放到配置文件中来。

`webpack.config.js`：

```javascript
module.exports = {
    entry:'./example1.1',
    output:{
        filename:'bundle1.1.js'
    }
};
```

示例文件仍然使用CommonJS打包示例中的JS文件：

```javascript
module.exports = {
    sayHello:function(){
        alert('Hello World!');
    }
};
```

然后直接使用`webpack`打包即可：

```sh
webpack
```

输出

```
Hash: 0cf5b5109a8f4bf34ae5
Version: webpack 1.12.2
Time: 70ms
       Asset     Size  Chunks             Chunk Names
bundle1.1.js  1.48 kB       0  [emitted]  main
   [0] ./example1.1.js 83 bytes {0} [built]
```

同时生成了`bundle1.1.js`，可见配置文件的确是生效了的。代码见<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter3/config/example1>。

### `output.filename`中的占位符

`output.filename`除了可以指定具体的文件名以外，还可以使用一些占位符，包括：

- `name` 模块名称
- `hash` 模块编译后的（整体）Hash值
- `chunkhash` 分片的Hash值

使用的方式就是在`output.filename`的中使用`[name].js`或者`my-[name]-[hash].js`之类的，一看就明白。但这三个值具体是从哪里来的呢？

首先，我们一次有可能要打包很多模块，而不止是上例中那样只有一个`example1.1.js`，因此会碰到支持多个入口文件（`entry`）的情况，每一个入口都需要有自己的名字，具体对应`entry`的写法而言，有如下几种情况：

```javascript
entry:'./example2.1'
// 或者
entry:['./example2.1','./example2.2']
```

这种情况下，模块是没有名字的，webpack会使用`main`作为模块名字，因此像下面这种用数组来指定入口的情况，模块名会重复，而此时webpack会将它们的代码合并打包！

```sh
Hash: 1af82371840be6a233d2
Version: webpack 1.12.2
Time: 101ms
  Asset     Size  Chunks             Chunk Names
main.js  1.76 kB       0  [emitted]  main
   [0] multi main 40 bytes {0} [built]
   [1] ./example2.1.js 83 bytes {0} [built]
   [2] ./example2.2.js 84 bytes {0} [built]
```

注意上方的`multi main`字样，表示有多个模块名为`main`。这种情况下的代码见<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter3/config/example2>，里面包含了使用`[name]`和`[hash]`打包出来的代码，均包含了`example2.1`和`example2.2`的代码。

另一种是webpack比较推荐的多入口写法：

```javascript
entry:{
	'example2.1':'example2.1.js',
	'example2.2':'example2.2.js'
}
```

这种写法中，名字和模块文件名一一对应，每个模块都有独立的名字。因此这里的`[name]`可以理解成模块名字。

事实上，在webpack的文档中，这个name是指“chunk name”，即分片的名字，这里需要先剧透一下后面要说的“分片”的概念。所谓分片就是指一个入口模块的代码有可能会被分成多个文件，还有一些文件可能是来自模块的公共代码，而不是入口模块。因此这里的`[name]`并非严格与入口模块一一对应。

了解了这些情况之后，`[hash]`和`[chunkhash]`就自然好理解了，一个是指本次打包相关的整体的hash，一个是指分片的hash。

看示例：

```javascript
module.exports = {
    entry:{
    	'example3.1':'./example3.1',
    	'example3.2':'./example3.2'
    },
    output:{
    	//这里分别用hash和chunkhash，结果不一样
        filename:'[name]-[hash].js'
        //filename:'[name]-[chunkhash].js'
    }
};
```

为了让两个模块不一样，我们将`example3.1`和`example3.2`中`alert`的内容做了修改，保证它们的内容是不一样的。用`[hash]`时打包的结果：

```sh
Hash: 6f17d6321f8580500bc9
Version: webpack 1.12.2
Time: 73ms
                             Asset     Size  Chunks             Chunk Names
example3.1-6f17d6321f8580500bc9.js  1.48 kB       0  [emitted]  example3.1
example3.2-6f17d6321f8580500bc9.js  1.48 kB       1  [emitted]  example3.2
   [0] ./example3.1.js 88 bytes {0} [built]
   [0] ./example3.2.js 88 bytes {1} [built]
```

可以看到两个文件hash值是一样的，这就是所谓整体hash的意思（官方文档叫作`bundle`的hash值）。

用`[chunkhash]`时打包的结果：

```sh
Hash: 87ac4d29062084750a92
Version: webpack 1.12.2
Time: 75ms
                             Asset     Size  Chunks             Chunk Names
example3.1-ef6b40ba3b9335fc2551.js  1.48 kB       0  [emitted]  example3.1
example3.2-b92fc07f9784897342c5.js  1.48 kB       1  [emitted]  example3.2
   [0] ./example3.1.js 88 bytes {0} [built]
   [0] ./example3.2.js 88 bytes {1} [built]
```

两个文件hash值是不同的，也就是每一个分片的hash都不一样。

代码见<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter3/config/example3>。

## `output.path`

有时候我们希望输出的文件不在当前目录（其实大部分时候都是这样），比如源码在`src`目录，输出的文件在`dist`目录，此时就需要用到`output.path`来指定输出路径。

> `output.path`也可以使用占位符。

```javascript
entry:{
    'example4.1':'src/example4.1'
},
otuput:{
    filename:'[name].js',
    path:'./dist'
}
```

你肯定能猜到，文件会打包到`dist/example4.1.js`，这并没有什么好惊奇的，对，我是说没什么好演示的。

真正值得注意的是，如果你的模块是存放在子目录中的，而你又想保持这种目录结构到打包后的`dist`中，怎么办？没听懂是吧，就是这种情况：

```
src/
    example4.1.js
    hello/
        example4.2.js
```

希望打包之后是这样：

```
dist/
    example4.1.js
    hello/
        example4.2.js
```

这种情况下，子目录并不能由`output.path`配置而来，而应该将目录写到模块名上，配置文件变成这样：

```javascript
entry:{
    'example4.1':'./src/example4.1',
    'hello/example4.2':'./src/hello/example4.2'
},
output:{
    filename:'[name].js',
    path:'./dist'
}

```

注意这里的`filename`一定要包含`[name]`才行，因为路径信息是带在模块名上的。

代码见<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter3/config/example4>。


