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
        @on-sale="onSale"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.name"
              placeholder="上架名称"
              class="search-input mr5"
              style="width: auto"
            ></Input>
            <Input
              v-model="searchRowData.keyword"
              placeholder="规格条码"
              class="search-input mr5"
              style="width: auto"
            ></Input>
            <Button
              v-waves
              :loading="searchLoading"
              class="search-btn mr5"
              type="primary"
              @click="handleSearch"
            >
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh"/>&nbsp;清除
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addChildren">
            <Icon type="md-add"/>添加
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="handleBatchDel"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash"/>删除
            </Button>
          </Poptip>
          <!-- 多类型导出 -->
          <BookTypeOption v-model="exportType" class="mr5"/>
          <Button
            :loading="downloadLoading"
            class="search-btn mr5"
            type="primary"
            @click="handleDownload"
          >
            <Icon type="md-download"/>导出
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalView" :mask-closable="false" :width="750">
      <p slot="header">
        <span>商品上架详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="16">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="3">商品规格:</i-col>
              <i-col span="21">{{ productDetail.specificationInfo }}</i-col>
            </Row>
          </i-col>
          <i-col span="8">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架名称:</i-col>
              <i-col span="16">{{ productDetail.name }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="16">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="3">上架份数:</i-col>
              <i-col span="21">{{ productDetail.shelfQty }}</i-col>
            </Row>
          </i-col>
          <i-col span="8">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品排序:</i-col>
              <i-col span="16">{{ productDetail.sorting }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="2">上架描述:</i-col>
              <i-col span="22">{{ productDetail.description }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="16">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="3">商品原价:</i-col>
              <i-col span="21">{{ productDetail.originalPrice|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="8">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品特价:</i-col>
              <i-col span="16">{{ productDetail.price|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">是否上架:</i-col>
              <i-col span="18">{{ productDetail.shelfStatus|onSaleStatusFilters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8">
              <i-col span="4">上架主图:</i-col>
              <img :src="productDetail.image" span="18" style="width: 350px">
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :mask-closable="false" :width="750">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改商品上架信息':'创建商品上架信息' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="productDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="12">
            <FormItem label="商品规格:" prop="specificationId">
              <Select
                v-if="tempModalType===modalType.create"
                ref="shelfSpecificationSelect"
                :remote="true"
                :filterable="true"
                :remote-method="remoteMethod"
                :disabled="tempModalType===modalType.edit?true:false"
                :loading="shelfSpecificationLoading"
              >
                <Option
                  v-for="(option, index) in optionsShelfSpecification"
                  :value="option.id"
                  :key="index"
                  class="pb5 pt5 pl15"
                  @click.native="selectIndex(option)"
                >{{ option.specificationInfo }}</Option>
              </Select>
              <Input v-else :value="shelfSpecificationEditDefault" disabled></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="上架名称:" prop="name">
              <Input v-model="productDetail.name" placeholder="上架名称"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="上架份数:" prop="shelfQty">
              <InputNumber
                :min="0"
                v-model="productDetail.shelfQty"
                size="large"
                style="width: 160px"
              ></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品排序:" prop="sorting">
              <InputNumber
                :min="0"
                v-model="productDetail.sorting"
                size="large"
                style="width: 160px"
              ></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="上架描述:">
              <Input v-model="productDetail.description" placeholder="上架描述"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品原价:¥" prop="originalPrice">
              <InputNumber
                :min="0"
                :value="originalPriceComputed"
                placeholder="商品原价"
                @on-change="originalPriceInputNumberOnchange"
              ></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品特价:¥" prop="price">
              <InputNumber
                :min="0"
                :value="priceComputed"
                placeholder="商品特价"
                @on-change="priceInputNumberOnchange"
              ></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="是否上架:" prop="shelfStatus">
              <Select
                :value="productDetail.shelfStatus"
                style="width: 100px"
                @on-change="useAbleUniteChange"
              >
                <Option
                  v-for="(item,index) in useAble"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >
                  {{ item.label
                  }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="应用类型:" prop="applicationType">
              <Select
                :value="productDetail.applicationType"
                :disabled="applicationType===null?false:true"
                clearable
                style="width: 100px"
                @on-change="applicationTypeChange"
              >
                <Option
                  v-for="(item,index) in applicationTypeList"
                  :value="item.code"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem :label-width="80" label="商品主图:建议尺寸;400x400(单位:px)" prop="image">
              <Input v-show="false" v-model="productDetail.image" style="width: auto"></Input>
              <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
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
                <div slot="content" style="width:58px;height:58px;line-height:58px">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </IViewUpload>
            </FormItem>
          </Row>
          <Row v-show="false">
            <Col span="24">
            <FormItem label="上架板块:">
              <div v-for="item in uiPositionData" :key="item.id">
                <div>{{ item.description }}:</div>
                <CheckboxGroup v-model="model" @on-change="checkAllGroupChange">
                  <Checkbox
                    v-for="innerItem in item.productSections"
                    ref="checkBox"
                    :key="innerItem.id"
                    :label="innerItem.id"
                  >{{ innerItem.sectionName }}</Checkbox>
                </CheckboxGroup>
              </div>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定</Button>
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
  getuiPositionsPages,
  createProductShelve,
  deleteProductShelve,
  editProductShelve,
  getProductShelvesPages,
  getProductSpecificationsPages
} from '@/api/fruitermaster';
import { getDictionary } from '@/api/basic';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import { positionType, YNEnum } from '@/libs/enumerate';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from '@/libs/util';
import BookTypeOption from '_c/book-type-option';
import { onSaleStatusConvert } from '@/libs/converStatus';

const productDetail = {
  id: 0,
  image: '',
  name: '',
  originalPrice: null,
  price: null,
  productName: '',
  productImage: '',
  productSpecification: null,
  sectionIds: '',
  shelfQty: 0,
  shelfStatus: '',
  shelfType: 'NORMAL',
  sorting: 0,
  specificationId: 0,
  specificationInfo: '',
  applicationType: null
};
const roleRowData = {
  applicationType: null,
  productName: '',
  name: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload,
    BookTypeOption
  },
  mixins: [uploadMixin, tableMixin],
  data() {
    const validatePrice = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('特价不能为空'));
      } else if (value <= 0) {
        callback(new Error('特价不能小于0'));
      } else if (value > this.productDetail.originalPrice) {
        callback(new Error('特价不能大于原价'));
      } else {
        callback();
      }
    };
    return {
      shelfSpecificationEditDefault: '',
      shelfSpecificationLoading: false,
      optionsShelfSpecification: [],
      list: [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New hampshire',
        'New jersey',
        'New mexico',
        'New york',
        'North carolina',
        'North dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode island',
        'South carolina',
        'South dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West virginia',
        'Wisconsin',
        'Wyoming'
      ],
      createLoading: false,
      model: [],
      uiPositionData: [],
      originalUiPositionData: [],
      ruleInline: {
        originalPrice: [
          { required: true, message: '请输入商品原价' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        price: [
          { required: true, validator: validatePrice }
          // { message: '必须为大于0的数字', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/ }
        ],
        specificationId: [
          { required: true, message: '请输入商品规格', pattern: /^[1-9]\d*$/ }
        ],
        image: [{ required: true, message: '请上传图片' }],
        name: [{ required: true, message: '请输入上架名称' }],
        shelfQty: [
          { required: true, message: '请输入上架份数' },
          { message: '必须为非零整数', pattern: /^[1-9]\d*$/ }
        ],
        sorting: [
          { required: true, message: '请输入商品排序' },
          { message: '必须为非零整数', pattern: /^[1-9]\d*$/ }
        ],
        shelfStatus: [
          { required: true, message: '请选择是否上架', trigger: 'blur' }
        ],
        applicationType: [{ required: true, message: '请输入应用类型' }]
      },
      useAble: [{ label: '是', value: 'ON' }, { label: '否', value: 'OFF' }],
      defaultListMain: [],
      uploadListMain: [],
      modalViewLoading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '上架图片',
          key: 'image',
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            const str = (
              <img
                src={row.image}
                style='margin-top:5px'
                height='60'
                width='60'
                margin-top='10px'
              />
            );
            return <div>{str}</div>;
          }
        },
        {
          title: '商品名称',
          key: 'productName',
          width: 150
        },
        {
          title: '上架名称',
          width: 150,
          key: 'name'
        },
        {
          title: '上架规格',
          width: 150,
          key: 'shelfSpecification'
        },
        {
          title: '规格条码',
          width: 150,
          key: 'barcode'
        },
        {
          title: '商品原价',
          minWidth: 120,
          key: 'originalPrice',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.originalPrice)}</div>;
          }
        },
        {
          title: '商品特价',
          minWidth: 120,
          key: 'price',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.price)}</div>;
          }
        },
        {
          title: '排序',
          minWidth: 80,
          key: 'sorting',
          sortable: true
        },
        {
          title: '是否上架',
          minWidth: 80,
          key: 'shelfStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.shelfStatus === 'ON') {
              return (
                <div>
                  <tag color='success'>
                    {onSaleStatusConvert(row.shelfStatus).label}
                  </tag>
                </div>
              );
            } else if (row.shelfStatus === 'OFF') {
              return (
                <div>
                  <tag color='error'>
                    {onSaleStatusConvert(row.shelfStatus).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>
                  {onSaleStatusConvert(row.shelfStatus).label}
                </tag>
              </div>
            );
          }
        },
        {
          title: '应用类型',
          minWidth: 120,
          key: 'applicationType',
          sortable: true,
          render: (h, params, vm) => {
            const { row } = params;
            const filterObj = this.applicationTypeList.find(item => {
              return item.code === row.applicationType;
            });
            // if (JSON.stringify(filterObj) !== '{}') {
            return (
              <div>
                {filterObj !== null ? filterObj.name : row.applicationType}
              </div>
            );
          }
        },
        {
          title: '操作',
          minWidth: 170,
          key: 'handle',
          options: ['view', 'edit', 'delete', 'onSale']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      productDetail: productDetail,
      exportExcelLoading: false,
      exportType: 'xlsx',
      downloadLoading: false,
      applicationTypeList: []
    };
  },
  computed: {
    originalPriceComputed() {
      return fenToYuanDot2Number(this.productDetail.originalPrice);
    },
    priceComputed() {
      return fenToYuanDot2Number(this.productDetail.price);
    }
  },
  mounted() {
    this.getApplications();
  },

  created() {
    this.loading = true;
    this.createLoading = true;
    this.searchRowData = _.cloneDeep(roleRowData);
    getuiPositionsPages({
      applicationType: this.applicationType,
      includeSection: YNEnum.YES,
      positionType: positionType.PRODUCT,
      page: 0,
      rows: 0
    })
      .then(res => {
        this.uiPositionData = res.array;
        this.originalUiPositionData = _.cloneDeep(this.uiPositionData);
        this.createLoading = false;
        this.getTableData();
      })
      .catch(() => {
        this.createLoading = false;
      });
  },
  methods: {
    originalPriceInputNumberOnchange(value) {
      this.productDetail.originalPrice = yuanToFenNumber(value);
    },
    priceInputNumberOnchange(value) {
      this.productDetail.price = yuanToFenNumber(value);
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    selectIndex(options) {
      this.productDetail.specificationId = options.id;
      this.productDetail.productImage = options.product.productImage;
      this.productDetail.image = options.product.productImage;
      this.productDetail.name = options.product.name;
      const tempImgObj = {};
      tempImgObj.image = options.product.productImage;
      this.setDefaultUploadList(tempImgObj);
    },
    remoteMethod(query) {
      if (query !== '') {
        this.handleSearchAutoComplete(query);
      } else {
        this.optionsShelfSpecification = [];
      }
    },
    handleSearchAutoComplete(value) {
      this.shelfSpecificationLoading = true;
      getProductSpecificationsPages({
        keyword: value + '',
        page: '1',
        rows: '5'
      })
        .then(res => {
          console.log(res.array.length);
          console.log(this.optionsShelfSpecification);
          if (res.array.length > 0) {
            this.optionsShelfSpecification.length = 0;
            this.optionsShelfSpecification = this.optionsShelfSpecification.concat(
              res.array
            );
          }
          this.shelfSpecificationLoading = false;
        })
        .catch(() => {
          this.shelfSpecificationLoading = false;
        });
    },
    checkAllGroupChange(data) {
      this.productDetail.sectionIds = data.join(',');
    },
    deleteTable(ids) {
      this.loading = true;
      deleteProductShelve({
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
        .catch(() => {
          this.loading = false;
        });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.productDetail.applicationType = this.applicationType;
          if (this.isCreate) {
            // 添加状态
            this.createProductShelve();
          } else if (this.isEdit) {
            // 编辑状态
            this.editProductShelve();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    editProductShelve() {
      this.modalViewLoading = true;
      editProductShelve({
        ...this.productDetail
      })
        .then(res => {
          this.resetFields();
          this.modalEdit = false;
          this.getTableData();
        })
        .catch(error => {
          this.$Modal.error({
            title: '修改失败',
            content: error.response.data
          });
        });
      this.modalViewLoading = false;
      this.loading = false;
    },
    createProductShelve() {
      this.modalViewLoading = true;
      createProductShelve({
        ...this.productDetail
      }).then(res => {
        this.resetFields();
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      });
      this.modalViewLoading = false;
      this.loading = false;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.productDetail.image = null;
      this.productDetail.image = fileList[0].url;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.uploadListMain = [];
      this.productDetail.image = null;
    },
    useAbleUniteChange(value) {
      this.productDetail.shelfStatus = value;
    },
    addChildren() {
      this.resetFields();
      this.tempModalType = this.modalType.create;
      this.productDetail.applicationType = this.applicationType;
      this.modalEdit = true;
    },
    onSale(params) {
      console.log(params.row.shelfStatus);
      // this.tableData[params.index].onSale = !this.tableData[params.index].onSale;
      this.productDetail = this._.cloneDeep(params.row);
      if (params.row.shelfStatus === 'ON') {
        this.productDetail.shelfStatus = 'OFF';
      } else {
        this.productDetail.shelfStatus = 'ON';
      }
      this.loading = true;
      this.editProductShelve();
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.productDetail = params.row;
      this.modalView = true;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.productDetail = _.cloneDeep(params.row);
      this.shelfSpecificationEditDefault = params.row.specificationInfo;
      // .length = 0
      // this.shelfSpecificationModel.push(temp)
      // this.$refs.shelfSpecificationSelect.setQuery(temp)
      this.setDefaultUploadList(params.row);
      this.$refs.modalEdit.resetFields();
      this.modalEdit = true;
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.optionsShelfSpecification = [];
      this.productDetail = {};
      this.productDetail = this._.cloneDeep(productDetail);
      console.log('this.productDetail' + JSON.stringify(this.productDetail));
    },
    setDefaultUploadList(res) {
      if (res.image != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.image;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    getTableData() {
      this.searchRowData.applicationType = this.applicationType;
      getProductShelvesPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.clearSearchLoading = false;
        this.searchLoading = false;
      });
    },
    handleDownload() {
      // 导出不分页
      this.searchRowData.rows = null;
      this.searchRowData.applicationType = this.applicationType;
      getProductShelvesPages(this.searchRowData).then(res => {
        const tableData = res.array;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['id'] = item['id'] + '';
          item['originalPrice'] = (item['originalPrice'] / 100.0).toFixed(2);
          item['price'] = (item['price'] / 100.0).toFixed(2);
          item['shelfStatus'] = onSaleStatusConvert(item['shelfStatus']).label;
        });
        this.$refs.tables.handleDownload({
          filename: `商品上架信息-${new Date().valueOf()}`,
          data: tableData
        });
      });
    },
    getApplications() {
      getDictionary({ code: 'applications' }).then(res => {
        if (res.entries) {
          this.applicationTypeList = res.entries;
        }
      });
    },
    applicationTypeChange(value) {
      this.productDetail.applicationType = value;
      this.uiPositionData = this.originalUiPositionData;
      this.uiPositionData = this.uiPositionData.filter(
        item => item.applicationType == value
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
