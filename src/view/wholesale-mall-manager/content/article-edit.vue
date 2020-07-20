<template>
  <div class="m-role">
    <Card>
      <Row>
        <i-col :offset="20" :span="4" order="1">
          <Button
            class="search-btn mr5"
            type="warning"
            @click="goBack">返回文章列表页</Button>
          <Button
            :loading="modalViewLoading"
            type="primary"
            @click="handleSubmit('editForm')">保存</Button>
        </i-col>
        <i-col span="24" class="mt10">
          <Form ref="editForm" :model="articleDetail" :rules="ruleInline" :label-width="80">
            <Row>
              <i-col span="12">
                <FormItem label="文章标题:" prop="articleTitle">
                  <Input v-model="articleDetail.articleTitle" placeholder style="width: 325px"></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="文章副标题:" prop="articleSubhead">
                  <Input v-model="articleDetail.articleSubhead" placeholder style="width: 325px"></Input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="文章作者:" prop="articleAuthor">
                  <Input v-model="articleDetail.articleAuthor" placeholder style="width: 325px"></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="资源链接:" prop="resouceUrl" style="width:700px;">
                  <Input
                    v-model="articleDetail.resouceUrl"
                    :autosize="{minRows: 3,maxRows: 8}"
                    type="textarea"
                    placeholder="http://"></Input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <FormItem label="文章类别:" prop="articleType">
                <Select v-model="articleDetail.articleType" style="width: 100px">
                  <Option
                    v-for="(item,index) in articleTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="创作类别:" prop="createType">
                <Select v-model="articleDetail.createType" style="width: 100px">
                  <Option
                    v-for="(item,index) in createTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="是否发布:" prop="publishStatus">
                <Select
                  v-model="articleDetail.publishStatus"
                  style="width: 100px"
                >
                  <Option
                    v-for="(item,index) in useAble"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="文章主图:" prop="articleUrl">
                <Input v-show="false" v-model="articleDetail.articleUrl" style="width: auto"></Input>
                <div
                  v-for="(item,key) in uploadListMain"
                  :key="'modalEdit' + key"
                  class="demo-upload-list"
                >
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url" >
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
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="文章内容:" prop="articleContent">
                <tinymce-editor
                  id="tinymce"
                  ref="editor"
                  v-model="articleDetail.articleContent"
                  :height="500"
                  span="24"
                />
              </FormItem>
            </Row>
          </Form>
        </i-col>
      </Row>
    </Card>

    <Modal v-model="uploadVisible" title="View Image">
      <img :src="imgUploadViewItem" style="width: 100%" >
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import IViewUpload from '_c/iview-upload';
import TinymceEditor from '_c/tinymce-editor';
import Editor from '_c/editor';

import { createArticle, editArticle, getArticle } from '@/api/lhfarm-small';
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
  data() {
    return {
      articleTypeEnum,
      createTypeEnum,
      content: '',
      defaultListMain: [],
      uploadListMain: [],
      keywords: [],
      downloadLoading: false,
      modalViewLoading: false,
      rowData: roleRowData,
      searchRowData: this._.cloneDeep(roleRowData),
      articleDetail: this._.cloneDeep(articleDetail),
      ruleInline: {
        articleTitle: { required: true, message: '请输入文章标题' },
        articleAuthor: { required: true, message: '请输入作者' },
        publishStatus: { required: true, message: '请选择文章状态' },
        keywords: { required: true, message: '请输入文章关键词' },
        articleUrl: { required: true, message: '请上传图片' },
        articleContent: { required: false, message: '请填写内容' }
      },
      useAble: [
        { label: '已发布', value: 'published' },
        { label: '未发布', value: 'unpublished' }
      ]
    };
  },
  mounted() {
    this.$refs.editor.initTinymce();
  },
  created() {
    this.getArticleData();
  },
  methods: {
    getArticleData() {
      const id = this.$route.query.id;
      if (id !== undefined && id !== '' && id !== null) {
        this.loading = true;
        getArticle({ id }).then(res => {
          this.articleDetail = res;
          this.$refs.editor.content = this.articleDetail.articleContent;
          this.setDefaultUploadList(this.articleDetail);
        });
      }
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.articleDetail = _.cloneDeep(articleDetail);
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.articleDetail.articleUrl = null;
      this.articleDetail.articleUrl = fileList[0].url;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.uploadListMain = [];
      this.articleDetail.articleUrl = null;
    },
    handleSubmit(name) {
      this.articleDetail.articleContent = this.$refs.editor.content;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.articleDetail.id === 0 || this.articleDetail.id === null) {
            // 添加状态
            this.createTableRow();
          } else if (this.articleDetail.id > 0) {
            // 编辑状态
            this.editTableRow();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createTableRow() {
      this.modalViewLoading = true;
      createArticle(this.articleDetail).then(res => {
        this.modalViewLoading = false;
        this.$Message.success('创建成功!');
        this.$refs.editor.content = null;
        this.$router.push({ name: 'wholesale-article' });
      });
    },
    editTableRow() {
      this.modalViewLoading = true;
      editArticle(this.articleDetail).then(res => {
        this.$Message.success('修改成功!');
        this.modalViewLoading = false;
        this.$refs.editor.content = null;
        this.$router.push({ name: 'wholesale-article' });
      });
    },
    setDefaultUploadList(res) {
      if (res.articleUrl != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.articleUrl;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    goBack() {
      this.turnToPage({
        name: 'wholesale-article'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
