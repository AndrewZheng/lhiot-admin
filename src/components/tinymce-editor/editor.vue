<template>
  <div class="tinymce">
    <editor :id="id" v-model="content" :init="defalutOps" @onInit="handleInit" @onChange="handleChange" @onKeyUp="handleKeyup" class="tinymce-textarea"/>
    <div class="editor-custom-btn-container">
      <file-upload class="editor-upload-btn" @successCBK="handleSuccessCBK"/>
    </div>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import Editor from '@tinymce/tinymce-vue';
// Any plugins you want to use has to be imported
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/media';
import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/print';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/tabfocus';
import 'tinymce/plugins/template';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/bbcode';
import 'tinymce/plugins/code';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullpage';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/legacyoutput';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/save';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/table';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/visualchars';
import _ from 'lodash';
import plugins from './plugins';
import toolbar from './toolbar';
import { PcLockr, enums } from '@/util/';
import fileUpload from './components/fileUpload';

export default {
  name: 'tinymce-editor',
  components: { Editor, fileUpload },
  props: {
    id: {
      default: function() {
        return 'vue-tinymce-'+ new Date().getTime() + ((Math.random() * 1000).toFixed(0) + '');
      },
      type: String
    },
    value: { default: '', type: String },
    /**
     * @description 设置编辑器的插件
     */
    plugins: {
      default: plugins,
      type: String,
      required: false
    },
    /**
     * @description 设置编辑器的工具栏
     */
    toolbar: {
      default: toolbar,
      type: String,
      required: false
    },
    /**
     * @description 编辑器的其他设置 参考tinymce文档
     */
    other0ptions: {
      default: function() {
        return {};
      },
      type: Object,
      required: false
    },
    /**
     * @description 设置编辑器的高度
     */
    height: {
      type: [Number, String],
      default: 300,
      required: false
    },
     /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 300
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      content: '',
      editor: null,
      cTinyMce: null,
      checkerTimeout: null,
      isTyping: false,
      defalutOps: {
        language_url: '/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/lightgray',
        height: this.height,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        images_upload_url:
          'https://resource.food-see.com/v1/upload/product_image',
        images_upload_credentials: true,
        images_upload_handler: (blobInfo, success, failure) => {
          this.handleImgUpload(blobInfo, success, failure);
        },
        file_picker_types: 'image',
        file_picker_callback: function(cb, value, meta) {
          var input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.onchange = function() {
            var file = this.files[0];
            var id = 'blobid' + new Date().getTime();
            var blobCache = tinymce.activeEditor.editorUpload.blobCache;
            var blobInfo = blobCache.create(id, file);
            blobCache.add(blobInfo);
            cb(blobInfo.blobUri(), { title: file.name });
          };
          input.click();
        }
      }
    };
  },
  created() {
    if (typeof tinymce === 'undefined') throw new Error('tinymce undefined');
  },
  computed: {
    cacheKey() {
      return enums.EDITOR_CACHE+ '_'+ this.id;
    }
  },
  mounted() {
    // 如果本地有存储加载本地存储内容
    if (this.cache && PcLockr.get(this.cacheKey)) {
      this.content = PcLockr.get(this.cacheKey);
    } else {
      this.content = this.value;
    }
    console.log('init content: ', this.content);
    this.initTinymce();
  },
  methods: {
    initTinymce() {
      const ops = Object.assign({}, this.defalutOps, this.other0ptions);
      tinymce.init(ops);
    },
    handleInit() {
      this.editor=tinymce.get(this.id);
      this.editor.setContent(this.content);
      this.$emit('input', this.content);
    },
    handleChange() {
      if (this.editor.getContent() !== this.value) {
        this.handleKeyup();
      }
    },
    handleKeyup() {
      this.isTyping = true;
      if (this.checkerTimeout !== null) clearTimeout(this.checkerTimeout);
      this.checkerTimeout = setTimeout(() => {
        this.isTyping = false;
        if (this.cache) PcLockr.set(this.cacheKey, this.editor.getContent());
      }, this.changeInterval);
      this.$emit('input', this.editor.getContent());
    },
    handleImgUpload(blobInfo, success, failure) {
      let formdata = new FormData();
      formdata.set('file', blobInfo.blob());
      this.$http
        .request({
          url: 'https://resource.food-see.com/v1/upload/product_image',
          method: 'post',
          data: formdata
        })
        .then(res => {
          success(res.fileUrl);
        })
        .catch(res => {
          failure(res.message);
        });
    },
    handleSuccessCBK(file) {
      console.log('file object:', file);
      let sourceCode='';
      if (file.fileType=='video') {
        sourceCode= '<video width="' + file.width + '" height="' + file.height + '"' + (file.poster ? ' poster="' + file.poster + '"' : '') + ' controls="controls">\n'+
                    '<source src="' + file.fileUrl + '"' + (file.source1mime ? ' type="' + file.source1mime + '"' : '') + ' />' + '</video>';
      } else {
        sourceCode='<audio controls>' + '\n<source src="' + file.fileUrl + '"' + (file.source1mime ? ' type="' + file.source1mime + '"' : '') + ' />\n' + '</audio>';
      }
      // 根据上传的文件类型来插入源码
      console.log(`sourceCode: ${sourceCode}`);
      this.editor.insertContent(sourceCode);
    }
  },
  beforeDestroy() {
    this.editor.remove();
    // 清除掉localcahe
    if (PcLockr.get(this.cacheKey)) {
      PcLockr.delete(this.cacheKey);
    }
  }
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.tinymce {
  position: relative;
}
.tinymce >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
