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
            v-model="searchRowData.nameCn"
            placeholder="板块名称"
            class="search-input mr5"
            style="width: 150px"
            clearable></Input>
          <Select
            :disable="selectDisable"
            v-model="searchRowData.positionIds"
            class="search-col mr5"
            placeholder="板块位置"
            style="width: 150px"
            clearable>
            <Option
              v-for="item in goodsModuleList"
              :value="item.id"
              :key="`search-col-${item.id}`"
              class="pt5 pb5 pl15">{{ item.description }}
            </Option>
          </Select>
          <Button v-waves class="search-btn mr5" type="primary" @click="handleSearch">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="addChildren">
            <Icon type="md-add"/>创建
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash"/>删除
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

    <!-- 板块详情 -->
    <Modal v-model="modalView" :mask-closable="false" :width="700">
      <p slot="header">
        <span>文章板块详情</span>
      </p>
      <div class="modal-content">
        <Row span="24" class-name="mb10">
          <i-col span="12">
            <i-col span="8">板块位置:</i-col>
            <i-col span="16">{{ advertisementPositionComputed }}</i-col>
          </i-col>
          <i-col span="12">
            <i-col span="8">板块名称:</i-col>
            <i-col span="16">{{ articlesModuleDetail.nameCn }}</i-col>
          </i-col>
        </Row>
        <Row span="24" class-name="mb10">
          <i-col span="12">
            <i-col span="8">板块编码:</i-col>
            <i-col span="16">{{ articlesModuleDetail.nameEn }}</i-col>
          </i-col>
          <i-col span="12">
            <i-col span="8">创建时间:</i-col>
            <i-col span="16">{{ articlesModuleDetail.createAt }}</i-col>
          </i-col>
        </Row>
        <Row span="24" class-name="mb10">
          <i-col span="12">
            <i-col span="8">板块序号:</i-col>
            <i-col span="16">{{ articlesModuleDetail.sorting }}</i-col>
          </i-col>
          <i-col span="12">
            <i-col span="8">父级板块id:</i-col>
            <i-col span="16">{{ articlesModuleDetail.parentId }}</i-col>
          </i-col>
        </Row>
        <Row v-if="articlesModuleDetail.articleList" class-name="mb10">
          <tables
            :columns="tempColumnsView"
            v-model="articlesModuleDetail.articleList"
            border
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <!-- 新增/修改 -->
    <Modal v-model="modalEdit" :width="900" :mask-closable="false">
      <p slot="header">
        <span>{{ tempModalType === modalType.create?'创建文章板块':'编辑文章板块' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="articlesModuleDetail" :rules="ruleInline" :label-width="80">
          <Row v-if="tempModalType === modalType.create || tempModalType === modalType.edit">
            <Row>
              <Col span="12">
              <FormItem label="板块位置:" prop="positionId">
                <Select
                  v-model="articlesModuleDetail.positionId"
                  style="width: 200px"
                  @on-change="goodsModuleTypeChange">
                  <Option
                    v-for="item in goodsModuleList"
                    :value="item.id"
                    :key="`search-col-${item.id}`"
                    class="pt5 pb5 pl15">{{ item.description }}
                  </Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="父级id:" prop="parentId">
                <InputNumber v-model="articlesModuleDetail.parentId" placeholder="父级id" style="width: 200px"></InputNumber>
              </FormItem>
               </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem label="板块名称:" prop="nameCn">
                <Input v-model="articlesModuleDetail.nameCn" placeholder="板块名称"></Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="板块编码:" prop="nameEn">
                <Input v-model="articlesModuleDetail.nameEn" placeholder="板块编码"></Input>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem label="板块排序:" prop="sorting">
                <InputNumber v-model="articlesModuleDetail.sorting" placeholder="板块排序" style="width: 200px"></InputNumber>
              </FormItem>
              </Col>
            </Row>
          </Row>
          <Row v-if=" tempModalType !== modalType.edit && tempModalType !== modalType.view">
            <Row>
              <Col span="11">
              <FormItem label="关联文章:">
                <Select
                  ref="shelfArticleSelect"
                  :remote="true"
                  :filterable="true"
                  :remote-method="remoteMethod"
                  :loading="shelfArticleLoading"
                  clearable
                  placeholder="请输入文章标题">
                  <Option
                    v-for="(option, index) in optionsShelfArticle"
                    :value="option.id"
                    :key="index"
                    class="pb5 pt5 pl15"
                    @click.native="selectIndex(option)">
                    {{ option.title }}
                  </Option>
                </Select>
              </FormItem>
                </Col>
              <Col span="6">
              <!-- <FormItem label="关联序号:" >
                <InputNumber v-model="articlesModuleDetail.relationSorting" class="ml20" label="关联序号"></InputNumber>
              </FormItem> -->
                </Col>
              <Col span="4">
              <Button v-waves :loading="addTempDataLoading" span="4" class="search-btn ml20" type="primary" @click="addTempData">
                <Icon type="md-add"/>&nbsp;添加
              </Button>
                </Col>
            </Row>
            <tables
              :columns="tempColumns"
              v-model="articlesModuleDetail.articleList"
              :loading="tempTableLoading"
              border
              @on-delete="modalHandleDelete"
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
  createArticleSection,
  deleteArticleSection,
  editArticleSection,
  getArticleSectionsPages,
  getArticlesPages,
  getuiPositionsPages,
  addArticleSectionRelation,
  deleteArticleSectionRelationBatch
} from '@/api/fruitermaster';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import uploadMixin from '@/mixins/uploadMixin';
import IViewUpload from '_c/iview-upload';
import { positionType, YNEnum } from '@/libs/enumerate';

const articlesModuleDetail = {
  id: 0,
  positionId: null,
  nameCn: '',
  nameEn: '',
  sorting: 0,
  createAt: '',
  parentId: 0,
  articleList: [],
  relationSorting: 0
};

const roleRowData = {
  applicationType: null,
  includeArticles: true,
  includeArticlesQty: 10,
  nameCn: '',
  positionIds: '',
  page: 1,
  rows: 10
};
const commonTempColumns = [
  {
    title: 'ID',
    key: 'id',
    minWidth: 60
  },
  {
    title: '文章标题',
    key: 'title',
    minWidth: 120
  },
  {
    title: '作者',
    minWidth: 80,
    key: 'author'
  },
  {
    title: '文章简介',
    minWidth: 100,
    key: 'introduce',
    tooltip: true
  },
  {
    title: '文章类型',
    minWidth: 90,
    key: 'articleType',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.articleType === 'ORIGINAL') {
        return <div><tag color='success'>{'原创'}</tag></div>;
      } else if (row.articleType === 'REPRINTED') {
        return <div><tag color='warning'>{'转载'}</tag></div>;
      } else {
        return <div>{row.articleType}</div>;
      }
    }
  },
  {
    title: '文章状态',
    minWidth: 90,
    key: 'articleStatus',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.articleStatus === 'PUBLISH') {
        return <div><tag color='success'>{'发布'}</tag></div>;
      } else if (row.articleStatus === 'UN_PUBLISH') {
        return <div><tag color='error'>{'未发布'}</tag></div>;
      } else {
        return <div>{row.articleStatus}</div>;
      }
    }
  },
  {
    title: '发布时间',
    minWidth: 160,
    key: 'publishAt'
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
      selectDisable: true,
      goodsModuleList: [],
      ruleInline: {
        positionId: [{ required: true, message: '请选择板块位置' }],
        nameCn: [{ required: true, message: '请填写板块名称' }],
        nameEn: [{ required: true, message: '请填写板块编码' }],
        sorting: [{ required: true, message: '请填写板块排序' }],
        parentId: [{ required: true, message: '请填写父级板块id' }],
        articleList: [{ required: true, message: '请关联文章' },
          {
            validator(rule, value, callback, source, options) {
              console.log(value);
              const errors = [];
              if (!value || value.length < 1) {
                errors.push(new Error('请关联文章'));
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
          minWidth: 120,
          render: (h, params, vm) => {
            const { row } = params;
            const tempObj = this.goodsModuleList.find(item => item.id === row.positionId);
            if (tempObj) {
              return <div>{tempObj.description}</div>;
            } else {
              return <div>{row.positionId}</div>;
            }
          }
        },
        {
          title: '板块名称',
          width: 150,
          key: 'nameCn'
        },
        {
          title: '板块编码',
          width: 150,
          key: 'nameEn'
        },
        {
          title: '父级id',
          width: 160,
          key: 'parentId'
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
          options: ['view', 'edit', 'delete', 'relevance']
        }
      ],
      shelfArticleLoading: false,
      addTempDataLoading: false,
      tempTableLoading: false,
      modalViewLoading: false,
      optionsShelfArticle: [],
      defaultListMain: [],
      uploadListMain: [],
      searchRowData: _.cloneDeep(roleRowData),
      articlesModuleDetail: _.cloneDeep(articlesModuleDetail),
      tempOptionsArticle: null
    };
  },
  computed: {
    advertisementPositionComputed() {
      const tempObj = this.goodsModuleList.find(item => item.id === this.articlesModuleDetail.positionId);
      if (tempObj) {
        return tempObj.description;
      }
      return '';
    }
  },
  created() {
    getuiPositionsPages({
      applicationType: this.applicationType,
      includeSection: YNEnum.NO,
      positionType: positionType.ARTICLE,
      page: 0,
      rows: 0
    }).then(res => {
      this.selectDisable = false;
      this.goodsModuleList = res.array;
      this.getTableData();
    }).catch(() => {
      this.selectDisable = false;
    });
  },
  methods: {
    createTableRow() {
      this.modalViewLoading = true;
      this.articlesModuleDetail.applicationType = this.applicationType;
      createArticleSection({ ...this.articlesModuleDetail }).then(res => {
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
        this.articlesModuleDetail.articleList = this.articlesModuleDetail.articleList.filter((item, index) =>
          index !== params.row.initRowIndex
        );
      } else {
        this.tempTableLoading = true;
        deleteArticleSectionRelationBatch({
          sectionId: this.articlesModuleDetail.id,
          articleIds: params.row.id
        }).then(res => {
          this.articlesModuleDetail.articleList = this.articlesModuleDetail.articleList.filter((item, index) =>
            index !== params.row.initRowIndex
          );
          this.getTableData();
        }).finally(res => {
          this.tempTableLoading = false;
        });
      }
    },
    addTempData() {
      if (!this.tempOptionsArticle) {
        this.$Message.warning('请选择文章');
        return;
      }
      // if (!(this.articlesModuleDetail.relationSorting > 0)) {
      //   this.$Message.warning('关联序号必须大于0');
      //   return;
      // }
      if (!this.articlesModuleDetail.articleList) {
        this.articlesModuleDetail.articleList = [];
      }
      const obj = this.articlesModuleDetail.articleList.some(item => {
        return item.id === this.tempOptionsArticle.id;
      });
      if (!obj) {
        if (this.tempModalType === this.modalType.create) {
          this.articlesModuleDetail.articleList.push({ ...this.tempOptionsArticle });
        } else {
          this.addTempDataLoading = true;
          this.tempTableLoading = true;
          this.loading = true;
          addArticleSectionRelation({
            sectionId: this.articlesModuleDetail.id,
            articleId: this.tempOptionsArticle.id
            // sorting: this.articlesModuleDetail.relationSorting
          }).then(res => {
            this.articlesModuleDetail.articleList.push({ ...this.tempOptionsArticle });
            this.addTempDataLoading = false;
            this.tempTableLoading = false;
            this.loading = false;
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
          this.$Message.error('请完善商品的信息!');
        }
      });
    },
    selectIndex(options) {
      this.tempOptionsArticle = options;
    },
    remoteMethod(query) {
      if (query !== '') {
        this.handleSearchAutoComplete(query);
      } else {
        this.optionsShelfArticle = [];
      }
    },
    handleSearchAutoComplete(value) {
      this.shelfArticleLoading = true;
      getArticlesPages({
        title: value + '',
        applicationType: this.applicationType,
        page: '1',
        rows: '5',
        articleStatus: 'PUBLISH'
      }).then(res => {
        if (res.array.length > 0) {
          this.optionsShelfArticle.length = 0;
          this.optionsShelfArticle = this.optionsShelfArticle.concat(res.array);
        }
        console.log(this.optionsShelfArticle);
        this.shelfArticleLoading = false;
      }).catch(() => {
        this.shelfArticleLoading = false;
      });
    },
    goodsModuleTypeChange(value) {
      this.articlesModuleDetail.positionId = value;
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.articlesModuleDetail.sectionImg = null;
      this.articlesModuleDetail.sectionImg = fileList[0].url;
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
      this.articlesModuleDetail = _.cloneDeep(articlesModuleDetail);
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.uploadListMain = [];
      this.articlesModuleDetail.sectionImg = null;
    },
    editTableRow() {
      this.modalViewLoading = true;
      editArticleSection({
        ...this.articlesModuleDetail
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
      this.articlesModuleDetail = params.row;
      if (!this.articlesModuleDetail.articleList) {
        this.articlesModuleDetail.articleList = [];
      }
      this.modalEdit = true;
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.articlesModuleDetail = params.row;
      this.modalView = true;
    },
    handleEdit(params) {
      this.$refs.modalEdit.resetFields();
      this.tempModalType = this.modalType.edit;
      this.articlesModuleDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    deleteTable(ids) {
      this.loading = true;
      deleteArticleSection({
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
      this.searchRowData.applicationType = this.applicationType;
      getArticleSectionsPages(this.searchRowData).then(res => {
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
    modalHandleEdit(params) {
      console.log('modalHandleEdit' + params.rows);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
