export const backHome = {
  // 路由导航守卫 监听离开该组件 回到首页
  beforeRouteLeave(to, from, next) {
    if (to.path === '/home/welcome') {
      console.log('返回首页')
      window.sessionStorage.setItem('vue_shop_active_path', to.path)
      this.$bus.$emit('backHome')
    }
    next()
  }
}
