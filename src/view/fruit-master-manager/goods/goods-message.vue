<template>
  <div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns"
              :loading="loading"
              @on-delete="handleDelete"
              @on-view="handleView"
              @on-edit="handleEdit"
              @on-push="handlePush"
              @on-select-all="onSelectionAll"
              @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input placeholder="商品编码" class="search-input mr5" v-model="searchRowData.code" style="width: auto"
            />
            <Input placeholder="商品名称" class="search-input mr5" v-model="searchRowData.name" style="width: auto"/>
            <Button @click="handleSearch" :loading="searchLoading" class="search-btn mr5" type="primary">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves @click="handleClear" class="search-btn" type="info" :loading="clearSearchLoading">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" :loading="createLoading" class="mr5" @click="addProduct">
            <Icon type="md-add"/>
            创建
          </Button>
          <Poptip confirm
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
          <Button v-waves type="primary" class="mr5" @click="exportExcel" :loading="exportExcelLoading">
            <Icon type="md-download"/>
            导出
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page :total="total" :current="searchRowData.page" @on-change="changePage"
                @on-page-size-change="changePageSize" show-sizer
                show-total></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalView"
      :mask-closable="false"
    >
      <p slot="header">
        <span>商品基础信息</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">商品编码:</i-col>
              <i-col span="18">{{productDetail.code}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{productDetail.name}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <Row>
            <i-col span="3">益处:</i-col>
            <i-col span="21">{{productDetail.benefit}}</i-col>
          </Row>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品描述:</i-col>
              <i-col span="21">{{productDetail.description}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品主图:</i-col>
              <i-col span="21">
                <div class="demo-upload-list">
                  <img :src="productDetail.mainImg"/>
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleUploadView(productDetail.mainImg)"></Icon>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品附图:</i-col>
              <i-col span="21">
                <div class="demo-upload-list" v-for="item in productDetail.subImg">
                  <div>
                    <img :src="item">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                    </div>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">详情图:</i-col>
              <i-col span="21">
                <div class="demo-upload-list"  v-for="item in uploadListMultiple">
                  <img :src="productDetail.detailImg"/>
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleUploadView(productDetail.detailImg)"></Icon>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">基础规格</Divider>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="7">规格单位:</i-col>
              <i-col span="17">{{productDetail.productSpecification.packagingUnit}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="7">规格条码:</i-col>
              <i-col span="17">{{productDetail.productSpecification.barcode}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="7">安全库存:</i-col>
              <i-col span="17">{{productDetail.productSpecification.limitInventory}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="7">重量(kg):</i-col>
              <i-col span="17">{{productDetail.productSpecification.weight}}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal
      style="z-index: 1000"
      v-model="modalEdit"
    >
      <p slot="header">
        <span>修改商品基础信息</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="productDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="12">
            <FormItem label="商品编码:" prop="code">
              <Input v-model="productDetail.code" placeholder="商品编码"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品名称:" prop="name">
              <Input v-model="productDetail.name" placeholder="商品名称"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="商品分类:" prop="categoryId">
              <Cascader span="21" style="width: 70%" :data="goodsCategoryData"
                        v-model="defaultGoodsCategoryData"
                        @on-change="goodsCategoryChange"
              ></Cascader>
            </FormItem>
            </Col>
          </Row>
          <Row align="middle" type="flex">
            <Col span="17">
            <FormItem label="益处:" prop="benefit">
              <Input v-model="productDetail.benefit" placeholder="商品名称"></Input>
            </FormItem>
            </Col>
            <Col span="7" style="color: gray">&nbsp;&nbsp;关键词，使用逗号分隔</Col>
          </Row>
          <Row>
            <i-col span="24">
              <FormItem label="商品描述:" prop="description">
                <Input v-model="productDetail.description" placeholder="商品名称" type="textarea"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <FormItem label="商品主图:建议尺寸;400x400(单位:px):" prop="mainImg" >
              <div class="demo-upload-list" v-for="item in uploadListMain">
                <template v-if="item.status === 'finished'">
                  <div>
                    <Input v-model="productDetail.mainImg" style="width: auto" v-show="false"/>
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
                :defaultList="defaultListMain"
                @on-success="handleSuccessMain"
                :imageSize="imageSize"
              >
                <div slot="content">
                  <Button type="primary">
                    上传图片
                  </Button>
                </div>
              </IViewUpload>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="商品附图:建议尺寸600x338(单位:px)" prop="subImg">
              <div class="demo-upload-list" v-for="item in uploadListSecond">
                <template v-if="item.status === 'finished'">
                  <div>
                    <Input v-model="productDetail.subImg" style="width: auto" v-show="false"/>
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemoveSecond(item)"></Icon>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <IViewUpload
                ref="uploadSecond"
                :imageSize="imageSize"
                :defaultList="defaultListSecond"
                multiple
                @on-success="handleSuccessSecond"
                :maxNum="5"
              >
                <div slot="content">
                  <Button type="primary">
                    上传图片
                  </Button>
                </div>
              </IViewUpload>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="商品详情:" prop="detailImg" :label-width="80">
              <div class="demo-upload-list" v-for="item in uploadListMultiple">
                <template v-if="item.status === 'finished'">
                  <div>
                    <Input v-model="productDetail.detailImg" style="width: auto" v-show="false"/>
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
                :imageSize="imageSize"
                :defaultList="defaultListMultiple"
                :maxNum="5"
                multiple
                @on-success="handleSuccessMultiple"
              >
                <div slot="content">
                  <Button type="primary" style="width:auto">
                    上传图片
                  </Button>
                </div>
              </IViewUpload>
            </FormItem>
          </Row>
          <Divider orientation="center">基础规格</Divider>
          <Form ref="innerModalEdit" :model="productDetail.productSpecification" :rules="ruleInline">
            <Row>
              <Col span="12">
              <FormItem label="规格单位:" prop="packagingUnit" :label-width="80">
                <Select :value="productDetail.productSpecification.packagingUnit" @on-change="uniteChange">
                  <Option class="ptb2-5" style="padding-left: 5px" v-for="(item,index) in unitsList" :value="item.value"
                          :key="index">{{ item.label}}
                  </Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">

              <FormItem label="规格条码:" prop="barcode" :label-width="80">
                <Input v-model="productDetail.productSpecification.barcode"/>
              </FormItem>

              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem label="安全库存:" prop="limitInventory" :label-width="80">
                <Input v-if="productDetail.productSpecification"
                       v-model="productDetail.productSpecification.limitInventory"/>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="重量(kg):" prop="weight" :label-width="80">
                <Input v-if="productDetail.productSpecification"
                       v-model="productDetail.productSpecification.weight"/>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit('modalEdit','innerModalEdit')">确定
        </Button>
      </div>
    </Modal>
    <Modal title="View Image" v-model="uploadVisible">
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
    getProduct,
    getProductCategoriesTree,
    getProductPages,
    productSpecificationsUnits
  } from '@/api/fruitermaster';
  import {buildMenu, convertTreeCategory} from '@/libs/util';
  import uploadMixin from '@/mixins/uploadMixin';
  import deleteMixin from '@/mixins/deleteMixin.js';
  import tableMixin from '@/mixins/tableMixin.js';
  import searchMixin from '@/mixins/searchMixin.js';
  import {setGoodsStandard} from '../../../libs/util';

  const productDetail = {
    id: 0,
    benefit: '',
    categoryId: null,
    code: null,
    description: '',
    detailImg: null,
    icon: '',
    mainImg: null,
    name: '',
    productSpecification: {
      availableStatus: 'ENABLE',
      barcode: null,
      inventorySpecification: 'YES',
      limitInventory: 0,
      packagingUnit: null,
      productId: 0,
      specificationQty: 0,
      weight: 0
    },
    sourceCode: '',
    subImg: null
  };
  const roleRowData = {
    code: null,
    name: null,
    page: 1,
    rows: 10
  };

  export default {
    components: {
      Tables,
      IViewUpload
    },
    mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
    mounted() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.loading = true;
      this.createLoading = true;
      productSpecificationsUnits().then(res => {
        res.forEach(value => {
          const map = {label: 'label', value: 'value'};
          map.value = value;
          map.label = value;
          this.unitsList.push(map);
          this.createLoading = false;
        });
        getProductCategoriesTree().then(res => {
          if (res && res.array.length > 0) {
            this.productCategoriesTreeList = res.array;
            const menuList = buildMenu(res.array);
            const map = {
              id: 'id',
              title: 'title',
              children: 'children'
            };
            this.goodsCategoryData = convertTreeCategory(menuList, map, true);
            this.getTableData();
          }
        });
      }).catch( error => {
        this.createLoading = false;
      });
    },
    data() {
      return {
        ruleInline: {
          code: [
            {required: true, message: '请输入商品编码'},
            {
              validator(rule, value, callback, source, options) {
                let errors = [];
                if (!/^[0-9]+$/.test(value)) {
                  callback('必须为整数');
                }
                callback(errors);
              }
            }
          ],
          name: [
            {required: true, message: '请输入商品名称'}
          ],
          categoryId: [
            {required: true, message: '请选择商品分类'}
          ],
          mainImg: [
            {required: true, message: '请上传商品主图'}
          ],
          subImg: [
            {required: true, message: '请上传商品附图', type: 'array'}
          ],
          detailImg: [
            {required: true, message: '请上传商品详情图', type: 'array'}
          ],
          packagingUnit: [
            {required: true, message: '请选择规格单位'}
          ],
          barcode: [
            {required: true, message: '请输入规格条码'},
            {
              validator(rule, value, callback, source, options) {
                let errors = [];
                if (!/^[0-9]\d*$/.test(value)) {
                  callback('必须为非零整数');
                }
                callback(errors);
              }
            }
          ],
          limitInventory: [
            {required: true, message: '请输入安全库存'},
            {
              validator(rule, value, callback, source, options) {
                let errors = [];
                if (!/^[1-9]\d*$/.test(value)) {
                  callback('必须为非零整数');
                }
                callback(errors);
              }
            }
          ],
          weight: [
            {required: true, message: '请输入重量'},
            {
              validator(rule, value, callback, source, options) {
                let errors = [];
                if (!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(value)) {
                  callback('必须为大于0的数字');
                }
                callback(errors);
              }
            }
          ]
        },
        defaultListMultiple: [],
        defaultListMain: [],
        defaultListSecond: [],
        uploadListMain: [],
        uploadListSecond: [],
        uploadListMultiple: [],
        goodsCategoryData: [],
        defaultGoodsCategoryData: [41],
        productCategoriesTreeList: [],
        tempSubImg: [],
        unitsList: [],
        columns: [
          {
            type: 'selection',
            key: '',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '商品编码',
            key: 'code',
            sortable: true,
            minWidth: 150
          },
          {
            title: '商品名称',
            key: 'name',
            minWidth: 150
          },
          {
            title: '益处',
            minWidth: 150,
            key: 'benefit'
          },
          {
            title: '商品描述',
            minWidth: 150,
            key: 'description'
          },
          {
            title: '操作',
            minWidth: 230,
            key: 'handle',
            options: ['delete', 'edit', 'view', 'push']
          }
        ],
        createLoading: false,
        modalViewLoading: false,
        exportExcelLoading: false,
        searchRowData: _.cloneDeep(roleRowData),
        productDetail: _.cloneDeep(productDetail)
      };
    },
    methods: {
      resetSearchRowData() {
        this.searchRowData = _.cloneDeep(roleRowData);
        this.getTableData();
      },
      // 导出Excel
      exportExcel() {
        this.exportExcelLoading = true;
        getProductPages({}).then(res => {
          if (res.array.length > 0) {
            // let tempTableList = res.array.map(value => {
            //   value.code = '=' + value.code
            //   return value
            // })
            this.$refs.tables.exportCsv({
              filename: `table-${new Date().valueOf()}.csv`,
              columns: this.columns.filter((col, index) => index !== 0),
              data: res.array
            });
          }
          this.exportExcelLoading = false;
        });
      },
      resetFields() {
        this.$refs.modalEdit.resetFields();
        this.$refs.innerModalEdit.resetFields();
        this.$refs.uploadMain.clearFileList();
        this.$refs.uploadSecond.clearFileList();
        this.$refs.uploadMultiple.clearFileList();
        this.uploadListMain = [];
        this.uploadListSecond = [];
        this.uploadListMultiple = [];
        this.productDetail.mainImg = null;
        this.productDetail.subImg = null;
        this.productDetail.detailImg = null;
      },
      handleSubmit(name1, name2) {
        this.$refs[name2].validate((innerValid) => {
          this.$refs[name1].validate((valid) => {
            if (valid && innerValid) {
              if (this.tempModalType === this.modalType.create) {
                // 添加状态                
                this.createProduct();
              } else if (this.tempModalType === this.modalType.edit) {
                // 编辑状态
                this.editProduct();
              }
            } else {
              this.$Message.error('请完善商品的信息!');
            }
          });
        });
      },
      createProduct() {
        this.modalViewLoading = true;
        this.productDetail.productSpecification.specificationQty = 1;
        createProduct({
          ...this.productDetail
        }).then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.resetFields();
          this.getTableData();
        }).catch( error => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
      },
      editProduct() {
        this.modalViewLoading = true;
        editProduct({
          ...this.productDetail
        }).then(res => {
          this.resetFields();
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.getTableData();
        }).catch( error => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
      },
      uniteChange(value) {
        this.productDetail.productSpecification.packagingUnit = value;
      },
      // 选择分类
      goodsCategoryChange(value, selectedData) {
        if (selectedData.length > 0) {
          this.productDetail.categoryId = selectedData[selectedData.length - 1].id;
        } else {
          this.productDetail.categoryId = null;
        }
        this.defaultGoodsCategoryData = selectedData;
      },
      goDetail() {
        this.turnToPage('goods-detail');
      },
      addProduct() {
        if (this.tempModalType !== this.modalType.create) {
          this.resetFields();
          this.tempModalType = this.modalType.create;
        }
        this.modalEdit = true;
      },
      // 删除
      deleteTable(ids) {
        this.loading = true;
        deleteProduct({
          ids
        }).then(res => {
            let totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
            if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
              this.searchRowData.page -= 1;
            }
            this.tableDataSelected = [];
            this.getTableData();
          }
        ).catch(err => {
          this.loading = false;
        });
      },
      // 设置编辑商品的图片列表
      setDefaultUploadList(res) {
        if (res.mainImg != null) {
          const map = {status: 'finished', url: 'url'};
          let mainImgArr = [];
          map.url = res.mainImg;
          mainImgArr.push(map);
          this.$refs.uploadMain.setDefaultFileList(mainImgArr);
          this.uploadListMain = mainImgArr;
        }
        if (res.subImg != null) {
          let subImgArr = [];
          res.subImg.forEach(value => {
            const innerMapSub = {status: 'finished', url: 'url'};
            innerMapSub.url = value;
            subImgArr.push(innerMapSub);
          });
          this.$refs.uploadSecond.setDefaultFileList(subImgArr);
          this.uploadListSecond = subImgArr;
        }
        if (res.detailImg != null) {
          let detailImgArr = [];
          res.detailImg.forEach(value => {
            const innerMapDetailImg = {status: 'finished', url: 'url'};
            innerMapDetailImg.url = value;
            detailImgArr.push(innerMapDetailImg);
          });
          this.$refs.uploadMultiple.setDefaultFileList(detailImgArr);
          this.uploadListMultiple = detailImgArr;
        }
      },
      handleView(params) {
        this.resetFields();
        this.tempModalType = this.modalType.view;
        this.loading = true;
        getProduct({
          id: params.row.id
        }).then(res => {
          this.productDetail = res;
          this.loading = false;
          this.modalView = true;
        }).catch( error => {
          this.loading = false;
          this.modalView = true;
        });
      },
      handleEdit(params) {
        this.resetFields();
        this.tempModalType = this.modalType.edit;
        this.loading = true;
        getProduct({
          id: params.row.id
        }).then(res => {
          this.loading = false;
          this.productDetail = res;
          this.setDefaultUploadList(res);
          this.defaultGoodsCategoryData = [];
          this.findParentId(this.productDetail.categoryId);
          this.defaultGoodsCategoryData.reverse();
          this.modalEdit = true;
        }).catch( error => {
          this.loading = false;
          this.modalEdit = true;
        });
      },
      findParentId(id) {
        let obj = this.productCategoriesTreeList.find(item => {
          return item.id === id;
        });
        this.defaultGoodsCategoryData.push(id);
        if (obj && obj.parentid !== 0) {
          this.findParentId(obj.parentid);
        }
      },
      handlePush(params) {
        console.log('setGoodsStandard:'+params.row);
        setGoodsStandard(params.row);
        this.turnToPage({
          name: 'goods-standard',
          params: {id: params.row.id, unitsList: this.unitsList, productName: params.row.name}
        });
      },
      getTableData() {
        getProductPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        }).catch( error => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
      },
      // 删除附图
      handleRemoveSecond(file) {
        this.$refs.uploadSecond.deleteFile(file);
        let index = this.productDetail.subImg.indexOf(file.url);
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
        let index = this.productDetail.detailImg.indexOf(file.url);
        if (index > -1) {
          this.productDetail.detailImg.splice(index, 1);
        }
        if (this.productDetail.detailImg.length === 0) {
          this.$refs.uploadMultiple.clearFileList();
          this.productDetail.detailImg = null;
        }
      },
      // 商品主图
      handleSuccessMain(response, file, fileList) {
        this.uploadListMain = fileList;
        this.productDetail.mainImg = null;
        this.productDetail.mainImg = fileList[0].url;
      },
      // 商品详情
      handleSuccessMultiple(response, file, fileList) {
        this.uploadListMultiple = fileList;
        this.productDetail.detailImg = [];
        fileList.forEach(value => {
          if (value.url) {
            this.productDetail.detailImg.push(value.url);
          }
        });
      },
      // 商品附图
      handleSuccessSecond(response, file, fileList) {
        this.uploadListSecond = fileList;
        this.productDetail.subImg = [];
        fileList.forEach(value => {
          if (value.url) {
            this.productDetail.subImg.push(value.url);
          }
        });
        if (this.tempSubImg.indexOf(response.fileUrl) < 0) {
          this.tempSubImg.push(response.fileUrl);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
