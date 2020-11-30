<template>
  <div class="m-content">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="16"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.phone"
            placeholder="用户手机号"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Input
            v-model="searchRowData.taskName"
            placeholder="任务名称"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Select
            v-model="searchRowData.taskType"
            placeholder="任务类型"
            class="mr5"
            style="width: 120px"
            clearable
          >
            <Option
              v-for="(item,index) in taskTypeEnum"
              :key="index"
              :value="item.value"
              class="ptb2-5"
            >
              {{ item.label }}
            </Option>
          </Select>
          <Select
            v-model="searchRowData.rewardType"
            placeholder="奖励类型"
            class="mr5"
            style="width: 100px"
            clearable
          >
            <Option
              v-for="(item,index) in rewardTypeEnum"
              :key="index"
              :value="item.value"
              class="ptb2-5"
            >
              {{ item.label }}
            </Option>
          </Select>
          <DatePicker
            v-model="searchRowData.createTimeBegin"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="创建时间起"
            class="search-input"
            style="width: 170px"
            @on-change="startTimeChange"
          />
          <i>-</i>
          <DatePicker
            v-model="searchRowData.createTimeEnd"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="创建时间止"
            class="search-input mr5"
            style="width: 170px"
            @on-change="endTimeChange"
          />
          <Button
            v-waves
            :search-loading="searchLoading"
            class="search-btn mr5"
            type="primary"
            @click="handleSearch"
          >
            <Icon type="md-search" />&nbsp;搜索
          </Button>
          <Button
            v-waves
            :loading="clearSearchLoading"
            class="search-btn"
            type="info"
            @click="handleClear"
          >
            <Icon type="md-refresh" />&nbsp;清除
          </Button>
        </div>
        <div slot="operations"></div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
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
import IViewUpload from '_c/iview-upload';
import { getTaskRecordPages } from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
import uploadMixin from '@/mixins/uploadMixin.js';
import {
  taskTypeEnum,
  rewardTypeEnum,
  receiveStatusEnum
} from '@/libs/enumerate';
import {
  taskTypeConvert,
  rewardTypeConvert,
  receiveStatusConvert
} from '@/libs/converStatus';

const taskRecordDetail = {
  createTime: '',
  createTimeBegin: null,
  createTimeEnd: null,
  giftPackType: '',
  id: 0,
  userId: 0,
  receiveStatus: '',
  receiveTime: '',
  rewardType: '',
  taskIntegral: 0,
  taskType: '',
  taskName: ''
};

const searchRowData = {
  taskName: '',
  taskType: '',
  phone: null,
  createTimeBegin: null,
  createTimeEnd: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [tableMixin, searchMixin, deleteMixin, uploadMixin],
  data() {
    return {
      taskTypeEnum,
      rewardTypeEnum,
      receiveStatusEnum,
      ids: [],
      defaultListMain: [],
      uploadListMain: [],
      defaultListBanner: [],
      uploadListBanner: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      modalEditLoading: false,
      searchRowData: this._.cloneDeep(searchRowData),
      taskRecordDetail: this._.cloneDeep(taskRecordDetail),
      columns: [
        {
          title: '编号',
          align: 'center',
          key: 'id',
          fixed: 'left',
          width: 80
        },
        {
          title: '用户名称',
          align: 'center',
          key: 'nickName',
          resizable: true,
          width: '150'
        },

        {
          title: '手机号码',
          align: 'center',
          key: 'phone',
          resizable: true,
          width: '150'
        },
        {
          title: '任务名称',
          align: 'center',
          key: 'taskName',
          resizable: true,
          width: '150'
        },
        {
          title: '任务类型',
          align: 'center',
          key: 'taskType',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{taskTypeConvert(row.taskType)}</div>;
          }
        },
        {
          title: '任务积分',
          align: 'center',
          key: 'taskIntegral',
          width: '100'
        },
        {
          title: '奖励类型',
          align: 'center',
          key: 'rewardType',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{rewardTypeConvert(row.rewardType)}</div>;
          }
        },
        {
          title: '礼包类型',
          align: 'center',
          key: 'giftPackType',
          render: (h, params, vm) => {
            const { row } = params;
            const str = row.giftPackType === 'COUPON' ? '优惠券' : 'N/A';
            return <div>{str}</div>;
          }
        },
        {
          title: '领取状态',
          align: 'center',
          key: 'receiveStatus',
          resizable: true,
          width: '150px',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{receiveStatusConvert(row.receiveStatus)}</div>;
          }
        },
        {
          title: '领取时间',
          align: 'center',
          key: 'receiveTime'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
        }
      ]
    };
  },
  created() {
    this.getTableData();
  },
  mounted() {},
  methods: {
    getTableData() {
      this.loading = true;
      getTaskRecordPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    startTimeChange(value, date) {
      this.searchRowData.createTimeBegin = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.createTimeEnd = value;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(searchRowData);
    }
  }
};
</script>
<style lang="scss" scoped>
.img {
  margin-top: 0.25rem !important;
  vertical-align: middle;
}
</style>

