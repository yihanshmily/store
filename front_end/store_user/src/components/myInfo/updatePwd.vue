<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar title="修改密码" left-arrow @click-left="onClickLeft"
            style="background-color: rgba(152, 230, 240, 0.6);margin: 10px 0px;" />

        <!-- 输入框 -->
        <van-form validate-first style="margin-top: 200px;">
            <van-field v-model="user.oldPwd" placeholder="请输入旧密码"
                style="margin: 10px auto;width: 90%;background-color: rgba(152, 230, 240, 0.6);" left-icon="manager-o"
                :rules="[{ pattern, message: '请输入正确格式的密码' }]" label="旧密码" />
            <van-field v-model="user.newPwd" placeholder="请输入3位数字的新密码"
                style="margin: 10px auto;width: 90%;background-color: rgba(152, 230, 240, 0.6);" left-icon="manager-o"
                :rules="[{ pattern, message: '请输入正确格式的密码' }]" label="新密码" />
            <van-field v-model="user.AgainNewPwd" placeholder="请再次输入新密码"
                style="margin: 10px auto;width: 90%;background-color: rgba(152, 230, 240, 0.6);" left-icon="manager-o"
                :rules="[{ pattern, message: '请输入正确格式的密码' }]" label="再确认新密码" />
            <div style="margin: 16px;">
                <van-button round block type="info" @click="submit">修改密码</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import axios from 'axios'
import { Dialog, Toast } from 'vant'
export default {
    name: 'updatePwd',
    data() {
        return {
            userId: window.sessionStorage.getItem('token.id'),
            user: {
                oldPwd: '',
                newPwd: '',
                AgainNewPwd: ''
            },
            pattern: /^(?=.*\d).{3}$/,
        }
    },
    methods: {
        submit() {
            Dialog.confirm({
                message: '该操作将修改密码，是否确认修改密码'
            }).then(() => {
                if (this.user.newPwd === this.user.AgainNewPwd && this.user.oldPwd !== '') {
                    axios.put('identity/user/updatePwd/' + this.userId + '/' + this.user.oldPwd + '/' + this.user.newPwd).then(res => {
                        if (res.data.flag) {
                            Dialog.alert({
                                message: '密码修改成功，请重新登录'
                            }).then(() => {
                                this.$router.replace({
                                    path: '/login'
                                })
                            })
                        } else {
                            Toast('你输入的旧密码不正确，请重新输入')
                        }
                    })
                } else if (this.user.newPwd !== this.user.AgainNewPwd) {
                    Toast('输入的两次新密码不一致，请重新输入')
                } else {
                    Toast('旧密码不能为空')
                }
            })

        },
        onClickLeft() {
            this.$router.back()
        },
    }
}
</script>

<style></style>