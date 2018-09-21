<template>
  <div class="tinymce">
    <editor :id="id" v-model="tinyHtml" :init='tinymceOps'></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textcolor';
import _ from 'lodash';

const INIT = 0;
const INPUT = 1;
const CHANGED = 2;

export default {
  name: 'tinymce',
  components: { Editor },
  props: {
    value: {
      type: String,
      default: ''
    },
    setup: {
      type: Function,
      default: function() {}
    },
    setting: {
      type: Object,
      default: function() {
        return this.tinymceOps;
      }
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html'
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
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
      id: 'vue-tinymce-' + Date.now(),
      tinyHtml: '',
      editor: null,
      status: INIT,
      tinymceOps: {
        language_url: '/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/lightgray',
        height: 300,
        plugins:
          'link lists image code table colorpicker textcolor wordcount contextmenu',
        toolbar:
          'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
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
  watch: {
    value(val) {
      // console.log('value change', val, this.status);
      if (this.status === CHANGED) return (this.status = INPUT);
      if (!this.editor || !this.editor.initialized) return; // fix editor plugin is loading and set content will throw error.
      this.editor.setContent(val);
    }
  },
  created() {
    if (typeof tinymce === 'undefined') throw new Error('tinymce undefined');
  },
  mounted() {
    const setting = Object.assign({}, this.setting, {
      selector: '#' + this.id,
      setup: editor => {
        this.setup(editor);
        this.editor = editor;
        // console.log('setup');
        editor.on('init', () => {
          // console.log('init', this.value);
          editor.setContent(this.value);
          // fix execCommand not change ,more see issues#2
          editor.on('input change undo redo execCommand KeyUp', () => {
            if (this.status === INPUT || this.status === INIT) { return (this.status = CHANGED); }
            this.$emit('input', editor.getContent());
            // console.log('editor change', editor.getContent());
          });
          // fix have chang not to emit input,more see issues #4
          editor.on('NodeChange', () => {
            this.$emit('input', editor.getContent());
          });
        });
      }
    });
    tinymce.init(setting);
  },
  methods: {
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
    }
  },
  beforeDestroy: function() {
    this.editor.remove();
  }
};
</script>
