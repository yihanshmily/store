<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar style="background-color: cyan;">
            <template #left>
                <van-icon name="arrow-left" size="18" @click="returnVue"/>
            </template>
            <template #right>
                <van-icon name="cluster-o" size="18" />
            </template>
        </van-nav-bar>

        <!-- 信息 -->
        <div>
            <div style="display: flex;width: 100%;">
                <div><van-image width="5rem" height="5rem" round fit="cover" style="margin: 10px;"
                    :src="utils.getImage(user.img)"/></div>
                <div style="margin: 20px 0px 0px 180px;width: 100%;">
                    <van-button round type="info" @click="toUpdate">修改资料</van-button>
                </div>
            </div>
            <div style="margin: 10px;">
                <div>{{user.name}}</div>
                <div>ID：{{ user.sole }}</div>
                <div>电话号码：{{ user.tel }}</div>
                <div>收藏：{{ countSum }}</div>
                <div>优惠卷：{{ couponList.length }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'myInfo',
    data() {
        return {
            userId: window.sessionStorage.getItem('token.id'),
            user:'',
            countSum:'',
            couponList:[]
        }
    },
    created(){
        this.getUserInfo()
    },
    methods: {
        toUpdate(){
            this.$router.push({
                path:'/updateInfo'
            })
        },
        returnVue(){
            this.$router.back()
        },
        getUserInfo() {
            // 获取个人信息
            axios.get('/identity/user/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.user = res.data.data       
                }
            })
            // 获取收藏
            axios.get('/collect/getCount/'+this.userId).then(res=>{
                if(res.data.flag){
                    this.countSum = res.data.data
                }
            })
            // 获取优惠卷
            axios.get('/coupon/getUser/'+this.userId).then(res=>{
                if(res.data.flag){
                    this.couponList = res.data.data
                }
            })
        },
    }
}
</script>

<style></style>