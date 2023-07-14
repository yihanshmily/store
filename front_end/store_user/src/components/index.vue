<template>
    <div>
        <!-- 搜索框 -->
        <div style="width: 100%;display: flex;">
            <van-search style="width: 85%;background-color: rgba(152, 230, 240, 0.6);" shape="round"
                background="rgba(152, 230, 240, 0.6)" placeholder="请输入搜索关键词" @focus="toSearch" />
            <van-image width="3rem" height="3rem" fit="cover" round style="margin-top: 5px;" :src="utils.getImage(user.img)"
                @click="infoShow = true" />
        </div>

        <!-- 左侧弹出框 -->
        <van-popup v-model="infoShow" round position="left" style="width: 85%;height: 100%;" closeable>
            <!-- 个人信息展示 -->
            <div class="headDiv" style="width: 100%;background-color: cyan;">
                <!-- 头像 -->
                <div>
                    <van-image round width="4rem" height="4rem" :src="utils.getImage(user.img)"
                        style="margin: 10px 10px;" />
                </div>
                <div>
                    <div style="margin:10px;font-size: 15px;">{{ user.name }}</div>
                    <div style="margin:10px;font-size: 13px;">ID：{{ user.sole }}</div>
                </div>
            </div>
            <!-- 个人信息相关 -->
            <div style="width: 100%;margin: 20px auto;">
                <van-cell icon="user-o" title="个人信息" @click="toMyInfo" is-link
                    style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
                <van-cell icon="balance-o" title="钱包" @click="toWallet" is-link
                    style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
                <van-cell icon="goods-collect-o" title="收藏" @click="lookCollect" is-link
                    style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
                <van-cell icon="logistics" title="收货地址" @click="lookAddress" is-link
                    style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
                <van-cell icon="shopping-cart-o" title="购物车" is-link @click="lookShoping"
                    style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
                <van-cell icon="point-gift-o" title="订单" is-link @click="toOrder"
                    style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
                <van-cell icon="notes-o" title="足迹" @click="lookFoots" is-link
                    style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
                <van-cell icon="coupon-o" title="优惠卷" is-link @click="lookCoupon"
                    style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
                <van-cell icon="comment-o" title="评价" is-link
                    style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
                <hr>
                <van-cell icon="setting-o" title="设置" @click="setShow = true" is-link
                    style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
            </div>
        </van-popup>

        <!-- 购物车弹出框 -->
        <van-popup v-model="shopingShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);" round
                safe-area-inset-bottom :style="{ height: '60%' }" closeable>
                <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                    <van-col span="24">购物车</van-col>
                </van-row>
                <div v-if="shopingList.length !== 0">
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
                                    <van-button type="danger" size="small" @click="toOrderStart()">下单</van-button>
                                </div>
                                <div style="margin-left: 20px;">
                                    <van-button type="danger" size="small" @click="rmShoping(item.id)">删除</van-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
                </div>
                <div v-else><van-empty description="暂无购物车" /></div>
            </van-popup>

        <!-- 地址增加或修改的弹出框 -->
        <van-action-sheet v-model="addressChangeShow" style="background-color: rgba(152, 230, 240, 0.8);"
            :style="{ height: '50%' }">
            <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                <van-col span="24">{{ addressIfAdd === 'add' ? '新增' : '修改' }}地址</van-col>
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
                    <van-button round block type="info" @click="changeAddress">保存</van-button>
                </div>
            </van-form>
        </van-action-sheet>

        <!-- 底部地址弹出框 -->
        <van-action-sheet v-model="addressShow" style="background-color: rgba(152, 230, 240, 0.8);"
            :style="{ height: '50%' }">
            <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                <van-col span="8">地址</van-col>
                <van-col span="8" @click="addAddress">新增地址</van-col>
            </van-row>
            <!-- 部分操作显示 -->
            <div v-if="addressList.length !== 0">
                <div v-for="(item, index) in addressList" :key="item.id">
                <div style="display: flex;height: 60px; margin:10px auto; background-color: rgba(152, 230, 240, 0.8);">
                    <div style="width: 10%;line-height: 40px;font-size: 14px;">{{ index + 1 }}</div>
                    <div style="width: 20%;line-height: 40px;font-size: 14px;">{{ item.name }}</div>
                    <div style="width: 30%;line-height: 40px;font-size: 14px;">{{ item.tel }}</div>
                    <div style="width: 10%;line-height: 40px;font-size: 14px;color: blue;">{{ item.isDefault? '默认' : '' }}</div>
                    <div style="width: 80%;line-height: 100px;margin-left: -250px;">{{ item.addressInfo}}</div>
                    <div style="width: 10%;line-height: 60px;text-align: left;">
                        <div style="line-height: 30px;text-align: left;"><van-button type="info"
                                size="small" @click="updateAddress(item.id)">修改</van-button></div>
                        <div style="line-height: 30px;text-align: left;"><van-button type="danger"
                                size="small" @click="rmAddress(item.id)">删除</van-button></div>
                    </div>
                </div>
            </div></div>
            <div v-else><van-empty description="暂无地址" /></div>
        </van-action-sheet>

        <!-- 底部优惠卷弹出框 -->
        <van-action-sheet v-model="couponShow" style="background-color: rgba(152, 230, 240, 0.8);"
            :style="{ height: '50%' }">
            <van-row type="flex" justify="end" style="height: 40px;color: red;text-align: center;">
                <van-col span="24">优惠卷</van-col>
            </van-row>
            <!-- 部分操作显示 -->
            <div v-if="couponList.length !== 0">
                <div v-for="item in couponList" :key="item.id">
                <div style="display: flex;height: 60px; margin:10px auto; background-color: rgba(152, 230, 240, 0.8);">
                    <div style="width: 5%;line-height: 60px;text-align: center;"><van-icon name="coupon-o" /></div>
                    <div style="width: 20%;line-height: 60px;text-align: center;">
                        <van-image round width="3rem" height="3rem" :src="utils.getImage(item.goodsImg)"
                            style="margin: 6px;" @click="toLookGoods(item.goodsId)" />
                    </div>
                    <div style="width: 30%;line-height: 40px;font-size: 12px;">{{ item.goodsName }}</div>
                    <div style="width: 30%;line-height: 60px;text-align: center;">
                        满 <span style="color: brown;">{{ item.meetMoney }}</span>
                        减 <span style="color: brown;">{{ item.cutMoney }}</span>
                    </div>
                </div>
            </div>
            </div>
            <div v-else><van-empty description="暂无优惠卷" /></div>
        </van-action-sheet>

        <!-- 底部钱包弹出框 -->
        <van-popup v-model="walletShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);"
            round safe-area-inset-bottom :style="{ height: '70%' }">
            <van-row type="flex" justify="end">
                <van-col span="10">钱包</van-col>
                <van-col span="4" @click="changeLook">{{ isFrom === true ? '账单' : '零钱' }}</van-col>
            </van-row>
            <hr>
            <div v-if="isFrom">
                <div style="margin: 10px 0px;">
                    <div style="display: flex;width: 100%;height: 100px;background-color: aquamarine;border-radius: 10px;">
                        <div style="margin:auto;">
                            <div><van-icon name="cash-on-deliver" size="2rem" /></div>
                            <div>钱包</div>
                            <div>{{ allCount }}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div v-if="!addShow" style="margin-left: 300px;">
                        <van-button type="info" round @click="addShow = true">充值</van-button>
                    </div>
                    <div v-else>
                        <van-cell-group>
                            <van-field v-model="rechargeMoney" placeholder="请输入充值的金额" :rules="fromRules.money" label="￥" />
                        </van-cell-group>
                        <van-button type="danger" round style="margin-left: 300px;" @click="recharge">确定</van-button>
                    </div>
                </div>
            </div>
            <div v-else>
                <div style="width: 100%;text-align: center;">
                    <van-button round type="primary" @click="dateShow = true">
                        {{ utils.timestampToTimeMonth(currentDate) }}</van-button>
                    <span style="margin-left: 70px;">收入：<span style="font-size: small;">{{ wallet.addCount }}</span></span>
                    <span style="margin-left: 10px;">支出：<span style="font-size: small;">{{ wallet.desCount.toFixed(2) }}</span></span>
                </div>
                <div v-if="walletBill.length !== 0">
                    <div v-for="(item, index) in walletBill" :key="index">
                    <div style="display: flex;">
                        <van-image round width="4rem" height="4rem" :src="utils.getImage(item.goodsImg)"
                            style="margin: 10px 10px;" />
                        <div style="margin: 20px;">{{ item.isAdd === true ? '充值' : '支付给：' + item.shopName }}</div>
                        <div style="margin: 20px;">
                            <div v-if="item.isAdd" style="color: burlywood;">+{{ item.money }}</div>
                            <div v-else style="color: salmon;">-{{ item.money }}</div>
                        </div>
                    </div>
                </div>
                </div>
                <div v-else><van-empty description="暂无优惠卷" /></div>
            </div>

        </van-popup>

        <!-- 底部时间弹出框 -->
        <van-popup v-model="dateShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);"
            round safe-area-inset-bottom :style="{ height: '30%' }">
            <van-datetime-picker v-show="dateShow" v-model="currentDate" type="year-month" title="请选择年月" :min-date="minDate"
                :max-date="maxDate" :formatter="formatter" @confirm="getDate" />
        </van-popup>

        <!-- 底部收藏弹出框 -->
        <van-popup v-model="collectShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);"
            round safe-area-inset-bottom :style="{ height: '70%' }">
            <van-row type="flex" justify="end">
                <van-col span="7">收藏详情</van-col>
                <van-col span="7" @click="clearCollect">全部取消收藏</van-col>
            </van-row>
            <div v-if="collectGoodsList.length !== 0">
                <van-grid :column-num="2">
                <van-grid-item v-for="item in collectGoodsList" :key="item.id" icon="photo-o" text="文字"
                    @click="toLookGoods(item.id)">
                    <div style="background-color: rgba(152, 230, 240, 0.6);text-align: center;">
                        <van-image width="10rem" height="8rem" fit="cover" :src="utils.getImage(item.img)" />
                        <div style="font-size: 17px;">{{ item.name }}</div>
                        <span style="color: darkred;">￥{{ item.price }}</span>
                    </div>
                </van-grid-item>
            </van-grid>
            </div>
            <div v-else><van-empty description="暂无收藏商品" /></div>
        </van-popup>

        <!-- 底部足迹弹出框 -->
        <van-popup v-model="footShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);"
            round safe-area-inset-bottom :style="{ height: '70%' }">
            <van-row type="flex" justify="end">
                <van-col span="10">足迹详情</van-col>
                <van-col span="5" @click="clearFoot">清空足迹</van-col>
            </van-row>
            <div v-if="footList.length !== 0">
                <van-grid :column-num="2">
                <van-grid-item v-for="item in footList" :key="item.id" icon="photo-o" text="文字"
                    @click="toLookGoods(item.id)">
                    <div style="background-color: rgba(152, 230, 240, 0.6);text-align: center;">
                        <van-image width="10rem" height="8rem" fit="cover" :src="utils.getImage(item.goodsImg)" />
                        <div style="font-size: 17px;">{{ item.goodsName }}</div>
                        <span style="color: darkred;">￥{{ item.goodsPrice }}</span>
                    </div>
                </van-grid-item>
            </van-grid>
            </div>
            <div v-else><van-empty description="暂无足迹" /></div>
        </van-popup>

        <!-- 底部设置弹出框 -->
        <van-popup v-model="setShow" position="bottom" style="background-color: rgba(152, 230, 240, 0.8);"
            round safe-area-inset-bottom>
            <van-cell icon="user-circle-o" title="修改密码" @click="toUpdatePwd" is-link
                style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
            <van-cell icon="replay" title="退出登录" is-link @click="logout"
                style="background: rgba(152, 230, 240, 0.4);margin: 10px 0px;" />
        </van-popup>

        <!-- 商品内容展示 -->
        <van-tabs background="rgba(152, 230, 240, 0.6)" color="blue" @click="changeTabs" sticky animated swipeable ellipsis>
            <van-tab v-for="item in tabList" :key="item.id" :title="item.text" color="black" :name="item.name">
                <!-- 标签页中的内容 -->
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <div v-for="item in goodsList" :key="item.id">
                        <div style="margin:10px 0px 0px 12px;width: 96%;border-radius: 10%;color:aliceblue;"
                            @click="toLookGoods(item.id)">
                            <van-image width="96%" height="160px" fit="cover" :src="utils.getImage(item.img)" />
                            <div class="showDiv" style="display: flex;">
                                <div style="margin-left:10px;font-size: 20px;width: 80%;">
                                    <div>{{ item.name }}</div>
                                    <div style="margin-left:10px;font-size: 13px;color: silver;">{{ item.description }}</div>
                                </div>
                                <div style="color: aqua;font-size: 22px;width: 20%;">
                                    ￥{{ item.price }}</div>
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-tab>
        </van-tabs>

        <!-- 导航标签页 -->
        <van-tabbar route style="background-color:rgba(152, 230, 240, 0.6);" placeholder active-color="blue">
            <van-tabbar-item replace to="/index" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item replace to="/category" icon="search">分类</van-tabbar-item>
            <van-tabbar-item replace to="/chat" icon="search">信息</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import axios from 'axios';
