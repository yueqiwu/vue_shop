import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const login = () => import('../components/login/Login')
const home = () => import('../components/home/Home')
const welcome = () => import('../components/welcome/Welcome')
const users = () => import('../components/users/Users')
const rights = () => import('../components/power/Rights')
const roles = () => import('../components/power/Roles')
const cate = () => import('../components/goods/Cate')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home',
    component: home,
    redirect: 'home/welcome',
    children: [
      { path: 'welcome', component: welcome },
      { path: 'users', component: users },
      { path: 'rights', component: rights },
      { path: 'roles', component: roles },
      { path: 'categories', component: cate }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('vue_shop_token')
  if (!token) return next('/login')
  next()
})

export default router
