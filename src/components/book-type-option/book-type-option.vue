<template>
  <div style="display:inline-block;">
    <label class="radio-label">导出类型: </label>
    <select v-model="bookType" style="width:50px;" >
      <option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item"/>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: 'xlsx'
    }
  },
  data() {
    return {
      options: ['xlsx', 'csv', 'zip']
    };
  },
  computed: {
    bookType: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  }
};
</script>
