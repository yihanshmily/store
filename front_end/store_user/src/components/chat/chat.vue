<template>
  <div>

    <!-- 导航标签页 -->
    <van-tabbar route style="background-color:rgba(152, 230, 240, 0.6);" placeholder active-color="blue">
            <van-tabbar-item replace to="/index" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item replace to="/category" icon="search">分类</van-tabbar-item>
            <van-tabbar-item replace to="/chat" icon="search">信息</van-tabbar-item>
        </van-tabbar>
  </div>
</template>

<script>
export default {
    name:'chat'
}
</script>

<style>

</style>