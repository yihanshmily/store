<template>
    <div>
        <!-- 头像 -->
        <div style="margin: 180px 30% 50px 30%;">
            <van-image v-if="shopImg" round width="10rem" height="10rem" :src="utils.getImage(shopImg)"/>
            <van-image v-else round width="10rem" height="10rem" :src="utils.getImage('default.png')"/>
        </div>
        <!-- 输入框 -->
        <van-form validate-first>
            <van-field v-model="login.name" placeholder="请输入商铺名或商铺账号" style="margin: 10px auto;width: 70%;background-color: rgba(152, 230, 240, 0.6);" 
                left-icon="manager-o" :rules="[{ pattern, message: '请输入正确的商铺名或商铺账号' }]" @blur="getImg"/>
            <van-field v-model="login.pwd" placeholder="请输入密码" style="margin:10px auto;width: 70%;background-color: rgba(152, 230, 240, 0.6);"
            type="password" left-icon="flower-o" :rules="[{ validator, message: '请输入正确的密码' }]" />
            <div style="margin: 16px;">
                <van-button round block type="info" @click="submit">登录</van-button>
            </div>
        </van-form>
        <!-- 注册与忘记密码 -->
        <div style="display: flex;">
            <div style="width: 50%;margin-left: 40px;font-size: 18px;">忘记密码？</div>
            <div style="width: 50%;margin-left: 40px;font-size: 18px;">没有商铺？
                <span style="color: red;text-decoration: underline;" 
                @click="toRegister">注册</span></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { Dialog, Toast } from 'vant'
export default {
    name: 'login',
    data() {
        return {
            shopImg:'',
            login: {
                name: '成都绫瑶',
                pwd: '123'
            },
            pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/
        }
    },
    methods: {
        toRegister(){
            this.$router.push(
                {path:'/register'}
                )
        },
        getImg(){
            axios.get('/identity/getImg/shop/'+this.login.name).then(res=>{
                if(res.data.flag){
                    this.shopImg = res.data.data
                }
            })
        },
        validator(val) {
            return /^(?=.*\d).{3}$/.test(val)
        },
        submit(){
            if (/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(this.login.name && /^(?=.*\d).{3}$/.test(this.login.pwd))){
                axios.post('/login/shop',this.login).then(res=>{
                    if(res.data.flag){
                        Toast.success('登录成功')
                        window.sessionStorage.setItem('token.id',res.data.data.id)
                        window.sessionStorage.setItem('token.name',res.data.data.name)
                        this.$router.push({ path:'/myInfo', })
                    }else{
                        if(res.data.msg === '空'){
                            Toast('登录失败，你输入的账号或密码错误')
                        }else{
                            Toast('该账号已被冻结，请联系管理员')
                        }
                    }
                })
            }
        }
    }

}
</script>

<style>

</style>