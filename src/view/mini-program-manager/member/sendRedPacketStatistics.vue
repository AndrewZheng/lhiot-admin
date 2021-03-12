<template>
  <div class="m-role">
    <div style="margin-bottom: 30px">
      <Card>
        <tables
          ref="tables1"
          v-model="tableData"
          :columns="columns"
          :loading="loading"
          :search-area-column="24"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Row>
              <RadioGroup
                v-model="button"
                type="button"
                @on-change="timeChange"
              >
                <Radio label="汇总"></Radio>
                <Radio label="昨日"></Radio>
                <Radio label="今日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div v-show="mark === true" class="mark">
                <DatePicker
                  :value="searchRowData.createBeginDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义开始时间"
                  class="search-input"
                  style="width: 150px"
                  @on-change="searchRowData.createBeginDate = $event"
                />
                <i>-</i>
                <DatePicker
                  :value="searchRowData.createEndDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义结束时间"
                  class="search-input mr5"
                  style="width: 150px"
                  @on-change="searchRowData.createEndDate = $event"
                />
              </div>
              <Input
                v-model="searchRowData.receiveUserName"
                placeholder="领取人昵称"
                class="search-input"
                style="width: 170px"
                clearable
              ></Input>
              <Input
                v-model="searchRowData.receiveUserPhone"
                placeholder="领取人电话"
                class="search-input"
                style="width: 140px"
                clearable
              ></Input>
              <Button
                :loading="searchLoading"
                class="search-btn"
                type="primary"
                @click="handleSearchMaterial"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                :loading="searchLoading"
                class="search-btn mr5"
                type="info"
                @click="handleClearMaterial"
              >
                <Icon type="md-refresh" />&nbsp;搜索
              </Button>
              <Button class="search-btn" type="warning" @click="handleDownload">
                <Icon type="md-download" />导出
              </Button>
            </Row>
            <div class="mt10">
              总计发送红包金额：<b style="color: red">{{
                totalAmount / 100
              }}</b>
              元
            </div>
          </div>
        </tables>
        <div style="margin: 10px; overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="totalPage"
              :current="searchRowData.page"
              show-sizer
              show-total
              @on-change="changePageMaterial"
              @on-page-size-change="changePageSize2"
            ></Page>
          </Row>
        </div>
      </Card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { getWechatRewardPage } from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import { fenToYuanDot2 } from '@/libs/util';

const roleRowData = {
  createBeginDate: '',
  createEndDate: '',
  sidx: 'createTime',
  sort: 'desc',
  receiveUserName: '',
  receiveUserPhone: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      mark: false,
      totalAmount: 0,
      totalPage: 0,
      button: '昨日',
      columns: [
        {
          title: '发起人昵称',
          align: 'center',
          key: 'createUserName',
          minWidth: 120
        },
        {
          title: '电话号码',
          align: 'center',
          key: 'createUserPhone',
          minWidth: 120
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime',
          minWidth: 60
        },
        {
          title: '领取人昵称',
          align: 'center',
          key: 'receiveUserName',
          minWidth: 60
        },
        {
          title: '领取人电话',
          align: 'center',
          key: 'receiveUserPhone',
          minWidth: 60
        },
        {
          title: '领取时间',
          align: 'center',
          key: 'receiveTime',
          minWidth: 60
        },
        {
          title: '领取金额',
          align: 'center',
          key: 'amount',
          minWidth: 60,
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.amount);
            return <div>{amount}</div>;
          }
        }
      ],
      searchRowData: _.cloneDeep(roleRowData)
    };
  },
  computed: {},
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    getTableData(value) {
      const today = this.getDateByParam(0);
      if (value === '昨日' || this.button === '昨日') {
        const yesterday = this.getDateByParam(-1);
        this.searchRowData.createBeginDate = yesterday;
        this.searchRowData.createEndDate = yesterday;
      } else if (value === '今日') {
        this.searchRowData.createBeginDate = today;
        this.searchRowData.createEndDate = today;
      } else if (value === '汇总') {
        const allDay = this.getDateByParam(-365);
        this.searchRowData.createBeginDate = allDay;
        this.searchRowData.createEndDate = today;
      } else if (value === '最近7天') {
        const sevenDay = this.getDateByParam(-7);
        this.searchRowData.createBeginDate = sevenDay;
        this.searchRowData.createEndDate = today;
      } else if (value === '最近30天') {
        const toMonth = this.getDateByParam(-30);
        this.searchRowData.createBeginDate = toMonth;
        this.searchRowData.createEndDate = today;
      }
      this.searchRowData.createBeginDate = this.$moment(
        this.searchRowData.createBeginDate
      ).format('YYYY-MM-DD');
      this.searchRowData.createEndDate = this.$moment(
        this.searchRowData.createEndDate
      ).format('YYYY-MM-DD');
      getWechatRewardPage(this.searchRowData)
        .then((res) => {
          this.tableData = res.pagingResultDto.rows;
          this.totalPage = res.pagingResultDto.total;
          this.totalAmount = res.totalAmount;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    timeChange(value) {
      if (value === '自定义时间') {
        this.mark = true;
        this.searchRowData.createBeginDate = '';
        this.searchRowData.createEndDate = '';
      } else {
        this.mark = false;
        this.getTableData(value);
      }
    },
    starttimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData.createBeginDate = value;
    },
    endtimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData.createEndDate = value;
    },
    handleSearchMaterial() {
      this.searchRowData.page = 1;
      this.getTableData();
    },
    handleClearMaterial() {
      // 重置数据
      this.searchRowData = _.cloneDeep(roleRowData);
      this.button = '昨日';
      this.getTableData('昨日');
    },
    changePageMaterial(page) {
      this.searchRowData.page = page;
      this.getTableData();
    },
    changePageSize2(pageSize) {
      this.searchRowData.page = 1;
      this.searchRowData.rows = pageSize;
      this.getTableData();
    },
    handleDownload() {
      this.searchRowData.rows = this.totalPage > 5000 ? 5000 : this.totalPage;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getWechatRewardPage(this.searchRowData).then((res) => {
        const tableData = res.pagingResultDto.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        this.searchRowData.page = pageSize;
        // 表格数据导出字段翻译
        const _this = this;
        tableData.forEach((item) => {
          item['amount'] = (
            item['amount'] / 100.0
          ).toFixed(2);
        });
        const date = _this.$moment(new Date()).format('YYYYMMDDHHmmss');
        _this.$refs.tables1.handleDownload({
          filename: `外卖红包数据统计-${date}`,
          data: tableData
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.mark {
  display: inline-block;
}
</style>
