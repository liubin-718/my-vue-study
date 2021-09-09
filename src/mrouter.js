/* 
* 实现插件
* 监听URL变化
* 路由配置解析 {'/': '/Home'}
* 实现全局组件：router-link/router-view
*/
import Home from "./views/Home";
import About from "./views/About";
import Vue from "vue";
class VueRouter{
  constructor(options){
    this.$options = options
    this.routeMap = {}
    this.app = new Vue({
      data:{
        current: '/'
      }
    })
  }
  init(){
    this.bindEvents()
    this.createRouteMap(this.$options) // 解析路由
    this.initComponent()
  }

  bindEvents(){
    window.addEventListener('load', this.onHashChange.bind(this)) // 不bind this，它就指向window
    window.addEventListener('hashchange', this.onHashChange.bind(this))
  }
  onHashChange(){
    this.app.current = window.location.hash.slice(1) || '/'
  }

  createRouteMap(options){
    options.routes.forEach(item => {
      this.routeMap[item.path] = item.component
    })
  }

  initComponent(){
    // <router-link to="/"> 文本 </router-link>
    Vue.component('router-link', {
      props:{to: String},
      render(h){ // h(tag, data, children)
        return h('a', {attrs:{href: '#' + this.to}}, [
          this.$slots.default // 超链接文本
        ])
      }
    })

    Vue.component('router-view',{
      render: h => {
        const comp = this.routeMap[this.app.current]
        return h(comp)
      }
    })
  }
}
VueRouter.install = function(Vue){
  Vue.mixin({
    beforeCreate(){
      if(this.$options.router){
        // 仅在根组件执行一次
        Vue.prototype.$router = this.$options.router
        this.$options.router.init()
      }
    }
  })
}
Vue.use(VueRouter);

export default new VueRouter({
  routes: [{ path: "/", component: Home }, { path: "/about", component: About }]
});