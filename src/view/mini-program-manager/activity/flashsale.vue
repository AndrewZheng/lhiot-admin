<template>
  <div class="m-content">
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
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-sale="onOff"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-relevance="onRelevance"
      >
        <!--  @on-delete="handleDelete" -->
        <div slot="searchCondition">
          <Row>
            <DatePicker
              v-model="searchRowData.stBeginTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间起"
              class="search-input"
              style="width: 170px"
              @on-change="stBeginTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.stFinishTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间止"
              class="search-input mr5"
              style="width: 170px"
              @on-change="stFinishTimeChange"
            />
            <DatePicker
              v-model="searchRowData.beginPublishAt"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              class="search-input mr5"
              style="width: 170px"
              placeholder="结束时间起"
              @on-change="edBeginTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endPublishAt"
              type="datetime"
              placeholder="结束时间止"
              style="width: 170px"
              class="mr5"
              @on-change="edFinishTimeChange"
            />
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
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addFlashsale">
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
        <span>限时抢购活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动ID:</i-col>
              <i-col span="18">{{ flashsaleDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">限时抢购</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">{{ flashsaleDetail.startTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">{{ flashsaleDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col v-if="flashsaleDetail.onOff === 'ON'" span="18">
                <tag color="success">{{ "开启" | imageStatusFilter }}</tag>
              </i-col>
              <i-col v-else-if="flashsaleDetail.onOff === 'OFF'" span="18">
                <tag color="error">{{ "关闭" | imageStatusFilter }}</tag>
              </i-col>
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
        <i-col>{{ tempModalType==modalType.edit?'修改限时抢购活动':(tempModalType==modalType.create?'创建限时抢购活动': '限时抢购活动和商品关联') }}</i-col>
      </p>
      <div class="modal-content">
        <Row v-if="tempModalType == modalType.edit || tempModalType == modalType.create">
          <Form ref="editForm" :model="flashsaleDetail" :rules="ruleInline" :label-width="80">
            <Row>
              <i-col span="18">
                <FormItem label="活动名称:">限时抢购</FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="有效期起:" prop="startTime">
                  <DatePicker
                    v-model="flashsaleDetail.startTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期起"
                    class="search-input"
                    style="width: 170px"
                    @on-change="startTimeChange"
                  />
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="有效期止:" prop="endTime">
                  <DatePicker
                    v-model="flashsaleDetail.endTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期止"
                    class="search-input"
                    style="width: 170px"
                    @on-change="endTimeChange"
                  />
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="活动状态:" prop="onOff">
                  <Select v-model="flashsaleDetail.onOff" clearable style="width: 170px">
                    <Option
                      v-for="(item,index) in imageStatusEnum"
                      :key="index"
                      :value="item.value"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 170px"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </Row>

        <Row v-if="tempModalType == null ">
          <Row>
            <!-- 限时抢购只能添加一个关联商品，所以只有当关联商品为空时才显示 -->
            <Card v-if="relationProducts.length === 0">
              <tables
                ref="tables"
                v-model="products"
                :columns="productColumns"
                :loading="tempTableLoading"
                border
                searchable
                search-place="top"
                @on-delete="modalHandleDelete"
                @on-inline-edit="modalHandleEdit"
                @on-inline-save="modalHandleSave"
                @on-selection-change="onProductSelectionChange"
              >
                <div slot="searchCondition">
                  <Row>
                    <Input
                      v-model="searchProductRowData.productCode"
                      placeholder="商品编码"
                      class="search-input mr5"
                      style="width: auto"
                      clearable
                    ></Input>
                    <Input
                      v-model="searchProductRowData.productName"
                      placeholder="商品名称"
                      class="search-input mr5"
                      style="width: auto"
                      clearable
                    ></Input>
                    <Button
                      :loading="searchLoading"
                      class="search-btn mr5"
                      type="primary"
                      @click="handleProductSearch"
                    >
                      <Icon type="md-search" />&nbsp;搜索
                    </Button>
                    <Button
                      v-waves
                      :loading="clearSearchLoading"
                      class="search-btn"
                      type="info"
                      @click="handleProductClear"
                    >
                      <Icon type="md-refresh" />&nbsp;清除
                    </Button>
                  </Row>
                </div>
              </tables>

              <div style="margin: 10px;overflow: hidden">
                <Row type="flex" justify="end">
                  <Page
                    :total="productTotal"
                    :current="searchProductRowData.page"
                    show-sizer
                    show-total
                    @on-change="changeProductPage"
                    @on-page-size-change="changeProductPageSize"
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
                  <i-col span="5">
                    <FormItem label="抢购价:" prop="salePrice">
                      <InputNumber
                        :min="0"
                        :value="salePriceComputed"
                        placeholder="抢购价"
                        @on-change="salePriceInputNumberOnchange"
                      ></InputNumber>
                    </FormItem>
                  </i-col>
                  <i-col span="5">
                    <FormItem label="商品总数量:" prop="goodsLimit">
                      <InputNumber
                        v-model="addRelationDetail.goodsLimit"
                        :min="0"
                        class="ml20"
                        label="商品总数量"
                      ></InputNumber>
                    </FormItem>
                  </i-col>
                  <i-col span="5">
                    <FormItem label="剩余数量:" prop="remainCount">
                      <InputNumber
                        v-model="addRelationDetail.remainCount"
                        :min="0"
                        class="ml20"
                        label="剩余数量"
                      ></InputNumber>
                    </FormItem>
                  </i-col>
                  <i-col span="5">
                    <FormItem label="限购数量:" prop="userLimit">
                      <InputNumber
                        v-model="addRelationDetail.userLimit"
                        :min="0"
                        class="ml20"
                        label="限购数量"
                      ></InputNumber>
                    </FormItem>
                  </i-col>
                  <i-col span="4">
                    <Button
                      v-waves
                      :loading="addTempDataLoading"
                      span="4"
                      class="search-btn ml20"
                      type="primary"
                      @click="addTempData('modalCreate')"
                    >
                      <Icon type="md-add" />&nbsp;关联商品
                    </Button>
                  </i-col>
                </Row>
              </Form>*Tips：请先选择要关联的商品，然后输入关联配置信息，若关联多个商品，则所有的商品配置信息相同，添加完成后可在下方表格修改
            </Card>
          </Row>

          <Divider orientation="center">已关联商品</Divider>
          <tables
            v-model="relationProducts"
            :columns="relationColumns"
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
        <Button
          v-if="tempModalType == modalType.edit || tempModalType == modalType.create"
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit('editForm')"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  deleteFlashsale,
  getFlashsalePages,
  editFlashsale,
  createFlashsale,
  getFlashsaleProductRelationPages,
  deleteFlashsaleProductRelation,
  createFlashsaleProductRelation,
  editFlashsaleProductRelation,
  getProductStandardsPages
} from '@/api/mini-program';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { imageStatusConvert } from '@/libs/converStatus';
import { imageStatusEnum } from '@/libs/enumerate';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from '@/libs/util';
import { customPlanStatusConvert, appTypeConvert } from '@/libs/converStatus';

const flashsaleDetail = {
  stBeginTime: null,
  stFinishTime: null,
  edBeginTime: null,
  edFinishTime: null,
  id: 0,
  activityId: 0,
  startTime: '',
  endTime: '',
  onOff: null,
  applicationType: null,
  standardId: 0,
  productName: ''
};

const relationDetail = {
  productName: '',
  price: 0,
  standardIds: '',
  id: 0,
  activityFlashsaleId: 0,
  productStandardId: 0,
  goodsLimit: 0,
  remainCount: 0,
  userLimit: 0,
  salePrice: 0,
  isEdit: false
};

const productDetail = {
  id: 0,
  productId: 0,
  barcode: '',
  specification: '',
  standardQty: 0,
  unitId: 0,
  productUnit: '',
  price: 0,
  salePrice: 0,
  rank: 0,
  description: '',
  shelvesStatus: null,
  applyType: null,
  productName: '',
  createUser: null,
  image: '',
  productDescription: '',
  productCode: '',
  baseProductName: '',
  baseProductDescription: '',
  groupId: 0,
  groupName: '',
  sourceCode: '',
  baseImage: '',
  smallImage: '',
  largeImage: '',
  status: '',
  baseUnitId: 0,
  baseUnit: '',
  baseBarcode: '',
  hdSkuid: '',
  videoUrl: '',
  videoImage: '',
  baseQty: 0,
  limitQty: 0,
  queryStatus: null,
  invEnough: null,
  invNum: null,
  saleCount: null,
  positionName: null,
  dbId: null
};

const roleRowData = {
  stBeginTime: null,
  stFinishTime: null,
  edBeginTime: null,
  edFinishTime: null,
  page: 1,
  rows: 10
};

const relationRowData = {
  id: null,
  activityFlashsaleId: null,
  page: 1,
  rows: 10
};

const productRowData = {
  applyType: null,
  sectionName: null,
  productName: null,
  barcode: null,
  shelvesStatus: 'VALID',
  page: 1,
  rows: 5
};

const relationTempColumns = [
  {
    title: '商品名称',
    key: 'productName',
    minWidth: 100
  },
  // {
  //   title: '商品图片',
  //   key: 'description',
  //   minWidth: 100,
  //   render: (h, params, vm) => {
  //     const { row } = params;
  //     const str = <img src={row.avater} height='60' width='60' />;
  //     return <div>{str}</div>;
  //   }
  // },
  {
    title: '商品原价/元',
    key: 'price',
    minWidth: 100,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.price)}</div>;
    }
  },
  {
    title: '商品特价/元',
    key: 'salePrice',
    minWidth: 100,
    render(h, params) {
      if (params.row.isEdit) {
        return h('div', [
          h('InputNumber', {
            domProps: {
              value: params.row.salePrice
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.salePrice = event;
                }
              }
            }
          })
        ]);
      } else {
        return h('div', fenToYuanDot2(params.row.salePrice));
      }
    }
  },
  {
    title: '商品总数量',
    key: 'goodsLimit',
    minWidth: 100,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h('div', [
          h('InputNumber', {
            domProps: {
              value: params.row.goodsLimit
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.goodsLimit = event;
                }
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.goodsLimit);
      }
    }
  },
  {
    title: '剩余数量',
    key: 'remainCount',
    minWidth: 100,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h('div', [
          h('InputNumber', {
            domProps: {
              value: params.row.remainCount
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.remainCount = event;
                }
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.remainCount);
      }
    }
  },
  {
    title: '限购数量量',
    key: 'userLimit',
    minWidth: 100,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h('div', [
          h('InputNumber', {
            domProps: {
              value: params.row.userLimit
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.userLimit = event;
                }
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.userLimit);
      }
    }
  }
];

const productColumns = [
  {
    type: 'selection',
    key: '',
    width: 50,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '商品条码',
    key: 'barcode',
    minWidth: 70,
    align: 'center'
  },
  {
    title: '商品编号',
    key: 'productCode',
    align: 'center',
    minWidth: 120
  },
  {
    title: '商品名称',
    key: 'productName',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '商品规格',
    key: 'specification',
    minWidth: 80,
    align: 'center'
  },
  {
    title: '商品单位',
    key: 'productUnit',
    minWidth: 80,
    align: 'center'
  },
  {
    title: '商品价格',
    key: 'price',
    minWidth: 80,
    align: 'center',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: '商品状态',
    minWidth: 100,
    key: 'shelvesStatus',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.shelvesStatus === 'VALID') {
        return (
          <div>
            <tag color='success'>
              {customPlanStatusConvert(row.shelvesStatus).label}
            </tag>
          </div>
        );
      } else if (row.shelvesStatus === 'INVALID') {
        return (
          <div>
            <tag color='error'>
              {customPlanStatusConvert(row.shelvesStatus).label}
            </tag>
          </div>
        );
      }
      return (
        <div>
          <tag color='primary'>
            {customPlanStatusConvert(row.shelvesStatus).label}
          </tag>
        </div>
      );
    }
  },
  {
    title: '排序',
    key: 'rank',
    minWidth: 60,
    align: 'center'
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
        startTime: [{ required: true, message: '请选择活动开始时间' }],
        endTime: [{ required: true, message: '请选择活动结束时间' }],
        onOff: [{ required: true, message: '请选择活动状态' }]
      },
      relationRuleInline: {
        salePrice: [
          { required: true, message: '请输入抢购价' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        goodsLimit: [
          { required: true, message: '请输入商品总数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        remainCount: [
          { required: true, message: '请输入剩余数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        userLimit: [
          { required: true, message: '请输入限购数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      imageStatusEnum,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '活动ID',
          align: 'center',
          key: 'id'
        },
        {
          title: '活动名称',
          align: 'center',
          render: (h, params, vm) => {
            const str = '限时抢购';
            return <div>{str}</div>;
          }
        },
        {
          title: '活动开始时间',
          align: 'center',
          key: 'startTime'
        },
        {
          title: '活动结束时间',
          align: 'center',
          key: 'endTime'
        },
        {
          title: '活动状态',
          align: 'center',
          key: 'onOff',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.onOff === 'ON') {
              return (
                <div>
                  <tag color='success'>
                    {imageStatusConvert(row.onOff).label}
                  </tag>
                </div>
              );
            } else if (row.onOff === 'OFF') {
              return (
                <div>
                  <tag color='error'>{imageStatusConvert(row.onOff).label}</tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{row.onOff ? row.onOff : 'N/A'}</tag>
              </div>
            );
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 80,
          key: 'handle',
          // "delete",
          options: ['onSale', 'view', 'edit', 'settings']
        }
      ],
      relationColumns: [
        ...relationTempColumns,
        {
          title: '操作',
          minWidth: 100,
          key: 'handle',
          options: ['inlineEdit', 'delete']
        }
      ],
      productColumns: _.cloneDeep(productColumns),
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRelationRowData: _.cloneDeep(relationRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      flashsaleDetail: _.cloneDeep(flashsaleDetail),
      relationProducts: [],
      addRelationDetail: _.cloneDeep(relationDetail),
      productDetail: _.cloneDeep(productDetail),
      products: [],
      productTotal: 0
    };
  },
  computed: {
    priceComputed() {
      return fenToYuanDot2Number(this.productDetail.price);
    },
    salePriceComputed() {
      return fenToYuanDot2Number(this.productDetail.salePrice);
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
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
      this.flashsaleDetail.storeImage = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.flashsaleDetail.startTime > this.flashsaleDetail.endTime) {
            this.$Message.error('开始时间不能大于结束时间!');
            return;
          }
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createFlashsale();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editFlashsale();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createFlashsale() {
      this.modalViewLoading = true;
      createFlashsale(this.flashsaleDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editFlashsale() {
      this.modalViewLoading = true;
      editFlashsale(this.flashsaleDetail)
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
    addFlashsale() {
      this.resetFields();
      this.tempModalType = this.modalType.create;
      this.flashsaleDetail = _.cloneDeep(flashsaleDetail);
      this.modalEdit = true;
    },
    // 删除
    // handleDelete(params) {
    //   this.tableDataSelected = [];
    //   this.tableDataSelected.push(params.row);
    //   this.deleteTable(params.row.id);
    // },
    deleteTable(ids) {
      this.loading = true;
      deleteFlashsale({
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
      this.tempModalType = this.modalType.view;
      this.flashsaleDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.flashsaleDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getFlashsalePages(this.searchRowData)
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
    getRelationTableData() {
      getFlashsaleProductRelationPages(this.searchRelationRowData)
        .then(res => {
          // 设置行是否可编辑
          if (res && res.rows.length > 0) {
            res.rows.forEach(element => {
              element.isEdit = false;
            });
            this.relationProducts = res.rows;
          }
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    onOff(params) {
      this.flashsaleDetail = this._.cloneDeep(params.row);
      if (params.row.onOff === 'ON') {
        this.flashsaleDetail.onOff = 'OFF';
      } else {
        this.flashsaleDetail.onOff = 'ON';
      }
      this.loading = true;
      this.editFlashsale();
    },
    startTimeChange(value, date) {
      this.flashsaleDetail.startTime = value;
    },
    endTimeChange(value, date) {
      this.flashsaleDetail.endTime = value;
    },
    stBeginTimeChange(value, date) {
      this.flashsaleDetail.stBeginTime = value;
    },
    stFinishTimeChange(value, date) {
      this.flashsaleDetail.stFinishTime = value;
    },
    edBeginTimeChange(value) {
      this.searchRowData.edBeginTime = value;
    },
    edFinishTimeChange(value) {
      this.searchRowData.edFinishTime = value;
    },
    onRelevance(params) {
      this.tempModalType = null;
      // FIXME 查询商品规格分页信息（后期按钮触发，或者先存储，需要时再调用接口）
      this.getProductTableData();
      // 查询限时抢购关联商品
      this.searchRelationRowData.activityFlashsaleId = params.row.id;
      this.addRelationDetail.activityFlashsaleId = params.row.id;
      this.getRelationTableData();
      this.modalEdit = true;
    },
    addTempData(name) {
      // 先验证是否已经关联的商品
      if (this.relationProducts.length > 0) {
        this.$Message.errors('限时抢购目前只能关联一个商品');
        return false;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          // 只能添加1个商品
          const productStandardIds = this.addRelationDetail.standardIds.split(
            ','
          );
          if (
            productStandardIds.length === 0 ||
            this.addRelationDetail.standardIds === ''
          ) {
            this.$Message.error('请选择一个要关联的商品!');
            return;
          } else if (productStandardIds.length > 1) {
            this.$Message.error('限时抢购目前只能关联一个商品');
            return;
          } else if (
            this.addRelationDetail.remainCount >
            this.addRelationDetail.goodsLimit
          ) {
            this.$Message.error('限时数量不能大于商品总数量');
            return;
          }
          // 如果前端没有剩余数量字段,则初始化剩余数量=商品数量
          // this.addRelationDetail.remainCount = this.addRelationDetail.goodsLimit;
          this.createRelation();
        } else {
          this.$Message.error('请完善信息!');
        }
      });
      // this.createFlashsaleProductRelation(this.addRelationDetail)
    },
    modalHandleEdit(params) {
      this.$set(params.row, 'isEdit', true);
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
        this.$Message.error('请输入非0数');
        return;
      } else if (row.remainCount > row.goodsLimit) {
        this.$Message.error('限时数量不能大于商品总数量');
        return;
      }
      this.tempTableLoading = true;
      // 如果前端没有剩余数量字段,则初始化剩余数量=商品数量
      // row.remainCount = row.goodsLimit;
      editFlashsaleProductRelation(row)
        .then(res => {
          this.getRelationTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
      this.tempTableLoading = false;
      this.$set(params.row, 'isEdit', false);
      // console.log('modalHandleSave' + JSON.stringify(params.row));
    },
    modalHandleDelete(params) {
      this.tempTableLoading = true;
      deleteFlashsaleProductRelation({ ids: params.row.id })
        .then(res => {
          this.relationProducts = this.relationProducts.filter(
            (item, index) => index !== params.row.initRowIndex
          );
          this.getRelationTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
    },
    getProductTableData() {
      this.loading = true;
      getProductStandardsPages(this.searchProductRowData).then(res => {
        this.products = res.rows;
        this.productTotal = res.total;
        this.loading = false;
        this.searchLoading = false;
      });
    },
    changeProductPage(page) {
      this.searchProductRowData.page = page;
      this.getProductTableData();
    },
    changeProductPageSize(pageSize) {
      this.searchProductRowData.page = 1;
      this.searchProductRowData.rows = pageSize;
      this.getProductTableData();
    },
    handleProductSearch() {
      this.searchProductRowData.page = 1;
      this.searchLoading = true;
      this.getProductTableData();
    },
    handleProductClear() {
      // 重置数据
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleProductSearch();
    },
    onProductSelectionAll(selection) {
      this.addRelationDetail.standardIds = selection
        .map(item => item.id.toString())
        .join(',');
      console.log(
        '商品选择变化,当前页选择productStandardIds:' +
          this.addRelationDetail.standardIds
      );
    },
    onProductSelectionChange(selection) {
      this.addRelationDetail.standardIds = selection
        .map(item => item.id.toString())
        .join(',');
    },
    priceInputNumberOnchange(value) {
      this.addRelationDetail.price = yuanToFenNumber(value);
    },
    salePriceInputNumberOnchange(value) {
      this.addRelationDetail.salePrice = yuanToFenNumber(value);
    },
    createRelation() {
      this.modalViewLoading = true;
      createFlashsaleProductRelation(this.addRelationDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getRelationTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
