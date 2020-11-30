<template>
  <div class="m-content">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="20"
        :operate-area-column="4"
        editable
        searchable
        border
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.title"
            placeholder="标题"
            class="search-input mr5"
            style="width: 150px"
            clearable
          >
          </Input>
          <Input
            v-model="searchRowData.content"
            placeholder="内容"
            class="search-input mr5"
            style="width: 150px"
            clearable
          >
          </Input>
          <Select
            v-model="searchRowData.status"
            class="search-col"
            placeholder="反馈状态"
            style="width: 150px"
            clearable
          >
            <Option
              v-for="item in feedbackStatus"
              :key="item.value"
              :value="item.value"
              class="ml15 mt10"
            >{{ item.label }}</Option>
          </Select>
          <Button v-waves :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
            <Icon type="md-search" />&nbsp;搜索
          </Button>
          <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
            <Icon type="md-refresh" />&nbsp;清除条件
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current.sync="page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <!--查看 -->
    <Modal v-model="modalView">
      <p slot="header">
        <span>用户反馈详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">ID:</i-col>
              <i-col span="16">{{ feedbackDetail.id }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">应用类型:</i-col>
              <i-col span="16">{{ applicationTypeComputed() }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">反馈用户:</i-col>
              <i-col span="16">{{ feedbackDetail.nickname }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">反馈时间:</i-col>
              <i-col span="16">{{ feedbackDetail.createAt }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">标题:</i-col>
              <i-col span="16">{{ feedbackDetail.title }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="24" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">反馈内容:</i-col>
              <i-col span="16">{{ feedbackDetail.content }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">反馈状态:</i-col>
              <i-col span="16">{{ feedbackDetail.status|feedbackStatusFilters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row v-if="tempModalType === modalType.view">
          <Row :gutter="8" type="flex" align="middle" class-name="mb10">
            <i-col span="12">
              <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                <i-col span="8">回复人:</i-col>
                <i-col span="16">{{ feedbackDetail.backEditor }}</i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                <i-col span="8">回复时间:</i-col>
                <i-col span="16">{{ feedbackDetail.feedbackAt }}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row :gutter="8" type="flex" align="middle" class-name="mb10">
            <i-col span="12">
              <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                <i-col span="8">回复内容:</i-col>
                <i-col span="16">{{ feedbackDetail.backMessage }}</i-col>
              </Row>
            </i-col>
          </Row>
        </Row>
        <Form
          v-if="tempModalType === modalType.edit"
          ref="modalEdit"
          :model="feedbackDetail"
          :rules="ruleInline"
          :label-width="80"
        >
          <FormItem label="回复内容:" prop="backMessage">
            <Input v-model="feedbackDetail.backMessage" type="textarea"></Input>
          </FormItem>
        </Form>
      </div>
      <div v-if="tempModalType === modalType.edit" slot="footer">
        <Button :loading="feedbackLoading" type="primary" @click="handleEditOk('modalEdit')">确认</Button>
      </div>
      <!--
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div> -->
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import { getFeedbacksPages, editFeedback } from '@/api/fruitermaster';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { getDictionary } from '@/api/basic';

const feedbackDetail = {
  applicationType: null,
  backEditor: '',
  backMessage: '',
  content: '',
  createAt: '',
  feedbackAt: '',
  id: 0,
  status: null,
  title: '',
  userId: 0,
  nickname: ''
};

const roleRowData = {
  applicationType: null,
  content: '',
  page: 1,
  rows: 10,
  status: null,
  title: ''
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        backMessage: [{ required: true, message: '回复内容不能为空' }]
      },
      columns: [
        {
          title: 'id',
          key: 'id',
          sortable: true,
          minWidth: 50
        },
        {
          title: '标题',
          width: 150,
          key: 'title',
          tooltip: true
        },
        {
          title: '内容',
          width: 170,
          key: 'content',
          tooltip: true
        },
        {
          title: '反馈用户',
          width: 185,
          key: 'nickname'
        },
        {
          title: '创建时间',
          width: 185,
          key: 'createAt',
          sortable: true
        },
        {
          title: '反馈状态',
          width: 120,
          key: 'status',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === 'UNREPLY') {
              return <tag color='warning'>{'未回复'}</tag>;
            } else if (row.status === 'REPLY') {
              return <tag color='primary'>{'已回复'}</tag>;
            } else if (row.status === 'READED') {
              return <tag color='success'>{'已读'}</tag>;
            } else {
              return row.status;
            }
          }
        },
        {
          title: '回复人',
          width: 100,
          key: 'backEditor',
          tooltip: true
        },
        {
          title: '回复内容',
          width: 170,
          key: 'backMessage',
          tooltip: true
        },
        {
          title: '应用类型',
          width: 160,
          key: 'applicationType',
          sortable: true,
          render: (h, params, vm) => {
            const { row } = params;
            const filterObj = this.applicationTypeList.find(item => {
              return item.code === row.applicationType;
            });
            // if (JSON.stringify(filterObj) !== '{}') {
            return <div>{filterObj !== null ? filterObj.name : row.applicationType }</div>;
          }
        },
        {
          title: '操作',
          minWidth: 150,
          key: 'handle',
          options: ['view', 'feedback']
        }
      ],
      feedbackDetail: _.cloneDeep(feedbackDetail),
      searchRowData: _.cloneDeep(roleRowData),
      applicationTypeList: [],
      feedbackLoading: false,
      // 反馈状态（UNREPLY-未回复，REPLY-已回复且用户未读，READED-已读）
      feedbackStatus: [
        {
          label: '未回复',
          value: 'UNREPLY'
        },
        {
          label: '已回复',
          value: 'REPLY'
        },
        {
          label: '已读',
          value: 'READED'
        }]
    };
  },
  computed: {

  },
  mounted() {
    this.getApplications();
  },
  created() {
    this.getTableData();
    // this.getApplications();
  },
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleEdit(params) {
      // this.$refs.modalEdit.resetFields();
      this.tempModalType = this.modalType.edit;
      this.feedbackDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEditOk(params) {
      this.feedbackLoading = true;
      editFeedback({
        id: this.feedbackDetail.id,
        backMessage: this.feedbackDetail.backMessage
      }).then(res => {
        this.$Message.success('回复成功!');
        this.getTableData();
      }).finally(res => {
        this.modalView = false;
        this.feedbackLoading = false;
      });
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.feedbackDetail = params.row;
      this.modalView = true;
    },
    getTableData() {
      this.searchRowData.applicationType = this.applicationType;
      getFeedbacksPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    getApplications() {
      getDictionary({ code: 'applications' }).then(res => {
        if (res.entries) {
          this.applicationTypeList = res.entries;
        }
      });
    },
    applicationTypeComputed() {
      if (this.applicationTypeList !== [] && this.feedbackDetail.applicationType !== null) {
        const filterObj = this.applicationTypeList.find(item => {
          return item.code === this.feedbackDetail.applicationType;
        });
        return filterObj !== null ? filterObj.name : this.feedbackDetail.applicationType;
      } else {
        return this.feedbackDetail.applicationType;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .img {
    width: 150px;
    height: auto !important;
  }

  .add-image {
    line-height: 48px;
    vertical-align: text-bottom;
    margin-right: 10px;
  }
</style>
