<template>
  <div class="m-role">
    <div style="margin-bottom: 30px">
      <div class="tabChange">
        <b
          data-index="source"
          :class="topStatus == 'source' ? 'hot' : ''"
          @click="assistDataChange"
        >用户来源汇总</b>
        <b
          data-index="material"
          :class="topStatus == 'material' ? 'hot' : ''"
          @click="assistDataChange"
        >门店物料用户统计</b>
      </div>
      <Card v-show="topStatus === 'source'">
        <tables
          ref="tableDatas"
          v-model="tableData"
          :columns="dataColumns"
          :loading="loading"
          :search-area-column="22"
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
                <Radio label="昨日"></Radio>
                <Radio label="今日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div v-show="mark === true" class="mark">
                <DatePicker
                  v-model="searchRowData.beginDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义开始时间"
                  class="search-input"
                  style="width: 150px"
                  @on-change="startTimeChange"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchRowData.endDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义结束时间"
                  class="search-input mr5"
                  style="width: 150px"
                  @on-change="endTimeChange"
                />
              </div>
              <Button
                v-show="mark === true"
                class="search-btn mr5"
                type="primary"
                @click="handleSearch"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                class="search-btn mr2"
                type="warning"
                @click="handleDownload('userSource')"
              >
                <Icon type="md-download" />导出数据
              </Button>
            </Row>
            <div class="ml15 mt10">
              <i style="color: red">*</i> 默认展示当天的数据
            </div>
          </div>
        </tables>
      </Card>
      <Card v-show="topStatus === 'material'">
        <tables
          ref="tables1"
          v-model="tableDataMaterial"
          :columns="columnsMaterial"
          :loading="loading"
          :search-area-column="24"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
          @on-sort-change="onSortChange"
          @on-view="handleView"
          @on-edit="handleEdit"
          @on-delete="handleDelete"
        >
          <div slot="searchCondition">
            <Row>
              <RadioGroup
                v-model="buttonMaterial"
                type="button"
                @on-change="timeChangeMaterial"
              >
                <Radio label="昨日"></Radio>
                <Radio label="今日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div v-show="markMaterial === true" class="mark">
                <DatePicker
                  :value="searchRowDataMaterial.createTimeBegin"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义开始时间"
                  class="search-input"
                  style="width: 150px"
                  @on-change="searchRowDataMaterial.createTimeBegin = $event"
                />
                <i>-</i>
                <DatePicker
                  :value="searchRowDataMaterial.createTimeEnd"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义结束时间"
                  class="search-input mr5"
                  style="width: 150px"
                  @on-change="searchRowDataMaterial.createTimeEnd = $event"
                />
              </div>
              <Select
                v-model="searchRowDataMaterial.sidx"
                placeholder="排序"
                style="width: 120px"
                @on-change="handRankType"
              >
                <Option
                  v-for="(item, index) in rankType"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="width: 100px"
                >
                  {{ item.label }}
                </Option>
              </Select>
              <Input
                v-model="searchRowDataMaterial.materielName"
                placeholder="物料名称"
                class="search-input"
                style="width: 170px"
                clearable
              ></Input>
              <Input
                v-model="searchRowDataMaterial.storeName"
                placeholder="门店名称"
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
              <Button
                v-waves
                :loading="createLoading"
                type="success"
                @click="addStoreMateriel"
              >
                <Icon type="md-add" />添加
              </Button>
              <Button
                class="search-btn"
                type="warning"
                @click="handleDownload('material')"
              >
                <Icon type="md-download" />导出
              </Button>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px; overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="totalPage"
              :current="searchRowDataMaterial.page"
              show-sizer
              show-total
              @on-change="changePageMaterial"
              @on-page-size-change="changePageSize2"
            ></Page>
          </Row>
        </div>
      </Card>
    </div>
    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>查看门店物料详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                ID:
              </i-col>
              <i-col span="18">
                {{ storeMaterielDetail.id }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                物料名称:
              </i-col>
              <i-col span="18">
                {{ storeMaterielDetail.materielName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                门店名称:
              </i-col>
              <i-col span="18">
                {{ storeMaterielDetail.storeName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                页面路径:
              </i-col>
              <i-col span="18">
                {{ storeMaterielDetail.pagePath }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                创建时间:
              </i-col>
              <i-col span="18">
                {{ storeMaterielDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                二维码:
              </i-col>
              <i-col v-show="storeMaterielDetail.qrCodePath" span="18">
                <div
                  class="demo-upload-list"
                  style="width: 300px; height: 300px"
                >
                  <img :src="storeMaterielDetail.qrCodePath">
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">
          关闭
        </Button>
      </div>
    </Modal>
    <Modal
      v-model="modalEdit"
      :mask-closable="false"
      :z-index="1000"
      :width="800"
    >
      <p slot="header">
        <i-col>
          {{
            tempModalType === modalType.edit ? "修改门店物料" : "创建门店物料"
          }}
        </i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="modalEdit"
          :model="storeMaterielDetail"
          :rules="ruleInline"
          :label-width="100"
        >
          <Row>
            <Col span="22">
            <FormItem label="物料名称:" prop="materielName">
              <Input v-model="storeMaterielDetail.materielName"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
            <FormItem label="页面路径:" prop="pagePath">
              <Input v-model="storeMaterielDetail.pagePath"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row v-if="tempModalType === modalType.edit">
            <Col span="22">
            <FormItem label="已关联门店:" prop="storeName">
              {{
                storeMaterielDetail.storeName
              }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
            <FormItem
              :label="
                tempModalType === modalType.edit ? '更换门店:' : '关联门店:'
              "
              prop="storeId"
            >
              <Select
                v-model="storeMaterielDetail.storeId"
                class="search-col"
                :placeholder="
                  tempModalType === modalType.edit
                    ? '请选择需更换的门店'
                    : '请选择需关联的门店'
                "
                :label-in-value="true"
                :filterable="true"
                @on-change="handleStoreId"
              >
                <Option
                  v-for="item in storeList"
                  :key="`search-col-${item.value}`"
                  style="padding: 0 8px"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">
          关闭
        </Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit('modalEdit')"
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
  userSourceRecordTotal,
  getStoreMateriel,
  getStorePages,
  storeMaterielCreate,
  storeMaterielUpdate,
  deleteMateriel,
  getStoreMaterielDel
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from '@/libs/util';

const storeMaterielDetail = {
  amountPayableCount: 0,
  conversionRate: '',
  createTimeBegin: '',
  createTimeEnd: '',
  loseRate: '',
  loseUserCount: 0,
  materielName: '',
  orderUserCount: 0,
  qrCodePath: '',
  storeCode: '',
  storeId: 0,
  storeName: '',
  userSource: '',
  visitUserCount: 0
};

// 第一个tables
const roleRowData = {
  beginDate: null,
  endDate: null
};

const roleRowDataMaterial = {
  createTimeBegin: '',
  createTimeEnd: '',
  sidx: 'amountPayableCount',
  sort: 'desc',
  materielName: '',
  storeName: '',
  page: 1,
  rows: 10
};
const roleRowDataStore = {
  page: 1,
  rows: -1
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        materielName: [{ required: true, message: '请输入物料名称' }],
        pagePath: [{ required: false, message: '请输入页面路径' }],
        storeId: [{ required: true, message: '请选择关联门店' }]
      },
      mark: false,
      markMaterial: false,
      modalViewLoading: false,
      createLoading: false,
      topStatus: 'source',
      totalPage: 0,
      button: '昨日',
      buttonMaterial: '昨日',
      tableData: [],
      tableDataMaterial: [],
      storeList: [],
      rankType: [
        {
          label: '访问人数',
          value: 'visitUserCount'
        },
        {
          label: '下单人数',
          value: 'orderUserCount'
        },
        {
          label: '转化率',
          value: 'conversionRate'
        },
        {
          label: '跳失人数',
          value: 'loseUserCount'
        },
        {
          label: '跳失率',
          value: 'loseRate'
        },
        {
          label: '交易总额',
          value: 'amountPayableCount'
        }
      ],
      dataColumns: [
        {
          title: '用户来源',
          key: 'userSource',
          align: 'center',
          render(h, params, vm) {
            const { row } = params;
            if (row.userSource === 'FRIEND_CIRCLE') {
              return (
                <div>
                  <tag color='magenta'>{'朋友圈'}</tag>
                </div>
              );
            } else if (row.userSource === 'COMMUNITY') {
              return (
                <div>
                  <tag color='orange'>{'社群'}</tag>
                </div>
              );
            } else if (row.userSource === 'OFFICIAL_ACCOUNT') {
              return (
                <div>
                  <tag color='cyan'>{'公众号'}</tag>
                </div>
              );
            } else if (row.userSource === 'STORE_MATERIEL') {
              return (
                <div>
                  <tag color='blue'>{'门店物料'}</tag>
                </div>
              );
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '访问人数',
          key: 'visitUserCount',
          align: 'center',
          width: '150'
        },
        {
          title: '下单人数',
          key: 'orderUserCount',
          align: 'center'
        },
        {
          title: '转化率',
          align: 'center',
          key: 'conversionRate'
        },
        {
          title: '跳失人数',
          align: 'center',
          key: 'loseUserCount'
        },
        {
          title: '跳失率',
          align: 'center',
          key: 'loseRate'
        },
        {
          title: '交易总额',
          align: 'center',
          key: 'amountPayableCount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.amountPayableCount);
            return <div>{amount}</div>;
          }
        }
      ],
      columnsMaterial: [
        {
          title: '物料名称',
          align: 'center',
          key: 'materielName',
          minWidth: 120
        },
        {
          title: '门店',
          align: 'center',
          key: 'storeName',
          minWidth: 120
        },
        {
          title: '访问人数',
          align: 'center',
          key: 'visitUserCount',
          minWidth: 60,
          sortable: 'custom'
        },
        {
          title: '下单人数',
          align: 'center',
          key: 'orderUserCount',
          minWidth: 60,
          sortable: 'custom'
        },
        {
          title: '转化率',
          align: 'center',
          key: 'conversionRate',
          minWidth: 60,
          sortable: 'custom'
        },
        {
          title: '跳失人数',
          align: 'center',
          key: 'loseUserCount',
          minWidth: 60,
          sortable: 'custom'
        },
        {
          title: '跳失率',
          align: 'center',
          key: 'loseRate',
          minWidth: 60,
          sortable: 'custom'
        },
        {
          title: '交易总额',
          align: 'center',
          sortable: 'custom',
          key: 'amountPayableCount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.amountPayableCount);
            return <div>{amount}</div>;
          },
          minWidth: 60
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 110,
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      searchRowDataStore: _.cloneDeep(roleRowDataStore),
      searchRowDataMaterial: _.cloneDeep(roleRowDataMaterial),
      storeMaterielDetail: _.cloneDeep(storeMaterielDetail)
    };
  },
  computed: {},
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.searchRowDataMaterial = _.cloneDeep(roleRowDataMaterial);
    this.getTableData();
    this.getTableDataMaterial();
    this.getStoreAreaPages();
  },
  created() {},
  methods: {
    resetFields() {
      this.$refs.modalEdit.resetFields();
    },
    getTableData(value) {
      const date = new Date();
      date.setDate(date.getDate());
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var today = `${year}-${month}-${day}`;
      if (value === '昨日' || this.button === '昨日') {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var yesterday = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = yesterday;
        this.searchRowData.endDate = yesterday;
      }
      if (value === '今日') {
        const date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = today;
        this.searchRowData.endDate = today;
      }
      if (value === '最近7天') {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sevenDay = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = sevenDay;
        this.searchRowData.endDate = today;
      }
      if (value === '最近30天') {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var toMonth = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = toMonth;
        this.searchRowData.endDate = today;
      }
      userSourceRecordTotal(this.searchRowData)
        .then((res) => {
          this.tableData = res;
          this.createLoading = false;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getTableDataMaterial(value) {
      const date = new Date();
      date.setDate(date.getDate());
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var today = `${year}-${month}-${day}`;
      if (value === '昨日' || this.buttonMaterial === '昨日') {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var yesterday = `${year}-${month}-${day}`;
        this.searchRowDataMaterial.createTimeBegin = yesterday;
        this.searchRowDataMaterial.createTimeEnd = yesterday;
      }
      if (value === '今日') {
        const date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        this.searchRowDataMaterial.createTimeBegin = today;
        this.searchRowDataMaterial.createTimeEnd = today;
      }
      if (value === '最近7天') {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sevenDay = `${year}-${month}-${day}`;
        this.searchRowDataMaterial.createTimeBegin = sevenDay;
        this.searchRowDataMaterial.createTimeEnd = today;
      }
      if (value === '最近30天') {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var toMonth = `${year}-${month}-${day}`;
        this.searchRowDataMaterial.createTimeBegin = toMonth;
        this.searchRowDataMaterial.createTimeEnd = today;
      }
      this.searchRowDataMaterial.createTimeBegin = this.$moment(
        this.searchRowDataMaterial.createTimeBegin
      ).format('YYYY-MM-DD');
      this.searchRowDataMaterial.createTimeEnd = this.$moment(
        this.searchRowDataMaterial.createTimeEnd
      ).format('YYYY-MM-DD');
      getStoreMateriel(this.searchRowDataMaterial)
        .then((res) => {
          this.tableDataMaterial = res.rows;
          this.totalPage = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    // 获取门店列表
    getStoreAreaPages() {
      getStorePages(this.searchRowDataStore).then((res) => {
        const storeData = [];
        for (const value of res.rows) {
          if (value.storeStatus === 'ENABLED') {
            storeData.push(value);
          }
        }
        storeData.forEach((value) => {
          const map = { label: 'label', value: 'value' };
          map.value = value.storeId;
          map.label = value.storeName + '-' + value.storeCode;
          this.storeList.push(map);
        });
      });
    },
    storeMaterielCreate() {
      this.modalViewLoading = true;
      storeMaterielCreate(this.storeMaterielDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableDataMaterial();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    storeMaterielUpdate() {
      this.modalViewLoading = true;
      storeMaterielUpdate(this.storeMaterielDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('修改成功!');
          this.getTableDataMaterial();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    handleStoreId(value) {
      if (value) {
        const data = value.label.split('-');
        this.storeMaterielDetail.storeCode = data[1];
        this.storeMaterielDetail.storeName = data[0];
      }
    },
    timeChange(value) {
      if (value === '今日') {
        this.getTableData(value);
        this.tableData = [];
        this.mark = false;
      } else if (value === '昨日') {
        this.mark = false;
        this.tableData = [];
        this.getTableData(value);
      } else if (value === '最近7天') {
        this.mark = false;
        this.tableData = [];
        this.getTableData(value);
      } else if (value === '最近30天') {
        this.mark = false;
        this.tableData = [];
        this.getTableData(value);
      } else if (value === '自定义时间') {
        this.mark = true;
        this.searchRowData.beginDate = '';
        this.searchRowData.endDate = '';
      }
    },
    timeChangeMaterial(value) {
      if (value === '今日') {
        this.getTableDataMaterial(value);
        this.markMaterial = false;
      } else if (value === '昨日') {
        this.markMaterial = false;
        this.getTableDataMaterial(value);
      } else if (value === '最近7天') {
        this.markMaterial = false;
        this.getTableDataMaterial(value);
      } else if (value === '最近30天') {
        this.markMaterial = false;
        this.getTableDataMaterial(value);
      } else if (value === '自定义时间') {
        this.markMaterial = true;
        this.searchRowDataMaterial.createTimeBegin = '';
        this.searchRowDataMaterial.createTimeEnd = '';
      }
    },
    startTimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData.beginDate = value;
    },
    endTimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData.endDate = value;
    },
    startTimeChangeMaterial(value, date) {
      this.buttonMaterial = '自定义时间';
      this.searchRowDataMaterial.createTimeBegin = value;
    },
    endTimeChangeMaterial(value, date) {
      this.buttonMaterial = '自定义时间';
      this.searchRowDataMaterial.createTimeEnd = value;
    },
    handleSearch() {
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.tableData = [];
      this.getTableData();
    },
    handleSearchMaterial() {
      this.searchRowDataMaterial.page = 1;
      this.getTableDataMaterial();
    },
    handleClearMaterial() {
      // 重置数据
      this.searchRowDataMaterial = _.cloneDeep(roleRowDataMaterial);
      this.getTableDataMaterial();
    },
    changePageMaterial(page) {
      this.searchRowDataMaterial.page = page;
      this.getTableDataMaterial();
    },
    changePageSize2(pageSize) {
      this.searchRowDataMaterial.page = 1;
      this.searchRowDataMaterial.rows = pageSize;
      this.getTableDataMaterial();
    },
    assistDataChange(e) {
      const index = e.currentTarget.dataset.index;
      if (this.topStatus === index) {
        return;
      }
      this.topStatus = index;
    },
    handRankType() {
      this.searchRowDataMaterial.page = 1;
      this.searchLoading = true;
      this.getTableDataMaterial();
    },
    addStoreMateriel() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.storeMaterielDetail = _.cloneDeep(storeMaterielDetail);
      }

      this.modalEdit = true;
    },
    handleView(params) {
      this.resetFields();
      this.getStoreMaterielDel(params.row.id);
      this.modalView = true;
    },
    getStoreMaterielDel(ids) {
      getStoreMaterielDel({
        ids
      })
        .then((res) => {
          this.storeMaterielDetail = _.cloneDeep(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSortChange(type) {
      this.searchRowDataMaterial.sidx = type.key;
      this.searchRowDataMaterial.sort = type.order;
      this.getTableDataMaterial();
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.storeMaterielDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleDelete(params) {
      this.deleteTable(params.row.id);
    },
    deleteTable(ids) {
      deleteMateriel({
        ids
      })
        .then((res) => {
          this.$Message.success('删除成功!');
          this.getTableDataMaterial();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (
            this.storeMaterielDetail.materielName &&
            this.storeMaterielDetail.pagePath &&
            this.storeMaterielDetail.storeCode &&
            this.storeMaterielDetail.storeId &&
            this.storeMaterielDetail.storeName
          ) {
            if (this.tempModalType === this.modalType.create) {
              // 添加状态
              this.storeMaterielCreate();
            } else if (this.tempModalType === this.modalType.edit) {
              // 编辑状态
              this.storeMaterielUpdate();
            }
          } else {
            this.$Message.error('请完善信息!');
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    handleDownload(name) {
      const _this = this;
      this.searchRowData.beginDate = this.$moment(
        this.searchRowData.beginDate
      ).format('YYYY-MM-DD');
      this.searchRowData.endDate = this.$moment(
        this.searchRowData.endDate
      ).format('YYYY-MM-DD');
      if (name === 'userSource') {
        // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
        userSourceRecordTotal(this.searchRowData).then((res) => {
          const tableData = res;
          // 表格数据导出字段翻译
          tableData.forEach((item) => {
            item['amountPayableCount'] = (
              item['amountPayableCount'] / 100.0
            ).toFixed(2);
            if (item['userSource'] === 'FRIEND_CIRCLE') {
              item['userSource'] = '朋友圈';
            } else if (item['userSource'] === 'COMMUNITY') {
              item['userSource'] = '社群';
            } else if (item['userSource'] === 'OFFICIAL_ACCOUNT') {
              item['userSource'] = '公众号';
            } else {
              item['userSource'] = '门店物料';
            }
          });
          const date = _this.$moment(new Date()).format('YYYYMMDDHHmmss');
          _this.$refs.tableDatas.handleDownload({
            filename: `用户来源汇总数据统计-${date}`,
            data: tableData
          });
        });
      } else {
        this.searchRowDataMaterial.rows =
          this.totalPage > 5000 ? 5000 : this.totalPage;
        const pageSize = this.searchRowDataMaterial.page;
        this.searchRowDataMaterial.page = 1;
        getStoreMateriel(this.searchRowDataMaterial).then((res) => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowDataMaterial.rows = 10;
          this.searchRowDataMaterial.page = pageSize;
          // 表格数据导出字段翻译
          const _this = this;
          tableData.forEach((item) => {
            item['amountPayableCount'] = (
              item['amountPayableCount'] / 100.0
            ).toFixed(2);
          });
          const date = _this.$moment(new Date()).format('YYYYMMDDHHmmss');
          _this.$refs.tables1.handleDownload({
            filename: `门店物料用户数据统计-${date}`,
            data: tableData
          });
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.mark {
  display: inline-block;
}
.tabChange {
  height: 50px;
  width: 280px;
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
    width: 138px;
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
