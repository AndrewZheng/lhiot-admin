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
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-delete="handleDelete"
        @custom-on-sale="customOnSale"
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
          <Button v-waves v-show="showBack" class="search-btn ml5 mr5" type="primary" @click="goBack">
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
          <Button v-waves class="search-btn ml5 mr5" type="success" @click="handleCreateView">
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
              <i-col span="8">商品主图:</i-col>
              <i-col span="16"><img :src="productStandardDetail.baseImage" width="100" height="100"></i-col>
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
              <i-col span="16">{{ productStandardDetail.shelvesStatus|customPlanStatusFilters }}</i-col>
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
              <i-col span="16">{{ productStandardDetail.price|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">出售价格:</i-col>
              <i-col span="16">{{ productStandardDetail.salePrice|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品单位:</i-col>
              <i-col span="16">{{ unitsList != null ? unitsList.find(item => productStandardDetail.unitId === item.value).label : null }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品排序:</i-col>
              <i-col span="16">{{ productStandardDetail.rank }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">规格描述:</i-col>
              <i-col span="16">
                <div v-for="item in descriptionList" :key="item.id" :v-show="descriptionList" class="demo-upload-list">
                  <img :src="item">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                  </div>
                </div>
              </i-col>
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
            <FormItem label="商品ID:" prop="productId">
              {{ productStandardDetail.productId }}
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品名称:">
              {{ productStandardDetail.baseProductName }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品分类:">
              {{ productStandardDetail.groupId }}
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="基础单位:">
              {{ productStandardDetail.baseUnit }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品编号:">
              {{ productStandardDetail.productCode }}
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品条码:">
              {{ productStandardDetail.baseBarcode }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem v-if="productStandardDetail.baseImage" label="商品主图:">
              <img :src="productStandardDetail.baseImage" width="100" height="100">
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品描述:">
              {{ productStandardDetail.baseProductDescription }}
            </FormItem>
            </Col>
          </Row>
          <Divider orientation="center">规格信息</Divider>
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
            <FormItem label="上架商品主图:建议尺寸;400x400(单位:px):" prop="image" >
              <Input v-show="false" v-model="productStandardDetail.image" style="width: auto"></Input>
              <div v-for="item in uploadListMain" :key="item.url" :v-show="productStandardDetail.image" class="demo-upload-list">
                <template v-if="item.status === 'finished'">
                  <div>
                    <img :src="item.url">
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
                <div slot="content">
                  <Button type="primary">
                    上传图片
                  </Button>
                </div>
              </IViewUpload>
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
              <Select :value="productStandardDetail.shelvesStatus" @on-change="statusChange">
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
              <InputNumber
                :min="0"
                :value="priceComputed"
                placeholder="商品原价"
                @on-change="priceInputNumberOnchange"></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="出售价格:">
              <InputNumber
                :min="0"
                :value="salePriceComputed"
                placeholder="出售价格"
                @on-change="salePriceInputNumberOnchange"></InputNumber>
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
            <FormItem label="规格描述:建议尺寸;400x400(单位:px):" prop="description" >
              <Input v-show="false" v-model="productStandardDetail.description" style="width: auto"></Input>
              <div v-for="item in uploadListMultiple" :key="item.url" :v-show="productStandardDetail.description" class="demo-upload-list">
                <template v-if="item.status === 'finished'">
                  <div>
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemoveMultiple(item)"></Icon>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <IViewUpload
                ref="uploadMultiple"
                :default-list="defaultListMultiple"
                :image-size="imageSize"
                :max-num="5"
                multiple
                @on-success="handleSuccessMultiple"
              >
                <div slot="content">
                  <Button type="primary">
                    上传图片
                  </Button>
                </div>
              </IViewUpload>
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

    <Modal v-model="uploadVisible" title="View Image">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  createProductStandard,
  deleteProductStandard,
  getProductStandardsPages,
  editProductStandard
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { getSmallGoodsStandard, fenToYuanDot2, fenToYuanDot2Number, yuanToFenNumber } from '@/libs/util';
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
  description: null,
  shelvesStatus: null,
  applyType: '',
  productName: '',
  createUser: null,
  image: null,
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
  productId: '',
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
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, deleteMixin, searchMixin, tableMixin],
  data() {
    return {
      unitsList: [],
      descriptionList: [],
      defaultListMain: [],
      defaultListMultiple: [],
      uploadListMain: [],
      uploadListMultiple: [],
      ruleInline: {
        productId: [{ required: true, message: '请选择关联商品' }],
        productName: [{ required: true, message: '请选择上架商品名称' }],
        description: [{ required: true, message: '请上传规格描述图' }],
        image: [{ required: true, message: '请上传上架商品主图' }],
        availableStatus: [{ required: true, message: '请选择商品分类' }],
        unitId: [{ required: true, message: '请选择商品单位' }],
        productDescription: [{ required: true, message: '请输入上架商品描述' }],
        shelvesStatus: [{ required: true, message: '请选择商品状态' }],
        specification: [{ required: true, message: '请输入商品规格' }],
        price: [
          { required: true, message: '请输入商品价格' },
          { message: '必须为大于0的数字', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/ }
        ],
        barcode: [
          { required: true, message: '请输入商品条码' },
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
          title: '出售价格',
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
          minWidth: 170,
          key: 'handle',
          options: ['customOnSale', 'view', 'edit', 'delete']
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
      showBack: false,
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
  computed: {
    priceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.price);
    },
    salePriceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.salePrice);
    }
  },
  created() {
    this.unitsList = this.$route.params.unitsList;
    this.showBack = this.$route.name === 'small-goods-relation-standard';
    console.log('showBack:' + this.showBack);
    // productSpecificationsUnits().then(res => {
    //   res.forEach(value => {
    //     const map = { label: 'label', value: 'value' };
    //     map.value = value;
    //     map.label = value;
    //     this.unitsList.push(map);
    //     // this.createLoading = false;
    //   });
    //   // this.getTableData();
    // });
    // this.createLoading = false;
    this.getTableData();
  },
  methods: {
    priceInputNumberOnchange(value) {
      this.productStandardDetail.price = yuanToFenNumber(value);
    },
    salePriceInputNumberOnchange(value) {
      this.productStandardDetail.salePrice = yuanToFenNumber(value);
    },
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
    handleClose() {
      this.modalView = false;
    },
    // handleEditClose() {
    //   this.productStandardDetail = productStandardDetail;
    //   this.productStandardDetail.productId = this.$route.params.id;
    //   this.modalEdit = false;
    // },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.productStandardDetail = params.row;
      if (this.productStandardDetail.description != null) {
        this.descriptionList = this.productStandardDetail.description.split(',');
      }
      this.modalView = true;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.productStandardDetail = this._.cloneDeep(params.row);
      if (this.productStandardDetail.description != null) {
        this.descriptionList = this.productStandardDetail.description.split(',');
      }
      this.setDefaultUploadList(params.row);
      this.$refs.modalEdit.resetFields();
      this.modalEdit = true;
    },
    handleCreateView() {
      this.$refs.modalEdit.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.productStandardDetail = this._.cloneDeep(productStandardDetail);
      }
      this.tempModalType = this.modalType.create;
      this.productStandardDetail.description = null;
      this.productStandardDetail.standardQty = 0;
      this.productStandardDetail.rank = 0;
      this.setDefaultUploadList(this.productStandardDetail);
      this.modalEdit = true;
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
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
      if ((this.productStandardDetail.salePrice != null) && (this.productStandardDetail.salePrice <= 0)) {
        this.$Message.error('出售价不能小于0');
        return;
      }
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
        // this.productStandardDetail = productStandardDetail;
        // this.productStandardDetail.productId = this.$route.params.id;
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
      // 获取商品页面传过来的商品信息
      if (this.$route.name === 'small-goods-relation-standard') {
        const goodsStandard = getSmallGoodsStandard();
        if (goodsStandard != null && goodsStandard !== '') {
        // 给商品规格的商品和搜索条件赋值
          this.searchRowData.productId = goodsStandard.id;
          this.productStandardDetail = this._.cloneDeep(goodsStandard);
          this.productStandardDetail.productId = goodsStandard.id;
          this.productStandardDetail.baseUnit = goodsStandard.unitName;
          this.productStandardDetail.baseProductName = goodsStandard.productName;
          this.productStandardDetail.baseImage = goodsStandard.image;
          this.productStandardDetail.image = goodsStandard.image;
          this.productStandardDetail.baseProductDescription = goodsStandard.description;
          this.productStandardDetail.productDescription = goodsStandard.description;
          this.unitsList = goodsStandard.unitsList;
        }
      }
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
    },
    // 上架商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.productStandardDetail.image = null;
      this.productStandardDetail.image = fileList[0].url;
    },
    // 上架规格描述图
    handleSuccessMultiple(response, file, fileList) {
      this.uploadListMultiple = fileList;
      this.descriptionList = [];
      fileList.forEach(value => {
        if (value.url) {
          this.descriptionList.push(value.url);
        }
      });
      this.productStandardDetail.description = '';
      this.productStandardDetail.description = this.descriptionList.join(',');
      console.log(this.productStandardDetail.description);
      console.log(JSON.stringify(this.productStandardDetail.description));
    },
    // 设置编辑图片列表
    setDefaultUploadList(res) {
      if (res.image != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.image;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
      if (res.description != null) {
        const descriptionImgArr = [];
        const descriptionArr = res.description.split(',');
        descriptionArr.forEach(value => {
          const innerMapDetailImg = { status: 'finished', url: 'url' };
          innerMapDetailImg.url = value;
          descriptionImgArr.push(innerMapDetailImg);
        });
        this.$refs.uploadMultiple.setDefaultFileList(descriptionImgArr);
        this.uploadListMultiple = descriptionImgArr;
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.productStandardDetail.image = null;
    },
    handleRemoveMultiple(file) {
      this.$refs.uploadMultiple.deleteFile(file);
      const index = this.descriptionList.indexOf(file.url);
      if (index > -1) {
        this.descriptionList.splice(index, 1);
        this.productStandardDetail.description = this.descriptionList.join(',');
      }
      if (this.descriptionList.length === 0) {
        this.$refs.uploadMultiple.clearFileList();
        this.descriptionList = null;
        this.productStandardDetail.description = null;
      }
    },
    customOnSale(params) {
      const rowData = this._.cloneDeep(params.row);
      if (params.row.shelvesStatus === 'VALID') {
        rowData.shelvesStatus = 'INVALID';
      } else {
        rowData.shelvesStatus = 'VALID';
      }
      this.loading = true;
      editProductStandard(rowData).then(res => {
        this.$Message.success('修改成功!');
      }).finally(res => {
        this.loading = false;
        this.modalViewLoading = false;
        this.getTableData();
        this.modalEdit = false;
      });
    },
    goBack() {
      this.turnToPage('small-goods-info');
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
