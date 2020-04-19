<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="18"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-edit="handleEdit"
        @on-sale="handleStatus"
        @on-relevance="handleSetting"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <!-- @on-delete="handleDelete" -->
        <div slot="searchCondition">
          <Row>
            <Select
              v-model="searchRowData.activityType"
              class="search-col mr5"
              placeholder="活动类型"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in activityTypeEnum"
                :value="item.value"
                :key="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.vaild"
              class="search-col mr5"
              placeholder="活动状态"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in activityStatusEnum"
                :value="item.value"
                :key="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.startTimeBegin"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="活动开始时间起"
              class="mr5"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.startTimeEnd"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="活动开始时间止"
              class="mr5"
              style="width: 150px"
              @on-change="endTimeChange"
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
              class="search-btn"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
            <div class="ml15 mt10">
              <i style="color:red">*</i> 设置活动时间后,不可修改
            </div>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="handleCreate">
            <Icon type="md-add" />添加
          </Button>
          <!-- <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="handleBatchDel"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />批量删除
            </Button>
          </Poptip>-->
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            :page-size="searchRowData.rows"
            :page-size-opts="templatePageOpts"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalEdit" :mask-closable="false" :z-index="1000" :width="750">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改活动':'创建活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="activityDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <i-col span="12">
              <FormItem
                v-show="tempModalType===modalType.create"
                label="活动类型:"
                prop="activityType"
                style="width:260px;"
              >
                <Select v-model="activityDetail.activityType">
                  <Option
                    v-for="(item,index) in activityTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100%"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem
                v-show="tempModalType===modalType.edit"
                label="活动类型:"
                prop="activityType"
              >{{ activityDetail.activityType | pfActivityTypeFilter }}</FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="活动状态:" prop="vaild" style="width:260px;">
                <Select v-model="activityDetail.vaild">
                  <Option
                    v-for="(item,index) in activityStatusEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100%"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem v-show="tempModalType===modalType.create" label="开始时间:" prop="startTime">
                <DatePicker
                  :value="activityDetail.startTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="生效时间"
                  style="width: 160px"
                  @on-change="handleStartTimeChange"
                />
              </FormItem>
              <FormItem v-show="tempModalType===modalType.edit" label="开始时间:" prop="startTime">
                <DatePicker
                  :value="activityDetail.startTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="生效时间"
                  style="width: 160px"
                  disabled
                />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem v-show="tempModalType===modalType.create" label="结束时间:" prop="endTime">
                <DatePicker
                  :value="activityDetail.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束时间"
                  style="width: 160px"
                  @on-change="handleEndTimeChange"
                />
              </FormItem>
              <FormItem v-show="tempModalType===modalType.edit" label="结束时间:" prop="endTime">
                <DatePicker
                  :value="activityDetail.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束时间"
                  style="width: 160px"
                  disabled
                />
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="20">
              <FormItem label="活动链接:" prop="linkUrl">
                <Input v-model="activityDetail.linkUrl" placeholder="http://"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="20">
              <FormItem label="活动描述:" prop="activityDesc">
                <Input
                  v-model="activityDetail.activityDesc"
                  :autosize="{minRows: 2,maxRows: 6}"
                  type="textarea"
                  placeholder="请输入活动描述..."
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  deletActivity,
  getActivityPages,
  editActivity,
  createActivity
} from '@/api/wholesale';
import tableMixin from '@/mixins/tableMixin.js';
import {
  activityStatusConvert,
  activityTypeConvert
} from '@/libs/converStatus';
import { activityTypeEnum, activityStatusEnum } from '@/libs/enumerate';
import { setActivity, compareCouponData } from '@/libs/util';

const activityDetail = {
  activityCode: '',
  activityDesc: '',
  activityType: '',
  linkUrl: '',
  vaild: '',
  endTime: null,
  startTime: null,
  startTimeBegin: '',
  startTimeEnd: '',
  id: ''
};

