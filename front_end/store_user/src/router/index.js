import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/components/index'
import Category from '@/components/category'
import MyInfo from '@/components/myInfo/myInfo'
import Chat from '@/components/chat/chat'
import GoodsDetail from '@/components/goods/goodsDetail'
import Comment from '@/components/goods/comment'
import Shop from '@/components/shop/shop'
import Search from '@/components/goods/search'
import Login from '@/components/myInfo/login'
import UpdateInfo from '@/components/myInfo/updateInfo'
import UpdatePwd from '@/components/myInfo/updatePwd'
import Order from '@/components/goods/order'
import Register from '@/components/myInfo/register'

Vue.use(VueRouter)

const router = new VueRouter({
    routes:[
        {path:'/',redirect:'/login'},{path:'/login',component:Login},
        {path:'/category',component:Category},{path:'/myInfo',component:MyInfo},
        {path:'/chat',component:Chat},{path:'/goodsDetail',component:GoodsDetail},
        {path:'/comment',component:Comment},{path:'/shop',component:Shop},
        {path:'/search',component:Search},{path:'/index',component:Index},
        {path:'/updateInfo',component:UpdateInfo},{path:'/updatePwd',component:UpdatePwd},
        {path:'/order',component:Order},{path:'/register',component:Register}
    ]
})

// 路由守卫
router.beforeEach((to,from,next)=>{
    if(to.path === '/register' || to.path === '/login'){
        return next()
    }
    // 获取token
    const tokenInfo = window.sessionStorage.getItem('token.id');
    if(!tokenInfo){
        alert('你还未登录，请先登录！')
        next('/login')
    }
    next()
})

export default router