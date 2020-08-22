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
        @on-delete="handleDelete"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.couponName"
              placeholder="优惠券名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="用户手机"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.couponStatus"
              class="search-col mr5"
              placeholder="使用状态"
              style="width: 150px"
              clearable
            >
              <Option
                v-for="item in couponUseStatusEnum"
                :key="item.value"
                :value="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.couponFrom"
              class="search-col mr5"
              placeholder="优惠券来源"
              style="width: 150px"
              clearable
            >
              <Option
                v-for="item in couponFromEnum"
                :key="item.value"
                :value="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
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
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="handleSendCoupon">
            <Icon type="md-add" />手动发券
          </Button>
          <!-- <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />批量删除
            </Button>
          </Poptip>-->
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
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

    <!-- 关联优惠券配置 -->
    <Modal v-model="modalEdit" :width="1300" :z-index="1000" :mask-closable="false" title="关联优惠券配置">
      <div class="modal-content">
        <Card>
          <tables
            ref="tables"
            v-model="configTableData"
            :columns="configColumns"
            :loading="loadingConfig"
            :search-area-column="18"
            :operate-area-column="6"
            editable
            searchable
            border
            search-place="top"
            @on-select-all="onConfigSelectionAll"
            @on-selection-change="onConfigSelectionChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input
                  v-model="searchConfigRowData.couponName"
                  placeholder="优惠券名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Select
                  v-model="searchConfigRowData.couponType"
                  class="search-col mr5"
                  placeholder="发放类型"
                  style="width: 150px"
                  clearable
                >
                  <Option
                    v-for="item in couponFromEnum"
                    :key="item.value"
                    :value="item.value"
                    class="ptb2-5"
                  >{{ item.label }}</Option>
                </Select>
                <Button
                  :loading="searchLoading"
                  class="search-btn mr5"
                  type="primary"
                  @click="handleConfigSearch"
                >
                  <Icon type="md-search" />&nbsp;搜索
                </Button>
                <Button
                  v-waves
                  :loading="clearSearchLoading"
                  class="search-btn"
                  type="info"
                  @click="handleConfigClear"
                >
                  <Icon type="md-refresh" />&nbsp;清除
                </Button>
              </Row>
            </div>
          </tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="configTotal"
                :current="searchConfigRowData.page"
                show-sizer
                show-total
                @on-change="changeConfigPage"
                @on-page-size-change="changeConfigPageSize"
              ></Page>
            </Row>
          </div>
        </Card>

        <Divider orientation="center">填写发送对象手机号</Divider>

        <Row class="mt10">
          <i-col span="2">用户手机号:</i-col>
          <i-col span="22">
            <Input
              v-model="sendPhones"
              :autosize="{minRows: 3,maxRows: 8}"
              type="textarea"
              placeholder="多个用户请使用','分割要发送的手机号"
            ></Input>
            <div class="ml15 brand-red">* 使用英文输入法逗号分割要发送的手机号，发放数量为1张</div>
          </i-col>
        </Row>
        <Row v-show="sendFailPhones.length > 0" class="mt10">
          <i-col span="2">发送失败手机号：</i-col>
          <i-col span="22" class="brand-red">{{ sendFailPhones.join(',') }}</i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import {
  getCouponPages,
  getCouponConfigPages,
  sendCouponByPhones,
  deletCoupon,
} from "@/api/wholesale";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  couponTemplateTypeEnum,
  activityStatusEnum,
  couponUseStatusEnum,
  couponFromEnum,
} from "@/libs/enumerate";
import {
  userStatusConvert,
  couponUseStatusConvert,
  couponFromConvert,
} from "@/libs/converStatus";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  compareCouponData,
} from "@/libs/util";

const couponDetail = {
  id: 0,
  fullFee: 0,
  couponFee: 0,
  couponName: "",
  couponType: "", // allgoods-全品类 singlegoods-单品
  addressDetail: "",
  couponConfigId: 0,
  couponFrom: "",
  couponStatus: "",
  effectiveTime: "",
  failureTime: "",
  getTime: "",
  isValidate: false,
  phone: "",
  shopName: "",
  useTime: "",
  userId: 0,
  userName: "",
  userStatus: "",
};

const roleRowData = {
  couponStatus: "",
  couponName: "",
  couponFrom: "",
  phone: "",
  page: 1,
  rows: 20,
  sidx: "getTime",
  sort: "desc",
};

const couponConfig = {
  id: 0,
  vaild: "",
  endTime: null,
  startTime: null,
  couponFee: 0,
  couponName: "",
  couponType: "",
  fullFee: 0,
  couponDes: "",
  couponId: 0, // 优惠券模板id
  effectiveTime: "",
  failureTime: "",
  plateType: "", // allgoods-全品类 singlegoods-单品类
  vaildDays: 0,
};

