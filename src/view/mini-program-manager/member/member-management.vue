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
        @on-upgrade="onUpgrade"
        @on-staff="onStaff"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.phone"
              placeholder="手机号码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.gender"
              placeholder="性别"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in genderEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.isCommunity"
              placeholder="是否社群用户"
              style="padding-right: 5px;width: 130px"
              clearable
            >
              <Option
                v-for="(item,index) in communityEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.userClass"
              placeholder="是否白名单用户"
              style="padding-right: 5px;width: 150px"
              clearable
            >
              <Option
                v-for="(item,index) in whiteListEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.userType"
              placeholder="用户类型"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in userEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.regBeginTime"
              format="yyyy-MM-dd"
              type="date"
              placeholder="自定义开始时间"
              class="search-input"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.regEndTime"
              format="yyyy-MM-dd"
              type="date"
              placeholder="自定义结束时间"
              class="search-input mr5"
              style="width: 150px"
              @on-change="endTimeChange"
            />
            <Button
              v-waves
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
          </Row>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
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
import CountTo from '_c/count-to';
import _ from 'lodash';
import { getUsersInfo, setUserClass, setStaff } from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { setSmallGoodsStandard } from '@/libs/util';
import { whiteListEnum } from '@/libs/enumerate';

const userDetail = {
  nickName: '',
  phone: '',
  gender: '',
  consumeSumAmount: '',
  rechargeSumAmount: '',
  isCommunity: '',
  userType: '',
  registrationAt: '',
  userClass: 'EXTERIOR'
};

const roleRowData = {
  isCommunity: null,
  userClass: null,
  userType: null,
  gender: null,
  nickName: null,
  phone: null,
  regBeginTime: null,
  regEndTime: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    CountTo
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      columns: [
        {
          title: '会员ID',
          key: 'id',
          align: 'center',
          width: '90px'
        },
        {
          title: '昵称',
          key: 'nickName',
          align: 'center'
        },
        {
          title: '手机号码',
          key: 'phone',
          align: 'center',
          width: '140px'
        },
        {
          title: '性别',
          key: 'gender',
          align: 'center',
          width: '80px',
          render(h, params) {
            const { row } = params;
            if (row.gender === '1') {
              return <div>{'男'}</div>;
            } else if (row.gender === '2') {
              return <div>{'女'}</div>;
            } else {
              return <div>{'未知'}</div>;
            }
          }
        },
        {
          title: '消费总额',
          align: 'center',
          key: 'consumeSumAmount'
        },
        {
          title: '充值总额',
          key: 'rechargeSumAmount',
          align: 'center'
        },
        {
          title: '社群成员',
          key: 'isCommunity',
          align: 'center',
          width: '100px',
          render(h, params) {
            const { row } = params;
            if (row.isCommunity === 'YES') {
              return (
                <div>
                  <tag color='orange'>{'是'}</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='blue'>{'否'}</tag>
                </div>
              );
            }
          }
        },
        {
          title: '用户类型',
          key: 'userType',
          align: 'center',
          width: '120px',
          render(h, params) {
            const { row } = params;
            if (row.userType === 'CONSUMER') {
              return (
                <div>
                  <tag color='blue'>{'普通用户'}</tag>
                </div>
              );
            } else if (row.userType === 'STAFF') {
              return (
                <div>
                  <tag color='gold'>{'员工特权'}</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='blue'>{'N/A'}</tag>
                </div>
              );
            }
          }
        },
        {
          title: '注册时间',
          key: 'registrationAt',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          width: 120,
          key: 'handle',
          options: ['upgrade', 'staff']
        }
      ],
      genderEnum: [
        { label: '男', value: '1' },
        { label: '女', value: '2' },
        { label: '未知', value: '0' }
      ],
      communityEnum: [
        { label: '是', value: 'YES' },
        { label: '否', value: 'NO' }
      ],
      userEnum: [
        { label: '普通用户', value: 'CONSUMER' },
        { label: '员工特权', value: 'STAFF' }
      ],
      whiteListEnum,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      userDetail: _.cloneDeep(userDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    getTableData() {
      getUsersInfo(this.searchRowData)
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
    startTimeChange(value, date) {
      this.searchRowData.regBeginTime = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.regEndTime = value;
    },
    onUpgrade(params) {
      this.userDetail = _.cloneDeep(params.row);
      this.userDetail.userClass = params.row.userClass === 'EXTERIOR' || params.row.userClass == null ? 'INTERIOR' : 'EXTERIOR';
      setUserClass(this.userDetail)
        .then((res) => {
          this.$Message.info('操作成功');
          this.getTableData();
        })
    },
    onStaff(params) {
      const rows = params.row;
      const _this = this;
      rows.topStatus = 'manage';
      this.userDetail = _.cloneDeep(params.row);
      this.userDetail.userType = params.row.userType === 'CONSUMER' ? 'STAFF' : 'CONSUMER';
      setStaff(this.userDetail)
        .then((res) => {
          this.$Message.info('操作成功');
          this.getTableData();
          if (this.userDetail.userType === 'STAFF') {
            setTimeout(function() {
              setSmallGoodsStandard(rows);
              _this.turnToPage({
                name: 'small-member-relation-handCheck'
              });
            }, 2000);
          }
        })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
