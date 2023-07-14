<template>
    <div>
        <!-- 导航栏 -->
        <div class="navbar">
            <van-nav-bar title="商铺详情" left-text="返回" left-arrow @click-left="onClickLeft()" />
        </div>
        <!-- 商铺信息 -->
        <div style="display: flex;background-color: rgba(152, 230, 240, 0.6);">
            <!-- 图片 -->
            <div style="margin:10px 0px 0px 30px;">
                <van-image width="5rem" height="5rem" :src="utils.getImage(shop.img)" />
            </div>
            <div style="font-size: 20px;margin: 10px 0px 0px 20px;">{{ shop.name }}</div>
            <div style="margin: 50px 0px 0px -80px;font-size: 19;">电话号码：{{ shop.tel }}</div>
        </div>
        <div style="font-size: 30px;color: red;text-align: center;margin: 10px;">商品</div>
        <!-- 商品 -->
        <div>
            <div v-if="goodsList.length !== 0">
                <van-grid :column-num="2">
                    <van-grid-item v-for="item in goodsList" :key="item.id" icon="photo-o" text="文字"
                        @click="lookGoods(item.id)">
                        <div style="background-color: rgba(152, 230, 240, 0.6);text-align: center;">
                            <van-image width="10rem" height="7rem" fit="cover" :src="utils.getImage(item.img)" />
                            <div style="font-size: 17px;">{{ item.name }}</div>
                            <span style="color: darkred;">￥{{ item.price }}</span>
                        </div>
                    </van-grid-item>
                </van-grid>
            </div>
            <div v-else><van-empty description="暂无商品" /></div>
        </div>
        <div class="addBut">
            <!-- 分页 -->
            <div>
                <van-pagination v-model="page.currentPage" :total-items="page.numbers" :show-page-size="5"
                    :page-count="page.totalPages" items-per-page="7" force-ellipses style="margin-top: 50px;"
                    @change="changePage">
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
    name: 'shop',
    data() {
        return {
            shopId: this.$route.query.shopId,
            shop: '',
            goodsList: '',
            page: {
                currentPage: '1',
                numbers: '',
                totalPages: '',
            }
        }
    },
    created() {
        this.getShopInfo()
        this.getGoodsOfShop()
    },
    methods: {
        // 获取该商铺的商品信息
        getGoodsOfShop() {
            axios.get('/identity/getShopAll/' + this.shopId + '/all/' + this.page.currentPage + '/4').then(res => {
                if (res.data.flag) {
                    this.goodsList = res.data.data.dataList
                    this.page.totalPages = res.data.data.totalPages+1
                }
            })
        },
        changePage() {
            this.getGoodsOfShop()
        },
        // 获取商铺信息
        getShopInfo() {
            axios.get('/identity/shop/' + this.shopId).then(res => {
                if (res.data.flag) {
                    this.shop = res.data.data
                }
            })
        },
        lookGoods(id) {
                this.$router.push({
                    path: '/goodsDetail',
                    query: { id: id }
                })
            },
        onClickLeft() {
            this.$router.back()
        }
    }
}
</script>

<style>
.addBut {
    position: absolute;
    top: 85%;
    width: 100%;
}
</style>