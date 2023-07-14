<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar title="新增商品" left-text="返回" placeholder left-arrow @click-left="onClickLeft" />
        <!-- 商品新增 -->
        <van-form @submit="onSubmit">
            <van-field v-model="goods.name" label="商品名" placeholder="请输入商品名" />
            <div style="display: flex;">
                <div>商品类别：</div>
                <div>
                    <van-radio-group v-model="radio" direction="horizontal" v-for="item in categoryList" :key="item.id"
                        @change="changeRadio(item.id)">
                        <van-radio :name=item.id>{{ item.name }}</van-radio>
                    </van-radio-group>
                </div>
            </div>
            <van-field v-model="goods.price" label="价格" placeholder="请输入价格" />
            <van-field v-model="goods.description" label="描述" placeholder="请描述商品信息" clearable type="textarea" />
            <!-- 文件上传 -->
            <div style="display: flex;">
                <div>商品图片：</div>
                <van-uploader preview-image preview-full-image deletable multiple v-model="fileList" show-upload
                    max-count="6" upload-text="请上传图片" max-size="10485760" />
            </div>

            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import axios from 'axios'
import utils from '@/utils'
import { Dialog, Toast } from 'vant'

export default {
    name: 'addGoods',
    data() {
        return {
            fileList: [],
            chooseCategory: 0,
            radio: '',
            categoryList: [],
            goods: {
                name: '',
                img: '',
                price: '',
                description: '',
                categoryId: '',
                shopId: '0'
            }
        }
    },
    created() {
        this.getCategory()
    },
    methods: {
        changeRadio() {
            this.goods.categoryId = this.radio
        },
        // 获取商品类别
        getCategory() {
            axios.get('/goods/category').then(res => {
                if (res.data.flag) {
                    console.log(res.data.data)
                    this.categoryList = res.data.data
                }
            })
        },
        changeCategory() {
            console.log(this.chooseCategory)
        },
        onSubmit() {
            if (this.goods.name != '' && this.goods.price != '' && this.goods.img != ''
                && this.goods.description != '' && this.goods.categoryId != '') {
                this.fileList.forEach((file) => {
                    this.goods.img += file.file.name + ','
                    utils.imgSuccess(file.file)
                })
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