<template>
    <div>
        <!-- 搜索 -->
        <div>
            <van-nav-bar left-arrow @click-left="returnIndex()" style="width: 100%;">
                <template #right>
                    <van-search style="width:320px;height: 100%;" v-model="value" show-action placeholder="请输入搜索关键词"
                        @search="onSearch(value)">
                        <template #action>
                            <div @click="onSearch(value)">搜索</div>
                        </template>
                    </van-search>
                </template>
            </van-nav-bar>
        </div>

        <!-- 搜索历史 -->
        <div>
            <div>搜索历史</div>
            <div v-for="(item,index) in lateSearch" :key="index">
                <span style="text-align: left;margin: 10px 10px;display: flex;">
                    <van-tag v-model="value" color="#7232dd" plain size="large" round 
                        style="text-align: left;margin: 10px 10px;"
                        @click="onSearch(item)">{{ item }}</van-tag>
                </span>
            </div>
        </div>

        <!-- 商品 -->
        <div v-for="item in goodsList" :key="item.id">
            <div style="margin:10px 0px 0px 12px;width: 96%;border-radius: 10%;color:aliceblue;"
                @click="toLookGoods(item.id)">
                <van-image width="96%" height="160px" fit="cover" :src="utils.getImage(item.img)" />
                <div class="showDiv">
                    <div style="margin-left:10px;font-size: 20px;">{{ item.name }}</div>
                    <div style="margin-left:10px;font-size: 13px;color: silver;">{{ item.description }}</div>
                    <div style="position: relative;bottom: 25px;left: 260px;color: aqua;font-size: 22px;">
                        ￥{{ item.price }}</div>
                </div>
            </div>
        </div>
        <div style="height: 50px;"></div>
    </div>
</template>

<script>
import axios from 'axios'
import { Toast } from 'vant'
export default {
    name: 'search',
    data() {
        return {
            value: '',
            goodsList: [],
            lateSearch:[]
        }
    },
    created(){
        this.getLateSearch()
    },
    methods: {
        // 查看商品信息
        toLookGoods(id) {
            this.$router.push({
                path: '/goodsDetail',
                query: { goodsId: id }
            })
            window.sessionStorage.setItem('lateSearch',this.lateSearch)
        },
        // 搜索
        onSearch(value) {
            if(value === ''){
                Toast('搜索内容不能为空')
            }else{
                axios.get('/goods/likeName/' + value).then(res => {
                    if(res.data.flag){
                        this.goodsList = res.data.data
                        this.lateSearch = this.lateSearch.concat(value)
                        if(this.goodsList.length === 0){
                            Toast('搜索内容为空')
                        }
                        if(this.lateSearch.length >=3){
                            this.lateSearch.splice(0,1)
                        }
                    }
                
            })
            }
        },
        getLateSearch(){
            this.lateSearch = window.sessionStorage.getItem('lateSearch').split(',')
        },
        // 返回
        returnIndex() {
            this.$router.back()
            window.sessionStorage.setItem('lateSearch',this.lateSearch)
        }
    }
}
</script>

<style>
.vanSearch {
    width: 210px;
    float: left;
}

.hostSearch {
    text-align: left;
}

.searchs {
    text-align: left;
    margin: 10px 10px;
}

.cardDiv {
    background-color: antiquewhite;
}
</style>