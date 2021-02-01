<template>
  <Upload
    ref="videoUpload"
    :show-upload-list="false"
    :default-file-list="defaultList"
    :on-success="handleSuccess"
    :format="['mp4','avi']"
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
import config from "@/config";

export default {
  name: "VideoUpload",
  props: {
    groupType: {
      type: String,
      default: "cache_image",
    },
    fileDir: {
      type: String,
      default: "",
    },
    imageSize: {
      type: Number,
      default: 204800,
    },
    defaultList: {
      type: Array,
      default: () => [],
    },
    showUploadList: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      actionUrl: "",
      uploadBaseUrl: config.imgUploadUrl,
      brandType: config.brandType ? config.brandType : "common",
    };
  },
  computed: {},
  mounted: function () {
    this.actionUrl = `${this.uploadBaseUrl}/v2/upload?groupType=${this.groupType}&fileDir=${this.fileDir}&appType=${this.brandType}`;
  },
  methods: {
    deleteFile(file) {
      const fileList = this.$refs.videoUpload.fileList;
      this.$refs.videoUpload.fileList.splice(fileList.indexOf(file), 1);
    },
    // 清空已上传的文件列表
    clearFileList() {
      this.$refs.videoUpload.clearFiles();
    },
    // 设置默认文件列表
    setDefaultFileList(array) {
      this.$refs.videoUpload.fileList = array;
    },
    // 获取文件列表
    getFileList() {
      return this.$refs.videoUpload.fileList;
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      const fileItem = fileList.pop();
      const fileItemList = [fileItem];
      fileList = fileItemList;
      this.$refs.videoUpload.fileList = fileList;
      file.url = response.fileUrl;
      file.name = file.name;
      file.fileDir = `image/${file.name}`;
      this.$emit("on-success", response, file, fileList);
    },
    // 上传之前的校验
    handleBeforeUpload(file) {
      return true;
    },
    // 文件格式校验
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select mp4 or avi",
      });
    },
    // 文件大小校验
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 200M.",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
