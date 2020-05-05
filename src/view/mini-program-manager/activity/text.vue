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
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-sale="switchStatus"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-relevance="handleSetting"
      >
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="addRegisterReward">
            <Icon type="md-add" />添加
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

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>注册送礼活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动ID:</i-col>
              <i-col span="18">{{ registerDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">{{ registerDetail.activityName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动规则:</i-col>
              <i-col span="18">
                <Input
                  :v-if="registerDetail.activityRule"
                  :rows="6"
                  :value="registerDetail.activityRule"
                  type="textarea"
                ></Input>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col span="18">{{ registerDetail.onOff | imageStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">{{ registerDetail.beginTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">{{ registerDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建人:</i-col>
              <i-col span="18">{{ registerDetail.createBy }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建时间:</i-col>
              <i-col span="18">{{ registerDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :width="1200" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType === modalType.edit?'修改注册送礼优惠券活动': '创建注册送礼优惠券活动'}}</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <Form ref="editForm" :model="registerDetail" :rules="ruleInline" :label-width="80">
            <Row>
              <Col span="18">
                <FormItem label="活动名称:" prop="activityName">
                  <Input v-model="registerDetail.activityName"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="活动规则:" prop="activityRule">
                  <Input
                    v-model="registerDetail.activityRule"
                    :rows="6"
                    placeholder="活动规则"
                    type="textarea"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="活动状态:" prop="onOff">
                  <Select v-model="registerDetail.onOff" clearable style="width: 170px">
                    <Option
                      v-for="(item,index) in imageStatusEnum"
                      :value="item.value"
                      :key="index"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 170px"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="有效期起:" prop="beginTime">
                  <DatePicker
                    v-model="registerDetail.beginTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期起"
                    class="search-input"
                    style="width: 170px"
                    @on-change="beginTimeChange"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="有效期止:" prop="endTime">
                  <DatePicker
                    v-model="registerDetail.endTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期止"
                    class="search-input"
                    style="width: 170px"
                    @on-change="endTimeChange"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
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
  getRegisterPages,
  deleteRegister,
  createRegister,
  editRegister,
  deleteRegisterReward,
  getRegisterRewardPages,
  editRegisterReward,
  createRegisterReward,
  getCouponTemplatePages
} from "@/api/mini-program";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  couponStatusConvert,
  couponTypeConvert,
  imageStatusConvert,
  couponScopeConvert
} from "@/libs/converStatus";
import {
  couponStatusEnum,
  couponTypeEnum,
  imageStatusEnum
} from "@/libs/enumerate";
import {
  compareData,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  setSmallCouponActivity,
} from "@/libs/util";

const registerDetail = {
  formBeginTime: null,
  formEndTime: null,
  id: 0,
  activityId: 0,
  beginTime: null,
  endTime: null,
  onOff: null,
  activityName: "",
  activityRule: "",
  createTime: null,
  updateTime: null,
  createBy: ""
};

const relationDetail = {
  couponName: "",
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: "",
  couponType: null,
  id: 0,
  activityRegisterId: 0,
  couponTemplateId: 0,
  issuedNum: 0,
  effectiveDay: 0,
  createTime: null,
  createBy: "",
  couponTemplateIds: ""
};

const roleRowData = {
  page: 1,
  rows: 10
};

const relationRowData = {
  activityRegisterId: 0,
  page: 1,
  rows: 10
};

const templateRowData = {
  couponName: null,
  couponType: null,
  couponStatus: null,
  page: 1,
  rows: 5
};

const templateColumns = [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "优惠券名称",
    key: "couponName",
    minWidth: 80
  },
  {
    title: "优惠券类型",
    key: "couponType",
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === "FULL_CUT_COUPON") {
        return (
          <div>
            <tag color="magenta">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "DISCOUNT_COUPON") {
        return (
          <div>
            <tag color="orange">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "CASH_COUPON") {
        return (
          <div>
            <tag color="cyan">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    }
  },
  {
    title: "优惠金额",
    key: "couponFee",
    minWidth: 80,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.couponFee)}</div>;
    }
  },
  {
    title: "最小购买金额",
    key: "minBuyFee",
    minWidth: 80,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
    }
  },
  {
    title: "优惠券状态",
    key: "couponStatus",
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponStatus === "VALID") {
        return (
          <div>
            <tag color="success">
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      } else if (row.couponStatus === "INVALID") {
        return (
          <div>
            <tag color="error">
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      }
      return <div>{row.couponStatus}</div>;
    }
  },
  {
    title: "优惠券图片",
    key: "couponImage",
    minWidth: 60,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.couponImage} height="60" width="60" />;
      return <div>{str}</div>;
    }
  },
  {
    title: "使用范围",
    key: "couponScope",
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponScope === "STORE") {
        return (
          <div>
            <tag color="magenta">
              {couponScopeConvert(row.couponScope).label}
            </tag>
          </div>
        );
      } else if (row.couponScope === "STORE_AND_SMALL") {
        return (
          <div>
            <tag color="orange">
              {couponScopeConvert(row.couponScope).label}
            </tag>
          </div>
        );
      } else if (row.couponScope === "SMALL") {
        return (
          <div>
            <tag color="cyan">{couponScopeConvert(row.couponScope).label}</tag>
          </div>
        );
      }
      return <div>{row.couponScope}</div>;
    }
  }
];

