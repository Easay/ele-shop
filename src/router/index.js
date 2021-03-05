import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Orders from '../components/order/Orders'
import Cate from '../components/goods/Cate'
import Goods from '../components/goods/List'
import Params from '../components/goods/Params'
import Reports from '../components/reports/Reports'

Vue.use(VueRouter)

  const routes = [
    // 根路径，直接跳转至login
    { path:'/', redirect:'/login'},
    { path:'/login', component:Login },
    { 
      path:'/home', 
      component:Home,
      redirect:'/welcome',
      children:[
        { path:'/welcome', component:Welcome },
        { path:'/users', component:Users },
        { path:'/rights', component:Rights },
        { path:'/roles', component:Roles },
        { path:'/orders', component:Orders},
        { path:'/categories',component:Cate},
        { path:'/goods',component:Goods},
        { path:'/params',component:Params},
        { path:'/reports',component:Reports}
        
    ]},
]

const router = new VueRouter({
  routes
})

//配置路由守卫，一旦发现做路由跳转就执行
router.beforeEach((to,from,next) =>{
    //如果访问登陆页，则放行
    if(to.path ==='/login'){
      return next();
    }
    // 如果用户未登陆，则跳转到/login
    const token = sessionStorage.getItem('token');
    if(!token){
      return next('/login');
    }
    // 如果用户已经登陆，则放行
    return next();
})
export default router
