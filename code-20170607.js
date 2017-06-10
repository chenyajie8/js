响应的数据绑定
<!--html页面-->
<div id="example">
    hello {{name}}
</div>
//js文件
var exampleData = {
  name: 'Vue.js'
}
// 创建一个 Vue 实例或 "ViewModel"
// 它连接 View 与 Model
var exampleVM = new Vue({
  el: '#example',
  data: exampleData
})




v-on指令用于监听 DOM 事件
<!--html页面-->
<div id="example">
    <p>{{msg}}</p>
    <button v-on:click="change">hello</button>
</div>
//js文件
var vm = new Vue({
  el: '#example',
  data:{
        msg:"first"
   },
   method:{
       change:function(){
              this.msg = "second"
        }, 
   }, 
})




v-bind 指令用于响应地更新 HTML 特性
<!--html页面-->
<div id="example">
    <!--绑定url-->
    <a v-bind:href="url"></a>

    <!--绑定class-->
    <div v-bind:class="classA"></div>
</div>
//js文件
var vm = new Vue({
    el:"example",
    data:{
        url:"http://cn.vuejs.org/",
        classA:"container",
    },
})




v-for指令用于渲染列表
<!--html页面-->
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})



v-model指令用于数据双向绑定
<!--html页面-->
<div id="example">
    <span>Message is: {{ message }}</span>
    <br>
    <input type="text" v-model="message" placeholder="edit me">
</div>
//js文件
var vm = new Vue({
    el:"example",
    data:{
        message:'',
    },
})



v-if条件渲染
<div id ="example">
    <h1 v-if="ok">Yes</h1>
    <h1 v-else>No</h1>
     <button v-on:click="changeOk">hello</div>
</div>
var vm = new Vue({
    el:"example",
    data:{
        ok:true,
    },
    methods:{
        changeOk:function(){
            this.ok = false
        }
    }
})