const configRoleRowData = {
  couponName: "",
  couponType: "",
  couponConfigvaild: "yes",
  page: 1,
  rows: 10,
};

const configColumns = [
  {
    type: "selection",
    width: 60,
    align: "center",
  },
  {
    title: "ID",
    align: "center",
    key: "id",
    maxWidth: 80,
  },
  {
    title: "优惠券名称",
    align: "center",
    key: "couponName",
    minWidth: 120,
  },
  {
    title: "满减金额",
    align: "center",
    minWidth: 60,
    key: "fullFee",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.fullFee);
      return <div>{amount}</div>;
    },
  },
  {
    title: "优惠金额",
    align: "center",
    minWidth: 60,
    key: "couponFee",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.couponFee);
      return <div>{amount}</div>;
    },
  },
  {
    title: "发放类型",
    align: "center",
    key: "couponType",
    minWidth: 70,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === "artificial") {
        return (
          <div>
            <tag color="primary">{couponFromConvert(row.couponType)}</tag>
          </div>
        );
      } else if (row.couponType === "activity") {
        return (
          <div>
            <tag color="pink">{couponFromConvert(row.couponType)}</tag>
          </div>
        );
      } else if (row.couponType === "registration") {
        return (
          <div>
            <tag color="orange">{couponFromConvert(row.couponType)}</tag>
          </div>
        );
      } else if (row.couponType === "flashsale") {
        return (
          <div>
            <tag color="cyan">{couponFromConvert(row.couponType)}</tag>
          </div>
        );
      } else {
        return (
          <div>
            <tag color="primary">N/A</tag>
          </div>
        );
      }
    },
  },
  {
    title: "生效时间",
    align: "center",
    key: "effectiveTime",
    width: 180,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.vaildDays) {
        return <div>{"N/A"}</div>;
      } else {
        return <div>{row.effectiveTime}</div>;
      }
    },
  },
  {
    title: "失效时间",
    align: "center",
    key: "failureTime",
    width: 220,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.vaildDays) {
        return <div>{"N/A"}</div>;
      } else {
        if (!compareCouponData(row.failureTime)) {
          return <div style="color:red">{row.failureTime + "　已过期"}</div>;
        } else {
          return <div>{row.failureTime}</div>;
        }
      }
    },
  },
  {
    title: "有效天数",
    align: "center",
    key: "vaildDays",
    minWidth: 60,
  },
  {
    title: "优惠券状态",
    minWidth: 80,
    align: "center",
    key: "vaild",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponConfigvaild === "yes") {
        return (
          <div>
            <tag color="success">有效</tag>
          </div>
        );
      } else if (row.couponConfigvaild === "no") {
        return (
          <div>
            <tag color="error">无效</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">N/A</tag>
        </div>
      );
    },
  },
];

const couponColumns = [
  {
    type: "selection",
    width: 60,
    align: "center",
  },
  {
    title: "ID",
    align: "center",
    key: "id",
    maxWidth: 80,
  },
  {
    title: "店铺名称",
    align: "center",
    key: "shopName",
    minWidth: 100,
  },
  {
    title: "用户名称",
    align: "center",
    key: "userName",
  },
  {
    title: "用户电话",
    align: "center",
    key: "phone",
    minWidth: 40,
  },
  {
    title: "用户状态",
    align: "center",
    key: "userStatus",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.userStatus === "certified") {
        return (
          <div>
            <tag color="success">{userStatusConvert(row.userStatus)}</tag>
          </div>
        );
      } else if (row.userStatus === "locking") {
        return (
          <div>
            <tag color="error">{userStatusConvert(row.userStatus)}</tag>
          </div>
        );
      } else if (row.userStatus === "unaudited") {
        return (
          <div>
            <tag color="warning">{userStatusConvert(row.userStatus)}</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">{userStatusConvert(row.userStatus)}</tag>
        </div>
      );
    },
  },
  {
    title: "优惠券名称",
    align: "center",
    key: "couponName",
    minWidth: 80,
  },
  {
    title: "优惠金额",
    align: "center",
    minWidth: 60,
    key: "couponFee",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.couponFee);
      return <div>{amount}</div>;
    },
  },
  {
    title: "优惠券来源",
    align: "center",
    key: "couponFrom",
    minWidth: 60,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponFrom === "artificial") {
        return (
          <div>
            <tag color="primary">{couponFromConvert(row.couponFrom)}</tag>
          </div>
        );
      } else {
        return (
          <div>
            <tag color="pink">{couponFromConvert(row.couponFrom)}</tag>
          </div>
        );
      }
    },
  },
  {
    title: "获取时间",
    align: "center",
    key: "getTime",
    minWidth: 80,
  },
  {
    title: "使用状态",
    align: "center",
    key: "couponStatus",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponStatus === "used") {
        return (
          <div>
            <tag color="error">{couponUseStatusConvert(row.couponStatus)}</tag>
          </div>
        );
      } else if (row.couponStatus === "expired") {
        return (
          <div>
            <tag color="default">
              {couponUseStatusConvert(row.couponStatus)}
            </tag>
          </div>
        );
      } else if (row.couponStatus === "unused") {
        return (
          <div>
            <tag color="primary">
              {couponUseStatusConvert(row.couponStatus)}
            </tag>
          </div>
        );
      }
    },
  },
  {
    title: "使用时间",
    align: "center",
    key: "useTime",
    minWidth: 80,
  },
  // {
  //   title: '操作',
  //   minWidth: 80,
  //   key: 'handle',
  //   options: ['']
  // }
];

