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

同时生成了`bundle1.1.js`，可见配置文件的确是生效了的。