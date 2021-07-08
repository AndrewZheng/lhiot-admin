<template>
  <div class="m-statistics">
    <Card>
      <!-- 按统计名称搜索 -->
      <Select
        v-model="modelName"
        placeholder="请选择统计模块"
        style="width: 300px"
        clearable
        filterable
      >
        <Option
          v-for="item in modelList"
          :key="item.value"
          :value="item.value"
        >{{ item.label }}</Option>
      </Select>

      <!-- 入口区域 -->
      <Row type="flex" justify="space-between">
        <i-col v-show="!modelName ||modelName==='small-data-statistics' || modelName==='small-amount'" span="4">
          <Card class="m-card">
            <p slot="title">
              <Icon type="md-stats" />
              邀请统计
            </p>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-data-statistics')">
              <Icon type="ios-stats-outline" /> 邀请有礼活动分析
            </Button>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-amount')">
              <Icon type="ios-stats-outline" /> 邀请有礼活动数据汇总
            </Button>
          </Card>
        </i-col>

        <i-col v-show="!modelName ||modelName==='small-seckill-statistics' || modelName==='small-seckill-amount'" span="4">
          <Card class="m-card">
            <p slot="title">
              <Icon type="md-stats" />
              限时统计
            </p>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-seckill-statistics')">
              <Icon type="ios-stats-outline" /> 限时秒杀活动分析
            </Button>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-seckill-amount')">
              <Icon type="ios-stats-outline" /> 限时秒杀活动数据汇总
            </Button>
          </Card>
        </i-col>

        <i-col v-show="!modelName ||modelName==='small-assist-statistics' || modelName==='small-assist-amount'" span="4">
          <Card class="m-card">
            <p slot="title">
              <Icon type="md-stats" />
              助力统计
            </p>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-assist-statistics')">
              <Icon type="ios-stats-outline" /> 助力抢爆品活动分析
            </Button>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-assist-amount')">
              <Icon type="ios-stats-outline" /> 助力抢爆品活动数据汇总
            </Button>
          </Card>
        </i-col>

        <i-col v-show="!modelName ||modelName==='small-integral-statistics' || modelName==='small-lottery-statistics'" span="4">
          <Card class="m-card">
            <p slot="title">
              <Icon type="md-stats" />
              积分统计
            </p>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-integral-statistics')">
              <Icon type="ios-stats-outline" /> 积分数据分析
            </Button>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-lottery-statistics')">
              <Icon type="ios-stats-outline" /> 积分抽奖数据分析
            </Button>
          </Card>
        </i-col>

        <i-col
          v-show="!modelName || modelName==='small-system-data-statistics' || modelName==='small-coupon-statistics' || modelName==='small-sendRedPacketStatistics'
            || modelName==='small-share-statistics' || modelName==='small-user-source-statistics' || odelName==='small-collectWordStatistics'"
          span="4"
        >
          <Card class="m-card">
            <p slot="title">
              <Icon type="md-stats" />
              其他统计
            </p>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-system-data-statistics')">
              <Icon type="ios-stats-outline" /> 系统数据统计
            </Button>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-coupon-statistics')">
              <Icon type="ios-stats-outline" /> 用券数据统计
            </Button>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-sendRedPacketStatistics')">
              <Icon type="ios-stats-outline" /> 外卖红包统计
            </Button>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-share-statistics')">
              <Icon type="ios-stats-outline" /> 分享赚数据统计
            </Button>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-user-source-statistics')">
              <Icon type="ios-stats-outline" /> 用户来源统计
            </Button>
            <Button v-waves class="search-btn mt10 mr10" type="success" @click="turnToPage('small-collectWordStatistics')">
              <Icon type="ios-stats-outline" /> 集字活动数据统计
            </Button>
          </Card>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  components: {},
  props: {},
  data() {
    return {
      modelList: [
        {
          label: '邀请有礼活动分析',
          value: 'small-data-statistics'
        },
        {
          label: '邀请有礼活动数据汇总',
          value: 'small-amount'
        },
        {
          label: '限时秒杀活动分析',
          value: 'small-seckill-statistics'
        },
        {
          label: '限时秒杀活动数据汇总',
          value: 'small-seckill-amount'
        },
        {
          label: '助力抢爆品活动分析',
          value: 'small-assist-statistics'
        },
        {
          label: '助力抢爆品活动数据汇总',
          value: 'small-assist-amount'
        },
        {
          label: '积分数据分析',
          value: 'small-integral-statistics'
        },
        {
          label: '积分抽奖数据分析',
          value: 'small-lottery-statistics'
        },
        {
          label: '系统数据统计',
          value: 'small-system-data-statistics'
        },
        {
          label: '用券数据统计',
          value: 'small-coupon-statistics'
        },
        {
          label: '外卖红包统计',
          value: 'small-sendRedPacketStatistics'
        },
        {
          label: '分享赚数据统计',
          value: 'small-share-statistics'
        },
        {
          label: '用户来源统计',
          value: 'small-user-source-statistics'
        },
        {
          label: '集字活动数据统计',
          value: 'small-collectWordStatistics'
        }
      ],
      modelName: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  updated() {
  },
  methods: {
  }
}
</script>

<style lang='scss'>
.m-card{
  margin-top: 30px;
}
</style>
