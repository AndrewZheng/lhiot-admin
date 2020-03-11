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
        @on-edit="handleEdit"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="operations">
          <Button
            v-waves
            v-show="showBack"
            class="search-btn ml5 mr5"
            type="primary"
            @click="goBack"
          >
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
          <Button v-waves type="success" class="mr5" @click="handleCreate">
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

    <Modal
      v-model="modalEdit"
      :width="isCreate?1300:600"
      :z-index="1000"
      :mask-closable="false"
      title="关联商品规格"
    >
      <div class="modal-content">
        <Card v-show="isCreate">
          <tables
            ref="tables"
            v-model="configTableData"
            :columns="standardColumns"
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
                  v-model="searchConfigRowData.barCode"
                  placeholder="商品条码"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Input
                  v-model="searchConfigRowData.goodsName"
                  placeholder="商品名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Select
                  v-model="searchConfigRowData.vaild"
                  class="search-col"
                  placeholder="上架状态"
                  style="width:100px"
                  clearable
                >
                  <Option
                    v-for="item in vaild"
                    :value="item.value"
                    :key="item.value"
                    class="ptb2-5"
                  >{{ item.label }}</Option>
                </Select>
                <!-- <Select
                  v-model="searchConfigRowData.isVip"
                  class="ml5"
                  placeholder="是否VIP商品"
                  style="width:100px"
                  clearable
                >
                  <Option
                    v-for="item in vipEnum"
                    :value="item.value"
                    :key="item.value"
                    class="ptb2-5"
                  >{{ item.label }}</Option>
                </Select>-->
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
                :page-size="searchConfigRowData.rows"
                :page-size-opts="templatePageOpts"
                show-sizer
                show-total
                @on-change="changeConfigPage"
                @on-page-size-change="changeConfigPageSize"
              ></Page>
            </Row>
          </div>
        </Card>

        <Divider v-show="isCreate" orientation="center">配置抢购信息</Divider>

        <Row class="mt10">
          <Form ref="editForm" :model="flashsaleGoods" :rules="ruleInline" :label-width="80">
            <Row v-show="isEdit">
              <i-col span="12">
                <FormItem label="商品名称:" prop="goodsName">{{ flashsaleGoods.goodsName }}</FormItem>
              </i-col>
              <i-col span="12">
                <FormItem
                  label="商品价格:"
                  prop="price"
                >{{ flashsaleGoods.price | fenToYuanDot2Filters }}</FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="抢购价:" prop="specialPrice">
                  <InputNumber
                    :min="0"
                    :value="specialPriceComputed"
                    @on-change="specialPriceChange"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="抢购库存:" prop="goodsStock">
                  <InputNumber v-model="flashsaleGoods.goodsStock"></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="限购数:" prop="limitQuantity">
                  <InputNumber v-model="flashsaleGoods.limitQuantity"></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="排序:" prop="rankNum">
                  <InputNumber v-model="flashsaleGoods.rankNum"></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <div v-show="isCreate" class="ml15 brand-red">* 批量关联多个商品规格时，初始化配置信息都一样</div>
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
import {
  getFlashsaleGoodsPages,
  getProductStandardsPages,
  deleteFlashsaleGoods,
  createFlashsaleGoods,
  editFlashsaleGoods
} from "@/api/wholesale";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  couponStatusConvert,
  couponTypeConvert,
  imageStatusConvert,
  couponScopeConvert,
  receiveTypeConvert,
  couponFromConvert,
  pfExpandTypeConvert
} from "@/libs/converStatus";
import {
  couponStatusEnum,
  couponTypeEnum,
  imageStatusEnum,
  receiveTypeEnum,
  couponFromEnum,
  pfExpandTypeEnum
} from "@/libs/enumerate";
import {
  compareData,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  setSmallCouponActivity,
  getActivity
} from "@/libs/util";

const flashsaleGoods = {
  activityId: 0,
  baseUnit: "",
  goodsId: 0,
  goodsImage: "",
  goodsName: "",
  goodsStandardId: 0,
  goodsStock: 0,
  goodsUnit: "",
  id: 0,
  limitQuantity: 0,
  price: 0,
  progress: "",
  rankNum: 0,
  remain: 0,
  specialPrice: 0,
  standardIds: ""
};

const roleRowData = {
  activityId: null,
  page: 1,
  rows: 10,
  sidx: "id",
  sort: "desc"
};

