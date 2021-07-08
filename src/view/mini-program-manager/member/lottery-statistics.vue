<template>
  <div class="m-role">
    <div style="margin-bottom:30px;position: relative;">
      <Card>
        <tables
          ref="tables"
          v-model="tableData"
          :columns="columns"
          :loading="loading"
          :search-area-column="24"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Row>
              <RadioGroup
                v-model="searchRowData.queryDays"
                type="button"
                class="mr5"
                @on-change="handleChange"
              >
                <Radio label="0">
                  <span>今日</span>
                </Radio>
                <Radio label="1">
                  <span>昨日</span>
                </Radio>
                <Radio label="7">
                  <span>最近7天</span>
                </Radio>
                <Radio label="30">
                  <span>最近30天</span>
                </Radio>
                <Radio label="-1">
                  <span>自定义</span>
                </Radio>
              </RadioGroup>
              <div v-show="mark===true" class="mark">
                <DatePicker
                  :value="searchRowData.startTime"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="开始时间"
                  class="search-input"
                  style="width: 120px"
                  @on-change="searchRowData.startTime=$event"
                />
                <i>-</i>
                <DatePicker
                  :value="searchRowData.endTime"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="结束时间"
                  class="search-input mr2"
                  style="width: 120px"
                  @on-change="searchRowData.endTime=$event"
                />
              </div>
              <Input
                v-model="searchRowData.searchObj.rewardName"
                placeholder="奖品名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchRowData.searchObj.nickName"
                placeholder="会员昵称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchRowData.searchObj.phone"
                placeholder="手机号"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Select
                v-model="searchRowData.searchObj.relationType"
                placeholder="奖品类型"
                clearable
                style="width: 150px"
              >
                <Option
                  v-for="(item,index) in prizeTypeEnum"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
              <Select
                v-model="searchRowData.searchObj.lotteryStatus"
                placeholder="奖品状态"
                clearable
                style="width: 150px"
              >
                <Option
                  v-for="(item,index) in lotteryStatusEnum"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
              <Select
                v-model="searchRowData.searchObj.rewardType"
                placeholder="券类型"
                :class="searchRowData.queryDays=='-1'?'mt10':''"
                style="padding-right: 5px;width: 100px"
                clearable
              >
                <Option
                  v-for="(item,index) in couponTypeEnum"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px;width: 100px"
                >{{ item.label }}</Option>
              </Select>
              <!-- <Select
                v-model="searchRowData.source"
                placeholder="券来源"
                :class="searchRowData.queryDays=='-1'?'mt10':''"
                style="width: 90px"
              >
                <Option
                  v-for="(item,index) in sourceType"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
            </Row> -->
              <Row style="margin-top:10px;">
                <div class="ml15 mt10" style="float:left">
                  <span class="mr10">该时间段内, PV:<i style="color:red">{{ pv }}次</i></span>
                  <span>UV:<i style="color:red">{{ uv }}人</i></span>
                </div>
                <div style="float:right">
                  <Button
                    :loading="searchLoading"
                    class="search-btn mr5"
                    type="primary"
                    @click="handleSearch"
                  >
                    <Icon type="md-search" />&nbsp;搜索
                  </Button>
                  <Button
                    v-waves
                    :loading="clearSearchLoading"
                    class="search-btn"
                    type="info"
                    @click="handleClear"
                  >
                    <Icon type="md-refresh" />&nbsp;清除
                  </Button>
                  <Button class="search-btn mr2" type="warning" @click="handleDownload">
                    <Icon type="md-download" />导出数据
                  </Button>
                </div>
              </Row>
            </row></div>
        </tables>
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="total"
              :current="searchRowData.page"
              :page-size="searchRowData.rows"
              show-sizer
              show-total
              @on-change="changePage"
              @on-page-size-change="changePageSize"
            ></Page>
          </Row>
        </div>
      </Card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getActivityPUV,
  getPointsLotteryStatistics
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import { couponTypeConvert, lotteryStatusConvert } from '@/libs/converStatus';
import { couponTypeEnum, lotteryStatusEnum, prizeTypeEnum } from '@/libs/enumerate';
import { prizeTypeConvert } from '../../../libs/converStatus';

