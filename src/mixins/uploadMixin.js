const mixin = {
  data() {
    return {
      imageSize: 2048,
      imgUploadViewItem: '',
      uploadVisible: false
    };
  },
  methods: {
    handleUploadView(name) {
      if (typeof name === 'string') {
        this.imgUploadViewItem = name;
      } else {
        this.imgUploadViewItem = name.url;
      }
      this.uploadVisible = true;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '图片格式不正确',
        desc: '图片-' + file.name + '格式不正确, 请上传格式为jpg、png的图片'
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '图片大小超过限制',
        desc: '图片-' + file.name + ' 太大了, 大小不能超过2M'
      });
    }
  }
};
export default mixin;
