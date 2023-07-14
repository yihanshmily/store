import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/identity/login'
import Register from '@/components/identity/register'
import MyInfo from '@/components/identity/myInfo'
import UpdateInfo from '@/components/identity/updateInfo'
import UpdatePwd from '@/components/identity/updatePwd'
import Goods from '@/components/goods/goods'
import ModGoods from '@/components/goods/modGoods'
import GoodsDetail from '@/components/goods/goodsDetail'
import Comment from '@/components/goods/comment'
import Repertory from '@/components/goods/repertory'
import Order from '@/components/goods/order'
import Gain from '@/components/identity/gain'
import Collect from '@/components/identity/collect'

Vue.use(VueRouter)

const router = new VueRouter({
    routes:[
        {path:'/',redirect:'/login'},{path:'/login',component:Login},
        {path:'/register',component:Register},{path:'/myInfo',component:MyInfo},
        {path:'/updateInfo',component:UpdateInfo},{path:'/updatePwd',component:UpdatePwd},
        {path:'/goods',component:Goods},{path:'/modgoods',component:ModGoods},
        {path:'/goodsDetail',component:GoodsDetail},{path:'/comment',component:Comment},
        {path:'/repertory',component:Repertory},{path:'/order',component:Order},
        {path:'/gain',component:Gain},{path:'/collect',component:Collect}
    ]
})

// 路由守卫
router.beforeEach((to,from,next)=>{
    if(to.path === '/login' || to.path === '/register'){
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