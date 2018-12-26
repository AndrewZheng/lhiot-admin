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
              @on-select-all="onSelectionAll"
              @on-selection-change="onSelectionChange"
              @on-relevance="onRelevance"
      >
        <div slot="searchCondition">
          <Input placeholder="版块名称" class="search-input mr5" v-model="searchRowData.sectionName"
                 style="width: 150px"/>
          <Select :disable="selectDisable" v-model="searchRowData.positionId" class="search-col mr5" placeholder="版块位置"
                  style="width: 150px">
            <Option v-for="item in goodsModuleList" :value="item.id" class="pt5 pb5 pl15"
                    :key="`search-col-${item.id}`">{{item.description}}
            </Option>
          </Select>
          <Button v-waves @click="handleSearch" class="search-btn mr5" type="primary">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button v-waves @click="handleClear" class="search-btn" type="info" :loading="clearSearchLoading">
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class=" mr5" @click="addChildren">
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
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer
                show-total></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalView"
      :mask-closable="false"
      :width="700"
    >
      <p slot="header">
        <span>商品板块详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <i-col span="6">商品板块图片:</i-col>
            <img :src="goodsModuleDetail.sectionImg" span="18" style="width: 300px"/>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">板块位置:</i-col>
              <i-col span="16">{{advertisementPositionComputed}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row span="24" class-name="mb10">
          <i-col span="8">板块名称:</i-col>
          <i-col span="16">{{goodsModuleDetail.sectionName}}</i-col>
        </Row>
        <Row span="24" class-name="mb10">
          <i-col span="8">板块序号:</i-col>
          <i-col span="16">{{goodsModuleDetail.sorting}}</i-col>
        </Row>
        <Row v-if="goodsModuleDetail.productShelfList" class-name="mb10">
          <tables
            border
            :columns="tempColumnsView"
            v-model="goodsModuleDetail.productShelfList"
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <Modal
      v-model="modalEdit"
      :width="900"
      :mask-closable="false"
    >
      <p slot="header">
        <span>{{tempModalType === modalType.create?'创建板块':'编辑板块'}}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="goodsModuleDetail" :rules="ruleInline" :label-width="80">
          <Row v-if="tempModalType === modalType.create || tempModalType === modalType.edit">
            <Row>
              <FormItem label="板块位置:" prop="positionId">
                <Select v-model="goodsModuleDetail.positionId" @on-change="goodsModuleTypeChange"
                        style="width: 200px">
                  <Option v-for="item in goodsModuleList" :value="item.id" class="pt5 pb5 pl15"
                          :key="`search-col-${item.id}`">{{item.description}}
                  </Option>
                </Select>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="板块名称:" prop="sectionName">
                <Input v-model="goodsModuleDetail.sectionName" placeholder="板块名称"/>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="板块主图:建议尺寸 (xxx*xxx):"
                        prop="sectionImg"
                        :label-width="80">
                <div class="demo-upload-list" v-for="item in uploadListMain">
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
          </Row>
          <Row v-if=" tempModalType !== this.modalType.edit && tempModalType !== this.modalType.view">
            <FormItem label="关联商品:">
              <Row>
                <Col span="15">
                <Select
                  ref="shelfSpecificationSelect"
                  :remote="true"
                  :filterable="true"
                  :remote-method="remoteMethod"
                  :loading="shelfSpecificationLoading">
                  <Option @click.native="selectIndex(option)" class="pb5 pt5 pl15"
                          v-for="(option, index) in optionsShelfSpecification"
                          :value="option.id" :key="index">
                    {{option.specificationInfo}}
                  </Option>
                </Select>
                </Col>
                <Col span="4">
                <Button span="4" v-waves @click="addTempData" :loading="addTempDataLoading" class="search-btn ml20" type="primary">
                  <Icon type="md-add"/>&nbsp;添加
                </Button>
                </Col>
              </Row>
            </FormItem>
            <tables
              border
              :columns="tempColumns"
              v-model="goodsModuleDetail.productShelfList"
              @on-delete="modalHandleDelete"
              :loading="tempTableLoading"
            ></tables>
          </Row>
        </Form>
      </div>
      <div slot="footer" v-if="tempModalType === modalType.create || tempModalType === modalType.edit">
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit('modalEdit')">确定
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
  import {
    createProductSection,
    deleteProductSection,
    editProductSection,
    getProductSectionsPages,
    getProductShelvesPages,
    getuiPositionsPages,
    addProductSectionRelationBatch,
    deleteProductSectionRelationBatch
  } from '@/api/fruitermaster';
  import deleteMixin from '@/mixins/deleteMixin.js';
  import tableMixin from '@/mixins/tableMixin.js';
  import searchMixin from '@/mixins/searchMixin.js';
  import uploadMixin from '@/mixins/uploadMixin';
  import IViewUpload from '_c/iview-upload';
  import {positionType, YNEnum} from '@/libs/enumerate';
  import {fenToYuanDot2} from '@/libs/util';

  const goodsModuleDetail = {
    id: 0,
    positionId: null,
    sectionName: '',
    sectionImg: '',
    sorting: 0,
    createAt: '',
    parentId: 0,
    productShelfList: []
  };

  const roleRowData = {
    includeProduct: true,
    includeShelves: true,
    sectionName: '',
    positionId: '',
    page: 1,
    rows: 10
  };
  const commonTempColumns =[
    {
      title: '商品名称',
      key: 'name',
      minWidth: 100
    },
    {
      title: '商品条码',
      minWidth: 100,
      render: (h, params, vm) => {
        const {row} = params;
        return <div>{row.productSpecification.barcode}</div>;
      }
    },
    {
      title: '商品规格',
      minWidth: 100,
      render: (h, params, vm) => {
        const {row} = params;
        return <div>{row.productSpecification.weight+'*'+row.productSpecification.specificationQty+row.productSpecification.packagingUnit}</div>;
      }
    },
    {
      title: '商品原价',
      key: 'originalPrice',
      minWidth: 100,
      render: (h, params, vm) => {
        let {row} = params;
        return <div>{fenToYuanDot2(row.originalPrice)}</div>;
      }
    },
    {
      title: '商品特价',
      key: 'price',
      minWidth: 100,
      render: (h, params, vm) => {
        let {row} = params;
        return <div>{fenToYuanDot2(row.price)}</div>;
      }
    }
  ];
  export default {
    components: {
      Tables,
      IViewUpload
    },
    mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
    computed: {
      advertisementPositionComputed() {
        let tempObj = this.goodsModuleList.find(item => item.id === this.goodsModuleDetail.positionId);
        if (tempObj) {
          return tempObj.description;
        }
        return '';
      }
    },
    created() {
      getuiPositionsPages({
        applicationType: 'HEALTH_GOOD',
        includeSection: YNEnum.NO,
        positionType: positionType.PRODUCT,
        page: 0,
        rows: 0
      }).then(res => {
        this.selectDisable = false;
        this.goodsModuleList = res.array;
        this.getTableData();
      }).catch( error => {
        this.selectDisable = false;
      });
    },
    data() {
      return {
        selectDisable: true,
        goodsModuleList: [],
        ruleInline: {
          positionId: [{required: true, message: '请选择板块位置'}],
          sectionName: [{required: true, message: '请填写板块名称'}],
          sectionImg: [{required: true, message: '请上传板块主图'}],
          productShelfList: [{required: true, message: '请关联商品'},
            {
              validator(rule, value, callback, source, options) {
                console.log(value);
                let errors = [];
                if (value) {
                  if (value.length < 1) {
                    callback('请关联商品');
                  };
                } else {
                  callback('请关联商品');
                };
                callback(errors);
              }
            }
          ]
        },
        tempColumns: [
          ...commonTempColumns,
          {
            title: '操作',
            minWidth: 100,
            key: 'handle',
            options: ['delete']
          }
        ],
        tempColumnsView: [
          ...commonTempColumns
        ],
        columns: [
          {
            type: 'selection',
            key: '',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: 'ID',
            key: 'id',
            sortable: true,
            width: 80,
            fixed: 'left'
          },
          {
            title: '板块位置',
            minWidth: 170,
            render: (h, params, vm) => {
              const {row} = params;
              let tempObj = this.goodsModuleList.find(item => item.id === row.positionId);
              if (tempObj) {
                return <div>{tempObj.description}</div>;
              } else {
                return <div>{row.positionId}</div>;
              };
            }
          },
          {
            title: '板块名称',
            width: 150,
            key: 'sectionName'
          },
          {
            title: '创建时间',
            width: 160,
            key: 'createAt'
          },
          {
            title: '板块排序',
            width: 150,
            key: 'sorting'
          },
          {
            title: '操作',
            minWidth: 200,
            key: 'handle',
            options: ['delete', 'edit', 'view', 'relevance']
          }
        ],
        shelfSpecificationLoading: false,
        addTempDataLoading: false,
        tempTableLoading: false,
        modalViewLoading: false,
        optionsShelfSpecification: [],
        defaultListMain: [],
        uploadListMain: [],
        searchRowData: _.cloneDeep(roleRowData),
        goodsModuleDetail: _.cloneDeep(goodsModuleDetail),
        tempOptionsShelfSpecification: null
      };
    },
    methods: {
      setDefaultUploadList(res) {
        if (res.sectionImg != null) {
          const map = {status: 'finished', url: 'url'};
          let mainImgArr = [];
          map.url = res.sectionImg;
          mainImgArr.push(map);
          if (this.$refs.uploadMain) {
            this.$refs.uploadMain.setDefaultFileList(mainImgArr);
            this.uploadListMain = mainImgArr;
          };
        }
      },
      createTableRow() {
        this.modalViewLoading = true;
        createProductSection({...this.goodsModuleDetail}).then(res => {
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
      modalHandleDelete(params) {
        if (this.tempModalType === this.modalType.create) {
          this.goodsModuleDetail.productShelfList = this.goodsModuleDetail.productShelfList.filter((item, index) =>
            index !== params.row.initRowIndex
          );
        } else {
          this.tempTableLoading = true;
          deleteProductSectionRelationBatch({
            sectionId: this.goodsModuleDetail.id,
            shelfIds: params.row.id
          }).then(res => {
            this.goodsModuleDetail.productShelfList = this.goodsModuleDetail.productShelfList.filter((item, index) =>
              index !== params.row.initRowIndex
            );
            this.getTableData();
          }).finally(res => {
            this.tempTableLoading = false;
          });
        }
      },
      addTempData() {
        if (!this.tempOptionsShelfSpecification) {
          this.$Message.warning('请选择定制计划');
          return;
        };
        if (!this.goodsModuleDetail.productShelfList) {
          this.goodsModuleDetail.productShelfList = [];
        }
        let obj = this.goodsModuleDetail.productShelfList.some(item => {
          return item.id === this.tempOptionsShelfSpecification.id;
        });
        if (!obj) {
          if (this.tempModalType === this.modalType.create) {
            this.goodsModuleDetail.productShelfList.push({...this.tempOptionsShelfSpecification});
          } else {
            this.addTempDataLoading = true;
            this.tempTableLoading =true;
            this.loading = true;
            addProductSectionRelationBatch({
              sectionId: this.goodsModuleDetail.id,
              shelfId: this.tempOptionsShelfSpecification.id
            }).then(res => {
              this.goodsModuleDetail.productShelfList.push({...this.tempOptionsShelfSpecification});
              this.addTempDataLoading = false;
              this.tempTableLoading =false;
              this.loading = false;
            }).catch( error => {
              this.addTempDataLoading = false;
              this.tempTableLoading =false;
              this.loading = false;
            });
          };
        } else {
          this.$Message.warning('已经添加该商品！');
        }
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.tempModalType === this.modalType.create) {
              // 添加状态
              this.createTableRow();
            } else if (this.tempModalType === this.modalType.edit) {
              // 编辑状态
              this.editTableRow();
            }
          } else {
            this.$Message.error('请完善商品的信息!');
          }
        });
      },
      selectIndex(options) {
        this.tempOptionsShelfSpecification = options;
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
        getProductShelvesPages({
          keyword: value + '',
          page: '1',
          rows: '5',
          shelfStatus: 'ON'
        }).then(res => {
          if (res.array.length > 0) {
            this.optionsShelfSpecification.length = 0;
            this.optionsShelfSpecification = this.optionsShelfSpecification.concat(res.array);
          };
          console.log(this.optionsShelfSpecification);
          this.shelfSpecificationLoading = false;
        }).catch( error => {
          this.shelfSpecificationLoading = false;
        });
      },
      goodsModuleTypeChange(value) {
        this.goodsModuleDetail.positionId = value;
      },
      handleSuccessMain(response, file, fileList) {
        this.uploadListMain = fileList;
        this.goodsModuleDetail.sectionImg = null;
        this.goodsModuleDetail.sectionImg = fileList[0].url;
      },
      resetSearchRowData() {
        this.searchRowData = _.cloneDeep(roleRowData);
      },
      resetFields() {
        this.$refs.modalEdit.resetFields();
        if (this.$refs.uploadMain) {
          this.$refs.uploadMain.clearFileList();
        }
        this.uploadListMain = [];
        this.goodsModuleDetail = _.cloneDeep(goodsModuleDetail);
      },
      handleRemoveMain(file) {
        this.$refs.uploadMain.deleteFile(file);
        this.uploadListMain = [];
        this.goodsModuleDetail.sectionImg = null;
      },
      editTableRow() {
        this.modalViewLoading = true;
        editProductSection({
          ...this.goodsModuleDetail
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
      addChildren() {
        if (this.tempModalType !== this.modalType.create) {
          this.resetFields();
          this.tempModalType = this.modalType.create;
        }
        this.tempModalType = this.modalType.create;
        this.modalEdit = true;
      },
      onRelevance(params) {
        this.tempModalType = null;
        this.goodsModuleDetail = params.row;
        this.setDefaultUploadList(params.row);
        if (!this.goodsModuleDetail.productShelfList) {
          this.goodsModuleDetail.productShelfList = [];
        };
        this.modalEdit = true;
      },
      handleView(params) {
        this.tempModalType = this.modalType.view;
        this.goodsModuleDetail = params.row;
        this.modalView = true;
      },
      handleEdit(params) {
        this.tempModalType = this.modalType.edit;
        this.goodsModuleDetail = _.cloneDeep(params.row);
        this.setDefaultUploadList(params.row);
        this.modalEdit = true;
      },
      deleteTable(ids) {
        this.loading = true;
        deleteProductSection({
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
      getTableData() {
        getProductSectionsPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
          this.clearSearchLoading = false;
          this.searchLoading = false;
        }).catch( error => {
          this.loading = false;
          this.clearSearchLoading = false;
          this.searchLoading = false;
        });
      },
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${new Date().valueOf()}.csv`
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
