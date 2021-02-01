<template>
  <div class="m-role">
    <div style="margin-bottom: 30px; position: relative">
      <div class="tabChange">
        <b
          data-index="user"
          :class="topStatus == 'user' ? 'hot' : ''"
          @click="assistDataChange"
        >用户数据分析</b>
        <b
          data-index="product"
          :class="topStatus == 'product' ? 'hot' : ''"
          @click="assistDataChange"
        >单品数据分析</b>
      </div>
      <Card v-show="topStatus === 'user'">
        <tables
          ref="tables"
          v-model="tableData"
          :columns="columns"
          :loading="loading"
          :search-area-column="18"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Row>
              <Input
                v-model="searchRowData.nickName"
                placeholder="用户昵称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchRowData.phone"
                placeholder="手机号码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Select
                v-model="searchRowData.sidx"
                placeholder="排序"
                style="padding-right: 5px; width: 120px"
                clearable
              >
                <Option
                  v-for="(item, index) in rankType"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px; width: 100px"
                >
                  {{ item.label }}
                </Option>
              </Select>
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
              <!-- <Button class="search-btn mr2" type="warning" @click="handleDownload">
                <Icon type="md-download" />导出数据
              </Button>-->
            </Row>
          </div>
        </tables>
        <div style="margin: 10px; overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="total"
              :current="searchRowData.page"
              show-sizer
              show-total
              @on-change="changePage"
              @on-page-size-change="changePageSize"
            ></Page>
          </Row>
        </div>
      </Card>
      <Card v-show="topStatus === 'product'">
        <tables
          ref="tables1"
          v-model="tableData1"
          :columns="columns1"
          :loading="loading"
          :search-area-column="18"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Row>
              <!-- <Input
                v-model="searchRowData1.standardId"
                placeholder="商品规格ID"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>-->
              <Select
                v-model="searchRowData1.sidx"
                placeholder="排序"
                style="padding-right: 5px; width: 120px"
                @on-change="handRankType"
              >
                <Option
                  v-for="(item, index) in rankType1"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px; width: 100px"
                >
                  {{ item.label }}
                </Option>
              </Select>
              <!-- <Button
                :loading="searchLoading"
                class="search-btn mr5"
                type="primary"
                @click="handleSearch1"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                v-waves
                :loading="clearSearchLoading"
                class="search-btn"
                type="info"
                @click="handleClear1"
              >
                <Icon type="md-refresh" />&nbsp;清除
              </Button>-->
              <!-- <Button class="search-btn mr2" type="warning" @click="handleDownload">
                <Icon type="md-download" />导出数据
              </Button>-->
            </Row>
          </div>
        </tables>
        <div style="margin: 10px; overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="totalPage"
              :current="searchRowData1.page"
              show-sizer
              show-total
              @on-change="changePage2"
              @on-page-size-change="changePageSize2"
            ></Page>
          </Row>
        </div>
      </Card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  userSeckillStatistics,
  singleSeckillStatistics
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from '@/libs/util';

const couponTemplateDetail = {
  //   id: 0,
  //   couponName: "",
  //   couponType: null,
  //   couponFee: 0,
  //   minBuyFee: 0,
  //   couponStatus: null,
  //   couponImage: "",
  //   createUser: "",
  //   createTime: null,
  //   couponRules: "",
  //   couponScope: null
};

const roleRowData = {
  nickName: '',
  phone: '',
  page: 1,
  rows: 10,
  sidx: 'buy_count',
  sort: 'desc'
};

const roleRowData1 = {
  standardId: '',
  page: 1,
  rows: 10,
  sidx: 'buy_count',
  sort: 'desc'
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      topStatus: 'user',
      totalPage: 0,
      rankType: [
        {
          label: '购买总数量',
          value: 'buy_count'
        },
        {
          label: '秒杀总数',
          value: 'seckill_count'
        }
      ],
      rankType1: [
        {
          label: '购买总数量',
          value: 'buy_count'
        },
        {
          label: '秒杀总数',
          value: 'seckill_count'
        }
      ],

      columns: [
        {
          title: '用户ID',
          align: 'center',
          key: 'userId'
        },
        {
          title: '用户昵称',
          align: 'center',
          key: 'nickName',
          minWidth: 200
        },
        {
          title: '手机号',
          align: 'center',
          key: 'phone'
        },
        {
          title: '购买总数量',
          align: 'center',
          key: 'buyCount'
        },
        {
          title: '秒杀总数',
          align: 'center',
          key: 'seckillCount'
        }
      ],
      columns1: [
        {
          title: '商品规格ID',
          align: 'center',
          key: 'standardId'
        },
        {
          title: '商品条码',
          align: 'center',
          key: 'barcode'
        },
        {
          title: '商品名称(上架商品名称)',
          align: 'center',
          key: 'productName',
          minWidth: 200
        },
        {
          title: '购买总数量',
          align: 'center',
          key: 'buyCount'
        },
        {
          title: '秒杀总数',
          align: 'center',
          key: 'seckillCount',
          minWidth: 60
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      searchRowData1: _.cloneDeep(roleRowData1),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail),
      tableData1: []
    };
  },
  computed: {},
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.searchRowData1 = _.cloneDeep(roleRowData1);
    this.getTableData();
    this.getTableData1();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      userSeckillStatistics(this.searchRowData)
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
    getTableData1() {
      singleSeckillStatistics(this.searchRowData1)
        .then((res) => {
          this.tableData1 = res.rows;
          this.totalPage = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleSearch() {
      this.searchRowData1.page = 1;
      this.searchLoading = true;
      this.getTableData();
    },
    handRankType() {
      this.searchRowData1.page = 1;
      this.searchLoading = true;
      this.getTableData1();
    },
    handleSearch1() {
      this.searchRowData.page = 1;
      this.getTableData1();
    },
    handleClear1() {
      // 重置数据
      this.page = 1;
      this.pageSize = 10;
      this.handleSearch1();
    },
    assistDataChange(e) {
      const index = e.currentTarget.dataset.index;
      if (this.topStatus === index) {
        return;
      }
      this.topStatus = index;
    },
    changePage2(page) {
      this.searchRowData1.page = page;
      this.getTableData1();
    },
    changePageSize2(pageSize) {
      this.searchRowData1.page = 1;
      this.searchRowData1.rows = pageSize;
      this.getTableData1();
    }
    // 导出数据
    // handleDownload() {
    //   // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
    //   this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
    //   userSeckillStatistics(this.searchRowData).then(res => {
    //     const tableData = res.rows;
    //     // 恢复正常页数
    //     this.searchRowData.rows = 10;
    //     // 表格数据导出字段翻译
    //     let _this = this;
    //     tableData.forEach(item => {
    //       // const obj = _this.storeList.find(x => item.storeId === x.storeId);
    //       item["nickName"] = item["nickName"] + "";
    //       item["phone"] = item["phone"] + "";
    //       item["allAmount"] = (item["allAmount"] / 100.0).toFixed(2);
    //       item["inviteCount"] = item["inviteCount"] + "";
    //       item["waitAmount"] = (item["waitAmount"] / 100.0).toFixed(2);
    //       item["canOutAmount"] = (item["canOutAmount"] / 100.0).toFixed(2);
    //       item["allOutAmount"] = (item["allOutAmount"] / 100.0).toFixed(2);
    //     });
    //     this.$refs.tables.handleDownload({
    //       filename: `邀请有礼数据统计-${new Date().valueOf()}`,
    //       data: tableData
    //     });
    //   });
    // }
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
  justify-content: space-between;
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