export default {
  components: {
    Tables,
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      configTotal: 0,
      couponConfigIds: "",
      sendPhones: "",
      couponFromEnum,
      activityStatusEnum,
      couponUseStatusEnum,
      couponTemplateTypeEnum,
      areaList: [],
      sendFailPhones: [],
      defaultListMain: [],
      uploadListMain: [],
      configTableData: [],
      templatePageOpts: [20, 50],
      createLoading: false,
      modalViewLoading: false,
      loadingConfig: false,
      searchRowData: _.cloneDeep(roleRowData),
      couponDetail: _.cloneDeep(couponDetail),
      configColumns: _.cloneDeep(configColumns),
      searchConfigRowData: _.cloneDeep(configRoleRowData),
      columns: couponColumns,
    };
  },
  computed: {
    couponFeeComputed() {
      return fenToYuanDot2Number(this.couponDetail.couponFee);
    },
    fullFeeComputed() {
      return fenToYuanDot2Number(this.couponDetail.fullFee);
    },
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    // 变化函数
    fullFeeOnchange(value) {
      this.couponDetail.fullFee = yuanToFenNumber(value);
    },
    couponFeeOnchange(value) {
      this.couponDetail.couponFee = yuanToFenNumber(value);
    },
    onConfigSelectionChange(selection) {
      if (selection.length > 1) {
        this.$Message.warning("最多选择一张优惠券");
        return;
      }
      this.couponConfigIds = selection
        .map((item) => item.id.toString())
        .join(",");
    },
    onConfigSelectionAll(selection) {
      if (selection.length > 1) {
        this.$Message.warning("最多选择一张优惠券");
        return;
      }
      this.couponConfigIds = selection
        .map((item) => item.id.toString())
        .join(",");
    },
    getTableData() {
      getCouponPages(this.searchRowData)
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
    getConfigTableData() {
      this.loadingConfig = true;
      getCouponConfigPages(this.searchConfigRowData)
        .then((res) => {
          this.configTableData = res.rows;
          this.configTotal = res.total;
        })
        .finally(() => {
          this.loadingConfig = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleSendCoupon() {
      // 清空上次发送的记录
      this.couponConfigIds = "";
      this.sendPhones = "";
      this.sendFailPhones = [];
      this.getConfigTableData();
      this.modalEdit = true;
    },
    handleSubmit() {
      console.log("couponConfigIds:", this.couponConfigIds);
      console.log("sendPhones:", this.sendPhones);
      // 手动发券确认
      sendCouponByPhones({
        id: this.couponConfigIds,
        phones: this.sendPhones,
      }).then((res) => {
        console.log("result", res);
        if (res && res.fail.length > 0) {
          this.$Message.info("部分用户未发放成功");
          this.sendFailPhones = res.fail;
        } else {
          this.modalEdit = false;
          this.$Message.info("发放成功");
        }
        this.getTableData();
      });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
      this.couponDetail.storeImage = null;
    },
    deleteTable(ids) {
      this.loading = true;
      deletCoupon({
        ids,
      })
        .then((res) => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length == this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    changeConfigPage(page) {
      this.searchConfigRowData.page = page;
      this.getConfigTableData();
    },
    changeConfigPageSize(pageSize) {
      this.searchConfigRowData.page = 1;
      this.searchConfigRowData.rows = pageSize;
      this.getConfigTableData();
    },
    handleConfigSearch() {
      this.searchConfigRowData.page = 1;
      this.searchLoading = true;
      this.getConfigTableData();
    },
    handleConfigClear() {
      this.clearSearchLoading = true;
      this.searchConfigRowData = _.cloneDeep(configRoleRowData);
      this.handleConfigSearch();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
