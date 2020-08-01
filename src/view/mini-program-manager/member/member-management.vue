<template>
  <div class="m-role">
    <Card>
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
            <Select
              v-model="searchRowData.app_type"
              placeholder="性别"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in appTypeEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.payType"
              placeholder="是否社群用户"
              style="padding-right: 5px;width: 120px"
              clearable
            >
              <Option
                v-for="(item,index) in payTypeEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.payStep"
              placeholder="用户类型"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in payStepEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn mr5"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
          </Row>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import CountTo from "_c/count-to";
import _ from "lodash";
import { getPaymentLogPages } from "@/api/mini-program";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import { fenToYuanDot2, fenToYuanDot2Number } from "@/libs/util";
import {
  appTypeConvert,
  payTypeConvert,
  payStepConvert,
  sourceTypeConvert,
  bankTypeConvert,
} from "@/libs/converStatus";
import {
  appTypeEnum,
  payTypeEnum,
  payStepEnum,
  sourceTypeEnum,
} from "@/libs/enumerate";

const roleRowData = {
  startTime: null,
  endTime: null,
  sourceType: null,
  payType: null,
  payStep: null,
  app_type: null,
  page: 1,
  rows: 10,
  sum: null,
  sidx: "signAt",
  sort: "desc",
};

export default {
  components: {
    Tables,
    CountTo,
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      columns: [
        {
          title: "会员ID",
          key: "orderId",
          align: "center",
        },
        {
          title: "昵称",
          key: "userId",
          align: "center",
        },
        {
          title: "手机号码",
          key: "app_type",
          align: "center",
        },
        {
          title: "性别",
          key: "payType",
          align: "center",
        },
        {
          title: "消费总额",
          align: "center",
          key: "sourceType",
        },
        {
          title: "充值总额",
          key: "payFee",
          align: "center",
        },
        {
          title: "社群成员",
          key: "rechargeAmount",
          align: "center",
        },
        {
          title: "用户类型",
          key: "tradeId",
          align: "center",
        },
        {
          title: "注册时间",
          key: "signAt",
          align: "center",
          width: 110,
        },
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      appTypeEnum,
      payTypeEnum,
      payStepEnum,
      sourceTypeEnum,
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    getTableData() {
      const _this = this;
      getPaymentLogPages(this.searchRowData)
        .then((res) => {
          console.log("12312312", res);
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
