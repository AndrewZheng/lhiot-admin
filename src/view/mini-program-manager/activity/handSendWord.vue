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
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
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
            <Input
              v-model="searchRowData.userName"
              placeholder="领取用户名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.wordKeyName"
              placeholder="集字名称"
              class="search-input mr5"
              style="width: 80px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.receiveSource"
              placeholder="领取来源"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in receiveSourceEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.isConvertCoupon"
              placeholder="是否兑换券"
              style="padding-right: 5px;width: 110px"
              clearable
            >
              <Option
                v-for="(item,index) in isConvertCouponEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px;width: 110px"
              >
                {{ item.label }}
              </Option>
            </Select>
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
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addSendWord">
            <Icon type="md-add" />手动发字
          </Button>
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
    <!-- 集字配置列表 -->
    <Modal v-model="modalCollectWord" :width="800" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ "手动发字配置" }}</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            ref="collectWordTemplate"
            v-model="collectWordData"
            :columns="collectWordColumns"
            highlight-row
            border
            searchable
            search-place="top"
            @on-current-change="handleTemplateChange"
          ></tables>
        </Row>
      </div>
      <Divider orientation="center">
        填写发送对象手机号
      </Divider>
      <Form ref="modalSendWord" :model="sendWordToPhone" :label-width="170" :rules="ruleInline">
        <Row>
          <i-col span="15">
            <Row class-name="mb10">
              <FormItem label="请输入用户手机号码:" prop="phones">
                <Input
                  v-model="sendWordToPhone.phones"
                  :autosize="{minRows: 3,maxRows: 8}"
                  clearable
                  type="textarea"
                  style="width: 450px;"
                  placeholder="请输入需发字手机号码，多个号码用英文逗号分隔"
                ></Input>
              </FormItem>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="10">
            <FormItem label="发送数量:" prop="quantity">
              <InputNumber v-model="sendWordToPhone.quantity" clearable style="width: 80px"></InputNumber>
            </FormItem>
          </i-col>
        </Row>
      </Form>*Tips：请输入需发券手机号码，多个号码用
      <b style="color:red">英文逗号</b>
      分隔
      <Row v-show="failPhone.length > 0" class="mt10">
        <i-col span="6">
          发送失败手机号：
        </i-col>
        <i-col span="22" class="brand-red">
          {{ failPhone.join(',') }}
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="handleAddClose">
          关闭
        </Button>
        <Button type="primary" @click="handleSendWordAdd('modalSendWord')">
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
  getCollectWordPages,
  editActivities,
  createActivities,
  getCollectWordRecord,
  sendCollectWord
} from '@/api/mini-program';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';

const collectWordDetail = {
  collectWordSettingId: '',
  giveCollectWordId: '',
  giveReceiveTime: '',
  giveStatus: '',
  giveUserId: '',
  giveUserName: '',
  isConvertCoupon: '',
  receiveSource: '',
  receiveTime: '',
  userId: '',
  userName: '',
  wordKeyName: ''
};

const sendWordToPhone = {
  quantity: 0,
  phone: '',
  wordKeyName: '',
  id: null,
  phones: null
};

const roleRowData = {
  wordKeyName: '',
  userNamel: '',
  giveUserName: '',
  receiveSource: '',
  isConvertCoupon: '',
  page: 1,
  rows: 10,
  sidx: 'receiveTime',
  sort: 'desc'
};

