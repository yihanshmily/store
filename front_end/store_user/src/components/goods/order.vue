<template>
    <div>
        <!-- 导航栏 -->
        <div class="navbar">
            <van-nav-bar title="订单" left-text="返回" left-arrow @click-left="onClickLeft"
                style="background-color: rgba(152, 230, 240, 0.6);" fixed />
        </div>

        <!-- 订单内容分类展示 -->
        <van-tabs background="rgba(152, 230, 240, 0.6)" color="blue" @click="changeTabs" style="margin-top:46px" sticky
            animated swipeable ellipsis>
            <van-tab v-for="item in tabList" :key="item.id" :title="item.text" color="black" :name="item.name" scrollspy>
                <!-- 标签页中的内容 -->
                <div v-if="orderList.length !== 0">
                    <div v-for="item in orderList" :key="item.id" style="background-color: rgba(123, 229, 244, 0.7);">
                        <div style="margin: 10px 0px;">
                            <!-- 商铺 -->
                            <div style="width: 100%;margin: 10px 0px;" @click="toShop(item.shopId)">{{ item.shopName + '>'
                            }}
                            </div>
                            <!-- 内容展示 -->
                            <div style="display: flex;width: 100%;" @click="lookOrder(item.id)">
                                <div style="width: 30%;margin:4px 10px;" @click="toLookGoods(item.goodsId)">
                                    <van-image width="5rem" height="5rem" fit="cover"
                                        :src="utils.getImage(item.goodsImg)" />
                                </div>
                                <div style="width: 50%;">
                                    <div>{{ item.goodsName }}</div>
                                    <div style="font-size: 12px;color: gray;">{{ item.goodsDescription }}</div>
                                </div>
                                <div style="width: 20%;">
                                    <div style="color: red;">￥{{ item.totalPrice }}</div>
                                    <div style="color:gray">X{{ item.number }}</div>
                                </div>
                            </div>
                            <!-- 支付方式 -->
                            <div style="margin-left:  150px;">实际支付：{{ item.totalPrice }}元（微信）</div>
                            <!-- 操作 -->
                            <div style="width: 30%;display: flex;margin: 10px 220px;">
                                <van-button v-if="seral === '待分享'" type="danger" size="small"
                                    @click="updateCoupon(item.id)">分享</van-button>
                                <van-button v-if="seral === '待评价'" type="danger" size="small"
                                    @click="addComment(item.id)">评价</van-button>
                                <van-button type="danger" size="small" style="margin: 0px 10px;"
                                    @click="delOrder(item.id)">删除</van-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else><van-empty description="暂无订单" /></div>
            </van-tab>
        </van-tabs>

        <!-- 订单详情弹出框 -->
        <van-popup v-model="orderInfoShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);" round
            safe-area-inset-bottom :style="{ height: '70%' }" closeable>
            <van-row type="flex" justify="end" style="height: 40px;text-align: center;">
                <van-col span="24">订单详情</van-col>
            </van-row>
            <div>
                <hr>
                <!-- 地址 -->
                <div style="height: 30px;width: 100%;">
                    <van-icon name="location-o" color="red" style="margin-left: 20px;" />
                    <span style="line-height: 30px;margin:0px 20px 0px 20px;">{{ order.addressName }}</span>
                    <span style="line-height: 30px;margin-right: 20px;">{{ order.addressTel }}</span>
                    <span style="line-height: 30px;margin-right: 20px;">{{ order.addressInfo }}</span>
                </div>
                <div style="height: 5px;width: 100%;background-color: darkgrey;"></div>
                <!-- 商铺 -->
                <div style="width: 100%;margin: 10px;" @click="toShop(item.shopId)">{{ order.shopName + '>' }}</div>
                <!-- 商品展示 -->
                <div style="display: flex;width: 100%;">
                    <div style="width: 30%;margin:4px 10px;" @click="toLookGoods(order.goodsId)">
                        <van-image width="5rem" height="5rem" fit="cover" :src="utils.getImage(order.goodsImg)" />
                    </div>
                    <div style="width: 45%;">
                        <div>{{ order.goodsName }}</div>
                    </div>
                    <div style="width: 25%;">
                        <div style="color: red;text-align: center;">￥{{ order.totalPrice }}</div>
                        <div style="color:gray;text-align: center;">X{{ order.number }}</div>
                    </div>
                </div>
                <hr>
                <!-- 操作 -->
                <div style="margin: 10px 100px;width: 100%;display: flex;">
                    <van-button type="danger" size="small" @click="toGoodsDetail(order.goodsId)"
                        style="margin-right: 20px;">再次下单</van-button>
                    <van-button type="danger" size="small" @click="updateCoupon(item.id)"
                        style="margin-right: 20px;">联系商家</van-button>
                    <van-button type="danger" size="small" @click="updateCoupon(item.id)"
                        style="margin-right: 20px;">分享给好友</van-button>
                </div>
                <hr>
                <!-- 付费 -->
                <div style="margin-left:  55%;font-size: 13px;height: 20px;line-height: 10px;">实付：<span
                        style="color: red;">{{ order.totalPrice }}</span>元（免运费）</div>
                <div style="height: 5px;width: 100%;background-color: darkgrey;"></div>
                <!-- 评价 -->
                <van-cell v-if="order.commentScore" title="我的评价" is-link :value="order.commentScore + '星'"
                    style="background-color: aquamarine;margin: 10px 0px;" />
                <!-- 详情 -->
                <div style="font-size: 13px;color: gray;">
                    <div class="detailCls">订单编号：{{ order.sole }}</div>
                    <div class="detailCls" v-if="order.payWay">支付方式：{{ order.payWay }}</div>
                    <div class="detailCls">状态：{{ order.status }}</div>
                    <div class="detailCls" v-if="order.couponId">优惠卷：满{{ order.couponMeetMoney }}减{{ order.couponCutMoney }}
                    </div>
                    <div class="detailCls">下单时间：{{ utils.timestampToTime(order.createTime) }}</div>
                    <div class="detailCls">快递编号：{{ order.id }}</div>
                </div>
            </div>
        </van-popup>

        <!-- 发布评论弹出框 -->
        <van-popup v-model="commentShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);" round
            safe-area-inset-bottom :style="{ height: '70%' }" closeable>
            <van-row type="flex" justify="end" style="height: 40px;text-align: center;">
                <van-col span="24">评价</van-col>
            </van-row>
            <!-- 内容 -->
            <van-field v-model="comment.content" rows="3" autosize type="textarea" maxlength="50" placeholder="请评论"
                show-word-limit />
            <div style="height: 30px;line-height: 30px;display: flex;width: 100%;">
                <span style="margin: 10px 150px 10px 10px;">请评分</span>
                <div style="margin: 15px;"><van-rate v-model="comment.score" icon="like" void-icon="like-o"
                        void-color="gray" /></div>
            </div>
            <!-- 图片上传 -->
            <div style="background-color: rgba(255, 255, 255, 0.4);">
                <div>商品图片：</div>
                <van-grid :column-num="2" square>
                    <van-grid-item v-for="item in imgs" :key="item" icon="photo-o" text="文字">
                        <van-image width="8rem" height="8rem" :src="utils.getImage(item)" @click="delImg(item)" />
                    </van-grid-item>
                </van-grid>
            </div>
            <van-uploader preview-image preview-full-image deletable multiple v-model="fileList" show-upload max-count="6"
                upload-text="请上传图片" max-size="10485760" />
            <van-button type="danger" size="large" round @click="createComment()">发布评论</van-button>
        </van-popup>
    </div>
