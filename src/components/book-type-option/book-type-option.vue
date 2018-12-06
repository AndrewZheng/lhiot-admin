<template>
  <div style="display:inline-block;">
    <Select v-model="bookType" class="form-control">
      <Option v-for="item in options" :key="item" :value="item">{{ item }}</Option>
    </Select>
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