const productStandardDetail = {
  barCode: "",
  unitName: "",
  categoryName: "",
  goodsCode: "",
  goodsId: 0,
  goodsImage: null,
  goodsName: "",
  goodsPriceRegionList: [], // 商品价格区间
  goodsUnit: "",
  hdSkuId: "",
  id: 0,
  isVip: "",
  netWeight: 0, // 商品净重
  price: 0,
  purchasePrice: 0,
  standard: "",
  standardDesc: "",
  unitCode: "",
  vaild: "",
  weight: 0,
  rank: 0, // 先保留后续扩展
  baseProductName: "" // 先保留可扩展
};

const standardRoleRowData = {
  goodsId: "",
  barCode: "",
  goodsCode: "",
  goodsName: "",
  goodsType: "FLASHSALE",
  vaild: "",
  page: 1,
  rows: 5
};

const activityDetail = {
  id: 0,
  activityCode: "",
  activityDesc: "",
  activityType: "",
  linkUrl: "",
  vaild: "",
  endTime: null,
  startTime: null
};

const standardColumns = [
  {
    type: "selection",
    key: "",
    minWidth: 50,
    align: "center",
    fixed: "left"
  },
  {
    title: "规格ID",
    align: "center",
    key: "id",
    minWidth: 50
  },
  {
    title: "商品条码",
    align: "center",
    key: "barCode",
    minWidth: 70
  },
  {
    title: "商品名称",
    align: "center",
    key: "standardGoodsName",
    minWidth: 100
  },
  {
    title: "商品图片",
    key: "goodsImage",
    align: "center",
    minWidth: 120,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.goodsImage} height="60" width="60" />;
      return <div>{str}</div>;
    }
  },
  {
    title: "商品规格",
    align: "center",
    key: "standardDesc",
    minWidth: 80
  },
  {
    title: "商品单位",
    align: "center",
    minWidth: 80,
    key: "goodsUnit"
  },
  {
    title: "商品原价",
    align: "center",
    minWidth: 60,
    key: "price",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: "进货价",
    align: "center",
    minWidth: 60,
    key: "purchasePrice",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.purchasePrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: "商品类型",
    minWidth: 80,
    key: "goodsType",
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.goodsType == "NORMAL") {
        return (
          <div>
            <tag color="cyan">{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      } else if (row.goodsType == "VIP") {
        return (
          <div>
            <tag color="orange">{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      } else if (row.goodsType == "FLASHSALE") {
      }
      return (
        <div>
          <tag color="blue">{pfExpandTypeConvert(row.goodsType).label}</tag>
        </div>
      );
      return (
        <div>
          <tag color="primary">N/A</tag>
        </div>
      );
    }
  },
  {
    title: "商品状态",
    minWidth: 80,
    key: "vaild",
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.vaild === "yes") {
        return (
          <div>
            <tag color="success">上架</tag>
          </div>
        );
      } else if (row.vaild === "no") {
        return (
          <div>
            <tag color="error">下架</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">N/A</tag>
        </div>
      );
    }
  }
];

const flashsaleColumns = [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "ID",
    align: "center",
    key: "id"
  },
  {
    title: "商品名称",
    align: "center",
    key: "goodsName",
    minWidth: 100
  },
  {
    title: "商品原价",
    align: "center",
    minWidth: 60,
    key: "price",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: "抢购价",
    align: "center",
    minWidth: 60,
    key: "specialPrice",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.specialPrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: "抢购库存",
    align: "center",
    key: "goodsStock",
    minWidth: 40
  },
  {
    title: "剩余数量",
    align: "center",
    key: "remain",
    minWidth: 40
  },
  {
    title: "限购数",
    align: "center",
    key: "limitQuantity",
    minWidth: 40
  },
  {
    title: "排序",
    align: "center",
    key: "rankNum",
    minWidth: 40
  },
  {
    title: "操作",
    minWidth: 80,
    key: "handle",
    options: ["edit", "delete"]
  }
];

