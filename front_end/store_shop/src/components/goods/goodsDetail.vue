<template>
    <div>
        <!-- 导航栏 -->
        <div class="navbar">
            <van-nav-bar title="商品" left-text="返回" left-arrow @click-left="onClickLeft()"
                style="background-color: rgba(152, 230, 240, 0.6);" />
        </div>

        <!-- 商品展示 -->
        <div>
            <div style="background-color: #EEEEEE;background-color: rgba(152, 230, 240, 0.6);">
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
                    <span style="margin: 50px 25px; font-size: 16px;">{{ goods.name }}</span><br>
                    <span style="margin: 50px 25px; font-size: 16px;">{{ goods.description }}</span><br>
                </div>
            </div>
            <!-- 评论 -->
            <van-cell style="margin-top: 10px;background-color: rgba(152, 230, 240, 0.6);" is-link title="商品评价"
                icon="underway" @click="toComment" />
            <van-cell style="margin-top: 10px;background-color: rgba(152, 230, 240, 0.6);" is-link title="优惠卷"
                icon="underway" @click="toCoupon" />
            <!-- 操作 -->
            <div style="display: flex;">
                <div style="width: 50%;text-align: center;" @click="del">
                    <van-button round type="info" style="width: 80%;">删除</van-button>
                </div>
                <div style="width: 50%;text-align: center;" @click="toUpdate">
                    <van-button round type="info" style="width: 80%;">修改</van-button>
                </div>
            </div>
        </div>

        <!-- 优惠卷信息 -->
            <van-action-sheet v-model="couponShow" style="background-color: rgba(152, 230, 240, 0.8);"
                :style="{ height: '50%' }">
                <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                    <van-col span="24">优惠卷</van-col>
                </van-row>
                <!-- 部分操作显示 -->
                <div v-if="couponList.length !== 0">
                    <div v-for="item in couponList" :key="item.id">
                        <div
                            style="display: flex;height: 60px; margin:10px auto; background-color: rgba(152, 230, 240, 0.8);">
                            <div style="width: 20%;line-height: 60px;text-align: center;"><van-icon name="coupon-o" /></div>
                            <div style="width: 50%;line-height: 60px;text-align: center;">
                                满 <span style="color: brown;">{{ item.meetMoney }}</span>
                                减 <span style="color: brown;">{{ item.cutMoney }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else><van-empty description="暂无优惠卷" /></div>
            </van-action-sheet>
    </div>
</template>

<script>
import axios from 'axios'
import { Toast, Dialog } from 'vant'
export default {
    name: 'goodsDetail',
    data() {
        return {
            couponShow: false,
            goodsId: this.$route.query.goodsId,
            shopId: window.sessionStorage.getItem('token.id'),
            goods: '',
            shop: '',
            commonts: '',
            images: [],
            couponList: '',
        }
    },
    created() {
        this.getGoodsDetail()
    },
    methods: {
        getCoupon() {

        },
        toCoupon() {
            this.couponShow = true
            axios.get('/coupon/' + this.shopId + '/' + this.goodsId).then(res => {
                if (res.data.flag) {
                    this.couponList = res.data.data
                }
            })
        },
        lookCoupon() {
            this.couponShow = true
            axios.get('/coupon/' + this.shopId).then(res => {
                if (res.data.flag) {
                    this.couponList = res.data.data
                }
            })
        },
        toUpdate() {
            this.$router.push({
                path: '/modGoods',
                query: { goodsId: this.goodsId, status: 'update' }
            })
        },
        onClickLeft() {
            this.$router.back()
        },
        del() {
            Dialog.confirm({
                message: '是否确认删除该商品，并删除该商品的所有信息'
            }).then(() => {
                axios.delete('/goods/' + this.goodsId + ',').then(res => {
                    if (res.data.flag) {
                        Toast('删除成功')
                        this.$router.replace({
                            path: '/goods',
                            query: { shopId: this.shopId }
                        })
                    }
                })
            })
        },
        toComment() {
            this.$router.push(
                { path: '/comment', query: { goodsId: this.goodsId } }
            )
        },
        getGoodsDetail() {
            axios.get('/goods/getOne/' + this.goodsId + '/0').then(res => {
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