<template>
  <div>
    <tinymce-editor ref="editor" :value.sync="content" />
    <!-- <button @click="changeContent">修改编辑器内容</button> -->
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
      console.log('new: %s, old: %s', val, oldVal);
    }
  }
};
</script>

<style>

</style>
