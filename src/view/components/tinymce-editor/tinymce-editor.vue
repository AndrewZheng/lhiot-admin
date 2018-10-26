<template>
  <div>
    <tinymce-editor id="tinymce" ref="editor" v-model="content" :height="300" />
    <tinymce-editor id="tinymce_2" ref="editor2" v-model="contents" :height="300" />
  </div>
</template>

<script>
import tinymceEditor from '_c/tinymce-editor';
export default {
  name: 'editor_page',
  components: {
    tinymceEditor
  },
  data () {
    return {
      content: '',
      contents: ''
    };
  },
  methods: {},
  watch: {
    content(val, oldVal) {
      console.log(`new: ${val}, old: ${oldVal}`);
    },
    contents(val, oldVal) {
      console.log(`new 2: ${val}, old2: ${oldVal}`);
    }
  }
};
</script>

<style>
</style>
