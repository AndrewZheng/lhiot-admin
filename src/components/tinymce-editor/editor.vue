<template>
  <div class="tinymce">
    <editor
      :id="id"
      v-model="content"
      :init="defalutOps"
      class="tinymce-textarea"
      @onInit="handleInit"
      @onChange="handleChange"
      @onKeyUp="handleKeyup"
    />
    <div class="editor-custom-btn-container">
      <file-upload class="editor-upload-btn" @successCBK="handleSuccessCBK"/>
    </div>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import plugins from './plugins';
import toolbar from './toolbar';
import { PcLockr, enums } from '@/util/';
import fileUpload from './components/fileUpload';

export default {
  name: 'TinymceEditor',
  components: { Editor, fileUpload },
  props: {
    id: {
      default: function() {
        return (
          'vue-tinymce-' +
          new Date().getTime() +
          ((Math.random() * 1000).toFixed(0) + '')
        );
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
      tinymceId: this.id,
      defalutOps: {
        language: 'zh_CN',
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        plugins: this.plugins,
        toolbar: this.toolbar,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
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
            var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
            var blobInfo = blobCache.create(id, file);
            blobCache.add(blobInfo);
            cb(blobInfo.blobUri(), { title: file.name });
          };
          input.click();
        }
      }
    };
  },
  computed: {
    cacheKey() {
      return enums.EDITOR_CACHE + '_' + this.tinymceId;
    }
  },
  created() {
    if (typeof tinymce === 'undefined') throw new Error('tinymce undefined');
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
  beforeDestroy() {
    this.editor.remove();
    // 清除掉localcahe
    if (PcLockr.get(this.cacheKey)) {
      PcLockr.delete(this.cacheKey);
    }
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    initTinymce() {
      const ops = Object.assign({}, this.defalutOps, this.other0ptions);
      window.tinymce.init(ops);
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (tinymce) { tinymce.destroy(); }
    },
    handleInit() {
      this.editor = window.tinymce.get(this.tinymceId);
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
      const formdata = new FormData();
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
      let sourceCode = '';
      if (file.fileType == 'video') {
        sourceCode =
          '<video width="' +
          file.width +
          '" height="' +
          file.height +
          '"' +
          (file.poster ? ' poster="' + file.poster + '"' : '') +
          ' controls="controls">\n' +
          '<source src="' +
          file.fileUrl +
          '"' +
          (file.source1mime ? ' type="' + file.source1mime + '"' : '') +
          ' />' +
          '</video>';
      } else {
        sourceCode =
          '<audio controls>' +
          '\n<source src="' +
          file.fileUrl +
          '"' +
          (file.source1mime ? ' type="' + file.source1mime + '"' : '') +
          ' />\n' +
          '</audio>';
      }
      // 根据上传的文件类型来插入源码
      console.log(`sourceCode: ${sourceCode}`);
      this.editor.insertContent(sourceCode);
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
