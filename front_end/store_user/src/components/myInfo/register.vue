<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="注册" left-arrow @click-left="onClickLeft"
            style="background-color: rgba(152, 230, 240, 0.6);margin: 10px 0px;" />
        <!-- 输入框 -->
        <van-form validate-first style="margin-top: 200px;">
            <van-field v-model="user.name" placeholder="请输入用户名" style="margin: 10px auto;width: 90%;background-color: rgba(152, 230, 240, 0.6);" left-icon="manager-o"
                :rules="fromRules.name" label="昵称"/>
            <van-field v-model="user.pwd" placeholder="请输入密码" style="margin: 10px auto;width: 90%;background-color: rgba(152, 230, 240, 0.6);" left-icon="manager-o"
                :rules="fromRules.pwd" label="密码" />
            <div style="margin: 16px;">
                <van-button round block type="info" @click="submit">注册</van-button>
            </div>
        </van-form>

        <!-- 注册与忘记密码 -->
        <div style="display: flex;">
            <div style="margin-left: 180px;font-size: 18px;color: firebrick;" @click="toLogin">已有账号？请登录 </div>
        </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Dialog, Toast } from 'vant'
export default {
    name:'register',
    data(){
        return{
            user:{
                name:'',
                pwd:''
            },
            fromRules: {
                name: [
                    { required: true, message: '昵称不能为空' },
                    {
                        validator: (val) => {
                            return /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(val)
                        }, message: '格式不正确'
                    }
                ],
                pwd: [
                    { required: true, message: '密码不能为空' },
                    {
                        validator: (val) => {
                            return /^(?=.*\d).{3}$/.test(val)
                        }, message: '输入信息有误'
                    }
                ]
            },
        }
    },
    methods:{
        submit(){
            axios.get('/identity/user/isNull/'+this.user.name).then(res=>{
                if(!res.data.flag){
                    Dialog.alert({
                        message:'此用户名已存在，请重新输入'
                    })
                }else{
                    axios.post('/register/user',this.user).then(res=>{
                if(res.data.flag){
                    Dialog.alert({
                        message:'注册成功,请前往登录'
                    }).then(()=>{
                        this.$router.push({
                            path:'/login'
                        })
                    })
                }
            })
                }
            })
        },
        toLogin(){
            this.$router.push({
                path:'/login'
            })
        },
        onClickLeft(){
            this.$router.back()
        }
    }
}
</script>

<style>

</style>