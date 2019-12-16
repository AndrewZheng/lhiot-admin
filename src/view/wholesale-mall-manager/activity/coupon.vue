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
                :value="item.value"
                :key="item.value"
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
                :value="item.value"
                :key="item.value"
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
           <Button
            v-waves
            type="success"
            class="mr5"
            @click="handleSendCoupon"
          >
            <Icon type="md-add" /> 手动发券
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />批量删除
            </Button>
          </Poptip>
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
import _ from "lodash";
import {
  getCouponPages,
  deletCoupon,
  editCoupon,
  createCoupon
} from "@/api/wholesale";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  couponTemplateTypeEnum,
  activityStatusEnum,
  couponUseStatusEnum,
  couponFromEnum
} from "@/libs/enumerate";
import {
  userStatusConvert,
  couponUseStatusConvert,
  couponFromConvert
} from "@/libs/converStatus";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
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
  userStatus: ""
};

const roleRowData = {
  couponStatus: "",
  couponName: "",
  couponFrom: "",
  phone:"",
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      couponFromEnum,
      activityStatusEnum,
      couponUseStatusEnum,
      couponTemplateTypeEnum,
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      couponDetail: _.cloneDeep(couponDetail),
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "ID",
          align: "center",
          key: "id",
          maxWidth: 80
        },
        {
          title: "店铺名称",
          align: "center",
          key: "shopName",
          minWidth: 100
        },
        {
          title: "用户名称",
          align: "center",
          key: "userName"
        },
        {
          title: "用户电话",
          align: "center",
          key: "phone",
          minWidth: 40
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
                  <tag color="success">
                    {userStatusConvert(row.userStatus).label}
                  </tag>
                </div>
              );
            } else if (row.userStatus === "locking") {
              return (
                <div>
                  <tag color="error">
                    {userStatusConvert(row.userStatus).label}
                  </tag>
                </div>
              );
            } else if (row.userStatus === "unaudited") {
              return (
                <div>
                  <tag color="warning">
                    {userStatusConvert(row.userStatus).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">
                  {userStatusConvert(row.userStatus).label}
                </tag>
              </div>
            );
          }
        },
        {
          title: "优惠券名称",
          align: "center",
          key: "couponName",
          minWidth: 80
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
                  <tag color="primary">{ couponFromConvert(row.couponFrom).label }</tag>
                </div>
              );
            } else if (row.couponFrom === "activity") {
              return (
                <div>
                  <tag color="pink">{ couponFromConvert(row.couponFrom).label }</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color="primary">N/A</tag>
                </div>
              );
            }
          }
        },
        {
          title: "获取时间",
          align: "center",
          key: "getTime",
          minWidth: 80
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
                  <tag color="error">
                    {couponUseStatusConvert(row.couponStatus).label}
                  </tag>
                </div>
              );
            } else if (row.couponStatus === "expired") {
              return (
                <div>
                  <tag color="default">
                    {couponUseStatusConvert(row.couponStatus).label}
                  </tag>
                </div>
              );
            } else if (row.couponStatus === "unused") {
              return (
                <div>
                  <tag color="primary">
                    {couponUseStatusConvert(row.couponStatus).label}
                  </tag>
                </div>
              );
            }
          }
        },
        {
          title: "使用时间",
          align: "center",
          key: "useTime",
          minWidth: 80
        },
        {
          title: "操作",
          minWidth: 80,
          key: "handle",
          options: ["delete"]
        }
      ]
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  computed: {
    couponFeeComputed() {
      return fenToYuanDot2Number(this.couponDetail.couponFee);
    },
    fullFeeComputed() {
      return fenToYuanDot2Number(this.couponDetail.fullFee);
    }
  },
  methods: {
    // 变化函数
    fullFeeOnchange(value) {
      this.couponDetail.fullFee = yuanToFenNumber(value);
    },
    couponFeeOnchange(value) {
      this.couponDetail.couponFee = yuanToFenNumber(value);
    },
    getTableData() {
      getCouponPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleSendCoupon(){
      // TODO:待实现
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.couponDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            this.createCoupon();
          } else if (this.tempModalType === this.modalType.edit) {
            this.editCoupon();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createCoupon() {
      this.modalViewLoading = true;
      createCoupon(this.couponDetail)
        .then(res => {
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    editCoupon() {
      this.modalViewLoading = true;
      editCoupon(this.couponDetail)
        .then(res => {
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    startTimeChange(value, date) {
      console.log("beginTime:", value);
      this.searchRowData.startTime = value;
    },
    endTimeChange(value, data) {
      console.log("endTime:", value);
      this.searchRowData.endTime = value;
    },
    handleStartTimeChange(value, date) {
      this.couponDetail.startTime = value;
    },
    handleEndTimeChange(value, data) {
      this.couponDetail.endTime = value;
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
        ids
      })
        .then(res => {
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
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