const roleRowData = {
  activityCode: null,
  activityDesc: null,
  vaild: '',
  startTimeBegin: '',
  startTimeEnd: '',
  endTime: null,
  startTime: null,
  page: 1,
  rows: 20,
  sidx: 'endTime',
  sort: 'desc'
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      activityTypeEnum,
      templatePageOpts: [20, 50],
      activityStatusEnum,
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      activityDetail: _.cloneDeep(activityDetail),
      ruleInline: {
        activityType: [{ required: true, message: '请选择活动类型' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        vaild: [{ required: true, message: '请选择活动状态' }]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '活动ID',
          align: 'center',
          key: 'id',
          maxWidth: 80
        },
        {
          title: '活动类型',
          align: 'center',
          key: 'activityType',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.activityType === 'flashsale') {
              return (
                <div>
                  <tag color='primary'>限时抢购</tag>
                </div>
              );
            } else if (row.activityType === 'registration') {
              return (
                <div>
                  <tag color='pink'>注册送礼</tag>
                </div>
              );
            } else if (row.activityType === 'recharge') {
              return (
                <div>
                  <tag color='green'>充值活动</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='primary'>N/A</tag>
                </div>
              );
            }
          }
        },
        {
          title: '开始时间',
          align: 'center',
          key: 'startTime'
        },
        {
          title: '结束时间',
          align: 'center',
          key: 'endTime',
          width: '220',
          render: (h, params, vm) => {
            const { row } = params;
            if (!compareCouponData(row.endTime)) {
              return <div style='color:red'>{row.endTime + '　已过期'}</div>;
            } else {
              return <div>{row.endTime}</div>;
            }
          }
        },
        // {
        //   title: "活动链接",
        //   align: "center",
        //   key: "linkUrl",
        //   minWidth: 150
        // },
        {
          title: '活动描述',
          align: 'center',
          key: 'activityDesc'
        },
        {
          title: '活动状态',
          align: 'center',
          key: 'vaild',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.vaild === 'yes') {
              return (
                <div>
                  <tag color='success'>有效</tag>
                </div>
              );
            } else if (row.vaild === 'no') {
              return (
                <div>
                  <tag color='error'>无效</tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>N/A</tag>
              </div>
            );
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 80,
          key: 'handle',
          options: ['onSale', 'edit', 'settings']
        }
      ]
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    getTableData() {
      getActivityPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleSetting(params) {
      // if (params.row.vaild == "yes") {
      //   this.$Message.error("活动有效期内不允许修改!");
      //   return;
      // }
      setActivity(params.row);
      let pageName = 'wholesale-activity';
      switch (params.row.activityType) {
        case 'flashsale':
          pageName = 'wholesale-flashsale';
          break;
        case 'registration':
          pageName = 'wholesale-register-reward';
          break;
        case 'recharge':
          pageName = 'wholesale-recharge';
          break;
      }
      this.turnToPage({
        name: pageName,
        params: { activityId: params.row.id }
      });
    },
    handleCreate() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.activityDetail = _.cloneDeep(activityDetail);
      }
      this.modalEdit = true;
    },
    handleEdit(params) {
      // if (params.row.vaild == "yes") {
      //   this.$Message.error("活动有效期内不允许修改!");
      //   return;
      // }
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.activityDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleStatus(params) {
      console.log('选中数据', params.row.activityType, params.row.vaild);
      let flashsaleIndex = 0;
      let registrationIndex = 0;
      let rechargeIndex = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        if (
          params.row.activityType === 'flashsale' &&
          params.row.vaild === 'no'
        ) {
          if (
            this.tableData[i].activityType === 'flashsale' &&
            this.tableData[i].vaild === 'yes' &&
            compareCouponData(this.tableData[i].endTime) === true
          ) {
            flashsaleIndex++;
          }
          if (flashsaleIndex === 2) {
            this.$Message.info('已有2个有效且开启中的限时抢购活动!');
            return;
          }
        }
        if (
          params.row.activityType === 'registration' &&
          params.row.vaild === 'no'
        ) {
          if (
            this.tableData[i].activityType === 'registration' &&
            this.tableData[i].vaild === 'yes' &&
            compareCouponData(this.tableData[i].endTime) === true
          ) {
            registrationIndex++;
          }
          if (registrationIndex === 1) {
            this.$Message.info('已有1个有效且开启中的注册送礼活动!');
            return;
          }
        }
        if (
          params.row.activityType === 'recharge' &&
          params.row.vaild === 'no'
        ) {
          if (
            this.tableData[i].activityType === 'recharge' &&
            this.tableData[i].vaild === 'yes' &&
            compareCouponData(this.tableData[i].endTime) === true
          ) {
            rechargeIndex++;
          }
          if (rechargeIndex === 1) {
            this.$Message.info('已有1个有效且开启中的充值送礼活动!');
            return;
          }
        }
      }
      this.activityDetail = _.cloneDeep(params.row);
      this.activityDetail.vaild = params.row.vaild === 'yes' ? 'no' : 'yes';
      this.editActivity();
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        let flashsaleIndex = 0;
        let registrationIndex = 0;
        let rechargeIndex = 0;
        if (valid) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.activityDetail.activityType === 'flashsale' &&
              this.activityDetail.vaild === 'yes'
            ) {
              if (
                this.tableData[i].activityType === 'flashsale' &&
                this.tableData[i].vaild === 'yes' &&
                compareCouponData(this.tableData[i].endTime) === true
              ) {
                flashsaleIndex++;
              }
              if (flashsaleIndex === 2) {
                this.$Message.info('已有2个有效且开启中的限时抢购活动!');
                return;
              }
            }
            if (
              this.activityDetail.activityType === 'registration' &&
              this.activityDetail.vaild === 'yes'
            ) {
              if (
                this.tableData[i].activityType === 'registration' &&
                this.tableData[i].vaild === 'yes' &&
                compareCouponData(this.tableData[i].endTime) === true
              ) {
                registrationIndex++;
              }
              if (registrationIndex === 1) {
                this.$Message.info('已有1个有效且开启中的注册送礼活动!');
                return;
              }
            }
            if (
              this.activityDetail.activityType === 'recharge' &&
              this.activityDetail.vaild === 'yes'
            ) {
              if (
                this.tableData[i].activityType === 'recharge' &&
                this.tableData[i].vaild === 'yes' &&
                compareCouponData(this.tableData[i].endTime) === true
              ) {
                rechargeIndex++;
              }
              if (rechargeIndex === 1) {
                this.$Message.info('已有1个有效且开启中的充值送礼活动!');
                return;
              }
            }
          }
          if (this.isCreate) {
            this.createActivity();
          } else if (this.isEdit) {
            this.editActivity();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createActivity() {
      this.modalViewLoading = true;
      this.activityDetail.id = '';
      createActivity(this.activityDetail)
        .then(res => {
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    editActivity() {
      this.modalViewLoading = true;
      editActivity(this.activityDetail)
        .then(res => {
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    startTimeChange(value, date) {
      this.searchRowData.startTimeBegin = value;
    },
    endTimeChange(value, data) {
      this.searchRowData.startTimeEnd = value;
    },
    handleStartTimeChange(value, date) {
      this.activityDetail.startTime = value;
    },
    handleEndTimeChange(value, data) {
      this.activityDetail.endTime = value;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
      this.activityDetail.storeImage = null;
    },
    deleteTable(ids) {
      this.loading = true;
      deletActivity({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length == this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
