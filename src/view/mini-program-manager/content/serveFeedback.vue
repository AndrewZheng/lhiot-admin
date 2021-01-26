<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="22"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.storeName"
              placeholder="门店名称"
              class="search-input mr5"
              style="width: 130px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.fruitScore"
              placeholder="果品评价"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="(item, index) in commentScoreTypeEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="width: 90px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.serviceScore"
              placeholder="服务评价"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="(item, index) in commentScoreTypeEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="width: 90px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.environmentScore"
              placeholder="环境卫生评价"
              style="width: 130px"
              clearable
            >
              <Option
                v-for="(item, index) in commentScoreTypeEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="width: 130px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.feedbackTitle"
              placeholder="反馈主题"
              style="width: 130px"
              clearable
            >
              <Option
                v-for="(item, index) in feedbackTitleList"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="width: 130px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.whetherGiveReceipt"
              placeholder="是否给小票"
              style="width: 110px"
              clearable
            >
              <Option
                v-for="(item, index) in istopTypeEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="width: 110px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <DatePicker
              :value="searchRowData.commentTimeBegin"
              format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="评价时间起"
              class="search-input"
              style="width: 160px"
              @on-change="searchRowData.commentTimeBegin = $event"
            />
            <i>-</i>
            <DatePicker
              :value="searchRowData.commentTimeEnd"
              format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="评价时间止"
              class="search-input mr2"
              style="width: 160px"
              @on-change="searchRowData.commentTimeEnd = $event"
            />
            <Button
              :loading="searchLoading"
              class="search-btn mr5"
              type="primary"
              @click="handleSearch"
            >
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn mr5"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
            <Button
              class="search-btn mr2"
              type="warning"
              @click="handleDownload"
            >
              <Icon type="md-download" />导出数据
            </Button>
          </Row>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { serviceFeedback, getSystemParameter } from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import { commentScoreTypeEnum } from '@/libs/enumerate';

const roleRowData = {
  storeName: '',
  fruitScore: '',
  serviceScore: '',
  environmentScore: '',
  feedbackTitle: '',
  whetherGiveReceipt: '',
  page: 1,
  rows: 10,
  commentTimeBegin: '',
  commentTimeEnd: '',
  sidx: 'commentTime',
  sort: 'desc'
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      columns: [
        {
          title: '门店',
          align: 'center',
          key: 'storeName',
          width: '160px'
        },
        {
          title: '用户',
          align: 'center',
          key: 'nickName',
          width: '150px'
        },
        {
          title: '手机号码',
          align: 'center',
          key: 'phone',
          width: '130px'
        },
        {
          title: '评价时间',
          align: 'center',
          key: 'commentTime',
          width: '120px'
        },
        {
          title: '是否给小票',
          align: 'center',
          key: 'whetherGiveReceipt',
          width: '110px',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.whetherGiveReceipt === 'YES') {
              return <div>{'是'}</div>;
            } else {
              return <div>{'否'}</div>;
            }
          }
        },
        {
          title: '是否介绍活动',
          align: 'center',
          key: 'whetherIntrActivity',
          width: '130px',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.whetherIntrActivity === 'YES') {
              return <div>{'是'}</div>;
            } else {
              return <div>{'否'}</div>;
            }
          }
        },
        {
          title: '果品评价',
          align: 'center',
          key: 'fruitScore',
          width: '100px',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{row.fruitScore + '星'}</div>;
          }
        },
        {
          title: '服务评价',
          align: 'center',
          width: '100px',
          key: 'serviceScore',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{row.serviceScore + '星'}</div>;
          }
        },
        {
          title: '环境卫生评价',
          align: 'center',
          width: '130px',
          key: 'environmentScore',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{row.environmentScore + '星'}</div>;
          }
        },
        {
          title: '反馈主题',
          align: 'center',
          key: 'feedbackTitle',
          width: '130px',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.environmentScore) {
              return <div>{row.feedbackTitle}</div>;
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '反馈内容',
          align: 'center',
          key: 'feedbackContent',
          minWidth: 200,
          tooltip: true
        }
      ],
      istopTypeEnum: [
        { label: '是', value: 'YES' },
        { label: '否', value: 'NO' }
      ],
      commentScoreTypeEnum,
      feedbackTitleList: [],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
    this.getSystemParameters();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
    },
    getTableData() {
      serviceFeedback(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getSystemParameters() {
      const code = 'FEEDBACK_TITLE_TYPE';
      getSystemParameter(code)
        .then((res) => {
          res.systemSettings.forEach((value) => {
            const map = { label: 'label', value: 'value' };
            map.value = value.indexValue;
            map.label = value.indexValue;
            this.feedbackTitleList.push(map);
          });
        })
    },
    // 导出数据
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      serviceFeedback(this.searchRowData).then((res) => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        this.searchRowData.page = pageSize;
        // 表格数据导出字段翻译
        tableData.forEach((item) => {
          item['environmentScore'] = item['environmentScore'] + '星';
          item['fruitScore'] = item['fruitScore'] + '星';
          item['serviceScore'] = item['serviceScore'] + '星';
          item['whetherGiveReceipt'] =
            item['whetherGiveReceipt'] === 'YES' ? '是' : '否';
          item['whetherIntrActivity'] =
            item['whetherIntrActivity'] === 'YES' ? '是' : '否';
        });

        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `服务反馈数据统计-${date}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
