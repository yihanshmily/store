<template>
    <div>
        <!-- 导航栏 -->
        <div class="navbar">
            <van-nav-bar title="商品" left-text="返回" left-arrow @click-left="onClickLeft()" />
        </div>

        <!-- 商品展示 -->
        <div>
            <div style="background-color: #EEEEEE;">
                <!-- 商品轮播图 -->
                <van-swipe :autoplay="3000" indicator-color="white" lazy-render>
                    <van-swipe-item v-for="item in images" :key="item.id">
                        <van-image width="100%" height="400" fit="cover" :src="utils.getImage(item)" />
                    </van-swipe-item>
                </van-swipe>
                <van-col span="24">
                    <span color="#ffffff" style="float: right;margin:5px 40px ;">月销售：{{ goods.saleRoom }}</span>
                </van-col>
                <div style="height: 100%;">
                    <span style="color:darkgoldenrod;margin: 20px;font-size: 30px;">￥{{ goods.price }}</span><br>
                    <span style="margin: 50px 25px; font-size: 18px;">{{ goods.name }}</span><br>
                    <span style="margin: 50px 25px; font-size: 18px;">{{ goods.description }}</span><br>
                </div>
            </div>
            <!-- 评论 -->
            <van-cell style="margin-top: 10px;" is-link title="商铺详情" :value="shop.name" :icon="utils.getImage(shop.img)"
                size="large" @click="toShop(shop.id)"/>
            <van-cell style="margin-top: 10px;" is-link title="商品评价" icon="underway" @click="toComment" />
            <div style="height: 100px;background-color: #eee;" v-for="index in commonts" :key="index.id">
                <div v-if="index.id">
                    <van-image round width="30px" height="30px" fit="cover" style="margin:2px 10px;"
                        :src="utils.getImage(index.userImg)" /><br>
                    <spna style="margin: 2px 20px;">{{ index.commentContent }}</spna><br>
                    <van-rate readonly v-model="index.score" icon="like" void-icon="like-o"
                        style="float: right;margin-right: 20px;" />
                </div>
            </div>
            <div style="height: 100px;"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { Toast, Dialog } from 'vant'
export default {
    name: 'goodsDetail',
    data() {
        return {
            id: this.$route.query.id,
            userId: window.sessionStorage.getItem('token'),
            goods: '',
            shop: '',
            commonts: '',
            images: []
        }
    },
    created() {
        this.getGoodsDetail()
        this.getCommont()
    },
    methods: {
        toShop(id){
            this.$router.push(
                {path:'/shop',query:{shopId:id}}
            )
        },
        onClickLeft() {
            this.$router.back()
        },
        toComment() {
            this.$router.push(
                { path: '/comment', query: { goodsId: this.id } }
            )
        },
        getGoodsDetail() {
            axios.get('/goods/getOne/' + this.id+'/0').then(res => {
                if (res.data.flag) {
                    this.goods = res.data.data
                    this.images = res.data.data.img.split(',')
                    this.images.splice(this.images.length - 1, 1)
                    // 获取商铺信息
                    axios.get('/identity/商铺/' + res.data.data.shopId).then(res => {
                        if (res.data.flag) {
                            this.shop = res.data.data
                        }
                    })
                }
            })
        },
        
    }
}
</script>

<style></style>