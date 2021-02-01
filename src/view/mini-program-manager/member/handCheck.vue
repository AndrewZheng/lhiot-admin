<template>
  <div class="m-role">
    <div class="tabChange">
      <b
        data-index="check"
        :class="topStatus == 'check' ? 'hot' : ''"
        @click="assistDataChange"
      >员工审核</b>
      <b
        data-index="manage"
        :class="topStatus == 'manage' ? 'hot' : ''"
        @click="assistDataChange"
      >员工管理</b>
    </div>
    <Card v-show="topStatus === 'check'">
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
        @on-staffAudit="hanldeAudit"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Select
              v-model="searchRowData.auditStatus"
              placeholder="审核状态"
              style="padding-right: 5px; width: 100px"
              @on-change="handAuditStatus"
            >
              <Option
                v-for="(item, index) in checkStatus"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px; width: 100px"
              >
                {{ item.label }}
              </Option>
            </Select>
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
    <Card v-show="topStatus === 'manage'">
      <tables
        ref="tablesManage"
        v-model="tableDataManage"
        :columns="columnsManage"
        :loading="loading"
        :search-area-column="24"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-inline-edit="modalHandleEdit"
        @on-inline-save="modalHandleSave"
        @on-abolish="modalHandleAbolish"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div v-show="!showBack" slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowDataManage.staffName"
              placeholder="员工姓名"
              class="search-input mr5"
              style="width: 110px"
              clearable
            ></Input>
            <Input
              v-model="searchRowDataManage.staffPhone"
              placeholder="手机号码"
              class="search-input mr5"
              style="width: 120px"
              clearable
            ></Input>
            <RadioGroup v-model="button" type="button" @on-change="timeChange">
              <Radio label="今日"></Radio>
              <Radio label="昨日"></Radio>
              <Radio label="最近7天"></Radio>
              <Radio label="最近30天"></Radio>
              <Radio label="自定义时间"></Radio>
            </RadioGroup>
            <div v-show="mark" class="mark">
              <DatePicker
                :value="searchRowDataManage.applyTimeBegin"
                format="yyyy-MM-dd"
                type="date"
                placeholder="自定义开始时间"
                class="search-input"
                style="width: 150px"
                @on-change="searchRowDataManage.applyTimeBegin = $event"
              />
              <i>-</i>
              <DatePicker
                :value="searchRowDataManage.applyTimeEnd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="自定义结束时间"
                class="search-input mr5"
                style="width: 150px"
                @on-change="searchRowDataManage.applyTimeEnd = $event"
              />
            </div>
            <Button
              v-waves
              :loading="searchLoading"
              class="search-btn ml5"
              type="primary"
              @click="handleSearchManage"
            >
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn mr2"
              type="info"
              @click="handleClearManage"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
            <Button class="search-btn" type="warning" @click="handleDownload">
              <Icon type="md-download" />导出
            </Button>
          </Row>
        </div>
        <div v-show="showBack" slot="operations">
          <Button
            v-waves
            class="search-btn ml5 mr5"
            type="primary"
            @click="goBack"
          >
            <Icon type="ios-arrow-back" />&nbsp;返回会员管理
          </Button>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="totalManage"
            :current="searchRowDataManage.page"
            show-sizer
            show-total
            @on-change="changePageManage"
            @on-page-size-change="changePageSizeManage"
          ></Page>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import { getStaffManage, StaffAudit, staffUpdate } from '@/api/mini-program';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { getSmallGoodsStandard } from '@/libs/util';

const activitiesDetail = {};

const roleRowData = {
  auditStatus: 'UNAUDITED',
  page: 1,
  rows: 10
};

