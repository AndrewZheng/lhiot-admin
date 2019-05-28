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
        @on-edit="handleEdit"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <!-- <Input
              v-model="searchRowData.barcode"
              placeholder="商品条码"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input> -->
            <Input
              v-model="searchRowData.productName"
              placeholder="商品名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Select v-model="searchRowData.status" placeholder="商品状态" style="padding-right: 5px;width: 100px">
              <Option
                v-for="(item,index) in couponStatusEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
              >{{ item.label }}
              </Option>
            </Select>
            <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addEntityExchange">
            <Icon type="md-add"/>
            创建
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
              批量删除
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
            @on-page-size-change="changePageSize"></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalAdd"
      :width="1000"
      draggable
      scrollable
      @on-visible-change="handleModalAdd"
    >
      <p slot="header">
        <i-col>配置实物兑换</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <Form ref="addForm" :model="addRelationDetail" :rules="relationRuleInline" :label-width="80">
            <Row>
              <i-col span="6">
                <FormItem label="商品名称:" prop="productName">
                  <Input v-model="addRelationDetail.productName"><Button slot="append" icon="ios-search" @click="handleRelation"></Button></Input>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="商品单位:" prop="unitName">
                  <Input v-model="addRelationDetail.unitName"></Input>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="数量/重量:" prop="standardQty">
                  <Input v-model="addRelationDetail.standardQty"></Input>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="商品规格ID:" prop="standardId">
                  {{ addRelationDetail.standardId }}
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="商品条码:" prop="barcode">
                  {{ addRelationDetail.barcode }}
                </FormItem>
              </i-col>
               <i-col span="6">
                <FormItem label="商品规格:" prop="standardId">
                  {{ addRelationDetail.standardId }}
                </FormItem>
              </i-col>
               <i-col span="6">
                <FormItem label="基础重量:" prop="baseQty">
                  {{ addRelationDetail.baseQty }}
                </FormItem>
              </i-col>
               <i-col span="6">
                <FormItem label="基础单位:" prop="baseUnitName">
                  {{ addRelationDetail.baseUnitName }}
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="商品主图:" prop="image">
                 <img :src="addRelationDetail.image" width="100" height="100">
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="商品详情图:" prop="detailImage">
                  <img :src="addRelationDetail.detailImage" width="100" height="100">
                </FormItem>
              </i-col>
            </Row>

            <Divider>关联商品后配置</Divider>

            <Row>
              <i-col span="6">
                <FormItem label="实物类型:" prop="entityType">
                  <Select v-model="addRelationDetail.entityType" placeholder="实物类型" style="padding-right: 5px;width: 120px">
                      <Option
                        v-for="(item,index) in entityTypeEnum"
                        :value="item.value"
                        :key="index"
                        class="ptb2-5"
                        style="padding-left: 5px;width: 100px">{{ item.label }}
                      </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="兑换积分" prop="points">
                  <InputNumber :min="0" v-model="addRelationDetail.points" label="兑换积分" style="width: 160px"></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="促销积分:" prop="realPoints">
                  <InputNumber :min="0" v-model="addRelationDetail.realPoints" label="促销积分" style="width: 160px"></InputNumber>
                </FormItem>
              </i-col>
               <i-col span="6">
                <FormItem label="兑换价格" prop="price">
                  <InputNumber :min="0" v-model="addRelationDetail.price" label="兑换价格" style="width: 160px"></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="是否限会员可兑:" prop="memberLimitType">
                   <i-switch v-model="addRelationDetail.memberLimitType" size="large">
                      <span slot="open">ON</span>
                      <span slot="close">OFF</span>
                  </i-switch>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="每人限兑:" prop="receiveLimit">
                  <InputNumber :min="0" v-model="addRelationDetail.receiveLimit" label="限兑数量"></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="兑换总数:" prop="entityLimit">
                  <InputNumber :min="0" v-model="addRelationDetail.entityLimit" label="限购数量"></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="兑换说明：" prop="exchangeRemark">
                    <Input v-model="addRelationDetail.exchangeRemark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="请输入兑换说明，使用&符号换行"></Input>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="tempModalType=='create'? handleTemplateAdd('add'):handleTemplateAdd('edit')">确定
        </Button>
      </div>
    </Modal>

    <Modal
      v-model="modalRelation"
      :width="1200"
      :z-index="1024"
      draggable
    >
      <tables
        ref="tables"
        v-model="couponTemplateData"
        :columns="proStandardColumns"
        :loading="tempTableLoading"
        border
        searchable
        search-place="top"
        @on-row-click="handleChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input v-model="searchTemplateRowData.productCode" placeholder="商品条码" class="search-input mr5" style="width: auto" clearable></Input>
            <Input v-model="searchTemplateRowData.productName" placeholder="商品名称" class="search-input mr5" style="width: auto" clearable></Input>
            <!-- <Select v-model="searchTemplateRowData.couponType" placeholder="商品状态" style="padding-right: 5px;width: 100px" clearable>
              <Option
                v-for="(item,index) in couponTypeEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px">{{ item.label }}
              </Option>
            </Select> -->
            <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleTemplateSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleTemplateClear">
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
            :page-size="searchTemplateRowData.rows"
            :page-size-opts="templatePageOpts"
            show-sizer
            show-total
            @on-change="changeProductPage"
            @on-page-size-change="changeProductPageSize"></Page>
        </Row>
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
  getEntityExchangePages,
  deleteEntityExchange,
  createEntityExchange,
  editEntityExchange,
  getEntityTemplatePages,
  getProductStandardsPages,
  getHdCouponActivitiesPages
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { couponStatusConvert, couponTypeConvert, couponScopeConvert, couponUseLimitConvert, customPlanStatusConvert } from '@/libs/converStatus';
import { couponStatusEnum, couponTypeEnum, couponScopeEnum, couponUseLimitEnum, validDateTypeEnum, entityTypeEnum } from '@/libs/enumerate';
import { compareData, getSmallCouponActivity, fenToYuanDot2, fenToYuanDot2Number, yuanToFenNumber } from '@/libs/util';

