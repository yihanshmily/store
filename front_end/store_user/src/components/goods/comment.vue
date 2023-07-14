<template>
    <div>
        <!-- 导航栏 -->
        <div class="navbar">
            <van-nav-bar title="商品评论" left-text="返回" left-arrow @click-left="onClickLeft()"
                style="background-color: rgba(152, 230, 240, 0.6);" />
        </div>
        <!-- 评论 -->
        <div v-for="item in commonts" :key="item.id">
            <div style="margin-top:10px;">
                <!-- 头像 -->
                <van-image round width="5rem" height="5rem" :src="utils.getImage(item.userImg)" />
                <!-- 点赞与评论 -->
                <van-icon :name="isGive ? 'like' : 'like-o'" style="position: relative;top: -65px;left: 120px;" size="25px"
                    @click="changeGive(item.id, item.giveLike)">{{ item.giveLike
                    }}</van-icon>
                <van-icon name="chat-o" style="position: relative;top: -65px;right: -160px;" size="25px"
                    @click="lookSonComment(item.id)">{{ item.sonComments
                    }}</van-icon>
                <!-- 评论用户名 -->
                <div style="margin: -90px 0px 10px 100px;">{{ item.userName }}</div>
                <!-- 内容 -->
                <div style="margin: 0px 0px 50px 100px;">{{ item.content }}</div>
                <!-- 图片 -->
                <van-grid :column-num="3" style="width: 80%;margin:auto;" gutter="5">
                    <van-grid-item v-for="(i, index) in item.commentImgs" :key="index">
                        <van-image width="100%" height="100%" :src="utils.getImage(i)" />
                    </van-grid-item>
                </van-grid>
                <!-- 评分 -->
                <van-rate style="margin: 20px 0px 0px 90px;" v-model="item.score" />
                <!-- 时间 -->
                <div style="margin: -20px 0px 0px 200px;">{{ utils.timestampToTime(item.createTime) }}</div>
                <hr>
            </div>
        </div>


        <!-- 子评论弹出层 -->
        <van-popup v-model="commentShow" overlay round close-on-popstate safe-area-inset-bottom position="bottom"
            :style="{ height: '60%' }" style="background-color: rgba(152, 230, 240, 0.8);">
            <van-row type="flex" justify="end" style="height: 20px;text-align: center;">
                <van-col span="8">评论</van-col>
                <van-col span="8" @click="addCommentShow = true">发布评论</van-col>
            </van-row>
            <div v-if="sonComments.length !== 0">
                <van-cell v-for="item in sonComments" :key="item.id" style="background-color: rgba(152, 230, 240, 0.8);">
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

                    </div>
                </van-cell>
            </div>
            <div v-else><van-empty description="暂无评论" /></div>
        </van-popup>

        <!-- 发布评论弹出框 -->
        <van-popup v-model="addCommentShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);" round
            safe-area-inset-bottom :style="{ height: '70%' }" closeable>
            <van-row type="flex" justify="end" style="height: 40px;text-align: center;">
                <van-col span="24">评价</van-col>
            </van-row>
            <!-- 内容 -->
            <van-field v-model="comment.content" rows="3" autosize type="textarea" maxlength="50" placeholder="请评论"
                show-word-limit />
            <div style="height: 30px;line-height: 30px;display: flex;width: 100%;margin:20px 0px;">
                <span style="margin: 10px 150px 10px 10px;">请评分</span>
                <div style="margin: 15px;"><van-rate v-model="comment.score" icon="like" void-icon="like-o"
                        void-color="gray" /></div>
            </div>
            <van-button type="danger" size="large" round @click="addNoHeadComment">发布评论</van-button>
        </van-popup>

    </div>
</template>

<script>
import axios from 'axios'
import { Toast } from 'vant'
import utils from '@/utils'
export default {
    name: 'comment',
    data() {
        return {
            goodsId: this.$route.query.goodsId,
            commonts: '',
            sonComments: '',
            commentShow: false,
            addCommentShow: false,
            isGive: false,
            comment: {
                shopId: this.$route.query.shopId,
                content: '',
                score: 0,
                goodsId: '',
                orderId: null,
                userId: window.sessionStorage.getItem('token.id'),
                isHead: 0,
                headCommentId: ''
            }
        }
    },
    created() {
        this.getCommont()
    },
    methods: {
        addNoHeadComment() {
            this.comment.goodsId = this.goodsId;
            axios.post('/goods/comment', this.comment).then(res => {
                if (res.data.flag) {
                    Toast('评论成功')
                    this.getCommont()
                    this.addCommentShow = false
                    this.commentShow = false
                }
            })
        },
        changeGive(id, giveLike) {
            if (!this.isGive) {
                giveLike += 1
            } else {
                giveLike -= 1
            }
            axios.put('/goods/comment/give/' + id + '/' + giveLike).then(res => {
                if (res.data.flag) {
                    if (!this.isGive) {
                        Toast('点赞成功')
                    } else {
                        Toast('取消点赞')
                    }
                    this.getCommont()
                    this.isGive = !this.isGive
                }
            })
        },
        onLoad() {

        },
        lookSonComment(id) {
            this.commentShow = true
            this.comment.headCommentId = id
            axios.get('/goods/comment/notHead/' + this.goodsId + '/' + id).then(res => {
                if (res.data.flag) {
                    this.sonComments = res.data.data
                    this.sonComImgs = res.data.data.img.split(',')
                    this.sonComImgs.splice(this.sonComImgs.length - 1, 1)
                    console.log(this.sonComImgs)
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