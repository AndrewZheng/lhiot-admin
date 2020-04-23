<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="dataColumns"
        :loading="tempTableLoading"
        :search-area-column="16"
        :operate-area-column="8"
        editable
        searchable
        border
        @on-delete="handleDelete"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-sale="switchStatus"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Select
              v-model="searchRowData.packageType"
              placeholder="全部"
              style="padding-right: 5px;width: 100px"
            >
              <Option
                v-for="(item,index) in packageTypeEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Input
              v-model="searchRowData.packageName"
              placeholder="套餐名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
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
              <Icon type="md-refresh" />&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button
            v-waves
            :loading="createLoading"
            type="success"
            class="mr20"
            @click="addPackageTemplate"
          >
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
              <Icon type="md-trash" />删除
            </Button>
          </Poptip>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            :page-size="searchRowData.rows"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>
    <!-- 查看svip套餐详情 -->
    <Modal v-model="modalView" :width="800" draggable scrollable :mask-closable="false">
      <p slot="header">
        <span>查看SVIP套餐</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20 ml20">
          <i-col span="12">
            <Row>
              <i-col span="8">套餐类型:</i-col>
              <i-col span="16" v-if="addRelationDetail.packageType==='YEAR_CARD'">
                <tag color="orange">{{ "年卡" | vipStatusFilter }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.packageType==='MONTH_CARD'">
                <tag color="magenta">{{ "月卡" | vipStatusFilter }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.packageType==='SEASON'">
                <tag color="purple">{{ "季卡" | vipStatusFilter }}</tag>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20 ml20">
          <i-col span="12">
            <Row>
              <i-col span="8">套餐名称:</i-col>
              <i-col span="16">{{ addRelationDetail.packageName | vipStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20 ml20">
          <i-col span="12">
            <Row>
              <i-col span="8">套餐周期:</i-col>
              <i-col span="16">{{ addRelationDetail.packageCycle | vipStatusFilter }}天</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20 ml20">
          <i-col span="12">
            <Row>
              <i-col span="8">套餐金额:</i-col>
              <i-col span="16">¥{{ addRelationDetail.packageAmount | fenToYuanDot2Filterss }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20 ml20">
          <i-col span="12">
            <Row>
              <i-col span="8">新用户优惠价:</i-col>
              <i-col span="16">¥{{ addRelationDetail.discountAmount | fenToYuanDot2Filterss }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20 ml20">
          <i-col span="12">
            <Row>
              <i-col span="8">续费金额:</i-col>
              <i-col span="16">¥{{ addRelationDetail.renewalAmount | fenToYuanDot2Filterss }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20 ml20">
          <i-col span="12">
            <Row>
              <i-col span="8">活动状态:</i-col>
              <!-- <i-col span="16">{{ addRelationDetail.state | vipStatusFilter }}</i-col> -->
              <i-col span="16" v-if="addRelationDetail.state==='ON'">
                <tag color="success">{{ "开启" | vipStatusFilter }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.state==='OFF'">
                <tag color="error">{{ "关闭" | vipStatusFilter }}</tag>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20 ml20" v-if="addRelationDetail.packageDesc.length>0">
          <i-col span="12">
            <Row>
              <i-col span="8">套餐描述:</i-col>
              <i-col span="16">{{ addRelationDetail.packageDesc | vipStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <!-- 添加svip开卡活动 -->
    <Modal
      v-model="modalAdd"
      :width="1000"
      draggable
      scrollable
      @on-visible-change="handleModalAdd"
    >
      <p slot="header">
        <span>添加SVIP套餐</span>
      </p>
      <div class="modal-content">
        <Row>
          <Form
            ref="addForm"
            :model="addRelationDetail"
            :rules="distributionRuleInline"
            :label-width="100"
          >
            <Row>
              <i-col span="6">
                <FormItem label="套餐类型:" prop="packageType">
                  <Select
                    v-model="addRelationDetail.packageType"
                    placeholder="请选择"
                    style="padding-right: 5px;width: 120px"
                  >
                    <Option
                      v-for="(item,index) in packageTypeEnum"
                      :value="item.value"
                      :key="index"
                      class="ptb2-5"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="8">
                <FormItem
                  label="套餐名称:"
                  prop="packageName"
                  style="padding-right: 5px;width: 220px;"
                  clearable
                >
                  <Input v-model="addRelationDetail.packageName" placeholder="套餐名称"></Input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="套餐周期:" prop="packageCycle">
                  <Input
                    v-model="addRelationDetail.packageCycle"
                    style="padding-right: 5px;width: 120px;"
                    placeholder="套餐周期"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="套餐金额:" prop="packageAmount">
                  <InputNumber
                    :min="0"
                    :value="priceComputed"
                    @on-change="priceInputNumberOnchange"
                    style="padding-right: 5px;width: 115px;"
                  ></InputNumber>
                  <!-- <Input
                    v-model="addRelationDetail.packageAmount"
                    style="padding-right: 5px;width: 120px;"
                    placeholder="套餐金额"
                  ></Input>-->
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="新用户优惠价:" prop="discountAmount">
                  <!-- <Input
                    v-model="addRelationDetail.discountAmount"
                    style="padding-right: 5px;width: 120px;"
                    placeholder="新用户优惠价"
                  ></Input>-->
                  <InputNumber
                    :min="0"
                    :value="salePriceComputed"
                    @on-change="salePriceInputNumberOnchange"
                    style="padding-right: 5px;width: 115px;"
                  ></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="续费金额:" prop="renewalAmount">
                  <!-- <Input
                    v-model="addRelationDetail.renewalAmount"
                    style="padding-right: 5px;width: 120px;"
                    placeholder="续费金额"
                  ></Input>-->
                  <InputNumber
                    :min="0"
                    :value="svipPriceComputed"
                    @on-change="svipPriceInputNumberOnchange"
                    style="padding-right: 5px;width: 115px;"
                  ></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="活动状态:" prop="state">
                  <Select v-model="addRelationDetail.state" clearable style="width: 115px">
                    <Option
                      v-for="(item,index) in packageStatusEnum"
                      :value="item.value"
                      :key="index"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 115px"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="套餐描述:" prop="packageDesc">
                  <Input
                    v-model="addRelationDetail.packageDesc"
                    type="textarea"
                    :autosize="{minRows: 3,maxRows: 8}"
                    placeholder="请输入套餐描述"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleTemplateAdd">确定</Button>
      </div>
    </Modal>
    <!-- 修改优惠券 -->
    <Modal v-model="modalEdit" :mask-closable="false" :width="1000" draggable>
      <p slot="header">
        <i-col>修改优惠券配置</i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="addRelationDetail"
          :rules="distributionRuleInline"
          :label-width="100"
        >
          <Row>
            <i-col span="6">
              <FormItem label="套餐类型:" prop="packageType">
                <Select
                  v-model="addRelationDetail.packageType"
                  placeholder="请选择"
                  style="padding-right: 5px;width: 120px"
                >
                  <Option
                    v-for="(item,index) in packageTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="8">
              <FormItem
                label="套餐名称:"
                prop="packageName"
                style="padding-right: 5px;width: 220px;"
                clearable
              >
                <Input v-model="addRelationDetail.packageName" placeholder="套餐名称"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem label="套餐周期:" prop="packageCycle">
                <Input
                  v-model="addRelationDetail.packageCycle"
                  style="padding-right: 5px;width: 120px;"
                  placeholder="套餐周期"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem label="套餐金额:" prop="packageAmount">
                <!-- <Input
                  v-model="addRelationDetail.packageAmount"
                  style="padding-right: 5px;width: 120px;"
                  placeholder="套餐金额"
                ></Input>-->
                <InputNumber
                  :min="0"
                  :value="priceComputed"
                  @on-change="priceInputNumberOnchange"
                  style="padding-right: 5px;width: 115px;"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem label="新用户优惠价:" prop="discountAmount">
                <!-- <Input
                  v-model="addRelationDetail.discountAmount"
                  style="padding-right: 5px;width: 120px;"
                  placeholder="新用户优惠价"
                ></Input>-->
                <InputNumber
                  :min="0"
                  :value="salePriceComputed"
                  @on-change="salePriceInputNumberOnchange"
                  style="padding-right: 5px;width: 115px;"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem label="续费金额:" prop="renewalAmount">
                <!-- <Input
                  v-model="addRelationDetail.renewalAmount"
                  style="padding-right: 5px;width: 120px;"
                  placeholder="续费金额"
                ></Input>-->
                <InputNumber
                  :min="0"
                  :value="svipPriceComputed"
                  @on-change="svipPriceInputNumberOnchange"
                  style="padding-right: 5px;width: 115px;"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem label="活动状态:" prop="state">
                <Select v-model="addRelationDetail.state" clearable style="width: 115px">
                  <Option
                    v-for="(item,index) in packageStatusEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 115px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="套餐描述:" prop="packageDesc">
                <Input
                  v-model="addRelationDetail.packageDesc"
                  type="textarea"
                  :autosize="{minRows: 3,maxRows: 8}"
                  placeholder="请输入套餐描述"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleTemplateEdit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
import Tables from "_c/tables";
import IViewUpload from "_c/iview-upload";
import DragList from "_c/drag-list";
import _ from "lodash";
import {
  getSvipPackagePages,
  deleteSvipPackage,
  createSvipPackage,
  editSvipPackage
} from "@/api/mini-program";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  //   1.7
  packageTypeConvert,
  packageStatusConvert
} from "@/libs/converStatus";
import {
  //   1.7
  packageTypeEnum,
  packageStatusEnum
} from "@/libs/enumerate";
import {
  compareData,
  getSmallCouponActivity,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  replaceByTag,
  replaceByTab,
  addRnb,
  addDay
} from "@/libs/util";

const relationDetail = {
  id: 0,
  packageType: null, //套餐类型
  packageName: "", //套餐名称
  packageCycle: null, //套餐周期
  packageAmount: null, //套餐金额
  discountAmount: null, //新用户优惠价
  renewalAmount: null, //续费金额
  state: null, //活动状态
  packageDesc: "" //套餐描述
};

const couponTemplateDetail = {
  state: "OFF" //活动状态
};

const roleRowData = {
  page: 1,
  rows: 10
};

const templateRowData = {
  state: "OFF" //活动状态
};

const dataColumns = [
  {
    type: "selection",
    width: 60,
    align: "center",
    align: "center"
  },
  {
    title: "套餐类型",
    align: "center",
    key: "packageType",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.packageType === "MONTH_CARD") {
        return (
          <div>
            <tag color="magenta">
              {packageTypeConvert(row.packageType).label}
            </tag>
          </div>
        );
      } else if (row.packageType === "SEASON") {
        return (
          <div>
            <tag color="purple">
              {packageTypeConvert(row.packageType).label}
            </tag>
          </div>
        );
      } else if (row.packageType === "YEAR_CARD") {
        return (
          <div>
            <tag color="orange">
              {packageTypeConvert(row.packageType).label}
            </tag>
          </div>
        );
      }
      return <div>{row.packageType}</div>;
    },
    minWidth: 40
  },
  {
    title: "套餐名称",
    align: "center",
    key: "packageName"
  },
  {
    title: "套餐周期",
    align: "center",
    key: "packageCycle",
    render(h, params, vm) {
      const amount = addDay(params.row.packageCycle);
      return <div>{amount}</div>;
    }
  },
  {
    title: "套餐金额",
    key: "packageAmount",
    align: "center",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.packageAmount);
      return <div>{amount}</div>;
    }
  },
  {
    title: "新用户优惠价",
    align: "center",
    key: "discountAmount",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.discountAmount);
      return <div>{amount}</div>;
    },
    minWidth: 40
  },
  {
    title: "续费金额",
    align: "center",
    key: "renewalAmount",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.renewalAmount);
      return <div>{amount}</div>;
    }
  },
  {
    title: "套餐描述",
    align: "center",
    key: "packageDesc"
  },
  // {
  //   title: "活动状态",
  //   key: "state",
  //   render: (h, params, vm) => {
  //     const { row } = params;
  //     if (row.state === "ON") {
  //       return (
  //         <div>
  //           <tag color="success">{packageStatusConvert(row.state).label}</tag>
  //         </div>
  //       );
  //     } else if (row.state === "OFF") {
  //       return (
  //         <div>
  //           <tag color="error">{packageStatusConvert(row.state).label}</tag>
  //         </div>
  //       );
  //     }
  //     return <div>{row.state}</div>;
  //   }
  // },
  {
    title: "活动状态",
    align: "center",
    key: "state",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.state === "ON") {
        return (
          <div>
            <tag color="success">{packageStatusConvert(row.state).label}</tag>
          </div>
        );
      } else if (row.state === "OFF") {
        return (
          <div>
            <tag color="error">{packageStatusConvert(row.state).label}</tag>
          </div>
        );
      }
      return <div>{row.state}</div>;
    }
  },
  {
    title: "创建时间",
    align: "center",
    key: "createTime",
    minWidth: 70
  },
  {
    title: "修改时间",
    align: "center",
    key: "updateTime",
    minWidth: 70
  },
  {
    title: "创建人",
    align: "center",
    minWidth: 30,
    key: "createUser"
  },
  {
    title: "操作",
    align: "center",
    minWidth: 80,
    key: "handle",
    options: ["onSale", "view", "edit", "delete"]
  }
];

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  computed: {
    priceComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.packageAmount);
    },
    salePriceComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.discountAmount);
    },
    svipPriceComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.renewalAmount);
    }
  },
  data() {
    return {
      distributionRuleInline: {
        state: [{ required: true, message: "请选择活动状态" }],
        packageType: [{ required: true, message: "请选择套餐类型" }],
        packageName: [{ required: true, message: "请输入套餐名称" }],
        packageCycle: [{ required: true, message: "请输入套餐周期" }],
        packageAmount: [
          { required: true, message: "请输入套餐金额" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/([1-9]\d*(\.\d*[1-9])?)|(\d*[1-9])/.test(value)) {
                errors.push(new Error("必须为非零数"));
              }
              callback(errors);
            }
          }
        ],
        discountAmount: [
          { required: true, message: "请输入优惠金额" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/([1-9]\d*(\.\d*[1-9])?)|(\d*[1-9])/.test(value)) {
                errors.push(new Error("必须为非零数"));
              }
              callback(errors);
            }
          }
        ],
        renewalAmount: [
          { required: true, message: "请输入续费金额" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/([1-9]\d*(\.\d*[1-9])?)|(\d*[1-9])/.test(value)) {
                errors.push(new Error("必须为非零数"));
              }
              callback(errors);
            }
          }
        ],
        packageDesc: [
          { required: false, message: "" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 200) {
                errors.push(new Error("字数限制200字"));
              }
              callback(errors);
            }
          }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      packageTypeEnum,
      packageStatusEnum,
      dataColumns: dataColumns,
      templatePageOpts: [5, 10],
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      relationDetail: _.cloneDeep(relationDetail),
      addRelationDetail: _.cloneDeep(relationDetail),
      addRelationList: [],
      couponTemplateData: [],
      couponTemplateTotal: 0,
      modalAdd: false
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData); // 刷新清除上次搜索结果
    this.getTableData();
  },
  methods: {
    priceInputNumberOnchange(value) {
      this.addRelationDetail.packageAmount = yuanToFenNumber(value);
    },
    salePriceInputNumberOnchange(value) {
      this.addRelationDetail.discountAmount = yuanToFenNumber(value);
    },
    svipPriceInputNumberOnchange(value) {
      this.addRelationDetail.renewalAmount = yuanToFenNumber(value);
    },
    switchStatus(params) {
      this.addRelationDetail = _.cloneDeep(params.row);
      if (params.row.state === "ON") {
        this.addRelationDetail.state = "OFF";
      } else {
        this.addRelationDetail.state = "ON";
      }
      this.loading = true;
      this.editSvipPackage();
    },
    handleModalAdd(isShow) {
      // 先清除对象
      this.resetFields();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.addForm.resetFields();
      this.addRelationDetail = _.cloneDeep(relationDetail);
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.addRelationDetail = _.cloneDeep(params.row);
      this.replaceTextByTab();
      this.modalEdit = true;
    },
    getTableData() {
      getSvipPackagePages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
          this.year = res.rows;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    changeProductPage(page) {
      this.searchTemplateRowData.page = page;
      this.getSvipPackagePages();
    },
    changeProductPageSize(pageSize) {
      this.searchTemplateRowData.page = 1;
      this.searchTemplateRowData.rows = pageSize;
      this.getSvipPackagePages();
    },
    handleTemplateSearch() {
      this.searchTemplateRowData.page = 1;
      this.searchLoading = true;
      this.getSvipPackagePages();
    },
    handleTemplateClear() {
      this.clearSearchLoading = true;
      this.searchTemplateRowData = _.cloneDeep(templateRowData);
      this.handleTemplateSearch();
    },
    editSvipPackage() {
      // 编辑状态
      this.tempTableLoading = true;
      editSvipPackage(this.addRelationDetail)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success("修改成功!");
          this.getTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
    },
    replaceTextByTab() {
      // 编辑时处理下活动规则转换
      if (this.addRelationDetail.packageDesc) {
        this.addRelationDetail.packageDesc = replaceByTab(
          this.addRelationDetail.packageDesc
        );
      }
    },
    replaceTextByTag() {
      // 活动规则换行用“&”拼接
      if (this.addRelationDetail.packageDesc) {
        this.addRelationDetail.packageDesc = replaceByTag(
          this.addRelationDetail.packageDesc
        );
      }
    },
    handleTemplateEdit() {
      let _this = this;
      if (
        this.addRelationDetail.renewalAmount >
        this.addRelationDetail.packageAmount
      ) {
        this.$Message.error("续费金额不能大于套餐金额");
        return;
      }
      if (
        this.addRelationDetail.discountAmount >
        this.addRelationDetail.packageAmount
      ) {
        this.$Message.error("优惠金额不能大于套餐金额");
        return;
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          _this.replaceTextByTag();
          if (this.tempModalType === this.modalType.edit) {
            _this.editSvipPackage();
          }
        } else {
          _this.$Message.error("请完善信息!");
        }
      });
    },
    handleTemplateAdd() {
      let _this = this;
      if (_this.addRelationDetail.packageName == "") {
        _this.$Message.error("请完善信息!");
        return false;
      }
      if (
        this.addRelationDetail.renewalAmount >
        this.addRelationDetail.packageAmount
      ) {
        this.$Message.error("续费金额不能大于套餐金额");
        return;
      }
      if (
        this.addRelationDetail.discountAmount >
        this.addRelationDetail.packageAmount
      ) {
        this.$Message.error("优惠金额不能大于套餐金额");
        return;
      }
      this.$refs.addForm.validate(valid => {
        console.log(this.$refs.addForm)
        if (valid) {
          _this.replaceTextByTag();
          _this.createRelation();
        } else {
          _this.$Message.error("请完善信息!");
        }
      });
    },
    //  getSvipPackagePages(this.searchRowData).then(res => {
    //   let svipPages = res.rows;
    //   svipPages.forEach(item => {
    // console.log(item.packageType)
    // if (
    //   // item.packageType.indexOf("SEASON") != null ||
    //   // item.packageType.indexOf("YEAR_CARD") != -1 ||
    //   // item.packageType.indexOf("MONTH_CARD") != -1
    //   item.packageType.length >= 3
    // ) {
    //   this.$Message.error("相同的套餐类型配置只能开启1个");
    //   return;
    // } else {
    //   this.tempModalType = "addTemplate";
    //   this.modalAdd = true;
    // }
    // });
    // });
    createRelation() {
      this.modalViewLoading = true;
      createSvipPackage(this.addRelationDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    createFreightRelation() {
      this.modalViewLoading = true;
      createSvipPackage(this.addRelationDetail)
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
    addPackageTemplate() {
      getSvipPackagePages(this.searchRowData).then(res => {
        let svipPages = res.rows;
        //   svipPages.forEach(item => {
        // console.log(item.packageType)
        // });
        console.log(svipPages)
      });
      this.modalAdd = true;
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.addRelationDetail = _.cloneDeep(params.row);
      this.replaceTextByTab();
      this.modalView = true;
    },
    handleAddClose() {
      this.modalAdd = false;
    },
    // 批量删除-单行删除内部也是调用此方法
    deleteTable(ids) {
      this.tempTableLoading = true;
      deleteSvipPackage({ ids })
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
        .finally(res => {
          this.tempTableLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
