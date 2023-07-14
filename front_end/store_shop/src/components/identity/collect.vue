<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="收藏" left-text="返回" placeholder left-arrow @click-left="onClickLeft"
            style="background-color: rgba(152, 230, 240, 0.6);" />

    <!-- 收藏列表 -->
    <div v-for="item in collectList" :key="item.id">
            <div style="background-color: rgba(152, 230, 240, 0.6);margin-top: 10px;display: flex;" 
                @click="lookUser(item.userId)">
                <div>
                    <van-image round width="50" height="50" :src="utils.getImage(item.userImg)" style="margin: 5px;" />
                </div>
                <div style="margin: 10px;">{{ item.userName }}</div>
            </div>
        </div>

    <!-- 收藏用户详情 -->
    <!-- 个人主页信息 -->
    <div>
        <van-action-sheet v-model="userShow" style="background-color: rgba(152, 230, 240, 0.8);">
            <div style="margin-bottom: 50px;font-size: 19px;">
                <van-image round width="7rem" height="7rem" :src="utils.getImage(user.img)" style="margin: 40px 0px 10px 240px;"/>
                <div style="margin-top: -120px;">
                    <div style="margin: 10px;">商铺名：{{ user.name }}</div>
                    <div style="margin: 10px;">账号：{{ user.sole }}</div>
                    <div style="margin: 10px;">电话号码：{{ user.tel }}</div>
                </div>
            </div>
        </van-action-sheet>
    </div>

    <!-- 分页 -->
    <div style="position: absolute;bottom: 0%;width: 100%;background-color: rgba(152, 230, 240, 0.6);">
            <div style="margin-top: 20px;">
                <van-pagination v-model="page.currentPage" :total-items="page.numbers" :show-page-size="5"
                    :page-count="page.totalPages" items-per-page="7" force-ellipses style="margin-bottom: 20px;"
                    @change="changePage()">
                    <template #prev-text> <van-icon name="arrow-left" /> </template>
                    <template #next-text> <van-icon name="arrow" /> </template>
                </van-pagination>
            </div>
        </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'collect',
    data(){
        return{
            userShow:false,
            shopId:window.sessionStorage.getItem('token.id'),
            collectList:[],
            user:'',
            page: {
                currentPage: 1,
                numbers: '',
                totalPages: '',
            }
        }
    },
    created(){
        this.getCollect()
    },
    methods:{
        lookUser(id){
            axios.get('/identity/user/'+id).then(res=>{
                if(res.data.flag){
                    this.user = res.data.data
                }
                this.userShow = true
            })
        },
        getCollect(){
            axios.get('collect/getUser/'+this.shopId+'/'+this.page.currentPage+'/7').then(res=>{
                if(res.data.flag){
                    this.collectList = res.data.data.dataList
                    this.page.numbers = res.data.data.numbers
                    this.page.totalPages = res.data.data.totalPages+1
                }
            })
        },
        onClickLeft(){
            this.$router.back()
        }
    }
}
</script>

<style>

</style>