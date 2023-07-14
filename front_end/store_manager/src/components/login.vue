<template>
    <div class="allDiv">
        <!-- logo -->
        <div style="margin: 180px 30% 50px 30%;">
            <van-image round width="10rem" height="10rem" src="https://img1.baidu.com/it/u=1756626708,3256622301&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=574"/>
        </div>
        <!-- 输入框 -->
        <van-form validate-first>
            <van-field v-model="login.name" placeholder="请输入管理员名" style="margin: 10px auto;width: 70%;" 
                left-icon="manager-o" :rules="[{ pattern, message: '请输入正确的管理员名' }]" />
            <van-field v-model="login.pwd" placeholder="请输入密码" style="margin:10px auto;width: 70%;"
            type="password" left-icon="flower-o" :rules="[{ validator, message: '请输入正确的密码' }]" />
            <div style="margin: 16px;">
                <van-button round block type="info" @click="submit">提交</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import axios from 'axios'
import { Dialog, Toast } from 'vant'
export default {
    name: 'login',
    data() {
        return {
            login: {
                name: 'admin',
                pwd: '123'
            },
            pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/
        }
    },
    methods: {
        validator(val) {
            return /^(?=.*\d).{3}$/.test(val)
        },
        submit(){
            if (/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(this.login.name && /^(?=.*\d).{3}$/.test(this.login.pwd))){
                axios.post('/login/manager',this.login).then(res=>{
                    if(res.data.flag){
                        Toast.success('登录成功')
                        window.sessionStorage.setItem('token.id',res.data.data.id)
                        window.sessionStorage.setItem('token.name',res.data.data.name)
                        this.$router.push({path:'/identity'})
                    }
                })
            }
        }
    }

}
</script>

<style>
.allDiv{
    background: url("../assets/1000.webp");
    position: fixed;
  height: 100%;
  width: 100%;
  background-size:100% 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>