<template>
  <div class="m-role">
    <Card>
      <h4 v-if="couponDetail.activityName">当前活动：{{ couponDetail.activityName }}</h4>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="dataColumns"
        :loading="tempTableLoading"
        :search-area-column="16"
        :operate-area-column="8"
        editable
        searchable
        border
        @on-delete="handleDelete"
        @on-edit="handleEdit"
        @coupon-status="statusChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-view="handleView"
      >
        <div slot="operations">
          <Button
            v-waves
            v-show="showBack"
            class="search-btn ml5 mr5"
            type="primary"
            @click="goBack"
          >
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
          <Button
            v-waves
            :loading="createLoading"
            type="success"
            class="mr5"
            @click="addCouponTemplate('SMALL')"
          >
            <Icon type="md-add" />系统优惠券
          </Button>
          <Button
            v-waves
            :loading="createLoading"
            type="success"
            class="mr5"
            @click="addCouponTemplate('HD')"
          >
            <Icon type="md-add" />海鼎优惠券
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
    <!-- 查看 -->
    <Modal v-model="modalView" :width="800" draggable scrollable :mask-closable="false">
      <p slot="header">
        <span>关联的优惠劵详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">优惠券名称:</i-col>
              <i-col span="16">{{ addRelationDetail.couponName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">优惠券类型:</i-col>
              <i-col span="16">{{ addRelationDetail.couponType | couponTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">优惠/折扣额度:</i-col>
              <i-col
                span="16"
                v-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'"
              >{{ addRelationDetail.couponFee | fenToDiscountFilters }}</i-col>
              <i-col span="16" v-else>{{ addRelationDetail.couponFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">最小购买金额:</i-col>
              <i-col span="16">{{ addRelationDetail.minBuyFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">优惠券状态:</i-col>
              <i-col span="16">{{ addRelationDetail.couponStatus | couponStatusFilter }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">已兑换统计:</i-col>
              <i-col span="16">{{ addRelationDetail.receiveCount }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">券有效期类型:</i-col>
              <i-col span="16">{{ addRelationDetail.validDateType | validDateTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row
          class-name="mb20"
          v-show="addRelationDetail.validDateType=='UN_FIXED_DATE' && addRelationDetail.source == 'SMALL'"
        >
          <i-col span="12">
            <Row>
              <i-col span="8">生效开始:</i-col>
              <i-col span="16">{{ addRelationDetail.beginDay }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">有效天数:</i-col>
              <i-col span="16">{{ addRelationDetail.endDay }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row
          class-name="mb20"
          v-show="addRelationDetail.validDateType=='FIXED_DATE' && addRelationDetail.source == 'SMALL'"
        >
          <i-col span="12">
            <Row>
              <i-col span="8">生效时间:</i-col>
              <i-col span="16">{{ addRelationDetail.effectiveStartTime }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">失效时间:</i-col>
              <i-col span="16">{{ addRelationDetail.effectiveEndTime }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">发券总数:</i-col>
              <i-col span="16">{{ addRelationDetail.couponLimit }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">券使用范围:</i-col>
              <i-col span="16">{{ addRelationDetail.couponScope | couponScopeFilter }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">券使用限制:</i-col>
              <i-col span="16">{{ addRelationDetail.useLimitType | couponUseLimitFilter }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row>
          <i-col span="12">
            <Row>
              <i-col span="8">使用规则:</i-col>
              <i-col span="16">{{ addRelationDetail.couponRules }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <!-- 添加 -->
    <Modal v-model="modalAdd" :width="1000" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType == 'addTemplate'?'添加系统优惠券':'添加海鼎优惠券' }}</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            v-if="tempModalType == 'addTemplate'"
            ref="sysTables"
            v-model="couponTemplateData"
            :columns="templateColumns"
            :loading="tempTableLoading"
            highlight-row
            border
            searchable
            search-place="top"
            @on-current-change="handleTemplateChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input
                  v-model="searchTemplateRowData.couponName"
                  placeholder="优惠券名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Select
                  v-model="searchTemplateRowData.couponType"
                  placeholder="优惠券类型"
                  style="padding-right: 5px;width: 100px"
                  clearable
                >
                  <Option
                    v-for="(item,index) in couponTypeEnum"
                    :value="item.value"
                    :key="index"
                    :disabled="index==3"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100px"
                  >{{ item.label }}</Option>
                </Select>
                <Button
                  :loading="searchLoading"
                  class="search-btn mr5"
                  type="primary"
                  @click="handleTemplateSearch"
                >
                  <Icon type="md-search" />&nbsp;搜索
                </Button>
                <Button
                  v-waves
                  :loading="clearSearchLoading"
                  class="search-btn"
                  type="info"
                  @click="handleTemplateClear"
                >
                  <Icon type="md-refresh" />&nbsp;清除
                </Button>
              </Row>
            </div>
          </tables>

          <tables
            v-if="tempModalType=='addHdTemplate'"
            ref="hdTables"
            v-model="hdCouponTemplateData"
            :columns="hdTemplateColumns"
            :loading="tempTableLoading"
            border
            searchable
            highlight-row
            search-place="top"
            @on-current-change="handleHdTemplateChange"
          ></tables>

          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end" v-if="tempModalType == 'addTemplate'">
              <Page
                :total="couponTemplateTotal"
                :current="searchTemplateRowData.page"
                :page-size="searchTemplateRowData.rows"
                :page-size-opts="templatePageOpts"
                show-sizer
                show-total
                @on-change="changeProductPage"
                @on-page-size-change="changeProductPageSize"
              ></Page>
            </Row>
            <Row type="flex" justify="end" v-else>
              <Page
                :total="couponHdTemplateTotal"
                :current="searchHdTemplateRowData.page"
                :page-size="searchHdTemplateRowData.rows"
                :page-size-opts="templatePageOpts"
                show-sizer
                show-total
                @on-change="changeHdPage"
                @on-page-size-change="changeHdPageSize"
              ></Page>
            </Row>
          </div>

          <Divider>关联优惠券后配置</Divider>

          <Form
            ref="addForm"
            :model="addRelationDetail"
            :rules="relationRuleInline"
            :label-width="80"
          >
            <Row>
              <i-col span="6" v-if="tempModalType == 'addTemplate'">
                <FormItem label="券有效期:" prop="useLimitType">
                  <Select
                    v-model="addRelationDetail.validDateType"
                    placeholder="券有效期类型"
                    style="padding-right: 5px;width: 120px"
                  >
                    <Option
                      v-for="(item,index) in validDateTypeEnum"
                      :value="item.value"
                      :key="index"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 100px"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <template
                v-if="addRelationDetail.validDateType=='UN_FIXED_DATE' && tempModalType=='addTemplate'"
              >
                <i-col span="7">
                  <FormItem label="生效开始:" prop="beginDay">
                    <InputNumber
                      :min="0"
                      v-model="addRelationDetail.beginDay"
                      label="生效开始"
                      style="width: 160px"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="7">
                  <FormItem label="有效天数:" prop="endDay">
                    <InputNumber
                      :min="0"
                      v-model="addRelationDetail.endDay"
                      label="有效天数"
                      style="width: 160px"
                    ></InputNumber>
                  </FormItem>
                </i-col>
              </template>
              <template
                v-if="addRelationDetail.validDateType=='FIXED_DATE' && tempModalType=='addTemplate'"
              >
                <i-col span="7">
                  <FormItem label="生效时间:" prop="effectiveStartTime">
                    <DatePicker
                      :value="addRelationDetail.effectiveStartTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="生效时间"
                      style="width: 160px"
                      @on-change="effectiveStartTimeChange"
                    />
                  </FormItem>
                </i-col>
                <i-col span="7">
                  <FormItem label="失效时间:" prop="effectiveEndTime">
                    <DatePicker
                      :value="addRelationDetail.effectiveEndTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="结束时间"
                      style="width: 160px"
                      @on-change="effectiveEndTimeChange"
                    />
                  </FormItem>
                </i-col>
              </template>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="发券总数:" prop="couponLimit">
                  <InputNumber :min="0" v-model="addRelationDetail.couponLimit" label="限购数量"></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6" style="margin-right: 40px;">
                <FormItem
                  label="券使用范围:"
                  prop="couponScope"
                  v-show="tempModalType=='addHdTemplate'"
                  :label-width="100"
                >
                  <Select
                    v-model="addRelationDetail.couponScope"
                    placeholder="请选择"
                    style="padding-right: 5px;width: 100px"
                    clearable
                  >
                    <Option
                      v-for="(item,index) in couponScopeEnum"
                      :value="item.value"
                      :key="index"
                      :disabled="tempModalType=='addHdTemplate' && item.value==='SMALL'"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 100px"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem
                  label="券使用范围:"
                  prop="couponScope"
                  :label-width="100"
                  v-show="tempModalType=='addTemplate'"
                >{{ addRelationDetail.couponScope | couponScopeFilter}}</FormItem>
              </i-col>
              <i-col span="8">
                <FormItem
                  label="券使用限制:"
                  prop="useLimitType"
                  v-show="tempModalType=='addHdTemplate'"
                  :label-width="100"
                >
                  <Select
                    v-model="addRelationDetail.useLimitType"
                    placeholder="请选择"
                    style="padding-right: 5px;width: 120px"
                    clearable
                    :disabled="tempModalType=='addHdTemplate'"
                  >
                    <Option
                      v-for="(item,index) in couponUseLimitEnum"
                      :value="item.value"
                      :key="index"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 100px"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem
                  label="券使用限制:"
                  prop="useLimitType"
                  v-show="tempModalType=='addTemplate'"
                  :label-width="100"
                >{{ addRelationDetail.useLimitType | couponUseLimitFilter }}</FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="使用规则：" prop="couponRules" :label-width="100">
                  <Input
                    v-model="addRelationDetail.couponRules"
                    type="textarea"
                    :autosize="{minRows: 3,maxRows: 8}"
                    placeholder="请输入优惠券的使用规则"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
          </Form>*Tips：请先选择要关联的优惠券，然后输入关联配置信息，不可关联多个优惠券模板
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleTemplateAdd">确定</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :width="900" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>修改优惠券活动和模板关联</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="addRelationDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <i-col span="6">
              <FormItem label="优惠券类型:">{{ addRelationDetail.couponType | couponTypeFilter }}</FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="折扣额度:"
                prop="couponFee"
                v-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'"
              >{{ addRelationDetail.couponFee | fenToDiscountFilters }}</FormItem>
              <FormItem
                label="优惠金额:"
                prop="couponFee"
                v-else
              >{{ addRelationDetail.couponFee | fenToYuanDot2Filters }}</FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="最小购买金额:"
                prop="minBuyFee"
              >{{ addRelationDetail.minBuyFee | fenToYuanDot2Filters }}</FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="券使用限制:"
                prop="useLimitType"
                :label-width="100"
              >{{ addRelationDetail.useLimitType | couponUseLimitFilter }}</FormItem>
            </i-col>
          </Row>
          <Divider>可修改部分</Divider>
          <Row>
            <i-col span="6">
              <FormItem label="优惠券名称:">
                <Input v-model="addRelationDetail.couponName"></Input>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="发券限制:" prop="couponLimit">
                <InputNumber :min="0" v-model="addRelationDetail.couponLimit" label="限购数量"></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="优惠券状态:" prop="couponStatus">
                <Select
                  v-model="addRelationDetail.couponStatus"
                  placeholder="请选择"
                  style="padding-right: 5px;width: 120px"
                >
                  <Option
                    v-for="(item,index) in couponStatusEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row></Row>
          <Row>
            <i-col span="6">
              <FormItem
                label="券使用范围:"
                prop="couponScope"
                :label-width="100"
                v-if="addRelationDetail.source == 'SMALL'"
              >{{ addRelationDetail.couponScope | couponScopeFilter }}</FormItem>
              <FormItem label="券使用范围:" prop="couponScope" :label-width="100" v-else>
                <Select
                  v-model="addRelationDetail.couponScope"
                  placeholder="请选择"
                  style="padding-right: 5px;width: 100px"
                >
                  <Option
                    v-for="(item,index) in couponScopeEnum"
                    :value="item.value"
                    :key="index"
                    :disabled="index==2"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6" v-if="addRelationDetail.source == 'SMALL'">
              <FormItem label="券有效期:" prop="useLimitType">
                <Select
                  v-model="addRelationDetail.validDateType"
                  placeholder="券有效期类型"
                  style="padding-right: 5px;width: 120px"
                >
                  <Option
                    v-for="(item,index) in validDateTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <template
              v-if="addRelationDetail.source == 'SMALL' &&addRelationDetail.validDateType=='UN_FIXED_DATE'"
            >
              <i-col span="7">
                <FormItem label="发券后:" prop="beginDay">
                  <InputNumber
                    :min="0"
                    v-model="addRelationDetail.beginDay"
                    label="生效开始"
                    style="width: 90px"
                  ></InputNumber>&nbsp;天生效
                </FormItem>
              </i-col>
              <i-col span="7">
                <FormItem label="有效天数:" prop="endDay">
                  <InputNumber
                    :min="0"
                    v-model="addRelationDetail.endDay"
                    label="有效天数"
                    style="width: 90px"
                  ></InputNumber>&nbsp;天
                </FormItem>
              </i-col>
            </template>
            <template
              v-if="addRelationDetail.source == 'SMALL' && addRelationDetail.validDateType=='FIXED_DATE'"
            >
              <i-col span="7">
                <FormItem label="生效时间:" prop="effectiveStartTime">
                  <DatePicker
                    :value="addRelationDetail.effectiveStartTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="生效时间"
                    style="width: 160px"
                    @on-change="effectiveStartTimeChange"
                  />
                </FormItem>
              </i-col>
              <i-col span="7">
                <FormItem label="失效时间:" prop="effectiveEndTime">
                  <DatePicker
                    :value="addRelationDetail.effectiveEndTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="结束时间"
                    style="width: 160px"
                    @on-change="effectiveEndTimeChange"
                  />
                </FormItem>
              </i-col>
            </template>
          </Row>
          <!-- <Row>
            <i-col span="7">
              <FormItem
                label="生效时间:"
                prop="effectiveStartTime"
                v-if="addRelationDetail.source==='SMALL'"
              >
                <DatePicker
                  :value="addRelationDetail.effectiveStartTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="生效时间"
                  style="width: 160px"
                  @on-change="effectiveStartTimeChange"
                />
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="7">
              <FormItem
                label="失效时间:"
                prop="effectiveEndTime"
                v-if="addRelationDetail.source==='SMALL'"
              >
                <DatePicker
                  :value="addRelationDetail.effectiveEndTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束时间"
                  style="width: 160px"
                  @on-change="effectiveEndTimeChange"
                />
              </FormItem>
            </i-col>
          </Row>-->
          <Row>
            <i-col span="18">
              <FormItem label="使用规则:" prop="couponRules">
                <Input
                  v-model="addRelationDetail.couponRules"
                  :rows="6"
                  placeholder="使用规则"
                  type="textarea"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleTemplateEdit">确定</Button>
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
import _ from "lodash";
import {
  getRegisteredGiftPages,
  deleteRegisterGift,
  createRegisterGift,
  editRegisterGift,
  getCouponTemplatePages,
  getHdCouponActivitiesPages
} from "@/api/mini-program";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  couponStatusConvert,
  couponTypeConvert,
  couponScopeConvert,
  couponUseLimitConvert
} from "@/libs/converStatus";
import {
  couponStatusEnum,
  couponTypeEnum,
  couponScopeEnum,
  couponUseLimitEnum,
  validDateTypeEnum
} from "@/libs/enumerate";
import {
  compareData,
  getSmallCouponActivity,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  replaceByTag,
  replaceByTab
} from "@/libs/util";

// 优惠券活动对象
const couponDetail = {
  formBeginTime: null,
  formEndTime: null,
  activityShareId: 0,
  id: 0,
  activityRegisterId: 0,
  activityName: "",
  activityRuel: "",
  activityContent: "",
  ifEffective: null,
  beginTime: null,
  endTime: null,
  createUser: "",
  createTime: null,
  applicationType: null,
  activityImage: "",
  activityUrl: ""
};

// 关联的优惠券配置对象
const relationDetail = {
  activityCouponId: 0,
  couponName: "",
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: "",
  effectiveStartTime: null,
  effectiveEndTime: null,
  couponLimit: 0,
  receiveCount: 0,
  couponRules: "",
  couponScope: null,
  useLimitType: null,
  hdActivityId: 0,
  source: "SMALL", // 默认来源为系统对象
  validDateType: "FIXED_DATE",
  beginDay: 0,
  endDay: 0
};

// 系统优惠券模板对象
const couponTemplateDetail = {
  id: 0,
  couponName: "",
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: "",
  createUser: "",
  createTime: null,
  couponRules: "",
  couponScope: null
};

// 海鼎优惠券模板对象
const hdCouponTemplateDetail = {
  activityRegisterId: 0,
  beginDate: null,
  endDate: null,
  couponName: "",
  couponRemark: "",
  couponType: "",
  faceValue: 0,
  price: 0,
  useRule: ""
};

const roleRowData = {
  activityCouponId: null,
  // couponName: "",
  // couponStatus: "",
  // effectiveStartTime: null,
  // effectiveEndTime: null,
  page: 1,
  rows: 10
};

const templateRowData = {
  couponName: null,
  couponType: null,
  couponStatus: "VALID",
  page: 1,
  rows: 5
};

const hdTemplateRowData = {
  storeId: null,
  sortKey: null,
  desc: null,
  platformId: null,
  activityTypes: ["component"],
  activityRegisterId: null,
  page: 1,
  rows: 5
};

const dataColumns = [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "优惠券名称",
    key: "couponName",
    minWidth: 80
  },
  {
    title: "优惠券类型",
    key: "couponType",
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
      }
      return <div>{row.couponType}</div>;
    },
    minWidth: 50
  },
  {
    title: "券使用范围",
    key: "couponScope",
    minWidth: 40,
    render: (h, params, vm) => {
      const { row } = params;
      return <div>{couponScopeConvert(row.couponScope).label}</div>;
    }
  },
  {
    title: "券使用限制",
    key: "useLimitType",
    minWidth: 50,
    render: (h, params, vm) => {
      const { row } = params;
      return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
    }
  },
  {
    title: "来源",
    key: "source",
    minWidth: 40,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source === "SMALL") {
        return <div>小程序</div>;
      } else if (row.source === "HD") {
        return <div>海鼎</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: "优惠/折扣额度",
    key: "couponFee",
    minWidth: 60,
    render(h, params) {
      const { row } = params;
      if (row.couponType === "DISCOUNT_COUPON") {
        return <div>{fenToYuanDot2Number(row.couponFee) * 10 + "折"}</div>;
      } else {
        return <div>{fenToYuanDot2(row.couponFee)}</div>;
      }
    }
  },
  {
    title: "最小购买金额",
    key: "minBuyFee",
    minWidth: 50,
    render(h, params) {
      return h("div", fenToYuanDot2(params.row.minBuyFee));
    }
  },
  {
    title: "优惠券状态",
    key: "couponStatus",
    minWidth: 40,
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
    }
  },
  {
    title: "生效时间",
    key: "effectiveStartTime",
    minWidth: 50,
    render: (h, params, vm) => {
      const { row } = params;

      if (row.source == "SMALL") {
        return <div>{row.effectiveStartTime}</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: "失效时间",
    key: "effectiveEndTime",
    minWidth: 50,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source == "SMALL") {
        return <div>{row.effectiveEndTime}</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: "已领取统计",
    key: "receiveCount",
    minWidth: 40
  },
  {
    title: "发券总数限制",
    key: "couponLimit",
    minWidth: 50
  },
  {
    title: "操作",
    minWidth: 120,
    key: "handle",
    options: ["couponStatus", "view", "edit", "delete"]
  }
];

const templateColumns = [
  {
    type: "index",
    width: 60,
    align: "center"
  },
  {
    title: "优惠券名称",
    key: "couponName",
    minWidth: 80
  },
  {
    title: "优惠券类型",
    key: "couponType",
    minWidth: 80,
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
      }
      return <div>{row.couponType}</div>;
    }
  },
  // {
  //   title: '使用范围',
  //   key: 'couponScope',
  //   minWidth: 80,
  //   render: (h, params, vm) => {
  //     const { row } = params;
  //     if (row.couponScope === 'STORE') {
  //       return <div><tag color='magenta'>{couponScopeConvert(row.couponScope).label}</tag></div>;
  //     } else if (row.couponScope === 'STORE_AND_SMALL') {
  //       return <div><tag color='orange'>{couponScopeConvert(row.couponScope).label}</tag></div>;
  //     } else if (row.couponScope === 'SMALL') {
  //       return <div><tag color='cyan'>{couponScopeConvert(row.couponScope).label}</tag></div>;
  //     }
  //     return <div>N/A</div>;
  //   }
  // },
  {
    title: "优惠/折扣额度",
    key: "couponFee",
    minWidth: 80,
    render(h, params) {
      const { row } = params;
      if (row.couponType === "DISCOUNT_COUPON") {
        return <div>{fenToYuanDot2Number(row.couponFee) * 10 + "折"}</div>;
      } else {
        return <div>{fenToYuanDot2(row.couponFee)}</div>;
      }
    }
  },
  {
    title: "最小购买金额",
    key: "minBuyFee",
    minWidth: 80,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
    }
  },
  {
    title: "优惠券状态",
    key: "couponStatus",
    minWidth: 60,
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
    }
  },
  {
    title: "创建时间",
    minWidth: 120,
    key: "createTime"
  }
];

const hdTemplateColumns = [
  {
    type: "index",
    width: 60,
    align: "center"
  },
  {
    title: "优惠券名称",
    key: "couponName",
    minWidth: 80
  },
  {
    title: "优惠券类型",
    key: "couponType",
    minWidth: 80,
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
      }
      return <div>{row.couponType}</div>;
    }
  },
  {
    title: "券使用限制",
    key: "useLimitType",
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
    }
  },
  {
    title: "优惠/折扣额度",
    key: "faceValue",
    minWidth: 80,
    render(h, params) {
      const { row } = params;
      if (row.couponType === "DISCOUNT_COUPON") {
        const lastIndex = row.couponName.indexOf("折");
        const couponFee = row.couponName.substring(0, lastIndex + 1);
        return <div>{couponFee}</div>;
      } else {
        return <div>{fenToYuanDot2(row.faceValue)}</div>;
      }
    }
  },
  {
    title: "最小购买金额",
    key: "useRule",
    minWidth: 80,
    render(h, params, vm) {
      let useRule = params.row.useRule;
      const startIndex = useRule.indexOf("满");
      const endIndex = useRule.indexOf("元");
      const minBuyFee = useRule.slice(startIndex + 1, endIndex);
      return <div>{fenToYuanDot2(minBuyFee * 100)}</div>;
    }
  }
  // {
  //   title: '用券条件',
  //   key: 'useRule',
  //   minWidth: 80
  // },
  // {
  //   title: '券说明',
  //   key: 'couponRemark',
  //   minWidth: 80
  // },
  // {
  //   title: '活动起始时间',
  //   key: 'beginDate',
  //   minWidth: 120
  // },
  // {
  //   title: '活动结束时间',
  //   key: 'endDate',
  //   minWidth: 120
  // }
];

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      ruleInline: {
        effectiveStartTime: [{ required: true, message: "请选择生效时间" }],
        effectiveEndTime: [{ required: true, message: "请选择失效时间" }],
        couponStatus: [{ required: true, message: "请选择优惠券状态" }],
        couponType: [{ required: true, message: "请选择优惠券类型" }],
        couponName: [{ required: true, message: "请输入优惠券名称" }],
        couponScope: [{ required: true, message: "请选择券使用范围" }],
        couponRules: [{ required: true, message: "请输入券使用规则" }],
        couponLimit: [
          { required: true, message: "请输入发券限制数量" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            }
          }
        ]
      },
      relationRuleInline: {
        effectiveStartTime: [{ required: true, message: "请选择生效时间" }],
        effectiveEndTime: [{ required: true, message: "请选择失效时间" }],
        couponName: [{ required: true, message: "请输入优惠券名称" }],
        couponStatus: [{ required: true, message: "请选择优惠券状态" }],
        couponType: [{ required: true, message: "请选择优惠券类型" }],
        couponScope: [{ required: true, message: "请选择券使用范围" }],
        useLimitType: [{ required: true, message: "请选择券使用限制" }],
        couponRules: [{ required: true, message: "请输入券使用规则" }],
        couponLimit: [
          { required: true, message: "请输入发券限制数量" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            }
          }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      templatePageOpts: [5, 10],
      couponStatusEnum,
      couponTypeEnum,
      validDateTypeEnum,
      couponScopeEnum,
      couponUseLimitEnum,
      dataColumns: dataColumns,
      templateColumns: _.cloneDeep(templateColumns),
      hdTemplateColumns: _.cloneDeep(hdTemplateColumns),
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      searchHdTemplateRowData: _.cloneDeep(hdTemplateRowData),
      couponDetail: _.cloneDeep(couponDetail),
      addRelationDetail: _.cloneDeep(relationDetail),
      addRelationList: [],
      couponTemplateData: [],
      hdCouponTemplateData: [],
      couponTemplateTotal: 0,
      couponHdTemplateTotal: 0
    };
  },
  computed: {
    systemCouponFixDate() {
      return (
        this.tempModalType === "addTemplate" &&
        this.addRelationDetail.validDateType == "FIXED_DATE"
      );
    },
    systemCouponUnFixDate() {
      return (
        this.tempModalType === "addTemplate" &&
        this.addRelationDetail.validDateType == "UN_FIXED_DATE"
      );
    },
    minBuyFeeComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.minBuyFee);
    },
    showBack() {
      return this.$route.name === "small-vip-activities-associated";
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  methods: {
    statusChange(params) {
      this.addRelationDetail = _.cloneDeep(params.row);
      if (params.row.couponStatus === "VALID") {
        this.addRelationDetail.couponStatus = "INVALID";
      } else {
        this.addRelationDetail.couponStatus = "VALID";
      }
      this.editRegisterGift();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalCreate.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.couponDetail.storeImage = null;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.addRelationDetail = _.cloneDeep(params.row);
      console.log("current addRelationDetail:", this.addRelationDetail);
      // 编辑时处理下活动规则转换
      if (this.addRelationDetail.couponRules) {
        this.addRelationDetail.couponRules = replaceByTab(
          this.addRelationDetail.couponRules
        );
      }
      this.modalEdit = true;
    },
    goBack() {
      this.turnToPage("small-activity-register-reward");
    },
    getTableData() {
      // 获取优惠券活动页面传过来的优惠券活动信息
      if (this.$route.name === "small-vip-activities-associated") {
        const couponActivity = getSmallCouponActivity();
        // console.log('couponActivity from cookie: ', couponActivity);
        if (couponActivity) {
          // 给商品规格的商品和搜索条件赋值
          this.searchRowData.activityCouponId = couponActivity.id;
          this.addRelationDetail.activityCouponId = couponActivity.id;
          this.couponDetail = _.cloneDeep(couponActivity);
        }
      }
      this.getRelationTableData();
    },
    getRelationTableData() {
      getRegisteredGiftPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getTemplateTableData() {
      getCouponTemplatePages(this.searchTemplateRowData)
        .then(res => {
          this.couponTemplateData = res.rows;
          this.couponTemplateTotal = res.total;
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
    changeHdPage(page) {
      this.searchHdTemplateRowData.page = page;
      this.getHdTemplateTableData();
    },
    changeHdPageSize(pageSize) {
      this.searchHdTemplateRowData.page = 1;
      this.searchHdTemplateRowData.rows = pageSize;
      this.getHdTemplateTableData();
    },
    changeProductPage(page) {
      this.searchTemplateRowData.page = page;
      this.getTemplateTableData();
    },
    changeProductPageSize(pageSize) {
      this.searchTemplateRowData.page = 1;
      this.searchTemplateRowData.rows = pageSize;
      this.getTemplateTableData();
    },
    editRegisterGift() {
      // 编辑状态
      this.tempTableLoading = true;
      editRegisterGift(this.addRelationDetail)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success("修改成功!");
          this.getTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
    },
    handleTemplateSearch() {
      this.searchTemplateRowData.page = 1;
      this.searchLoading = true;
      this.getTemplateTableData();
    },
    handleTemplateClear() {
      this.clearSearchLoading = true;
      this.searchTemplateRowData = _.cloneDeep(templateRowData);
      this.handleTemplateSearch();
    },
    handleTemplateChange(currentRow, oldCurrentRow) {
      // 选中关联的优惠券模板冗余对应字段到配置对象中- 默认为最后选择的一条数据
      this.addRelationDetail.couponName = currentRow.couponName;
      this.addRelationDetail.couponFee = currentRow.couponFee;
      this.addRelationDetail.minBuyFee = currentRow.minBuyFee;
      this.addRelationDetail.couponStatus = currentRow.couponStatus;
      this.addRelationDetail.couponType = currentRow.couponType;
    },
    handleHdTemplateChange(currentRow, oldCurrentRow) {
      // 选中关联的优惠券模板冗余对应字段到配置对象中- 默认为最后选择的一条数据
      const startIndex = currentRow.useRule.indexOf("满");
      const endIndex = currentRow.useRule.indexOf("元");
      const minBuyFee = currentRow.useRule.slice(startIndex + 1, endIndex);
      this.addRelationDetail.useLimitType = currentRow.useLimitType; // 海鼎券的uselimitType从couponRemark解析出
      this.addRelationDetail.couponName = currentRow.couponName;
      this.addRelationDetail.couponType = currentRow.couponType;
      this.addRelationDetail.couponFee = currentRow.faceValue;
      if (currentRow.couponType === "DISCOUNT_COUPON") {
        const lastIndex = currentRow.couponName.indexOf("折");
        this.addRelationDetail.couponFee =
          parseFloat(currentRow.couponName.substring(0, lastIndex)) * 10;
        console.log(
          "DISCOUNT_COUPON couponFee:",
          this.addRelationDetail.couponFee
        );
      }
      this.addRelationDetail.hdActivityId = currentRow.activityRegisterId;
      this.addRelationDetail.minBuyFee = minBuyFee * 100;
      this.addRelationDetail.couponStatus = "VALID"; // 海鼎券默认为有效状态
      this.addRelationDetail.effectiveStartTime = currentRow.beginDate; //海鼎活动开始时间
      this.addRelationDetail.effectiveEndTime = currentRow.endDate; //海鼎活动结束时间
    },
    effectiveStartTimeChange(value, date) {
      this.addRelationDetail.effectiveStartTime = value;
    },
    effectiveEndTimeChange(value, date) {
      this.addRelationDetail.effectiveEndTime = value;
    },
    addCouponTemplate(name) {
      if (name === "SMALL") {
        this.getTemplateTableData();
        this.tempModalType = "addTemplate";
      } else {
        this.getHdTemplateTableData();
        this.tempModalType = "addHdTemplate";
      }
      // 添加对象初始化
      this.$refs.addForm.resetFields();
      this.addRelationDetail = _.cloneDeep(relationDetail);
      // 当展示的是添加系统优惠券
      if (this.tempModalType == "addTemplate") {
        this.addRelationDetail.couponScope = "SMALL";
        this.addRelationDetail.useLimitType = "SMALL_ALL";
      }
      this.modalAdd = true;
    },
    createRelation() {
      this.modalViewLoading = true;
      // 添加的是系统券，填写来源为系统优惠券 默认券有效期类型
      this.addRelationDetail.source = "SMALL";
      this.addRelationDetail.activityCouponId = this.couponDetail.id;
      console.log("before create:", this.addRelationDetail);
      this.addRelationList.push(this.addRelationDetail);
      createRegisterGift(this.addRelationList)
        .then(res => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success("创建成功!");
          this.getRelationTableData();
          this.addRelationList = [];
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    createHdRelation() {
      this.modalViewLoading = true;
      // 添加的是系统券，填写来源为系统优惠券
      this.addRelationDetail.source = "HD";
      this.addRelationDetail.activityCouponId = this.couponDetail.id;
      console.log("before create:", this.addRelationDetail);
      this.addRelationList.push(this.addRelationDetail);
      createRegisterGift(this.addRelationList)
        .then(res => {
          this.modalViewLoading = false;
          this.$Message.success("创建成功!");
          this.modalAdd = false;
          this.getRelationTableData();
          this.addRelationList = [];
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    getHdTemplateTableData() {
      getHdCouponActivitiesPages(this.searchHdTemplateRowData)
        .then(res => {
          this.hdCouponTemplateData = res.rows;
          this.couponHdTemplateTotal = res.total;
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
    handleTemplateEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (
            compareData(
              this.addRelationDetail.effectiveStartTime,
              this.addRelationDetail.effectiveEndTime
            )
          ) {
            this.$Message.error("结束时间必须大于开始时间!");
            return;
          }

          // 活动规则换行用“&”拼接
          if (this.addRelationDetail.couponRules) {
            this.addRelationDetail.couponRules = replaceByTag(
              this.addRelationDetail.couponRules
            );
          }

          if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.tempTableLoading = true;
            editRegisterGift(this.addRelationDetail)
              .then(res => {
                this.getRelationTableData();
                this.modalEdit = false;
              })
              .finally(res => {
                this.tempTableLoading = false;
              });
            this.tempTableLoading = false;
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    handleTemplateAdd() {
      let _this = this;
      if (this.addRelationDetail.couponName == "") {
        this.$Message.error("请先关联一张优惠券模板!");
        return false;
      }
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (
            compareData(
              this.addRelationDetail.effectiveStartTime,
              this.addRelationDetail.effectiveEndTime
            )
          ) {
            this.$Message.error("优惠券失效时间必须大于生效时间!");
            return;
          }
          // 活动规则换行用“&”拼接
          if (this.addRelationDetail.couponRules) {
            this.addRelationDetail.couponRules = replaceByTag(
              this.addRelationDetail.couponRules
            );
          }
          if (this.tempModalType === "addTemplate") {
            this.createRelation();
          } else if (this.tempModalType === "addHdTemplate") {
            this.createHdRelation();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.addRelationDetail = _.cloneDeep(params.row);
      this.replaceTextByTab();
      this.modalView = true;
    },
    replaceTextByTab() {
      // 编辑时处理下活动规则转换
      if (this.addRelationDetail.couponRules) {
        this.addRelationDetail.couponRules = replaceByTab(
          this.addRelationDetail.couponRules
        );
      }

      if (this.addRelationDetail.couponDetail) {
        this.addRelationDetail.couponDetail = replaceByTab(
          this.addRelationDetail.couponDetail
        );
      }

      if (this.addRelationDetail.couponReminderMsg) {
        this.addRelationDetail.couponReminderMsg = replaceByTab(
          this.addRelationDetail.couponReminderMsg
        );
      }
    },
    resetFields() {
      this.$refs.addForm.resetFields();
      this.addRelationDetail = _.cloneDeep(relationDetail);
      // this.$refs.uploadMain.clearFileList();
      // this.uploadListMain = [];
    },
    handleAddClose() {
      this.modalAdd = false;
    },
    // 批量删除-单行删除内部也是调用此方法
    deleteTable(ids) {
      this.tempTableLoading = true;
      deleteRegisterGift({ ids })
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
          this.getRelationTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