const relationDetail = {
  baseQty: 0,
	baseUnitName: '',
  description: '',
  detailImage: null,
  entityLimit: 0,
  entityType: 'COMMON_GOODS', //COMMON_GOODS(普通商品),PERIPHERY_GOODS(周边商品)
  exchangeRemark: '',
  id: 0,
  image: null,
  memberLimitType: 'ALL', // (ALL(所有会员) 默认不限制会员兑换
  points: 0,
  price: 0,
  productName: '',
  rank: 0,
  realPoints: 0,
  receiveCount: 0,
  receiveLimit: 0,
  standardId: 0,
  standardQty: 0,
  status: '',
  unitId: 0,
  unitName: '',
  barcode: '', // inherit
}

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
  // status: '',
  productName: null,
  // barcode: '',
  page: 1,
  rows: 10
};

const templateRowData = {
  productId: '',
  barcode: '',
  productCode: '',
  productName: '',
  shelvesStatus: null,
  page: 1,
  rows: 5
};

const dataColumns= [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '商品条码',
    key: 'barcode',
    minWidth: 80
  },
  {
    title: '商品名称',
    key: 'productName',
    minWidth: 80
  },
  {
    title: '商品规格',
    key: 'standardQty',
    minWidth: 80
  },
  {
    title: '商品状态',
    key: 'status',
    minWidth: 30,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.status === 'VALID') {
        return <div><tag color='success'>上架</tag></div>;
      } else if (row.status === 'INVALID') {
        return <div><tag color='error'>下架</tag></div>;
      }else{
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '是否限制会员可兑',
    key: 'memberLimitType',
    minWidth: 40,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.memberLimitType != 'ALL') {
        return <div><tag color='success'>限制</tag></div>;
      } else {
        return <div><tag color='error'>不限制</tag></div>;
      }
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    minWidth: 80
  },
  {
    title: '操作',
    minWidth: 80,
    key: 'handle',
    options: ['edit', 'delete']
  }
];