</template>

<script>
import axios from 'axios'
import utils from '@/utils'
import { Dialog, Toast } from 'vant'
export default {
    name: 'order',
    data() {
        return {
            loading: false,
            finished: false,
            orderInfoShow: false,
            commentShow: false,
            seral: '待评价',
            userId: window.sessionStorage.getItem('token.id'),
            order: '',
            orderList: [],
            imgs: [],
            fileList: [],
            tabList: [
                { name: '待评价', text: '待评价' }, { name: '待分享', text: '待分享' }, { name: 'finished', text: '已完成' },
            ],
            comment: {
                content: '',
                score: 0,
                img: '',
                goodsId: '',
                shopId: '',
                orderId: '',
                userId: window.sessionStorage.getItem('token.id'),
                isHead: 1
            }
        }
    },
    created() {
        this.getOrder()
    },
    methods: {
        delOrder(id) {
            Dialog.confirm({
                message: '是否删除此订单'
            }).then(() => {
                axios.put('/order/updateUser/' + id).then(res => {
                    if (res.data.flag) {
                        Toast('删除成功')
                        this.getOrder()
                    }
                })
            })
        },
        createComment() {
            this.orderList.forEach(item => {
                if (this.comment.orderId = item.id) {
                    this.comment.goodsId = item.goodsId
                    this.comment.shopId = item.shopId
                }
            })
            this.fileList.forEach((file) => {
                this.comment.img += file.file.name + ','
                utils.imgSuccess(file.file)
            })
            axios.post('/goods/comment', this.comment).then(res => {
                if (res.data.flag) {
                    Toast('评论成功')
                    this.getOrder()
                    this.commentShow = false
                }
            })
        },
        addComment(id) {
            this.commentShow = true
            this.comment.orderId = id
        },
        delImg(img) {
            Dialog.confirm({
                message: '是否删除该图片'
            }).then(() => {
                this.imgs.forEach(item => {
                    this.sum += 1
                    if (img === item) {
                        this.imgs.splice(this.imgs.length - this.sum - 1, 1)
                    }
                })
            })
            this.sum = 0
        },
        toGoodsDetail(goodsId) {
            this.$router.push({
                path: '/goodsDetail',
                query: { goodsId: goodsId }
            })
        },
        lookOrder(id) {
            this.orderInfoShow = true
            axios.get('/order/detail/' + id).then(res => {
                if (res.data.flag) {
                    this.order = res.data.data
                }
            })
        },
        getOrder() {
            axios.get('/order/' + this.seral + '/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.orderList = res.data.data
                }
            })
        },
        changeTabs(seral) {
            this.seral = seral
            this.orderList = []
            this.getOrder()
        },
        toLookGoods(goodsId) {
            this.$router.push({
                path: '/goodsDetail',
                query: { goodsId: goodsId }
            })
        },
        toShop(shopId) {
            this.$router.push(
                { path: '/shop', query: { shopId: shopId } }
            )
        },
        onClickLeft() {
            this.$router.back()
        }
    }
}
</script>

<style>
.detailCls {
    margin: 10px;
}</style>