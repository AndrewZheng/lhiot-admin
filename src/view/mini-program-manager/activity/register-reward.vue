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
        @on-sale="onOff"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-relevance="onRelevance"
      >
        <div slot="operations">
          <Button
            v-waves
            :loading="createLoading"
            type="success"
            class="mr5"
            @click="addRegisterReward"
          >
            <Icon type="md-add"/>创建
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash"/>删除
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

    <Modal v-model="modalEdit" :width="1000" style="z-index: 1000">
      <p slot="header">
        <i-col>{{ tempModalType==modalType.edit?'修改注册送礼优惠券活动':(tempModalType==modalType.create?'创建注册送礼优惠券活动': '注册送礼和优惠券模板关联') }}</i-col>
      </p>
      <div class="modal-content">
        <Row v-if="tempModalType == modalType.edit || tempModalType == modalType.create">
          <Form ref="modalEdit" :model="registerDetail" :rules="ruleInline" :label-width="80">
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

        <Row v-if="tempModalType == null ">
          <Row>
            <!-- 限时抢购只能添加一个关联商品，所以只有当关联商品为空时才显示 -->
            <Card>
              <tables
                ref="tables"
                v-model="couponTemplateDetail"
                :columns="templateColumns"
                :loading="tempTableLoading"
                border
                searchable
                search-place="top"
                @on-delete="modalHandleDelete"
                @on-inline-edit="modalHandleEdit"
                @on-inline-save="modalHandleSave"
                @on-select-all="onTemplateSelectionAll"
                @on-selection-change="onTemplateSelectionChange"
              >
                <div slot="searchCondition">
                  <Row>
                    <Input
                      v-model="searchTemplateRowData.couponName"
                      placeholder="优惠券名称"
                      class="search-input mr5"
                      style="width: auto"
                      clearable
                    ></Input>
                    <Select
                      v-model="searchTemplateRowData.couponType"
                      placeholder="优惠券类型"
                      style="padding-right: 5px;width: 100px"
                      clearable
                    >
                      <Option
                        v-for="(item,index) in couponTypeEnum"
                        :value="item.value"
                        :key="index"
                        class="ptb2-5"
                        style="padding-left: 5px;width: 100px"
                      >{{ item.label }}</Option>
                    </Select>
                    <Button
                      :loading="searchLoading"
                      class="search-btn mr5"
                      type="primary"
                      @click="handleTemplateSearch"
                    >
                      <Icon type="md-search"/>&nbsp;搜索
                    </Button>
                    <Button
                      v-waves
                      :loading="clearSearchLoading"
                      class="search-btn"
                      type="info"
                      @click="handleTemplateClear"
                    >
                      <Icon type="md-refresh"/>&nbsp;清除条件
                    </Button>
                  </Row>
                </div>
              </tables>

              <div style="margin: 10px;overflow: hidden">
                <Row type="flex" justify="end">
                  <Page
                    :total="couponTemplateTotal"
                    :current="searchTemplateRowData.page"
                    show-sizer
                    show-total
                    @on-change="changeTemplatePage"
                    @on-page-size-change="changeTemplatePageSize"
                  ></Page>
                </Row>
              </div>

              <Form
                ref="modalCreate"
                :model="addRelationDetail"
                :rules="relationRuleInline"
                :label-width="80"
              >
                <Row>
                  <Col span="5">
                    <FormItem label="单次发放数量:" prop="issuedNum">
                      <InputNumber
                        :min="0"
                        v-model="addRelationDetail.issuedNum"
                        class="ml20"
                        label="单次发放数量"
                      ></InputNumber>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem label="有效天数:" prop="effectiveDay">
                      <InputNumber
                        :min="0"
                        v-model="addRelationDetail.effectiveDay"
                        class="ml20"
                        label="有效天数"
                      ></InputNumber>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <Button
                      v-waves
                      :loading="addTempDataLoading"
                      span="4"
                      class="search-btn ml20"
                      type="primary"
                      @click="addTempData('modalCreate')"
                    >
                      <Icon type="md-add"/>&nbsp;关联优惠券模板
                    </Button>
                  </Col>
                </Row>
              </Form>*Tips：请先选择要关联的优惠券模板，然后输入关联配置信息，若关联多个优惠券模板，则所有的商品配置信息相同，添加完成后可在下方表格修改
            </Card>
          </Row>

          <Divider orientation="center">已关联优惠券模板</Divider>
          <tables
            :columns="relationColumns"
            v-model="relationDetail"
            :loading="tempTableLoading"
            border
            @on-delete="modalHandleDelete"
            @on-inline-edit="modalHandleEdit"
            @on-inline-save="modalHandleSave"
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定</Button>
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
  yuanToFenNumber
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
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRelationRowData: _.cloneDeep(relationRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      relationDetail: _.cloneDeep(relationDetail),
      registerDetail: _.cloneDeep(registerDetail),
      addRelationDetail: _.cloneDeep(relationDetail),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail),
      couponTemplateTotal: 0
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(relationRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(relationRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      // this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      // this.registerDetail.couponImage = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
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
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.registerDetail = _.cloneDeep(registerDetail);
      }
      this.modalEdit = true;
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
      this.resetFields();
      this.tempModalType = this.modalType.edit;
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
    onOff(params) {
      this.registerDetail = this._.cloneDeep(params.row);
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
    },
    endTimeChange(value, date) {
      this.registerDetail.endTime = value;
    },
    onRelevance(params) {
      // this.addRelationDetail = this._.addRelationDetail;
      this.tempModalType = null;
      // FIXME 查询商品规格分页信息（后期按钮触发，或者先存储，需要时再调用接口）
      this.getTemplateTableData();
      // 查询限时抢购关联商品
      this.searchRelationRowData.activityRegisterId = params.row.id;
      this.addRelationDetail.activityRegisterId = params.row.id;
      this.getRelationTableData();
      this.modalEdit = true;
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
          console.log(JSON.stringify(this.addRelationDetail));
          this.createRelation();
        } else {
          this.$Message.error("请完善信息!");
        }
      });
      // this.createFlashsaleProductRelation(this.addRelationDetail)
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
          this.relationDetail = this.relationDetail.filter(
            (item, index) => index !== params.row.initRowIndex
          );
          this.getRelationTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
    },
    getTemplateTableData() {
      this.loading = true;
      getCouponTemplatePages(this.searchTemplateRowData).then(res => {
        // if (this.menuData.length > 0) {
        // 现在对象是 PagerResultObject res.rows获取数据，如果是Pages res.array获取数据
        this.couponTemplateDetail = res.rows;
        this.couponTemplateTotal = res.total;
        this.loading = false;
        this.searchLoading = false;
        // }
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
      // 重置数据
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleTemplateSearch();
    },
    priceInputNumberOnchange(value) {
      this.addRelationDetail.price = yuanToFenNumber(value);
    },
    salePriceInputNumberOnchange(value) {
      this.addRelationDetail.salePrice = yuanToFenNumber(value);
    },
    createRelation() {
      this.modalViewLoading = true;
      createRegisterReward(this.addRelationDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getRelationTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    onTemplateSelectionChange(selection) {
      this.addRelationDetail.couponTemplateIds = selection
        .map(item => item.id.toString())
        .join(",");
      console.log(
        "商品选择变化,当前页选择couponTemplateIds:" +
          this.addRelationDetail.couponTemplateIds
      );
    },
    onTemplateSelectionAll(selection) {
      this.addRelationDetail.couponTemplateIds = selection
        .map(item => item.id.toString())
        .join(",");
      console.log(
        "商品选择变化,当前页选择couponTemplateIds:" +
          this.addRelationDetail.couponTemplateIds
      );
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
            this.relationDetail = res.rows;
          } else {
            this.relationDetail = null;
          }
          // this.total = res.total;
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
