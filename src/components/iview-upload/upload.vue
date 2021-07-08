<template>
  <Upload
    ref="iViewUpload"
    :show-upload-list="showUploadList"
    :default-file-list="defaultList"
    :on-success="handleSuccess"
    :format="['jpg','jpeg','png','gif']"
    :max-size="imageSize"
    :on-format-error="handleFormatError"
    :on-exceeded-size="handleMaxSize"
    :before-upload="handleBeforeUpload"
    :multiple="multiple"
    :action="actionUrl"
    type="drag"
    style="display: inline-block;width:auto;"
  >
    <slot name="content"></slot>
  </Upload>
</template>

<script type="text/ecmascript-6">
import config from '@/config'

export default {
  name: 'IViewUpload',
  props: {
    groupType: {
      type: String,
      default: 'cache_image'
    },
    fileDir: {
      type: String,
      default: ''
    },
    maxNum: {
      type: Number,
      default: 3
    },
    imgWith: {
      type: Number,
      default: 240
    },
    imgHeight: {
      type: Number,
      default: 240
    },
    imageSize: {
      type: Number,
      default: 2048
    },
    defaultList: {
      type: Array,
      default: () => []
    },
    showUploadList: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      actionUrl: '',
      uploadBaseUrl: config.imgUploadUrl,
      brandType: config.brandType ? config.brandType : 'common'
    };
  },
  computed: {},
  mounted: function() {
    this.actionUrl = `${this.uploadBaseUrl}/v2/upload?groupType=${this.groupType}&fileDir=${this.fileDir}&appType=${this.brandType}`;
  },
  methods: {
    deleteFile(file) {
      const fileList = this.$refs.iViewUpload.fileList;
      this.$refs.iViewUpload.fileList.splice(fileList.indexOf(file), 1);
    },
    // 清空已上传的文件列表
    clearFileList() {
      this.$refs.iViewUpload.clearFiles();
    },
    // 设置默认文件列表
    setDefaultFileList(array) {
      this.$refs.iViewUpload.fileList = array;
    },
    // 获取文件列表
    getFileList() {
      return this.$refs.iViewUpload.fileList;
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      if (this.multiple) {
        if (fileList.length > this.maxNum) {
          fileList = fileList.slice(0, this.maxNum);
        }
        this.$refs.iViewUpload.fileList = fileList;
      } else {
        const fileItem = fileList.pop();
        const fileItemList = [fileItem];
        fileList = fileItemList;
        this.$refs.iViewUpload.fileList = fileList;
      }
      file.url = response.fileUrl;
      file.fileDir = `image/${file.name}`;
      this.$emit('on-success', response, file, fileList);
    },
    // 上传之前的校验
    handleBeforeUpload(file) {
      return this.checkImageWH(file, this.imgWith, this.imgHeight, this.maxNum);
    },
    // 文件格式校验
    handleFormatError(file) {
      this.$Notice.warning({
        title: '图片格式不正确',
        desc: '图片-' + file.name + '格式不正确, 请上传格式为jpg、png的图片'
      });
    },
    // 文件大小校验
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '图片大小超过限制',
        desc: '图片-' + file.name + ' 太大了, 大小不能超过2M'
      });
    },
    // 图片宽高校验
    checkImageWH(file, width, height, num) {
      const self = this;
      const check = this.$refs.iViewUpload.fileList.length < num;
      return new Promise(function(resolve, reject) {
        const filereader = new FileReader();
        filereader.onload = e => {
          const src = e.target.result;
          const image = new Image();
          image.onload = function() {
            if (width && this.width != width) {
              // self.$Notice.error({title: '请上传宽为' + width + "高为" + height + "的图片"});
              // reject();
              resolve();
            } else if (height && this.height != height) {
              // self.$Notice.error({title: '请上传宽为' + width + "高为" + height + "的图片"});
              // reject();
              resolve();
            } else if (!check) {
              self.$Notice.error({
                title: '请上传的图片最多不能超过' + num + '张'
              });
              reject();
            } else {
              resolve();
            }
          };
          image.onerror = reject;
          image.src = src;
        };
        filereader.readAsDataURL(file);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
