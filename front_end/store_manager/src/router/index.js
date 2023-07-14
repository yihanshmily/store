import Vue from "vue";
import VueRouter from "vue-router";
import Identity from '@/components/identity/identity'
import Login from '@/components/login'
import Goods from '@/components/goods/goods'
import AddGoods from '@/components/goods/addGoods'
import GoodsDetail from '@/components/goods/goodsDetail'
import Comment from '@/components/goods/comment'
import Shop from '@/components/shop/shop'

Vue.use(VueRouter)

const router = new VueRouter({
    routes:[
        {path:'/',redirect:'/login'},{path:'/login',component:Login},
        {path:'/identity',component:Identity},{path:'/goods',component:Goods},
        {path:'/addGoods',component:AddGoods},{path:'/goodsDetail',component:GoodsDetail},
        {path:'/comment',component:Comment},{path:'/shop',component:Shop}
    ]
})

// 路由守卫
router.beforeEach((to,from,next)=>{
    if(to.path === '/login'){
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