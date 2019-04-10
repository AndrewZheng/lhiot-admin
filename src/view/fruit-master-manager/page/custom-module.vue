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
        @on-delete="handleDelete"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-relevance="onRelevance"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.sectionName"
            placeholder="版块名称"
            class="search-input mr5"
            style="width: 150px"></Input>
          <Button v-waves class="search-btn mr5" type="primary" @click="handleSearch">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class=" mr5" @click="addChildren">
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
      :width="700"
    >
      <p slot="header">
        <span>商品板块详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <i-col span="6">商品板块图片:</i-col>
            <img :src="goodsModuleDetail.sectionImage" span="18" style="width: 300px">
          </i-col>
        </Row>
        <Row span="24" class-name="mb10">
          <i-col span="8">板块名称:</i-col>
          <i-col span="16">{{ goodsModuleDetail.sectionName }}</i-col>
        </Row>
        <Row span="24" class-name="mb10">
          <i-col span="8">链接url:</i-col>
          <i-col span="16">{{ goodsModuleDetail.url }}</i-col>
        </Row>
        <Row span="24" class-name="mb10">
          <i-col span="8">板块序号:</i-col>
          <i-col span="16">{{ goodsModuleDetail.sort }}</i-col>
        </Row>
        <Row v-if="goodsModuleDetail.customPlanList" class-name="mb10">
          <tables
            :columns="tempColumnsView"
            v-model="goodsModuleDetail.customPlanList"
            border
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
        <span>{{ tempModalType === modalType.create?'创建板块':'编辑板块' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="goodsModuleDetail" :rules="ruleInline" :label-width="90">
          <Row v-if="tempModalType === modalType.create || tempModalType === modalType.edit">
            <Row>
              <FormItem label="定制板块编码:" prop="sectionCode">
                <Input v-model="goodsModuleDetail.sectionCode"></Input>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="板块名称:" prop="sectionName">
                <Input v-model="goodsModuleDetail.sectionName" placeholder="板块名称"></Input>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="链接url:" prop="url">
                <Input v-model="goodsModuleDetail.url" placeholder="链接url" ></Input>
              </FormItem>
            </Row>
            <Row>
              <FormItem
                label="板块主图:建议尺寸 (xxx*xxx):"
                prop="sectionImage"
              >
                <Input v-show="false" v-model="goodsModuleDetail.sectionImage" style="width: auto"></Input>
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
            <Row>
              <FormItem label="板块序号:" prop="sort">
                <Input v-model="goodsModuleDetail.sort" placeholder="广告名"></Input>
              </FormItem>
            </Row>
          </Row>
          <Row v-if=" tempModalType !== modalType.edit && tempModalType !== modalType.view">
            <FormItem label="关联定制:">
              <Row>
                <Col span="10">
                <Select
                  ref="shelfSpecificationSelect"
                  :remote="true"
                  :filterable="true"
                  :remote-method="remoteMethod"
                  :loading="shelfSpecificationLoading">
                  <Option
                    v-for="(option, index) in optionsShelfSpecification"
                    :value="option.id"
                    :key="index"
                    class="pb5 pt5 pl15"
                    @click.native="selectIndex(option)">
                    {{ option.name }}
                  </Option>
                </Select>
                </Col>
                <Col span="4">
                <InputNumber :min="1" v-model="sort" class="ml20"></InputNumber>
                </Col>
                <Col span="4">
                <Button v-waves :loading="addTempDataLoading" span="4" class="search-btn ml20" type="primary" @click="addTempData">
                  <Icon type="md-add"/>&nbsp;添加
                </Button>
                </Col>
              </Row>
            </FormItem>
            <tables
              :columns="tempColumns"
              v-model="goodsModuleDetail.customPlanList"
              :loading="tempTableLoading"
              border
              @on-delete="modalHandleDelete"
              @on-inline-edit="modalHandleEdit"
              @on-inline-save="modalHandleSave"
            ></tables>
          </Row>
        </Form>
      </div>
      <div v-if="tempModalType === modalType.create || tempModalType === modalType.edit" slot="footer">
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
import {
  createCustomPlanSection,
  deletetCustomPlanSection,
  editCustomPlanSection,
  getCustomPlanSectionsPages,
  getCustomPlanPages,
  addCustomPlanSectionRelationBatch,
  deletetCustomPlanSectionRelationBatch,
  editCustomPlanSectionRelation
} from '@/api/fruitermaster';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import uploadMixin from '@/mixins/uploadMixin';
import IViewUpload from '_c/iview-upload';

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

const commonTempColumns = [
  {
    title: '定制名称',
    key: 'name',
    minWidth: 100
  },
  {
    title: '定制描述',
    key: 'description',
    minWidth: 100
  },
  {
    title: '排序',
    key: 'relationSort',
    minWidth: 100,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h('div', [
          h('InputNumber', {
            domProps: {
              value: params.row.relationSort
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.relationSort = event;
                }
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.relationSort);
      }
    }
  }
];

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      sort: 1,
      selectDisable: true,
      goodsModuleList: [],
      ruleInline: {
        sectionCode: [{ required: true, message: '请填写编码' }],
        sectionName: [{ required: true, message: '请填写板块名称' }],
        sectionImage: [{ required: true, message: '请上传板块主图' }],
        sorting: [
          { required: true, message: '请输入序号' },
          { validator(rule, value, callback, source, options) {
            const errors = [];
            if (!/^[0-9]\d*$/.test(value)) {
              errors.push(new Error('必须为整数'));
            }
            callback(errors);
          } }
        ],
        customPlanList: [{ required: true, message: '请关联定制' },
          {
            validator(rule, value, callback, source, options) {
              console.log(value);
              const errors = [];
              if (!value || value.length < 1) {
                errors.push(new Error('请关联定制'));
              }
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
          options: ['inlineEdit', 'delete']
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
          minWidth: 150,
          key: 'sectionName'
        },
        {
          title: '链接url',
          minWidth: 150,
          key: 'url'
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
          options: ['view', 'edit', 'delete', 'relevance']
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
  created() {
    this.getTableData();
  },
  methods: {
    setDefaultUploadList(res) {
      if (res.sectionImage != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.sectionImage;
        mainImgArr.push(map);
        if (this.$refs.uploadMain) {
          this.$refs.uploadMain.setDefaultFileList(mainImgArr);
          this.uploadListMain = mainImgArr;
        }
      }
    },
    createTableRow() {
      this.modalViewLoading = true;
      createCustomPlanSection({ ...this.goodsModuleDetail }).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.resetFields();
        this.getTableData();
      }).catch(() => {
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
    },
    modalHandleDelete(params) {
      if (this.tempModalType === this.modalType.create) {
        this.goodsModuleDetail.customPlanList = this.goodsModuleDetail.customPlanList.filter((item, index) =>
          index !== params.row.initRowIndex
        );
      } else {
        this.tempTableLoading = true;
        deletetCustomPlanSectionRelationBatch({
          sectionId: this.goodsModuleDetail.id,
          planIds: params.row.id,
          sort: this.sort
        }).then(res => {
          this.goodsModuleDetail.customPlanList = this.goodsModuleDetail.customPlanList.filter((item, index) =>
            index !== params.row.initRowIndex
          );
          this.getTableData();
        }).finally(res => {
          this.tempTableLoading = false;
        });
      }
    },
    addTempData() {
      console.log(this.optionsShelfSpecification);
      if (!this.tempOptionsShelfSpecification) {
        this.$Message.warning('请选择定制计划');
        return;
      }
      const reg = /^-?\d+$/;
      if (!reg.test(this.sort)) {
        this.$Message.error('排序必须是整数');
        return;
      }
      if (!this.goodsModuleDetail.customPlanList) {
        this.goodsModuleDetail.customPlanList = [];
      }
      const obj = this.goodsModuleDetail.customPlanList.some(item => {
        return item.id === this.tempOptionsShelfSpecification.id;
      });
      if (!obj) {
        if (this.tempModalType === this.modalType.create) {
          this.goodsModuleDetail.customPlanList.push({ ...this.tempOptionsShelfSpecification, relationSort: this.sort, isEdit: false });
        } else {
          this.addTempDataLoading = true;
          this.tempTableLoading = true;
          this.loading = true;
          addCustomPlanSectionRelationBatch({
            sectionId: this.goodsModuleDetail.id,
            planId: this.tempOptionsShelfSpecification.id,
            sort: this.sort
          }).then(res => {
            this.goodsModuleDetail.customPlanList.push({ ...this.tempOptionsShelfSpecification, relationSort: this.sort, isEdit: false });
            this.addTempDataLoading = false;
            this.tempTableLoading = false;
            this.loading = false;
            this.getTableData();
          }).catch(() => {
            this.addTempDataLoading = false;
            this.tempTableLoading = false;
            this.loading = false;
          });
        }
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
          this.$Message.error('请完善信息!');
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
      getCustomPlanPages({
        name: value + '',
        page: '1',
        rows: '5'
      }).then(res => {
        if (res.array.length > 0) {
          this.optionsShelfSpecification.length = 0;
          this.optionsShelfSpecification = this.optionsShelfSpecification.concat(res.array);
        }
        console.log(this.optionsShelfSpecification);
        this.shelfSpecificationLoading = false;
      }).catch(() => {
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
      }).catch(() => {
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
      this.goodsModuleDetail.customPlanList.forEach(element => {
        element.isEdit = false;
      });
      this.setDefaultUploadList(params.row);
      if (!this.goodsModuleDetail.customPlanList) {
        this.goodsModuleDetail.customPlanList = [];
      }
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
      this.goodsModuleDetail.customPlanList.forEach(element => {
        element.isEdit = false;
      });
      // console.log('handleEdit' + JSON.stringify(this.goodsModuleDetail.customPlanList));
      this.setDefaultUploadList(params.row);
      this.$refs.modalEdit.resetFields();
      this.modalEdit = true;
    },
    deleteTable(ids) {
      this.loading = true;
      deletetCustomPlanSection({
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
    getTableData() {
      getCustomPlanSectionsPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.clearSearchLoading = false;
        this.searchLoading = false;
      }).catch(() => {
        this.loading = false;
        this.clearSearchLoading = false;
        this.searchLoading = false;
      });
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    },
    modalHandleEdit(params) {
      this.$set(params.row, 'isEdit', true);
      // console.log('modalHandleEidt' + JSON.stringify(params.row));
    },
    modalHandleSave(params) {
      // console.log('modalHandleSave' + JSON.stringify(params.row));
      this.tempTableLoading = true;
      const data = {
        id: params.row.relationId,
        sectionId: this.goodsModuleDetail.id,
        planId: params.row.id,
        sort: params.row.relationSort
      };
        // console.log('data' + JSON.stringify(data));
      if (data.id !== null && data.sort > 0) {
        editCustomPlanSectionRelation(data).then(res => {
          this.getTableData();
        }).finally(res => {
          this.tempTableLoading = false;
        });
      }
      this.tempTableLoading = false;
      this.$set(params.row, 'isEdit', false);
      // console.log('modalHandleSave' + JSON.stringify(params.row));
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
