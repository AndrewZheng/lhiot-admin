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
            <img :src="goodsModuleDetail.sectionImage" span="18" style="width: 300px"/>
          </i-col>
        </Row>
        <Row span="24" class-name="mb10">
          <i-col span="8">板块名称:</i-col>
          <i-col span="16">{{goodsModuleDetail.sectionName}}</i-col>
        </Row>
        <Row span="24" class-name="mb10">
          <i-col span="8">板块序号:</i-col>
          <i-col span="16">{{goodsModuleDetail.sort}}</i-col>
        </Row>
        <Row v-if="goodsModuleDetail.customPlanList" class-name="mb10">
          <tables
            border
            :columns="tempColumnsView"
            v-model="goodsModuleDetail.customPlanList"
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
        <Form ref="modalEdit" :model="goodsModuleDetail" :rules="ruleInline" :label-width="90">
          <Row v-if="tempModalType === modalType.create || tempModalType === modalType.edit">
            <Row>
              <FormItem label="定制板块编码:" prop="sectionCode">
                <Input v-model="goodsModuleDetail.sectionCode"/>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="板块名称:" prop="sectionName">
                <Input v-model="goodsModuleDetail.sectionName" placeholder="板块名称"/>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="板块主图:建议尺寸 (xxx*xxx):"
                        prop="sectionImage"
                        >
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
            <Row>
              <FormItem label="板块序号:" prop="sort">
                <Input v-model="goodsModuleDetail.sort" placeholder="广告名"/>
              </FormItem>
            </Row>
          </Row>
          <Row v-if=" tempModalType !== this.modalType.edit && tempModalType !== this.modalType.view">
            <FormItem label="关联定制:">
              <Row>
                <Col span="10">
                <Select
                  ref="shelfSpecificationSelect"
                  :remote="true"
                  :filterable="true"
                  :remote-method="remoteMethod"
                  :loading="shelfSpecificationLoading">
                  <Option @click.native="selectIndex(option)" class="pb5 pt5 pl15"
                          v-for="(option, index) in optionsShelfSpecification"
                          :value="option.id" :key="index">
                    {{option.name}}
                  </Option>
                </Select>
                </Col>
                <Col span="4">
                  <InputNumber :min="1" v-model="sort" class="ml20"/>
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
              v-model="goodsModuleDetail.customPlanList"
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
    createCustomPlanSection,
    deletetCustomPlanSection,
    editCustomPlanSection,
    getCustomPlanSectionsPages,
    getCustomPlanPages,
    addCustomPlanSectionRelationBatch,
    deletetCustomPlanSectionRelationBatch
  } from '@/api/fruitermaster';
  import deleteMixin from '@/mixins/deleteMixin.js';
  import tableMixin from '@/mixins/tableMixin.js';
  import searchMixin from '@/mixins/searchMixin.js';
  import uploadMixin from '@/mixins/uploadMixin';
  import IViewUpload from '_c/iview-upload';
  import {positionType, YN} from '@/libs/enumerate';

  const goodsModuleDetail = {
    id: 0,
    sectionName: '',
    sectionImage: '',
    sort: 0,
    createAt: '',
    parentId: 0,
    sectionCode: '',
    customPlanList: []
  };

  const roleRowData = {
    sectionName: '',
    page: 1,
    rows: 10
  };
  const commonTempColumns =[
    {
      title: '定制名称',
      key: 'name',
      minWidth: 100,
    },
    {
      title: '定制描述',
      key: 'description',
      minWidth: 100,
    },
    {
      title: '排序',
      key: 'relationSort',
      minWidth: 100,
    }
  ]
  export default {
    components: {
      Tables,
      IViewUpload
    },
    mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
    created() {
      this.getTableData();
    },
    data() {
      return {
        sort:1,
        selectDisable: true,
        goodsModuleList: [],
        ruleInline: {
          sectionCode:[{required: true, message: '请填写编码'}],
          sectionName: [{required: true, message: '请填写板块名称'}],
          sectionImage: [{required: true, message: '请上传板块主图'}],
          sorting:[
            {required: true, message: '请输入序号'},
            {validator(rule, value, callback, source, options) {
                let errors = [];
                if (!/^[0-9]\d*$/.test(value)) {
                  callback('必须为整数');
                }
                callback(errors);
              }}
          ],
          customPlanList: [{required: true, message: '请关联定制'},
            {
              validator(rule, value, callback, source, options) {
                console.log(value);
                let errors = [];
                if (value) {
                  if (value.length < 1) {
                    callback('请关联定制');
                  };
                } else {
                  callback('请关联定制');
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
            key: 'sort'
          },
          {
            title: '操作',
            minWidth: 200,
            key: 'handle',
            options: ['delete', 'edit', 'view', 'relevance']
          }
        ],
        shelfSpecificationLoading: false,
        addTempDataLoading:false,
        tempTableLoading:false,
        modalViewLoading: false,
        optionsShelfSpecification: [],
        defaultListMain: [],
        uploadListMain: [],
        searchRowData: _.cloneDeep(roleRowData),
        goodsModuleDetail: _.cloneDeep(goodsModuleDetail),
        tempOptionsShelfSpecification:null
      };
    },
    methods: {
      setDefaultUploadList(res) {
        if (res.sectionImage != null) {
          const map = {status: 'finished', url: 'url'};
          let mainImgArr = [];
          map.url = res.sectionImage;
          mainImgArr.push(map);
          if (this.$refs.uploadMain) {
            this.$refs.uploadMain.setDefaultFileList(mainImgArr);
            this.uploadListMain = mainImgArr;
          };
        }
      },
      createTableRow() {
        this.modalViewLoading = true;
        createCustomPlanSection({...this.goodsModuleDetail}).then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.resetFields();
          this.getTableData();
        });
      },
      modalHandleDelete(params) {
        if (this.tempModalType === this.modalType.create) {
          this.goodsModuleDetail.customPlanList = this.goodsModuleDetail.customPlanList.filter((item, index) =>
            index !== params.row.initRowIndex
          );
        }else{
          this.tempTableLoading = true
          deletetCustomPlanSectionRelationBatch({
            sectionId:this.goodsModuleDetail.id,
            planIds: params.row.id,
            sort:this.sort
          }).then(res=>{
            this.goodsModuleDetail.customPlanList = this.goodsModuleDetail.customPlanList.filter((item, index) =>
              index !== params.row.initRowIndex
            );
            this.getTableData();
          }).finally(res=>{
            this.tempTableLoading = false
          })
        }
      },
      addTempData() {
        console.log(this.optionsShelfSpecification);
        if (!this.tempOptionsShelfSpecification) {
          this.$Message.warning('请选择定制计划')
          return
        };
        if (!this.goodsModuleDetail.customPlanList) {
          this.goodsModuleDetail.customPlanList = []
        }
        let obj = this.goodsModuleDetail.customPlanList.some( item => {
         return item.id === this.tempOptionsShelfSpecification.id
        })
        if (!obj) {
          if (this.tempModalType === this.modalType.create) {
            this.goodsModuleDetail.customPlanList.push({...this.tempOptionsShelfSpecification,relationSort:this.sort});
          }else {
            this.addTempDataLoading = true;
            this.tempTableLoading =true;
            this.loading = true;
            addCustomPlanSectionRelationBatch({
              sectionId:this.goodsModuleDetail.id,
              shelfId: this.tempOptionsShelfSpecification.id
            }).then(res =>{
              this.goodsModuleDetail.customPlanList.push(this.tempOptionsShelfSpecification);
              this.addTempDataLoading = false;
              this.tempTableLoading =false;
              this.loading = false
            })
          };
        } else {
          this.$Message.warning('已经添加该商品！');
        }
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.tempModalType === this.modalType.create) {
              //添加状态
              this.createTableRow();
            } else if (this.tempModalType === this.modalType.edit) {
              //编辑状态
              this.editTableRow()
            }
          } else {
            this.$Message.error('请完善商品的信息!');
          }
        });
      },
      selectIndex(options) {
        this.tempOptionsShelfSpecification = options
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
        getCustomPlanPages({
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
        });
      },
      handleSuccessMain(response, file, fileList) {
        this.uploadListMain = fileList;
        this.goodsModuleDetail.sectionImage = null;
        this.goodsModuleDetail.sectionImage = fileList[0].url;
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
        this.goodsModuleDetail.sectionImage = null;
      },
      editTableRow() {
        this.modalViewLoading = true;
        editCustomPlanSection({
          ...this.goodsModuleDetail
        }).then(res => {
          this.resetFields();
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.getTableData();
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
        if (!this.goodsModuleDetail.customPlanList) {
          this.goodsModuleDetail.customPlanList = [];
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
        this.goodsModuleDetail = params.row;
        this.setDefaultUploadList(params.row);
        this.modalEdit = true;
      },
      deleteTable(ids) {
        this.loading = true;
        deletetCustomPlanSection({
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
        getCustomPlanSectionsPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
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