const lotteryDetail = {
  relationType: '', //  PROD("商品");COUPON("券");PSEUDO("虚假的")
  rewardName: '',
  phone: '',
  createTime: '',
  nickName: '',
  rewardType: '', // 商品规格/券类型(满减/折扣/现金)
  source: '',
  lotteryStatus: ''
};

const roleRowData = {
  searchObj: {
    relationType: null, //  PROD("商品");COUPON("券");PSEUDO("虚假的")
    rewardName: null,
    phone: null,
    nickName: null,
    rewardType: null,
    lotteryStatus: null
  },
  page: 1,
  rows: 20,
  queryDays: '0', // 1(昨日) 7(最近7天) 30(最近30天) -1(自定义)
  startTime: null,
  endTime: null,
  pvUvEnum: 'POINTS_LOTTERY'
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, tableMixin],
  data() {
    return {
      mark: false,
      pv: 0,
      uv: 0,
      button: '今日',
      couponTypeEnum,
      prizeTypeEnum,
      lotteryStatusEnum,
      sourceType: [
        { label: '海鼎券', value: 'HD' },
        { label: '系统券', value: 'SMALL' }
      ],
      columns: [
        {
          title: '奖品名称',
          align: 'center',
          key: 'rewardName',
          minWidth: 200
        },
        {
          title: '会员昵称',
          align: 'center',
          key: 'nickName',
          maxWidth: 150
        },
        {
          title: '会员手机号',
          align: 'center',
          key: 'phone',
          minWidth: 150
        },
        {
          title: '奖品类型',
          align: 'center',
          key: 'relationType',
          width: 120,
          render(h, params, vm) {
            const { row } = params;
            if (row.relationType === 'PROD') {
              return <tag color='cyan'>{'商品'}</tag>;
            } else if (row.relationType === 'COUPON') {
              return <tag color='orange'>{'优惠券'}</tag>;
            } else {
              return <tag color='default'>{'谢谢参与'}</tag>
            }
          }
        },
        {
          title: '券来源',
          align: 'center',
          key: 'source',
          width: 120,
          render(h, params, vm) {
            const { row } = params;
            if (row.source === 'SMALL') {
              return <div>{'小程序'}</div>;
            } else if (row.source === 'HD') {
              return <div>{'海鼎'}</div>;
            } else {
              return <div>N/A</div>
            }
          }
        },
        {
          title: '规格/券类型',
          align: 'center',
          key: 'rewardType',
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.relationType === 'PROD' || row.relationType === 'PSEUDO') {
              return (
                <div>{row.rewardType}</div>
              )
            } else {
              if (row.rewardType === 'FULL_CUT_COUPON') {
                return (
                  <div>
                    <tag color='magenta'>
                      {couponTypeConvert(row.rewardType).label}
                    </tag>
                  </div>
                );
              } else if (row.rewardType === 'DISCOUNT_COUPON') {
                return (
                  <div>
                    <tag color='orange'>
                      {couponTypeConvert(row.rewardType).label}
                    </tag>
                  </div>
                );
              } else if (row.rewardType === 'CASH_COUPON') {
                return (
                  <div>
                    <tag color='cyan'>
                      {couponTypeConvert(row.rewardType).label}
                    </tag>
                  </div>
                );
              } else if (row.rewardType === 'FREIGHT_COUPON') {
                return (
                  <div>
                    <tag color='blue'>
                      {couponTypeConvert(row.rewardType).label}
                    </tag>
                  </div>
                );
              }
              return <div>{row.rewardType}</div>;
            }
          }
        },
        {
          title: '奖品状态',
          align: 'center',
          key: 'lotteryStatus',
          width: 120,
          render(h, params, vm) {
            const { row } = params;
            if (row.lotteryStatus === 'RECEIVE') {
              return <tag color='success'>{lotteryStatusConvert(row.lotteryStatus)}</tag>;
            } else if (row.lotteryStatus === 'WAIT_RECEIVE') {
              return <tag color='primary'>{lotteryStatusConvert(row.lotteryStatus)}</tag>;
            } else if (row.lotteryStatus === 'FAILED') {
              return <tag color='warning'>{lotteryStatusConvert(row.lotteryStatus)}</tag>
            } else if (row.lotteryStatus === 'EXPIRE') {
              return <tag color='error'>{lotteryStatusConvert(row.lotteryStatus)}</tag>;
            } else {
              return <tag color='default'>{lotteryStatusConvert(row.lotteryStatus)}</tag>
            }
          }
        },
        {
          title: '抽奖日期',
          align: 'center',
          key: 'createTime',
          width: 200
        },
        {
          title: '结束日期',
          align: 'center',
          key: 'receiveTime',
          width: 200,
          render(h, params, vm) {
            const { row } = params;
            if (row.lotteryStatus === 'RECEIVE') {
              return <div>{row.receiveTime}</div>;
            } else if (row.lotteryStatus === 'WAIT_RECEIVE') {
              return <div></div>;
            } else if (row.lotteryStatus === 'FAILED') {
              return <div color='red'>{row.receiveTime}</div>
            } else if (row.lotteryStatus === 'EXPIRE') {
              return <div color='grey'>{row.receiveTime}</div>;
            } else {
              return <div>{row.receiveTime}</div>
            }
          }
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      lotteryDetail: _.cloneDeep(lotteryDetail)
    };
  },
  computed: {},
  mounted() {
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    getTableData() {
      // 根据搜索条件获取PUV
      this.loading = true;
      getActivityPUV(this.searchRowData)
        .then((res) => {
          this.pv = res.pv;
          this.uv = res.uv;
        });
      getPointsLotteryStatistics(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleChange(item) {
      this.mark = false;
      this.searchRowData.startTime = null;
      this.searchRowData.endTime = null;
      this.searchRowData.queryDays = item;
      if (item === '-1') {
        this.mark = true;
        return;
      }
      this.getTableData();
    },
    handleClear() {
      this.button = '今日';
      this.mark = false;
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearch();
    },
    // 导出数据
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getPointsLotteryStatistics(this.searchRowData).then((res) => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 20;
        this.searchRowData.page = pageSize;
        tableData.forEach((item) => {
          if (item['relationType'] === 'COUPON') {
            item['rewardType'] = couponTypeConvert(item['rewardType']).label;
          }
          if (item['lotteryStatus'] === 'WAIT_RECEIVE') {
            item['receiveTime'] = '';
          }
          item['lotteryStatus'] = lotteryStatusConvert(item['lotteryStatus']);
          item['relationType'] = prizeTypeConvert(item['relationType']);
          if (item['source'] === 'SMALL') {
            item['source'] = '小程序';
          } else if (item['source'] === 'HD') {
            item['source'] = '海鼎';
          } else {
            item['source'] = 'N/A';
          }
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `抽奖数据统计-${date}`,
          data: tableData
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.mark {
  display: inline-block;
}
.tabChange {
  height: 50px;
  width: 230px;
  font-size: 14px;
  display: flex;
  align-items: center;
  position: relative;
  bottom: -5px;
  left: 0;
  background: rgb(245, 247, 249);
  border: 1px solid rgb(232, 234, 236);
  border-radius: 10px 10px 0 0;
  b {
    display: block;
    width: 113px;
    height: 48px;
    cursor: pointer;
    line-height: 50px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  }
}
.hot {
  display: inline-block;
  // color: red;
  background-color: #fff;
}
</style>
