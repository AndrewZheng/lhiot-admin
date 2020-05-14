<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="20"
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
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.nickName"
              placeholder="用户名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="手机号码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.deliveryComment"
              class="search-col mr5"
              placeholder="骑手评价"
              style="width: 100px"
              clearable
            >
              <Option
                v-for="item in deliveryTypeEnum"
                :value="item.value"
                :key="`orderType-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.commentScore"
              class="search-col mr5"
              placeholder="门店评价"
              style="width: 100px"
              clearable
            >
              <Option
                v-for="item in commentScoreTypeEnum"
                :value="item.value"
                :key="`orderType-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.beginDate"
              format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="开始时间起"
              class="search-input"
              style="width: 150px"
              @on-change="beginTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endDate"
              format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="开始时间止"
              class="search-input mr5"
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
            <Button class="search-btn mr2" type="warning" @click="handleDownload">
              <Icon type="md-download" />导出数据
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

    <Modal v-model="modalView" :mask-closable="false" :width="800">
      <p slot="header">
        <span>用户评价详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">门店ID:</i-col>
              <i-col span="18">{{ evaluateDetail.storeId }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">门店Code:</i-col>
              <i-col span="18">{{ evaluateDetail.storeCode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">门店名称:</i-col>
              <i-col span="18">{{ evaluateDetail.storeName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">用户ID:</i-col>
              <i-col span="18">{{ evaluateDetail.userId }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">用户昵称:</i-col>
              <i-col span="18">{{ evaluateDetail.nickName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">手机号码:</i-col>
              <i-col span="18">{{ evaluateDetail.phone }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">所得积分:</i-col>
              <i-col span="18">{{ evaluateDetail.point }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">商品名称组合:</i-col>
              <i-col span="18">{{ evaluateDetail.productNames }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">订单编号:</i-col>
              <i-col span="18">{{ evaluateDetail.orderCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">骑手评价:</i-col>
              <i-col span="18">{{ evaluateDetail.deliveryComment }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">门店评价:</i-col>
              <i-col span="18">{{ evaluateDetail.commentScore }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">是否置顶:</i-col>
              <i-col span="18" v-if="evaluateDetail.istop='YES'">{{ "是" }}</i-col>
              <i-col span="18" v-else>{{ "否" }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">状态:</i-col>
              <i-col span="18" v-if="evaluateDetail.status==='VIEW'">{{ "显示" }}</i-col>
              <i-col span="18" v-else>{{ "隐藏" }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">置顶时间:</i-col>
              <i-col span="18">{{ evaluateDetail.topTime }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :mask-closable="false" :z-index="1000" :width="800">
      <p slot="header">
        <i-col>{{ "回复评论" }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="evaluateDetail" :rules="ruleInline" :label-width="100">
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6">订单编号:</i-col>
                <i-col span="18">{{ evaluateDetail.orderCode }}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6">下单门店:</i-col>
                <i-col span="18">{{ evaluateDetail.storeName }}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6">用户名称:</i-col>
                <i-col span="18">{{ evaluateDetail.nickName }}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6">骑手评价:</i-col>
                <i-col span="18">{{ evaluateDetail.deliveryComment }}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="6">门店评价:</i-col>
                <i-col span="18">{{ evaluateDetail.commentScore }}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row class-name="mb20">
            <i-col span="20">
              <Row>
                <i-col span="5">评价内容:</i-col>
                <i-col span="18">{{ evaluateDetail.commentContent }}</i-col>
              </Row>
            </i-col>
          </Row>
          <!-- 图片评价 -->
          <Row :gutter="8" type="flex" align="middle" class-name="mb10">
            <i-col span="20">
              <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                <i-col span="6">评价图片:</i-col>
                <i-col span="16">
                  <div
                    v-for="item in evaluateList"
                    :key="item.id"
                    class="demo-upload-list"
                    style="width:100px;height:100px;"
                  >
                    <img :src="item" />
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                    </div>
                  </div>
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Divider>回复评价</Divider>
          <Row class-name="mb20">
            <i-col span="20" v-if="evaluateStatus">
              <FormItem :label-width="100" label="回复评价:" prop="answerContent">
                <Input
                  v-model="evaluateDetail.answerContent"
                  :autosize="{minRows: 3,maxRows: 8}"
                  type="textarea"
                  disabled
                  placeholder="请输入回复内容..."
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="20" v-else>
              <FormItem :label-width="100" label="回复评价:" prop="answerContent">
                <Input
                  v-model="evaluateDetail.answerContent"
                  :autosize="{minRows: 3,maxRows: 8}"
                  type="textarea"
                  placeholder="请输入回复内容..."
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit()">确定</Button>
      </div>
    </Modal>
    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%" />
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import IViewUpload from "_c/iview-upload";
import DragList from "_c/drag-list";
import _ from "lodash";
import { getEvaluatePages, replyEvaluate } from "@/api/mini-program";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  imageStatusConvert,
  deliveryTypeConvert,
  commentScoreConvert
} from "@/libs/converStatus";
import {
  imageStatusEnum,
  deliveryTypeEnum,
  commentScoreTypeEnum
} from "@/libs/enumerate";

const evaluateDetail = {
  answerContent: "",
  avatarUrl: "",
  beginDate: "",
  commentContent: "",
  commentImages: "",
  commentScore: "",
  commentSource: "",
  createTime: "",
  deliveryComment: "",
  endDate: "",
  id: "",
  istop: "",
  nickName: "",
  orderCode: "",
  orderId: "",
  phone: "",
  point: "",
  productNames: "",
  status: "",
  storeCode: "",
  storeId: "",
  storeName: "",
  topTime: "",
  type: "",
  userId: ""
};

const roleRowData = {
  deliveryComment: null,
  nickName: null,
  commentScore: null,
  phone: null,
  storeName: "",
  beginDate: "",
  endDate: "",
  page: 1,
  rows: 10,
  sidx: "createTime",
  sort: "desc"
};

export default {
  components: {
    Tables,
    IViewUpload,
    DragList
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      searchRowData: _.cloneDeep(roleRowData),
      evaluateDetail: _.cloneDeep(evaluateDetail),
      ruleInline: {
        answerContent: [{ required: true, message: "请输入评价回复" }]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      evaluateList: [],
      uploadVisible: false,
      evaluateStatus: false,
      imgUploadViewItem: "",
      imageStatusEnum,
      deliveryTypeEnum,
      commentScoreTypeEnum,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "订单编号",
          align: "center",
          width: 170,
          key: "orderCode"
        },
        {
          title: "商品名称",
          align: "center",
          key: "productNames",
          tooltip: true
        },
        {
          title: "门店名称",
          align: "center",
          key: "storeName"
        },
        {
          title: "用户名称",
          align: "center",
          key: "nickName"
        },
        {
          title: "手机号码",
          align: "center",
          key: "phone"
        },
        {
          title: "骑手评价",
          align: "center",
          key: "deliveryComment",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.deliveryComment === "GOOD") {
              return (
                <div>
                  <tag color="orange">
                    {deliveryTypeConvert(row.deliveryComment).label}
                  </tag>
                </div>
              );
            } else if (row.deliveryComment === "GENERAL") {
              return (
                <div>
                  <tag color="cyan">
                    {deliveryTypeConvert(row.deliveryComment).label}
                  </tag>
                </div>
              );
            } else if (row.deliveryComment === "NEGATIVE") {
              return (
                <div>
                  <tag color="error">
                    {deliveryTypeConvert(row.deliveryComment).label}
                  </tag>
                </div>
              );
            }
            return <div>{"N/A"}</div>;
          }
        },
        {
          title: "门店评价",
          align: "center",
          key: "commentScore",
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{row.commentScore + "星"}</div>;
          }
        },
        {
          title: "评价内容",
          align: "center",
          width: 200,
          key: "commentContent",
          tooltip: true,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.commentSource != "USER") {
              return <div>{"系统评价"}</div>;
            } else {
              return <div>{row.commentContent}</div>;
            }
          }
        },
        {
          title: "回复评价",
          align: "center",
          width: 200,
          key: "answerContent",
          tooltip: true
        },
        {
          title: "操作",
          align: "center",
          minWidth: 80,
          key: "handle",
          options: ["view", "setTop", "setSta", "edit"]
        }
      ],
      createLoading: false,
      modalViewLoading: false
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
    handleSubmit() {
      this.$refs.modalEdit.validate(valid => {
        if (valid) {
          this.replyEvaluate();
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    replyEvaluate() {
      replyEvaluate(this.evaluateDetail)
        .then(res => {
          this.modalEdit = false;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
        });
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.evaluateDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      (this.evaluateList = []), (this.evaluateDetail = _.cloneDeep(params.row));
      let arr = params.row.commentImages.split(",");
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] != "") {
          this.evaluateList.push(arr[i]);
        }
      }
      params.row.answerContent
        ? (this.evaluateStatus = true)
        : (this.evaluateStatus = false);

      this.modalEdit = true;
    },
    getTableData() {
      if (this.searchRowData.beginDate) {
        this.searchRowData.beginDate = this.$moment(
          this.searchRowData.beginDate
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      if (this.searchRowData.endDate) {
        this.searchRowData.endDate = this.$moment(
          this.searchRowData.endDate
        ).format("YYYY-MM-DD HH:mm:ss");
      }

      getEvaluatePages(this.searchRowData)
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
    beginTimeChange(value, date) {
      this.evaluateDetail.beginDate = value;
    },
    endTimeChange(value, date) {
      this.evaluateDetail.endDate = value;
    },
    handleSetTop(params) {
      this.evaluateDetail = _.cloneDeep(params.row);
      this.evaluateDetail.istop = params.row.istop === "YES" ? "NO" : "YES";
      this.replyEvaluate(this.evaluateDetail);
    },
    handleSetSta(params) {
      this.evaluateDetail = _.cloneDeep(params.row);
      this.evaluateDetail.status =
        params.row.status === "VIEW" ? "HIDE" : "VIEW";
      this.replyEvaluate(this.evaluateDetail);
    },
    handleUploadView(item) {
      this.imgUploadViewItem = item;
      this.uploadVisible = true;
    },
    // 导出数据
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      getEvaluatePages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        // 表格数据导出字段翻译   
        let _this = this;
        tableData.forEach(item => {
          item["deliveryComment"] = deliveryTypeConvert(
            item["deliveryComment"]
          ).label;
          item["commentScore"] = item["commentScore"] + "星";
        });
        this.$refs.tables.handleDownload({
          filename: `用户评价数据-${new Date().valueOf()}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mr20 {
  margin-right: 20px;
}
</style>
