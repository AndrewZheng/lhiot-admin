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
              style="width: 130px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.couponType"
              placeholder="优惠券类型"
              style="padding-right: 5px; width: 120px"
              clearable
            >
              <Option
                v-for="(item, index) in couponTypeEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px; width: 120px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.couponStatus"
              placeholder="优惠券状态"
              style="padding-right: 5px; width: 120px"
              clearable
            >
              <Option
                v-for="(item, index) in couponStatusEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px; width: 120px"
              >
                {{ item.label }}
              </Option>
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
      <div style="margin: 10px; overflow: hidden">
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
              <i-col span="6">
                优惠券模板ID:
              </i-col>
              <i-col span="18">
                {{ couponTemplateDetail.id }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                优惠券名称:
              </i-col>
              <i-col span="18">
                {{ couponTemplateDetail.couponName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                优惠券类型:
              </i-col>
              <i-col
                v-if="couponTemplateDetail.couponType === 'FULL_CUT_COUPON'"
                span="16"
              >
                <tag color="magenta">
                  {{ "满减券" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="
                  couponTemplateDetail.couponType === 'DISCOUNT_COUPON'
                "
                span="16"
              >
                <tag color="orange">
                  {{ "折扣券" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="couponTemplateDetail.couponType === 'CASH_COUPON'"
                span="16"
              >
                <tag color="cyan">
                  {{ "现金券" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="couponTemplateDetail.couponType === 'FREIGHT_COUPON'"
                span="16"
              >
                <tag color="blue">
                  {{ "运费券" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="couponTemplateDetail.couponType === null"
                span="16"
              >
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                优惠金额:
              </i-col>
              <i-col
                v-if="couponTemplateDetail.couponType === 'FREIGHT_COUPON'"
                span="18"
              >
                {{ "N/A" }}
              </i-col>
              <i-col v-else span="18">
                {{
                  couponTemplateDetail.couponFee | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                小购买金额:
              </i-col>
              <i-col span="18">
                {{
                  couponTemplateDetail.minBuyFee | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                最高优惠金额:
              </i-col>
              <i-col v-if="couponTemplateDetail.maxDiscountFee" span="18">
                {{
                  couponTemplateDetail.maxDiscountFee | fenToYuanDot2Filters
                }}
              </i-col>
              <i-col v-else span="18">
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                优惠券状态:
              </i-col>
              <i-col
                v-if="couponTemplateDetail.couponStatus === 'VALID'"
                span="16"
              >
                <tag color="success">
                  {{ "有效" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="couponTemplateDetail.couponStatus === 'INVALID'"
                span="16"
              >
                <tag color="error">
                  {{ "无效" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="couponTemplateDetail.couponStatus === null"
                span="16"
              >
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                优惠券图片:
              </i-col>
              <i-col span="18">
                <img :src="couponTemplateDetail.couponImage" width="80%">
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                使用范围:
              </i-col>
              <i-col
                v-if="couponTemplateDetail.couponScope === 'STORE'"
                span="16"
              >
                <tag color="magenta">
                  {{ "门店" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="couponTemplateDetail.couponScope === 'SMALL'"
                span="16"
              >
                <tag color="cyan">
                  {{ "商城" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="
                  couponTemplateDetail.couponScope === 'STORE_AND_SMALL'
                "
                span="16"
              >
                <tag color="orange">
                  {{ "全场通用" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="couponTemplateDetail.couponScope === null"
                span="16"
              >
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                使用规则:
              </i-col>
              <i-col span="18">
                <Input
                  v-model="couponTemplateDetail.couponRules"
                  :rows="6"
                  type="textarea"
                ></Input>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                创建人:
              </i-col>
              <i-col span="18">
                {{ couponTemplateDetail.createUser }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                创建时间:
              </i-col>
              <i-col span="18">
                {{ couponTemplateDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">
          关闭
        </Button>
      </div>
    </Modal>

    <!-- 添加运费券模板 -->
    <Modal v-model="modalEdit" :mask-closable="false" :z-index="1000">
      <p slot="header">
        <i-col>
          {{
            isEdit ? "修改优惠券模板" : "创建优惠券模板"
          }}
        </i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="modalEdit"
          :model="couponTemplateDetail"
          :rules="ruleInline"
          :label-width="120"
        >
          <Row>
            <Col span="18">
            <FormItem
              :label-width="120"
              label="优惠券名称:"
              prop="couponName"
            >
              <Input
                v-model="couponTemplateDetail.couponName"
                placeholder="优惠券名称"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem
              :label-width="120"
              label="优惠券类型:"
              prop="couponType"
            >
              <Select v-model="couponTemplateDetail.couponType" clearable>
                <Option
                  v-for="(item, index) in couponTypeEnum"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px; width: 100%"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row v-if="couponTemplateDetail.couponType != 'FREIGHT_COUPON'">
            <Col span="18">
            <p
              v-show="couponTemplateDetail.couponType == 'DISCOUNT_COUPON'"
              style="color: #ff3861; margin-left: 38px"
            >
              折扣券请输入折扣额度,如88折请输入0.88
            </p>
            <FormItem
              v-if="couponTemplateDetail.couponType == 'DISCOUNT_COUPON'"
              :label-width="120"
              label="折扣额度:"
              prop="couponFee"
            >
              <InputNumber
                :min="0"
                :value="couponFeeComputed"
                placeholder="折扣额度"
                @on-change="couponFeeInputNumberOnchange"
              ></InputNumber>
            </FormItem>
            <FormItem
              v-else
              :label-width="120"
              label="优惠金额:"
              prop="couponFee"
            >
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
            <FormItem
              :label-width="120"
              label="最小购买金额:"
              prop="minBuyFee"
            >
              <InputNumber
                :min="0"
                :value="minBuyFeeComputed"
                placeholder="最小购买金额"
                @on-change="minBuyFeeInputNumberOnchange"
              ></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row v-if="couponTemplateDetail.couponType == 'DISCOUNT_COUPON'">
            <Col span="18">
            <FormItem
              label="最高优惠金额:"
              prop="maxDiscountFee"
              :label-width="120"
            >
              <InputNumber
                :min="0"
                :value="maxDiscountFeeComputed"
                @on-change="maxDiscountFeeInputNumberOnchange"
              ></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem
              :label-width="120"
              label="优惠券状态:"
              prop="couponStatus"
            >
              <Select v-model="couponTemplateDetail.couponStatus" clearable>
                <Option
                  v-for="(item, index) in couponStatusEnum"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px; width: 100%"
                >
                  {{ item.label }}
                </Option>
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
            <FormItem :label-width="120" label="使用规则:" prop="couponRules">
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
              :label-width="120"
              label="优惠券图片     (推荐尺寸为750X160(单位:px)):"
              prop="couponImage"
            >
              <Input
                v-show="false"
                v-model="couponTemplateDetail.couponImage"
                style="width: auto"
              ></Input>
              <div
                v-for="item in uploadListMain"
                :key="item.url"
                class="demo-upload-list"
              >
                <template v-if="item.status === 'finished'">
                  <div>
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleUploadView(item)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveMain(item)"
                      ></Icon>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <Progress
                    v-if="item.showProgress"
                    :percent="item.percentage"
                    hide-info
                  ></Progress>
                </template>
              </div>
              <IViewUpload
                ref="uploadMain"
                :default-list="defaultListMain"
                :image-size="imageSize"
                group-type="activity_image"
                file-dir="activity"
                @on-success="handleSuccessMain"
              >
                <div
                  slot="content"
                  style="width: 58px; height: 58px; line-height: 58px"
                >
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </IViewUpload>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">
          关闭
        </Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit('modalEdit')"
        >
          确定
        </Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import {
  deleteCouponTemplate,
  getCouponTemplatePages,
  editCouponTemplate,
  createCouponTemplate
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import {
  couponStatusConvert,
  couponTypeConvert,
  couponScopeConvert
} from '@/libs/converStatus';
import {
  couponStatusEnum,
  couponTypeEnum,
  couponScopeEnum
} from '@/libs/enumerate';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from '@/libs/util';

const couponTemplateDetail = {
  id: 0,
  couponName: '',
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: '',
  createUser: '',
  maxDiscountFee: null,
  createTime: null,
  couponRules: '',
  couponScope: null
};

const roleRowData = {
  couponName: null,
  couponType: null,
  couponStatus: null,
  page: 1,
  rows: 10,
  sidx: 'createTime',
  sort: 'desc'
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, tableMixin],
  data() {
    return {
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      couponStatusEnum,
      couponTypeEnum,
      couponScopeEnum,
      oldPicture: [],
      newPicture: [],
      save: [],
      ruleInline: {
        couponName: [{ required: true, message: '请输入优惠券名称' }],
        couponType: [{ required: true, message: '请选择优惠券类型' }],
        couponFee: [
          { required: true, message: '请输入优惠金额' },
          {
            message: '必须为大于0的数字',
            pattern: /([0-9]\d*(\.\d*[0-9])?)|(\d*[0-9])$/
          }
        ],
        minBuyFee: [
          { required: true, message: '请输入最小购买金额' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        maxDiscountFee: [
          { required: false, message: '请输入最高优惠金额' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        couponStatus: [{ required: true, message: '请选择优惠券状态' }],
        couponRules: [{ required: true, message: '请输入优惠券使用规则' }],
        couponScope: [{ required: true, message: '请选择优惠券使用范围' }]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '模板ID',
          align: 'center',
          key: 'id',
          width: 90
        },
        {
          title: '优惠券名称',
          align: 'center',
          key: 'couponName',
          minWidth: 150
        },
        {
          title: '优惠券类型',
          align: 'center',
          width: 110,
          key: 'couponType',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponType === 'FULL_CUT_COUPON') {
              return (
                <div>
                  <tag color='magenta'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'DISCOUNT_COUPON') {
              return (
                <div>
                  <tag color='orange'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'CASH_COUPON') {
              return (
                <div>
                  <tag color='cyan'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'FREIGHT_COUPON') {
              return (
                <div>
                  <tag color='blue'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.couponType}</div>;
          }
        },
        {
          title: '优惠/折扣额度',
          align: 'center',
          key: 'couponFee',
          width: 130,
          render(h, params) {
            const { row } = params;
            if (row.couponType === 'FREIGHT_COUPON') {
              return <div>N/A</div>;
            } else if (row.couponType === 'DISCOUNT_COUPON') {
              return <div>{row.couponFee / 10 + '折'}</div>;
            } else {
              return <div>{fenToYuanDot2(row.couponFee)}</div>;
            }
          }
        },
        {
          title: '最小购买金额',
          align: 'center',
          key: 'minBuyFee',
          width: 130,
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
          }
        },
        {
          title: '最高优惠金额',
          align: 'center',
          width: 130,
          key: 'maxDiscountFee',
          render(h, params) {
            if (params.row.maxDiscountFee) {
              return <div>{fenToYuanDot2(params.row.maxDiscountFee)}</div>;
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '优惠券状态',
          align: 'center',
          width: 110,
          key: 'couponStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponStatus === 'VALID') {
              return (
                <div>
                  <tag color='success'>
                    {couponStatusConvert(row.couponStatus).label}
                  </tag>
                </div>
              );
            } else if (row.couponStatus === 'INVALID') {
              return (
                <div>
                  <tag color='error'>
                    {couponStatusConvert(row.couponStatus).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.couponStatus}</div>;
          }
        },
        // {
        //   title: "优惠券图片",
        //   align: "center",
        //   minWidth: 110,
        //   key: "couponImage",
        //   render: (h, params, vm) => {
        //     const { row } = params;
        //     const str = <img src={row.couponImage} height="60" width="60" />;
        //     return <div>{str}</div>;
        //   },
        // },
        {
          title: '使用范围',
          align: 'center',
          key: 'couponScope',
          width: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponScope === 'STORE') {
              return (
                <div>
                  <tag color='magenta'>
                    {couponScopeConvert(row.couponScope).label}
                  </tag>
                </div>
              );
            } else if (row.couponScope === 'STORE_AND_SMALL') {
              return (
                <div>
                  <tag color='orange'>
                    {couponScopeConvert(row.couponScope).label}
                  </tag>
                </div>
              );
            } else if (row.couponScope === 'SMALL') {
              return (
                <div>
                  <tag color='cyan'>
                    {couponScopeConvert(row.couponScope).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.couponScope}</div>;
          }
        },
        // {
        //   title: "创建时间",
        //   align: "center",
        //   key: "createTime",
        //   minWidth: 180,
        // },
        {
          title: '操作',
          align: 'center',
          width: 180,
          key: 'handle',
          options: ['couponStatus', 'view', 'edit', 'delete']
        }
      ],
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
    },
    maxDiscountFeeComputed() {
      return fenToYuanDot2Number(this.couponTemplateDetail.maxDiscountFee);
    }
  },
  mounted() {
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
    getTableData() {
      getCouponTemplatePages(this.searchRowData)
        .then((res) => {
          if (res.rows.length !== 0) {
            res.rows.forEach((element) => {
              element.couponRules =
                element.couponRules == null
                  ? null
                  : element.couponRules.replace(/&/g, '\n');
            });
          }
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    statusChange(params) {
      this.couponTemplateDetail = this._.cloneDeep(params.row);
      if (params.row.couponStatus === 'VALID') {
        this.couponTemplateDetail.couponStatus = 'INVALID';
      } else {
        this.couponTemplateDetail.couponStatus = 'VALID';
      }
      this.loading = true;
      this.editCouponTemplate();
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.couponTemplateDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.save = [];
      this.save.push(params.row.couponImage);
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.couponTemplateDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(this.couponTemplateDetail);
      this.modalEdit = true;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // TODO ? 最小金额能否大于优惠金额,即用户不需要支付额外金额
          if (this.couponTemplateDetail.couponType != 'DISCOUNT_COUPON') {
            if (
              this.couponTemplateDetail.minBuyFee <=
              this.couponTemplateDetail.couponFee
            ) {
              this.$Message.error('最小购买金额必须大于优惠金额!');
              return;
            }
          }
          this.couponTemplateDetail.couponScope = 'SMALL';
          this.couponTemplateDetail.couponRules = this.couponTemplateDetail.couponRules.replace(
            /\n|\r/g,
            '&'
          );
          if (this.isCreate) {
            // 添加状态
            this.createCouponTemplate();
          } else if (this.isEdit) {
            // 编辑状态
            this.editCouponTemplate();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    handleEditClose() {
      this.oldPicture = [];
      this.newPicture = [];
      this.modalEdit = false;
    },
    createCouponTemplate() {
      this.modalViewLoading = true;
      createCouponTemplate(this.couponTemplateDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    editCouponTemplate() {
      this.modalViewLoading = true;
      editCouponTemplate(this.couponTemplateDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('操作成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    addCouponTemplate() {
      this.resetFields();
      this.tempModalType = this.modalType.create;
      this.couponTemplateDetail = _.cloneDeep(couponTemplateDetail);
      this.modalEdit = true;
    },
    deleteTable(ids) {
      deleteCouponTemplate({
        ids
      })
        .then((res) => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
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
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.couponImage != null) {
        const map = { status: 'finished', url: 'url' };
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
    },
    maxDiscountFeeInputNumberOnchange(value) {
      this.couponTemplateDetail.maxDiscountFee = yuanToFenNumber(value);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