export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        specialPrice: [{ required: true, message: "请输入抢购价" }],
        goodsStock: [{ required: true, message: "请输入抢购库存" }],
        limitQuantity: [{ required: true, message: "请输入每人限购数量" }],
        standardIds: [{ required: false, message: "请先关联商品规格" }]
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
      vipEnum: [
        {
          label: "是",
          value: "yes"
        },
        {
          label: "否",
          value: "no"
        }
      ],
      vaild: [
        {
          label: "上架",
          value: "yes"
        },
        {
          label: "下架",
          value: "no"
        }
      ],
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      configTableData: [],
      templatePageOpts: [5, 10],
      couponStatusEnum,
      couponFromEnum,
      pfExpandTypeEnum,
      couponTypeEnum,
      imageStatusEnum,
      receiveTypeEnum,
      activityStatus: "",
      columns: flashsaleColumns,
      standardColumns: _.cloneDeep(standardColumns),
      loadingConfig: false,
      addTempDataLoading: false,
      tempTableLoading: false,
      templateLoading: false,
      modalViewLoading: false,
      modalRelation: false,
      showBack: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchConfigRowData: _.cloneDeep(standardRoleRowData),
      relationDatas: [],
      flashsaleGoods: _.cloneDeep(flashsaleGoods),
      couponTemplates: [],
      couponTemplateTotal: 0,
      configTotal: 0
    };
  },
  computed: {
    specialPriceComputed() {
      return fenToYuanDot2Number(this.flashsaleGoods.specialPrice);
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {
    this.showBack = this.$route.name === "wholesale-flashsale";
  },
  methods: {
    specialPriceChange(value) {
      this.flashsaleGoods.specialPrice = yuanToFenNumber(value);
    },
    getTableData() {
      const activity = getActivity();
      // 如果是从统一活动页面过来的
      if (activity) {
        this.activityDetail = _.cloneDeep(activity);
        this.searchRowData.activityId = activity.id;
        this.flashsaleGoods.activityId = activity.id;
        this.activityStatus = activity.vaild;
      }
      getFlashsaleGoodsPages(this.searchRowData)
        .then(res => {
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
      getProductStandardsPages(this.searchConfigRowData).then(res => {
        this.configTableData = res.rows;
        this.configTotal = res.total;
        this.loadingConfig = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    handleCreate() {
      if (this.activityStatus === "yes") {
        this.$Message.error("活动有效期内不允删除!");
        return;
      }
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.flashsaleGoods = _.cloneDeep(flashsaleGoods);
      }
      this.resetFields();
      this.getConfigTableData();
      this.modalEdit = true;
    },
    handleSetting(params) {
      var rows = params.row;
      setSmallCouponActivity(rows);
      this.turnToPage({
        name: "small-vip-activities-associated"
      });
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            if (!this.flashsaleGoods.standardIds) {
              this.$Message.error("请至少关联一个商品规格");
              return;
            }

            this.createFlashsaleGoods();
          } else if (this.isEdit) {
            this.editFlashsaleGoods();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createFlashsaleGoods() {
      this.modalViewLoading = true;
      createFlashsaleGoods(this.flashsaleGoods)
        .then(res => {
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editFlashsaleGoods() {
      this.modalViewLoading = true;
      editFlashsaleGoods(this.flashsaleGoods)
        .then(res => {
          this.$Message.success("修改成功!");
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    onConfigSelectionChange(selection) {
      this.flashsaleGoods.standardIds = selection
        .map(item => item.id.toString())
        .join(",");
    },
    onConfigSelectionAll(selection) {
      this.flashsaleGoods.standardIds = selection
        .map(item => item.id.toString())
        .join(",");
    },
    resetFields() {
      if (this.tempModalType == null) {
        this.$refs.modalCreate.resetFields();
      }
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
    },
    deleteTable(ids) {
      this.loading = true;
      deleteFlashsaleGoods({
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
    handleEdit(params) {
      if (this.activityStatus === "yes") {
        this.$Message.error("活动有效期内不允删除!");
        return;
      }
      this.tempModalType = this.modalType.edit;
      this.resetFields();
      this.flashsaleGoods = _.cloneDeep(params.row);
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
            this.$Message.error("注册送礼优惠券活动不能为空!");
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
      this.searchConfigRowData = _.cloneDeep(standardRoleRowData);
      this.handleConfigSearch();
    },
    goBack() {
      this.turnToPage("wholesale-activity");
    },
    handleDelete(params) {
      if (this.activityStatus === "yes") {
        this.$Message.error("活动有效期内不允删除!");
        return;
      }
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    poptipOk() {
      if (this.tableDataSelected.length < 1) {
        this.$Message.warning("请选中要删除的行");
        return;
      }
      if (this.activityStatus === "yes") {
        this.$Message.error("活动有效期内不允删除!");
        return;
      }
      const tempDeleteList = [];
      this.tableDataSelected.filter(value => {
        tempDeleteList.push(value.id);
      });
      const strTempDelete = tempDeleteList.join(",");
      this.deleteTable(strTempDelete);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
