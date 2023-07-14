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
#app {
  /* background-color: rgb(86, 85, 85); */
  background: url("./assets/45a79fbff0414be2aa8cabe7241326b4.jpeg");
    position: fixed;
  height: 100%;
  width: 100%;
  background-size:100% 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
