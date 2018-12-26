<template>
  <div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns"
              :loading="loading"
              :searchAreaColumn="18"
              :operateAreaColumn="6"
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
            <Input placeholder="文章标题" class="search-input mr5" v-model="searchRowData.title" style="width: auto"/>
            <Input placeholder="关键词" class="search-input mr5" v-model="searchRowData.keywords" style="width: auto"/>
            <DatePicker
              @on-change="startTimeChange"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="注册时间起"
              class="search-input"
              v-model="searchRowData.beginCreateAt"
              style="width: 150px"
            />
            <i>-</i>
            <DatePicker
              @on-change="endTimeChange"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime" placeholder="注册时间止"
              class="search-input  mr5"
              v-model="searchRowData.endCreateAt"
              style="width: 150px"/>

            <DatePicker
              @on-change="startPublishChange"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              class="search-input  mr5"
              v-model="searchRowData.beginPublishAt"
              style="width: 150px"
              placeholder="发布时间起"/>
            <i>-</i>
            <DatePicker
              type="datetime"
              placeholder="发布时间止"
              style="width: 150px"
              v-model="searchRowData.endPublishAt"
              @on-change="endPublishChange"
              class="mr5"/>
            <Button v-waves @click="handleSearch" class="search-btn mr5" type="primary">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves @click="handleClear" class="search-btn" type="info" :loading="clearSearchLoading">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
            </Col>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="addChildren">
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
           <!-- 多类型导出 -->
           <BookTypeOption v-model="exportType" class="mr5"/>
           <Button :loading="downloadLoading" class="search-btn mr5" type="primary" @click="handleDownload"><Icon type="md-download"/>导出</Button>
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
      :width="rowData.type=='SON'?'750':'540'"
    >
      <p slot="header">
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">文章标题:</i-col>
              <i-col span="20">{{articleDetail.title}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">作者:</i-col>
              <i-col span="16">{{articleDetail.author}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">创建时间:</i-col>
              <i-col span="16">{{articleDetail.createAt}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">发布时间:</i-col>
              <i-col span="16"></i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">关键词:</i-col>
              <i-col span="16">{{articleDetail.keywords}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">文章内容:</i-col>
              <i-col span="16" v-html="articleDetail.content">{{articleDetail.content}}</i-col>
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
      :width="1300"
    >
      <p slot="header">
        <span>编辑文章</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="articleDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <FormItem label="文章标题:" prop="title">
              <Input v-model="articleDetail.title" placeholder="文章标题" style="width: 325px"/>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="文章作者:" prop="author">
              <Input v-model="articleDetail.author" placeholder="文章标题"  style="width: 325px"/>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="是否发布:" prop="articleStatus">
              <Select :value="articleDetail.articleStatus" @on-change="useAbleUniteChange"
                      style="width: 100px">
                <Option class="ptb2-5" style="padding-left: 5px" v-for="(item,index) in useAble" :value="item.value"
                        :key="index">{{ item.label}}
                </Option>
              </Select>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="关键词:" prop="keywords">
              <Input ref="keyword1" v-model="keyword1" span="6" style="width: 100px;margin-right: 10px" @on-change="inputChange1"/>
              <Input ref="keyword2" v-model="keyword2" span="6" style="width: 100px;margin-right: 10px" @on-change="inputChange2"/>
              <Input ref="keyword3" v-model="keyword3" span="6" style="width: 100px;margin-right: 10px" @on-change="inputChange3"/>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="文章主图:" prop="headImage">
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
            <FormItem label="文章内容:" prop="content">
              <tinymce-editor span="24" id="tinymce" ref="editor" v-model="articleDetail.content" :height="300" />
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
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
  import {getArticlesPages, createArticle, deleteArticle, editArticle} from '@/api/fruitermaster';
  import deleteMixin from '@/mixins/deleteMixin.js';
  import tableMixin from '@/mixins/tableMixin.js';
  import searchMixin from '@/mixins/searchMixin.js';
  import uploadMixin from '@/mixins/uploadMixin';
  import IViewUpload from '_c/iview-upload';
  import tinymceEditor from '_c/tinymce-editor';
  import Editor from '_c/editor';
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
      tinymceEditor,
      Editor,
      IViewUpload,
      BookTypeOption
    },
    mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
    mounted() {
      this.$refs.editor.initTinymce();
    },
    created() {
      this.getTableData();
    },
    data() {
      return {
        keyword1: '',
        keyword2: '',
        keyword3: '',
        modalViewLoading: false,
        ruleInline: {
          title: {required: true, message: '请输入文章标题'},
          author: {required: true, message: '请输入作者'},
          articleStatus: {required: true, message: '请选择文章状态'},
          keywords: {required: true, message: '请输入文章关键词'},
          headImage: {required: true, message: '请上传图片'},
          content: {required: true, message: '请填写内容'}
        },
        useAble: [
          {label: '发布', value: 'PUBLISH'},
          {label: '未发布', value: 'UN_PUBLISH'}
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
            key: 'articleStatus',
            render: (h, params, vm) => {
              const {row} = params;
              if (row.articleStatus === 'PUBLISH') {
                return <div>{'发布'}</div>;
              } else if (row.articleStatus === 'UN_PUBLISH') {
                return <div>{'未发布'}</div>;
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
    methods: {
      resetKeyWord() {
        this.keyword1 = '';
        this.keyword2 = '';
        this.keyword3 = '';
      },
      setArticleKeyWords() {
        let keyWordsArray = [this.keyword1, this.keyword2, this.keyword3];
        let tempArr = [];
        keyWordsArray.forEach(item => {
          if (item !== null && item != '') {
            tempArr.push(item);
          };
        });
        if (tempArr.length > 0) {
          this.articleDetail.keywords = tempArr.join(',');
        } else {
          this.articleDetail.keywords = null;
        };
        console.log(this.articleDetail.keywords);
      },
      inputChange1(event) {
        this.setArticleKeyWords();
      },
      inputChange2(event) {
        this.setArticleKeyWords();
      },
      inputChange3(event) {
        this.setArticleKeyWords();
      },
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
      handleSuccessMain(response, file, fileList) {
        this.uploadListMain = fileList;
        this.articleDetail.headImage = null;
        this.articleDetail.headImage = fileList[0].url;
      },
      handleRemoveMain(file) {
        this.$refs.uploadMain.deleteFile(file);
        this.uploadListMain = [];
        this.articleDetail.headImage = null;
      },
      handleSubmit(name) {
        this.articleDetail.content = this.$refs.editor.content;
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
      deleteTable(ids) {
        this.loading = true;
        deleteArticle({
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
      addChildren() {
        if (this.tempModalType !== this.modalType.create) {
          this.resetKeyWord();
          this.resetFields();
          this.articleDetail = this._.cloneDeep(articleDetail);
        }
        this.tempModalType = this.modalType.create;
        this.modalEdit = true;
      },
      createTableRow() {
        this.modalViewLoading = true;
        this.loading =true;
        createArticle(this.articleDetail).then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
          this.resetKeyWord();
          this.$refs.editor.content = null;
        });
      },
      editTableRow() {
        this.modalViewLoading = true;
        this.loading =true;
        editArticle(this.articleDetail).then(res => {
          this.getTableData();
        }).finally(res => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.$refs.editor.content = null;
        });
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
      handleView(params) {
        this.tempModalType = this.modalType.view;
        this.articleDetail = this._.clone(params.row);
        this.modalView = true;
      },
      handleEdit(params) {
        this.tempModalType = this.modalType.edit;
        this.articleDetail = this._.cloneDeep(params.row);
        let keyWordsArr = this.articleDetail.keywords.split(',');
        this.$refs.editor.content = this.articleDetail.content;
        if (keyWordsArr[0]) {
          this.keyword1 = keyWordsArr[0];
        };
        if (keyWordsArr[1]) {
          this.keyword2 = keyWordsArr[1];
        };
        if (keyWordsArr[2]) {
          this.keyword3 = keyWordsArr[2];
        };
        this.setDefaultUploadList(params.row);
        this.modalEdit = true;
      },
      setDefaultUploadList(res) {
        if (res.headImage != null) {
          const map = {status: 'finished', url: 'url'};
          let mainImgArr = [];
          map.url = res.headImage;
          mainImgArr.push(map);
          this.$refs.uploadMain.setDefaultFileList(mainImgArr);
          this.uploadListMain = mainImgArr;
        }
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
      // exportExcel() {
      //   this.$refs.tables.exportCsv({
      //     filename: `table-${new Date().valueOf()}.csv`
      //   });
      // },
      handleDownload() {
      // 导出不分页
      this.searchRowData.rows = null;
      getArticlesPages(this.searchRowData).then(res => {
        let tableData = res.array;
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