const roleRowDataManage = {
  staffName: null,
  staffPhone: null,
  applyTimeBegin: null,
  applyTimeEnd: null,
  auditStatus: 'PASSED',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      mark: false,
      button: '今日',
      columns: [
        {
          title: '员工姓名',
          align: 'center',
          key: 'staffName'
        },
        {
          title: '所在部门',
          align: 'center',
          key: 'deptName'
        },
        {
          title: '岗位名称',
          align: 'center',
          key: 'positionName'
        },
        {
          title: '联系方式',
          align: 'center',
          width: 140,
          key: 'staffPhone'
        },
        {
          title: '昵称',
          align: 'center',
          key: 'nickName'
        },
        {
          title: '操作',
          align: 'center',
          width: 140,
          key: 'handle',
          options: ['staffAudit']
        }
      ],
      columnsManage: [
        {
          title: '昵称',
          align: 'center',
          key: 'nickName'
        },
        {
          title: '联系方式',
          align: 'center',
          width: 140,
          key: 'staffPhone'
        },
        {
          title: '申请时间',
          align: 'center',
          width: 180,
          key: 'applyTime'
        },
        {
          title: '员工姓名',
          align: 'center',
          key: 'staffName',
          render(h, params, vm) {
            const { row } = params;
            if (row.isEdit) {
              return h(
                'Div',
                {
                  style: {
                    display: 'flex',
                    flexDirection: 'column'
                  }
                },
                [
                  h('Input', {
                    style: {
                      marginLeft: '4px',
                      width: '100%'
                    },
                    props: {
                      type: 'text',
                      value: row.staffName // 使用key的键值
                    },
                    on: {
                      input: (event) => {
                        row.staffName = event;
                      }
                    }
                  })
                ]
              );
            } else {
              return h('div', row.staffName);
            }
          }
        },
        {
          title: '所在部门',
          align: 'center',
          key: 'deptName',
          render(h, params, vm) {
            const { row } = params;
            if (row.isEdit) {
              return h(
                'Div',
                {
                  style: {
                    display: 'flex',
                    flexDirection: 'column'
                  }
                },
                [
                  h('Input', {
                    style: {
                      marginLeft: '4px',
                      width: '100%'
                    },
                    props: {
                      type: 'text',
                      value: row.deptName // 使用key的键值
                    },
                    on: {
                      input: (event) => {
                        row.deptName = event;
                      }
                    }
                  })
                ]
              );
            } else {
              return h('div', row.deptName);
            }
          }
        },
        {
          title: '岗位名称',
          align: 'center',
          key: 'positionName',
          render(h, params, vm) {
            const { row } = params;
            if (row.isEdit) {
              return h(
                'Div',
                {
                  style: {
                    display: 'flex',
                    flexDirection: 'column'
                  }
                },
                [
                  h('Input', {
                    style: {
                      marginLeft: '4px',
                      width: '100%'
                    },
                    props: {
                      type: 'text',
                      value: row.positionName // 使用key的键值
                    },
                    on: {
                      input: (event) => {
                        row.positionName = event;
                      }
                    }
                  })
                ]
              );
            } else {
              return h('div', row.positionName);
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 140,
          key: 'handle',
          options: ['amendEdit', 'abolish']
        }
      ],
      checkStatus: [
        { label: '待审核', value: 'UNAUDITED' },
        { label: '已通过', value: 'PASSED' },
        { label: '已拒绝', value: 'REJECTED' }
      ],
      topStatus: 'check',
      createLoading: false,
      modalViewLoading: false,
      tableDataManage: [],
      totalManage: 0,
      showBack: false,
      openStatus: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRowDataManage: _.cloneDeep(roleRowDataManage),
      activitiesDetail: _.cloneDeep(activitiesDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
    this.getTableDataManage();
  },
  created() {
    this.showBack = this.$route.name === 'small-member-relation-handCheck';
  },
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.searchRowDataManage = _.cloneDeep(roleRowDataManage);
      this.getTableData();
      this.getTableDataManage();
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
    },
    getTableData() {
      this.loading = true;
      getStaffManage(this.searchRowData)
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
    getTableDataManage(value) {
      // 获取商品页面传过来的商品信息
      if (this.$route.name === 'small-member-relation-handCheck') {
        const memberMsg = getSmallGoodsStandard();
        this.topStatus = memberMsg.topStatus;
        this.searchRowDataManage.applyTimeBegin = '';
        this.searchRowDataManage.applyTimeEnd = '';
        this.searchRowDataManage.staffPhone = memberMsg.phone;
      } else {
        const date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        if (value === '昨日') {
          const date = new Date();
          date.setDate(date.getDate() - 1);
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var yesterday = `${year}-${month}-${day}`;
          this.searchRowDataManage.applyTimeBegin = yesterday;
          this.searchRowDataManage.applyTimeEnd = yesterday;
        }
        if (value === '今日') {
          const date = new Date();
          date.setDate(date.getDate());
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var today = `${year}-${month}-${day}`;
          this.searchRowDataManage.applyTimeBegin = today;
          this.searchRowDataManage.applyTimeEnd = today;
        }
        if (value === '最近7天') {
          const date = new Date();
          date.setDate(date.getDate() - 7);
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var sevenDay = `${year}-${month}-${day}`;
          this.searchRowDataManage.applyTimeBegin = sevenDay;
          this.searchRowDataManage.applyTimeEnd = today;
        }
        if (value === '最近30天') {
          const date = new Date();
          date.setDate(date.getDate() - 30);
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var toMonth = `${year}-${month}-${day}`;
          this.searchRowDataManage.applyTimeBegin = toMonth;
          this.searchRowDataManage.applyTimeEnd = today;
        }
        const date1 = new Date();
        date1.setDate(date.getDate() - 1);
        var year1 = date.getFullYear();
        var month1 = date.getMonth() + 1;
        var day1 = date.getDate();
        var yesterday1 = `${year1}-${month1}-${day1}`;
        if (this.button === '今日') {
          this.searchRowDataManage.applyTimeBegin = yesterday1;
          this.searchRowDataManage.applyTimeEnd = yesterday1;
        }
      }
      this.loading = true;
      getStaffManage(this.searchRowDataManage)
        .then((res) => {
          res.rows.forEach((element) => {
            element.isEdit = false;
          });
          this.tableDataManage = res.rows;
          this.totalManage = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handAuditStatus() {
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.getTableData();
    },
    hanldeAudit({ params, checkStatus }) {
      StaffAudit({
        id: params.row.id,
        checkStatus
      }).then((res) => {
        this.$Message.info('审核成功');
        this.getTableData();
      });
    },
    assistDataChange(e) {
      const index = e.currentTarget.dataset.index;
      if (this.topStatus === index) {
        return;
      }
      this.topStatus = index;
    },
    changePageManage(page) {
      this.searchRowDataManage.page = page;
      this.getTableDataManage();
    },
    changePageSizeManage(pageSize) {
      this.searchRowDataManage.page = 1;
      this.searchRowDataManage.rows = pageSize;
      this.getTableDataManage();
    },
    handleSearchManage() {
      this.openStatus = false;
      this.searchRowDataManage.page = 1;
      this.searchLoading = true;
      this.getTableDataManage();
    },
    handleClearManage() {
      this.openStatus = false;
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.button = '今日';
      this.getTableDataManage('今日');
    },
    timeChange(value) {
      this.openStatus = false;
      if (value === '今日') {
        this.getTableDataManage(value);
        this.mark = false;
      } else if (value === '昨日') {
        this.mark = false;
        this.getTableDataManage(value);
      } else if (value === '最近7天') {
        this.mark = false;
        this.getTableDataManage(value);
      } else if (value === '最近30天') {
        this.mark = false;
        this.getTableDataManage(value);
      } else if (value === '自定义时间') {
        this.mark = true;
        this.searchRowDataManage.applyTimeBegin = '';
        this.searchRowDataManage.applyTimeEnd = '';
      }
    },
    modalHandleEdit(params) {
      if (!this.openStatus) {
        this.openStatus = true;
        this.$set(params.row, 'isEdit', true);
      } else {
        this.$Message.info('已有打开正在编辑中的窗口!');
      }
    },
    modalHandleSave(params) {
      const { row } = params;
      this.openStatus = false;
      staffUpdate(row)
        .then((res) => {
          this.$Message.success('操作成功!');
          this.getTableDataManage();
        })
        .finally((res) => {});
    },
    modalHandleAbolish(params) {
      this.$set(params.row, 'isEdit', false);
      this.openStatus = false;
    },
    goBack() {
      this.$router.back();
    },
    // 导出数据
    handleDownload() {
      this.openStatus = false;
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowDataManage.rows =
        this.totalManage > 5000 ? 5000 : this.totalManage;
      const pageSize = this.searchRowDataManage.page;
      this.searchRowDataManage.page = 1;
      getStaffManage(this.searchRowDataManage).then((res) => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowDataManage.rows = 10;
        this.searchRowDataManage.page = pageSize;
        // 表格数据导出字段翻译
        const _this = this;
        tableData.forEach((item) => {
          // item["deliveryComment"] = deliveryTypeConvert(
          //   item["deliveryComment"]
          // ).label;
          // item["commentScore"] = item["commentScore"] + "星";
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `内部员工数据统计-${date}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tabChange {
  height: 50px;
  width: 230px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  bottom: -5px;
  left: 0;
  background: rgb(245, 247, 249);
  border: 1px solid rgb(232, 234, 236);
  border-radius: 10px 10px 0 0;
  b {
    display: block;
    width: 113px;
    height: 48px;
    cursor: pointer;
    line-height: 50px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  }
}
.hot {
  display: inline-block;
  // color: red;
  background-color: #fff;
}
</style>
