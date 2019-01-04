<template>
  <div class="m-role">
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
              <Input v-model="articleDetail.keywords" style="width: auto"  v-show="false"/>
              <Input type="text" v-for="(item, index) in keywords" :key="index" v-model="keywords[index]" style="width: 100px" class="search-btn mr5" @on-change="keywordChange"/>
              <Button type="dashed" long @click="addKeyword" icon="md-add" style="width: 100px" class="search-btn mr5">加关键词</Button>
              <Button @click="removeKeyword" icon="md-remove" style="width: 100px" class="search-btn mr5">减关键词</Button>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="文章主图:" prop="headImage">
               <Input v-model="articleDetail.headImage" style="width: auto" v-show="false"/>
              <div class="demo-upload-list" v-for="(item,key) in uploadListMain" :key="'modalEdit' + key">
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
              <tinymce-editor span="24" id="tinymce" ref="editor" v-model="articleDetail.content" :height="500"/>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="goBack">返回</Button>
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
  import {createArticle, editArticle, getArticle} from '@/api/fruitermaster';
  import uploadMixin from '@/mixins/uploadMixin';
  import IViewUpload from '_c/iview-upload';
  import TinymceEditor from '_c/tinymce-editor';
  import Editor from '_c/editor';

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
      TinymceEditor,
      Editor,
      IViewUpload
    },
    mixins: [uploadMixin],
    mounted() {
      this.$refs.editor.initTinymce();
    },
    created() {
      this.getArticleData();
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
        defaultListMain: [],
        uploadListMain: [],
        content: '',
        rowData: roleRowData,
        searchRowData: this._.cloneDeep(roleRowData),
        articleDetail: this._.cloneDeep(articleDetail),
        exportType: 'xlsx',
        downloadLoading: false,
        keywords: []
      };
    },
    methods: {
      resetKeyWord() {
        this.keyword1 = '';
        this.keyword2 = '';
        this.keyword3 = '';
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
            if (this.articleDetail.id === 0 || this.articleDetail.id === null) {
              // 添加状态
              this.createTableRow();
            } else if (this.articleDetail.id > 0) {
              // 编辑状态
              this.editTableRow();
            }
          } else {
            this.$Message.error('请完善商品的信息!');
          }
        });
      },
      createTableRow() {
        this.modalViewLoading = true;
        this.loading =true;
        createArticle(this.articleDetail).then(res => {
          this.modalViewLoading = false;
          this.$Message.success('创建成功!');
          this.$refs.editor.content = null;
           this.$router.push({name: 'fruit-master-content-article'});
        });
      },
      editTableRow() {
        this.modalViewLoading = true;
        this.loading =true;
        editArticle(this.articleDetail).then(res => {
          this.$Message.success('修改成功!');
          this.modalViewLoading = false;
          this.$refs.editor.content = null;
          this.$router.push({name: 'fruit-master-content-article'});
        });
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
      getArticleData() {
        const id = this.$route.query.id;
        if (id !== undefined && id !== '' && id !== null) {
          this.loading = true;
          getArticle({id}).then(res => {
           this.articleDetail = res;
          this.keywords = this.articleDetail.keywords.split(',');
          this.$refs.editor.content = this.articleDetail.content;
          this.setDefaultUploadList(this.articleDetail);
          });
        }
      },
      addKeyword() {
        this.keywords.push('');
      },
      removeKeyword() {
        this.keywords.pop();
         // 过滤关键字空值
        this.keywords = this.keywords.filter(function(n) { return n; });
        this.articleDetail.keywords = this.keywords.join(',');
      },
      goBack() {
        this.turnToPage({
          name: 'fruit-master-content-article'
        });
      },
      keywordChange() {
        // 过滤关键字空值
        this.keywords = this.keywords.filter(function(n) { return n; });
        this.articleDetail.keywords = this.keywords.join(',');
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
