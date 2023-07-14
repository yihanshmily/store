<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="收益详情" left-text="返回" placeholder left-arrow @click-left="onClickLeft"
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

        <!-- 总共收益 -->
            <div v-if="gainList.length>=1" style="background-color: rgba(152, 130, 140, 0.6);margin: 10px 0px;">
                总收入：{{ gainMoney }}</div>

        <!-- 收益展示 -->
        <div v-for="item in gainList" :key="item.id">
            <div style="background-color: rgba(152, 230, 240, 0.6);margin-top: 10px;" @click="lookOrder(item.id)">
                <div>
                    <van-image width="70" height="70" :src="utils.getImage(item.userImg)" style="margin: 5px;" />
                </div>
                <div style="margin: -80px 0px 0px 100px;">{{ item.userName }}</div>
                <div style="margin: -20px 0px 0px 270px;font-size: 20px;">+{{ item.totalPrice }}</div>
                <div style="margin: 30px 0px 10px 100px;">{{ utils.timestampToTime(item.createTime) }}</div>
                
            </div>
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
export default {
    name:'gain',
    data(){
        return{
            showPopover:false,
            isChoose:false,
            shopId: window.sessionStorage.getItem('token.id'),
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(),
            gainList:[],
            gainMoney:'',
            page: {
                currentPage: 0,
                numbers: '',
                totalPages: '',
            }
        }
    },
    methods:{
        getGain(){
            if(this.isChoose){
                axios.get('/order/getGain/'+this.shopId
                +'/'+this.page.currentPage+'/4/'+this.currentDate.getTime()).then(res=>{
                    if(res.data.flag){
                        this.gainList = res.data.data.dataList
                        this.gainMoney = res.data.data.gainMoney
                        this.page.numbers = res.data.data.numbers
                        this.page.totalPages = res.data.data.totalPages + 1
                    }
                })
            }
        },
        getDate(){
            this.isChoose = true
            this.showPopover = false
            this.getGain()
        },
        changePage() {
            this.getGain()
        },
        onClickLeft(){
            this.$router.back()
        }
    }

}
</script>

<style>

</style>