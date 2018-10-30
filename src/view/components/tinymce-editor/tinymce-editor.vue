<template>
  <div>
    <tinymce-editor id="tinymce" ref="editor" v-model="content" :height="300" />
    <!-- <tinymce-editor id="tinymce_2" ref="editor2" v-model="contents" :height="300" /> -->
    <img-upload
    :show-upload-list="false"
    :default-list="defaultList"
    :max-size="2048"
    :img-list.sync="imgList"
    multiple
    type='drag'
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
  name: 'editor_page',
  components: {
    tinymceEditor,
    ImgUpload
  },
  data () {
    return {
      content: '',
      contents: '',
      defaultList: [],
      imgList: []
    };
  },
  methods: {},
  watch: {
    content(val, oldVal) {
      console.log(`new: ${val}, old: ${oldVal}`);
    },
    contents(val, oldVal) {
      console.log(`new 2: ${val}, old2: ${oldVal}`);
    },
    imgList(val, oldVal) {
      console.log(`new: ${val}, old: ${oldVal}`);
    }
  }
};
</script>

<style>
</style>