const relationTempColumns = [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "优惠券名称",
    key: "couponName"
  },
  {
    title: "优惠券类型",
    key: "couponType",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === "FULL_CUT_COUPON") {
        return (
          <div>
            <tag color="magenta">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "DISCOUNT_COUPON") {
        return (
          <div>
            <tag color="orange">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "CASH_COUPON") {
        return (
          <div>
            <tag color="cyan">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="error">{row.couponType}</tag>
        </div>
      );
    }
  },
  {
    title: "优惠金额",
    key: "couponFee"
  },
  {
    title: "优惠/折扣额度",
    key: "minBuyFee"
  },
  {
    title: "优惠券状态",
    key: "couponStatus",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponStatus === "VALID") {
        return (
          <div>
            <tag color="success">
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      } else if (row.couponStatus === "INVALID") {
        return (
          <div>
            <tag color="error">
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">{row.couponStatus}</tag>
        </div>
      );
    }
  },
  {
    title: "优惠券图片",
    key: "couponImage",
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.couponImage} width="100%" />;
      return <div>{str}</div>;
    }
  },
  {
    title: "单次发放数量",
    key: "issuedNum",
    render: (h, params) => {
      if (params.row.isEdit) {
        return h("div", [
          h("InputNumber", {
            domProps: {
              value: params.row.issuedNum
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.issuedNum = event;
                }
              }
            }
          })
        ]);
      } else {
        return h("div", params.row.issuedNum);
      }
    }
  },
  {
    title: "有效天数",
    key: "effectiveDay",
    render: (h, params) => {
      if (params.row.isEdit) {
        return h("div", [
          h("InputNumber", {
            domProps: {
              value: params.row.effectiveDay
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.effectiveDay = event;
                }
              }
            }
          })
        ]);
      } else {
        return h("div", params.row.effectiveDay);
      }
    }
  },
  {
    title: "创建人",
    key: "createBy"
  }
];

const couponTemplateDetail = {
  id: 0,
  couponName: "",
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: "",
  createUser: "",
  createTime: null,
  couponRules: "",
  couponScope: null
};

