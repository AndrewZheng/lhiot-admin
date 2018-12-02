<template>
  <Upload
    ref="iViewUpload"
    :show-upload-list="showUploadList"
    :default-file-list="defaultList"
    :on-success="handleSuccess"
    :format="['jpg','jpeg','png']"
    :max-size="imageSize"
    :on-format-error="handleFormatError"
    :on-exceeded-size="handleMaxSize"
    :before-upload="handleBeforeUpload"
    @on-remove="onRemove"
    type="drag"
    :multiple="multiple"
    action="https://resource.food-see.com/v1/upload/product_image"
    style="display: inline-block;width:auto;"
  >
    <slot name="content"></slot>
  </Upload>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'IViewUpload',
    props: {
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
        default: []
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
    methods: {
      onRemove(file, fileList) {
        console.log('onRemove');
        console.log(file);
        console.log(fileList);
      },
      deleteFile(file) {
        const fileList = this.$refs.iViewUpload.fileList;
        this.$refs.iViewUpload.fileList.splice(fileList.indexOf(file), 1);
      },
      //清空已上传的文件列表
      clearFileList() {
        this.$refs.iViewUpload.clearFiles()
      },
      //设置默认文件列表
      setDefaultImageList(array) {
        this.$refs.iViewUpload.fileList = this.$refs.iViewUpload.fileList.concat(array)
      },
      //获取文件列表
      getFileList(){
        return this.$refs.iViewUpload.fileList
      },
      //上传成功
      handleSuccess(response, file, fileList) {
        if (this.multiple) {
          if (fileList.length > this.maxNum) {
            fileList = fileList.slice(0, this.maxNum);
          }
          this.$refs.iViewUpload.fileList = fileList;
        } else {
          let fileItem = fileList.pop();
          let fileItemList = [fileItem]
          fileList = fileItemList
          this.$refs.iViewUpload.fileList = fileList;
        }
        file.url = response.fileUrl;
        file.name = file.name;
        this.$emit('on-success', response, file, fileList);
      },
      //上传之前的校验
      handleBeforeUpload(file) {
        return this.checkImageWH(file, this.imgWith, this.imgHeight, this.maxNum)
      },
      //文件格式校验
      handleFormatError(file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      //文件大小校验
      handleMaxSize(file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
      },
      //图片宽高校验
      checkImageWH(file, width, height, num) {
        let self = this;
        const check = this.$refs.iViewUpload.fileList.length < num
        return new Promise(function (resolve, reject) {
          let filereader = new FileReader();
          filereader.onload = e => {
            let src = e.target.result;
            const image = new Image();
            image.onload = function () {
              if (width && this.width != width) {
                self.$Notice.error({title: '请上传宽为' + width + "高为" + height + "的图片"});
                reject();
              } else if (height && this.height != height) {
                self.$Notice.error({title: '请上传宽为' + width + "高为" + height + "的图片"});
                reject();
              } else if (!check) {
                self.$Notice.error({title: '请上传的图片最多不能超过' + num + "张",});
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
  }
</script>

<style lang="scss" scoped>

</style>