export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        quantity: [
          { required: true, message: '请输入发送数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        phones: [
          {
            required: true,
            message: '请输入需发券手机号码，多个号码用英文逗号分隔'
          }
        ]
      },
      columns: [
        {
          title: '字ID',
          align: 'center',
          key: 'id',
          width: 80
        },
        {
          title: '集字名称',
          align: 'center',
          key: 'wordKeyName',
          minWidth: 30
        },
        {
          title: '来源',
          align: 'center',
          minWidth: 20,
          key: 'receiveSource',
          render(h, params, vm) {
            const { row } = params;
            if (row.receiveSource === 'GIVE') {
              return (
                <div>
                  <tag color='green'>{'赠送'}</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='gold'>{'获取'}</tag>
                </div>
              );
            }
          }
        },
        {
          title: '领取时间',
          align: 'center',
          key: 'receiveTime',
          minWidth: 90
        },
        {
          title: '领取用户名称',
          align: 'center',
          key: 'userName',
          minWidth: 200
        },
        {
          title: '用户手机',
          align: 'center',
          key: 'phone',
          minWidth: 70
        },
        {
          title: '用户ID',
          align: 'center',
          key: 'userId',
          minWidth: 60
        },
        // {
        //   title: "状态",
        //   align: "center",
        //   key: "giveStatus",
        //   minWidth: 30,
        //   render(h, params, vm) {
        //     const { row } = params;
        //     if (!row.giveStatus) {
        //       return (
        //         <div>
        //           <tag color="orange">{"自己领取"}</tag>
        //         </div>
        //       );
        //     } else if (row.giveStatus === "YES") {
        //       return (
        //         <div>
        //           <tag color="magenta">{"赠送已领取)"}</tag>
        //         </div>
        //       );
        //     } else if (row.giveStatus === "NO") {
        //       return (
        //         <div>
        //           <tag color="gold">{"赠送未领取)"}</tag>
        //         </div>
        //       );
        //     }
        //   },
        // },
        {
          title: '是否兑换券',
          align: 'center',
          minWidth: 30,
          key: 'isConvertCoupon',
          render(h, params, vm) {
            const { row } = params;
            if (row.isConvertCoupon === 'YES') {
              return (
                <div>
                  <tag color='cyan'>{'是'}</tag>
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
        }
      ],
      collectWordColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '活动ID',
          align: 'center',
          key: 'activitySettingId',
          minWidth: 5
        },
        {
          title: '字ID',
          align: 'center',
          key: 'id',
          minWidth: 5
        },
        {
          title: '集字名称',
          align: 'center',
          key: 'wordKeyName',
          minWidth: 5
        },
        {
          title: '集字发放比例',
          align: 'center',
          key: 'wordKeyScale',
          minWidth: 5
        },
        {
          title: '排序',
          align: 'center',
          key: 'rank',
          minWidth: 5
        }
      ],
      receiveSourceEnum: [
        { label: '赠送', value: 'GIVE' },
        { label: '获取', value: 'GET' }
      ],
      giveStatusEnum: [
        { label: '赠送已领取', value: 'YES' },
        { label: '赠送未领取', value: 'NO' }
      ],
      isConvertCouponEnum: [
        { label: '是', value: 'YES' },
        { label: '否', value: 'NO' }
      ],
      collectWordData: [],
      createLoading: false,
      modalViewLoading: false,
      modalCollectWord: false,
      failPhone: [],
      searchRowData: _.cloneDeep(roleRowData),
      collectWordDetail: _.cloneDeep(collectWordDetail),
      sendWordToPhone: _.cloneDeep(sendWordToPhone)
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
    resetFields() {
      this.$refs.modalEdit.resetFields();
    },
    getTableData() {
      this.loading = true;
      getCollectWordPages(this.searchRowData)
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
    getCollectWordRecord() {
      getCollectWordRecord()
        .then((res) => {
          this.collectWordData = res;
        })
    },
    handleAddClose() {
      this.modalCollectWord = false;
    },
    handleTemplateChange(currentRow, oldCurrentRow) {
      const currentTemplate = currentRow;
      this.sendWordToPhone.id = currentTemplate.id;
    },
    addSendWord() {
      (this.sendWordToPhone = _.cloneDeep(sendWordToPhone)),
      (this.failPhone = []),
      this.getCollectWordRecord();
      this.modalCollectWord = true;
    },
    handleSendWordAdd(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (!this.sendWordToPhone.id) {
            this.$Message.info('请先选中一条集字数据!');
          } else {
            this.sendCollectWord();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    // 发送集字
    sendCollectWord() {
      sendCollectWord(this.sendWordToPhone)
        .then((res) => {
          console.log('res', res);
          if (res === '用户不存在') {
            return;
          }
          if (res.body.fail.length > 0) {
            this.$Message.error('部分用户发送失败！');
            this.sendWordToPhone.phones = '';
            this.failPhone = res.body.fail;
            this.getTableData();
          } else {
            this.$Message.success('发送成功!');
            this.modalCollectWord = false;
            this.getTableData();
          }
        })
        .catch((error) => {});
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
