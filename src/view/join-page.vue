<template>
  <div class="wrapper">
    <Row :gutter="24" type="flex" align="middle" justify="space-between">
      <i-col span="8" order="3">
        <Card title="组件练习" shadow>
          <p class="qq-group-intro"></p>
        </Card>
      </i-col>
      <i-col span="8" order="1">
        <Card title="组件练习二" shadow>
          <p class="qq-group-intro"></p>
        </Card>
      </i-col>
      <i-col span="8" order="2">
        <Card title="组件练习三" shadow>
          <p class="qq-group-intro"></p>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import qqFans from '@/assets/images/qq-fance.jpg';
import CountTo from '_c/count-to';

export default {
  name: 'join_page',
  components: {
    CountTo
  },
  data() {
    return {
      qqFans
    };
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.qq-group-img {
  display: block;
  margin: 0 auto;
  width: 240px;
}

.qq-group-intro {
  padding: 20px;
  font-size: 16px;
}
</style>
