<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="16"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.goodsName"
            placeholder="商品名称"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <DatePicker
            v-model="searchRowData.startDate"
            format="yyyy-MM-dd"
            type="date"
            placeholder="开始时间"
            class="mr5"
            style="width: 150px"
            @on-change="startTimeChange"
          />
          <i>-</i>
          <DatePicker
            v-model="searchRowData.endDate"
            format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间"
            class="mr5"
            style="width: 150px"
            @on-change="endTimeChange"
          />
          <Button
            v-waves
            :search-loading="searchLoading"
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
          <div class="ml15 mt10">
            <i style="color: red">*</i>
            当天中午12点前默认为昨日订单,12点后为今日订单
          </div>
        </div>
        <div slot="operations">
          <Button
            v-waves
            :loading="exportExcelLoading"
            type="primary"
            class="mr5"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出
          </Button>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
            :page-size="20"
            :page-size-opts="templatePageOpts"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import { getOrderGoodsToday } from '@/api/wholesale';
import tableMixin from '@/mixins/tableMixin.js';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from '@/libs/util';
import { userStatusEnum, sexEnum, userTypeEnum } from '@/libs/enumerate';
import {
  userTypeConvert,
  userStatusConvert,
  sexConvert
} from '@/libs/converStatus';

const goodsToday = {
  baseBar: '',
  goodsName: '',
  goodsWeight: 0,
  netWeight: 0,
  quanity: 0,
  standard: '',
  goodsSumPrice: '',
  goodsPrice: '',
  categoryName: ''
};

const roleRowData = {
  goodsName: '',
  startDate: null,
  endDate: null,
  page: 1,
  rows: 20
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      ids: [],
      templatePageOpts: [20, 50],
      salesManList: [],
      userStatusEnum,
      userTypeEnum,
      sexEnum,
      modalViewLoading: false,
      clearSearchLoading: false,
      exportExcelLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      goodsToday: _.cloneDeep(goodsToday),
      columns: [
        {
          title: '商品条码',
          align: 'center',
          key: 'baseBar',
          minWidth: 90
        },
        {
          title: '商品分类',
          align: 'center',
          key: 'categoryName',
          minWidth: 80
        },
        {
          title: '商品名称',
          align: 'center',
          key: 'goodsName',
          minWidth: 160
        },
        {
          title: '商品规格',
          align: 'center',
          key: 'standard',
          minWidth: 100
        },
        {
          title: '商品单价',
          align: 'center',
          key: 'goodsPrice',
          minWidth: 80,
          render(h, params, vm) {
            const amount = '¥' + params.row.goodsPrice;
            return <div>{amount}</div>;
          }
        },
        {
          title: '商品数量',
          align: 'center',
          key: 'quanity',
          minWidth: 80
        },
        {
          title: '商品重量',
          align: 'center',
          key: 'goodsWeight',
          minWidth: 80,
          render(h, params, vm) {
            const amount = params.row.goodsWeight + 'Kg';
            return <div>{amount}</div>;
          }
        },
        {
          title: '商品净重',
          align: 'center',
          key: 'netWeight',
          minWidth: 80,
          render(h, params, vm) {
            const { row } = params;
            if (row.netWeight) {
              const amount = params.row.netWeight + 'Kg';
              return <div>{amount}</div>;
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '商品总额',
          align: 'center',
          key: 'goodsSumPrice',
          minWidth: 80,
          render(h, params, vm) {
            const amount = '¥' + params.row.goodsSumPrice;
            return <div>{amount}</div>;
          }
        },
        {
          title: '下单日期',
          align: 'center',
          key: 'createDate',
          minWidth: 90
        }
      ]
    };
  },
  computed: {},
  created() {
    this.getTableData();
  },
  mounted() {},
  methods: {
    getTableData() {
      getOrderGoodsToday(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally((res) => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    beginTimeChange(value, date) {
      this.goodsToday.regBeginTime = value;
    },
    endTimeChange(value, date) {
      this.goodsToday.regEndTime = value;
    },
    resetFields() {
      this.$refs.editForm.resetFields();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.goodsToday = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleAdd() {
      this.$refs.editForm.resetFields();
      this.goodsToday = _.cloneDeep(goodsToday);
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    startTimeChange(value, date) {
      this.searchRowData.startDate = value;
    },
    endTimeChange(value, data) {
      this.searchRowData.endDate = value;
    },
    handleDownload() {
      this.exportExcelLoading = true;
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getOrderGoodsToday(this.searchRowData)
        .then((res) => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowData.rows = 10;
          this.searchRowData.page = pageSize;
          // 表格数据导出字段翻译
          //  tableData.forEach(item => {});
          const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
          this.$refs.tables.handleDownload({
            filename: `订单商品导出-${date}`,
            data: tableData
          });
        })
        .finally(() => {
          this.exportExcelLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.img {
  width: 150px;
  height: auto !important;
}
.add-image {
  line-height: 48px;
  vertical-align: text-bottom;
  margin-right: 10px;
}
</style>
