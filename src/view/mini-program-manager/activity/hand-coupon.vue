<template>
  <div class="m-role">
    <Card>
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
        highlight-row
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-current-change="onCurrentChange"
        @coupon-status="statusChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <!--  @on-delete="handleDelete" -->
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.couponName"
              placeholder="优惠券名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.couponStatus"
              placeholder="优惠券状态"
              style="padding-right: 5px;width: 100px"
            >
              <Option
                v-for="(item,index) in couponStatusEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.couponBusinessType"
              placeholder="发券类型"
              style="padding-right: 5px;width: 120px"
              @on-change="handCouponType"
            >
              <Option
                v-for="(item,index) in activityClassify"
                :value="item.indexName"
                :key="index"
                class="ptb2-5"
              >{{ item.indexValue }}</Option>
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
            @click="addCouponTemplate"
          >
            <Icon type="md-add" />系统优惠券
          </Button>
          <Button
            v-waves
            :loading="createLoading"
            type="success"
            class="mr5"
            @click="addHdCouponTemplate"
          >
            <Icon type="md-add" />海鼎优惠券
          </Button>
          <Button class="mr5" @click="onRelevance" type="primary">
            <Icon type="md-add" />
            {{hdCouponType}}
          </Button>
          <!-- <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
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
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>
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
              <i-col span="16" v-if="addRelationDetail.couponType === 'FULL_CUT_COUPON'">
                <tag color="magenta">{{ "满减券" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'">
                <tag color="orange">{{ "折扣券" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.couponType === 'CASH_COUPON'">
                <tag color="cyan">{{ "现金券" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.couponType === 'FREIGHT_COUPON'">
                <tag color="cyan">{{ "运费券" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.couponType === null">{{ "N/A" }}</i-col>
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
              <i-col span="16" v-if="addRelationDetail.couponStatus === 'VALID'">
                <tag color="success">{{ "有效" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.couponStatus === 'INVALID'">
                <tag color="error">{{ "无效" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.couponStatus === null">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
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
              <i-col span="8">券使用范围:</i-col>
              <i-col span="16" v-if="addRelationDetail.couponScope === 'STORE'">
                <tag color="magenta">{{ "门店" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.couponScope === 'SMALL'">
                <tag color="cyan">{{ "商城" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.couponScope === 'STORE_AND_SMALL'">
                <tag color="orange">{{ "全场通用" }}</tag>
              </i-col>
              <i-col span="16" v-else-if="addRelationDetail.couponScope === null">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">券使用限制:</i-col>
              <i-col span="16">{{ addRelationDetail.useLimitType | couponUseLimitFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="20">
            <Row>
              <i-col span="5">使用规则:</i-col>
              <i-col span="18">{{ addRelationDetail.couponRules }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <Modal
      v-model="modalAdd"
      :width="1000"
      :z-index="1000"
      :mask-closable="false"
      @on-visible-change="handleModalAdd"
    >
      <p slot="header">
        <i-col>{{ tempModalType == 'addTemplate'?'添加系统优惠券':'添加海鼎优惠券' }}</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            v-if="tempModalType == 'addTemplate'"
            ref="tables"
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
            ref="tables"
            v-model="hdCouponTemplateData"
            :columns="hdTemplateColumns"
            :loading="tempTableLoading"
            highlight-row
            border
            searchable
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
            :label-width="100"
          >
            <Row>
              <i-col span="6">
                <FormItem label="优惠券名称:" prop="couponName">
                  <Input
                    v-model="addRelationDetail.couponName"
                    clearable
                    style="padding-right: 5px;width: 125px"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>

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
                  <FormItem label="发放券后:" prop="beginDay">
                    <InputNumber
                      :min="0"
                      v-model="addRelationDetail.beginDay"
                      label="生效开始"
                      style="width: 95px"
                    ></InputNumber>&nbsp;天生效
                  </FormItem>
                </i-col>
                <i-col span="7">
                  <FormItem label="有效天数:" prop="endDay">
                    <InputNumber
                      :min="0"
                      v-model="addRelationDetail.endDay"
                      label="有效天数"
                      style="width: 95px"
                    ></InputNumber>&nbsp;天
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
                <FormItem
                  label="券使用范围:"
                  prop="couponScope"
                  :label-width="100"
                  v-if="tempModalType=='addTemplate'"
                >{{ addRelationDetail.couponScope | couponScopeFilter }}</FormItem>
                <FormItem label="券使用范围:" prop="couponScope" :label-width="100" v-else>
                  <Select
                    v-model="addRelationDetail.couponScope"
                    placeholder="请选择"
                    style="padding-right: 5px;width: 120px"
                  >
                    <Option
                      v-for="(item,index) in couponScopeEnum"
                      :value="item.value"
                      :key="index"
                      :disabled="index===2"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 100px"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem
                  label="券使用限制:"
                  prop="useLimitType"
                  :label-width="100"
                  v-if="tempModalType=='addTemplate'"
                >{{ addRelationDetail.useLimitType | couponUseLimitFilter }}</FormItem>
                <FormItem label="券使用限制:" prop="useLimitType" :label-width="100" v-else>
                  <Select
                    v-model="addRelationDetail.useLimitType"
                    placeholder="请选择"
                    style="padding-right: 5px;width: 100px"
                    disabled
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
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="使用规则:" prop="couponRules" :label-width="100">
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
    <Modal v-model="modalEdit" :mask-closable="false" :width="1000" draggable>
      <p slot="header">
        <span>修改优惠券配置</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="addRelationDetail"
          :rules="relationRuleInline"
          :label-width="80"
        >
          <Row>
            <i-col span="6">
              <FormItem
                label="优惠券类型:"
                prop="couponType"
              >{{ addRelationDetail.couponType | couponTypeFilter }}</FormItem>
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
                :label-width="100"
              >{{ addRelationDetail.minBuyFee | fenToYuanDot2Filters }}</FormItem>
            </i-col>
          </Row>

          <Divider>可修改部分</Divider>
          <Row>
            <i-col span="6">
              <FormItem label="优惠券名称:" prop="couponName" :label-width="100">
                <Input
                  v-model="addRelationDetail.couponName"
                  clearable
                  style="padding-right: 5px;width: 140px"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="优惠券状态:" prop="couponStatus" :label-width="90">
                <Select
                  v-model="addRelationDetail.couponStatus"
                  placeholder="请选择"
                  style="padding-right: 5px;width: 100px"
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
          <Row>
            <i-col span="6" v-if="addRelationDetail.source == 'SMALL'">
              <FormItem label="券有效期:" prop="useLimitType" :label-width="100">
                <Select
                  v-model="addRelationDetail.validDateType"
                  placeholder="券有效期类型"
                  style="padding-right: 5px;width: 140px"
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
              v-if="addRelationDetail.source == 'SMALL' && addRelationDetail.validDateType=='UN_FIXED_DATE'"
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
                  style="padding-right: 5px;width: 140px"
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
            <i-col span="6">
              <FormItem
                label="使用限制:"
                prop="useLimitType"
                :label-width="80"
              >{{ addRelationDetail.useLimitType | couponUseLimitFilter }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="使用规则:" prop="couponRules" :label-width="100">
                <Input
                  v-model="addRelationDetail.couponRules"
                  type="textarea"
                  :autosize="{minRows: 3,maxRows: 8}"
                  placeholder="请输入优惠券的使用规则，使用&符号换行"
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
    <!-- 添加手机号码 -->
    <Modal v-model="modalPhones" :mask-closable="false" :width="700" title="手动发券">
      <p slot="header">
        <span>手动发券配置</span>
      </p>
      <Form ref="addPhones" :model="currentTableRowSelected" :label-width="130">
        <Row v-if="currentTableRowSelected">
          <Row class-name="mb20">
            <i-col span="12">
              <Row>
                <i-col span="8">优惠券名称:</i-col>
                <i-col span="16">{{ currentTableRowSelected.couponName }}</i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row>
                <i-col span="8">优惠券类型:</i-col>
                <i-col span="16" v-if="currentTableRowSelected.couponType === 'FULL_CUT_COUPON'">
                  <tag color="magenta">{{ "满减券" }}</tag>
                </i-col>
                <i-col
                  span="16"
                  v-else-if="currentTableRowSelected.couponType === 'DISCOUNT_COUPON'"
                >
                  <tag color="orange">{{ "折扣券" }}</tag>
                </i-col>
                <i-col span="16" v-else-if="currentTableRowSelected.couponType === 'CASH_COUPON'">
                  <tag color="cyan">{{ "现金券" }}</tag>
                </i-col>
                <i-col
                  span="16"
                  v-else-if="currentTableRowSelected.couponType === 'FREIGHT_COUPON'"
                >
                  <tag color="cyan">{{ "运费券" }}</tag>
                </i-col>
                <i-col span="16" v-else-if="currentTableRowSelected.couponType === null">{{ "N/A" }}</i-col>
              </Row>
            </i-col>
          </Row>

          <Row class-name="mb20">
            <i-col span="12">
              <Row>
                <i-col span="8">优惠/折扣额度:</i-col>
                <i-col
                  span="16"
                  v-if="currentTableRowSelected.couponType === 'DISCOUNT_COUPON'"
                >{{ currentTableRowSelected.couponFee | fenToDiscountFilters }}</i-col>
                <i-col
                  span="16"
                  v-else
                >{{ currentTableRowSelected.couponFee | fenToYuanDot2Filters }}</i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row>
                <i-col span="8">最小购买金额:</i-col>
                <i-col span="16">{{ currentTableRowSelected.minBuyFee | fenToYuanDot2Filters }}</i-col>
              </Row>
            </i-col>
          </Row>

          <Row class-name="mb20">
            <i-col span="12">
              <Row>
                <i-col span="8">优惠券状态:</i-col>
                <i-col span="16" v-if="currentTableRowSelected.couponStatus === 'VALID'">
                  <tag color="success">{{ "有效" }}</tag>
                </i-col>
                <i-col span="16" v-else-if="currentTableRowSelected.couponStatus === 'INVALID'">
                  <tag color="error">{{ "无效" }}</tag>
                </i-col>
                <i-col
                  span="16"
                  v-else-if="currentTableRowSelected.couponStatus === null"
                >{{ "N/A" }}</i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row>
                <i-col span="8">券有效期类型:</i-col>
                <i-col span="16">{{ currentTableRowSelected.validDateType | validDateTypeFilter }}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row
            class-name="mb20"
            v-show="currentTableRowSelected.validDateType=='UN_FIXED_DATE' && currentTableRowSelected.source == 'SMALL'"
          >
            <i-col span="12">
              <Row>
                <i-col span="8">生效开始:</i-col>
                <i-col span="16">{{ currentTableRowSelected.beginDay }}</i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row>
                <i-col span="8">有效天数:</i-col>
                <i-col span="16">{{ currentTableRowSelected.endDay }}</i-col>
              </Row>
            </i-col>
          </Row>

          <Row
            class-name="mb20"
            v-show="currentTableRowSelected.validDateType=='FIXED_DATE' && currentTableRowSelected.source == 'SMALL'"
          >
            <i-col span="12">
              <Row>
                <i-col span="8">生效时间:</i-col>
                <i-col span="16">{{ currentTableRowSelected.effectiveStartTime }}</i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row>
                <i-col span="8">失效时间:</i-col>
                <i-col span="16">{{ currentTableRowSelected.effectiveEndTime }}</i-col>
              </Row>
            </i-col>
          </Row>

          <Row class-name="mb20">
            <i-col span="12">
              <Row>
                <i-col span="8">券使用范围:</i-col>
                <i-col span="16" v-if="currentTableRowSelected.couponScope === 'STORE'">
                  <tag color="magenta">{{ "门店" }}</tag>
                </i-col>
                <i-col span="16" v-else-if="currentTableRowSelected.couponScope === 'SMALL'">
                  <tag color="cyan">{{ "商城" }}</tag>
                </i-col>
                <i-col
                  span="16"
                  v-else-if="currentTableRowSelected.couponScope === 'STORE_AND_SMALL'"
                >
                  <tag color="orange">{{ "全场通用" }}</tag>
                </i-col>
                <i-col
                  span="16"
                  v-else-if="currentTableRowSelected.couponScope === null"
                >{{ "N/A" }}</i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row>
                <i-col span="8">券使用限制:</i-col>
                <i-col span="16">{{ currentTableRowSelected.useLimitType | couponUseLimitFilter }}</i-col>
              </Row>
            </i-col>
          </Row>
        </Row>
        <Divider>优惠券关联手机号码</Divider>
        <Row v-if="currentTableRowSelected">
          <i-col span="15">
            <Row class-name="mb10">
              <FormItem label="请输入用户手机号码:" prop="phones">
                <Input
                  v-model="currentTableRowSelected.phones"
                  clearable
                  style="width: 450px;"
                  placeholder="请输入需发券手机号码，多个号码用英文逗号分隔"
                ></Input>
              </FormItem>
            </Row>
          </i-col>
        </Row>
      </Form>*Tips：请输入需发券手机号码，多个号码用
      <b style="color:red">英文逗号</b>
      分隔
      <div slot="footer">
        <Button @click="handlePhonesClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmitPhones" v-once>确定</Button>
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
  getCouponPagess,
  deleteCouponPage,
  createCouponPage,
  editCouponPage,
  handGrandCoupon,
  getCouponTemplatePages,
  getHdCouponActivitiesPages,
  getSystemParameter
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
  userScopeConvert
} from "@/libs/converStatus";
import {
  couponStatusEnum,
  couponTypeEnum,
  couponScopeEnum,
  couponUseLimitEnum,
  validDateTypeEnum,
  userScopeEnum
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
  compareCouponData
} from "@/libs/util";

const relationDetail = {
  id: 0,
  activityCouponId: 0,
  couponName: "",
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  effectiveStartTime: null,
  effectiveEndTime: null,
  couponLimit: 0,
  receiveCount: 0,
  couponRules: "",
  couponScope: "STORE",
  useLimitType: null,
  hdActivityId: 0,
  validDateType: "FIXED_DATE",
  userScope: "ALL",
  receiveLimit: 0,
  beginDay: 0,
  endDay: 0,
  rank: 0,
  phones: "",
  couponStatus: "VALID",
  couponBusinessType: ""
};
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

const hdCouponTemplateDetail = {
  activityId: 0,
  beginDate: null,
  endDate: null,
  couponName: "",
  couponRemark: "",
  couponType: "",
  faceValue: 0,
  price: 0,
  useRule: "",
  couponStatus: "VALID"
};

const roleRowData = {
  couponBusinessType: "MANUAL_SEND",
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
  activityId: null,
  page: 1,
  rows: 5
};

const dataColumns = [
  {
    type: "selection",
    width: 50,
    align: "center"
  },
  {
    title: "优惠券名称",
    align: "center",
    key: "couponName",
    minWidth: 70
  },
  {
    title: "优惠券类型",
    align: "center",
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
      } else if (row.couponType === "FREIGHT_COUPON") {
        return (
          <div>
            <tag color="blue">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    },
    minWidth: 40
  },
  {
    title: "优惠/折扣额度",
    align: "center",
    key: "couponFee",
    minWidth: 50,
    render(h, params) {
      const { row } = params;
      if (row.couponType === "DISCOUNT_COUPON") {
        return <div>{row.couponFee / 10 + "折"}</div>;
      } else {
        return <div>{fenToYuanDot2(params.row.couponFee)}</div>;
      }
    }
  },
  {
    title: "最小购买金额",
    align: "center",
    key: "minBuyFee",
    minWidth: 40,
    render(h, params) {
      return h("div", fenToYuanDot2(params.row.minBuyFee));
    }
  },
  {
    title: "优惠券状态",
    align: "center",
    key: "couponStatus",
    minWidth: 30,
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
    title: "券使用范围",
    align: "center",
    key: "couponScope",
    minWidth: 40,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponScope === "STORE") {
        return (
          <div>
            <tag color="magenta">
              {couponScopeConvert(row.couponScope).label}
            </tag>
          </div>
        );
      } else if (row.couponScope === "STORE_AND_SMALL") {
        return (
          <div>
            <tag color="orange">
              {couponScopeConvert(row.couponScope).label}
            </tag>
          </div>
        );
      } else if (row.couponScope === "SMALL") {
        return (
          <div>
            <tag color="cyan">{couponScopeConvert(row.couponScope).label}</tag>
          </div>
        );
      }
      return <div>{row.couponScope}</div>;
    }
  },
  {
    title: "券使用限制",
    align: "center",
    key: "useLimitType",
    minWidth: 40,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.useLimitType === "SMALL_ALL") {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === "PART_GOODS") {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === "PART_STORES") {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === "HD_ALL") {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: "来源",
    key: "source",
    align: "center",
    minWidth: 20,
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
    title: "生效时间",
    key: "effectiveStartTime",
    align: "center",
    minWidth: 90,
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
    }
  },
  {
    title: "失效时间",
    key: "effectiveEndTime",
    align: "center",
    minWidth: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source == "SMALL" && row.validDateType === "FIXED_DATE") {
        if (!compareCouponData(row.effectiveEndTime)) {
          return <div style="color:red">{row.effectiveEndTime + "已过期"}</div>;
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
          return <div style="color:red">{row.effectiveEndTime + "已过期"}</div>;
        } else {
          return <div>{row.effectiveEndTime}</div>;
        }
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: "创建时间",
    align: "center",
    key: "createTime",
    minWidth: 35
  },
  {
    title: "操作",
    align: "center",
    minWidth: 110,
    key: "handle",
    options: ["couponStatus", "view", "edit"]
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
    align: "center",
    minWidth: 80
  },
  {
    title: "优惠券类型",
    align: "center",
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
      } else if (row.couponType === "FREIGHT_COUPON") {
        return (
          <div>
            <tag color="blue">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    }
  },
  {
    title: "优惠/折扣额度",
    align: "center",
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
    align: "center",
    minWidth: 80,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
    }
  },
  {
    title: "优惠券状态",
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
    }
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
    align: "center",
    minWidth: 80
  },
  {
    title: "优惠券类型",
    key: "couponType",
    align: "center",
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
    align: "center",
    key: "useLimitType",
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
    }
  },
  // {
  //   title: "优惠/折扣额度",
  //   key: "faceValue",
  //   minWidth: 80,
  //   render(h, params) {
  //     const { row } = params;
  //     const disIndex = row.couponName.indexOf("折");
  //     if (row.couponType === "DISCOUNT_COUPON") {
  //       const couponFee =
  //         parseFloat(row.couponName.substring(0, disIndex)) + "折";
  //       return <div>{couponFee}</div>;
  //     } else {
  //       return <div>{fenToYuanDot2(params.row.faceValue)}</div>;
  //     }
  //   }
  // },
  {
    title: "优惠/折扣额度",
    align: "center",
    key: "faceValue",
    minWidth: 80,
    render(h, params) {
      const { row } = params;
      if (row.couponType === "DISCOUNT_COUPON") {
        const couponFee = HdDiscount(params.row.discount);
        return <div>{couponFee}</div>;
      } else {
        return <div>{fenToYuanDot2(params.row.faceValue)}</div>;
      }
    }
  },
  {
    title: "最小购买金额",
    key: "useRule",
    align: "center",
    minWidth: 80,
    render(h, params, vm) {
      let useRule = params.row.useRule;
      const startIndex = useRule.indexOf("满");
      const endIndex = useRule.indexOf("元");
      const minBuyFee = useRule.slice(startIndex + 1, endIndex);
      return <div>{fenToYuanDot2(minBuyFee * 100)}</div>;
    }
  },
  {
    title: "生效时间",
    key: "beginDate",
    align: "center",
    minWidth: 50
  },
  {
    title: "失效时间",
    align: "center",
    key: "endDate",
    minWidth: 50
  }
];

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      relationRuleInline: {
        effectiveStartTime: [{ required: true, message: "请选择生效时间" }],
        effectiveEndTime: [{ required: true, message: "请选择失效时间" }],
        beginDay: [{ required: true, message: "请输入生效天数" }],
        endDay: [{ required: true, message: "请输入失效天数" }],
        couponScope: [{ required: false, message: "请选择券使用范围" }],
        useLimitType: [{ required: true, message: "请选择券使用限制" }],
        couponRules: [{ required: true, message: "请输入券使用规则" }],
        couponStatus: [{ required: true, message: "请选择优惠券状态" }],
        couponName: [{ required: true, message: "请输入优惠券名称" }]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      phones: "",
      couponStatusEnum,
      couponTypeEnum,
      couponScopeEnum,
      userScopeEnum,
      couponUseLimitEnum,
      validDateTypeEnum,
      dataColumns: dataColumns,
      templatePageOpts: [5, 10],
      templateColumns: templateColumns,
      hdTemplateColumns: hdTemplateColumns,
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalPhones: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      currentTableRowSelected: null,
      searchTemplateRowData: _.cloneDeep(templateRowData),
      searchHdTemplateRowData: _.cloneDeep(hdTemplateRowData),
      relationDetail: _.cloneDeep(relationDetail),
      addRelationDetail: _.cloneDeep(relationDetail),
      addRelationList: [],
      couponTemplateData: [],
      hdCouponTemplateData: [],
      couponTemplateTotal: 0,
      couponHdTemplateTotal: 0,
      modalAdd: false,
      activityClassify: [],
      hdCouponType: "手动发券"
    };
  },
  computed: {
    minBuyFeeComputed() {
      return fenToYuanDot2Number(this.relationDetail.minBuyFee);
    },
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
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
    this.getSystemParameters();
  },
  methods: {
    statusChange(params) {
      this.addRelationDetail = _.cloneDeep(params.row);
      if (params.row.couponStatus === "VALID") {
        this.addRelationDetail.couponStatus = "INVALID";
      } else {
        this.addRelationDetail.couponStatus = "VALID";
      }
      this.editCouponPage();
    },
    handCouponType(value, date) {
      let item = this.activityClassify;
      for (let i = 0; i < item.length; i++) {
        if (value === item[i].indexName) {
          this.hdCouponType = item[i].indexValue;
        }
      }
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.getTableData();
    },
    handleTemplateAdd() {
      this.addRelationDetail.couponBusinessType = this.searchRowData.couponBusinessType;
      let _this = this;
      if (this.addRelationDetail.couponName == "") {
        this.$Message.error("请先关联一张优惠券模板!");
        return false;
      }
      this.$refs.addForm.validate(valid => {
        if (valid) {
          _this.extraValidator();
          _this.replaceTextByTag();
          if (_this.tempModalType === "addTemplate") {
            _this.createRelation();
          } else if (_this.tempModalType === "addHdTemplate") {
            _this.createHdRelation();
          }
        } else {
          _this.$Message.error("请完善信息!");
        }
      });
    },
    handleModalAdd(isShow) {
      // 先清除对象
      this.resetFields();
      // 当展示的是添加系统优惠券
      if (isShow && this.tempModalType == "addTemplate") {
        this.addRelationDetail.couponScope = "SMALL";
        this.addRelationDetail.useLimitType = "SMALL_ALL";
      }
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.addForm.resetFields();
      this.addRelationDetail = _.cloneDeep(relationDetail);
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.addRelationDetail = _.cloneDeep(params.row);
      this.replaceTextByTab();
      this.modalEdit = true;
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
      // console.log(this.currentTableRowSelected);
    },
    // 添加手机号码
    onRelevance(params) {
      if (!this.currentTableRowSelected) {
        this.$Message.error(
          "请用鼠标左键点击选择下方表格一行优惠券数据,才能进行手动发券"
        );
        return;
      }
      if (this.hdCouponType === "手动发券") {
        this.modalPhones = true;
      } else if (this.hdCouponType === "测试发券") {
        alert("调取测试发券模板");
      }
    },
    handlePhonesClose() {
      this.modalPhones = false;
    },
    handleSubmitPhones() {
      if (!this.currentTableRowSelected) {
        this.$Message.error(
          "请用鼠标左键点击选择下方表格一行优惠券数据,才能进行手动发券"
        );
        return;
      }
      if (
        !/^1[3578][0-9]{9}(,1[3578][0-9]{9})*$/.test(
          this.currentTableRowSelected.phones
        )
      ) {
        this.$Message.error("请输入正确的手机号码,多个号码用【英文逗号】分隔");
        return;
      }
      this.handGrandCoupon();
    },
    handGrandCoupon() {
      handGrandCoupon(this.currentTableRowSelected)
        .then(res => {
          this.$Message.success("发送成功！");
          this.modalPhones = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTableData() {
      getCouponPagess(this.searchRowData)
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
    getSystemParameters() {
      let code = "SEND_COUPON_TYPE";
      getSystemParameter(code)
        .then(res => {
          this.activityClassify = res.systemSettings;
        })
        .catch(error => {
          console.log(error);
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
    editCouponPage() {
      // 编辑状态
      this.tempTableLoading = true;
      editCouponPage(this.addRelationDetail)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success("修改成功!");
          this.getTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
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
    replaceTextByTag() {
      // 活动规则换行用“&”拼接
      if (this.addRelationDetail.couponRules) {
        this.addRelationDetail.couponRules = replaceByTag(
          this.addRelationDetail.couponRules
        );
      }

      if (this.addRelationDetail.couponReminderMsg) {
        this.addRelationDetail.couponReminderMsg = replaceByTag(
          this.addRelationDetail.couponReminderMsg
        );
      }

      if (this.addRelationDetail.couponDetail) {
        this.addRelationDetail.couponDetail = replaceByTag(
          this.addRelationDetail.couponDetail
        );
      }
    },
    extraValidator() {
      if (
        this.systemCouponFixDate &&
        compareData(
          this.addRelationDetail.effectiveStartTime,
          this.addRelationDetail.effectiveEndTime
        )
      ) {
        this.$Message.error("优惠券失效时间必须大于生效时间!");
        return false;
      }
    },
    handleTemplateEdit() {
      let _this = this;
      if (this.addRelationDetail.couponName == "") {
        this.$Message.error("请先关联一张优惠券模板!");
        return false;
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          _this.extraValidator();
          _this.replaceTextByTag();
          if (
            this.tempModalType === this.modalType.edit ||
            this.tempModalType === null
          ) {
            _this.editCouponPage();
          }
        } else {
          _this.$Message.error("请完善信息!");
        }
      });
    },

    handleTemplateChange(currentRow, oldCurrentRow) {
      const couponTemplate = currentRow;
      this.addRelationDetail.couponName = couponTemplate.couponName;
      this.addRelationDetail.couponFee = couponTemplate.couponFee;
      this.addRelationDetail.minBuyFee = couponTemplate.minBuyFee;
      this.addRelationDetail.couponStatus = couponTemplate.couponStatus;
      this.addRelationDetail.couponType = couponTemplate.couponType;
    },
    handleHdTemplateChange(currentRow, oldCurrentRow) {
      const startIndex = currentRow.useRule.indexOf("满");
      const endIndex = currentRow.useRule.indexOf("元");
      const minBuyFee = currentRow.useRule.slice(startIndex + 1, endIndex);
      this.addRelationDetail.useLimitType = currentRow.useLimitType;
      this.addRelationDetail.couponName = currentRow.couponName;
      this.addRelationDetail.couponType = currentRow.couponType;
      this.addRelationDetail.couponFee = currentRow.faceValue;
      this.addRelationDetail.couponStatus = "VALID";
      const disIndex = currentRow.couponName.indexOf("折");
      // if (currentRow.couponType === "DISCOUNT_COUPON") {
      //   this.addRelationDetail.couponFee =
      //     parseFloat(currentRow.couponName.substring(0, disIndex)) * 10;
      //   console.log(
      //     "DISCOUNT_COUPON couponFee:",
      //     this.addRelationDetail.couponFee
      //   );
      // }
      if (currentRow.couponType === "DISCOUNT_COUPON") {
        this.addRelationDetail.couponFee =
          parseFloat(currentRow.discount) * 100;
        console.log(
          "DISCOUNT_COUPON couponFee:",
          this.addRelationDetail.couponFee
        );
      }
      this.addRelationDetail.hdActivityId = currentRow.activityId;
      this.addRelationDetail.minBuyFee = minBuyFee * 100;
      this.addRelationDetail.effectiveStartTime = currentRow.beginDate;
      this.addRelationDetail.effectiveEndTime = currentRow.endDate;
    },
    effectiveStartTimeChange(value, date) {
      this.addRelationDetail.effectiveStartTime = value;
    },
    effectiveEndTimeChange(value, date) {
      this.addRelationDetail.effectiveEndTime = value;
    },
    createRelation() {
      this.modalViewLoading = true;
      this.addRelationDetail.source = "SMALL";
      createCouponPage(this.addRelationDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    createHdRelation() {
      this.modalViewLoading = true;
      this.addRelationDetail.source = "HD";
      createCouponPage(this.addRelationDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success("创建成功!");
          this.getTableData();
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
    addCouponTemplate() {
      // this.relationDetail.couponBusinessType = this.searchRowData.couponBusinessType;
      // console.log("搜索条件", this.relationDetail.couponBusinessType);
      this.getTemplateTableData();
      this.tempModalType = "addTemplate";
      this.modalAdd = true;
    },
    addHdCouponTemplate() {
      this.getHdTemplateTableData();
      this.tempModalType = "addHdTemplate";
      this.modalAdd = true;
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.addRelationDetail = _.cloneDeep(params.row);
      this.replaceTextByTab();
      this.modalView = true;
    },
    handleAddClose() {
      this.modalAdd = false;
    },
    minBuyFeeInputNumberOnchange(value) {
      this.relationDetail.minBuyFee = yuanToFenNumber(value);
    },
    deleteTable(ids) {
      this.tempTableLoading = true;
      deleteCouponPage({ ids })
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
        .finally(res => {
          this.tempTableLoading = false;
        });
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
      if (selection.length === 1) {
        this.currentTableRowSelected = selection[0];
      } else {
        this.currentTableRowSelected = null;
      }
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
      if (selection.length === 1) {
        this.currentTableRowSelected = selection[0];
      } else {
        this.currentTableRowSelected = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
