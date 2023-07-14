<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',

}
</script>

<style>
#app{
  background: url("./assets/2194.jpg");
    position: fixed;
  height: 100%;
  width: 100%;
  background-size:100% 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}

</style>