const proStandardColumns= [
  {
    type: 'selection',
    key: '',
    minWidth: 60,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '规格ID',
    key: 'id',
    minWidth: 80
  },
  {
    title: '商品条码',
    key: 'barcode',
    minWidth: 80
  },
  {
    title: '商品编号',
    key: 'productCode',
    minWidth: 100
  },
  {
    title: '商品名称',
    key: 'productName',
    minWidth: 100
  },
  {
    title: '商品规格',
    key: 'specification',
    minWidth: 100
  },
  {
    title: '商品单位',
    minWidth: 100,
    key: 'productUnit'
  },
  {
    title: '商品原价',
    minWidth: 120,
    key: 'price',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: '售卖价格',
    minWidth: 120,
    key: 'salePrice',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.salePrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: '商品状态',
    minWidth: 100,
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
  }
]

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      ruleInline: {
        effectiveStartTime: [{ required: true, message: '请选择生效时间' }],
        effectiveEndTime: [{ required: true, message: '请选择失效时间' }],
        couponLimit: [
          { required: true, message: '请输入发券限制数量' },
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
      relationRuleInline: {
        effectiveStartTime: [{ required: false, message: '请选择生效时间' }],
        effectiveEndTime: [{ required: false, message: '请选择失效时间' }],
        couponScope: [{ required: true, message: '请选择券使用范围' }],
        receiveLimit: [{ required: true, message: '请输入每人限兑数量' },
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
        couponLimit: [{ required: true, message: '请输入发券限制数量' },
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
      couponStatusEnum,
      couponTypeEnum,
      couponScopeEnum,
      couponUseLimitEnum,
      validDateTypeEnum,
      entityTypeEnum,
      dataColumns: dataColumns,
      proStandardColumns: proStandardColumns,
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
      hdCouponTemplateData: [],
      couponTemplateTotal: 0,
      couponHdTemplateTotal: 0,
      modalAdd: false,
      modalRelation: false
    };
  },
  computed: {
    minBuyFeeComputed() {
      return fenToYuanDot2Number(this.relationDetail.minBuyFee);
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);// 刷新清除上次搜索结果
    this.getTableData();
  },
  methods: {
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      console.log('row:', params.row);
      this.addRelationDetail = _.cloneDeep(params.row);
      this.modalAdd= true;
    },
    handleModalAdd(isShow){
      // 如果是创建则先清除对象
      if(isShow && this.tempModalType === this.modalType.create){
        this.$refs.addForm.resetFields();
        this.addRelationDetail= _.cloneDeep(relationDetail);
      }
    },
    addEntityExchange(){
      this.modalAdd= true;
      this.getProStandardData();
    },
    handleRelation(){
      this.modalRelation= true;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalCreate.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
    },
    getTableData() {
      getEntityExchangePages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    getProStandardData() {
      getProductStandardsPages(this.searchTemplateRowData).then(res => {
        this.couponTemplateData = res.rows;
        this.couponTemplateTotal = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(() => {
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    changeProductPage(page) {
      this.searchTemplateRowData.page = page;
      this.getProStandardData();
    },
    changeProductPageSize(pageSize) {
      this.searchTemplateRowData.page = 1;
      this.searchTemplateRowData.rows = pageSize;
      this.getProStandardData();
    },
    handleTemplateSearch() {
      this.searchTemplateRowData.page = 1;
      this.searchLoading = true;
      this.getProStandardData();
    },
    handleTemplateClear() {
      this.clearSearchLoading = true;
      this.searchTemplateRowData= _.cloneDeep(templateRowData);
      this.handleTemplateSearch();
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.addRelationDetail.validDateType=='FIXED_DATE' &&
            compareData(this.addRelationDetail.effectiveStartTime, this.addRelationDetail.effectiveEndTime)) {
            this.$Message.error('结束时间必须大于开始时间!');
            return;
          }
          if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.tempTableLoading = true;
            editCouponExchange(this.addRelationDetail).then(res => {
              this.modalEdit = false;
              this.$Message.success('修改成功!');
              this.getTableData();
            }).finally(res => {
              this.tempTableLoading = false;
            });
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    handleTemplateAdd(name) {
      this.modalViewLoading = true;
      console.log('before create:', this.addRelationDetail);
      if(name === 'add'){
        createEntityExchange(this.addRelationDetail).then(res => {
          this.modalViewLoading = false;
          this.$Message.success('创建成功!');
          this.modalAdd = false;
          this.getTableData();
        }).catch(() => {
          this.modalViewLoading = false;
        });
      }else{
        editEntityExchange(this.addRelationDetail).then(res => {
          this.modalViewLoading = false;
          this.$Message.success('修改成功!');
          this.modalAdd = false;
          this.getTableData();
        }).catch(() => {
          this.modalViewLoading = false;
        });
      }
    },
    handleChange(row, index) {
      // 关联选择相关规格的商品
      this.addRelationDetail.baseQty = row.baseQty;
      this.addRelationDetail.baseUnitName = row.baseUnit;
      this.addRelationDetail.description = row.description;
      // TODO: 规格管理欠补充字段
      this.addRelationDetail.detailImage = row.detailImage;
      this.addRelationDetail.image= row.image;
      this.addRelationDetail.standardId = row.id;
      this.addRelationDetail.standardQty= row.standardQty;
      this.addRelationDetail.productName = row.productName;
      this.addRelationDetail.barcode = row.barcode; // 商品条码
      this.addRelationDetail.unitId = row.unitId;
      this.addRelationDetail.unitName= row.productUnit;
      this.modalRelation=false;
    },
    handleAddClose() {
      this.modalAdd = false;
    },
    // 批量删除-单行删除内部也是调用此方法
    deleteTable(ids) {
      this.tempTableLoading = true;
      deleteEntityExchange({ ids }).then(res => {
        const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
        if (this.tableData.length == this.tableDataSelected.length && 
        this.searchRowData.page === totalPage && 
        this.searchRowData.page !== 1) {
          this.searchRowData.page -= 1;
        }
        this.tableDataSelected = [];
        this.getTableData();
      }).finally(res => {
        this.tempTableLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
