<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar :title="this.status === 'add' ? '新增商品' : '修改商品'" left-text="返回" placeholder 
            left-arrow @click-left="onClickLeft" style="background-color: rgba(152, 230, 240, 0.6);" />
        <!-- 商品新增或修改 -->
        <van-form style="margin-top: 100px;">
            <van-field v-model="goods.name" label="商品名" placeholder="请输入商品名"
                style="background-color: rgba(255, 255, 255, 0.4);" />
            <div style="display: flex;">
                <div>商品类别：</div>
                <div @click="categoryShow = true">
                            <van-button type="primary" v-if="goods.categoryId === 0">请选择商品类型</van-button>
                            <van-button type="primary" v-else>{{ categoryNameList[indexNum] }}</van-button>
                </div>
            </div>
            <van-field v-model="goods.price" label="价格" placeholder="请输入价格"
                style="background-color: rgba(255, 255, 255, 0.4);" />
            <van-field v-model="goods.description" label="描述" placeholder="请描述商品信息" clearable type="textarea"
                style="background-color: rgba(255, 255, 255, 0.4);" />
            <!-- 文件上传 -->
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
            <div style="margin: 16px;">
                <van-button round block type="info" @click="onSubmit">提交</van-button>
            </div>
        </van-form>

        <!-- 商品类别弹出框 -->
        <van-popup v-model="categoryShow" round position="bottom">
                <van-picker show-toolbar :columns="categoryNameList" @cancel="categoryShow = false" @confirm="onConfirm" />
            </van-popup>
    </div>
</template>

<script>
import axios from 'axios'
import utils from '@/utils'
import { Dialog, Toast } from 'vant'

export default {
    name: 'modGoods',
    data() {
        return {
            goodsId: this.$route.query.goodsId,
            status: this.$route.query.status,
            showPopover: false,
            categoryShow:false,
            indexNum:0,
            chooseCategory: 0,
            radio: '',
            fileList: [],
            categoryIdList: [],
            categoryNameList:[],
            sum: 0,
            imgs: [],
            goods: {
                name: '',
                img: '',
                price: '',
                description: '',
                categoryId: 0,
                shopId: window.sessionStorage.getItem('token.id')
            }
        }
    },
    created() {
        this.getCategory()
        this.getGoods()
    },
    methods: {
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
        getGoods() {
            if (this.status === 'update') {
                axios.get('/goods/getOne/' + this.goodsId+'/0').then(res => {
                    if (res.data.flag) {
                        this.goods = res.data.data
                        this.imgs = res.data.data.img.split(',')
                        this.imgs.splice(this.imgs.length - 1, 1)
                    }
                })
            }
        },
        changeRadio(id) {
            this.showPopover = false
            this.goods.categoryId = id
        },
        // 获取商品类别
        getCategory() {
            axios.get('/goods/category').then(res => {
                if (res.data.flag) {
                    res.data.data.forEach(item=>{
                    this.categoryIdList.push(item.id)
                    this.categoryNameList.push(item.name)
                    })
                }
            })
        },
        onConfirm(value) {
            this.indexNum = this.categoryNameList.indexOf(value)
            this.goods.categoryId = this.categoryIdList[this.indexNum]
            this.categoryShow = false;
        },
        onSubmit() {
            this.goods.img = ''
            this.fileList.forEach((file) => {
                this.goods.img += file.file.name + ','
                utils.imgSuccess(file.file)
            })
            if (this.status === 'update') {
                console.log(this.imgs)
                this.imgs.forEach(img => {
                    this.goods.img += img + ','
                })
            }
            if (this.goods.name != '' && this.goods.price != '' && this.goods.img != ''
                && this.goods.description != '' && this.goods.categoryId != '' && this.goods.categoryId != 0) {
                if (this.status === 'add') {
                    axios.post('/goods', this.goods).then(res => {
                        if (res.data.flag) {
                            Dialog.confirm({
                                message: '添加商品成功,是否继续添加商品'
                            }).then(() => {
                                location.reload();
                            }).catch(() => {
                                this.$router.back()
                            })
                        }
                    })
                } else {
                    axios.put('/goods', this.goods).then(res => {
                        if (res.data.flag) {
                            Toast('修改成功')
                            setTimeout(function () {
                                location.reload();
                            }, 100)
                        }
                    })
                }
            } else {
                Toast('输出信息为空，请重新输入')
            }
        },
        onClickLeft() {
            this.$router.back()
        }
    }
}
</script>

<style></style>