<template>
    <div>
        <!-- 标题 -->
        <div style="font-size: 30px;margin: 100px;color: coral;">欢迎注册商铺</div>
        <!-- 输入框 -->
        <van-form validate-first>
            <div style="margin: 100px auto;">
                <van-field v-model="login.name" placeholder="请输入商铺名" style="margin: 10px auto;width: 70%;background-color: rgba(152, 230, 240, 0.6);"
                    left-icon="manager-o" :rules="fromRules.name" />
                <van-field v-model="login.pwd" placeholder="请输入3位数字密码" style="margin:10px auto;width: 70%;background-color: rgba(152, 230, 240, 0.6);" type="password"
                    left-icon="flower-o" :rules="fromRules.pwd" />
                <van-field v-model="login.tel" placeholder="请输入11位数字的电话号码" style="margin:10px auto;width: 70%;background-color: rgba(152, 230, 240, 0.6);"
                    type="password" left-icon="flower-o" :rules="fromRules.tel" name="tel" />
                <van-uploader preview-image preview-full-image deletable style="margin-left: 70px;" v-model="fileList"
                    max-count="1" upload-text="请上传头像" max-size="10485760" />
                <div style="margin: 16px;">
                    <van-button round block type="info" @click="submit">注册</van-button>
                </div>
                <div style="margin-left: 250px;" @click="returnLogin">返回登录</div>
            </div>

        </van-form>
    </div>
</template>

<script>
import axios from 'axios'
import { Dialog } from 'vant'
import utils from '@/utils'
export default {
    name: 'register',
    data() {
        return {
            login: {
                name: '',
                pwd: '',
                tel: '',
                img: ''
            },
            fromRules: {    
                name:[
                    {required: true, message:'商铺名不能为空'},
                    {validator:(val)=>{
                        return /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(val)
                        },message:'格式不正确'}
                ],
                pwd:[
                    {required: true, message:'密码不能为空'},
                    {validator:(val)=>{
                        return /^(?=.*\d).{3}$/.test(val)
                        },message:'格式不正确'}
                ],
                tel: [
                    { required: true, message: '电话号码不能为空'},
                    { validator: (val) => {
                            return /^(?=.*\d).{11}$/.test(val)
                        }, message: '输入信息有误'}
                ]
            },
            fileList: [],
        }
    },
    methods: {
        validator(val) {
            return /^(?=.*\d).{3}$/.test(val)
        },
        returnLogin() {
            this.$router.back()
        },
        submit() {
            this.fileList.forEach((file) => {
                this.login.img += file.file.name
                utils.imgSuccess(file.file)
            })
            if (this.login.name != '' && this.login.pwd != '' && this.login.img != ''
                && this.login.tel != '') {
                axios.post('/identity/register/shop', this.login).then(res => {
                    if (res.data.flag) {

                        Dialog.alert({
                            message: '注册成功，请去登录'
                        }).then(() => {
                            this.$router.back()
                        })
                    }
                })
            }
        }
    }
}
</script>

<style></style>