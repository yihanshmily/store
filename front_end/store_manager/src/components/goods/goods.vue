<template>
    <div>
        <div style="display: flex;">
            <div style="width: 20%;">
                <van-sticky>
                    <!-- 侧边导航 -->
                    <div>
                        <van-sidebar v-for="item in categoryList" :key="item.id">
                            <van-sidebar-item :title="item.name" @click="onchange(item.id)" />
                        </van-sidebar>
                    </div>
                </van-sticky>

            </div>
            <!-- 商品 -->
            <div style="width: 80%;">
                <van-grid :column-num="2">
                    <van-grid-item v-for="index in goodsList" :key="index.id" icon="photo-o" text="文字"
                        @click="lookGoods(index.id)">
                        <van-image width="6rem" height="6rem" fit="cover" :src="utils.getImage(index.img)" />
                        <div style="font-size: 17px;">{{ index.name }}</div>
                        <span style="color: darkred;">￥{{ index.price }}</span>
                    </van-grid-item>
                </van-grid>
            </div>
        </div>
        <div style="width: 100%;position: absolute;bottom: 8%;">
            <!-- 分页 -->
            <div style="margin-top: 20px;">
                <van-pagination v-model="page.currentPage" :total-items="page.numbers" :show-page-size="5"
                    :page-count="page.totalPages" items-per-page="7" force-ellipses style="margin-bottom: 20px;"
                    @change="changePage">
                    <template #prev-text> <van-icon name="arrow-left" /> </template>
                    <template #next-text> <van-icon name="arrow" /> </template>
                </van-pagination>
            </div>
            <!-- 新增 -->
            <div v-if="chooseIdentity === '商品'">
                <van-button type="danger" size="large" round @click="toAddGoods">新增商品</van-button>
            </div>
        </div>
        <!-- 底部 -->
        <div>
            <van-tabbar v-model="active" route fixed safe-area-inset-bottom>
                <van-tabbar-item to="/identity" icon="home-o">用户</van-tabbar-item>
                <van-tabbar-item to="/goods" icon="apps-o">商品</van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { Dialog } from 'vant'
export default {
    name: 'goods',
    data() {
        return {
            active: 0,
            chooseIdentity: '商品',
            goodsList: [],
            categoryList: [
                { id: 1, name: '商品' },
                { id: 2, name: '订单' },
                {id:3,name:'退出'}
            ],
            page: {
                currentPage: '1',
                numbers: '',
                totalPages: '',
            }
        }
    },
    created() {
        this.getGoods()
    },
    methods: {
        onchange(id){
            if(id === 3){
                Dialog.confirm({
                        message:'是否退出登录'
                }).then(()=>{
                    window.sessionStorage.clear()
                    this.$router.replace(
                        {path:'/login'}
                    )
                })
            }
        },
        lookGoods(id) {
            this.$router.push({
                path: '/goodsDetail',
                query: { id: id }
            })
        },
        getGoods() {
            axios.get('/goods/' + this.page.currentPage + '/' + 6).then(res => {
                if (res.data.flag) {
                    this.goodsList = res.data.data.dataList
                    this.page.numbers = res.data.data.numbers
                    this.page.totalPages = res.data.data.totalPages + 1
                }
            })
        },
        changePage() {
            axios.get('/goods/' + this.page.currentPage + '/' + 6).then(res => {
                if (res.data.flag) {
                    this.goodsList = res.data.data.dataList
                    this.page.numbers = res.data.data.numbers
                    this.page.totalPages = res.data.data.totalPages + 1
                }
            })
        },
        toAddGoods() {
            this.$router.push({
                path: '/addGoods'
            })
        }
    }
}
</script>

<style>

</style>