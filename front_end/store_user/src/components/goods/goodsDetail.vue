<template>
    <div>
        <!-- 导航栏 -->
        <div class="navbar">
            <van-nav-bar title="商品" left-text="返回" left-arrow @click-left="onClickLeft()"
                style="background-color: rgba(152, 230, 240, 0.6);" fixed />
            <div style="margin-bottom: 46px;"></div>
        </div>

        <!-- 商品展示 -->
        <div>
            <div style="background-color: #EEEEEE;background-color: rgba(152, 230, 240, 0.6);">
                <!-- 商品轮播图 -->
                <van-swipe :autoplay="3000" indicator-color="white" lazy-render>
                    <van-swipe-item v-for="item in images" :key="item.id">
                        <van-image width="100%" height="350" fit="cover" :src="utils.getImage(item)" />
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

            <!-- 单元格 -->
            <van-cell style="margin-top: 10px;background-color: rgba(152, 230, 240, 0.6);" is-link title="优惠卷"
                icon="underway" @click="lookCoupon" />
            <van-cell style="margin-top: 10px;background-color: rgba(152, 230, 240, 0.6);" is-link title="商品评价"
                icon="underway" @click="toComment" />
            <van-cell style="margin-top: 10px;background-color: rgba(152, 230, 240, 0.6);" is-link title="商铺详情"
                :value="shop.name" :icon="utils.getImage(shop.img)" size="large" @click="toShop(shop.id)" />

            <!-- 相似商品 -->
            <div>
                <div style="text-align: center;margin: 10px;color: red;">相似商品</div>
                <van-grid :column-num="2">
                    <van-grid-item v-for="item in likeGoodsList" :key="item.id" icon="photo-o" text="文字"
                        @click="lookGoods(item.id)">
                        <div style="background-color: rgba(152, 230, 240, 0.6);text-align: center;">
                            <van-image width="10rem" height="8rem" fit="cover" :src="utils.getImage(item.img)" />
                            <div style="font-size: 17px;">{{ item.name }}</div>
                            <span style="color: darkred;">￥{{ item.price }}</span>
                        </div>
                    </van-grid-item>
                </van-grid>
            </div>

            <div style="margin-bottom: 60px;"></div>

            <!-- 下单弹出框 -->
            <van-popup v-model="addOrderShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);" round
                safe-area-inset-bottom :style="{ height: '80%' }" closeable>
                <van-row type="flex" justify="end" style="height: 20px;color: red;text-align: center;">
                    <van-col span="24">下单</van-col>
                </van-row>
                <div style="display: flex;">
                    <div style="width: 30%;margin: 20px;">
                        <van-image width="8rem" height="8rem" fit="cover" :src="utils.getImage(images[0])" />
                    </div>
                    <div style="width: 50%;margin: 40px 0px 0px 40px;">
                        <div style="font-size: 30px;color: salmon;">￥{{ goods.price }}</div>
                        <div>{{ goods.name }}</div>
                        <div>剩余：{{ shoping.goodsRep }}件</div>
                    </div>
                </div>
                <hr>
                <div style="display: flex;">
                    <span style="margin: 0px 150px 0px 40px;">请选择数量</span>
                    <van-stepper v-model="shoping.number" min="1" max="8" @change="changeNumber" />
                </div>
                <hr>
                <!-- 优惠卷 -->
                <div style="display:flex;height:50px;line-height:50px;">优惠卷：
                    <div v-if="selCouponList.length === 0" style="color:gray;float: right;">暂无优惠卷</div>
                    <div v-else style="color: red;" @click="selCoupon">优惠卷{{ selCouponList.length }}张</div>
                    <div v-if="showCoupon" style="margin-left:100px">满{{ coupon.meetMoney }}减{{ coupon.cutMoney }}</div>
                </div>
                <!-- 地址 -->
                <div v-if="addressList.length !== 0">
                    <div v-for="item in addressList" :key="item.id">
                        <div v-if="item.isDefault" style="display: flex;height: 60px; margin:10px auto;
                    background-color: rgba(152, 230, 240, 0.8);" @click="selectAddress">
                            <div style="width: 30%;line-height: 40px;font-size: 14px;">{{ item.name }}</div>
                            <div style="width: 30%;line-height: 40px;font-size: 14px;">{{ item.tel }}</div>
                            <div style="width: 80%;line-height: 100px;margin-left: -200px;">{{ item.addressInfo }}</div>
                        </div>
                    </div>
                </div>
                <div v-else style="height: 60px;text-align: center;line-height: 60px;
                    background-color: rgba(152, 230, 240, 0.8);" @click="addAddressShow = true">暂无地址，请添加地址</div>
                <van-field v-model="shoping.text" rows="1" type="textarea" placeholder="请输入留言" maxlength="50"
                    show-word-limit autosize label="留言" />
                <van-tabbar style="background-color: rgba(152, 230, 240, 0.8);">
                    <van-button type="danger" size="large" round
                        @click="createOrder(coupon.cutMoney, goods.price, shoping.number)">下单</van-button>
                </van-tabbar>
            </van-popup>

            <!-- 地址增加或修改的弹出框 -->
        <van-action-sheet v-model="addAddressShow" style="background-color: rgba(152, 230, 240, 0.8);"
            :style="{ height: '50%' }">
            <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                <van-col span="24">新增地址</van-col>
            </van-row>
            <van-form>
                <van-field v-model="address.name" label="收货人名" placeholder="收货人名" :rules="fromRules.addressName"
                    style="margin: 10px auto;width: 90%;background-color: rgba(152, 230, 240, 0.6);" />
                <van-field v-model="address.tel" label="电话号码" placeholder="电话号码" :rules="fromRules.addressTel"
                    style="margin: 10px auto;width: 90%;background-color: rgba(152, 230, 240, 0.6);" />
                <van-field v-model="address.addressInfo" label="收货地址" placeholder="收货地址" :rules="fromRules.addressInfo"
                    style="margin: 10px auto;width: 90%;background-color: rgba(152, 230, 240, 0.6);" />
                <van-cell-group style="margin: 10px auto;width: 90%;">
                    <van-switch-cell v-model="address.isDefault" title="是否默认"
                        style="background-color: rgba(152, 230, 240, 0.6);" />
                </van-cell-group>
                <div style="margin: 16px;">
                    <van-button round block type="info" @click="addAddress">保存</van-button>
                </div>
            </van-form>
        </van-action-sheet>

            <!-- 底部优惠卷弹出框 -->
            <van-action-sheet v-model="selCouponShow" style="background-color: rgba(152, 230, 240, 0.8);"
                :style="{ height: '50%' }">
                <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                    <van-col span="24">优惠卷</van-col>
                </van-row>
                <!-- 部分操作显示 -->
                <div v-for="item in selCouponList" :key="item.id">
                    <div style="display: flex;height: 60px; margin:10px auto; 
                    background-color: rgba(152, 230, 240, 0.8);" @click="selectCoupon(item.id)">
                        <div style="width: 5%;line-height: 60px;text-align: center;"><van-icon name="coupon-o" /></div>
                        <div style="width: 30%;line-height: 40px;font-size: 12px;">{{ item.goodsName }}</div>
                        <div style="width: 30%;line-height: 60px;text-align: center;">
                            满 <span style="color: brown;">{{ item.meetMoney }}</span>
                            减 <span style="color: brown;">{{ item.cutMoney }}</span>
                        </div>
                    </div>
                </div>
            </van-action-sheet>

            <!-- 底部地址弹出框 -->
            <van-action-sheet v-model="addressShow" style="background-color: rgba(152, 230, 240, 0.8);"
                :style="{ height: '50%' }">
                <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                    <van-col span="24">地址</van-col>
                </van-row>
                <!-- 部分操作显示 -->
                <div v-for="(item, index) in addressList" :key="item.id">
                    <div style="display: flex;height: 60px; margin:10px auto;
                        background-color: rgba(152, 230, 240, 0.8);" @click="selectAdr(item.id)">
                        <div style="width: 10%;line-height: 40px;font-size: 14px;">{{ index + 1 }}</div>
                        <div style="width: 20%;line-height: 40px;font-size: 14px;">{{ item.name }}</div>
                        <div style="width: 30%;line-height: 40px;font-size: 14px;">{{ item.tel }}</div>
                        <div style="width: 10%;line-height: 40px;font-size: 14px;color: blue;">{{ item.isDefault ? '默认' : ''
                        }}</div>
                        <div style="width: 80%;line-height: 100px;margin-left: -250px;">{{ item.addressInfo }}</div>
                    </div>
                </div>
            </van-action-sheet>

            <!-- 购物车弹出框 -->
            <van-popup v-model="shopingShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);" round
                safe-area-inset-bottom :style="{ height: '60%' }" closeable>
                <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                    <van-col span="24">购物车</van-col>
                </van-row>
                <div v-for="item in shopingList" :key="item.id">
                    <div style="display: flex;">
                        <div style="width: 30%;margin: 10px;">
                            <van-image width="5rem" height="5rem" fit="cover" :src="utils.getImage(item.goodsImg)" />
                        </div>
                        <div style="width: 70%;margin: 10px 0px 0px 10px;">
                            <div style="font-size: 25px;color: salmon;">￥{{ item.goodsPrice }}</div>
                            <van-row type="flex" justify="end">
                                <van-col span="12">{{ item.goodsName }}</van-col>
                                <van-col span="12" style="text-align: right;">X{{ item.number }}</van-col>
                            </van-row>
                            <div>{{ item.text }}</div>
                            <div style="display: flex;text-align: center;">
                                <div style="margin-left: 100px;">
                                    <van-button type="danger" size="small" @click="rmAddress(item.id)">下单</van-button>
                                </div>
                                <div style="margin-left: 20px;">
                                    <van-button type="danger" size="small" @click="rmShoping(item.id)">删除</van-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
            </van-popup>

            <!-- 加入购物车弹出框 -->
            <van-popup v-model="addShopingShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);" round
                safe-area-inset-bottom :style="{ height: '70%' }" closeable>
                <div style="display: flex;">
                    <div style="width: 30%;margin: 20px;">
                        <van-image width="8rem" height="8rem" fit="cover" :src="utils.getImage(images[0])" />
                    </div>
                    <div style="width: 50%;margin: 40px 0px 0px 40px;">
                        <div style="font-size: 30px;color: salmon;">￥{{ goods.price }}</div>
                        <div>{{ goods.name }}</div>
                        <div>剩余：{{ shoping.goodsRep }}件</div>
                    </div>
                </div>
                <hr>
                <div style="display: flex;">
                    <span style="margin: 0px 150px 0px 40px;">请选择数量</span>
                    <van-stepper v-model="shoping.number" min="1" max="8" />
                </div>
                <hr>
                <van-field v-model="shoping.text" rows="1" type="textarea" placeholder="请输入留言" maxlength="50"
                    show-word-limit autosize label="留言" />
                <van-tabbar style="background-color: rgba(152, 230, 240, 0.8);">
                    <van-button type="danger" size="large" round @click="createShoping">加入购物车</van-button>
                </van-tabbar>
            </van-popup>

            <!-- 优惠卷信息 -->
            <van-action-sheet v-model="couponShow" style="background-color: rgba(152, 230, 240, 0.8);"
                :style="{ height: '50%' }">
                <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                    <van-col span="24">优惠卷</van-col>
                </van-row>
                <!-- 部分操作显示 -->
                <div v-if="couponList.length != 0">
                    <div v-for="item in couponList" :key="item.id">
                        <div
                            style="display: flex;height: 60px; margin:10px auto; background-color: rgba(152, 230, 240, 0.8);">
                            <div style="width: 20%;line-height: 60px;text-align: center;"><van-icon name="coupon-o" /></div>
                            <div style="width: 50%;line-height: 60px;text-align: center;">
                                满 <span style="color: brown;">{{ item.meetMoney }}</span>
                                减 <span style="color: brown;">{{ item.cutMoney }}</span>
                            </div>
                            <div style="width: 30%;line-height: 50px;text-align: center;font-size: 13px;">
                                <van-button type="warning" size="normal" @click="getCoupon(item.id)">领取</van-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else style="height: 40px;color: gray;text-align: center;">暂无优惠卷</div>
            </van-action-sheet>

            <!-- 商品导航 -->
            <van-goods-action>
                <van-goods-action-icon icon="chat-o" text="客服" />
                <van-goods-action-icon icon="cart-o" text="购物车" @click="lookShoping" />
                <van-goods-action-icon :icon="isCollect ? 'star' : 'star-o'" text="收藏" @click="updateCollect" />
                <van-goods-action-button type="danger" text="加入购物车" @click="createShopingShow" />
                <van-goods-action-button type="danger" text="立即购买" @click="addOrderPopShow" />
            </van-goods-action>
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
            couponShow: false,
            addShopingShow: false,
            shopingShow: false,
            addOrderShow: false,
            addressShow: false,
            getDefault: false,
            selCouponShow: false,
            showCoupon: false,
            isUseCoupon: false,
            addAddressShow:false,
            isCollect: '',
            goodsId: this.$route.query.goodsId,
            userId: window.sessionStorage.getItem('token.id'),
            shopId: '',
            goods: '',
            shop: '',
            commonts: '',
            coupon: '',
            address: {
                name: '',
                tel: '',
                addressInfo: '',
                isDefault: false,
                userId: window.sessionStorage.getItem('token.id')
            },
            shoping: {
                goodsId: this.$route.query.goodsId,
                userId: window.sessionStorage.getItem('token.id'),
                number: 1,
                text: ''
            },
            order: {
                addressId: '',
                goodsId: this.$route.query.goodsId,
                userId: window.sessionStorage.getItem('token.id'),
                couponId: '',
                shopId: '',
                number: '',
                totalPrice: '',
            },
            fromRules: {
                addressName: [
                    { required: true, message: '收货人名不能空' },
                    {
                        validator: (val) => {
                            return /^[\u4e00-\u9fa5]{1,4}$/.test(val)
                        }, message: '请输入最多四个汉字的中文收货人名'
                    }
                ],
                addressTel: [
                    { required: true, message: '电话号码不能空' },
                    {
                        validator: (val) => {
                            return /^0?(13|14|15|18|17)[0-9]{9}$/.test(val)
                        }, message: '请输入正确的电话号码'
                    }
                ],
                addressInfo: [
                    { required: true, message: '收货地址不能空' },
                    {
                        validator: (val) => {
                            return /^[\u4e00-\u9fa5]{1,20}$/.test(val)
                        }, message: '请输入正确的收货地址'
                    }
                ],
            },
            goodsRep: '',
            images: [],
            likeGoodsList: [],
            couponList: [],
            selCouponList: [],
            shopingList: [],
            addressList: []
        }
    },
    created() {
        this.getGoodsDetail()
    },
    methods: {
        addAddress() {
            if (/^[\u4e00-\u9fa5]{1,4}$/.test(this.address.name) &&
                /^0?(13|14|15|18|17)[0-9]{9}$/.test(this.address.tel) &&
                /^[\u4e00-\u9fa5]{1,20}$/.test(this.address.addressInfo)) {
                    axios.post('/address/'+this.userId, this.address).then(res => {
                    if (res.data.flag) {
                        Toast('新增地址成功')
                        this.addAddressShow = false
                        this.getAddress()
                    }
                })
                }
            
        },
        changeNumber() {
            this.selCouponList = []
            const value = this.goods.price * this.shoping.number
            this.couponList.forEach(item => {
                if (item.meetMoney <= value) {
                    this.selCouponList.push(item)
                }
            })
        },
        createOrder(cutMoney, price, number) {
            this.order.shopId = this.shopId
            this.order.number = number
            this.order.totalPrice = price * number
            Dialog.confirm({
                message: '请支付' + this.order.totalPrice + '元'
            }).then(() => {
                axios.get('/wallet/' + this.userId).then(res => {
                    if (res.data.flag) {
                        if (res.data.data.wallet >= this.order.totalPrice) {
                            if (this.order.couponId === null || this.order.couponId === '') {
                                this.order.couponId = null
                            } else {
                                this.order.totalPrice = this.order.totalPrice - cutMoney
                            }
                            axios.post('/order', this.order).then(res => {
                                if (res.data.flag) {
                                    Toast('下单成功')
                                    setTimeout(() => {
                                        this.$router.go(0)
                                    }, 1000)
                                }
                            })
                        } else {
                            Toast('你的余额不足，请充值')
                        }
                    }
                })
            })
        },
        selectCoupon(id) {
            this.order.couponId = id
            this.selCouponList.forEach(item => {
                if (item.id === id) {
                    this.coupon = item
                    this.showCoupon = true
                }
            })
            this.selCouponShow = false
        },
        selCoupon() {
            this.selCouponShow = true
        },
        selectAdr(id) {
            this.order.addressId = id
            this.addressList.forEach(item => {
                item.isDefault = false
                if (item.id === id) {
                    item.isDefault = true
                }
            })
            this.addressShow = false
        },
        selectAddress() {
            this.addressShow = true
            axios.get('/address/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.addressList = res.data.data
                    console.log(this.addressList)
                    this.addressList[0].isDefault = true
                }
            })
        },
        getAddress(){
            axios.get('/address/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.addressList = res.data.data
                    this.addressList.forEach(item => {
                        if (item.isDefault) {
                            this.getDefault = true
                            this.order.addressId = item.id
                        }
                    })
                    if (!this.getDefault) {
                        this.addressList.forEach((item, index) => {
                            if (index === 0) {
                                item.isDefault = true
                                this.order.addressId = item.id
                            }
                        })
                    }
                }
            })
        },
        addOrderPopShow() {
            this.addOrderShow = true
            // 获取地址
            this.getAddress()
            // 获取库存
            axios.get('/repertory/goodsRep/' + this.goodsId).then(res => {
                if (res.data.flag) {
                    this.goodsRep = res.data.data
                }
            })
            // 获取优惠卷
            axios.get('/coupon/selGoodsCoupon/' + this.userId + '/' + this.goodsId).then(res => {
                if (res.data.flag) {
                    this.couponList = res.data.data
                }
            })
            this.changeNumber()
        },
        rmShoping(id) {
            Dialog.confirm({
                message: '是否移除出购物车'
            }).then(() => {
                axios.delete('/shoping/' + id).then(res => {
                    if (res.data.flag) {
                        Toast('移除成功')
                        this.lookShoping()
                    }
                })
            })
        },
        lookShoping() {
            this.shopingShow = true
            axios.get('/shoping/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.shopingList = res.data.data
                }
            })
        },
        createShoping() {
            axios.post('/shoping', this.shoping).then(res => {
                if (res.data.flag) {
                    Toast('加入购物车成功')
                    this.addShopingShow = false
                }
            })
        },
        createShopingShow() {
            this.addShopingShow = true
            axios.get('/repertory/goodsRep/' + this.goodsId).then(res => {
                if (res.data.flag) {
                    this.goodsRep = res.data.data
                }
            })
        },
        getCoupon(couponId) {
            const coupon = {
                userId: this.userId,
                couponId: couponId
            }
            axios.post('/coupon/get', coupon).then(res => {
                if (res.data.flag) {
                    Toast('领取成功')
                    this.lookCoupon()
                }
            })
        },
        lookCoupon() {
            this.couponShow = true
            axios.get('/coupon/goodsCoupon/' + this.userId + '/' + this.goodsId).then(res => {
                if (res.data.flag) {
                    this.couponList = res.data.data
                }
            })
        },
        toShop(shopId) {
            this.$router.push(
                { path: '/shop', query: { shopId: shopId } }
            )
        },
        lookGoods(goodsId) {
            this.goodsId = goodsId
            this.getGoodsDetail()
        },
        updateCollect() {
            this.isCollect = !this.isCollect
            axios.put('/collect/' + this.userId + '/' + this.goodsId + '/' + this.shop.id + '/' + this.isCollect).then(res => {
                if (res.data.flag && this.isCollect) {
                    Toast('收藏成功')
                } else {
                    Toast('取消收藏')
                }
            })
        },
        onClickLeft() {
            this.$router.back()
        },
        toComment() {
            this.$router.push(
                { path: '/comment', query: { goodsId: this.goodsId, shopId: this.shopId } }
            )
        },
        getGoodsDetail() {
            axios.get('/goods/getOne/' + this.goodsId + '/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.goods = res.data.data
                    this.shopId = res.data.data.shopId
                    this.images = res.data.data.img.split(',')
                    this.images.splice(this.images.length - 1, 1)
                    // 获取商铺信息
                    axios.get('/identity/商铺/' + res.data.data.shopId).then(res => {
                        if (res.data.flag) {
                            this.shop = res.data.data
                        }
                    })
                    // 是否收藏
                    axios.get('/collect/isCollect/' + this.userId + '/' + this.goodsId).then(res => {
                        if (res.data.flag) {
                            this.isCollect = res.data.data
                        }
                    })
                    // 获取相似商品
                    axios.get('/goods/category/' + res.data.data.categoryId + '/' + this.goodsId).then(res => {
                        this.likeGoodsList = res.data.data
                    })
                }
            })
        },

    }
}
</script>

<style></style>