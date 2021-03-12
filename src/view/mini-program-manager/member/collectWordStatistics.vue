<template>
  <div class="m-role">
    <div style="margin-bottom:30px">
      <Card>
        <h3>集字活动数据统计</h3>
        <tables
          v-model="tableData"
          :columns="dataColumns"
          :loading="loading"
          :search-area-column="18"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        ></tables>
      </Card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { getCollectWordStatistics } from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';

const couponTemplateDetail = {};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, tableMixin],
  data() {
    return {
      dataColumns: [
        {
          title: '兑换获券人数',
          key: 'exchangeUserCount',
          align: 'center'
        },
        {
          title: '参与活动人数',
          key: 'joinUserCount',
          align: 'center'
        },
        {
          title: '用券人数',
          align: 'center',
          key: 'useUserCount'
        },
        {
          title: '集满人数',
          align: 'center',
          key: 'fullUserCount'
        }
      ],
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail)
    };
  },
  computed: {},
  mounted() {
    this.getTableData();
  },
  created() {},
  methods: {
    getTableData() {
      this.loading = true;
      getCollectWordStatistics()
        .then((res) => {
          this.tableData.push(res);
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
