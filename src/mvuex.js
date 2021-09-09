/* 
  插件
  实现：state/mutations/actions/getter
  创建store
  数据响应式
*/
let Vue
function install(_Vue) {
  Vue = _Vue
  //这样store执行时，就有了Vue，不用import
  // 这也是为什么Vue.use 必须在新建Store之前
  Vue.mixin({
    beforeCreate(){
      // 这样才能获取到传递进来的store
      // 只有root元素才有store，所以判断一下
      if(this.$options.store){
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}
class Store{
  constructor(options){
    this.state = new Vue({
      data:options.state
    })
    this.mutations = options.mutations || {}
    this.actions = options.actions
    options.getters && this.handleGetters(options.getters)
  }

  // 这里使用箭头函数，后面actions实现时会有作用
  commit = (type, arg) => {
    this.mutations[type](this.state, arg)
  }

  dispatch(type, arg){
    this.actions[type]({
      commit: this.commit,
      state: this.state
    }, arg)
  }

  handleGetters(getters){
    this.getters = {}
    // 遍历getters，为this.getters定义property
    // 属性名就是选项中的key，只需定义get函数保证其可读性
    Object.keys(getters).forEach( k => {
      // 这些属性是只读的
      Object.defineProperty(this.getters, k, {
        // 注意依然是箭头函数
        get: () => {
          return getters[k](this.state)
        }
      })
    })

  }
}

export default{Store, install}