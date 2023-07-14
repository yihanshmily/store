<template>
    <div>
        <!-- 个人信息展示 -->
        <div class="headDiv" style="width: 100%;">
            <!-- 头像 -->
            <div>
                <van-image round width="8rem" height="8rem" :src="utils.getImage(shop.img)" />
            </div>
            <div>
                <!-- 名字 -->
                <div style="margin: 10px;font-size: 18px;">{{ shop.name }}</div>
                <!-- 账号 -->
                <div style="margin: 10px;font-size: 18px;">ID：{{ shop.sole }}</div>
                <div style="margin: 10px;font-size: 18px;">电话号码：{{ shop.tel }}</div>
            </div>
        </div>
        <!-- 部分操作显示 -->
        <div style="display: flex;width: 80%;height: 80px; margin: -10px auto;font-size: 18px;border-radius:10%;
        color: salmon;background-color: rgba(152, 230, 240, 0.8);">
            <div style="width: 33%;height: 80px;line-height: 80px;text-align: center;" @click="toGoods">商品详情</div>
            <div style="width: 33%;height: 80px;line-height: 80px;text-align: center;" @click="toRepertory">库存详情</div>
            <div style="width: 34%;height: 80px;line-height: 80px;text-align: center;" @click="toOrder">订单详情</div>
        </div>
        <!-- 个人信息相关 -->
        <div style="width: 80%;margin: 50px auto;">
            <van-cell title="个人信息" is-link @click="showInfo"
                style="background-color: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
            <van-cell title="优惠卷" is-link @click="lookCoupon"
                style="background-color: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
            <van-cell title="收藏" is-link @click="toCollect"
                style="background-color: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
            <van-cell title="好友" is-link style="background-color: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
            <van-cell title="收益" is-link @click="toGain"
                style="background-color: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
            <van-cell title="设置" is-link @click="bottomShow = true"
                style="background-color: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
        </div>

        <!-- 优惠卷信息 -->
        <div>
            <van-action-sheet v-model="couponShow" style="background-color: rgba(152, 230, 240, 0.8);"
                :style="{ height: '50%' }">
                <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                    <van-col span="8">优惠卷</van-col>
                    <van-col span="8" @click="addCouponLook">添加优惠卷</van-col>
                </van-row>
                <!-- 部分操作显示 -->
                <div v-for="item in couponList" :key="item.id">
                    <div style="display: flex;height: 60px; margin:10px auto; background-color: rgba(152, 230, 240, 0.8);">
                        <div style="width: 5%;line-height: 60px;text-align: center;"><van-icon name="coupon-o" /></div>
                        <div style="width: 20%;line-height: 60px;text-align: center;">
                            <van-image round width="3rem" height="3rem" :src="utils.getImage(item.goodsImg)"
                                style="margin: 6px;" />
                        </div>
                        <div style="width: 30%;line-height: 40px;font-size: 12px;">{{ item.goodsName }}</div>
                        <div style="width: 30%;line-height: 60px;text-align: center;">
                            满 <span style="color: brown;">{{ item.meetMoney }}</span>
                            减 <span style="color: brown;">{{ item.cutMoney }}</span>
                        </div>
                        <div style="width: 20%;line-height: 30px;text-align: center;font-size: 13px;">
                            拥有数:<span style="color: darkgoldenrod;">{{ item.userSums }}</span><br>
                            <van-button type="danger" size="mini" @click="updateCoupon(item.id)">修改</van-button>
                            <van-button type="warning" size="mini" @click="delCoupon(item.id)">删除</van-button>
                        </div>
                    </div>
                </div>
            </van-action-sheet>
        </div>

        <!-- 新增或修改优惠卷 -->
        <van-action-sheet v-model="changeCouponShow" style="background-color: rgba(152, 230, 240, 0.8);"
            :style="{ height: '40%' }">
            <van-form validate-first>
                <van-field readonly clickable label="商品" :value="coupon.goodsId" placeholder="选择商品"
                    @click="showPicker = true" style="margin: 10px auto;width: 90%;background-color: bisque;" />
                <van-field label="满额" v-model="coupon.meetMoney" :rules="[{ pattern, message: '请输入数字' }]"
                    style="margin: 10px auto;width: 90%;background-color: bisque;" placeholder="请输入满额" />
                <van-field label="减额" v-model="coupon.cutMoney" :rules="[{ pattern, message: '请输入数字' }]"
                    style="margin: 10px auto;width: 90%;background-color: bisque;" placeholder="请输入减额" />
            </van-form>
            <div style="margin: 16px;">
                <van-button round block type="info" @click="changeCoupon">保存</van-button>
            </div>
            <van-popup v-model="showPicker" round position="bottom">
                <van-picker show-toolbar :columns="goodsNameList" @cancel="showPicker = false" @confirm="onConfirm" />
            </van-popup>
        </van-action-sheet>


        <!-- 个人主页信息 -->
        <div>
            <van-action-sheet v-model="infoShow" style="background-color: rgba(152, 230, 240, 0.8);">
                <div style="margin-bottom: 50px;font-size: 19px;">
                    <van-image round width="7rem" height="7rem" :src="utils.getImage(shop.img)"
                        style="margin: 40px 0px 10px 40px;" />
                    <div>
                        <div style="margin: 10px;">商铺名：{{ shop.name }}</div>
                        <div style="margin: 10px;">账号：{{ shop.sole }}</div>
                        <div style="margin: 10px;">电话号码：{{ shop.tel }}</div>
                    </div>
                    <div style="margin: 10px;">商铺龄：{{ utils.timestampToTime(shop.createTime) }}</div>
                    <div style="display: flex;margin-left: 10px;">
                        <div style="width: 30%;text-align: center;"><span style="color: coral;">0</span>粉丝</div>
                        <div style="width: 30%;text-align: center;"><span style="color: coral;">0</span>收藏</div>
                        <div style="width: 30%;text-align: center;"><span style="color: coral;">0</span>好友</div>
                    </div>
                    <div style="margin: 20px 0px 0px 280px;">
                        <van-button round type="info" @click="toUpdate">修改资料</van-button>
                    </div>
                </div>
            </van-action-sheet>
        </div>

        <!-- 底部设置弹出框 -->
        <van-popup v-model="bottomShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);"
            round safe-area-inset-bottom>
            <van-cell icon="user-circle-o" title="修改密码" @click="toUpdatePwd" is-link
                style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
            <van-cell icon="replay" title="退出登录" is-link @click="logout"
                style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
        </van-popup>
    </div>
