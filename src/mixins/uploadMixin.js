let mixin = {
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
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      });
    }
  }
};
export default mixin;
