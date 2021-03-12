<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="24"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-set-top="handleSetTop"
        @on-set-sta="handleSetSta"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.storeName"
              placeholder="门店名称"
              class="search-input mr2"
              style="width: 130px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.nickName"
              placeholder="用户名称"
              class="search-input mr2"
              style="width: 120px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="手机号码"
              class="search-input mr2"
              style="width: 120px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.deliveryComment"
              class="search-col mr2"
              placeholder="骑手评价"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in deliveryTypeEnum"
                :key="`orderType-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.commentScore"
              class="search-col mr2"
              placeholder="门店评价"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in commentScoreTypeEnum"
                :key="`orderType-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.orderType"
              class="search-col mr2"
              placeholder="订单类型"
              style="width: 110px"
              clearable
            >
              <Option
                v-for="item in orderType"
                :key="`orderType-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.istop"
              class="search-col mr2"
              placeholder="是否置顶"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in istopTypeEnum"
                :key="`orderType-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <DatePicker
              v-model="searchRowData.beginDate"
              format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="开始时间起"
              class="search-input"
              style="width: 160px"
              @on-change="beginTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endDate"
              format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="开始时间止"
              class="search-input mr2"
              style="width: 160px"
              @on-change="endTimeChange"
            />
          </Row>
          <Row style="margin-top: 10px; float: right">
            <Button
              :loading="searchLoading"
              class="search-btn mr2"
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
            <Button class="search-btn" type="warning" @click="handleDownload">
              <Icon type="md-download" />导出
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

    <Modal v-model="modalView" :mask-closable="false" :width="800">
      <p slot="header">
        <span>用户评价详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6"> 门店ID: </i-col>
              <i-col span="18">
                {{ evaluateDetail.storeId }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6"> 门店Code: </i-col>
              <i-col span="18">
                {{ evaluateDetail.storeCode }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6"> 门店名称: </i-col>
              <i-col span="18">
                {{ evaluateDetail.storeName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6"> 用户ID: </i-col>
              <i-col span="18">
                {{ evaluateDetail.userId }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6"> 用户昵称: </i-col>
              <i-col span="18">
                {{ evaluateDetail.nickName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6"> 手机号码: </i-col>
              <i-col span="18">
                {{ evaluateDetail.phone }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6"> 所得积分: </i-col>
              <i-col span="18">
                {{ evaluateDetail.point }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6"> 商品名称组合: </i-col>
              <i-col span="18">
                {{ evaluateDetail.productNames }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6"> 订单编号: </i-col>
              <i-col span="18">
                {{ evaluateDetail.orderCode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6"> 骑手评价: </i-col>
              <i-col v-if="evaluateDetail.deliveryComment === 'GOOD'" span="18">
                {{ "超赞" }}
              </i-col>
              <i-col
                v-else-if="evaluateDetail.deliveryComment === 'GENERAL'"
                span="18"
              >
                {{ "一般" }}
              </i-col>
              <i-col
                v-else-if="evaluateDetail.deliveryComment === 'NEGATIVE'"
                span="18"
              >
                {{ "很差" }}
              </i-col>
              <i-col v-else span="18">
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6"> 门店评价: </i-col>
              <i-col span="18">
                {{ evaluateDetail.commentScore }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6"> 是否置顶: </i-col>
              <i-col v-if="evaluateDetail.istop === 'YES'" span="18">
                {{ "是" }}
              </i-col>
              <i-col v-else span="18">
                {{ "否" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6"> 状态: </i-col>
              <i-col v-if="evaluateDetail.status === 'VIEW'" span="18">
                {{ "显示" }}
              </i-col>
              <i-col v-else span="18">
                {{ "隐藏" }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6"> 置顶时间: </i-col>
              <i-col span="18">
                {{ evaluateDetail.topTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="22">
            <Row>
              <i-col span="3"> 评价内容: </i-col>
              <i-col span="18">
                {{ evaluateDetail.commentContent }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="22">
            <Row>
              <i-col span="3"> 历史评价: </i-col>
              <i-col span="18">
                {{
                  evaluateDetail.historyCommentContent
                    ? evaluateDetail.historyCommentContent
                    : "N/A"
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6"> 修改时间: </i-col>
              <i-col span="18">
                {{
                  evaluateDetail.updateTime ? evaluateDetail.updateTime : "N/A"
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="20">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="6"> 评价图片: </i-col>
              <i-col span="16">
                <div
                  v-for="item in evaluateList"
                  :key="item.id"
                  class="demo-upload-list"
                  style="width: 100px; height: 100px"
                >
                  <img :src="item">
                  <div class="demo-upload-list-cover">
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleUploadView(item)"
                    ></Icon>
                  </div>
                </div>
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
      :mask-closable="false"
      :z-index="1000"
      :width="800"
    >
      <p slot="header">
        <i-col>{{ "回复评论" }}</i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="evaluateDetail"
          :rules="ruleInline"
          :label-width="100"
        >
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6"> 订单编号: </i-col>
                <i-col span="18">
                  {{ evaluateDetail.orderCode }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6"> 下单门店: </i-col>
                <i-col span="18">
                  {{ evaluateDetail.storeName }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6"> 用户名称: </i-col>
                <i-col span="18">
                  {{ evaluateDetail.nickName }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6"> 骑手评价: </i-col>
                <i-col
                  v-if="evaluateDetail.deliveryComment == 'GOOD'"
                  span="18"
                >
                  {{ "超赞" }}
                </i-col>
                <i-col
                  v-else-if="evaluateDetail.deliveryComment == 'GENERAL'"
                  span="18"
                >
                  {{ "一般" }}
                </i-col>
                <i-col
                  v-else-if="evaluateDetail.deliveryComment == 'NEGATIVE'"
                  span="18"
                >
                  {{ "很差" }}
                </i-col>
                <i-col v-else span="18">
                  {{ "N/A" }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6"> 门店评价: </i-col>
                <i-col span="18">
                  {{ evaluateDetail.commentScore }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6"> 评价内容: </i-col>
                <i-col span="18">
                  {{ evaluateDetail.commentContent }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6"> 历史评价: </i-col>
                <i-col span="18">
                  {{
                    evaluateDetail.historyCommentContent
                      ? evaluateDetail.historyCommentContent
                      : "N/A"
                  }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6"> 修改时间: </i-col>
                <i-col span="18">
                  {{
                    evaluateDetail.updateTime
                      ? evaluateDetail.updateTime
                      : "N/A"
                  }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <!-- 图片评价 -->
          <Row :gutter="8" type="flex" align="middle" class-name="mb10">
            <i-col span="20">
              <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                <i-col span="6"> 评价图片: </i-col>
                <i-col span="16">
                  <div
                    v-for="item in evaluateList"
                    :key="item.id"
                    class="demo-upload-list"
                    style="width: 100px; height: 100px"
                  >
                    <img :src="item">
                    <div class="demo-upload-list-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleUploadView(item)"
                      ></Icon>
                    </div>
                  </div>
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Divider>回复评价</Divider>
          <Row class-name="mb20">
            <!-- <i-col span="20" v-if="evaluateStatus">
              <FormItem :label-width="100" label="回复评价:" prop="answerContent">
                <Input
                  v-model="evaluateDetail.answerContent"
                  :autosize="{minRows: 3,maxRows: 8}"
                  type="textarea"
                  disabled
                  placeholder="请输入回复内容..."
                ></Input>
              </FormItem>
            </i-col>-->
            <i-col span="20">
              <FormItem
                :label-width="100"
                label="回复评价:"
                prop="answerContent"
              >
                <Input
                  v-model="evaluateDetail.answerContent"
                  :autosize="{ minRows: 3, maxRows: 8 }"
                  type="textarea"
                  placeholder="请输入回复内容..."
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
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

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import DragList from '_c/drag-list';
import { getEvaluatePages, replyEvaluate } from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import { deliveryTypeConvert } from '@/libs/converStatus';
import {
  imageStatusEnum,
  deliveryTypeEnum,
  commentScoreTypeEnum
} from '@/libs/enumerate';

const evaluateDetail = {
  answerContent: '',
  avatarUrl: '',
  beginDate: '',
  commentContent: '',
  commentImages: '',
  commentScore: '',
  commentSource: '',
  createTime: '',
  deliveryComment: '',
  endDate: '',
  id: '',
  istop: 'NO',
  nickName: '',
  orderCode: '',
  orderId: '',
  phone: '',
  point: '',
  productNames: '',
  status: '',
  storeCode: '',
  storeId: '',
  storeName: '',
  topTime: '',
  type: '',
  userId: '',
  orderType: '',
  xid: ''
};

const roleRowData = {
  deliveryComment: null,
  nickName: null,
  commentScore: null,
  phone: null,
  storeName: '',
  beginDate: '',
  endDate: '',
  page: 1,
  rows: 10,
  isTop: '',
  orderType: 'WX_SMALL',
  sidx: 'createTime',
  sort: 'desc'
};

export default {
  components: {
    Tables,
    IViewUpload,
    DragList
  },
  mixins: [tableMixin],
  data() {
    return {
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      evaluateList: [],
      uploadVisible: false,
      evaluateStatus: false,
      imgUploadViewItem: '',
      imageStatusEnum,
      deliveryTypeEnum,
      commentScoreTypeEnum,
      orderType: [
        { label: '小程序订单', value: 'WX_SMALL' },
        { label: '门店订单', value: 'STORE' }
      ],
      istopTypeEnum: [
        { label: '是', value: 'YES' },
        { label: '否', value: 'NO' }
      ],
      ruleInline: {
        answerContent: [{ required: true, message: '请输入评价回复' }]
      },
      columns: [
        {
          title: '订单编号',
          align: 'center',
          width: 190,
          fixed: 'left',
          key: 'orderCode',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.orderType === 'WX_SMALL') {
              return <div>{row.orderCode}</div>;
            } else {
              return <div>{row.xid}</div>;
            }
          }
        },
        {
          title: '商品名称',
          align: 'center',
          key: 'productNames',
          tooltip: true,
          minWidth: 160
        },
        {
          title: '门店名称',
          align: 'center',
          key: 'storeName',
          minWidth: 160
        },
        {
          title: '用户名称',
          align: 'center',
          key: 'nickName',
          minWidth: 160
        },
        {
          title: '手机号码',
          align: 'center',
          key: 'phone',
          minWidth: 130
        },
        {
          title: '评价时间',
          align: 'center',
          key: 'createTime',
          minWidth: 180
        },
        {
          title: '骑手评价',
          align: 'center',
          key: 'deliveryComment',
          minWidth: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.deliveryComment === 'GOOD') {
              return (
                <div>
                  <tag color='orange'>
                    {deliveryTypeConvert(row.deliveryComment)}
                  </tag>
                </div>
              );
            } else if (row.deliveryComment === 'GENERAL') {
              return (
                <div>
                  <tag color='cyan'>
                    {deliveryTypeConvert(row.deliveryComment)}
                  </tag>
                </div>
              );
            } else if (row.deliveryComment === 'NEGATIVE') {
              return (
                <div>
                  <tag color='error'>
                    {deliveryTypeConvert(row.deliveryComment)}
                  </tag>
                </div>
              );
            }
            return <div>{'N/A'}</div>;
          }
        },
        {
          title: '是否给小票',
          align: 'center',
          key: 'whetherGiveReceipt',
          minWidth: 110,
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
          title: '门店评价',
          align: 'center',
          minWidth: 100,
          key: 'commentScore',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{row.commentScore + '星'}</div>;
          }
        },
        {
          title: '评价内容',
          align: 'center',
          minWidth: 200,
          key: 'commentContent',
          tooltip: true,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.commentSource != 'USER') {
              return <div>{'系统评价'}</div>;
            } else {
              return <div>{row.commentContent}</div>;
            }
          }
        },
        {
          title: '回复评价',
          align: 'center',
          minWidth: 200,
          key: 'answerContent',
          tooltip: true
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 200,
          fixed: 'right',
          key: 'handle',
          options: ['view', 'setTop', 'setSta', 'edit']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      evaluateDetail: _.cloneDeep(evaluateDetail)
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
      this.$refs.editForm.resetFields();
    },
    getTableData() {
      if (this.searchRowData.beginDate) {
        this.searchRowData.beginDate = this.$moment(
          this.searchRowData.beginDate
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.searchRowData.endDate) {
        this.searchRowData.endDate = this.$moment(
          this.searchRowData.endDate
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      getEvaluatePages(this.searchRowData)
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
    handleView(params) {
      // this.resetFields();
      this.tempModalType = this.modalType.view;
      this.evaluateList = [];
      this.evaluateDetail = _.cloneDeep(params.row);
      const arr = params.row.commentImages.split(',');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] != '') {
          this.evaluateList.push(arr[i]);
        }
      }
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.evaluateList = [];
      this.evaluateDetail = _.cloneDeep(params.row);
      const arr = params.row.commentImages.split(',');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] != '') {
          this.evaluateList.push(arr[i]);
        }
      }
      this.evaluateStatus = !!params.row.answerContent;
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const evaluateData = this.evaluateDetail;
          evaluateData.istop = 'NO';
          this.replyEvaluate(evaluateData);
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    replyEvaluate(data) {
      replyEvaluate(data)
        .then((res) => {
          this.modalEdit = false;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
        });
    },
    beginTimeChange(value, date) {
      this.evaluateDetail.beginDate = value;
    },
    endTimeChange(value, date) {
      this.evaluateDetail.endDate = value;
    },
    handleSetTop(params) {
      const evaluateData = _.cloneDeep(params.row);
      evaluateData.istop = params.row.istop === 'YES' ? 'NO' : 'YES';
      this.replyEvaluate(evaluateData);
    },
    handleSetSta(params) {
      const evaluateData = _.cloneDeep(params.row);
      evaluateData.status = params.row.status === 'VIEW' ? 'HIDE' : 'VIEW';
      this.replyEvaluate(evaluateData);
    },
    handleUploadView(item) {
      this.imgUploadViewItem = item;
      this.uploadVisible = true;
    },
    // 导出数据
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getEvaluatePages(this.searchRowData).then((res) => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        this.searchRowData.page = pageSize;
        // 表格数据导出字段翻译
        tableData.forEach((item) => {
          item['deliveryComment'] = deliveryTypeConvert(
            item['deliveryComment']
          ).label;
          item['whetherGiveReceipt'] =
            item['whetherGiveReceipt'] === 'YES' ? '是' : '否';
          item['commentScore'] = item['commentScore'] + '星';
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `用户评价数据-${date}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
