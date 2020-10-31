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
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-sale="onOff"
        @on-relevance="handleSetting"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
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
            @click="addActivities"
          >
            <Icon type="md-add" />添加
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

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>活动信息详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动ID:</i-col>
              <i-col span="18">{{ activitiesDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">{{ activitiesDetail.activityName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">{{ activitiesDetail.startTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">{{ activitiesDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col span="18" v-if="activitiesDetail.status === 'VALID'">
                <tag color="success">{{ "有效" | imageStatusFilter }}</tag>
              </i-col>
              <i-col span="18" v-else-if="activitiesDetail.status === 'INVALID'">
                <tag color="error">{{ "无效" | imageStatusFilter }}</tag>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">默认次数:</i-col>
              <i-col span="18">{{ activitiesDetail.defaultCount }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">分享次数:</i-col>
              <i-col span="18">{{ activitiesDetail.shareCount }}</i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">宣传图片:</i-col>
              <i-col span="18">
                <img :src="activitiesDetail.banner" style="width: 150px" />
              </i-col>
            </Row>
          </i-col>
        </Row> -->
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动规则:</i-col>
              <i-col span="18">{{ activitiesDetail.content }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :mask-closable="false" :z-index="1000">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改活动':'创建活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="activitiesDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <Col span="22">
              <FormItem label="活动名称:" prop="activityName">
                <Input v-model="activitiesDetail.activityName" :readonly="activitiesDetail.isValid"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
              <FormItem label="开始时间:" prop="startTime">
                <DatePicker
                  :value="activitiesDetail.startTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="开始时间"
                  style="width: 160px"
                  @on-change="startTimeChange"
                  :readonly="activitiesDetail.isValid"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
              <FormItem label="结束时间:" prop="endTime">
                <DatePicker
                  :value="activitiesDetail.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束时间"
                  style="width: 160px"
                  @on-change="endTimeChange"
                  :readonly="activitiesDetail.isValid"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
              <FormItem label="默认次数:" prop="defaultCount">
                <InputNumber
                  :min="0"
                  v-model="activitiesDetail.defaultCount"
                  label="默认次数"
                  style="width: 160px"
                ></InputNumber>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
              <FormItem label="分享次数:" prop="shareCount">
                <InputNumber
                  :min="0"
                  v-model="activitiesDetail.shareCount"
                  style="width: 160px"
                  label="分享次数"
                ></InputNumber>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
              <FormItem label="活动状态:" prop="status">
                <Select v-model="activitiesDetail.status" clearable style="width: 160px">
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
          <!-- <Row>
            <FormItem label="活动图片:" prop="banner">
              <Input v-show="false" v-model="activitiesDetail.banner" style="width: auto"></Input>
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
                group-type="activity_image"
                file-dir="activity"
                @on-success="handleSuccessMain"
              >
                <div slot="content" style="width:58px;height:58px;line-height:58px">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </IViewUpload>
            </FormItem>
          </Row> -->
          <Row>
            <Col span="22">
              <FormItem label="活动规则:" prop="content">
                <Input
                  v-model="activitiesDetail .content"
                  :rows="6"
                  placeholder="活动规则"
                  type="textarea"
                ></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定</Button>
      </div>
    </Modal>

    <!-- 活动关联 -->
    <Modal v-model="modalRelevance" :mask-closable="false" :width="1200">
      <p slot="header">
        <span>{{ '添加七夕活动关联' }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
        <!-- 集字关联 -->
        <Card style="margin-bottom:16px">
          <tables
            ref="tablesCouponCon"
            v-model="collectWordSetting"
            :columns="collectWordColumns"
            :search-area-column="16"
            :operate-area-column="8"
            editable
            searchable
            border
            highlight-row
            search-place="top"
            @on-delete="onCollection"
            @on-edit="handleCollectWordEdit"
          >
            <div slot="searchCondition">
              <Row>
                <Button
                  v-waves
                  type="success"
                  class="mr5"
                  @click="relevanceAllocation('COLLECTION_SETTING')"
                >
                  <Icon type="md-add" />&nbsp;集字配置
                </Button>
              </Row>
            </div>
          </tables>
        </Card>
        <!-- 券关联 -->
        <Card style="margin-bottom:16px">
          <tables
            ref="tablesCouponCon"
            v-model="couponConfigManageRelations"
            :columns="couponCondataColumns"
            :search-area-column="16"
            :operate-area-column="8"
            editable
            searchable
            border
            highlight-row
            search-place="top"
            @on-delete="onRelevanceSale"
          >
            <div slot="searchCondition">
              <Row>
                <Button
                  v-waves
                  type="success"
                  class="mr5"
                  @click="relevanceAllocation('HOLIDAY_ACTIVITY_COUPON')"
                >
                  <Icon type="md-add" />&nbsp;关联活动优惠券
                </Button>
              </Row>
            </div>
          </tables>
        </Card>
      </div>
      <div slot="footer">
        <Button @click="handleRelevanceClose">关闭</Button>
      </div>
    </Modal>
    <!-- 券列表 -->
    <Modal v-model="modalAddCoupun" :width="1000" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ "关联优惠券" }}</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            ref="tablesCouponTemplate"
            v-model="couponTemplateData"
            :columns="templateColumns"
            highlight-row
            border
            searchable
            search-place="top"
            @on-current-change="handleTemplateChange"
          ></tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="couponTemplateTotal"
                :current="searchTemplateRowData.page"
                :page-size="searchTemplateRowData.rows"
                show-sizer
                show-total
                @on-change="changeCouponPage"
                @on-page-size-change="changeCouponPageSize"
              ></Page>
            </Row>
          </div>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button
          :loading="modalRelevanceLoading"
          type="primary"
          @click="handleRelevanceAdd('HOLIDAY_ACTIVITY_COUPON')"
        >确定</Button>
      </div>
    </Modal>
    <!-- 集字配置 -->
    <Modal v-model="modalAddCollection" :width="600" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ isCreateStatus?'新增集字配置':'修改集字配置'}}</i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="modalCollection"
          :model="collectWordSettingRelation"
          :rules="collectWordRuleInline"
          :label-width="100"
        >
          <Row>
            <Col span="18">
              <FormItem label="集字名称:" prop="wordKeyName">
                <Input v-model="collectWordSettingRelation.wordKeyName"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
              <FormItem label="集字发放比例:" prop="wordKeyScale">
                <InputNumber
                  :min="0"
                  v-model="collectWordSettingRelation.wordKeyScale"
                  style="width: 160px"
                ></InputNumber>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
              <FormItem label="排序:" prop="rank">
                <InputNumber
                  :min="0"
                  v-model="collectWordSettingRelation.rank"
                  style="width: 160px"
                ></InputNumber>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button
          :loading="modalRelevanceLoading"
          type="primary"
          @click="handleRelevanceAdd('COLLECTION_SETTING')"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import IViewUpload from "_c/iview-upload";
import {
  getUnifyActivityPages,
  updateUnifyActivity,
  createUnifyActivity,
  getUnifyActivity,
  getCouponPagess,
  deleteUnifyActivityRelevance,
  deleteWollectWordRelevance,
  createUnifyActivityRelevance,
  createWollectWordRelevance,
  updateWollectWordRelevance,
} from "@/api/mini-program";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  couponStatusConvert,
  couponTypeConvert,
  couponScopeConvert,
  couponUseLimitConvert,
  userScopeConvert,
  customPlanStatusConvert,
  imageStatusConvert,
  teamBuyStatusConvert,
} from "@/libs/converStatus";
import {
  couponStatusEnum,
  couponTypeEnum,
  couponScopeEnum,
  couponUseLimitEnum,
  validDateTypeEnum,
  userScopeEnum,
  teamBuyStatusEnum,
  teamBuyTypeEnum,
  rewardActivitySettingEnum,
  relationStoreTypeEnum,
} from "@/libs/enumerate";
import {
  compareData,
  getSmallCouponActivity,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  replaceByTag,
  replaceByTab,
  HdDiscount,
  compareCouponData,
  secondsToDate,
} from "@/libs/util";

const activitiesDetail = {
  activityName: "",
  activityType: "COLLECT_WORD_ACTIVITY",
  banner: null,
  content: "",
  createTime: null,
  createUser: "",
  endTime: null,
  extendedJsonStr: null,
  startTime: null,
  status: "VALID",
  defaultCount: null,
  shareCount: null,
  isValid: null,
};

const activitySettingRelation = {
  activitySettingId: "",
  couponFee: "",
  couponName: "",
  couponStatus: "",
  couponType: "",
  effectiveEndTime: "",
  effectiveStartTime: "",
  minBuyFee: "",
  rank: "",
  relationId: "",
  relationType: "",
  source: "",
  status: "",
};

const collectWordSettingRelation = {
  activitySettingId: "",
  rank: 0,
  wordKeyName: "",
  wordKeyScale: 0,
};

const roleRowData = {
  status: "",
  activityName: null,
  page: 1,
  rows: 10,
  sidx: "createTime",
  sort: "desc",
};
// 优惠券
const templateRowData = {
  couponBusinessType: "HOLIDAY_ACTIVITY_COUPON",
  page: 1,
  rows: 10,
  sidx: "createTime",
  sort: "desc",
};

const templateColumns = [
  {
    type: "index",
    width: 60,
    align: "center",
  },
  {
    title: "券名称",
    key: "couponName",
    align: "center",
    minWidth: 90,
  },
  {
    title: "券类型",
    align: "center",
    key: "couponType",
    minWidth: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === "FULL_CUT_COUPON") {
        return (
          <div>
            <tag color="magenta">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "DISCOUNT_COUPON") {
        return (
          <div>
            <tag color="orange">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "CASH_COUPON") {
        return (
          <div>
            <tag color="cyan">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "FREIGHT_COUPON") {
        return (
          <div>
            <tag color="blue">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    },
  },
  {
    title: "优惠/折扣额度",
    align: "center",
    key: "couponFee",
    minWidth: 130,
    render(h, params) {
      const { row } = params;
      if (row.couponType === "DISCOUNT_COUPON") {
        return <div>{row.couponFee / 10 + "折"}</div>;
      } else {
        return <div>{fenToYuanDot2(params.row.couponFee)}</div>;
      }
    },
  },
  {
    title: "最小购买金额",
    key: "minBuyFee",
    align: "center",
    minWidth:120,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
    },
  },
  {
    title: "最高优惠金额",
    align: "center",
    key: "maxDiscountFee",
    minWidth: 120,
    render(h, params) {
      if (params.row.maxDiscountFee) {
        return <div>{fenToYuanDot2(params.row.maxDiscountFee)}</div>;
      } else {
        return <div>{"N/A"}</div>;
      }
    },
  },
  {
    title: "券状态",
    key: "couponStatus",
    align: "center",
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponStatus === "VALID") {
        return (
          <div>
            <tag color="success">
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      } else if (row.couponStatus === "INVALID") {
        return (
          <div>
            <tag color="error">
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      }
      return <div>{row.couponStatus}</div>;
    },
  },
  // {
  //   title: "创建时间",
  //   align: "center",
  //   minWidth: 120,
  //   key: "createTime",
  // },
];

export default {
  components: {
    Tables,
    IViewUpload,
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      ruleInline: {
        activityName: [{ required: true, message: "请输入活动名称" }],
        status: [{ required: true, message: "请选择活动状态" }],
        // banner: [{ required: true, message: "请添加活动图片" }],
        status: [{ required: true, message: "请选择活动状态" }],
        content: [{ required: true, message: "请输入活动规则" }],
        startTime: [{ required: true, message: "请选择活动开始时间" }],
        endTime: [{ required: true, message: "请选择活动结束时间" }],
        defaultCount: [{ required: true, message: "请选输入默认次数" }],
        shareCount: [{ required: true, message: "请选输入分享次数" }],
      },
      collectWordRuleInline: {
        wordKeyName: [{ required: true, message: "请输入集字名称" }],
        wordKeyScale: [{ required: true, message: "请输入集字发放比例" }],
        rank: [{ required: true, message: "请添加排序" }],
      },
      defaultListMain: [],
      uploadListMain: [],
      couponConfigManageRelations: [],
      collectWordSetting: [],
      couponTemplateData: [],
      couponTemplateTotal: 0,
      couponStatusEnum,
      couponStatusEnum,
      couponTypeEnum,
      couponScopeEnum,
      couponUseLimitEnum,
      validDateTypeEnum,
      userScopeEnum,
      teamBuyStatusEnum,
      teamBuyTypeEnum,
      rewardActivitySettingEnum,
      relationStoreTypeEnum,
      templateColumns: templateColumns,
      columns: [
        {
          title: "活动ID",
          align: "center",
          key: "id",
          minWidth: 90,
        },
        {
          title: "活动名称",
          align: "center",
          key: "activityName",
          minWidth: 260,
        },
        {
          title: "开始时间",
          align: "center",
          key: "startTime",
          minWidth: 120,
        },
        {
          title: "结束时间",
          align: "center",
          key: "endTime",
          minWidth: 180,
          render: (h, params, vm) => {
            const { row } = params;
            if (!compareCouponData(row.endTime)) {
              return <div style="color:red">{row.endTime + "已过期"}</div>;
            } else {
              return <div>{row.endTime}</div>;
            }
          },
        },
        {
          title: "默认次数",
          align: "center",
          minWidth: 100,
          key: "defaultCount",
          render: (h, params, vm) => {
            const { row } = params;
            const str = JSON.parse(row.extendedJsonStr);
            return <div>{str.defaultCount}</div>;
          },
        },
        {
          title: "分享次数",
          align: "center",
          minWidth: 100,
          key: "shareCount",
          render: (h, params, vm) => {
            const { row } = params;
            const str = JSON.parse(row.extendedJsonStr);
            return <div>{str.shareCount}</div>;
          },
        },
        {
          title: "活动状态",
          align: "center",
          key: "status",
          minWidth: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "VALID") {
              return (
                <div>
                  <tag color="success">
                    {couponStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === "INVALID") {
              return (
                <div>
                  <tag color="error">
                    {couponStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">{"N/A"}</tag>
              </div>
            );
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 200,
          key: "handle",
          options: ["onSale", "view", "edit", "settings"],
        },
      ],
      // 优惠券
      couponCondataColumns: [
        {
          title: "券名称",
          align: "center",
          key: "couponName",
          minWidth: 100,
        },
        {
          title: "券类型",
          align: "center",
          key: "couponType",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponType === "FULL_CUT_COUPON") {
              return (
                <div>
                  <tag color="magenta">
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === "DISCOUNT_COUPON") {
              return (
                <div>
                  <tag color="orange">
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === "CASH_COUPON") {
              return (
                <div>
                  <tag color="cyan">
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === "FREIGHT_COUPON") {
              return (
                <div>
                  <tag color="blue">
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.couponType}</div>;
          },
          minWidth: 90,
        },
        {
          title: "优惠/折扣额度",
          align: "center",
          key: "couponFee",
          minWidth: 120,
          render(h, params) {
            const { row } = params;
            if (row.couponType === "DISCOUNT_COUPON") {
              return <div>{row.couponFee / 10 + "折"}</div>;
            } else {
              return <div>{fenToYuanDot2(row.couponFee)}</div>;
            }
          },
        },
        {
          title: "最小购买金额",
          align: "center",
          key: "minBuyFee",
          minWidth: 130,
          render(h, params) {
            return h("div", fenToYuanDot2(params.row.minBuyFee));
          },
        },
        {
          title: "最高优惠金额",
          align: "center",
          key: "maxDiscountFee",
          minWidth: 130,
          render(h, params) {
            const { row } = params;
            if (row.maxDiscountFee != null) {
              return <div>{fenToYuanDot2(row.maxDiscountFee)}</div>;
            } else {
              return <div>{"N/A"}</div>;
            }
          },
        },
        {
          title: "生效时间",
          key: "effectiveStartTime",
          align: "center",
          minWidth: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.source == "SMALL" && row.validDateType === "FIXED_DATE") {
              return <div>{row.effectiveStartTime}</div>;
            } else if (
              row.source == "SMALL" &&
              row.validDateType === "UN_FIXED_DATE"
            ) {
              return <div>{row.beginDay}</div>;
            } else if (row.source == "HD") {
              return <div>{row.effectiveStartTime}</div>;
            } else {
              return <div>N/A</div>;
            }
          },
        },
        {
          title: "失效时间",
          key: "effectiveEndTime",
          align: "center",
          minWidth: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.source == "SMALL" && row.validDateType === "FIXED_DATE") {
              if (!compareCouponData(row.effectiveEndTime)) {
                return (
                  <div style="color:red">{row.effectiveEndTime + "已过期"}</div>
                );
              } else {
                return <div>{row.effectiveEndTime}</div>;
              }
            } else if (
              row.source == "SMALL" &&
              row.validDateType === "UN_FIXED_DATE"
            ) {
              return <div>{row.endDay}</div>;
            } else if (row.source == "HD") {
              if (!compareCouponData(row.effectiveEndTime)) {
                return (
                  <div style="color:red">{row.effectiveEndTime + "已过期"}</div>
                );
              } else {
                return <div>{row.effectiveEndTime}</div>;
              }
            } else {
              return <div>N/A</div>;
            }
          },
        },
        {
          title: "排序",
          align: "center",
          minWidth: 70,
          key: "rank",
          render(h, params) {
            const { row } = params;
            return h("div", row.rank);
          },
        },
        {
          title: "状态",
          align: "center",
          key: "status",
          minWidth: 70,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "ON") {
              return (
                <div>
                  <tag color="success">{"上架"}</tag>
                </div>
              );
            } else if (row.status === "OFF") {
              return (
                <div>
                  <tag color="error">{"下架"}</tag>
                </div>
              );
            }
            return <div>{"N/A"}</div>;
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 70,
          key: "handle",
          options: ["delete"],
        },
      ],
      collectWordColumns: [
        {
          title: "集字名称",
          align: "center",
          key: "wordKeyName",
        },
        {
          title: "集字发放比例",
          align: "center",
          key: "wordKeyScale",
          render(h, params) {
            const { row } = params;
            return h("div", row.wordKeyScale + "%");
          },
        },
        {
          title: "排序",
          align: "center",
          key: "rank",
          render(h, params) {
            const { row } = params;
            return h("div", row.rank);
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 90,
          key: "handle",
          options: ["edit", "delete"],
        },
      ],
      createLoading: false,
      modalViewLoading: false,
      modalRelevance: false,
      modalAddCoupun: false,
      modalAddCollection: false,
      activitySettingId: null,
      activityIsValid: null,
      modalRelevanceLoading: false,
      isCreateStatus: true,
      searchRowData: _.cloneDeep(roleRowData),
      activitiesDetail: _.cloneDeep(activitiesDetail),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      activitySettingRelation: this._.cloneDeep(activitySettingRelation),
      collectWordSettingRelation: this._.cloneDeep(collectWordSettingRelation),
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
      this.uploadListMain = [];
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 活动规则换行用“&”拼接
          this.activitiesDetail.content = this.activitiesDetail.content.replace(
            /\n|\r/g,
            "&"
          );
          let extendedData = {};
          extendedData.defaultCount = this.activitiesDetail.defaultCount;
          extendedData.shareCount = this.activitiesDetail.shareCount;
          this.activitiesDetail.extendedJsonStr = JSON.stringify(extendedData);
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createUnifyActivity();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.updateUnifyActivity();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createUnifyActivity() {
      this.modalViewLoading = true;
      createUnifyActivity(this.activitiesDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    updateUnifyActivity() {
      this.modalViewLoading = true;
      updateUnifyActivity(this.activitiesDetail)
        .then((res) => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.$Message.success("修改成功!");
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addActivities() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.activitiesDetail = _.cloneDeep(activitiesDetail);
      }

      this.modalEdit = true;
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.activitiesDetail = _.cloneDeep(params.row);
      this.activitiesDetail.defaultCount = JSON.parse(
        params.row.extendedJsonStr
      ).defaultCount;
      this.activitiesDetail.shareCount = JSON.parse(
        params.row.extendedJsonStr
      ).shareCount;
      this.activitiesDetail.content = this.activitiesDetail.content.replace(
        /&/g,
        "\n"
      );
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.activitiesDetail = _.cloneDeep(params.row);
      this.activitiesDetail.defaultCount = JSON.parse(
        params.row.extendedJsonStr
      ).defaultCount;
      this.activitiesDetail.shareCount = JSON.parse(
        params.row.extendedJsonStr
      ).shareCount;
      this.activitiesDetail.content = this.activitiesDetail.content.replace(
        /&/g,
        "\n"
      );
      this.modalEdit = true;
    },
    getTableData() {
      getUnifyActivityPages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
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
    // 券列表
    getTemplateTableData() {
      getCouponPagess(this.searchTemplateRowData)
        .then((res) => {
          this.couponTemplateData = res.rows;
          this.couponTemplateTotal = res.total;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //查看活动关联
    getUnifyActivity(id) {
      getUnifyActivity(id)
        .then((res) => {
          this.couponConfigManageRelations = res.activitySettingRelations;
          this.collectWordSetting = res.collectWordSettings;
        })
        .finally(() => {});
    },
    onOff(params) {
      this.activitiesDetail = this._.cloneDeep(params.row);
      if (params.row.status === "VALID") {
        this.activitiesDetail.status = "INVALID";
      } else {
        this.activitiesDetail.status = "VALID";
      }
      this.loading = true;
      this.updateUnifyActivity();
    },
    startTimeChange(value, date) {
      this.activitiesDetail.startTime = value;
    },
    endTimeChange(value, date) {
      this.activitiesDetail.endTime = value;
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.banner != null) {
        const map = { status: "finished", url: "url" };
        const mainImgArr = [];
        map.url = res.banner;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.activitiesDetail.banner = null;
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.activitiesDetail.banner = null;
      this.activitiesDetail.banner = fileList[0].url;
    },
    handleSetting(params) {
      this.activitySettingId = params.row.id;
      this.activityIsValid = params.row.isValid;
      this.getUnifyActivity(this.activitySettingId);
      this.modalRelevance = true;
    },
    handleRelevanceClose() {
      this.modalRelevance = false;
    },
    //上下架
    onRelevanceSale(params) {
      if (this.activityIsValid) {
        this.$Message.info("活动进行中不允许修改!");
      } else {
        this.activitySettingRelation = this._.cloneDeep(params.row);
        this.deleteUnifyActivityRelevance(this.activitySettingRelation);
      }
    },
    onCollection(params) {
      if (this.activityIsValid) {
        this.$Message.info("活动进行中不允许修改!");
      } else {
        this.collectWordSettingRelation = this._.cloneDeep(params.row);
        this.deleteWollectWordRelevance(this.collectWordSettingRelation);
      }
    },
    //统一关闭
    handleAddClose() {
      this.modalAddCoupun = false;
      this.modalAddCollection = false;
    },
    relevanceAllocation(value) {
      this.searchTemplateRowData = _.cloneDeep(templateRowData);
      this.collectWordSettingRelation = _.cloneDeep(collectWordSettingRelation);
      if (value === "HOLIDAY_ACTIVITY_COUPON") {
        let couponNum = 0;
        // 列表只允许有一张券
        for (let val of this.couponConfigManageRelations) {
          if (val.status === "ON") {
            couponNum++;
          }
        }
        if (couponNum == 0) {
          this.getTemplateTableData();
          this.modalAddCoupun = true;
        } else {
          this.$Message.info("当前存在有效的优惠券(只允许关联一张)!");
          return;
        }
      } else if (value === "COLLECTION_SETTING") {
        this.isCreateStatus = true;
        this.modalAddCollection = true;
        this.collectWordSettingRelation.activitySettingId = this.activitySettingId;
      }
    },
    handleTemplateChange(currentRow, oldCurrentRow) {
      const currentTemplate = currentRow;
      this.activitySettingRelation.relationId = currentTemplate.id;
      this.activitySettingRelation.status = "ON";
      this.activitySettingRelation.relationType = "HOLIDAY_ACTIVITY_COUPON";
      this.activitySettingRelation.activitySettingId = this.activitySettingId;
      this.activitySettingRelation.rank = 1;
    },
    changeCouponPage(page) {
      this.searchTemplateRowData.page = page;
      this.getTemplateTableData();
    },
    changeCouponPageSize(pageSize) {
      this.searchTemplateRowData.page = 1;
      this.searchTemplateRowData.rows = pageSize;
      this.getTemplateTableData();
    },
    deleteUnifyActivityRelevance(data) {
      deleteUnifyActivityRelevance(data)
        .then((res) => {
          this.getUnifyActivity(this.activitySettingId);
          this.$Message.success("删除成功!");
        })
        .finally(() => {});
    },
    deleteWollectWordRelevance(data) {
      deleteWollectWordRelevance(data)
        .then((res) => {
          this.getUnifyActivity(this.activitySettingId);
          this.$Message.success("删除成功!");
        })
        .finally(() => {});
    },
    handleRelevanceAdd(value) {
      if (value === "HOLIDAY_ACTIVITY_COUPON") {
        if (
          !this.activitySettingRelation.activitySettingId &&
          !this.activitySettingRelation.relationId
        ) {
          this.$Message.error("请先关联活动配置!");
          return;
        }
        createUnifyActivityRelevance(this.activitySettingRelation)
          .then((res) => {
            this.modalAddCoupun = false;
            this.getUnifyActivity(this.activitySettingId);
            this.activitySettingRelation = this._.cloneDeep(
              activitySettingRelation
            );
            this.$Message.success("添加成功!");
          })
          .finally(() => {
            this.modalRelevanceLoading = false;
          });
      } else if (value === "COLLECTION_SETTING") {
        if (this.isCreateStatus) {
          createWollectWordRelevance(this.collectWordSettingRelation)
            .then((res) => {
              this.modalAddCollection = false;
              this.getUnifyActivity(this.activitySettingId);
              this.collectWordSettingRelation = this._.cloneDeep(
                collectWordSettingRelation
              );
              this.$Message.success("添加成功!");
            })
            .finally(() => {
              this.modalRelevanceLoading = false;
            });
        } else {
          // 修改
          updateWollectWordRelevance(this.collectWordSettingRelation)
            .then((res) => {
              this.modalAddCollection = false;
              this.getUnifyActivity(this.activitySettingId);
              this.collectWordSettingRelation = this._.cloneDeep(
                collectWordSettingRelation
              );
              this.$Message.success("修改成功!");
            })
            .finally(() => {
              this.modalRelevanceLoading = false;
            });
        }
      }
    },
    // 集字修改
    handleCollectWordEdit(params) {
      if (this.activityIsValid) {
        this.$Message.info("活动进行中不允许修改!");
      } else {
        this.isCreateStatus = false;
        this.collectWordSettingRelation = _.cloneDeep(params.row);
        this.modalAddCollection = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