</template>

<script>
import axios from 'axios'
import { Dialog, Toast } from 'vant'
export default {
    name: 'myInfo',
    data() {
        return {
            infoShow: false,
            bottomShow: false,
            couponShow: false,
            changeCouponShow: false,
            showPicker: false,
            couponList: [],
            goodsIdList: [],
            goodsNameList: [],
            indexnum: 0,
            shopId: window.sessionStorage.getItem('token.id'),
            shop: '',
            coupon: {
                goodsId: '',
                shopId: window.sessionStorage.getItem('token.id'),
                meetMoney: '',
                cutMoney: ''
            },
            addOfUpdate: '',
            pattern: /-?[1-9]\d*/,
        }
    },
    created() {
        this.getInfo()
    },
    methods: {
        delCoupon(couponId) {
            axios.get('/coupon/isZero/' + couponId).then(res => {
                if (res.data.flag) {
                    Dialog.confirm({
                        message: '是否删除此优惠卷'
                    }).then(() => {
                        axios.delete('/coupon/' + couponId).then(res => {
                            if (res.data.flag) {
                                Toast('删除成功')
                                this.lookCoupon()
                            }
                        })
                    })
                } else {
                    Toast('用户拥有此优惠卷，不能删除')
                }
            })

        },
        updateCoupon(couponId) {
            this.changeCouponShow = true
            this.addOfUpdate = 'update'
            this.getGoodsOfShop()
            axios.get('/coupon/getOne/' + couponId).then(res => {
                if (res.data.flag) {
                    this.coupon = res.data.data
                    this.coupon.goodsId = this.goodsNameList[this.goodsIdList.indexOf(res.data.data.goodsId)]
                }
            })
        },
        changeCoupon() {
            if (this.coupon.goodsId === '' || this.coupon.meetMoney === '' || this.coupon.cutMoney === '') {
                Toast('内容不能为空')
            } else {
                this.coupon.goodsId = this.goodsIdList[this.indexnum]
                if (this.addOfUpdate === 'add') {
                    axios.post('/coupon', this.coupon).then(res => {
                        if (res.data.flag) {
                            Toast('添加成功')
                        }
                    })
                } else {
                    axios.put('/coupon', this.coupon).then(res => {
                        if (res.data.flag) {
                            Toast('修改成功')
                        }
                    })
                }
                this.changeCouponShow = false
                this.coupon.clear()
                this.couponShow = false
                this.lookCoupon()
            }
        },
        addCouponLook() {
            this.changeCouponShow = true
            this.addOfUpdate = 'add'
            this.getGoodsOfShop()
        },
        lookCoupon() {
            this.couponShow = true
            axios.get('/coupon/' + this.shopId).then(res => {
                if (res.data.flag) {
                    this.couponList = res.data.data
                }
            })
        },
        // 获取指定商铺的商品
        getGoodsOfShop() {
            this.g
            axios.get('/goods/' + this.shopId).then(res => {
                if (res.data.flag) {
                    res.data.data.forEach(item => {
                        this.goodsIdList.push(item.id)
                        this.goodsNameList.push(item.name)
                    });
                }
            })
        },
        onConfirm(value) {
            this.indexnum = this.goodsNameList.indexOf(value)
            this.coupon.goodsId = value
            this.showPicker = false;
        },
        toCollect() {
            this.$router.push({
                path: '/collect'
            })
        },
        toGain() {
            this.$router.push({
                path: '/gain'
            })
        },
        toOrder() {
            this.$router.push({
                path: '/order'
            })
        },
        toRepertory() {
            this.$router.push({
                path: '/repertory'
            })
        },
        toGoods() {
            this.$router.push({
                path: '/goods',
                query: { shopId: this.shopId }
            })
        },
        toUpdatePwd(){
            this.$router.push({
                    path: '/updatePwd',
                    query: { shopId: this.shopId }
                })
        },
        logout(){
            Dialog.confirm({
                    message: '是否确认退出该账号'
                }).then(() => {
                    window.sessionStorage.clear()
                    this.$router.replace({
                        path: '/login'
                    })
                })
        },
        showInfo() {
            this.infoShow = true
            this.getInfo()
        },
        getInfo() {
            axios.get('/identity/shop/' + this.shopId).then(res => {
                if (res.data.flag) {
                    this.shop = res.data.data
                }
            })
        },
        toUpdate() {
            this.$router.push({
                path: '/updateInfo',
                query: { shopId: this.shopId }
            })
        }
    }
}
</script>

<style>
.headDiv {
    display: flex;
    padding: 40px 20px;
    background-color: rgba(165, 205, 248, 0.6);
    border-bottom-left-radius: 30%;
    border-bottom-right-radius: 30%;
}
</style>