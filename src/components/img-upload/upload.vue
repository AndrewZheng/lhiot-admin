<template>
<div>
    <div class="demo-upload-list" v-for="item in uploadList" :key="item.uid" :style="demoStyle">
        <template v-if="item.status === 'finished'">
            <img :src="item.response.fileUrl">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handlePreView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
        </template>
        <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
    </div>
    <Upload
        ref="upload"
        :action="action"
        :headers="headers"
        :multiple="multiple"
        :paste="paste"
        :data="data"
        :name="name"
        :with-credentials="withCredentials"
        :show-upload-list="showUploadList"
        :type="type"
        :accept="accept"
        :format="format"
        :max-size="maxSize"
        :before-upload="beforeUpload?beforeUpload:handleBeforeUpload"
        :on-progress="onProgress?onProgress:handleProgress"
        :on-success="onSuccess?onSuccess:handleSuccess"
        :on-error="onError?onError:handleError"
        :on-preview="onPreview?onPreview:handlePreView"
        :on-remove="onRemove?onRemove:handleRemove"
        :default-file-list="defaultList"
        :on-format-error="onFormatError?onFormatError:handleFormatError"
        :on-exceeded-size="onExceededSize?onExceededSize:handleMaxSize"
        :style="demoStyle3"
        >
        <div :style="demoStyle2">
            <Icon type="ios-camera" size="20"></Icon>
            <slot name="tip"></slot>
        </div>
    </Upload>

    <Modal title="图片预览" v-model="visible" draggable style="text-align:center;">
        <img :src="imgPreview" v-if="visible" style="max-width:100%;">
    </Modal>
</div>
</template>

<script type='text/ecmascript-6'>
import _ from 'lodash';

export default {
  name: 'img-upload',
  props: {
    action: {
      type: String,
      default: 'https://resource.food-see.com/v1/upload/product_image'
    },
    headers: {
      type: Object,
      default() {
        return {};
      }
    },
    width: {
      type: [Number, String],
      default: 60
    },
    height: {
      type: [Number, String],
      default: 60
    },
    multiple: {
      type: Boolean,
      default: false
    },
    paste: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    name: {
      type: String,
      default: 'file'
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    showUploadList: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'select'
    },
    accept: {
      type: String
    },
    format: {
      type: Array,
      default() {
        return ['jpg', 'jpeg', 'png'];
      }
    },
    maxSize: {
      type: Number,
      default: 1024
    },
    defaultList: {
       type: Array,
       default() {
         return [];
       }
    },
    imgList: {
       type: Array,
       default() {
         return [];
       }
    },
    beforeUpload: {
      type: Function,
      default() {
        return '';
      }
    },
    onProgress: {
      type: Function,
      default() {
       return '';
      }
    },
    onSuccess: {
      type: Function,
      default() {
       return '';
      }
    },
    onError: {
      type: Function,
      default() {
        return '';
      }
    },
    onPreview: {
      type: Function,
      default() {
        return '';
      }
    },
    onRemove: {
      type: Function,
      default() {
        return '';
      }
    },
    onFormatError: {
      type: Function,
      default() {
        return '';
      }
    },
    onExceededSize: {
      type: Function,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      imgName: '',
      imgPreview: '',
      visible: false,
      uploadList: [],
      demoStyle: {
        width: this.width+'px',
        height: this.height+'px',
        lineHeight: this.height+'px'
      },
      demoStyle2: {
        width: (this.width-2)+'px',
        height: (this.height-2)+'px',
        lineHeight: (this.height-2)+'px'
      },
      demoStyle3: {
        display: 'inline-block',
        width: (this.width-2)+'px'
      },
      imgUrlList: this.imgList
    };
  },
  watch: {
    imgUrlList(val, oldVal) {
      // 每当imgUrlList的值改变则发送事件update:img-list , 并且把值传过去
      this.$emit('update:img-list', val);
    }
  },
  created() {},
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
    console.log('uploadList init:', this.uploadList);
  },
  computed: {},
  filters: {},
  methods: {
    handlePreView(file) {
      this.imgPreview = file.response.fileUrl;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      this.imgUrlList= _.without(this.imgUrlList, file.response.fileUrl);
      console.log('remove file:', this.imgUrlList);
    },
    handleSuccess(res, file, fileList) {
      const { fileUrl } = res;
      // 上传成功后
      this.imgUrlList.push(fileUrl);
      console.log('imgList:', this.imgUrlList);
    },
    handleError(error, file, fileList) {
      this.$Notice.warning({
        title: '错误提示',
        desc: error.message
      });
    },
    handleProgress(event, file, fileList) {

    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: file.name +
          '格式不正确, 请选择jpg或者png.'
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '文件大小限制',
        desc: +file.name + ' 文件过大, 不能超过2M'
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '最多上传5张图片'
        });
      }
      return check;
    }
  },
  components: {}
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.demo-upload-list {
  display: inline-block;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;

  img {
    width: 100%;
    height: 100%;
  }
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);

  i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
</style>
