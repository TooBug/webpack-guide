# 基本配置项

## webpack使用形式

在进入配置项讲解之前，我们首先看一看webpack为我们提供的使用方式：CLI和API。

CLI即Command Line Interface，顾名思义，也就是命令行用户界面。到目前为止，我们所有的示例都是以这种方式调用的，例如：

```sh
webpack example1.1.js bundle1.1.js
```

API则是指将webpack作为Node.js模块使用，例如：

```javascript
webpack({
	// 配置项
	entry:'main.js',
	...
},callback);
```

真正在项目中使用的时候，这两种方式都会用到。CLI的场景中由于配置项写在命令中会比较复杂，一般会将配置项写在同目录的`webpack.config.js`中，然后执行`webpack`即可。

```sh
# 执行时webpack会去寻找当前目录下的webpack.config.js当作配置文件使用
webpack

# 也可以用参数-c指定配置文件
webpack -c mycofnig.js
```

配置文件`webpack.config.js`的写法则是：

```javascript
module.exports = {
	// 配置项
};
```

值得注意的是，配置文件是一个真正的JS文件，因此配置项只要是一个对象即可，并不要求是JSON。也就意味着你可以使用表达式，也可以进行动态计算，或者甚至使用继承的方式生成配置项。

同理，API模式中的配置项对象也是一个真正的对象。