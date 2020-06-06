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
          <Button
            v-waves
            :searchLoading="searchLoading"
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
      <div style="margin: 10px;overflow: hidden">
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
import Tables from "_c/tables";
import _ from "lodash";
import { getOrderGoodsToday } from "@/api/wholesale";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import deleteMixin from "@/mixins/deleteMixin.js";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from "@/libs/util";
import { userStatusEnum, sexEnum, userTypeEnum } from "@/libs/enumerate";
import {
  userTypeConvert,
  userStatusConvert,
  sexConvert
} from "@/libs/converStatus";

const goodsToday = {
  baseBar: "",
  goodsName: "",
  goodsWeight: 0,
  netWeight: 0,
  quanity: 0,
  standard: "",
  goodsSumPrice: "",
  goodsPrice: "",
  categoryName: ""
};

const roleRowData = {
  goodsName: "",
  page: 1,
  rows: 20
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
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
          title: "商品条码",
          align: "center",
          key: "baseBar",
          minWidth: 60
        },
        {
          title: "商品分类",
          align: "center",
          key: "categoryName",
          minWidth: 60
        },
        {
          title: "商品名称",
          align: "center",
          key: "goodsName",
          minWidth: 100
        },
        {
          title: "商品规格",
          align: "center",
          key: "standard",
          minWidth: 80
        },
        {
          title: "商品单价",
          align: "center",
          key: "goodsPrice",
          minWidth: 80
        },
        {
          title: "商品数量",
          align: "center",
          key: "quanity",
          minWidth: 80
        },
        {
          title: "商品重量",
          align: "center",
          key: "goodsWeight",
          minWidth: 80
        },
        {
          title: "商品净重",
          align: "center",
          key: "netWeight",
          minWidth: 80
        },
        {
          title: "商品总额",
          align: "center",
          key: "goodsSumPrice",
          minWidth: 80
        }
      ]
    };
  },
  created() {
    this.getTableData();
  },
  mounted() {},
  computed: {},
  methods: {
    getTableData() {
      getOrderGoodsToday(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(res => {
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
    handleDownload() {
      this.exportExcelLoading = true;
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      let pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getOrderGoodsToday(this.searchRowData)
        .then(res => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowData.rows = 10;
          this.searchRowData.page = pageSize;
          // 表格数据导出字段翻译
          //  tableData.forEach(item => {});
          const date = this.$moment(new Date()).format("YYYYMMDDHHmmss");
          this.$refs.tables.handleDownload({
            filename: `新品需求信息-${date}`,
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
