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
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-publish="onArticleStatus"
      >
        <div slot="searchCondition">
          <Row>
            <Col span="24">
            <Input v-model="searchRowData.title" placeholder="文章标题" class="search-input mr5" style="width: auto"></Input>
            <Input v-model="searchRowData.keywords" placeholder="关键词" class="search-input mr5" style="width: auto"></Input>
            <DatePicker
              v-model="searchRowData.beginCreateAt"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="注册时间起"
              class="search-input"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endCreateAt"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="注册时间止"
              class="search-input  mr5"
              style="width: 150px"
              @on-change="endTimeChange"/>

            <DatePicker
              v-model="searchRowData.beginPublishAt"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              class="search-input  mr5"
              style="width: 150px"
              placeholder="发布时间起"
              @on-change="startPublishChange"/>
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endPublishAt"
              type="datetime"
              placeholder="发布时间止"
              style="width: 150px"
              class="mr5"
              @on-change="endPublishChange"/>
            <Button v-waves class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
            </Col>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="addArticle">
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
      :width="rowData.type=='SON'?'750':'540'"
    >
      <p slot="header">
        <span>文章详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">文章标题:</i-col>
              <i-col span="20">{{ articleDetail.title }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">作者:</i-col>
              <i-col span="16">{{ articleDetail.author }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">创建时间:</i-col>
              <i-col span="16">{{ articleDetail.createAt }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">发布时间:</i-col>
              <i-col span="16">{{ articleDetail.publishAt }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">关键词:</i-col>
              <i-col span="16">{{ articleDetail.keywords }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">文章内容:</i-col>
              <i-col span="16" v-html="articleDetail.content">{{ articleDetail.content }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import { getArticlesPages, deleteArticle, editArticle } from '@/api/fruitermaster';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import uploadMixin from '@/mixins/uploadMixin';
import BookTypeOption from '_c/book-type-option';

const articleDetail = {
  id: 0,
  author: '',
  editor: '',
  createAt: '',
  articleStatus: '',
  content: '',
  title: '',
  contentImage: '',
  headImage: '',
  url: '',
  introduce: '',
  auditor: '',
  editAt: '',
  publishAt: '',
  keywords: '',
  readAmount: '',
  jobTitle: ''
};
const roleRowData = {
  title: '',
  keywords: '',
  beginPublishAt: '',
  endPublishAt: '',
  beginCreateAt: '',
  endCreateAt: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    BookTypeOption
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      modalViewLoading: false,
      ruleInline: {
        title: { required: true, message: '请输入文章标题' },
        author: { required: true, message: '请输入作者' },
        articleStatus: { required: true, message: '请选择文章状态' },
        keywords: { required: true, message: '请输入文章关键词' },
        headImage: { required: true, message: '请上传图片' },
        content: { required: true, message: '请填写内容' }
      },
      useAble: [
        { label: '发布', value: 'PUBLISH' },
        { label: '未发布', value: 'UN_PUBLISH' }
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
          title: '文章标题',
          key: 'title',
          sortable: true,
          width: 180,
          fixed: 'left'
        },
        {
          title: '文章内容',
          key: 'content',
          sortable: false,
          width: 200,
          tooltip: true
        },
        {
          title: '关键词',
          key: 'keywords',
          width: 150
        },
        {
          title: '作者',
          width: 150,
          key: 'author'
        },
        {
          title: '创建时间',
          width: 160,
          key: 'createAt'
        },
        {
          title: '发布状态',
          width: 100,
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
          width: 160,
          key: 'publishAt',
          sortable: true
        },
        {
          title: '操作',
          minWidth: 200,
          key: 'handle',
          options: ['delete', 'edit', 'view', 'onArticleStatus']
        }
      ],
      defaultListMain: [],
      uploadListMain: [],
      content: '',
      rowData: roleRowData,
      searchRowData: this._.cloneDeep(roleRowData),
      articleDetail: this._.cloneDeep(articleDetail),
      exportType: 'xlsx',
      downloadLoading: false
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    useAbleUniteChange(value) {
      this.articleDetail.articleStatus = value;
    },
    startTimeChange(value, date) {
      this.searchRowData.beginCreateAt = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.endCreateAt = value;
    },
    startPublishChange(value) {
      this.searchRowData.beginPublishAt = value;
    },
    endPublishChange(value) {
      this.searchRowData.endPublishAt = value;
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.articleDetail = _.cloneDeep(articleDetail);
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    deleteTable(ids) {
      this.loading = true;
      deleteArticle({
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
    addArticle(params) {
      this.turnToPage('article-edit');
    },
    onArticleStatus(params) {
      console.log(params.row.articleStatus);
      // this.tableData[params.index].onSale = !this.tableData[params.index].onSale;
      this.articleDetail = this._.cloneDeep(params.row);
      if (this.articleDetail.articleStatus == 'PUBLISH') {
        this.articleDetail.articleStatus = 'UN_PUBLISH';
      } else {
        this.articleDetail.articleStatus = 'PUBLISH';
      }
      this.editTableRow();
    },
    editTableRow() {
      this.modalViewLoading = true;
      this.loading = true;
      editArticle(this.articleDetail).then(res => {
        this.$Message.success('修改成功!');
        this.modalViewLoading = false;
        this.loading = false;
        this.getTableData();
      });
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.articleDetail = this._.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.turnToPage({
        name: 'article-edit',
        query: { id: params.row.id }
      });
    },
    getTableData() {
      this.loading = true;
      getArticlesPages(this.searchRowData).then(res => {
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
      getArticlesPages(this.searchRowData).then(res => {
        const tableData = res.array;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['articleStatus'] === 'PUBLISH ' ? item['articleStatus'] = '发布' : item['articleStatus'] = '未发布';
        });
        this.$refs.tables.handleDownload({
          filename: `文章信息-${new Date().valueOf()}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
