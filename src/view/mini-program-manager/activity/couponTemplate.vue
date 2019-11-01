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
        @coupon-status="statusChange"
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
            <Select
              v-model="searchRowData.couponType"
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
            <Select
              v-model="searchRowData.couponStatus"
              placeholder="优惠券状态"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in couponStatusEnum"
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
            :loading="createLoading"
            type="success"
            class="mr5"
            @click="addCouponTemplate"
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
        <span>优惠劵模板详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">优惠券模板ID:</i-col>
              <i-col span="18">{{ couponTemplateDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">优惠券名称:</i-col>
              <i-col span="18">{{ couponTemplateDetail.couponName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">优惠券类型:</i-col>
              <i-col span="16" v-if="couponTemplateDetail.couponType === 'FULL_CUT_COUPON'">
                <tag color="magenta">{{ "满减券" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="couponTemplateDetail.couponType === 'DISCOUNT_COUPON'">
                <tag color="orange">{{ "折扣券" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="couponTemplateDetail.couponType === 'CASH_COUPON'">
                <tag color="cyan">{{ "现金券" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="couponTemplateDetail.couponType === 'FREIGHT_COUPON'">
                <tag color="blue">{{ "运费券" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="couponTemplateDetail.couponType === null">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">优惠金额:</i-col>
              <i-col span="18" v-if="couponTemplateDetail.couponType==='FREIGHT_COUPON'">{{ "N/A" }}</i-col>
              <i-col span="18" v-else>{{ couponTemplateDetail.couponFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">小购买金额:</i-col>
              <i-col span="18">{{ couponTemplateDetail.minBuyFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">优惠券状态:</i-col>
              <i-col span="16" v-if="couponTemplateDetail.couponStatus === 'VALID'">
                <tag color="success">{{ "有效" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="couponTemplateDetail.couponStatus === 'INVALID'">
                <tag color="error">{{ "无效" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="couponTemplateDetail.couponStatus === null">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">优惠券图片:</i-col>
              <i-col span="18">
                <img :src="couponTemplateDetail.couponImage" width="80%" />
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">使用范围:</i-col>
              <i-col span="16" v-if="couponTemplateDetail.couponScope === 'STORE'">
                <tag color="magenta">{{ "门店" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="couponTemplateDetail.couponScope === 'SMALL'">
                <tag color="cyan">{{ "商城" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="couponTemplateDetail.couponScope === 'STORE_AND_SMALL'">
                <tag color="orange">{{ "全场通用" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="couponTemplateDetail.couponScope === null">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">使用规则:</i-col>
              <i-col span="18">
                <Input v-model="couponTemplateDetail.couponRules" :rows="6" type="textarea"></Input>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建人:</i-col>
              <i-col span="18">{{ couponTemplateDetail.createUser }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建时间:</i-col>
              <i-col span="18">{{ couponTemplateDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <!-- 添加运费券模板 -->
    <Modal v-model="modalEdit" :mask-closable="false" :z-index="1000">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改优惠券模板':'创建优惠券模板' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="couponTemplateDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="18">
              <FormItem label="优惠券名称:" prop="couponName" :label-width="100">
                <Input v-model="couponTemplateDetail.couponName" placeholder="优惠券名称"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
              <FormItem label="优惠券类型:" prop="couponType" :label-width="100">
                <Select v-model="couponTemplateDetail.couponType" clearable>
                  <Option
                    v-for="(item,index) in couponTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100%"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="this.couponTemplateDetail.couponType!='FREIGHT_COUPON'">
            <Col span="18">
              <FormItem label="优惠金额:" prop="couponFee" :label-width="100">
                <InputNumber
                  :min="0"
                  :value="couponFeeComputed"
                  placeholder="优惠金额"
                  @on-change="couponFeeInputNumberOnchange"
                ></InputNumber>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
              <FormItem label="最小购买金额:" prop="minBuyFee" :label-width="100">
                <InputNumber
                  :min="0"
                  :value="minBuyFeeComputed"
                  placeholder="最小购买金额"
                  @on-change="minBuyFeeInputNumberOnchange"
                ></InputNumber>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
              <FormItem label="优惠券状态:" prop="couponStatus" :label-width="100">
                <Select v-model="couponTemplateDetail.couponStatus" clearable>
                  <Option
                    v-for="(item,index) in couponStatusEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100%"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <!-- <Row>
            <Col span="18">
            <FormItem label="使用范围:" prop="couponScope">
              <Select v-model="couponTemplateDetail.couponScope" clearable>
                <Option
                  v-for="(item,index) in couponScopeEnum"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px;width: 100%">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>-->
          <Row>
            <Col span="18">
              <FormItem label="使用规则:" prop="couponRules" :label-width="100">
                <Input
                  v-model="couponTemplateDetail.couponRules"
                  :rows="6"
                  placeholder="使用规则"
                  type="textarea"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem
              label="优惠券图片     (推荐尺寸为750X160(单位:px)):"
              prop="couponImage"
              :label-width="100"
            >
              <Input v-show="false" v-model="couponTemplateDetail.couponImage" style="width: auto"></Input>
              <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
                <template v-if="item.status === 'finished'">
                  <div>
                    <img :src="item.url" />
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemoveMain(item)"></Icon>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <IViewUpload
                ref="uploadMain"
                :default-list="defaultListMain"
                :image-size="imageSize"
                @on-success="handleSuccessMain"
              >
                <div slot="content" style="width:58px;height:58px;line-height:58px">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </IViewUpload>
            </FormItem>
          </Row>
        </Form>
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
import IViewUpload from "_c/iview-upload";
import _ from "lodash";
import {
  deleteCouponTemplate,
  getCouponTemplatePages,
  editCouponTemplate,
  createCouponTemplate
} from "@/api/mini-program";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  couponStatusConvert,
  couponTypeConvert,
  couponScopeConvert
} from "@/libs/converStatus";
import {
  couponStatusEnum,
  couponTypeEnum,
  couponScopeEnum
} from "@/libs/enumerate";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from "@/libs/util";

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

const roleRowData = {
  couponName: null,
  couponType: null,
  couponStatus: null,
  page: 1,
  rows: 10,
  sidx: "create_time",
  sort: "desc"
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        couponName: [{ required: true, message: "请输入优惠券名称" }],
        couponType: [{ required: true, message: "请选择优惠券类型" }],
        couponFee: [
          { required: true, message: "请输入优惠金额" },
          {
            message: "必须为大于0的数字",
            pattern: /([0-9]\d*(\.\d*[0-9])?)|(\d*[0-9])$/
          }
        ],
        minBuyFee: [
          { required: true, message: "请输入最小购买金额" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        couponStatus: [{ required: true, message: "请选择优惠券状态" }],
        couponRules: [{ required: true, message: "请输入优惠券使用规则" }],
        couponScope: [{ required: true, message: "请选择优惠券使用范围" }]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      couponStatusEnum,
      couponTypeEnum,
      couponScopeEnum,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "模板ID",
          align: "center",
          key: "id",
          maxWidth: 80
        },
        {
          title: "优惠券名称",
          align: "center",
          key: "couponName"
        },
        {
          title: "优惠券类型",
          align: "center",
          key: "couponType",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponType === "FULL_CUT_COUPON") {
              return (
                <div>
                  <tag color="magenta">
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === "DISCOUNT_COUPON") {
              return (
                <div>
                  <tag color="orange">
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === "CASH_COUPON") {
              return (
                <div>
                  <tag color="cyan">
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === "FREIGHT_COUPON") {
              return (
                <div>
                  <tag color="blue">
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.couponType}</div>;
          }
        },
        {
          title: "优惠/折扣额度",
          align: "center",
          key: "couponFee",
          minWidth: 60,
          render(h, params) {
            const { row } = params;
            if (row.couponType === "FREIGHT_COUPON") {
              return <div>N/A</div>;
            } else if (row.couponType === "DISCOUNT_COUPON") {
              return (
                <div>{fenToYuanDot2Number(row.couponFee) * 10 + "折"}</div>
              );
            } else {
              return <div>{fenToYuanDot2(row.couponFee)}</div>;
            }
          }
        },
        {
          title: "最小购买金额",
          align: "center",
          key: "minBuyFee",
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
          }
        },
        {
          title: "优惠券状态",
          align: "center",
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
            return <div>{row.couponStatus}</div>;
          }
        },
        {
          title: "优惠券图片",
          align: "center",
          key: "couponImage",
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.couponImage} height="60" width="60" />;
            return <div>{str}</div>;
          }
        },
        {
          title: "使用范围",
          align: "center",
          key: "couponScope",
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
                  <tag color="cyan">
                    {couponScopeConvert(row.couponScope).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.couponScope}</div>;
          }
        },
        /* {
          title: '使用规则',
          key: 'couponRules',
          tooltips: true
        }, */
        {
          title: "创建人",
          align: "center",
          key: "createUser"
        },
        {
          title: "创建时间",
          align: "center",
          key: "createTime",
          minWidth: 60
        },
        {
          title: "操作",
          align: "center",
          minWidth: 80,
          key: "handle",
          options: ["couponStatus", "view", "edit", "delete"]
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail)
    };
  },
  computed: {
    couponFeeComputed() {
      return fenToYuanDot2Number(this.couponTemplateDetail.couponFee);
    },
    minBuyFeeComputed() {
      return fenToYuanDot2Number(this.couponTemplateDetail.minBuyFee);
    }
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
    resetFields() {
      this.$refs.modalEdit.resetFields();
      // this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.couponTemplateDetail.storeImage = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // TODO ? 最小金额能否大于优惠金额,即用户不需要支付额外金额
          // if (this.couponTemplateDetail.minBuyFee >= this.couponTemplateDetail.couponFee) {
          //   this.$Message.error('最小购买金额必须大于优惠金额!');
          //   return;
          // }
          this.couponTemplateDetail.couponScope = "SMALL";
          this.couponTemplateDetail.couponRules = this.couponTemplateDetail.couponRules.replace(
            /\n|\r/g,
            "&"
          );
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createCouponTemplate();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editCouponTemplate();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createCouponTemplate() {
      this.modalViewLoading = true;
      createCouponTemplate(this.couponTemplateDetail)
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
    editCouponTemplate() {
      this.modalViewLoading = true;
      editCouponTemplate(this.couponTemplateDetail)
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
    addCouponTemplate() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.couponTemplateDetail = _.cloneDeep(couponTemplateDetail);
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
      deleteCouponTemplate({
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
      this.couponTemplateDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.couponTemplateDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(this.couponTemplateDetail);
      this.modalEdit = true;
    },
    getTableData() {
      getCouponTemplatePages(this.searchRowData)
        .then(res => {
          if (res.rows.length !== 0) {
            res.rows.forEach(element => {
              element.couponRules =
                element.couponRules == null
                  ? null
                  : element.couponRules.replace(/&/g, "\n");
            });
          }
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
    statusChange(params) {
      this.couponTemplateDetail = this._.cloneDeep(params.row);
      if (params.row.couponStatus === "VALID") {
        this.couponTemplateDetail.couponStatus = "INVALID";
      } else {
        this.couponTemplateDetail.couponStatus = "VALID";
      }
      this.loading = true;
      this.editCouponTemplate();
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.couponTemplateDetail.couponImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.couponTemplateDetail.couponImage = null;
      this.couponTemplateDetail.couponImage = fileList[0].url;
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.couponImage != null) {
        const map = { status: "finished", url: "url" };
        const mainImgArr = [];
        map.url = res.couponImage;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    couponFeeInputNumberOnchange(value) {
      this.couponTemplateDetail.couponFee = yuanToFenNumber(value);
    },
    minBuyFeeInputNumberOnchange(value) {
      this.couponTemplateDetail.minBuyFee = yuanToFenNumber(value);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
