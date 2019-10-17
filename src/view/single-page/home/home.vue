<template>
  <div>
    <Row :gutter="20">
      <i-col
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        span="4"
        style="height: 120px;"
      >
        <infor-card :color="infor.color" :icon="infor.icon" :icon-size="36" shadow>
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie :value="pieData" style="height: 300px;width:100%;" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar :value="barData" style="height: 300px;width:100%;" text="每周用户活跃量" />
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <!-- <example style="height: 310px;" /> -->
        <img src="http://resource.shuiguoshule.com.cn/product_image/2019-07-31/sgv7qBdSKI7ZrH5JU2kB.jpg" style="height: 300px;width:100%;" >
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import Example from "./example.vue";
export default {
  name: "Home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data() {
    return {
      inforCardData: [
        {
          title: "昨日支付金额",
          icon: "logo-yen",
          count: 9898,
          color: "#f95157"
        },
        {
          title: "昨日支付笔数",
          icon: "md-stats",
          count: 368,
          color: "#19be6b"
        },
        {
          title: "昨日新添加人数",
          icon: "ios-person-add",
          count: 168,
          color: "#ff9900"
        },
        { title: "总添加人数", icon: "md-person-add", count: 98998, color: "#9A66E4" },
        {
          title: "昨日新访问人数",
          icon: "md-git-network",
          count: 918,
          color: "#ed3f14"
        },
        {
          title: "总分访问人数",
          icon: "md-happy",
          count: 99898,
          color: "#E46CBB"
        }
      ],
      pieData: [
        { value: 6300, name: "公众号菜单" },
        { value: 4600, name: "公众号下发" },
        { value: 4100, name: "任务栏-最近使用" },
        { value: 2200, name: "会话" },
        { value: 1400, name: "小程序历史列表" }
      ],
      barData: {
        "未知": 0,
        "17岁以下": 4,
        "18-24岁": 157,
        "25-29岁": 255,
        "30-39岁": 446,
        "40-49岁": 113,
        "50岁以上": 36
      }
    };
  },
  mounted() {
    //
  }
};
</script>

<style lang="less">
.count-style {
  font-size: 40px;
}
</style>
