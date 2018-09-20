<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import * as util from '@/libs/util.js';

export default {
  name: 'App',
  data() {
    return {
      menuData: null,
      userData: null
    };
  }
};
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
