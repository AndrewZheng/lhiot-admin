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
        @on-delete="handleDelete"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-sale="switchStatus"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-relevance="handleSetting"
      >
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="addRegisterReward">
            <Icon type="md-add" />添加
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />批量删除
            </Button>
          </Poptip>
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

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>注册送礼活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6"> 活动ID: </i-col>
              <i-col span="18">
                {{ registerDetail.id }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6"> 活动名称: </i-col>
              <i-col span="18">
                {{ registerDetail.activityName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6"> 活动状态: </i-col>
              <i-col span="18">
                {{ registerDetail.onOff | imageStatusFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">领券方式:</i-col>
              <i-col span="18">{{ registerDetail.receiveType | imageStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>-->
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6"> 开始时间: </i-col>
              <i-col span="18">
                {{
                  (this.registerDetail.beginTime = this.$moment(
                    this.registerDetail.beginTime
                  ).format("YYYY-MM-DD HH:mm:ss"))
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6"> 结束时间: </i-col>
              <i-col span="18">
                {{
                  (this.registerDetail.endTime = this.$moment(
                    this.registerDetail.endTime
                  ).format("YYYY-MM-DD HH:mm:ss"))
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6"> 创建人: </i-col>
              <i-col span="18">
                {{ registerDetail.createBy }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6"> 创建时间: </i-col>
              <i-col span="18">
                {{ registerDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6"> 活动规则: </i-col>
              <i-col span="18">
                <Input
                  :v-if="registerDetail.activityRule"
                  :rows="6"
                  :value="registerDetail.activityRule"
                  type="textarea"
                ></Input>
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose"> 关闭 </Button>
      </div>
    </Modal>

    <Modal
      v-model="modalEdit"
      :width="800"
      :z-index="1000"
      :mask-closable="false"
    >
      <p slot="header">
        <i-col>
          {{
            tempModalType === modalType.edit
              ? "修改注册送礼优惠券活动"
              : "创建注册送礼优惠券活动"
          }}
        </i-col>
      </p>
      <div class="modal-content">
        <Row>
          <Form
            ref="editForm"
            :model="registerDetail"
            :rules="ruleInline"
            :label-width="90"
          >
            <Row>
              <Col span="18">
              <FormItem label="活动名称:" prop="activityName">
                <Input
                  v-model="registerDetail.activityName"
                  style="width: 170px"
                ></Input>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
              <FormItem label="活动状态:" prop="onOff">
                <Select
                  v-model="registerDetail.onOff"
                  clearable
                  style="width: 170px"
                >
                  <Option
                    v-for="(item, index) in imageStatusEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px; width: 170px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <!-- 领券方式 -->
            <Row>
              <Col span="18">
              <FormItem label="领券方式:" prop="receiveType">
                <Select
                  v-model="registerDetail.receiveType"
                  clearable
                  style="width: 170px"
                >
                  <Option
                    v-for="(item, index) in receiveTypeEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px; width: 170px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
              <FormItem label="有效期起:" prop="beginTime">
                <DatePicker
                  v-model="registerDetail.beginTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="有效期起"
                  class="search-input"
                  style="width: 170px"
                  :readonly="editStatus"
                  @on-change="beginTimeChange"
                />
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
              <FormItem label="有效期止:" prop="endTime">
                <DatePicker
                  v-model="registerDetail.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="有效期止"
                  class="search-input"
                  style="width: 170px"
                  :readonly="editStatus"
                  @on-change="endTimeChange"
                />
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
              <FormItem label="活动规则:" prop="activityRule">
                <Input
                  v-model="registerDetail.activityRule"
                  :rows="6"
                  placeholder="活动规则"
                  type="textarea"
                ></Input>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose"> 关闭 </Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  getRegisterPages,
  deleteRegister,
  createRegister,
  editRegister
} from '@/api/mini-program';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { imageStatusConvert, receiveTypeConvert } from '@/libs/converStatus';
import { imageStatusEnum, receiveTypeEnum } from '@/libs/enumerate';
import {
  compareData,
  setSmallCouponActivity,
  compareCouponData
} from '@/libs/util';

const registerDetail = {
  formBeginTime: null,
  formEndTime: null,
  id: 0,
  activityId: 0,
  beginTime: null,
  endTime: null,
  onOff: null,
  activityName: '',
  activityRule: '',
  createTime: null,
  updateTime: null,
  createBy: '',
  receiveType: 'MANUAL'
};

const roleRowData = {
  page: 1,
  rows: 10,
  sidx: 'endTime',
  sort: 'desc'
};

const relationRowData = {
  activityRegisterId: 0,
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
      ruleInline: {
        activityName: [
          { required: true, message: '请输入活动名称' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 20) {
                errors.push(new Error('字数限制20字'));
              }
              callback(errors);
            }
          }
        ],
        activityRule: [
          { required: true, message: '请输入活动规则' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 200) {
                errors.push(new Error('字数限制200字'));
              }
              callback(errors);
            }
          }
        ],
        onOff: [
          { required: true, message: '请选择活动状态' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 200) {
                errors.push(new Error('字数限制200字'));
              }
              callback(errors);
            }
          }
        ],
        beginTime: [{ required: true, message: '请选择活动开始时间' }],
        endTime: [{ required: true, message: '请选择活动结束时间' }],
        receiveType: [{ required: true, message: '请选择活动结束时间' }]
      },
      defaultListMain: [],
      uploadListMain: [],
      imageStatusEnum,
      receiveTypeEnum,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          align: 'center',
          key: 'id',
          minWidth: 50
        },
        {
          title: '活动名称',
          align: 'center',
          key: 'activityName',
          minWidth: 130
        },
        {
          title: '活动规则',
          key: 'activityRule',
          align: 'center',
          minWidth: 130,
          tooltip: true
        },
        {
          title: '开始时间',
          align: 'center',
          key: 'beginTime',
          minWidth: 160
        },
        {
          title: '结束时间',
          align: 'center',
          key: 'endTime',
          minWidth: 200,
          render: (h, params, vm) => {
            const { row } = params;
            if (!compareCouponData(row.endTime)) {
              return <div style='color:red'>{row.endTime + '已过期'}</div>;
            } else {
              return <div>{row.endTime}</div>;
            }
          }
        },
        {
          title: '活动状态',
          align: 'center',
          key: 'onOff',
          minWidth: 90,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.onOff === 'ON') {
              return (
                <div>
                  <tag color='success'>
                    {imageStatusConvert(row.onOff).label}
                  </tag>
                </div>
              );
            } else if (row.onOff === 'OFF') {
              return (
                <div>
                  <tag color='error'>{imageStatusConvert(row.onOff).label}</tag>
                </div>
              );
            }
            return <div>{row.onOff}</div>;
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 200,
          key: 'handle',
          options: ['onSale', 'view', 'edit', 'delete', 'settings']
        }
      ],
      addTempDataLoading: false,
      tempTableLoading: false,
      templateLoading: false,
      modalViewLoading: false,
      modalRelation: false,
      editStatus: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRelationRowData: _.cloneDeep(relationRowData),
      registerDetail: _.cloneDeep(registerDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRelationRowData = _.cloneDeep(relationRowData);
      this.getTableData();
    },
    resetFields() {
      if (this.tempModalType == null) {
        this.$refs.modalCreate.resetFields();
      }
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (
            compareData(
              this.registerDetail.beginTime,
              this.registerDetail.endTime
            )
          ) {
            this.$Message.error('结束时间必须大于开始时间!');
            return;
          }
          // 活动规则换行用“&”拼接
          if (
            this.registerDetail.activityRule !== null ||
            this.registerDetail.activityRule !== ''
          ) {
            this.registerDetail.activityRule = this.registerDetail.activityRule.replace(
              /\n|\r/g,
              '&'
            );
          }
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createRegister();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editRegister();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createRegister() {
      this.modalViewLoading = true;
      if (this.registerDetail.beginTime.indexOf('T') > -1) {
        this.registerDetail.beginTime = this.$moment(
          this.registerDetail.beginTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.registerDetail.endTime.indexOf('T') > -1) {
        this.registerDetail.endTime = this.$moment(
          this.registerDetail.endTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      createRegister(this.registerDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editRegister() {
      this.modalViewLoading = true;
      // UTC通用时间标准 2019-06-19T16:00:00.000Z转换为正常格式

      this.registerDetail.beginTime = this.$moment(
        this.registerDetail.beginTime
      ).format('YYYY-MM-DD HH:mm:ss');

      this.registerDetail.endTime = this.$moment(
        this.registerDetail.endTime
      ).format('YYYY-MM-DD HH:mm:ss');

      // if (this.registerDetail.beginTime.indexOf("T") > -1) {
      //   this.registerDetail.beginTime = this.$moment(
      //     this.registerDetail.beginTime
      //   ).format("YYYY-MM-DD HH:mm:ss");
      // }
      // if (this.registerDetail.endTime.indexOf("T") > -1) {
      //   this.registerDetail.endTime = this.$moment(
      //     this.registerDetail.endTime
      //   ).format("YYYY-MM-DD HH:mm:ss");
      // }
      editRegister(this.registerDetail)
        .then((res) => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addRegisterReward() {
      this.editStatus = false;
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.registerDetail = _.cloneDeep(registerDetail);
      }
      this.resetFields();
      this.modalEdit = true;
    },
    handleSetting(params) {
      var rows = params.row;
      setSmallCouponActivity(rows);
      this.turnToPage({
        name: 'small-vip-activities-associated'
      });
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    deleteTable(ids) {
      deleteRegister({
        ids
      }).then((res) => {
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
      });
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.registerDetail = _.cloneDeep(params.row);
      this.registerDetail.activityRule = this.registerDetail.activityRule.replace(
        /&/g,
        '\n'
      );
      this.modalView = true;
    },
    handleEdit(params) {
      this.editStatus = !compareCouponData(params.row.beginTime);
      this.tempModalType = this.modalType.edit;
      this.resetFields();
      this.registerDetail = _.cloneDeep(params.row);
      this.registerDetail.activityRule = this.registerDetail.activityRule.replace(
        /&/g,
        '\n'
      );
      this.modalEdit = true;
    },
    getTableData() {
      this.loading = true;
      getRegisterPages(this.searchRowData)
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
    switchStatus(params) {
      this.registerDetail = _.cloneDeep(params.row);
      if (params.row.onOff === 'ON') {
        this.registerDetail.onOff = 'OFF';
      } else {
        this.registerDetail.onOff = 'ON';
      }
      this.loading = true;
      this.editRegister();
    },
    beginTimeChange(value, date) {
      this.registerDetail.beginTime = value;
      if (this.registerDetail.beginTime.indexOf('T') > -1) {
        this.registerDetail.beginTime = this.$moment(
          this.registerDetail.beginTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    endTimeChange(value, date) {
      this.registerDetail.endTime = value;
      if (this.registerDetail.endTime.indexOf('T') > -1) {
        this.registerDetail.endTime = this.$moment(
          this.registerDetail.endTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
