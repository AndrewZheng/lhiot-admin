<template>
  <div :class="classes">
    <div :class="barConClasses">
      <i v-for="i in 8" v-once :class="`${prefix}-bar`" :key="`trigger-${i}`"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Trigger',
  props: {
    mode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      prefix: 'ivu-split-trigger',
      initOffset: 0
    };
  },
  computed: {
    isVertical() {
      return this.mode === 'vertical';
    },
    classes() {
      return [
        this.prefix,
        this.isVertical ? `${this.prefix}-vertical` : `${this.prefix}-horizontal`
      ];
    },
    barConClasses() {
      return [
        `${this.prefix}-bar-con`,
        this.isVertical ? 'vertical' : 'horizontal'
      ];
    }
  }
};
</script>

<style lang="less">
@import './index.less';
</style>
