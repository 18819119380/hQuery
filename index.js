/*
第一步
var hQuery = function(selector) {

}

hQuery.prototype = {
  addClass = function() {
    console.log('add Class')
  }
}

//每次使用时都要 new 创建对象太麻烦
var $node = new hQuery()
$node.addClass()

//实际用法
window.$ = hQuery
$().addClass
*/

/*
第二步
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
//执行结果："RangeError: Maximum call stack size exceeded，因为 new hQuery 时，执行了 hQuery 函数出现循环调用
*/

/*
第三步
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
*/

/*
第四部
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
console.log($('div') === $('span'))
//没创建新对象，共用 hQuery.prototype
*/

/*
第五步
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

hQuery.fn.init.prototype = hQuery.fn

window.$ = hQuery

$('div').addClass('active')
console.log($('div') === $('span'))
//加了这句话hQuery.fn.init.prototype = hQuery.fn， 这样 new hQuery.fn.init()得到对象，
//当调用.addClass时从hQuery.fn.init.prototype里找，也就是hQuery.fn里找，正好能找到。
*/


var hQuery = function(selector) {
  console.log(selector)
  return new hQuery.fn.init(selector)
}

hQuery.fn = hQuery.prototype = {
  constructor: hQuery,

  init: function(selector) {
    console.log(this)
    let nodes = document.querySelectorAll(selector)
    nodes.forEach((node, index) => this[index] = node)
    this.length = nodes.length
  }
  
}

hQuery.fn.init.prototype = hQuery.fn

hQuery.extend = hQuery.fn.extend = function(obj) {
  for(var key in obj){
		this[key] = obj[key]
	}
}

hQuery.extend({
  get: function(url, data = {}) {
    url += '?' + Object.entries(data).map(v => `${v[0]}=${v[1]}`).join('&')
    return fetch(url).then(function(response) {
      return response.json()
    })
  },
  
  post: function(url, data= {}) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json())
  },
  
  
  unique: function(array) {
    return [...new Set(array)]
  }
  
})

hQuery.fn.extend({
  addClass: function(cls) {
    Array.from(this).forEach(node => node.classList.add(cls))
    return this
  }
})

hQuery.fn.extend({
  removeClass: function(cls) {
    Array.from(this).forEach(node => node.classList.remove(cls))
    return this
  }
})


window.$ = hQuery


$('.box').addClass('active')

$.get('http://api.jirengu.com/getWeather.php', {city: '北京'})
  .then(data => console.log(data))
console.log( $.unique([4, 5, 1, 3, 4, 4, 1, 8]) )









