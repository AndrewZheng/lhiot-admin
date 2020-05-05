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
        @on-relevance="onRelevance"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.name"
              placeholder="活动标题"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <DatePicker
              v-model="searchRowData.startTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间起"
              class="search-input"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间止"
              class="search-input mr5"
              style="width: 150px"
              @on-change="endTimeChange"
            />
            <Select
              v-model="searchRowData.status"
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
          <Button
            v-waves
            :loading="createLoading"
            type="success"
            class="mr5"
            @click="addShareReward"
          >
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
        <span>分享红包活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动标题:</i-col>
              <i-col span="18">{{ shareRewardDetail.name }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">{{ shareRewardDetail.startTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">{{ shareRewardDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col span="16" v-if="shareRewardDetail.status === 'VALID'">
                <tag color="success">{{ "有效" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="shareRewardDetail.status === 'INVALID'">
                <tag color="error">{{ "无效" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="shareRewardDetail.status === 'EXPIRE'">
                <tag color="primary">{{ "过期" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="shareRewardDetail.status === null">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">分享标题:</i-col>
              <i-col span="18">{{ shareRewardDetail.shareName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">分享图片:</i-col>
              <i-col span="18">
                <img :src="shareRewardDetail.shareImageUrl" width="80%" />
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">红包个数:</i-col>
              <i-col span="18">{{ shareRewardDetail.rewardCount }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">最大红包位置:</i-col>
              <i-col
                span="18"
              >{{ shareRewardDetail.rewardPositionStart }} -{{ shareRewardDetail.rewardPositionEnd }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">红包有效时间:</i-col>
              <i-col span="18">{{ shareRewardDetail.rewardEffectiveTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动规则描述:</i-col>
              <i-col span="18">{{ shareRewardDetail.activityRuleDesc }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType==modalType.edit?'修改分享红包活动':(tempModalType==modalType.create?'创建分享红包活动': '分享红包配置') }}</i-col>
      </p>
      <div class="modal-content">
        <Row v-if="tempModalType == modalType.edit || tempModalType == modalType.create">
          <Form ref="modalEdit" :model="shareRewardDetail" :rules="ruleInline" :label-width="100">
            <Row>
              <Col span="18">
                <FormItem label="活动标题:" prop="name">
                  <Input v-model="shareRewardDetail.name" placeholder="活动标题"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="开启时间:" prop="startTime">
                  <DatePicker
                    v-model="shareRewardDetail.startTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期起"
                    class="search-input"
                    style="width: 170px"
                    @on-change="startTimeChange"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="结束时间:" prop="endTime">
                  <DatePicker
                    v-model="shareRewardDetail.endTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期止"
                    class="search-input"
                    style="width: 170px"
                    @on-change="endTimeChange"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="活动状态:" prop="status">
                  <Select v-model="shareRewardDetail.status" clearable>
                    <Option
                      v-for="(item,index) in couponStatusEnum"
                      :value="item.value"
                      :key="index"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 100%"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="分享标题:" prop="shareName">
                  <Input v-model="shareRewardDetail.shareName" placeholder="分享标题"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <FormItem label="分享图片     (推荐尺寸为750X160(单位:px)):" prop="shareImageUrl">
                <Input v-show="false" v-model="shareRewardDetail.shareImageUrl" style="width: auto"></Input>
                <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveMain(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadMain"
                  :default-list="defaultListMain"
                  :image-size="imageSize"
                  @on-success="handleSuccessMain"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="红包个数:" prop="rewardCount">
                  <Input v-model="shareRewardDetail.rewardCount" placeholder="红包个数"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="最大红包位置:" prop="rewardPositionStart">
                  <Input v-model="shareRewardDetail.rewardPositionStart" placeholder="最大红包位置"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="红包有效时间:" prop="rewardEffectiveTime">
                  <Input v-model="shareRewardDetail.rewardEffectiveTime" placeholder="红包有效时间"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="活动规则描述:" prop="activityRuleDesc">
                  <Input
                    v-model="shareRewardDetail.activityRuleDesc"
                    :rows="6"
                    placeholder="活动规则描述"
                    type="textarea"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Row>

        <Row v-if="tempModalType == null ">
          <Form
            ref="modalCreate"
            :model="addRelationDetail"
            :rules="relationRuleInline"
            :label-width="80"
          >
            <Row>
              <Col span="8">
                <FormItem label="最小使用金额:" prop="price" :label-width="90">
                  <InputNumber
                    :min="0"
                    :value="priceComputed"
                    placeholder="最小使用金额"
                    @on-change="priceInputNumberOnChange"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="红包金额:" prop="minPrice" :label-width="90">
                  <InputNumber
                    :min="0"
                    :value="minPriceComputed"
                    placeholder="红包金额"
                    @on-change="minPriceInputNumberOnChange"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span="8">
                <Button
                  v-waves
                  :loading="addTempDataLoading"
                  span="4"
                  class="search-btn ml20"
                  type="primary"
                  @click="addTempData('modalCreate')"
                >
                  <Icon type="md-add" />&nbsp;添加配置
                </Button>
              </Col>
            </Row>*Tips：红包最少配置两个，取红包金额最大的作为最大红包，其他红包随机产生
          </Form>

          <Divider orientation="center">已配置参数</Divider>
          <tables
            :columns="relationColumns"
            v-model="relationDetail"
            :loading="tempTableLoading"
            border
            @on-delete="modalHandleDelete"
            @on-inline-edit="modalHandleEdit"
            @on-inline-save="modalHandleSave"
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import IViewUpload from "_c/iview-upload";
import _ from "lodash";
import {
  deleteShareReward,
  getShareRewardPages,
  editShareReward,
  createShareReward,
  getShareRewardSettingPages,
  deleteShareRewardSetting,
  createShareRewardSetting,
  editShareRewardSetting
} from "@/api/mini-program";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import { couponStatusConvert } from "@/libs/converStatus";
import { couponStatusEnum } from "@/libs/enumerate";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from "@/libs/util";

const shareRewardDetail = {
  id: 0,
  name: "",
  startTime: "",
  endTime: "",
  status: null,
  shareName: "",
  shareImageUrl: "",
  rewardCount: 0,
  rewardPositionStart: 0,
  rewardPositionEnd: 0,
  rewardEffectiveTime: 0,
  userId: "",
  userName: "",
  activityRuleDesc: "",
  createTime: null
};

const relationDetail = {
  id: 0,
  activityShareRewardId: 0,
  minPrice: 0,
  price: 0,
  isEdit: false
};

const roleRowData = {
  page: 1,
  rows: 10
};

const relationRowData = {
  activityShareRewardId: 0,
  page: 1,
  rows: 10
};

const relationTempColumns = [
  {
    title: "最小使用金额/元",
    key: "minPrice",
    minWidth: 100,
    render(h, params) {
      if (params.row.isEdit) {
        return h("div", [
          h("InputNumber", {
            domProps: {
              value: params.row.minPrice
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.minPrice = event;
                }
              }
            }
          })
        ]);
      } else {
        return h("div", fenToYuanDot2(params.row.minPrice));
      }
    }
  },
  {
    title: "红包金额/元",
    key: "price",
    minWidth: 100,
    render(h, params) {
      if (params.row.isEdit) {
        return h("div", [
          h("InputNumber", {
            domProps: {
              value: params.row.price
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.price = event;
                }
              }
            }
          })
        ]);
      } else {
        return h("div", fenToYuanDot2(params.row.price));
      }
    }
  }
];

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        storeId: [{ required: true, message: "请选择门店" }],
        userId: [
          { required: true, message: "请输入用户id" },
          { message: "必须为非零整数", pattern: /^[-1-9]\d*$/ }
        ],
        receiverName: [{ required: true, message: "请输入收货人" }],
        receiverMobile: [{ required: true, message: "请输入联系方式" }],
        nickName: [{ required: true, message: "请输入用户昵称" }],
        avater: [{ required: true, message: "请上传用户头像" }]
      },
      relationRuleInline: {
        price: [
          { required: true, message: "请输入红包金额" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        minPrice: [
          { required: true, message: "请输入最小使用金额" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      couponStatusEnum,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        // {
        //   title: '主键id',
        //   key: 'id'
        // },
        {
          title: "活动标题",
          align: "center",
          key: "name",
          minWidth: 50
        },
        {
          title: "活动开启时间",
          align: "center",
          key: "startTime",
          width: 110
        },
        {
          title: "活动结束时间",
          align: "center",
          key: "endTime",
          width: 110
        },
        {
          title: "活动状态",
          align: "center",
          key: "status",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "VALID") {
              return (
                <div>
                  <tag color="success">有效</tag>
                </div>
              );
            } else if (row.status === "INVALID") {
              return (
                <div>
                  <tag color="error">失效</tag>
                </div>
              );
            } else if (row.status === "EXPIRE") {
              return (
                <div>
                  <tag color="primary">过期</tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">{row.status}</tag>
              </div>
            );
          },
          minWidth: 30
        },
        {
          title: "分享标题",
          align: "center",
          key: "shareName",
          minWidth: 60
        },
        {
          title: "分享图片",
          align: "center",
          key: "shareImageUrl",
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.shareImageUrl} width="100%" />;
            return <div>{str}</div>;
          },
          width: 100
        },
        {
          title: "红包个数",
          align: "center",
          key: "rewardCount"
        },
        {
          title: "最大红包开始位置",
          align: "center",
          key: "rewardPositionStart"
        },
        {
          title: "最大红包结束位置",
          align: "center",
          key: "rewardPositionEnd"
        },
        {
          title: "红包有效时间",
          align: "center",
          key: "rewardEffectiveTime"
        },
        {
          title: "活动规则描述",
          align: "center",
          key: "activityRuleDesc",
          tooltip: true,
          minWidth: 40
        },
        {
          title: "创建人",
          align: "center",
          key: "userName",
          minWidth: 30
        },
        {
          title: "创建时间",
          align: "center",
          key: "createTime",
          width: 110
        },
        {
          title: "操作",
          align: "center",
          minWidth: 90,
          key: "handle",
          options: ["view", "edit", "delete", "settings"]
        }
      ],
      relationColumns: [
        ...relationTempColumns,
        {
          title: "操作",
          minWidth: 100,
          key: "handle",
          options: ["inlineEdit", "delete"]
        }
      ],
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRelationRowData: _.cloneDeep(relationRowData),
      shareRewardDetail: _.cloneDeep(shareRewardDetail),
      relationDetail: _.cloneDeep(relationDetail),
      addRelationDetail: _.cloneDeep(relationDetail)
    };
  },
  computed: {
    priceComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.price);
    },
    minPriceComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.minPrice);
    }
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
      // this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.shareRewardDetail.shareImageUrl = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createShareReward();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editShareReward();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createShareReward() {
      this.modalViewLoading = true;
      createShareReward(this.shareRewardDetail)
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
    editShareReward() {
      this.modalViewLoading = true;
      editShareReward(this.shareRewardDetail)
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
    addShareReward() {
      // this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.shareRewardDetail = _.cloneDeep(shareRewardDetail);
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
      deleteShareReward({
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
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.shareRewardDetail = _.cloneDeep(params.row);
    },
    handleEdit(params) {
      // this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.shareRewardDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(this.shareRewardDetail);
      this.modalEdit = true;
    },
    getTableData() {
      getShareRewardPages(this.searchRowData)
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
      this.shareRewardDetail = this._.cloneDeep(params.row);
      if (params.row.onOff === "ON") {
        this.shareRewardDetail.onOff = "OFF";
      } else {
        this.shareRewardDetail.onOff = "ON";
      }
      this.loading = true;
      this.editShareReward();
    },
    startTimeChange(value, date) {
      this.shareRewardDetail.startTime = value;
    },
    endTimeChange(value, date) {
      this.shareRewardDetail.endTime = value;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.shareRewardDetail.shareImageUrl = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.shareRewardDetail.shareImageUrl = null;
      this.shareRewardDetail.shareImageUrl = fileList[0].url;
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.shareImageUrl != null) {
        const map = { status: "finished", url: "url" };
        const mainImgArr = [];
        map.url = res.shareImageUrl;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    onRelevance(params) {
      this.tempModalType = null;
      this.addRelationDetail.activityShareRewardId = params.row.id;
      this.searchRelationRowData.activityShareRewardId = params.row.id;
      this.getRelationTableData();
      this.modalEdit = true;
    },
    getRelationTableData() {
      getShareRewardSettingPages(this.searchRelationRowData)
        .then(res => {
          // 设置行是否可编辑
          if (res.rows.length !== 0) {
            res.rows.forEach(element => {
              element.isEdit = false;
            });
            this.relationDetail = res.rows;
          } else {
            this.relationDetail = null;
          }
          // this.total = res.total;
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
    addTempData(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 只能添加1个商品
          if (this.addRelationDetail.price > this.addRelationDetail.minPrice) {
            this.$Message.error("红包金额不能大于红包最小使用金额");
            return;
          }
          this.createRelation();
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    modalHandleEdit(params) {
      this.$set(params.row, "isEdit", true);
    },
    modalHandleSave(params) {
      const row = params.row;
      if (
        row.id == null ||
        row.id == 0 ||
        row.salePrice <= 0 ||
        row.goodsLimit <= 0 ||
        row.userLimit <= 0
      ) {
        this.$Message.error("请输入非0数");
        return;
      } else if (row.remainCount > row.goodsLimit) {
        this.$Message.error("限时数量不能大于商品总数量");
        return;
      }
      this.tempTableLoading = true;
      // 如果前端没有剩余数量字段,则初始化剩余数量=商品数量
      // row.remainCount = row.goodsLimit;
      editShareRewardSetting(row)
        .then(res => {
          this.getRelationTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
      this.tempTableLoading = false;
      this.$set(params.row, "isEdit", false);
      // console.log('modalHandleSave' + JSON.stringify(params.row));
    },
    modalHandleDelete(params) {
      this.tempTableLoading = true;
      deleteShareRewardSetting({ ids: params.row.id })
        .then(res => {
          this.relationDetail = this.relationDetail.filter(
            (item, index) => index !== params.row.initRowIndex
          );
          this.getRelationTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
    },
    priceInputNumberOnChange(value) {
      this.addRelationDetail.price = yuanToFenNumber(value);
    },
    minPriceInputNumberOnChange(value) {
      this.addRelationDetail.minPrice = yuanToFenNumber(value);
    },
    createRelation() {
      this.modalViewLoading = true;
      createShareRewardSetting(this.addRelationDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getRelationTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
