<template>
  <div>
    <InputNumber
      :max="1000000000000000"
      v-model="value9"
      :formatter="value => `$ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
      :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
    <InputNumber
      :max="100000000000000"
      v-model="value10"
      :formatter="value => `${value}`"
      :parser="value =>value"></InputNumber>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value9: 1000,
      value10: 0
    };
  },
  watch: {
    value10(value) {
      console.log(typeof value);
      // let  parseInt(value)
      console.log(value);
    }

  }
};
</script>
