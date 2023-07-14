<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar title="库存详情" left-text="返回" placeholder left-arrow @click-left="onClickLeft"
            style="background-color: rgba(152, 230, 240, 0.6);" />
        <!-- 搜索 -->
        <van-search v-model="searchName" shape="round" background="rgba(152, 230, 240, 0.6)" style="margin-top: 10px;"
            placeholder="请输入商品名" @search="onSearch" />
        <!-- 商品库存 -->
        <div style="margin-top: 20px;" v-for="item in repertoryList" :key="item">
            <div style="background-color: rgba(132, 255, 240, 0.7);;width: 100%;height: 100px;
                    font-size: 13px;" @click="lookRepertory(item.id)">
                <div>
                    <van-image round width="5rem" height="5rem" style="margin:10px;" :src="utils.getImage(item.goodsImg)" />
                </div>
                <div style="margin: -100px 0px 0px 110px;width: 100%;">{{ item.goodsName }}</div>
                <div style="margin:8px 0px 0px 110px;width: 100%;">当前库存的数量：{{ item.number }}</div>
                <div style="margin:8px 0px 0px 110px;width: 100%;">当前存放的地址：{{ item.address }}</div>
                <div style="margin:8px 0px 0px 110px;width: 100%;">最近添加库存的时间：{{ utils.timestampToTime(item.lateAddTime) }}
                </div>
            </div>
        </div>

        <!-- 库存详情 -->
        <div>
            <van-action-sheet v-model="repertoryShow" style="background-color: rgba(152, 230, 240, 0.8);">
                <div style="margin-bottom: 50px;font-size: 19px;">
                    <van-image round width="7rem" height="7rem" :src="utils.getImage(repertory.goodsImg)"
                        style="margin: 20px 0px 10px 240px;" />
                    <div style="margin:-100px 0px 0px 10px;">商品名：{{ repertory.goodsName }}</div>
                    <div style="margin: 10px;">库存地址:{{ repertory.address }}</div>
                    <div style="margin: 10px;">当前库存:{{ repertory.number }}</div>
                    <div style="margin: 10px;">售卖数量:{{ repertory.goodsSaleRoom }}</div>
                    <div style="margin: 10px;">总共个数:{{ repertory.sumTotal }}</div>
                    <div style="margin: 10px;">上次进货时间：{{ utils.timestampToTime(repertory.lateAddTime) }}</div>
                        <van-button round type="info" @click="addShow = true" style="width: 150px;">添加库存数量</van-button>
                </div>
            </van-action-sheet>
        </div>

        <!-- 添加库存 -->
        <div>
            <van-action-sheet v-model="addShow" style="background-color: rgba(152, 230, 240, 0.8);">
                <div style="margin-bottom: 50px;font-size: 19px;">
                    <van-field v-model="addSums" placeholder="请输入你要添加库存的数量" :rules="rulesFrom.sum" />
                    <van-button round type="info" @click="addSumTotal"
                        style="width: 150px;margin: 10px auto;width: 100%;">添加库存</van-button>
                </div>
            </van-action-sheet>
        </div>

        <div style="position: absolute;bottom: 0%;width: 100%;background-color: rgba(152, 230, 240, 0.6);">
            <!-- 分页 -->
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
import { Toast } from 'vant'
export default {
    name: 'repertory',
    data() {
        return {
            addShow: false,
            repertoryShow: false,
            shopId: window.sessionStorage.getItem('token.id'),
            repertoryId:'',
            searchName: 'all',
            repertoryList: [],
            repertory: '',
            addSums: '',
            rulesFrom:{
                sum:[
                    {required: true, message:'添加库存的数量不能为空'},
                    {validator:(val)=>{
                        return /[1-9]\d*/.test(val)
                        },message:'格式不正确'}
                ],
            },
            page: {
                currentPage: '1',
                numbers: '',
                totalPages: '',
            }
        }
    },
    created() {
        this.getRepertory()
    },
    methods: {
        addSumTotal() {
            axios.put('/repertory/'+this.repertoryId+'/'+this.shopId+'/'+this.addSums).then(res=>{
            if(res.data.flag){
                Toast('添加库存数量成功')
                location.reload();
            }
        })
        },
        lookRepertory(id) {
            this.repertoryShow = true
            this.repertoryId = id
            axios.get('/repertory/' + id).then(res => {
                if (res.data.flag) {
                    this.repertory = res.data.data
                }
            })
        },
        changePage(){
            this.getRepertory()
        },
        onClickLeft() {
            this.$router.back()
        },
        onSearch() {
            this.getRepertory()
        },
        getRepertory() {
            if (this.searchName === '') {
                this.searchName = 'all'
            }
            this.searchName = this.searchName === 'all' ? 'all' : this.searchName
            axios.get('/repertory/' + this.shopId + '/' + this.searchName + '/' + this.page.currentPage + '/4').then(res => {
                if (res.data.flag) {
                    this.repertoryList = res.data.data.dataList
                    this.page.numbers = res.data.data.numbers
                    this.page.totalPages = res.data.data.totalPages+1
                }
            })
            this.searchName = ''
        }
    }
}
</script>

<style></style>