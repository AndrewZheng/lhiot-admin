<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="3" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="21" order="3">
        <Card>
          <h6>
            当前选中：
            <span class="brand-red font-sm">{{ currentName }}</span>
          </h6>
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
            @on-relevance="handleSetting"
            @on-select-all="onSelectionAll"
            @on-selection-change="onSelectionChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input
                  v-model="searchRowData.productCode"
                  placeholder="商品编码"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Input
                  v-model="searchRowData.productName"
                  placeholder="商品名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Button
                  :search-loading="searchLoading"
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
                @click="addProduct"
              >
                <Icon type="md-add" />添加
              </Button>
              <Button
                v-waves
                :loading="exportExcelLoading"
                type="primary"
                class="mr5"
                @click="handleDownload"
              >
                <Icon type="md-download" />导出
              </Button>
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
      </i-col>
    </Row>

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>商品基础信息</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">商品编码:</i-col>
              <i-col span="18">{{ productDetail.productCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{ productDetail.productName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">商品分类:</i-col>
              <i-col span="18">{{
                findGroupName(productDetail.groupId)
              }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">产地编码:</i-col>
              <i-col span="18">{{ productDetail.sourceCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">商品状态:</i-col>
              <i-col span="16">{{
                productDetail.status | productStatusFilter
              }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">基础单位:</i-col>
              <i-col span="18">{{ productDetail.unitName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">基础条码:</i-col>
              <i-col span="16">{{ productDetail.baseBarcode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <!-- <i-col span="12">
            <Row>
              <i-col span="6">海鼎skuid:</i-col>
              <i-col span="18">{{ productDetail.hdSkuid }}</i-col>
            </Row>
          </i-col>-->
          <i-col span="12">
            <Row>
              <i-col span="8">基础重量:</i-col>
              <i-col span="16">{{ productDetail.baseQty }}</i-col>
            </Row>
          </i-col>
        </Row>
        <!-- 小程序商品不需要大小图标 -->
        <!-- <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">小图标:</i-col>
              <i-col span="18">
                <img :src="productDetail.smallImage">
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row >
              <i-col span="8">大图标:</i-col>
              <i-col v-show="productDetail.smallImage" span="16">
                <div class="demo-upload-list">
                  <img :src="productDetail.largeImage">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleUploadView(productDetail.largeImage)"></Icon>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>-->
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品主图:</i-col>
              <i-col v-show="productDetail.image" span="21">
                <div class="demo-upload-list">
                  <img :src="productDetail.image">
                  <div class="demo-upload-list-cover">
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleUploadView(productDetail.image)"
                    ></Icon>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <!-- 小程序没有视频封面和视频 -->
        <!-- <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">视频封面:</i-col>
              <i-col v-show="productDetail.videoImage" span="21">
                <div class="demo-upload-list">
                  <img :src="productDetail.videoImage">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleUploadView(productDetail.videoImage)"></Icon>
                  </div>
                </div>
            </Row>
          </i-col>
        </Row>-->
        <!-- <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品视频:</i-col>
              <i-col span="21">{{ productDetail.videoUrl }}</i-col>
            </Row>
          </i-col>
        </Row>-->
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品描述:</i-col>
              <i-col span="21">{{ productDetail.description }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <span>{{
          productDetail.id == "" ? "创建基础商品信息" : "编辑基础商品信息"
        }}</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="productDetail"
          :rules="ruleInline"
          :label-width="90"
        >
          <Row>
            <Col span="12">
            <FormItem label="商品编码:" prop="productCode">
              <Input
                v-model="productDetail.productCode"
                placeholder="商品编码"
              ></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品名称:" prop="productName">
              <Input
                v-model="productDetail.productName"
                placeholder="商品名称"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="商品分类:" prop="groupId">
              <Cascader
                v-model="defaultGoodsCategoryData"
                :data="goodsCategoryData"
                trigger="hover"
                filterable
                span="21"
                style="width: 100%"
                @on-change="goodsCategoryChange"
              ></Cascader>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品状态:" prop="status">
              <Select :value="productDetail.status" @on-change="statusChange">
                <Option
                  v-for="(item, index) in productStatus"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="产地编码:" prop="sourceCode">
              <Input
                v-model="productDetail.sourceCode"
                placeholder="产地编码"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="基础单位:" prop="unitId">
              <Select :value="productDetail.unitId" @on-change="uniteChange">
                <Option
                  v-for="(item, index) in unitsList"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="基础条码:" prop="baseBarcode">
              <Input
                v-model.trim="productDetail.baseBarcode"
                placeholder="基础条码"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <!-- <Col span="12">
            <FormItem label="海鼎skuid:" prop="hdSkuid">
              <Input v-model="productDetail.hdSkuid" placeholder="海鼎skuid"></Input>
            </FormItem>
            </Col>-->
            <Col span="12">
            <FormItem label="重量(kg):" prop="baseQty">
              <InputNumber
                v-model="productDetail.baseQty"
                placeholder="基础重量"
              ></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="最低库存:" prop="limitQty">
              <InputNumber
                v-model="productDetail.limitQty"
                placeholder="最低库存"
              ></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="商品主图:建议尺寸:750x750(单位:px)" prop="image">
              <Input
                v-show="false"
                v-model="productDetail.image"
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
              <!-- ==== -->
              <IViewUpload
                ref="uploadMain"
                :default-list="defaultListMain"
                :image-size="imageSize"
                group-type="base_image"
                file-dir="product"
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
          <Row>
            <i-col span="24">
              <FormItem label="商品描述:" prop="description">
                <Input
                  v-model="productDetail.description"
                  placeholder="商品名称"
                  type="textarea"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button
          :loading="modalEditLoading"
          type="primary"
          @click="handleSubmit('editForm')"
        >确定</Button>
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
  createProduct,
  deleteProduct,
  editProduct,
  getProductPages,
  getProductCategoriesTree,
  getProductUnits
} from '@/api/mini-program';
import {
  buildMenu,
  convertTreeCategory,
  setSmallGoodsStandard,
  convertTree
} from '@/libs/util';
import CommonIcon from '_c/common-icon';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import { productStatusConvert } from '@/libs/converStatus';

const productDetail = {
  id: 0,
  productCode: '',
  productName: '',
  groupId: 0,
  sourceCode: '',
  image: '',
  smallImage: '',
  largeImage: '',
  status: null,
  unitId: 0,
  baseBarcode: '',
  hdSkuid: '',
  videoUrl: '',
  videoImage: '',
  baseQty: 0,
  limitQty: 0,
  description: '',
  unitName: '',
  groupName: '',
  createUser: ''
};

const roleRowData = {
  groupId: null,
  productCode: null,
  productName: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, tableMixin],
  data() {
    return {
      currentGroupId: 0,
      currentName: '全部分类',
      menuData: [],
      defaultListMultiple: [],
      defaultListMain: [],
      defaultListSecond: [],
      uploadListMain: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      goodsCategoryData: [],
      defaultGoodsCategoryData: [],
      proCategoryTreeList: [],
      tempSubImg: [],
      unitsList: [],
      productStatus: [
        { label: '正常', value: 'NORMAL' },
        { label: '停采', value: 'STOP_MINING' }
      ],
      ruleInline: {
        productCode: [{ required: true, message: '请输入商品编码' }],
        productName: [{ required: true, message: '请输入商品名称' }],
        status: [{ required: true, message: '请选择商品状态' }],
        unitId: [{ required: true, message: '请选择商品单位' }],
        baseBarcode: [{ required: true, message: '请输入基础条码' }],
        description: [{ required: true, message: '请输入商品描述' }],
        groupId: [{ required: true, message: '请选择商品分类' }],
        image: [{ required: true, message: '请上传商品主图' }],
        packagingUnit: [{ required: true, message: '请选择规格单位' }],
        barcode: [
          { required: true, message: '请输入规格条码' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        limitQty: [{ required: true, message: '请输入安全库存' }],
        baseQty: [
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
          title: 'ID',
          key: 'id',
          minWidth: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '商品图片',
          key: 'image',
          align: 'center',
          minWidth: 120,
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.image} height='60' width='60' />;
            return <div>{str}</div>;
          }
        },
        {
          title: '商品编码',
          align: 'center',
          key: 'productCode',
          sortable: true,
          minWidth: 150
        },
        {
          title: '商品名称',
          align: 'center',
          sortable: true,
          key: 'productName',
          minWidth: 120
        },
        {
          title: '类别',
          align: 'center',
          key: 'groupId',
          minWidth: 100,
          render: (h, params) => {
            const { row } = params;
            const obj = this.proCategoryTreeList.find(
              (item) => row.groupId === item.id
            );
            if (obj) {
              return h('span', obj.title);
            }
            return h('span', row.groupId);
          }
        },
        {
          title: '单位',
          align: 'center',
          minWidth: 70,
          key: 'unitName'
        },
        {
          title: '基础条码',
          align: 'center',
          minWidth: 120,
          sortable: true,
          key: 'baseBarcode'
        },
        {
          title: '重量(kg)',
          align: 'center',
          minWidth: 100,
          key: 'baseQty'
        },
        {
          title: '最低库存',
          align: 'center',
          minWidth: 100,
          key: 'limitQty'
        },
        {
          title: '商品状态',
          align: 'center',
          minWidth: 100,
          key: 'status',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === 'NORMAL') {
              return (
                <div>
                  <tag color='success'>
                    {productStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === 'STOP_MINING') {
              return (
                <div>
                  <tag color='error'>
                    {productStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{row.status}</tag>
              </div>
            );
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 150,
          key: 'handle',
          options: ['view', 'edit', 'settings']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      productDetail: _.cloneDeep(productDetail)
    };
  },
  created() {
    this.initMenuList();
    this.getProductUnits();
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getProductCategoriesTree();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getProductPages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getProductUnits() {
      getProductUnits().then((res) => {
        res.array.forEach((value) => {
          const map = { label: 'label', value: 'value' };
          map.value = value.id;
          map.label = value.unitName;
          this.unitsList.push(map);
        });
      });
    },
    getProductCategoriesTree() {
      getProductCategoriesTree()
        .then((res) => {
          this.proCategoryTreeList = [];
          if (res && res.array.length > 0) {
            this.proCategoryTreeList = res.array;
            const menuList = buildMenu(res.array);
            const map = {
              id: 'id',
              title: 'title',
              children: 'children'
            };
            this.goodsCategoryData = convertTreeCategory(menuList, map, true);
            this.getTableData();
          }
        })
    },
    resetSearchRowData() {
      this.currentGroupId = 0;
      this.currentName = '全部分类';
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleDownload() {
      this.exportExcelLoading = true;
      // 导出不带分页搜索条件
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getProductPages(this.searchRowData).then((res) => {
        const tableData = res.rows;
        this.searchRowData.rows = 10;
        this.searchRowData.page = pageSize;
        // 表格数据导出字段翻译
        tableData.forEach((item) => {
          item['groupId'] = item['groupName'];
          item['status'] = item['status'] === 'NORMAL' ? '正常' : '停采';
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `商品基础信息-${date}`,
          data: tableData
        });
        this.exportExcelLoading = false;
      });
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.productDetail.image = null;
    },
    handleSubmit(name1) {
      this.$refs[name1].validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.createProduct();
          } else if (this.isEdit) {
            this.editProduct();
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
    createProduct() {
      this.modalEditLoading = true;
      // this.productDetail.productSpecification.specificationQty = 1;
      createProduct({
        ...this.productDetail
      })
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    editProduct() {
      this.modalEditLoading = true;
      editProduct({
        ...this.productDetail
      })
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('修改成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    // 选择分类
    goodsCategoryChange(value, selectedData) {
      if (value.length > 0) {
        const valueArr = value.map(Number);
        this.productDetail.groupId = value[value.length - 1];
        this.defaultGoodsCategoryData = valueArr;
      } else {
        this.productDetail.groupId = null;
        this.defaultGoodsCategoryData = [];
      }
    },
    addProduct() {
      this.resetFields();
      this.defaultGoodsCategoryData = [];
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    deleteTable(ids) {
      deleteProduct({
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
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.productDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.productDetail = _.cloneDeep(params.row);
      this.save = [];
      this.defaultGoodsCategoryData = [];
      this.save.push(params.row.image);
      this.setDefaultUploadList(this.productDetail);
      this.findGroupId(this.productDetail.groupId);
      this.defaultGoodsCategoryData.reverse();
      this.modalEdit = true;
    },
    findGroupId(id) {
      const obj = this.proCategoryTreeList.find((item) => item.id === id);
      if (typeof id !== 'undefined') {
        this.defaultGoodsCategoryData.push(id);
      }
      if (obj && obj.parentid !== 0) {
        this.findGroupId(obj.parentid);
      }
    },
    findGroupName(id) {
      if (this.proCategoryTreeList.length > 0) {
        const obj = this.proCategoryTreeList.find((item) => item.id === id);
        if (obj) {
          return obj.title;
        }
      }
    },
    handleSetting(params) {
      const rows = params.row;
      rows.unitsList = this.unitsList;
      setSmallGoodsStandard(rows);
      this.turnToPage({
        name: 'small-goods-relation-standard',
        params: { productId: params.row.id, unitsList: this.unitsList }
      });
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.productDetail.image = null;
      this.productDetail.image = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    // 设置编辑商品的图片列表
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
    // 删除附图
    handleRemoveSecond(file) {
      this.$refs.uploadSecond.deleteFile(file);
      const index = this.productDetail.subImg.indexOf(file.url);
      if (index > -1) {
        this.productDetail.subImg.splice(index, 1);
      }
      if (this.productDetail.subImg.length === 0) {
        this.$refs.uploadSecond.clearFileList();
        this.productDetail.subImg = null;
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      // this.uploadListMain = []
      this.productDetail.mainImg = null;
    },
    handleRemoveMultiple(file) {
      this.$refs.uploadMultiple.deleteFile(file);
      const index = this.productDetail.detailImg.indexOf(file.url);
      if (index > -1) {
        this.productDetail.detailImg.splice(index, 1);
      }
      if (this.productDetail.detailImg.length === 0) {
        this.$refs.uploadMultiple.clearFileList();
        this.productDetail.detailImg = null;
      }
    },
    statusChange(value) {
      this.productDetail.status = value;
    },
    // 初始化商品菜单列表
    initMenuList() {
      getProductCategoriesTree().then((res) => {
        if (res && res.array.length > 0) {
          const menuList = buildMenu(res.array);
          const map = {
            title: 'title',
            children: 'children'
          };
          this.menuData = convertTree(menuList, map, true);
          if (this.menuData.length > 0) {
            this.getTableData();
          }
        }
      });
    },
    renderContent(h, { root, node, data }) {
      if (data.type === 'PARENT') {
        return (
          <div
            style={{
              display: 'inline-block',
              width: '100%',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <span>
              <CommonIcon type='ios-folder' class='mr10' />
            </span>
            <span onClick={() => this.handleClick({ root, node, data })}>
              {data.title}
            </span>
          </div>
        );
      } else {
        return (
          <div
            style={{
              display: 'inline-block',
              width: '100%',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <span>
              <CommonIcon type='ios-paper' class='mr10' />
            </span>
            <span onClick={() => this.handleClick({ root, node, data })}>
              {data.title}
            </span>
          </div>
        );
      }
    },
    handleClick({ root, node, data }) {
      // 展开当前节点
      if (typeof data.expand === 'undefined') {
        // this.$set(data, 'expend', true);
        this.$set(data, 'expend', false);
        // if (data.children) {
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        // data.expand = !data.expand;
      }
      this.currentName = data.title;
      this.currentGroupId = data.id;
      this.searchRowData.groupId = data.id;
      this.getTableData();
    },
    resetRowData() {
      this.productDetail = this._.cloneDeep(productDetail);
    },
    uniteChange(value) {
      this.productDetail.unitId = value;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