export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        activityName: [{ required: true, message: "请输入活动名称" }],
        activityRule: [{ required: true, message: "请输入活动规则" }],
        onOff: [{ required: true, message: "请选择活动状态" }],
        beginTime: [{ required: true, message: "请选择活动开始时间" }],
        endTime: [{ required: true, message: "请选择活动结束时间" }]
      },
      relationRuleInline: {
        issuedNum: [
          { required: true, message: "请输入发券限制数量" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            }
          }
        ],
        effectiveDay: [
          { required: true, message: "请输入发券限制数量" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            }
          }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      templatePageOpts: [5, 10],
      couponStatusEnum,
      couponTypeEnum,
      imageStatusEnum,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "id",
          key: "id"
        },
        {
          title: "活动名称",
          key: "activityName"
        },
        {
          title: "活动规则",
          key: "activityRule",
          tooltips: true
        },
        {
          title: "开始时间",
          key: "beginTime"
        },
        {
          title: "结束时间",
          key: "endTime"
        },
        {
          title: "优惠券状态",
          key: "onOff",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.onOff === "ON") {
              return (
                <div>
                  <tag color="success">
                    {imageStatusConvert(row.onOff).label}
                  </tag>
                </div>
              );
            } else if (row.onOff === "OFF") {
              return (
                <div>
                  <tag color="error">{imageStatusConvert(row.onOff).label}</tag>
                </div>
              );
            }
            return <div>{row.onOff}</div>;
          }
        },
        {
          title: "创建人",
          key: "createBy"
        },
        {
          title: "操作",
          minWidth: 80,
          key: "handle",
          options: ["onSale", "view", "edit", "delete", "settings"]
        }
      ],
      relationColumns: [
        ...relationTempColumns,
        {
          title: "操作",
          minWidth: 80,
          key: "handle",
          options: ["inlineEdit", "delete"]
        }
      ],
      templateColumns: _.cloneDeep(templateColumns),
      addTempDataLoading: false,
      tempTableLoading: false,
      templateLoading: false,
      modalViewLoading: false,
      modalRelation: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRelationRowData: _.cloneDeep(relationRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      relationDetail: _.cloneDeep(relationDetail),
      relationDatas: [],
      registerDetail: _.cloneDeep(registerDetail),
      addRelationDetail: _.cloneDeep(relationDetail),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail),
      couponTemplates: [],
      couponTemplateTotal: 0
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRelationRowData = _.cloneDeep(relationRowData);
      this.getTableData();
    },
    resetFields() {
      if (this.tempModalType == null) {
        this.$refs.modalCreate.resetFields();
      }
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (
            compareData(
              this.registerDetail.beginTime,
              this.registerDetail.endTime
            )
          ) {
            this.$Message.error("结束时间必须大于开始时间!");
            return;
          }
          // 活动规则换行用“&”拼接
          if (
            this.registerDetail.activityRule !== null ||
            this.registerDetail.activityRule !== ""
          ) {
            this.registerDetail.activityRule = this.registerDetail.activityRule.replace(
              /\n|\r/g,
              "&"
            );
          }
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createRegister();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editRegister();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createRegister() {
      this.modalViewLoading = true;
      createRegister(this.registerDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editRegister() {
      this.modalViewLoading = true;
      // UTC通用时间标准 2019-06-19T16:00:00.000Z转换为正常格式
      if (this.registerDetail.beginTime.indexOf("T") > -1) {
        this.registerDetail.beginTime = this.$moment(
          this.registerDetail.beginTime
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      if (this.registerDetail.endTime.indexOf("T") > -1) {
        this.registerDetail.endTime = this.$moment(
          this.registerDetail.endTime
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      editRegister(this.registerDetail)
        .then(res => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addRegisterReward() {
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.registerDetail = _.cloneDeep(registerDetail);
      }
      this.resetFields();
      this.modalEdit = true;
    },
    handleSetting(params) {
      var rows = params.row;
      setSmallCouponActivity(rows);
      this.turnToPage({
        name: "small-vip-activities-associated"
      });
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    deleteTable(ids) {
      this.loading = true;
      deleteRegister({
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
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.registerDetail = _.cloneDeep(params.row);
      this.registerDetail.activityRule = this.registerDetail.activityRule.replace(
        /&/g,
        "\n"
      );
      this.modalView = true;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.resetFields();
      this.registerDetail = _.cloneDeep(params.row);
      this.registerDetail.activityRule = this.registerDetail.activityRule.replace(
        /&/g,
        "\n"
      );
      this.modalEdit = true;
    },
    getTableData() {
      getRegisterPages(this.searchRowData)
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
    switchStatus(params) {
      this.registerDetail = _.cloneDeep(params.row);
      if (params.row.onOff === "ON") {
        this.registerDetail.onOff = "OFF";
      } else {
        this.registerDetail.onOff = "ON";
      }
      this.loading = true;
      this.editRegister();
    },
    beginTimeChange(value, date) {
      this.registerDetail.beginTime = value;
      if (this.registerDetail.beginTime.indexOf("T") > -1) {
        this.registerDetail.beginTime = this.$moment(
          this.registerDetail.beginTime
        ).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    endTimeChange(value, date) {
      this.registerDetail.endTime = value;
      if (this.registerDetail.endTime.indexOf("T") > -1) {
        this.registerDetail.endTime = this.$moment(
          this.registerDetail.endTime
        ).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    addTempData(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const activityRegisterId = this.addRelationDetail.activityRegisterId;
          const couponTemplateIds = this.addRelationDetail.couponTemplateIds.split(
            ","
          );
          if (activityRegisterId === 0 || activityRegisterId === "") {
            this.$Message.error("注册送优惠券活动不能为空!");
            return;
          } else if (
            couponTemplateIds.length === 0 ||
            this.addRelationDetail.couponTemplateIds === ""
          ) {
            this.$Message.error("请选择要关联的优惠券模板!");
            return;
          }
          console.log(
            "realtion couponTemplate",
            JSON.stringify(this.addRelationDetail)
          );
          this.createRelation();
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    modalHandleEdit(params) {
      this.$set(params.row, "isEdit", true);
    },
    modalHandleSave(params) {
      const row = params.row;
      if (
        row.id == null ||
        row.id == 0 ||
        row.salePrice <= 0 ||
        row.goodsLimit <= 0 ||
        row.userLimit <= 0
      ) {
        this.$Message.error("请输入非0数");
        return;
      } else if (row.remainCount > row.goodsLimit) {
        this.$Message.error("限时数量不能大于商品总数量");
        return;
      }
      this.tempTableLoading = true;
      // 如果前端没有剩余数量字段,则初始化剩余数量=商品数量
      // row.remainCount = row.goodsLimit;
      editRegisterReward(row)
        .then(res => {
          this.getRelationTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
      this.tempTableLoading = false;
      this.$set(params.row, "isEdit", false);
      // console.log('modalHandleSave' + JSON.stringify(params.row));
    },
    modalHandleDelete(params) {
      this.tempTableLoading = true;
      deleteRegisterReward({ ids: params.row.id })
        .then(res => {
          this.relationDatas = this.relationDatas.filter(
            (item, index) => index !== params.row.initRowIndex
          );
          this.getRelationTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
    },
    getTemplateTableData() {
      this.templateLoading = true;
      getCouponTemplatePages(this.searchTemplateRowData).then(res => {
        this.couponTemplates = res.rows;
        this.couponTemplateTotal = res.total;
        this.templateLoading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    changeTemplatePage(page) {
      this.searchTemplateRowData.page = page;
      this.getTemplateTableData();
    },
    changeTemplatePageSize(pageSize) {
      this.searchTemplateRowData.page = 1;
      this.searchTemplateRowData.rows = pageSize;
      this.getTemplateTableData();
    },
    handleTemplateSearch() {
      this.searchTemplateRowData.page = 1;
      this.searchLoading = true;
      this.getTemplateTableData();
    },
    handleTemplateClear() {
      this.clearSearchLoading = true;
      this.searchTemplateRowData = _.cloneDeep(templateRowData);
      this.handleTemplateSearch();
    },
    createRelation() {
      this.modalViewLoading = true;
      createRegisterReward(this.addRelationDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalRelation = false;
          this.$Message.success("创建成功!");
          this.getRelationTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalRelation = false;
        });
    },
    onTemplateSelectionChange(selection) {
      this.addRelationDetail.couponTemplateIds = selection
        .map(item => item.id.toString())
        .join(",");
    },
    onTemplateSelectionAll(selection) {
      this.addRelationDetail.couponTemplateIds = selection
        .map(item => item.id.toString())
        .join(",");
    },
    priceInputNumberOnchange(value) {
      this.addRelationDetail.price = yuanToFenNumber(value);
    },
    salePriceInputNumberOnchange(value) {
      this.addRelationDetail.salePrice = yuanToFenNumber(value);
    },
    effectiveStartTimeChange(value, date) {
      this.addRelationDetail.effectiveStartTime = value;
    },
    effectiveEndTimeChange(value, date) {
      this.addRelationDetail.effectiveEndTime = value;
    },
    getRelationTableData() {
      getRegisterRewardPages(this.searchRelationRowData)
        .then(res => {
          // 设置行是否可编辑
          if (res.rows.length !== 0) {
            res.rows.forEach(element => {
              element.isEdit = false;
            });
            this.relationDatas = res.rows;
          }
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