import { Dialog, Toast } from 'vant';
export default {
    name: 'index',
    data() {
        return {
            loading: false,
            finished: false,
            infoShow: false,
            setShow: false,
            footShow: false,
            collectShow: false,
            walletShow: false,
            dateShow: false,
            addShow: false,
            isFrom: true,
            couponShow: false,
            addressShow: false,
            addressChangeShow: false,
            shopingShow:false,
            addressIfAdd:'add',
            goodsList: [],
            footList: [],
            collectGoodsList: [],
            walletBill: [],
            couponList: [],
            addressList: [],
            shopingList:[],
            seral: 'id',
            wallet: '',
            allCount: '',
            rechargeMoney: '',
            user: '',
            address: {
                name: '',
                tel: '',
                addressInfo: '',
                isDefault: false,
                userId: window.sessionStorage.getItem('token.id')
            },
            userId: window.sessionStorage.getItem('token.id'),
            tabList: [
                { name: 'id', text: '推荐' }, { name: 'collect', text: '热门榜' },
                { name: 'sale_room', text: '热卖榜' }, { name: 'comment', text: '热评榜' },
                { name: 'create_time', text: '最新榜' }
            ],
            page: {
                currentPage: 0,
                number: 0,
                totalPage: 5
            },
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(),
            currentDate: new Date(),
            fromRules: {
                money: [
                    { required: true, message: '充值金额不正确' },
                    {
                        validator: (val) => {
                            return /^d{1,4}$/.test(val)
                        }, message: '请输入最多四位数字的充值金额'
                    }
                ],
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
        }
    },
    created() {
        this.getUserInfo()
    },
    methods: {
        toOrderStart(){
            Toast('暂未完成，敬请期待')
        },
        toOrder(){
            this.$router.push({
                path:'/order'
            })
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
        rmAddress(id){
            Dialog.confirm({
                message:'是否删除此地址'
            }).then(()=>{
                axios.delete('/address/'+id).then(res=>{
                    if(res.data.flag){
                        Toast('删除成功')
                        this.lookAddress()
                    }
                })
            })
        },
        addAddress(){
            this.addressChangeShow = true
            this.addressIfAdd = 'add'
        },
        updateAddress(id){
            this.addressChangeShow = true
            this.addressIfAdd = 'update'
            axios.get('/address/getOne/'+id).then(res=>{
                if(res.data.flag){
                    this.address = res.data.data
                }
            })
        },
        changeAddress() {
            if (/^[\u4e00-\u9fa5]{1,4}$/.test(this.address.name) &&
                /^0?(13|14|15|18|17)[0-9]{9}$/.test(this.address.tel) &&
                /^[\u4e00-\u9fa5]{1,20}$/.test(this.address.addressInfo)) {
                if(this.addressIfAdd === 'add'){
                    axios.post('/address/'+this.userId, this.address).then(res => {
                    if (res.data.flag) {
                        Toast('新增地址成功')
                        this.addressChangeShow = false
                        this.lookAddress()
                    }
                })
                }else{
                    axios.put('/address/'+this.userId,this.address).then(res=>{
                        if(res.data.flag){
                            Toast('修改地址成功')
                            this.addressChangeShow = false
                            this.lookAddress()
                        }
                    })
                }
            }
        },
        lookAddress() {
            this.addressShow = true
            axios.get('/address/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.addressList = res.data.data
                }
            })
        },
        lookCoupon() {
            this.couponShow = true
            axios.get('/coupon/getUser/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.couponList = res.data.data
                }
            })
        },
        changeLook() {
            this.isFrom = !this.isFrom
            if (this.isFrom) {
                this.toWallet()
            } else {
                this.getWallet()
            }

        },
        // 充值
        recharge() {

            axios.put('/wallet/' + this.userId + '/' + this.rechargeMoney).then(res => {
                if (res.data.flag) {
                    Toast('充值成功，请勿重复此操作！')
                    this.addShow = false
                    this.toWallet()
                } else {
                    Toast('充值失败')
                }
            })

        },
        // 获取指定时间的账单结果
        getWallet() {
            const nowDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getTime()
            const endDate = nowDate + 2592000000
            axios.get('/wallet/' + this.userId + '/' + nowDate + '/' + endDate).then(res => {
                if (res.data.flag) {
                    this.wallet = res.data.data
                    this.walletBill = res.data.data.walletDetailDtoList
                }
            })
        },
        getDate() {
            this.dateShow = false
            this.getWallet()
        },
        toWallet() {
            this.walletShow = true
            axios.get('/wallet/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.allCount = res.data.data.wallet
                }
            })
        },
        lookCollect() {
            this.collectShow = true
            axios.get('/collect/getGoodsAll/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.collectGoodsList = res.data.data
                }
            })
        },
        clearCollect(){
            Dialog.confirm({
                message: '是否取消所有收藏'
            }).then(() => {
                axios.delete('/collect/' + this.userId).then(res => {
                    if (res.data.flag) {
                        Toast('取消收藏成功')
                        this.collectShow = false
                    }
                })
            })
        },
        clearFoot() {
            Dialog.confirm({
                message: '是否删除足迹'
            }).then(() => {
                axios.delete('/foot/' + this.userId).then(res => {
                    if (res.data.flag) {
                        Toast('删除足迹成功')
                        this.footShow = false
                    }
                })
            })
        },
        lookFoots() {
            this.footShow = true
            axios.get('/foot/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.footList = res.data.data
                }
            })
        },
        toUpdatePwd() {
            this.$router.push({
                path: '/updatePwd'
            })
        },
        toMyInfo() {
            this.$router.push({
                path: '/myInfo'
            })
        },
        getUserInfo() {
            axios.get('/identity/user/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.user = res.data.data
                }
            })
        },
        toLookGoods(goodsId) {
            this.$router.push({
                path: '/goodsDetail',
                query: { goodsId: goodsId}
            })
        },
        getGoods(seral) {
            axios.get('/goods/userGet/' + seral + '/' + this.page.currentPage + '/10').then(res => {
                if (res.data.flag) {
                    this.goodsList = this.goodsList.concat(res.data.data.dataList)
                    this.page.number = res.data.data.numbers
                    this.page.totalPage = res.data.data.totalPages + 1
                }
            })
        },
        onLoad() {
            this.page.currentPage += 1
            this.getGoods(this.seral)
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            if (this.page.currentPage >= this.page.totalPage + 1) {
                this.finished = true;
            }
        },
        changeTabs(seral) {
            this.page.currentPage = 1
            this.seral = seral
            this.finished = false
            this.goodsList = []
            this.getGoods(seral)
        },
        toSearch() {
            this.$router.push({
                path: '/search',
            })
        },
        logout(){
            Dialog.confirm({
                message:'是否确认退出'
            }).then(()=>{
                Toast('退出成功')
                window.sessionStorage.clear()
                this.$router.replace({
                    path:'/login'
                })
            })
        },
        formatter(type, val) {
            if (type === 'year') {
                return `${val}年`;
            } else if (type === 'month') {
                return `${val}月`;
            }
            return val;
        }, formatter(type, val) {
            if (type === 'year') {
                return `${val}年`;
            } else if (type === 'month') {
                return `${val}月`;
            }
            return val;
        },
    }
}
</script>

<style>
.showDiv {
    background: rgb(66, 65, 65);
    width: 96%;
    border-radius: 10px;
    height: 100%;
    margin-top: -6px;
}
</style>