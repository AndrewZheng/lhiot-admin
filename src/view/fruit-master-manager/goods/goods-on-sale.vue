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
            <Input v-model="searchRowData.name" placeholder="上架名称" class="search-input mr5" style="width: auto">
            <Input v-model="searchRowData.keyword" placeholder="规格条码" class="search-input mr5" style="width: auto">
            <Button v-waves :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addChildren">
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
              删除
            </Button>
          </Poptip>
          <!-- 多类型导出 -->
          <BookTypeOption v-model="exportType" class="mr5"/>
          <Button :loading="downloadLoading" class="search-btn mr5" type="primary" @click="handleDownload"><Icon type="md-download"/>导出</Button>
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
            @on-page-size-change="changePageSize"></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalView"
      :mask-closable="false"
      :width="750"
    >
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
    <Modal
      v-model="modalEdit"
      :width="750"
    >
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
                :loading="shelfSpecificationLoading">
                <Option
                  v-for="(option, index) in optionsShelfSpecification"
                  :value="option.id"
                  :key="index"
                  class="pb5 pt5 pl15"
                  @click.native="selectIndex(option)">
                  {{ option.specificationInfo }}
                </Option>
              </Select>
              <Input v-else :value="shelfSpecificationEditDefault" disabled>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="上架名称:" prop="name">
              <Input v-model="productDetail.name" placeholder="上架名称">
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="上架份数:" prop="shelfQty">
              <InputNumber :min="0" v-model="productDetail.shelfQty" size="large" style="width: 160px"></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品排序:" prop="sorting">
              <InputNumber :min="0" v-model="productDetail.sorting" size="large" style="width: 160px"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="上架描述:">
              <Input v-model="productDetail.description" placeholder="上架描述">
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
                @on-change="originalPriceInputNumberOnchange"/>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品特价:¥" prop="price">
              <InputNumber
                :min="0"
                :value="priceComputed"
                placeholder="商品特价"
                @on-change="priceInputNumberOnchange"/>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="是否上架:" prop="shelfStatus">
              <Select
                :value="productDetail.shelfStatus"
                style="width: 100px"
                @on-change="useAbleUniteChange">
                <Option
                  v-for="(item,index) in useAble"
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
            <FormItem :label-width="80" label="商品主图:建议尺寸;400x400(单位:px)" prop="image">
              <Input v-show="false" v-model="productDetail.image" style="width: auto">
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
                <div slot="content">
                  <Button type="primary">
                    上传图片
                  </Button>
                </div>
              </IViewUpload>
            </FormItem>
          </Row>
          <Row v-show="tempModalType===modalType.create">
            <Col span="24">
            <FormItem label="上架板块:">
              <div v-for="item in uiPositionData" :key="item.id">
                <div>
                  {{ item.description }}:
                </div>
                <CheckboxGroup v-model="model" @on-change="checkAllGroupChange">
                  <Checkbox
                    v-for="innerItem in item.productSections"
                    ref="checkBox"
                    :key="innerItem.id"
                    :label="innerItem.id"
                  >{{ innerItem.sectionName }}
                  </Checkbox>
                </CheckboxGroup>
              </div>
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
import _ from 'lodash';
import IViewUpload from '_c/iview-upload';
import {
  getuiPositionsPages,
  createProductShelve,
  deleteProductShelve,
  editProductShelve,
  getProductShelvesPages,
  getProductSpecificationsPages
} from '@/api/fruitermaster';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { positionType, YNEnum } from '@/libs/enumerate';
import { fenToYuanDot2, fenToYuanDot2Number, yuanToFenNumber } from '@/libs/util';
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
  specificationInfo: ''
};
const roleRowData = {
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
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      shelfSpecificationEditDefault: '',
      shelfSpecificationLoading: false,
      optionsShelfSpecification: [],
      list: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New hampshire', 'New jersey', 'New mexico', 'New york', 'North carolina', 'North dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode island', 'South carolina', 'South dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West virginia', 'Wisconsin', 'Wyoming'],
      createLoading: false,
      model: [],
      uiPositionData: [],
      ruleInline: {
        originalPrice: [
          { required: true, message: '请输入商品原价' }
        ],
        price: [
          { required: true, message: '请输入商品特价' },
          { message: '必须为大于0的数字', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/ }
        ],
        specificationId: [{ required: true, message: '请输入商品规格', pattern: /^[1-9]\d*$/ }],
        image: [{ required: true, message: '请上传图片' }],
        name: [{ required: true, message: '请输入上架名称' }],
        shelfQty: [
          { required: true, message: '请输入上架份数' },
          { message: '必须为非零整数', pattern: /^[1-9]\d*$/ }
        ],
        sorting: [
          { required: true, message: '请输入上架份数' },
          { message: '必须为非零整数', pattern: /^[1-9]\d*$/ }
        ],
        shelfStatus: [
          { required: true, message: '请选择是否上架' }
        ]
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
            const str = <img src={row.image} style='margin-top:5px' height='60' width='60' margin-top='10px'/>;
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
          minWidth: 100,
          key: 'shelfStatus',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{onSaleStatusConvert(row.shelfStatus).label}</div>;
          }
        },
        {
          title: '操作',
          minWidth: 200,
          key: 'handle',
          options: ['view', 'edit', 'delete', 'onSale']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      productDetail: productDetail,
      exportExcelLoading: false,
      exportType: 'xlsx',
      downloadLoading: false
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
  },

  created() {
    this.loading = true;
    this.createLoading = true;
    this.searchRowData = _.cloneDeep(roleRowData);
    getuiPositionsPages({
      applicationType: 'HEALTH_GOOD',
      includeSection: YNEnum.YES,
      positionType: positionType.PRODUCT,
      page: 0,
      rows: 0
    }).then(res => {
      this.uiPositionData = res.array;
      this.createLoading = false;
      this.getTableData();
    }).catch(() => {
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
      }).then(res => {
        console.log(res.array.length);
        console.log(this.optionsShelfSpecification);

        if (res.array.length > 0) {
          this.optionsShelfSpecification.length = 0;
          this.optionsShelfSpecification = this.optionsShelfSpecification.concat(res.array);
        }
        this.shelfSpecificationLoading = false;
      }).catch(() => {
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
    handleSubmit(name) {
      console.log(this.productDetail.originalPrice);
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createProductShelve();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editProductShelve();
          }
        } else {
          this.$Message.error('请完善商品的信息!');
        }
      });
    },
    editProductShelve() {
      this.modalViewLoading = true;
      editProductShelve({
        ...this.productDetail
      }).then(res => {
        this.resetFields();
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      }).catch(() => {
        this.resetFields();
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    createProductShelve() {
      this.modalViewLoading = true;
      createProductShelve({
        ...this.productDetail
      }).then(res => {
        this.resetFields();
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      });
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
      if (this.tempModalType !== this.modalType.create) {
        this.resetFields();
      }
      this.tempModalType = this.modalType.create;
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
      this.modalEdit = true;
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.productDetail = this._.cloneDeep(productDetail);
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
      getProductShelvesPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.clearSearchLoading = false;
        this.searchLoading = false;
      });
    },
    // exportExcel() {
    //   this.exportExcelLoading = true;
    //   getProductShelvesPages({}).then(res => {
    //     if (res.array.length > 0) {
    //       this.$refs.tables.exportCsv({
    //         filename: `table-${new Date().valueOf()}.csv`,
    //         columns: this.columns.filter((col, index) => index !== 0),
    //         data: res.array
    //       });
    //     }
    //     this.exportExcelLoading = false;
    //   });
    // },
    handleDownload() {
      // 导出不分页
      this.searchRowData.rows = null;
      getProductShelvesPages(this.searchRowData).then(res => {
        const tableData = res.array;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['id'] = item['id'] + '';
          item['originalPrice'] = (item['originalPrice'] / 100.00).toFixed(2);
          item['price'] = (item['price'] / 100.00).toFixed(2);
          item['shelfStatus'] = onSaleStatusConvert(item['shelfStatus']).label;
        });
        this.$refs.tables.handleDownload({
          filename: `商品上架信息-${new Date().valueOf()}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
