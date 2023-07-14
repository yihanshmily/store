<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar title="订单信息" left-text="返回" placeholder left-arrow @click-left="onClickLeft"
            style="background-color: rgba(152, 230, 240, 0.6);" />

        <!-- 时间选择按钮 -->
        <van-popover v-model="showPopover" trigger="click" style="width: 100%;margin: 10px 0px;">
            <!-- 时间选择 -->
            <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate"
                @confirm="getDate" style="width: 300px;" />
            <template #reference>
                <van-button type="primary" style="width: 100%;" v-if="!isChoose">请选择你要查询的日期</van-button>
                <van-button type="primary" style="width: 100%;" v-else>
                    2023-1-1至{{ utils.timestampToTime(currentDate.getTime()) }}</van-button>
            </template>
        </van-popover>

        <!-- 订单展示 -->
        <div v-for="item in orderList" :key="item.id">
            <div style="background-color: rgba(152, 230, 240, 0.6);margin-top: 10px;" @click="lookOrder(item.id)">
                <div>
                    <van-image width="80" height="80" :src="utils.getImage(item.goodsImg)" style="margin: 10px;" />
                </div>
                <div style="margin: -80px 0px 0px 100px;">{{ item.goodsName }}</div>
                <div style="margin: 10px 0px 0px 320px;">{{ item.status }}</div>
                <div style="margin: 10px 0px 0px 250px;">￥{{ item.totalPrice }} x{{ item.number }}</div>
            </div>
        </div>

        <!-- 订单详情 -->
    <div>
        <van-action-sheet v-model="detailShow" style="background-color: rgba(152, 230, 240, 0.8);">
            <div style="margin-bottom: 20px;font-size: 19px;">
                <div>
                    <div style="display: flex;">
                        <div style="margin: 10px;">账号：{{ order.userName }}</div>
                        <div style="margin: 10px 50px;">账户ry号：{{ order.userSole }}</div>
                    </div>
                    <div style="width:100%;height: 5px;background-color: rgba(213, 213, 213, 0.6);"></div>
                    <div>
                        <div style="margin: 10px;">收货人：{{ order.addressName }}</div>
                        <div style="margin: 10px;">电话号码：{{ order.addressTel }}</div>
                        <div style="margin: 10px;">收货地址：{{ order.addressInfo }}</div>
                    </div>
                    <div style="width:100%;height: 5px;background-color: rgba(213, 213, 213, 0.6);"></div>
                    <div @click="toGoods(order.goodsId)">
                        <div style="margin: 10px;">
                            <van-image width="80" height="80" :src="utils.getImage(order.goodsImg)"></van-image>
                        </div>
                        <div style="margin: -100px 0px 0px 100px;">商品名：{{ order.goodsName }}</div>
                        <div style="margin: 20px 0px 0px 300px;">￥{{ order.goodsPrice }}</div>
                        <div style="margin: 5px 0px 0px 320px;">x{{ order.number }}</div>
                        <div style="margin: -30px 0px 20px 100px;">商品售额：{{ order.goodsSaleRoom }}</div>
                    </div>
                    <div style="width:100%;height: 5px;background-color: rgba(213, 213, 213, 0.6);"></div>
                    <div>
                    <div style="margin: 10px;">订单ry号：{{ order.sole }}</div>
                    <div style="margin: 10px;" v-if="order.couponId">优惠卷：满{{ order.couponMeetMoney }}减{{ order.couponCutMoney }}</div>
                    <div style="margin: 10px;">总价：{{ order.totalPrice }}</div>
                    <div style="margin: 10px;">订单状态：{{ order.status }}</div>
                    <div style="margin: 10px;" v-if="order.couponId">实付金额：{{ order.totalPrice - order.couponCutMoney }}</div>
                    <div style="margin: 10px;" v-else>实付金额：{{ order.totalPrice }}</div>
                    <div style="margin: 10px;">下单时间：{{ utils.timestampToTime(order.createTime) }}</div>
                    </div>
                </div>
            </div>
            <div style="margin-left:  280px;">
                    <van-button round type="info" @click="delOrder(order.id)">删除</van-button>
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
import { Dialog, Toast } from 'vant'
export default {
    name: 'order',
    data() {
        return {
            detailShow:false,
            showPopover: false,
            isChoose: false,
            shopId: window.sessionStorage.getItem('token.id'),
            minDate: new Date(2023, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(),
            orderList: [],
            order:'',
            page: {
                currentPage: 0,
                numbers: '',
                totalPages: '',
            }
        }
    },
    created() {

    },
    methods: {
        delOrder(orderId){
            Dialog.confirm({
                message:'是否删除该订单'
            }).then(()=>{
                axios.put('/order/updateShop/'+orderId).then(res=>{
                    if(res.data.flag){
                        Toast('删除订单成功')
                        this.detailShow = false
                        this.getOrder()
                    }
                })
            })
        },
        toGoods(goodsId){
            this.$router.push({
                path:'/goodsDetail',
                query:{goodsId:goodsId}
            })
        },
        lookOrder(id) {
            axios.get('/order/' + id).then(res => {
                if(res.data.flag){
                    this.order = res.data.data
                }
            })
            this.detailShow = true
        },
        changePage() {
            this.getOrder()
        },
        getOrder() {
            if (this.isChoose) {
                axios.get('/order/shop/' + this.shopId + '/' + this.page.currentPage + '/' + this.currentDate.getTime()).then(res => {
                    if (res.data.flag) {
                        this.orderList = res.data.data.dataList
                        this.page.numbers = res.data.data.numbers
                        this.page.totalPages = res.data.data.totalPages + 1
                    }
                })
            }
        },
        getDate() {
            this.showPopover = false
            this.isChoose = true
            this.getOrder()
        },
        onSearch() {

        },
        onClickLeft() {
            this.$router.back()
        }
    }
}
</script>

<style></style>