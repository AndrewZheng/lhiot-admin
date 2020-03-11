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
        @on-relevance="handleSetting"
        @custom-on-sale="onOff"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.title"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.ifEffective"
              placeholder="活动状态"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in couponStatusEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.formBeginTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间起"
              class="search-input"
              style="width: 150px"
              @on-change="beginTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.formEndTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
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
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addCoupon">
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
    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>限时秒杀活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动ID:</i-col>
              <i-col span="18">{{ couponDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">{{ couponDetail.title }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">{{ couponDetail.beginTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">{{ couponDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col span="18" v-if="couponDetail.status === 'ON'">
                <tag color="success">{{ "开启" | imageStatusFilter }}</tag>
              </i-col>
              <i-col span="18" v-else-if="couponDetail.status === 'OFF'">
                <tag color="error">{{ "关闭" | imageStatusFilter }}</tag>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动每人限购份数:</i-col>
              <i-col span="18">{{ couponDetail.userActivityLimit }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动个人剩余份数:</i-col>
              <i-col span="18">{{ couponDetail.userActivitySurplus }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">描述:</i-col>
              <i-col span="18">{{ couponDetail.remark }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :width="1000" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType == modalType.edit?'修改限时秒杀活动':'创建限时秒杀活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="couponDetail" :rules="ruleInline" :label-width="100">
          <Row v-if="tempModalType == modalType.edit || tempModalType == modalType.create">
            <Row>
              <i-col span="18">
                <FormItem label="活动标题:" prop="title">
                  <Input v-model="couponDetail.title" placeholder="活动标题" style="width: 200px"></Input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="活动开关:" prop="status">
                  <Select v-model="couponDetail.status" clearable  style="width: 200px">
                    <Option
                      v-for="(item,index) in imageStatusEnum"
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
              <i-col span="18">
                <FormItem label="有效期起:" prop="beginTime">
                  <DatePicker
                    v-model="couponDetail.beginTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期起"
                    class="search-input"
                    style="width: 200px"
                    @on-change="beginTimeChange"
                  />
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="有效期止:" prop="endTime">
                  <DatePicker
                    v-model="couponDetail.endTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期止"
                    class="search-input"
                    style="width: 200px"
                    @on-change="endTimeChange"
                  />
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="每人限购份数:" prop="userActivityLimit">
                  <Input v-model="couponDetail.userActivityLimit" style="width: 170px"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="活动描述:" prop="remark">
                  <Input
                    v-model="couponDetail.remark"
                    type="textarea"
                    :autosize="{minRows: 3,maxRows: 8}"
                    placeholder="请输入活动描述"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('editForm')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import IViewUpload from "_c/iview-upload";
import _ from "lodash";
import {
  deleteSeckill,
  getSeckillPages,
  editSeckill,
  createSeckill
} from "@/api/mini-program";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import { couponStatusConvert, imageStatusConvert } from "@/libs/converStatus";
import { couponStatusEnum,imageStatusEnum} from "@/libs/enumerate";
import { compareData, setSmallCouponActivity } from "@/libs/util";

const couponDetail = {
  beginTime: null,
  createTime: null,
  endTime: null,
  id: 0,
  remark: "",
  status: "",
  title: "",
  updateTime: null,
  userActivityLimit: "",
  userActivitySurplus: ""
};

const roleRowData = {
  beginTime: null,
  endTime: null,
  title: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      ruleInline: {
        title: [{ required: true, message: "请输入活动名称" }],
        status: [{ required: true, message: "请选择活动开关" }],
        beginTime: [{ required: true, message: "请输入开始时间" }],
        endTime: [{ required: true, message: "请输入结束时间" }]
        // TODO 验证商城是否显示
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      couponStatusEnum,
      imageStatusEnum,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "活动ID",
          align: "center",
          key: "id"
        },
        {
          title: "活动标题",
          align: "center",
          key: "title"
        },
        {
          title: "开始时间",
          align: "center",
          key: "beginTime"
        },
        {
          title: "结束时间",
          align: "center",
          key: "endTime"
        },
        {
          title: "修改时间",
          align: "center",
          key: "updateTime"
        },
        {
          title: "活动状态",
          align: "center",
          key: "status",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "ON") {
              return (
                <div>
                  <tag color="success">
                    {imageStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === "OFF") {
              return (
                <div>
                  <tag color="error">
                    {imageStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">{row.status ? row.status : "N/A"}</tag>
              </div>
            );
          }
        },
        {
          title: "活动每人限购份数",
          align: "center",
          key: "userActivityLimit"
        },
        {
          title: "活动个人剩余份数",
          align: "center",
          key: "userActivitySurplus"
        },
        // {
        //   title: "操作",
        //   align: "center",
        //   minWidth: 80,
        //   key: "handle",
        //   //"delete",
        //   options: ["onSale", "view", "edit", "settings"]
        // }
        {
          title: "操作",
          align: "center",
          minWidth: 80,
          key: "handle",
          options: ["customOnSale", "view", "edit", "delete", "settings"]
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      couponDetail: _.cloneDeep(couponDetail)
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
      this.$refs.uploadMain.clearFileList();
    },
    handleSubmit(name) {
      this.couponDetail.activityType = this.searchRowData.activityType;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            compareData(this.couponDetail.beginTime, this.couponDetail.endTime)
          ) {
            this.$Message.error("结束时间必须大于开始时间!");
            return;
          }
          // 应用类型为小程序-WXSMALL_SHOP
          this.couponDetail.applicationType = "WXSMALL_SHOP";
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createSeckill();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editSeckill();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createSeckill() {
      this.modalViewLoading = true;
      createSeckill(this.couponDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editSeckill() {
      this.modalViewLoading = true;
      editSeckill(this.couponDetail)
        .then(res => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addCoupon() {
      // this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.couponDetail = _.cloneDeep(couponDetail);
      }
      this.modalEdit = true;
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    deleteTable(ids) {
      this.loading = true;
      deleteSeckill({
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
    },
    handleView(params) {
      this.modalView = true;
      // this.$refs.modalView.resetFields();
      // this.resetFields();
      this.tempModalType = this.modalType.view;
      this.couponDetail = _.cloneDeep(params.row);
    },
    handleEdit(params) {
      // this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.couponDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getSeckillPages(this.searchRowData)
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
    onOff(params) {
      this.couponDetail = this._.cloneDeep(params.row);
      if (params.row.status === "ON") {
        this.couponDetail.status = "OFF";
      } else {
        this.couponDetail.status = "ON";
      }
      this.loading = true;
      this.editSeckill();
    },
    beginTimeChange(value, date) {
      this.couponDetail.beginTime = value;
      this.couponDetail.formBeginTime = value;
    },
    endTimeChange(value, date) {
      this.couponDetail.endTime = value;
      this.couponDetail.formEndTime = value;
    },
    handleSetting(params) {
      var rows = params.row;
      console.log('shuju',rows)
      setSmallCouponActivity(rows);
      this.turnToPage({
        name: "small-activity-seckill"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
