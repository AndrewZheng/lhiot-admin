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
        @on-delete="handleDelete"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.contactPhone"
            placeholder="手机号码"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Input
            v-model="searchRowData.userName"
            placeholder="店长姓名"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <DatePicker
            v-model="searchRowData.regBeginTime"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="开始时间起"
            class="search-input"
            style="width: 150px"
            @on-change="beginTimeChange"
          />
          <i>-</i>
          <DatePicker
            v-model="searchRowData.regEndTime"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="开始时间止"
            class="search-input mr5"
            style="width: 150px"
            @on-change="endTimeChange"
          />
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
            :page-size="searchRowData.rows"
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
import {
  getDemandGoodsPages,
  editDemandGoods,
  deleteDemandGoods,
  createDemandGoods
} from "@/api/wholesale";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import deleteMixin from "@/mixins/deleteMixin.js";
import { fenToYuanDot2 } from "@/libs/util";

const demandGoods = {
  comments: "",
  contactPhone: "",
  createTime: "",
  goodsBrand: "",
  goodsName: "",
  goodsStandard: "",
  id: 0,
  referencePrice: 0,
  supplier: "",
  userId: 0,
  userName: "",
  shopName: ""
};

const roleRowData = {
  userName: "",
  contactPhone: "",
  regBeginTime: null,
  regEndTime: null,
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
      modalViewLoading: false,
      clearSearchLoading: false,
      exportExcelLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      demandGoods: _.cloneDeep(demandGoods),
      columns: [
        {
          type: "selection",
          key: "",
          width: 60,
          align: "center"
        },
        {
          title: "编号",
          align: "center",
          key: "id",
          minWidth: 40
        },
        {
          title: "门店名称",
          align: "center",
          key: "shopName",
          minWidth: 100
        },
        {
          title: "店长姓名",
          align: "center",
          key: "userName",
          minWidth: 60
        },
        {
          title: "手机号码",
          align: "center",
          key: "contactPhone",
          minWidth: 80
        },
        {
          title: "商品名称",
          align: "center",
          key: "goodsName",
          minWidth: 80
        },
        {
          title: "商品品牌",
          align: "center",
          key: "goodsBrand",
          minWidth: 80
        },
        {
          title: "商品规格",
          align: "center",
          key: "goodsStandard",
          minWidth: 80
        },
        {
          title: "参考价格",
          align: "center",
          key: "referencePrice",
          minWidth: 80,
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.referencePrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: "供应商",
          align: "center",
          key: "supplier",
          minWidth: 100
        },
        {
          title: "备注",
          align: "center",
          key: "comments",
          minWidth: 120
        },
        {
          title: "提交时间",
          align: "center",
          key: "createTime",
          minWidth: 100
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
      getDemandGoodsPages(this.searchRowData)
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
      this.searchRowData.regBeginTime = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.regEndTime = value;
    },
    resetFields() {
      this.$refs.editForm.resetFields();
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.createTableRow();
          } else if (this.isEdit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error("请完善商品单位信息!");
        }
      });
    },
    editTableRow() {
      this.modalViewLoading = true;
      editDemandGoods(this.demandGoods).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.getTableData();
        this.resetFields();
      });
    },
    createTableRow() {
      createDemandGoods(this.demandGoods)
        .then(res => {})
        .finally(res => {
          this.modalEditLoading = false;
          this.modalEdit = false;
          this.getTableData();
          this.resetFields();
        });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteDemandGoods({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.page === totalPage &&
            this.page !== 1
          ) {
            this.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleDownload() {
      this.exportExcelLoading = true;
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      let pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getDemandGoodsPages(this.searchRowData)
        .then(res => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowData.rows = 10;
          this.searchRowData.page = pageSize;
          // 表格数据导出字段翻译
          tableData.forEach(item => {
            item.referencePrice = (item.referencePrice / 100.0).toFixed(2);
          });
          this.$refs.tables.handleDownload({
            filename: `新品需求信息-${new Date().valueOf()}`,
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
</style>
