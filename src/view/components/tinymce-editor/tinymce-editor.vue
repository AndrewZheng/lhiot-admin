<template>
  <div>
    <tinymce-editor id="tinymce" ref="editor" v-model="content" :height="300" />
    <img-upload
      :show-upload-list="false"
      :default-list="defaultList"
      :max-size="2048"
      :img-list.sync="imgList"
      multiple
      type="drag"
      class="mt10"
      width="60"
      height="60"
    />
  </div>
</template>

<script>
import tinymceEditor from '_c/tinymce-editor';
import ImgUpload from '_c/img-upload';

export default {
  name: 'EditorPage',
  components: {
    tinymceEditor,
    ImgUpload
  },
  data() {
    return {
      content: '',
      defaultList: [],
      imgList: []
    };
  },
  watch: {
    content(val, oldVal) {
      console.log(`new: ${val}, old: ${oldVal}`);
    },
    imgList(val, oldVal) {
      console.log(`new: ${val}, old: ${oldVal}`);
    }
  },
  methods: {}
};
</script>
<style>
</style>
