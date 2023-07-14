<template>
    <div>
        <!-- 导航栏 -->
        <div class="navbar">
            <van-nav-bar title="商品评论" left-text="返回" left-arrow @click-left="onClickLeft()" 
                />
        </div>
        <!-- 评论 -->
        <div v-for="item in commonts" :key="item.id">
            <div style="margin-top:10px;" @click="lookSonComment(item.id)">
                <!-- 头像 -->
                <van-image round width="5rem" height="5rem" :src="utils.getImage(item.userImg)" />
                <!-- 点赞与评论 -->
                <van-icon name="like-o" style="position: relative;top: -70px;left: 120px;" size="25px">{{ item.giveLike
                }}</van-icon>
                <van-icon name="chat-o" style="position: relative;top: -70px;right: -160px;" size="25px">{{ item.sonComments
                }}</van-icon>
                <!-- 评论用户名 -->
                <div style="margin: -90px 0px 10px 100px;">{{ item.userName }}</div>
                <!-- 内容 -->
                <div style="margin: 0px 0px 30px 100px;">{{ item.content }}</div>
                <!-- 图片 -->
                <div v-for="(i, index) in item.commentImgs" :key="index" style="margin-left: 100px;">
                    <van-image width="8rem" height="8rem" :src="utils.getImage(i)" />
                </div>
                <!-- 评分 -->
                <van-rate style="margin: 20px 0px 0px 90px;" v-model="item.score" />
                <!-- 时间 -->
                <div style="margin: -20px 0px 0px 230px;">{{ utils.timestampToTime(item.createTime) }}</div>
                <hr>
            </div>
            <!-- 子评论弹出层 -->
            <van-popup v-model="commentShow" overlay round close-on-popstate closeable safe-area-inset-bottom
                position="bottom" :style="{ height: '40%' }">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <van-cell v-for="item in sonComments" :key="item.id">
                        <div style="margin-top:40px;width: 70%;">
                            <div style="display: flex;width: 100%;">
                                <!-- 头像 -->
                                <div style="margin-right: 20px;">
                                    <van-image round width="5rem" height="5rem" :src="utils.getImage(item.userImg)" />
                                </div>
                                <!-- 评论用户名 -->
                                <div style="margin-right: 50px;">{{ item.userName }}</div>
                                <!-- 商铺名 -->
                                <div style="color: aqua;">{{ item.shopName }}</div>
                            </div>
                            <!-- 时间 -->
                                <div style="margin:-60px 0px 0px 100px;color: cadetblue;">
                                    {{ utils.timestampToTime(item.createTime) }}</div>
                                <!-- 内容 -->
                                <div style="margin:10px 0px 20px 100px;font-size: 18px;">{{ item.content }}</div>
                        </div>
                        <!-- 点赞评论 -->
                        <div style="display: flex;">
                            <!-- 评分 -->
                            <div style="width: 50%;"><van-rate v-model="item.score" /></div>
                            <div style="width: 25%;text-align: center;"><van-icon name="like-o" size="25px" />{{
                                item.giveLike }}</div>
                            <div style="width: 25%;text-align: center   ;"><van-icon name="chat-o" size="25px" />{{
                                item.sonComments }}</div>
                        </div>
                        <hr>
                    </van-cell>
                </van-list>
            </van-popup>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'comment',
    data() {
        return {
            goodsId: this.$route.query.goodsId,
            commonts: '',
            sonComments: '',
            commentShow: false,
            loading: false,
            finished: false
        }
    },
    created() {
        this.getCommont()
    },
    methods: {
        onLoad() {

        },
        lookSonComment(id) {
            this.commentShow = true
            axios.get('/goods/comment/notHead/' + this.goodsId+'/'+id).then(res => {
                if (res.data.flag) {
                    this.sonComments = res.data.data
                }
            })
        },
        getCommont() {
            axios.get('/goods/comment/head/' + this.goodsId).then(res => {
                if (res.data.flag) {
                    this.commonts = res.data.data
                }
            })

        },
        onClickLeft() {
            this.$router.back()
        },
    }
}
</script>

<style></style>