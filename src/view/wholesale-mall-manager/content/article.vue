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
            <Input
              v-model="searchRowData.articleTitle"
              placeholder="文章标题"
              class="search-input mr5"
              style="width: auto"
            ></Input>
            <Select
              v-model="searchRowData.articleType"
              class="search-col mr5"
              placeholder="文章类别"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in articleTypeEnum"
                :key="item.value"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.createType"
              class="search-col mr5"
              placeholder="创作类别"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in createTypeEnum"
                :key="item.value"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
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
              class="search-input mr5"
              style="width: 150px"
              @on-change="endTimeChange"
            />

            <DatePicker
              v-model="searchRowData.beginPublishAt"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              class="search-input mr5"
              style="width: 150px"
              placeholder="发布时间起"
              @on-change="startPublishChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endPublishAt"
              type="datetime"
              placeholder="发布时间止"
              style="width: 150px"
              class="mr5"
              @on-change="endPublishChange"
            />
            <Button v-waves class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除条件
            </Button>
            </Col>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="addArticle">
            <Icon type="md-add" /> 添加
          </Button>
          <Poptip
            confirm
            placement="bottom"
            article-title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" /> 批量删除
            </Button>
          </Poptip>
          <!-- <BookTypeOption v-model="exportType" class="mr5" /> -->
          <Button
            :loading="downloadLoading"
            class="search-btn mr5"
            type="primary"
            @click="handleDownload"
          >
            <Icon type="md-download" /> 导出
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

    <Modal v-model="modalView" :mask-closable="false" :width="900">
      <p slot="header">
        <span>文章详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                文章标题:
              </i-col>
              <i-col span="20">
                {{ articleDetail.articleTitle }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                文章副标题:
              </i-col>
              <i-col span="20">
                {{ articleDetail.articleSubhead }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                作者:
              </i-col>
              <i-col span="16">
                {{ articleDetail.articleAuthor }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                创建时间:
              </i-col>
              <i-col span="16">
                {{ articleDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                发布时间:
              </i-col>
              <i-col span="16">
                {{ articleDetail.publishTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                文章内容:
              </i-col>
              <i-col span="16" v-html="articleDetail.articleContent"></i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                资源链接:
              </i-col>
              <i-col span="16" v-html="articleDetail.resouceUrl"></i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">
          关闭
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import BookTypeOption from '_c/book-type-option';

import { getArticlesPages, deleteArticle, editArticle } from '@/api/wholesale';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import uploadMixin from '@/mixins/uploadMixin';
import { articleTypeEnum, createTypeEnum } from '@/libs/enumerate';
import { articleTypeConvert, createTypeConvert } from '@/libs/converStatus';

const articleDetail = {
  id: 0,
  articleAuthor: '',
  articleTitle: '',
  publishStatus: '',
  articleContent: '',
  contentImage: '',
  articleUrl: '',
  introduce: '',
  auditor: '',
  editAt: '',
  publishTime: '',
  keywords: '',
  readAmount: '',
  articleSubhead: '',
  createTime: '',
  articleType: '', // perday-每日精选 industry-行业趋势
  createType: '', // original-原创文章 reprint-转载文章
  rankNum: 0,
  resouceUrl: ''
};

const roleRowData = {
  articleTitle: '',
  articleType: '',
  createType: '',
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
      articleTypeEnum,
      createTypeEnum,
      exportType: 'xlsx',
      modalViewLoading: false,
      downloadLoading: false,
      defaultListMain: [],
      uploadListMain: [],
      searchRowData: this._.cloneDeep(roleRowData),
      articleDetail: this._.cloneDeep(articleDetail),
      ruleInline: {
        articleTitle: { required: true, message: '请输入文章标题' },
        articleAuthor: { required: true, message: '请输入作者' },
        publishStatus: { required: true, message: '请选择文章状态' },
        keywords: { required: true, message: '请输入文章关键词' },
        articleUrl: { required: true, message: '请上传图片' },
        articleContent: { required: true, message: '请填写内容' }
      },
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
          key: 'articleTitle',
          minWidth: 200,
          fixed: 'left'
        },
        {
          title: '文章类别',
          key: 'articleType',
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.articleType === 'perday') {
              return (
                <div>
                  <tag color='primary'>{ articleTypeConvert(row.articleType)}</tag>
                </div>
              );
            } else if (row.articleType === 'industry') {
              return (
                <div>
                  <tag color='warning'>{ articleTypeConvert(row.articleType) }</tag>
                </div>
              );
            } else {
              return <div>N/A</div>;
            }
          }
        },
        {
          title: '创作类别',
          key: 'createType',
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.createType === 'original') {
              return (
                <div>
                  <tag color='pink'>{ createTypeConvert(row.createType)}</tag>
                </div>
              );
            } else if (row.createType === 'reprint') {
              return (
                <div>
                  <tag color='yellow'>{ createTypeConvert(row.createType) }</tag>
                </div>
              );
            } else {
              return <div>N/A</div>;
            }
          }
        },
        // {
        //   title: '关键词',
        //   key: 'keywords',
        //   width: 150
        // },
        {
          title: '作者',
          width: 150,
          key: 'articleAuthor'
        },
        {
          title: '创建时间',
          width: 160,
          key: 'createTime'
        },
        {
          title: '发布时间',
          width: 160,
          key: 'publishTime',
          sortable: true
        },
        {
          title: '发布状态',
          key: 'publishStatus',
          width: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.publishStatus === 'published') {
              return (
                <div>
                  <tag color='success'>{'已发布'}</tag>
                </div>
              );
            } else if (row.publishStatus === 'unpublished') {
              return (
                <div>
                  <tag color='error'>{'未发布'}</tag>
                </div>
              );
            } else {
              return <div>{row.publishStatus}</div>;
            }
          }
        },
        {
          title: '排序',
          maxwidth: 40,
          sortable: true,
          key: 'rankNum'
        },
        {
          title: '操作',
          minWidth: 200,
          key: 'handle',
          options: ['onArticleStatus', 'view', 'edit', 'delete']
        }
      ]
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    useAbleUniteChange(value) {
      this.articleDetail.publishStatus = value;
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
    addArticle(params) {
      this.turnToPage('wholesale-article-edit');
    },
    onArticleStatus(params) {
      console.log(params.row.publishStatus);
      // this.tableData[params.index].onSale = !this.tableData[params.index].onSale;
      this.articleDetail = this._.cloneDeep(params.row);
      if (this.articleDetail.publishStatus == 'PUBLISH') {
        this.articleDetail.publishStatus = 'UN_PUBLISH';
      } else {
        this.articleDetail.publishStatus = 'PUBLISH';
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
      this.articleDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.turnToPage({
        name: 'wholesale-article-edit',
        query: { id: params.row.id }
      });
    },
    getTableData() {
      this.loading = true;
      getArticlesPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
        this.clearSearchLoading = false;
        this.searchLoading = false;
      });
    },
    handleDownload() {
      // 导出不分页
      this.searchRowData.rows = null;
      getArticlesPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['publishStatus'] === 'published'
            ? (item['publishStatus'] = '发布')
            : (item['publishStatus'] = '未发布');
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
