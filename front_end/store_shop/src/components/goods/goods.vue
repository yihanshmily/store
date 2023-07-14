<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar title="商品" left-arrow @click-left="onClickLeft"
            style="background-color: rgba(152, 230, 240, 0.6);margin: 10px 0px;" />
        <!-- 内容 -->
        <div style="display: flex;">
            <div style="width: 20%;">
                <van-sticky>
                    <!-- 侧边导航 -->
                    <div>
                        <van-sidebar>
                            <van-sidebar-item title="全部" @click="onchange(0)"
                                style="background-color: rgba(152, 230, 240, 0.6);" />
                        </van-sidebar>
                        <van-sidebar v-for="item in categoryList" :key="item.id">
                            <van-sidebar-item :title="item.name" @click="onchange(item.id)"
                                style="background-color: rgba(152, 230, 240, 0.6);" />
                        </van-sidebar>
                    </div>
                </van-sticky>
            </div>
            <!-- 商品 -->
            <div style="width: 80%;font-size: 14px;">
                <van-grid :column-num="2" square>
                    <van-grid-item v-for="index in goodsList" :key="index.id" icon="photo-o" text="文字">
                        <!-- 删除按钮 -->
                        <div style="position: relative;left:55px;top:21px;z-index: 100;" >
                            <van-checkbox-group v-model="delIds" ref="checkboxGroup" >
  <van-checkbox :name="index.id" @click="moreChoose(index.id)"/>
</van-checkbox-group>
                        </div>
                        <van-image width="100%" height="5rem" fit="cover" :src="utils.getImage(index.img)"
                            @click="lookGoods(index.id)" />
                        <div>{{ index.name }}</div>
                        <span style="color: darkred;">￥{{ index.price }}</span>

                    </van-grid-item>
                </van-grid>
            </div>
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
            <!-- 新增 -->
            <div>
                <van-button v-if="isAdd" type="danger" size="large" round @click="toModGoods">新增商品</van-button>
                <van-button v-else type="danger" size="large" round @click="delChooseGoods">删除</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { Dialog, Toast } from 'vant'
export default {
    name: 'goods',
    data() {
        return {
            isAdd:true,
            shopId: this.$route.query.shopId,
            goodsList: [],
            categoryList: [],
            categoryId: 0,
            delIds:[],
            delChoose:'',
            chooseId:'',
            page: {
                currentPage: '1',
                numbers: '',
                totalPages: '',
            }
        }
    },
    created() {
        this.getCategory()
        this.getGoods()
    },
    methods: {
        delChooseGoods(){
            this.delIds.forEach(item=>{
                this.delChoose += item+','
            })
            Dialog.confirm({
                message:'是否删除商品'
            }).then(()=>{
                axios.delete('/goods/'+this.delChoose).then(res=>{
                if(res.data.flag){
                    Toast('删除成功')
                    this.isAdd = true
                    this.getGoods()
                    
                }
            })
            })
        },
        moreChoose(id) {
            this.isAdd = false
            if(this.delIds[0] === undefined){
                this.isAdd = true
            }
            
        },
        lookGoods(goodsId) {
            this.$router.push({
                path: '/goodsDetail',
                query: { goodsId: goodsId }
            })
        },
        onClickLeft() {
            this.$router.back()
        },
        // 类别
        onchange(id) {
            this.categoryId = id
            if (this.categoryId === 0) {
                this.getGoods()
            } else {
                axios.get('/goods/mySelf/' + this.shopId + '/' + id + '/' + this.page.currentPage + '/6').then(res => {
                    if (res.data.flag) {
                        this.goodsList = res.data.data.dataList
                        this.page.totalPages = res.data.data.totalPages + 1
                    }
                })
            }

        },
        // 分页
        changePage() {
            if (this.categoryId === 0) {
                this.getGoods()
            } else {
                this.onchange(this.categoryId)
            }
        },
        toModGoods() {
            this.$router.push({
                path: '/modGoods',
                query:{status:'add'}
            })
        },
        getGoods() {
            axios.get('/goods/mySelf/' + this.shopId + '/all/' + this.page.currentPage + '/6').then(res => {
                if (res.data.flag) {
                    this.goodsList = res.data.data.dataList
                    this.page.totalPages = res.data.data.totalPages + 1
                }
            })
        },
        getCategory() {
            axios.get('/goods/category').then(res => {
                if (res.data.flag) {
                    this.categoryList = res.data.data
                }
            })
        }
    }
}
</script>

<style lang="less"></style>