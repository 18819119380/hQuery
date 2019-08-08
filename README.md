# 简易 jQuery

## 项目介绍

实现简易 jQuery 核心框架

## 思路

### 第一步

创建构造函数，new 一个对象。 缺点：每次创建对象用new太麻烦

```
var hQuery = function(selector) {
}

hQuery.prototype = {
  addClass: function() {
    console.log('add Class')
  }
}

var $node = new hQuery()
$node.addClass()

window.$ = hQuery
$().addClass
```
### 第二步
```
var hQuery = function(selector) {
  return new hQuery(selector)
}

hQuery.fn = hQuery.prototype = {

  addClass: function() {
    console.log('add Class')
  }
}

window.$ = hQuery

var $node = $('div')
$node.addClass('active')
```
换一种思路，直接调用函数，函数执行时返回一个新对象。但报如下错误
Uncaught RangeError: Maximum call stack size exceeded ，原因是new hQuery的时候执行了hQuery函数出现循环调用。 所以不能直接new hQuery，得换个方式。

### 第三步
```
var hQuery = function(selector) {
  return new hQuery.fn.init(selector)
}

hQuery.fn = hQuery.prototype = {
  init: function() {
    console.log(this)
  },

  addClass: function() {
    console.log(this)
    console.log('add Class')
  }
}

hQuery.fn.init.prototype = {
  removeClass: function() {
    console.log('remove')
  }
}

window.$ = hQuery

$('div').addClass('active')
```
执行 hQuery， 返回new 一个新函数得到的对象，这个新函数放hQuery的原型对象里。但出现如下错误
Uncaught TypeError: $(...).addClass is not a function。 那是因为返回的对象没有addClass这个属性。

### 第四步
```
var hQuery = function(selector) {
  return hQuery.fn.init(selector)
}

hQuery.fn = hQuery.prototype = {
  init: function() {
    console.log(this)
    return this
  },

  addClass: function() {
    console.log(this)
    console.log('add Class')
  }
}

window.$ = hQuery

$('div').addClass('active')

//没创建新对象,共用hQuery.prototype
console.log( $('div') === $('span') )
```
换种写法， 这时候不报错了，但也不符合我们的需求。$()得到的结果是同一个对象。

### 第五步
```
var hQuery = function(selector) {
  return new hQuery.fn.init(selector)
}

hQuery.fn = hQuery.prototype = {
  constructor: hQuery,

  init: function() {
    console.log(this)
  },

  addClass: function() {
    console.log(this)
    console.log('add Class')
    return this
  }
}

//对step3 进行改造，加了这句话
hQuery.fn.init.prototype = hQuery.fn

window.$ = hQuery

$('div').addClass('active')
console.log( $('div') === $('span'))
```
对 第三步 进行改造，加了这句话hQuery.fn.init.prototype = hQuery.fn， 这样 new hQuery.fn.init()得到对象，当调用.addClass时从hQuery.fn.init.prototype里找，也就是hQuery.fn里找，正好能找到。

### 实现了 addClass get post 等功能
https://github.com/pppcode/hQuery/blob/master/index.js

