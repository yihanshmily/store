<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar title="修改资料" left-arrow @click-left="onClickLeft"
            style="background-color: rgba(152, 230, 240, 0.6);margin: 10px 0px;" />
        <!-- 内容 -->
        <div>
            <!-- 头像 -->
            <div style="margin: 20px 140px;width: 100%;">
                <van-uploader :preview-image="false" v-model="fileList" :after-read="updateImg" max-size="10485760">
                    <van-image round width="8rem" height="8rem" :src="utils.getImage(user.img)" />
                </van-uploader>
            </div>
            <span style="margin: -20px 0px 10px 150px;">点击头像修改</span>
        </div>

        <!-- 输入框 -->
        <van-form validate-first>
            <van-field v-model="user.name" placeholder="请输入用户名" style="margin: 10px auto;width: 90%;background-color: rgba(152, 230, 240, 0.6);" left-icon="manager-o"
                :rules="fromRules.name" label="昵称" @blur="checkName" />
            <van-field v-model="user.tel" placeholder="请输入电话号码" style="margin: 10px auto;width: 90%;background-color: rgba(152, 230, 240, 0.6);" left-icon="manager-o"
                :rules="fromRules.tel" label="电话号码" />
            <div style="margin: 16px;">
                <van-button round block type="info" @click="submit">修改</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import axios from 'axios'
import { Dialog, Toast } from 'vant'
import utils from '@/utils'
export default {
    name: 'updateInfo',
    data() {
        return {
            userId: window.sessionStorage.getItem('token.id'),
            user: '',
            isNull: false,
            fileList: [],
            fromRules: {
                name: [
                    { required: true, message: '昵称不能为空' },
                    {
                        validator: (val) => {
                            return /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(val)
                        }, message: '格式不正确'
                    }
                ],
                tel: [
                    { required: true, message: '电话号码不能为空' },
                    {
                        validator: (val) => {
                            return /^(?=.*\d).{11}$/.test(val)
                        }, message: '输入信息有误'
                    }
                ]
            },
        }
    },
    created() {
        this.getInfo()
    },
    methods: {
        updateImg(file) {
            this.user.img = file.file.name
            utils.imgSuccess(file.file)
        },
        submit() {
            if (!this.isNull) {
                axios.put('/identity/user', this.user).then(res => {
                    if (res.data.flag) {
                        Toast('资料修改成功')
                        this.getInfo()
                    }
                })
            }
        },
        // 检验是否重复昵称
        checkName() {
            axios.get('/identity/getInfo/' + this.userId + '/' + this.user.name).then(res => {
                if (!res.data.flag) {
                    Dialog.alert({
                        message: '该昵称已存在，请重新输入'
                    }).then(() => {
                        this.user.name = ''
                        this.isNull = true
                    })

                } else {
                    this.isNull = false
                }
            })
        },
        onClickLeft() {
            this.$router.back()
        },
        getInfo() {
            axios.get('/identity/user/' + this.userId).then(res => {
                if (res.data.flag) {
                    this.user = res.data.data
                }
            })
        },
    }
}
</script>

<style></style>