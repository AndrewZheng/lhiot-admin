<template>
  <div>
    <Button size="large" type="text" @click="backHome">
      返回首页
    </Button>
    <Button size="large" type="text">
      返回上一页({{ second }}s)
    </Button>
  </div>
</template>

<script>
import './error.less';
import { getSystemHomeName } from '@/libs/util';
export default {
  name: 'BackBtnGroup',
  data() {
    return {
      second: 5,
      timer: null
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.second === 0) this.backPrev();
      else this.second--;
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    backHome() {
      const name = getSystemHomeName();
      this.$router.replace({
        name: name
      });
    },
    backPrev() {
      this.$router.go(-1);
    }
  }
};
</script>
