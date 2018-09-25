<template>
  <div>
    <tinymce-editor id="tinymce" ref="editor" v-model="content" :height="300" />
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
      content: ''
    };
  },
  methods: {},
  watch: {
    content(val, oldVal) {
      console.log(`new: ${val}, old: ${oldVal}`);
    }
  }
};
</script>

<style>
</style>
