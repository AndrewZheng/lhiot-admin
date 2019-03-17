<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        editable
        searchable
        border
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-delete="handleDelete"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.barcode"
              placeholder="商品条码"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Input
              v-model="searchRowData.productCode"
              placeholder="商品编号"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Input
              v-model="searchRowData.productName"
              placeholder="商品名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Select
              v-model="searchRowData.shelvesStatus"
              class="search-col"
              placeholder="上架状态"
              style="width:100px"
              clearable
            >
              <Option
                v-for="item in shelvesStatus"
                :value="item.value"
                :key="item.value"
                class="ml15 mt10"
              >{{ item.label }}</Option>
            </Select>
            <Input
              v-model="searchRowData.minPrice"
              placeholder="最低价格"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Input
              v-model="searchRowData.maxPrice"
              placeholder="最高价格"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves class="search-btn ml5 mr5" type="primary" @click="handleCreateView">
            <Icon type="md-add"/>&nbsp;创建
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash"/>
              删除
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
            @on-page-size-change="changePageSize"></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalView" :mask-closable="false" :width="700">
      <p slot="header">
        <span>商品规格详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品ID:</i-col>
              <i-col span="16">{{ productStandardDetail.productId }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{ productStandardDetail.baseProductName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品分类:</i-col>
              <i-col span="16">{{ productStandardDetail.groupName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="10">基础单位:</i-col>
              <i-col span="14">{{ productStandardDetail.baseUnit }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品主图:</i-col>
              <i-col span="16">{{ productStandardDetail.availableStatus }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品编号:</i-col>
              <i-col span="16">{{ productStandardDetail.productCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品条码:</i-col>
              <i-col span="16">{{ productStandardDetail.baseBarcode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品描述:</i-col>
              <i-col span="16">{{ productStandardDetail.baseProductDescription }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品名称:</i-col>
              <i-col span="16">{{ productStandardDetail.productName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品描述:</i-col>
              <i-col span="16">{{ productStandardDetail.productDescription }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品主图:</i-col>
              <i-col v-if="productStandardDetail.image" span="16"><img :src="productStandardDetail.image" width="100" height="100"></i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品详情图:</i-col>
              <i-col v-if="productStandardDetail.detailImage" span="16"><img :src="productStandardDetail.detailImage" width="100" height="100" ></i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品条码:</i-col>
              <i-col span="16">{{ productStandardDetail.barcode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品状态:</i-col>
              <i-col span="16">{{ productStandardDetail.shelvesStatus|customOrderStatusFilters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品规格:</i-col>
              <i-col span="16">{{ productStandardDetail.specification }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">数量/重量:</i-col>
              <i-col span="16">{{ productStandardDetail.standardQty }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品原价:</i-col>
              <i-col span="16">{{ productStandardDetail.price }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品单位:</i-col>
              <i-col span="16">{{ productStandardDetail.unitId }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品排序:</i-col>
              <i-col span="16">{{ productStandardDetail.rank }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :width="700">
      <p slot="header">
        <span>{{ productStandardDetail.id == ''?'创建商品规格':'编辑商品规格' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="productStandardDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <Col span="12">
            <FormItem label="商品ID:">
              {{ productStandardDetail.productId }}
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品名称:" prop="baseProductName">
              <Input v-model="productStandardDetail.baseProductName"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品分类:" prop="groupId">
              <Input v-model="productStandardDetail.groupId"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="基础单位:" prop="baseUnit">
              <Input v-model="productStandardDetail.baseUnit"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem v-if="productStandardDetail.product" label="商品主图:" prop="image">
              {{ productStandardDetail.image }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品编号:" prop="productCode">
              <Input v-model="productStandardDetail.productCode"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品条码:" prop="baseBarcode">
              <Input v-model="productStandardDetail.baseBarcode"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品描述:" prop="baseProductDescription">
              <Input v-model="productStandardDetail.baseProductDescription"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="上架商品名称:" prop="productName">
              <Input v-model="productStandardDetail.productName"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="上架商品描述:" prop="productDescription">
              <Input v-model="productStandardDetail.productDescription"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem v-if="productStandardDetail.image" label="上架商品主图:" prop="standardQty">
              {{ productStandardDetail.image }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem v-if="productStandardDetail.detailImage" label="上架商品详情图:" prop="standardQty">
              {{ productStandardDetail.detailImage }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品条码:" prop="barcode">
              <Input v-model="productStandardDetail.barcode"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品状态:" prop="shelvesStatus">
              <Select
                :value="productStandardDetail.shelvesStatus"
                @on-change="statusChange">
                <Option
                  v-for="(item,index) in shelvesStatus"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label
                  }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品规格:" prop="specification">
              <Input v-model="productStandardDetail.specification"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="数量/重量:" prop="standardQty">
              <InputNumber :min="0" v-model="productStandardDetail.standardQty"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品原价:" prop="price">
              <Input v-model="productStandardDetail.price"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="优惠价格:" prop="salePrice">
              <Input v-model="productStandardDetail.salePrice"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品单位:" prop="unitId">
              <Select v-model="productStandardDetail.unitId" @on-change="uniteChange">
                <Option
                  v-for="(item,index) in unitsList"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px">
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品排序:" prop="rank">
              <InputNumber :min="0" v-model="productStandardDetail.rank"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="规格单位:" prop="packagingUnit">
              <Select v-model="productStandardDetail.packagingUnit" @on-change="uniteChange">
                <Option
                  v-for="(item,index) in unitsList"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label
                  }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="规格描述:" prop="description">
              <Input v-model="productStandardDetail.description"></Input>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  createProductStandard,
  deleteProductStandard,
  getProductStandardsPages,
  editProductStandard
} from '@/api/mini-program';
import {
  productSpecificationsUnits
} from '@/api/fruitermaster';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { getGoodsStandard, fenToYuanDot2 } from '@/libs/util';
import { customPlanStatusConvert } from '@/libs/converStatus';

const productStandardDetail = {
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
  shelvesStatus: '',
  applyType: '',
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
  barcode: '',
  productCode: '',
  productName: '',
  shelvesStatus: null,
  minPrice: '',
  maxPrice: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, deleteMixin, searchMixin, tableMixin],
  data() {
    return {
      unitsList: [],
      ruleInline: {
        productName: [{ required: true, message: '请选择上架商品名称' }],
        baseProductName: [{ required: true, message: '请输入商品名称' }],
        groupId: [{ required: true, message: '请选择商品分类' }],
        baseUnit: [{ required: true, message: '请选择基础单位' }],
        productCode: [{ required: true, message: '请输入商品编码' }],
        baseBarcode: [{ required: true, message: '请输入商品条码' }],
        baseProductDescription: [{ required: true, message: '请输入商品描述' }],
        description: [{ required: true, message: '请输入商品描述' }],
        availableStatus: [{ required: true, message: '请选择商品分类' }],
        // packagingUnit: [{ required: true, message: '请选择规格单位' }],
        productDescription: [{ required: true, message: '请输入上架商品描述' }],
        shelvesStatus: [{ required: true, message: '请选择商品状态' }],
        specification: [{ required: true, message: '请输入商品规格' }],
        price: [{ required: true, message: '请输入商品价格' }],
        salePrice: [{ required: true, message: '请输入优惠价格' }],
        barcode: [
          { required: true, message: '请输入规格条码' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        specificationQty: [
          { required: true, message: '请输入安全库存' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        rank: [
          { required: true, message: '请输入商品排序' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        standardQty: [
          { required: true, message: '请输入重量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(value)) {
                errors.push(new Error('必须为大于0的数字'));
              }
              callback(errors);
            }
          }
        ]
      },
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '规格ID',
          key: 'id',
          minWidth: 180
        },
        {
          title: '商品条码',
          key: 'barcode',
          minWidth: 150
        },
        {
          title: '商品编号',
          key: 'productCode',
          minWidth: 150
        },
        {
          title: '商品名称',
          key: 'productName',
          minWidth: 120
        },
        {
          title: '商品规格',
          key: 'specification',
          minWidth: 120
        },
        {
          title: '商品单位',
          width: 100,
          key: 'productUnit'
        },
        {
          title: '商品原价',
          width: 120,
          key: 'price',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: '优惠价格',
          minWidth: 130,
          key: 'salePrice',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.salePrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: '商品状态',
          width: 120,
          key: 'shelvesStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.shelvesStatus === 'VALID') {
              return <div><tag color='success'>{customPlanStatusConvert(row.shelvesStatus).label}</tag></div>;
            } else if (row.shelvesStatus === 'INVALID') {
              return <div><tag color='error'>{customPlanStatusConvert(row.shelvesStatus).label}</tag></div>;
            }
            return <div><tag color='primary'>{customPlanStatusConvert(row.shelvesStatus).label}</tag></div>;
          }
        },
        {
          title: '商品排序',
          width: 120,
          key: 'rank'
        },
        {
          title: '操作',
          minWidth: 150,
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ],
      modalType: {
        view: 'view',
        edit: 'edit',
        create: 'create'
      },
      tempModalType: 'create',
      tableData: [],
      total: 0,
      loading: true,
      modalViewLoading: false,
      modalView: false,
      modalEdit: false,
      searchRowData: _.cloneDeep(roleRowData),
      productStandardDetail: _.cloneDeep(productStandardDetail),
      // 选中的行
      tableDataSelected: [],
      shelvesStatus: [
        {
          label: '上架',
          value: 'VALID'
        },
        {
          label: '下架',
          value: 'INVALID'
        }]
    };
  },
  created() {
    this.unitsList = this.$route.params.unitsList;
    productSpecificationsUnits().then(res => {
      res.forEach(value => {
        const map = { label: 'label', value: 'value' };
        map.value = value;
        map.label = value;
        this.unitsList.push(map);
        // this.createLoading = false;
      });
      // this.getTableData();
    });
    this.createLoading = false;
    this.getTableData();
  },
  methods: {
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    poptipOk() {
      if (this.tableDataSelected.length < 1) {
        this.$Message.warning('请选中要删除的行');
        return;
      }
      const tempDeleteList = [];
      this.tableDataSelected.filter(value => {
        tempDeleteList.push(value.id);
      });
      const strTempDelete = tempDeleteList.join(',');
      this.deleteTable(strTempDelete);
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteProductStandard({
        ids
      }).then(res => {
        const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
        if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
          this.searchRowData.page -= 1;
        }
        this.tableDataSelected = [];
        this.getTableData();
      }
      ).catch(() => {
        this.loading = false;
      });
    },
    uniteChange(value) {
      this.productStandardDetail.packagingUnit = value;
    },
    useAbleUniteChange(value) {
      this.productStandardDetail.availableStatus = value;
    },
    handleClose() {
      this.modalView = false;
    },
    handleEditClose() {
      this.productStandardDetail = productStandardDetail;
      this.productStandardDetail.productId = this.$route.params.id;
      this.modalEdit = false;
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.productStandardDetail = params.row;
      this.modalView = true;
    },
    handleEdit(params) {
      // this.$refs.modalEdit.resetFields();
      this.tempModalType = this.modalType.edit;
      this.productStandardDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleCreateView() {
      // this.$refs.modalEdit.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.productStandardDetail = this._.cloneDeep(productStandardDetail);
      }
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    createStandard() {
      this.modalViewLoading = true;
      createProductStandard({
        productId: this.$route.params.id,
        ...this.productStandardDetail
      }).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      }).catch(() => {
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createStandard();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editProductStandard();
          }
        } else {
          this.$Message.error('请完善商品的信息!');
        }
      });
    },
    editProductStandard() {
      this.modalViewLoading = true;
      editProductStandard({
        ...this.productStandardDetail
      }).then(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.productStandardDetail = productStandardDetail;
        this.productStandardDetail.productId = this.$route.params.id;
        this.getTableData();
      }).catch(() => {
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    changePage(page) {
      this.searchRowData.page = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.searchRowData.page = 1;
      this.searchRowData.rows = pageSize;
      this.getTableData();
    },
    getTableData() {
      // const goodsStandard = getGoodsStandard();
      // this.searchRowData.productId = goodsStandard.id;
      // this.productStandardDetail.productId = goodsStandard.id;
      // this.productStandardDetail.productName = goodsStandard.name;
      getProductStandardsPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
      }).catch(() => {
        this.loading = false;
        this.searchLoading = false;
      });
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
    },
    statusChange(value) {
      this.productStandardDetail.shelvesStatus = value;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
