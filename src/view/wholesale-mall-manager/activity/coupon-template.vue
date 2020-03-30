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
        @on-edit="handleEdit"
        @on-sale="handleStatus"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <!--  @on-delete="handleDelete" -->
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.couponName"
              placeholder="优惠券名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.couponType"
              class="search-col mr5"
              placeholder="模板类型"
              style="width: 150px"
              clearable
            >
              <Option
                v-for="item in couponTemplateTypeEnum"
                :value="item.value"
                :key="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.vaild"
              class="search-col mr5"
              placeholder="优惠券状态"
              style="width: 150px"
              clearable
            >
              <Option
                v-for="item in activityStatusEnum"
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
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="handleCreate">
            <Icon type="md-add" />添加
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

    <Modal v-model="modalEdit" :mask-closable="false" :z-index="1000">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改优惠券':'创建优惠券' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="couponTemplate" :rules="ruleInline" :label-width="100">
          <Row>
            <i-col span="22">
              <FormItem label="优惠券名称:" prop="couponName">
                <Input v-model="couponTemplate.couponName" placeholder="请输入优惠券名称..."></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="模板类型:" prop="couponType" style="width:200px;">
                <Select v-model="couponTemplate.couponType">
                  <Option
                    v-for="(item,index) in couponTemplateTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100%"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="优惠券状态:" prop="vaild" style="width:200px;">
                <Select v-model="couponTemplate.vaild">
                  <Option
                    v-for="(item,index) in activityStatusEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100%"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="满减金额:" prop="fullFee">
                <InputNumber :min="0" :value="fullFeeComputed" @on-change="fullFeeOnchange"></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="优惠金额:" prop="couponFee">
                <InputNumber :min="0" :value="couponFeeComputed" @on-change="couponFeeOnchange"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
        </Form>
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
  getCouponTemplatePages,
  deletCouponTemplate,
  editCouponTemplate,
  createCouponTemplate
} from "@/api/wholesale";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  activityTypeEnum,
  couponTemplateTypeEnum,
  activityStatusEnum
} from "@/libs/enumerate";
import {
  activityStatusConvert,
  activityTypeConvert,
  couponTemplateTypeConvert
} from "@/libs/converStatus";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from "@/libs/util";

const couponTemplate = {
  id: 0,
  activityCode: "",
  activityDesc: "",
  linkUrl: "",
  vaild: "",
  endTime: null,
  startTime: null,
  couponFee: 0,
  couponName: "",
  couponType: "", // allgoods-全品类 singlegoods-单品
  fullFee: 0
};

const roleRowData = {
  activityCode: null,
  activityDesc: null,
  vaild: "",
  endTime: null,
  startTime: null,
  page: 1,
  rows: 20
};

export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      activityTypeEnum,
      templatePageOpts: [20, 50],
      activityStatusEnum,
      couponTemplateTypeEnum,
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      couponTemplate: _.cloneDeep(couponTemplate),
      ruleInline: {
        couponType: [{ required: true, message: "请选择活动类型" }],
        couponFee: [
          { required: true, message: "请输入优惠金额" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        fullFee: [
          { required: true, message: "请输入满减金额" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        vaild: [{ required: true, message: "请选择活动状态" }]
      },
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
          title: "优惠券名称",
          align: "center",
          key: "couponName",
          minWidth: 150
        },
        {
          title: "满减金额",
          align: "center",
          minWidth: 60,
          key: "fullFee",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.fullFee);
            return <div>{amount}</div>;
          }
        },
        {
          title: "优惠金额",
          align: "center",
          minWidth: 60,
          key: "couponFee",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.couponFee);
            return <div>{amount}</div>;
          }
        },
        {
          title: "模板类型",
          align: "center",
          key: "couponType",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponType === "allgoods") {
              return (
                <div>
                  <tag color="primary">全品类</tag>
                </div>
              );
            } else if (row.couponType === "singlegoods") {
              return (
                <div>
                  <tag color="pink">单品</tag>
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
          title: "优惠券状态",
          align: "center",
          key: "vaild",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.vaild === "yes") {
              return (
                <div>
                  <tag color="success">有效</tag>
                </div>
              );
            } else if (row.vaild === "no") {
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
          }
        },
        {
          title: "操作",
          align: "center",
          minWidth: 80,
          key: "handle",
          options: ["onSale", "edit"]
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
      return fenToYuanDot2Number(this.couponTemplate.couponFee);
    },
    fullFeeComputed() {
      return fenToYuanDot2Number(this.couponTemplate.fullFee);
    }
  },
  methods: {
    // 变化函数
    fullFeeOnchange(value) {
      this.couponTemplate.fullFee = yuanToFenNumber(value);
    },
    couponFeeOnchange(value) {
      this.couponTemplate.couponFee = yuanToFenNumber(value);
    },
    getTableData() {
      getCouponTemplatePages(this.searchRowData)
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
    handleCreate() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.couponTemplate = _.cloneDeep(couponTemplate);
      }
      this.modalEdit = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.couponTemplate = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleStatus(params) {
      this.couponTemplate = _.cloneDeep(params.row);
      this.couponTemplate.vaild = params.row.vaild === "yes" ? "no" : "yes";
      this.editCouponTemplate();
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.createCouponTemplate();
          } else if (this.isEdit) {
            this.editCouponTemplate();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createCouponTemplate() {
      this.modalViewLoading = true;
      createCouponTemplate(this.couponTemplate)
        .then(res => {
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    editCouponTemplate() {
      this.modalViewLoading = true;
      editCouponTemplate(this.couponTemplate)
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
      this.couponTemplate.startTime = value;
    },
    handleEndTimeChange(value, data) {
      this.couponTemplate.endTime = value;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
      this.couponTemplate.storeImage = null;
    },
    deleteTable(ids) {
      this.loading = true;
      deletCouponTemplate({
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
