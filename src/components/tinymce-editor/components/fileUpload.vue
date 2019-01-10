/* eslint-disable vue/no-parsing-error */
<template>
  <div class="upload-container">
    <Button v-waves type="primary" size="small" @click=" modalUpload= true">
    <Icon type="md-cloud-upload" /> 上传文件</Button>
    <!--上传视频/音频等文件 -->
    <Modal
      v-model="modalUpload"
      :mask-closable="false"
    >
      <p slot="header">
        <span>视频/音频文件上传</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10" >
          <i-col span="4">文件类型</i-col>
          <i-col span="20">
            <Select v-model="fileObj.fileType" class="search-col" placeholder="">
              <Option value="video">视频</Option>
              <Option value="audio">音频</Option>
            </Select>
          </i-col>
        </Row>

        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="4">文件上传</i-col>
          <i-col span="20">
            <Input v-model="fileObj.fileUrl"></Input>
            <Upload
              slot="append"
              ref="fileUpload"
              :action="actionUrl"
              :show-upload-list="false"
              :max-size="maxSize"
              :multiple="false"
              :on-success="handleSuccess"
              :format="fileFormat"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              :on-error="handleError"
              type="select"
              class="btn-upload"
            >
              <Button type="primary" icon="ios-cloud-upload"></Button>
            </Upload>
            </Input>
          </i-col>
        </Row>

        <Row v-show="isVideo" :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="14">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">封面上传</i-col>
              <i-col span="16">
                <img-upload
                  ref="posterUpload"
                  :show-upload-list="false"
                  :default-list="defaultList"
                  :max-size="2048"
                  :img-list.sync="imgList"
                  multiple
                  type="drag"
                  class="mt10"
                  width="80"
                  height="80"
                />
              </i-col>
            </Row>
          </i-col>
          <i-col span="10">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10" >
              <i-col span="4">宽度</i-col>
              <i-col span="12"><Input v-model="fileObj.width" placeholder="默认值 300" clearable ></Input></i-col>
            </Row>
            <Row :gutter="8" type="flex" align="middle" class-name="mb10" >
              <i-col span="4">高度</i-col>
              <i-col span="12"><Input v-model="fileObj.height" placeholder="默认值 150" clearable ></Input></i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button :loading="loadingBtn" type="primary" @click="handleSubmit">
          <span v-if="!loadingBtn">确定</span>
          <span v-else>确定中...</span>
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type='text/ecmascript-6'>
import imgUpload from '_c/img-upload';
export default {
  name: 'FileUpload',
  components: {
    imgUpload
  },
  filters: {},
  data() {
    return {
      modalUpload: false,
      loadingBtn: false,
      fileObj: {
        fileType: 'video',
        fileUrl: '',
        width: '',
        height: '',
        poster: ''
      },
      imgList: [],
      defaultList: []
    };
  },
  computed: {
    actionUrl() {
      const vUrl = 'https://resource.food-see.com/v1/upload/product_video';
      const aUrl = 'https://resource.food-see.com/v1/upload/product_video';// 后续扩展类型为product_audio
      return this.isVideo ? vUrl : aUrl;
    },
    isVideo() {
      return this.fileObj.fileType == 'video';
    },
    fileFormat() {
      const vFormat = ['mp4', 'mov', 'mpv', '3gp'];
      const aFormat = ['AAC', 'MP3', 'HE-AAC', 'PCM'];
      return this.isVideo ? vFormat : aFormat;
    },
    maxSize() {
      const vSize = 204800;// 200M
      const aSize = 10240;// 10M
      return this.isVideo ? vSize : aSize;
    }
  },
  watch: {
    imgList(val, oldVal) {
      console.log(`new: ${val}, old: ${oldVal}`);
    }
  },
  created() {},
  mounted() {

  },
  methods: {
    handleBeforeUpload(file) {

    },
    handleFormatError(file) {
      const desc = this.isVideo ? '格式不正确, 请尽量选择MP4或者mpv' : '格式不正确, 请尽量选择AAC或者mp3';
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: file.name + desc
      });
    },
    handleMaxSize(file) {
      const desc = this.isVideo ? '文件过大, 不能超过200M' : '文件过大，不能超过10M';
      this.$Notice.warning({
        title: '文件大小限制',
        desc: +file.name + desc
      });
    },
    handleSuccess(res, file, fileList) {
      // 上传成功后
      const { fileUrl } = res;
      this.fileObj.fileUrl = fileUrl;
    },
    handleError(error, file, fileList) {
      this.$Notice.warning({
        title: '错误提示',
        desc: error.message
      });
    },
    handleSubmit() {
      // 校验数据
      if (!this.fileObj.fileUrl) {
        this.$Message.warning('请先上传文件');
        return false;
      }
      // 组织对象
      this.fileObj.poster = this.imgList.length > 0 ? this.imgList[0] : '';
      console.log('imgList: ', this.imgList);
      this.$emit('successCBK', this.fileObj);
      // 初始化
      this.fileObj = {
        fileType: 'video',
        fileUrl: '',
        width: '',
        height: '',
        poster: ''
      };
      this.imgList = [];
      this.modalUpload = false;
      this.$refs.posterUpload.clearFiles();
    }
  }
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>

.ivu-select-dropdown-list{
  padding: 4px;

  .ivu-select-item{
    padding: 6px;
  }
}
</style>
