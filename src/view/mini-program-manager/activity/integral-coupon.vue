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
        @on-view="handleView"
        @on-edit="handleEdit"
        @coupon-status="statusChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
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
              style="padding-right: 5px; width: 120px"
            >
              <Option
                v-for="(item, index) in couponStatusEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.userScope"
              placeholder="用户范围"
              style="padding-right: 5px; width: 100px"
            >
              <Option
                v-for="(item, index) in userScopeEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
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
      <div style="margin: 10px; overflow: hidden">
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

    <!-- 查看 -->
    <Modal
      v-model="modalView"
      :width="800"
      draggable
      scrollable
      :mask-closable="false"
    >
      <p slot="header">
        <span>关联的优惠劵详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">
                优惠券名称:
              </i-col>
              <i-col span="16">
                {{ addRelationDetail.couponName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                优惠券类型:
              </i-col>
              <i-col
                v-if="addRelationDetail.couponType === 'FULL_CUT_COUPON'"
                span="16"
              >
                <tag color="magenta">
                  {{ "满减券" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'"
                span="16"
              >
                <tag color="orange">
                  {{ "折扣券" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="addRelationDetail.couponType === 'CASH_COUPON'"
                span="16"
              >
                <tag color="cyan">
                  {{ "现金券" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="addRelationDetail.couponType === 'FREIGHT_COUPON'"
                span="16"
              >
                <tag color="cyan">
                  {{ "运费券" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="addRelationDetail.couponType === null"
                span="16"
              >
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">
                优惠/折扣额度:
              </i-col>
              <i-col
                v-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'"
                span="16"
              >
                {{ addRelationDetail.couponFee | fenToDiscountFilters }}
              </i-col>
              <i-col v-else span="16">
                {{
                  addRelationDetail.couponFee | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                最小购买金额:
              </i-col>
              <i-col span="16">
                {{
                  addRelationDetail.minBuyFee | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">
                优惠券状态:
              </i-col>
              <i-col
                v-if="addRelationDetail.couponStatus === 'VALID'"
                span="16"
              >
                <tag color="success">
                  {{ "有效" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="addRelationDetail.couponStatus === 'INVALID'"
                span="16"
              >
                <tag color="error">
                  {{ "无效" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="addRelationDetail.couponStatus === null"
                span="16"
              >
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                已兑换统计:
              </i-col>
              <i-col span="16">
                {{ addRelationDetail.receiveCount }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">
                券有效期类型:
              </i-col>
              <i-col span="16">
                {{
                  addRelationDetail.validDateType | validDateTypeFilter
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                排序字段:
              </i-col>
              <i-col span="16">
                {{ addRelationDetail.rank }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Row
          v-show="
            addRelationDetail.validDateType == 'UN_FIXED_DATE' &&
              addRelationDetail.source == 'SMALL'
          "
          class-name="mb20"
        >
          <i-col span="12">
            <Row>
              <i-col span="8">
                生效开始:
              </i-col>
              <i-col span="16">
                {{ addRelationDetail.beginDay }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                有效天数:
              </i-col>
              <i-col span="16">
                {{ addRelationDetail.endDay }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Row
          v-show="
            addRelationDetail.validDateType == 'FIXED_DATE' &&
              addRelationDetail.source == 'SMALL'
          "
          class-name="mb20"
        >
          <i-col span="12">
            <Row>
              <i-col span="8">
                生效时间:
              </i-col>
              <i-col span="16">
                {{
                  addRelationDetail.effectiveStartTime
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                失效时间:
              </i-col>
              <i-col span="16">
                {{ addRelationDetail.effectiveEndTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">
                兑换积分:
              </i-col>
              <i-col span="16">
                {{ addRelationDetail.points }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                促销积分:
              </i-col>
              <i-col span="16">
                {{ addRelationDetail.realPoints }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">
                每人限兑:
              </i-col>
              <i-col span="16">
                {{ addRelationDetail.receiveLimit }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                发券总数:
              </i-col>
              <i-col span="16">
                {{ addRelationDetail.couponLimit }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">
                券使用范围:
              </i-col>
              <i-col v-if="addRelationDetail.couponScope === 'STORE'" span="16">
                <tag color="magenta">
                  {{ "门店" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="addRelationDetail.couponScope === 'SMALL'"
                span="16"
              >
                <tag color="cyan">
                  {{ "商城" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="addRelationDetail.couponScope === 'STORE_AND_SMALL'"
                span="16"
              >
                <tag color="orange">
                  {{ "全场通用" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="addRelationDetail.couponScope === null"
                span="16"
              >
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                券使用限制:
              </i-col>
              <i-col span="16">
                {{
                  addRelationDetail.useLimitType | couponUseLimitFilter
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">
                最高优惠金额:
              </i-col>
              <i-col
                v-if="addRelationDetail.maxDiscountFee != null"
                span="16"
              >
                {{
                  addRelationDetail.maxDiscountFee | fenToYuanDot2Filters
                }}
              </i-col>
              <i-col v-else span="16">
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="20">
            <Row>
              <i-col span="5">
                券详情:
              </i-col>
              <i-col span="18">
                {{ addRelationDetail.couponDetail }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="20">
            <Row>
              <i-col span="5">
                温馨提示:
              </i-col>
              <i-col span="18">
                {{ addRelationDetail.couponReminderMsg }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="20">
            <Row>
              <i-col span="5">
                使用规则:
              </i-col>
              <i-col span="18">
                {{ addRelationDetail.couponRules }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                关联门店:
              </i-col>
              <i-col span="16">
                {{ showStoreName }}
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

    <!-- 添加 -->
    <Modal
      v-model="modalAdd"
      :width="1000"
      :z-index="1000"
      :mask-closable="false"
      @on-visible-change="handleModalAdd"
    >
      <p slot="header">
        <i-col>
          {{
            tempModalType == "addTemplate" ? "添加系统优惠券" : "添加海鼎优惠券"
          }}
        </i-col>
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
                  style="padding-right: 5px; width: 120px"
                  clearable
                >
                  <Option
                    v-for="(item, index) in couponTypeEnum"
                    :key="index"
                    :value="item.value"
                    :disabled="index == 3"
                    class="ptb2-5"
                    style="padding-left: 5px; width: 100px"
                  >
                    {{ item.label }}
                  </Option>
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
            v-if="tempModalType == 'addHdTemplate'"
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

          <div style="margin: 10px; overflow: hidden">
            <Row
              v-if="tempModalType == 'addTemplate'"
              type="flex"
              justify="end"
            >
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
            <Row v-else type="flex" justify="end">
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
                    style="padding-right: 5px; width: 120px"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="用户范围:" prop="userScope">
                  <Select
                    v-model="addRelationDetail.userScope"
                    placeholder="用户范围"
                    style="padding-right: 5px; width: 100px"
                  >
                    <Option
                      v-for="(item, index) in userScopeEnum"
                      :key="index"
                      :value="item.value"
                      class="ptb2-5"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="4">
                <FormItem label="排序字段:" prop="rank">
                  <InputNumber
                    v-model="addRelationDetail.rank"
                    :min="0"
                    label
                  ></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="券有效期:" prop="useLimitType">
                  <Select
                    v-model="addRelationDetail.validDateType"
                    placeholder="券有效期类型"
                    style=" width: 120px"
                  >
                    <Option
                      v-for="(item, index) in validDateTypeEnum"
                      :key="index"
                      :value="item.value"
                      class="ptb2-5"
                      style="padding-left: 5px; width: 100px"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
              <template v-if="addRelationDetail.validDateType == 'UN_FIXED_DATE'">
                <i-col span="6">
                  <FormItem label="生效开始:" prop="beginDay">
                    <InputNumber
                      v-model="addRelationDetail.beginDay"
                      :min="0"
                      label="生效开始"
                      style="width: 95px"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="7">
                  <FormItem label="有效天数:" prop="endDay">
                    <InputNumber
                      v-model="addRelationDetail.endDay"
                      :min="0"
                      label="有效天数"
                      style="width: 80px"
                    ></InputNumber>
                  </FormItem>
                </i-col>
              </template>
              <template v-if="addRelationDetail.validDateType == 'FIXED_DATE'">
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
                <FormItem label="兑换积分:" prop="points">
                  <InputNumber
                    v-model="addRelationDetail.points"
                    :min="0"
                    label="兑换积分"
                    style="width: 115px"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="促销积分:" prop="realPoints">
                  <InputNumber
                    v-model="addRelationDetail.realPoints"
                    :min="0"
                    label="促销积分"
                    style="width: 95px"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="每人限兑:" prop="receiveLimit">
                  <InputNumber
                    v-model="addRelationDetail.receiveLimit"
                    :min="0"
                    label="限兑数量"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="发券总数:" prop="couponLimit">
                  <InputNumber
                    v-model="addRelationDetail.couponLimit"
                    :min="0"
                    label="限购数量"
                  ></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem
                  v-if="tempModalType == 'addTemplate'"
                  label="券使用范围:"
                  prop="couponScope"
                  :label-width="100"
                >
                  {{
                    addRelationDetail.couponScope | couponScopeFilter
                  }}
                </FormItem>
                <FormItem
                  v-else
                  label="券使用范围:"
                  prop="couponScope"
                  :label-width="100"
                >
                  <Select
                    v-model="addRelationDetail.couponScope"
                    placeholder="请选择"
                    style="padding-right: 5px; width: 120px"
                  >
                    <Option
                      v-for="(item, index) in couponScopeEnum"
                      :key="index"
                      :value="item.value"
                      :disabled="index === 2"
                      class="ptb2-5"
                      style="padding-left: 5px; width: 100px"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem
                  v-if="tempModalType == 'addTemplate'"
                  label="券使用限制:"
                  prop="useLimitType"
                  :label-width="100"
                >
                  {{
                    addRelationDetail.useLimitType | couponUseLimitFilter
                  }}
                </FormItem>
                <FormItem
                  v-else
                  label="券使用限制:"
                  prop="useLimitType"
                  :label-width="100"
                >
                  <Select
                    v-model="addRelationDetail.useLimitType"
                    placeholder="请选择"
                    style="padding-right: 5px; width: 100px"
                    disabled
                  >
                    <Option
                      v-for="(item, index) in couponUseLimitEnum"
                      :key="index"
                      :value="item.value"
                      class="ptb2-5"
                      style="padding-left: 5px; width: 100px"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col v-if="tempModalType == 'addTemplate'" span="6">
                <FormItem
                  v-if="addRelationDetail.maxDiscountFee"
                  :label-width="100"
                  label="最高优惠金额:"
                  prop="maxDiscountFee"
                >
                  {{
                    addRelationDetail.maxDiscountFee | fenToYuanDot2Filters
                  }}
                </FormItem>
                <FormItem
                  v-else
                  :label-width="100"
                  label="最高优惠金额:"
                  prop="maxDiscountFee"
                >
                  {{ "N/A" }}
                </FormItem>
              </i-col>
              <i-col v-else span="6">
                <FormItem
                  v-if="addRelationDetail.couponType == 'DISCOUNT_COUPON'"
                  label="最高优惠金额:"
                  prop="addRelationDetail"
                  :label-width="100"
                >
                  <InputNumber
                    :min="0"
                    :value="maxDiscountFeeComputed"
                    @on-change="maxDiscountFeeInputNumberOnchange"
                  ></InputNumber>
                </FormItem>
                <FormItem
                  v-else
                  :label-width="100"
                  label="最高优惠金额:"
                  prop="maxDiscountFee"
                >
                  {{ "N/A" }}
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="券详情:" prop="couponDetail">
                  <Input
                    v-model="addRelationDetail.couponDetail"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 8 }"
                    placeholder="请输入优惠券的详情"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem
                  label="温馨提示:"
                  prop="couponReminderMsg"
                  :label-width="100"
                >
                  <Input
                    v-model="addRelationDetail.couponReminderMsg"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 8 }"
                    placeholder="请输入优惠券的温馨提示"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem
                  label="使用规则:"
                  prop="couponRules"
                  :label-width="100"
                >
                  <Input
                    v-model="addRelationDetail.couponRules"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 8 }"
                    placeholder="请输入优惠券的使用规则"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="关联门店:">
                  <Select
                    v-model="addRelationDetail.relationStoreType"
                    style="width: 220px"
                  >
                    <Option
                      v-for="item in relationStoreTypeEnum"
                      :key="item.value"
                      :value="item.value"
                      class="ptb2-5"
                      style="padding-left: 5px"
                      @click.native="selectStore(item)"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col v-show="showStoreList" span="12">
                <FormItem
                  :label-width="85"
                  label="所属城市:"
                  prop="cityCode"
                >
                  <Select
                    v-model="addRelationDetail.cityCode"
                    style="width: 220px"
                    @on-change="handleCitySwitch"
                  >
                    <Option
                      v-for="(item, index) in cityList"
                      :key="index"
                      :value="item.cityCode"
                      class="ptb2-5"
                      style="padding-left: 5px"
                    >
                      {{ item.cityName }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>
            <Row v-show="showStoreList">
              <i-col v-if="storeData.length>0" span="24">
                <FormItem>
                  <div
                    class="bottom-line"
                  >
                    <div style="margin-left: -54px; margin-right: 18px">
                      {{ storeNameList[0] }}
                    </div>
                    <Checkbox
                      :indeterminate="indeterminate"
                      :value="checkAll"
                      @click.prevent.native="handleCheckAll(0)"
                    >
                      全选/反选
                    </Checkbox>
                  </div>
                  <CheckboxGroup
                    v-model="storeIds"
                    @on-change="checkAllGroupChange"
                  >
                    <Checkbox
                      v-for="item in storeData"
                      ref="checkBox"
                      :key="item.storeId"
                      :label="item.storeId"
                    >
                      {{ item.storeName }}
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </i-col>
              <i-col v-if="storeData1.length>0" span="24">
                <FormItem>
                  <div
                    class="bottom-line"
                  >
                    <div style="margin-left: -54px; margin-right: 18px">
                      {{ storeNameList[1] }}
                    </div>
                    <Checkbox
                      :indeterminate="indeterminate1"
                      :value="checkAll1"
                      @click.prevent.native="handleCheckAll(1)"
                    >
                      全选/反选
                    </Checkbox>
                  </div>
                  <CheckboxGroup
                    v-model="storeIds"
                    @on-change="checkAllGroupChange1"
                  >
                    <Checkbox
                      v-for="item in storeData1"
                      ref="checkBox"
                      :key="item.storeId"
                      :label="item.storeId"
                    >
                      {{ item.storeName }}
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </i-col>
              <i-col v-if="storeData2.length>0" span="24">
                <FormItem>
                  <div
                    class="bottom-line"
                  >
                    <div style="margin-left: -54px; margin-right: 18px">
                      {{ storeNameList[2] }}
                    </div>
                    <Checkbox
                      :indeterminate="indeterminate2"
                      :value="checkAll2"
                      @click.prevent.native="handleCheckAll(2)"
                    >
                      全选/反选
                    </Checkbox>
                  </div>
                  <CheckboxGroup
                    v-model="storeIds"
                    @on-change="checkAllGroupChange2"
                  >
                    <Checkbox
                      v-for="item in storeData2"
                      ref="checkBox"
                      :key="item.storeId"
                      :label="item.storeId"
                    >
                      {{ item.storeName }}
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </i-col>
              <i-col v-if="storeData3.length>0" span="24">
                <FormItem>
                  <div
                    class="bottom-line"
                  >
                    <div style="margin-left: -54px; margin-right: 18px">
                      {{ storeNameList[3] }}
                    </div>
                    <Checkbox
                      :indeterminate="indeterminate3"
                      :value="checkAll3"
                      @click.prevent.native="handleCheckAll(3)"
                    >
                      全选/反选
                    </Checkbox>
                  </div>
                  <CheckboxGroup
                    v-model="storeIds"
                    @on-change="checkAllGroupChange3"
                  >
                    <Checkbox
                      v-for="item in storeData3"
                      ref="checkBox"
                      :key="item.storeId"
                      :label="item.storeId"
                    >
                      {{ item.storeName }}
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </i-col>
              <i-col v-if="storeData4.length>0" span="24">
                <FormItem>
                  <div
                    class="bottom-line"
                  >
                    <div style="margin-left: -54px; margin-right: 18px">
                      {{ storeNameList[4] }}
                    </div>
                    <Checkbox
                      :indeterminate="indeterminate4"
                      :value="checkAll4"
                      @click.prevent.native="handleCheckAll(4)"
                    >
                      全选/反选
                    </Checkbox>
                  </div>
                  <CheckboxGroup
                    v-model="storeIds"
                    @on-change="checkAllGroupChange4"
                  >
                    <Checkbox
                      v-for="item in storeData4"
                      ref="checkBox"
                      :key="item.storeId"
                      :label="item.storeId"
                    >
                      {{ item.storeName }}
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </i-col>
              <i-col v-if="storeData5.length>0" span="24">
                <FormItem>
                  <div
                    class="bottom-line"
                  >
                    <div style="margin-left: -54px; margin-right: 18px">
                      {{ storeNameList[5] }}
                    </div>
                    <Checkbox
                      :indeterminate="indeterminate5"
                      :value="checkAll5"
                      @click.prevent.native="handleCheckAll(5)"
                    >
                      全选/反选
                    </Checkbox>
                  </div>
                  <CheckboxGroup
                    v-model="storeIds"
                    @on-change="checkAllGroupChange5"
                  >
                    <Checkbox
                      v-for="item in storeData5"
                      ref="checkBox"
                      :key="item.storeId"
                      :label="item.storeId"
                    >
                      {{ item.storeName }}
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </i-col>
              <i-col v-if="storeData6.length>0" span="24">
                <FormItem>
                  <div
                    class="bottom-line"
                  >
                    <div style="margin-left: -54px; margin-right: 18px">
                      {{ storeNameList[6] }}
                    </div>
                    <Checkbox
                      :indeterminate="indeterminate6"
                      :value="checkAll6"
                      @click.prevent.native="handleCheckAll(6)"
                    >
                      全选/反选
                    </Checkbox>
                  </div>
                  <CheckboxGroup
                    v-model="storeIds"
                    @on-change="checkAllGroupChange6"
                  >
                    <Checkbox
                      v-for="item in storeData6"
                      ref="checkBox"
                      :key="item.storeId"
                      :label="item.storeId"
                    >
                      {{ item.storeName }}
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </i-col>
              <!-- <i-col v-if="storeData7.length>0" span="24">
                <FormItem>
                  <div
                    style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;display:flex;"
                  >
                    <div style="margin-left:-54px;margin-right:18px">{{storeNameList[7]}}</div>
                    <Checkbox
                      :indeterminate="indeterminate7"
                      :value="checkAll7"
                      @click.prevent.native="handleCheckAll(7)"
                    >全选/反选</Checkbox>
                  </div>
                  <CheckboxGroup v-model="storeIds" @on-change="checkAllGroupChange7">
                    <Checkbox
                      v-for="item in storeData7"
                      ref="checkBox"
                      :key="item.storeId"
                      :label="item.storeId"
                    >{{ item.storeName }}</Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </i-col>-->
            </Row>
          </Form>*Tips：请先选择要关联的优惠券，然后输入关联配置信息，不可关联多个优惠券模板
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">
          关闭
        </Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleTemplateAdd"
        >
          确定
        </Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :mask-closable="false" :width="1000" draggable>
      <p slot="header">
        <i-col>修改优惠券配置</i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="addRelationDetail"
          :rules="relationRuleInline"
          :label-width="90"
        >
          <Row>
            <i-col span="6">
              <FormItem label="优惠券类型:" prop="couponType">
                {{
                  addRelationDetail.couponType | couponTypeFilter
                }}
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                v-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'"
                label="折扣额度:"
                prop="couponFee"
              >
                {{
                  addRelationDetail.couponFee | fenToDiscountFilters
                }}
              </FormItem>
              <FormItem v-else label="优惠金额:" prop="couponFee">
                {{
                  addRelationDetail.couponFee | fenToYuanDot2Filters
                }}
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="优惠券状态:" prop="couponStatus">
                {{
                  addRelationDetail.couponStatus | couponStatusFilter
                }}
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="最小购买金额:"
                prop="minBuyFee"
                :label-width="100"
              >
                {{
                  addRelationDetail.minBuyFee | fenToYuanDot2Filters
                }}
              </FormItem>
            </i-col>
          </Row>

          <Divider>可修改部分</Divider>
          <Row>
            <i-col span="6">
              <FormItem
                label="优惠券名称:"
                prop="couponName"
                :label-width="100"
              >
                <Input
                  v-model="addRelationDetail.couponName"
                  clearable
                  style="padding-right: 5px; width: 140px"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="用户范围:" prop="userScope">
                <Select
                  v-model="addRelationDetail.userScope"
                  placeholder="用户范围"
                  style="padding-right: 5px; width: 165px"
                >
                  <Option
                    v-for="(item, index) in userScopeEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="4">
              <FormItem label="排序字段:" prop="rank" :label-width="120">
                <InputNumber
                  v-model="addRelationDetail.rank"
                  :min="0"
                  label="排序字段"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem
                label="券有效期:"
                prop="useLimitType"
                :label-width="100"
              >
                <Select
                  v-model="addRelationDetail.validDateType"
                  placeholder="券有效期类型"
                  style="padding-right: 5px; width: 140px"
                  disabled
                >
                  <Option
                    v-for="(item, index) in validDateTypeEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px; width: 100px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <template v-if="addRelationDetail.validDateType == 'UN_FIXED_DATE'">
              <i-col span="7">
                <FormItem label="生效开始:" prop="beginDay">
                  <InputNumber
                    v-model="addRelationDetail.beginDay"
                    :min="0"
                    label="生效开始"
                    style="width: 160px"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="7">
                <FormItem label="有效天数:" prop="endDay">
                  <InputNumber
                    v-model="addRelationDetail.endDay"
                    :min="0"
                    label="有效天数"
                    style="width: 80px"
                  ></InputNumber>
                </FormItem>
              </i-col>
            </template>
            <template v-if="addRelationDetail.validDateType == 'FIXED_DATE'">
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
              <FormItem label="兑换积分:" prop="points" :label-width="100">
                <InputNumber
                  v-model="addRelationDetail.points"
                  label="兑换积分"
                  style="width: 135px"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="促销积分:" prop="realPoints">
                <InputNumber
                  v-model="addRelationDetail.realPoints"
                  label="促销积分"
                  style="width: 160px"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="每人限兑:"
                prop="receiveLimit"
                :label-width="120"
              >
                <InputNumber
                  v-model="addRelationDetail.receiveLimit"
                  :min="0"
                  label="限兑数量"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="发券总数:" prop="couponLimit">
                <InputNumber
                  v-model="addRelationDetail.couponLimit"
                  :min="0"
                  label="限购数量"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem
                v-if="addRelationDetail.source == 'SMALL'"
                label="券使用范围:"
                prop="couponScope"
                :label-width="100"
              >
                {{
                  addRelationDetail.couponScope | couponScopeFilter
                }}
              </FormItem>
              <FormItem
                v-else
                label="券使用范围:"
                prop="couponScope"
                :label-width="100"
              >
                <Select
                  v-model="addRelationDetail.couponScope"
                  placeholder="请选择"
                  style="padding-right: 5px; width: 100px"
                >
                  <Option
                    v-for="(item, index) in couponScopeEnum"
                    :key="index"
                    :value="item.value"
                    :disabled="index == 2"
                    class="ptb2-5"
                    style="padding-left: 5px; width: 100px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="使用限制:" prop="useLimitType">
                {{ addRelationDetail.useLimitType | couponUseLimitFilter }}
                <!-- <Select v-model="addRelationDetail.useLimitType" placeholder="请选择" style="padding-right: 5px;width: 120px">
                    <Option
                      v-for="(item,index) in couponUseLimitEnum"
                      :value="item.value"
                      :key="index"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 100px">{{ item.label }}
                    </Option>
                </Select>-->
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="券详情:" prop="couponDetail" :label-width="100">
                <Input
                  v-model="addRelationDetail.couponDetail"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 8 }"
                  placeholder="请输入优惠券的详情，使用&符号换行"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem
                label="温馨提示:"
                prop="couponReminderMsg"
                :label-width="100"
              >
                <Input
                  v-model="addRelationDetail.couponReminderMsg"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 8 }"
                  placeholder="请输入优惠券的温馨提示，使用&符号换行"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="使用规则:" prop="couponRules" :label-width="100">
                <Input
                  v-model="addRelationDetail.couponRules"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 8 }"
                  placeholder="请输入优惠券的使用规则，使用&符号换行"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="关联门店:">
                <Select
                  v-model="addRelationDetail.relationStoreType"
                  style="width: 220px"
                >
                  <Option
                    v-for="item in relationStoreTypeEnum"
                    :key="item.value"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                    @click.native="selectStore(item)"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col v-show="showStoreList" span="12">
              <FormItem
                :label-width="85"
                label="所属城市:"
                prop="cityCode"
              >
                <Select
                  v-model="addRelationDetail.cityCode"
                  style="width: 220px"
                  @on-change="handleCitySwitch"
                >
                  <Option
                    v-for="(item, index) in cityList"
                    :key="index"
                    :value="item.cityCode"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >
                    {{ item.cityName }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row v-show="showStoreList">
            <i-col v-if="storeData.length>0" span="24">
              <FormItem>
                <div
                  class="bottom-line"
                >
                  <div style="margin-left: -54px; margin-right: 18px">
                    {{ storeNameList[0] }}
                  </div>
                  <Checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll(0)"
                  >
                    全选/反选
                  </Checkbox>
                </div>
                <CheckboxGroup
                  v-model="storeIds"
                  @on-change="checkAllGroupChange"
                >
                  <Checkbox
                    v-for="item in storeData"
                    ref="checkBox"
                    :key="item.storeId"
                    :label="item.storeId"
                  >
                    {{ item.storeName }}
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </i-col>
            <i-col v-if="storeData1.length>0" span="24">
              <FormItem>
                <div
                  class="bottom-line"
                >
                  <div style="margin-left: -54px; margin-right: 18px">
                    {{ storeNameList[1] }}
                  </div>
                  <Checkbox
                    :indeterminate="indeterminate1"
                    :value="checkAll1"
                    @click.prevent.native="handleCheckAll(1)"
                  >
                    全选/反选
                  </Checkbox>
                </div>
                <CheckboxGroup
                  v-model="storeIds"
                  @on-change="checkAllGroupChange1"
                >
                  <Checkbox
                    v-for="item in storeData1"
                    ref="checkBox"
                    :key="item.storeId"
                    :label="item.storeId"
                  >
                    {{ item.storeName }}
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </i-col>
            <i-col v-if="storeData2.length>0" span="24">
              <FormItem>
                <div
                  class="bottom-line"
                >
                  <div style="margin-left: -54px; margin-right: 18px">
                    {{ storeNameList[2] }}
                  </div>
                  <Checkbox
                    :indeterminate="indeterminate2"
                    :value="checkAll2"
                    @click.prevent.native="handleCheckAll(2)"
                  >
                    全选/反选
                  </Checkbox>
                </div>
                <CheckboxGroup
                  v-model="storeIds"
                  @on-change="checkAllGroupChange2"
                >
                  <Checkbox
                    v-for="item in storeData2"
                    ref="checkBox"
                    :key="item.storeId"
                    :label="item.storeId"
                  >
                    {{ item.storeName }}
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </i-col>
            <i-col v-if="storeData3.length>0" span="24">
              <FormItem>
                <div
                  class="bottom-line"
                >
                  <div style="margin-left: -54px; margin-right: 18px">
                    {{ storeNameList[3] }}
                  </div>
                  <Checkbox
                    :indeterminate="indeterminate3"
                    :value="checkAll3"
                    @click.prevent.native="handleCheckAll(3)"
                  >
                    全选/反选
                  </Checkbox>
                </div>
                <CheckboxGroup
                  v-model="storeIds"
                  @on-change="checkAllGroupChange3"
                >
                  <Checkbox
                    v-for="item in storeData3"
                    ref="checkBox"
                    :key="item.storeId"
                    :label="item.storeId"
                  >
                    {{ item.storeName }}
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </i-col>
            <i-col v-if="storeData4.length>0" span="24">
              <FormItem>
                <div
                  class="bottom-line"
                >
                  <div style="margin-left: -54px; margin-right: 18px">
                    {{ storeNameList[4] }}
                  </div>
                  <Checkbox
                    :indeterminate="indeterminate4"
                    :value="checkAll4"
                    @click.prevent.native="handleCheckAll(4)"
                  >
                    全选/反选
                  </Checkbox>
                </div>
                <CheckboxGroup
                  v-model="storeIds"
                  @on-change="checkAllGroupChange4"
                >
                  <Checkbox
                    v-for="item in storeData4"
                    ref="checkBox"
                    :key="item.storeId"
                    :label="item.storeId"
                  >
                    {{ item.storeName }}
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </i-col>
            <i-col v-if="storeData5.length>0" span="24">
              <FormItem>
                <div
                  class="bottom-line"
                >
                  <div style="margin-left: -54px; margin-right: 18px">
                    {{ storeNameList[5] }}
                  </div>
                  <Checkbox
                    :indeterminate="indeterminate5"
                    :value="checkAll5"
                    @click.prevent.native="handleCheckAll(5)"
                  >
                    全选/反选
                  </Checkbox>
                </div>
                <CheckboxGroup
                  v-model="storeIds"
                  @on-change="checkAllGroupChange5"
                >
                  <Checkbox
                    v-for="item in storeData5"
                    ref="checkBox"
                    :key="item.storeId"
                    :label="item.storeId"
                  >
                    {{ item.storeName }}
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </i-col>
            <i-col v-if="storeData6.length>0" span="24">
              <FormItem>
                <div
                  class="bottom-line"
                >
                  <div style="margin-left: -54px; margin-right: 18px">
                    {{ storeNameList[6] }}
                  </div>
                  <Checkbox
                    :indeterminate="indeterminate6"
                    :value="checkAll6"
                    @click.prevent.native="handleCheckAll(6)"
                  >
                    全选/反选
                  </Checkbox>
                </div>
                <CheckboxGroup
                  v-model="storeIds"
                  @on-change="checkAllGroupChange6"
                >
                  <Checkbox
                    v-for="item in storeData6"
                    ref="checkBox"
                    :key="item.storeId"
                    :label="item.storeId"
                  >
                    {{ item.storeName }}
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </i-col>
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
          @click="handleTemplateEdit"
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

import {
  getCouponExchangePages,
  deleteCouponExchange,
  createCouponExchange,
  editCouponExchange,
  getCouponTemplatePages,
  getHdCouponActivitiesPages
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import relationStoreMixin from '@/mixins/relationStoreMixin.js';
import {
  couponStatusConvert,
  couponTypeConvert,
  couponScopeConvert,
  couponUseLimitConvert,
  userScopeConvert
} from '@/libs/converStatus';
import {
  couponStatusEnum,
  couponTypeEnum,
  couponScopeEnum,
  couponUseLimitEnum,
  validDateTypeEnum,
  userScopeEnum,
  relationStoreTypeEnum
} from '@/libs/enumerate';
import {
  compareData,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  replaceByTag,
  replaceByTab,
  HdDiscount,
  compareCouponData
} from '@/libs/util';

const relationDetail = {
  id: 0,
  activityCouponId: 0,
  couponName: '',
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: '',
  effectiveStartTime: null,
  effectiveEndTime: null,
  couponLimit: 999,
  receiveCount: 0,
  couponRules: '',
  couponDetail: '',
  couponReminderMsg: '',
  couponScope: 'STORE',
  useLimitType: null,
  hdActivityId: 0,
  validDateType: 'UN_FIXED_DATE',
  userScope: 'ALL',
  receiveLimit: 999,
  beginDay: 0,
  maxDiscountFee: null,
  stores: null,
  relationStoreType: 'ALL',
  endDay: 0,
  rank: 0, // 排序字段
  points: 0,
  realPoints: 0,
  cityCode: '0731'
};

const roleRowData = {
  couponStatus: null,
  couponName: null,
  page: 1,
  rows: 10,
  sidx: 'createTime',
  sort: 'desc'
};

const templateRowData = {
  couponName: null,
  couponType: null,
  couponStatus: 'VALID',
  page: 1,
  rows: 5,
  sidx: 'create_time',
  sort: 'desc'
};

// all表示查全部，manual（手工发券），behavior（行为发券），scmaction（分销领券），
// trans（交易发券），applet（小程序发券），mbrgrade（会员等级发券），
// recharge（充值发券），component（第三方发券），precision（精准发券）
const hdTemplateRowData = {
  storeId: null,
  sortKey: null,
  desc: null,
  platformId: null,
  activityTypes: ['component'],
  activityId: null,
  page: 1,
  rows: 5
};

const dataColumns = [
  {
    title: '优惠券名称',
    key: 'couponName',
    align: 'center',
    width: 180,
    fixed: 'left'
  },
  {
    title: '券类型',
    align: 'center',
    key: 'couponType',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === 'FULL_CUT_COUPON') {
        return (
          <div>
            <tag color='magenta'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'DISCOUNT_COUPON') {
        return (
          <div>
            <tag color='orange'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'CASH_COUPON') {
        return (
          <div>
            <tag color='cyan'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    },
    minWidth: 100
  },
  {
    title: '优惠/折扣',
    align: 'center',
    key: 'couponFee',
    width: 100,
    render(h, params) {
      const { row } = params;
      if (row.couponType === 'DISCOUNT_COUPON') {
        return <div>{row.couponFee / 10 + '折'}</div>;
      } else {
        return <div>{fenToYuanDot2(params.row.couponFee)}</div>;
      }
    }
  },
  {
    title: '最小购买金额',
    align: 'center',
    key: 'minBuyFee',
    width: 130,
    render(h, params) {
      return h('div', fenToYuanDot2(params.row.minBuyFee));
    }
  },
  {
    title: '最高优惠金额',
    align: 'center',
    key: 'maxDiscountFee',
    width: 130,
    render(h, params) {
      const { row } = params;
      if (row.maxDiscountFee != null) {
        return <div>{fenToYuanDot2(row.maxDiscountFee)}</div>;
      } else {
        return <div>{'N/A'}</div>;
      }
    }
  },
  {
    title: '券状态',
    align: 'center',
    key: 'couponStatus',
    width: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponStatus === 'VALID') {
        return (
          <div>
            <tag color='success'>
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      } else if (row.couponStatus === 'INVALID') {
        return (
          <div>
            <tag color='error'>
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      }
      return <div>{row.couponStatus}</div>;
    }
  },
  {
    title: '券使用范围',
    align: 'center',
    key: 'couponScope',
    width: 110,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponScope === 'STORE') {
        return (
          <div>
            <tag color='magenta'>
              {couponScopeConvert(row.couponScope).label}
            </tag>
          </div>
        );
      } else if (row.couponScope === 'STORE_AND_SMALL') {
        return (
          <div>
            <tag color='orange'>
              {couponScopeConvert(row.couponScope).label}
            </tag>
          </div>
        );
      } else if (row.couponScope === 'SMALL') {
        return (
          <div>
            <tag color='cyan'>{couponScopeConvert(row.couponScope).label}</tag>
          </div>
        );
      }
      return <div>{row.couponScope}</div>;
    }
  },
  {
    title: '用户范围',
    align: 'center',
    key: 'userScope',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.userScope === 'ALL') {
        return <div>{userScopeConvert(row.userScope).label}</div>;
      } else if (row.userScope === 'SVIP') {
        return <div>{userScopeConvert(row.userScope).label}</div>;
      }
      return <div>{row.userScope}</div>;
    },
    width: 100
  },
  {
    title: '券使用限制',
    align: 'center',
    key: 'useLimitType',
    width: 130,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.useLimitType === 'SMALL_ALL') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === 'PART_GOODS') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === 'PART_STORES') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === 'HD_ALL') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '已兑换统计',
    align: 'center',
    key: 'receiveCount',
    width: 110
  },
  {
    title: '生效时间',
    align: 'center',
    key: 'effectiveStartTime',
    width: 120,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source == 'SMALL' && row.validDateType === 'FIXED_DATE') {
        return <div>{row.effectiveStartTime}</div>;
      } else if (
        row.source == 'SMALL' &&
        row.validDateType === 'UN_FIXED_DATE'
      ) {
        return <div>{row.beginDay}</div>;
      } else if (row.source == 'HD') {
        return <div>{row.effectiveStartTime}</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '失效时间',
    align: 'center',
    key: 'effectiveEndTime',
    width: 220,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source == 'SMALL' && row.validDateType === 'FIXED_DATE') {
        if (!compareCouponData(row.effectiveEndTime)) {
          return <div style='color:red'>{row.effectiveEndTime + '已过期'}</div>;
        } else {
          return <div>{row.effectiveEndTime}</div>;
        }
      } else if (
        row.source == 'SMALL' &&
        row.validDateType === 'UN_FIXED_DATE'
      ) {
        return <div>{row.endDay}</div>;
      } else if (row.source == 'HD') {
        if (!compareCouponData(row.effectiveEndTime)) {
          return <div style='color:red'>{row.effectiveEndTime + '已过期'}</div>;
        } else {
          return <div>{row.effectiveEndTime}</div>;
        }
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '创建时间',
    align: 'center',
    key: 'createTime',
    width: 120
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: 180,
    key: 'handle',
    options: ['couponStatus', 'view', 'edit']
  }
];

const templateColumns = [
  {
    type: 'index',
    width: 60,
    align: 'center'
  },
  {
    title: '优惠券名称',
    key: 'couponName',
    align: 'center',
    minWidth: 150
  },
  {
    title: '券类型',
    align: 'center',
    key: 'couponType',
    width: 100,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === 'FULL_CUT_COUPON') {
        return (
          <div>
            <tag color='magenta'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'DISCOUNT_COUPON') {
        return (
          <div>
            <tag color='orange'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'CASH_COUPON') {
        return (
          <div>
            <tag color='cyan'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'FREIGHT_COUPON') {
        return (
          <div>
            <tag color='blue'>{couponTypeConvert(row.couponType).label}</tag>
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
    title: '优惠/折扣额度',
    align: 'center',
    key: 'couponFee',
    width: 140,
    render(h, params) {
      const { row } = params;
      if (row.couponType === 'DISCOUNT_COUPON') {
        return <div>{row.couponFee / 10 + '折'}</div>;
      } else {
        return <div>{fenToYuanDot2(params.row.couponFee)}</div>;
      }
    }
  },
  {
    title: '最小购买金额',
    align: 'center',
    key: 'minBuyFee',
    width: 130,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
    }
  },
  {
    title: '最高优惠金额',
    align: 'center',
    key: 'maxDiscountFee',
    width: 130,
    render(h, params) {
      if (params.row.maxDiscountFee) {
        return <div>{fenToYuanDot2(params.row.maxDiscountFee)}</div>;
      } else {
        return <div>{'N/A'}</div>;
      }
    }
  },
  {
    title: '券状态',
    align: 'center',
    key: 'couponStatus',
    width: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponStatus === 'VALID') {
        return (
          <div>
            <tag color='success'>
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      } else if (row.couponStatus === 'INVALID') {
        return (
          <div>
            <tag color='error'>
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
    type: 'index',
    width: 60,
    align: 'center'
  },
  {
    title: '优惠券名称',
    key: 'couponName',
    align: 'center',
    minWidth: 150
  },
  {
    title: '券类型',
    align: 'center',
    key: 'couponType',
    width: 100,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === 'FULL_CUT_COUPON') {
        return (
          <div>
            <tag color='magenta'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'DISCOUNT_COUPON') {
        return (
          <div>
            <tag color='orange'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'CASH_COUPON') {
        return (
          <div>
            <tag color='cyan'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    }
  },
  {
    title: '券使用限制',
    align: 'center',
    key: 'useLimitType',
    width: 110,
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
  // HdDiscount版本
  {
    title: '优惠/折扣额度',
    align: 'center',
    key: 'faceValue',
    width: 140,
    render(h, params) {
      const { row } = params;
      if (row.couponType === 'DISCOUNT_COUPON') {
        const couponFee = HdDiscount(params.row.discount);
        return <div>{couponFee}</div>;
      } else {
        return <div>{fenToYuanDot2(params.row.faceValue)}</div>;
      }
    }
  },
  {
    title: '最小购买金额',
    align: 'center',
    key: 'useRule',
    width: 130,
    render(h, params, vm) {
      const useRule = params.row.useRule;
      const startIndex = useRule.indexOf('满');
      const endIndex = useRule.indexOf('元');
      const minBuyFee = useRule.slice(startIndex + 1, endIndex);
      return <div>{fenToYuanDot2(minBuyFee * 100)}</div>;
    }
  },
  {
    title: '生效时间',
    align: 'center',
    key: 'beginDate',
    minWidth: 50
  },
  {
    title: '失效时间',
    align: 'center',
    key: 'endDate',
    minWidth: 50
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
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin, relationStoreMixin],
  data() {
    return {
      addRelationList: [],
      couponTemplateData: [],
      hdCouponTemplateData: [],
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      cityList: [],
      templatePageOpts: [5, 10],
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      modalAdd: false,
      showValidDate: true,
      couponTemplateTotal: 0,
      couponHdTemplateTotal: 0,
      couponStatusEnum,
      relationStoreTypeEnum,
      couponTypeEnum,
      couponScopeEnum,
      userScopeEnum,
      couponUseLimitEnum,
      validDateTypeEnum,
      dataColumns: dataColumns,
      templateColumns: templateColumns,
      hdTemplateColumns: hdTemplateColumns,
      searchRowData: _.cloneDeep(roleRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      searchHdTemplateRowData: _.cloneDeep(hdTemplateRowData),
      relationDetail: _.cloneDeep(relationDetail),
      addRelationDetail: _.cloneDeep(relationDetail),
      relationRuleInline: {
        effectiveStartTime: [{ required: false, message: '请选择生效时间' }],
        effectiveEndTime: [{ required: false, message: '请选择失效时间' }],
        beginDay: [{ required: false, message: '请输入生效天数' }],
        endDay: [{ required: false, message: '请输入失效天数' }],
        couponScope: [{ required: false, message: '请选择券使用范围' }],
        useLimitType: [{ required: true, message: '请选择券使用限制' }],
        couponRules: [{ required: true, message: '请输入券使用规则' }],
        couponDetail: [{ required: true, message: '请输入券详情' }],
        couponReminderMsg: [{ required: true, message: '请输入券温馨提示' }],
        userScope: [{ required: true, message: '请选择用户范围' }],
        couponName: [{ required: true, message: '请输入优惠券名称' }],
        points: [
          { required: true, message: '请输入兑换积分' },
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
        realPoints: [
          { required: true, message: '请输入促销积分' },
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
        receiveLimit: [
          { required: true, message: '请输入每人限兑数量' },
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
        couponLimit: [
          { required: true, message: '请输入发券限制数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ]
      }
    };
  },
  computed: {
    minBuyFeeComputed() {
      return fenToYuanDot2Number(this.relationDetail.minBuyFee);
    },
    systemCouponFixDate() {
      return (
        this.tempModalType === 'addTemplate' &&
        this.addRelationDetail.validDateType === 'FIXED_DATE'
      );
    },
    systemCouponUnFixDate() {
      return (
        this.tempModalType === 'addTemplate' &&
        this.addRelationDetail.validDateType === 'UN_FIXED_DATE'
      );
    },
    maxDiscountFeeComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.maxDiscountFee);
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData); // 刷新清除上次搜索结果
    this.getTableData();
  },
  methods: {
    statusChange(params) {
      this.addRelationDetail = _.cloneDeep(params.row);
      if (params.row.couponStatus === 'VALID') {
        this.addRelationDetail.couponStatus = 'INVALID';
      } else {
        this.addRelationDetail.couponStatus = 'VALID';
      }
      this.editCouponExchange();
    },
    handleModalAdd(isShow) {
      // 先清除对象
      this.resetFields();
      // 当展示的是添加系统优惠券
      if (isShow && this.tempModalType == 'addTemplate') {
        this.addRelationDetail.couponScope = 'SMALL';
        this.addRelationDetail.useLimitType = 'SMALL_ALL';
      }
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.addForm.resetFields();
      this.addRelationDetail = _.cloneDeep(relationDetail);
      // this.$refs.uploadMain.clearFileList();
      // this.uploadListMain = [];
    },
    handleEdit(params) {
      this.storeIds = [];
      this.addRelationDetail.relationStoreType = 'ALL';
      this.tempModalType = this.modalType.edit;
      this.addRelationDetail = _.cloneDeep(params.row);
      this.replaceTextByTab();
      if (
        this.addRelationDetail.stores !== null &&
        this.addRelationDetail.stores !== ''
      ) {
        this.showStoreList = true;
        this.addRelationDetail.relationStoreType = 'PART';
        const storeIds = this.addRelationDetail.stores
          .substring(1, this.addRelationDetail.stores.length - 1)
          .split('][');
        storeIds.forEach((element) => { this.storeIds.push(parseInt(element)); });
        console.log('selected storeIds:', this.storeIds);
        const firstStoreId = this.storeIds[0];
        // 编辑时从返回的第一个storeId单独查询下cityCode来反选城市
        const storeObj = this.allStoreList.find(item => item.storeId === firstStoreId);
        this.addRelationDetail.cityCode = storeObj.cityCode;
        this.getStore(true);
      } else {
        this.showStoreList = false;
        this.addRelationDetail.relationStoreType = 'ALL'; // storeIds为''默认关联的门店则是全部门店
      }
      this.modalEdit = true;
    },
    getTableData() {
      getCouponExchangePages(this.searchRowData)
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
    getTemplateTableData() {
      getCouponTemplatePages(this.searchTemplateRowData)
        .then((res) => {
          this.couponTemplateData = res.rows;
          this.couponTemplateTotal = res.total;
        })
        .finally(() => {
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
    editCouponExchange() {
      // 编辑状态
      this.tempTableLoading = true;
      editCouponExchange(this.addRelationDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('修改成功!');
          this.getTableData();
        })
        .finally((res) => {
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
        this.$Message.error('优惠券失效时间必须大于生效时间!');
        return false;
      }
    },
    handleTemplateEdit() {
      const _this = this;
      if (this.addRelationDetail.couponName == '') {
        this.$Message.error('请先关联一张优惠券模板!');
        return false;
      }
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          _this.extraValidator();
          _this.replaceTextByTag();
          if (this.tempModalType === this.modalType.edit) {
            _this.editCouponExchange();
          }
        } else {
          _this.$Message.error('请完善信息!');
        }
      });
    },
    handleTemplateAdd() {
      const _this = this;
      if (this.addRelationDetail.couponName == '') {
        this.$Message.error('请先关联一张优惠券模板!');
        return false;
      }
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          _this.extraValidator();
          _this.replaceTextByTag();
          if (_this.tempModalType === 'addTemplate') {
            _this.createRelation();
          } else if (_this.tempModalType === 'addHdTemplate') {
            _this.createHdRelation();
          }
        } else {
          _this.$Message.error('请完善信息!');
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
      this.addRelationDetail.maxDiscountFee = currentRow.maxDiscountFee;
    },
    handleHdTemplateChange(currentRow, oldCurrentRow) {
      const startIndex = currentRow.useRule.indexOf('满');
      const endIndex = currentRow.useRule.indexOf('元');
      const minBuyFee = currentRow.useRule.slice(startIndex + 1, endIndex);
      this.addRelationDetail.useLimitType = currentRow.useLimitType; // 海鼎券的uselimitType从couponRemark解析出
      this.addRelationDetail.couponName = currentRow.couponName;
      this.addRelationDetail.couponType = currentRow.couponType;
      this.addRelationDetail.couponFee = currentRow.faceValue;
      this.addRelationDetail.maxDiscountFee = currentRow.maxDiscountFee;
      if (currentRow.couponType === 'DISCOUNT_COUPON') {
        this.addRelationDetail.couponFee =
          parseFloat(currentRow.discount) * 100;
      }
      this.addRelationDetail.hdActivityId = currentRow.activityId;
      this.addRelationDetail.minBuyFee = minBuyFee * 100;
      this.addRelationDetail.effectiveStartTime = currentRow.beginDate; // 海鼎活动开始时间
      this.addRelationDetail.effectiveEndTime = currentRow.endDate; // 海鼎活动结束时间
    },
    effectiveStartTimeChange(value, date) {
      this.addRelationDetail.effectiveStartTime = value;
    },
    effectiveEndTimeChange(value, date) {
      this.addRelationDetail.effectiveEndTime = value;
    },
    createRelation() {
      this.modalViewLoading = true;
      // 添加的是系统券，填写来源为系统优惠券
      this.addRelationDetail.source = 'SMALL';
      createCouponExchange(this.addRelationDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    createHdRelation() {
      this.modalViewLoading = true;
      // 添加的是海鼎券，填写来源为海鼎
      this.addRelationDetail.source = 'HD';
      createCouponExchange(this.addRelationDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    getHdTemplateTableData() {
      getHdCouponActivitiesPages(this.searchHdTemplateRowData)
        .then((res) => {
          this.hdCouponTemplateData = res.rows;
          this.couponHdTemplateTotal = res.total;
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
    addCouponTemplate() {
      this.showStoreList = false;
      this.storeIds = [];
      this.getTemplateTableData();
      this.tempModalType = 'addTemplate';
      this.modalAdd = true;
    },
    addHdCouponTemplate() {
      this.showStoreList = false;
      this.storeIds = [];
      this.getHdTemplateTableData();
      this.tempModalType = 'addHdTemplate';
      this.modalAdd = true;
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.addRelationDetail = _.cloneDeep(params.row);
      this.replaceTextByTab();
      this.showStoreName = this.relationStore();
      this.modalView = true;
    },
    relationStore() {
      if (!this.addRelationDetail.stores) {
        return '全部门店';
      }
      const ids = this.addRelationDetail.stores.substring(1, this.addRelationDetail.stores.length - 1).split('][');
      let str = '';
      ids.forEach((id) => {
        const item = this.allStoreList.find(item => item.storeId == id);
        str += item.storeName + ',';
      });
      return str.substring(0, str.length - 1);
    },
    handleAddClose() {
      this.modalAdd = false;
    },
    minBuyFeeInputNumberOnchange(value) {
      this.relationDetail.minBuyFee = yuanToFenNumber(value);
    },
    maxDiscountFeeInputNumberOnchange(value) {
      this.addRelationDetail.maxDiscountFee = yuanToFenNumber(value);
    }
    // 批量删除-单行删除内部也是调用此方法
    // deleteTable(ids) {
    //   this.tempTableLoading = true;
    //   deleteCouponExchange({ ids })
    //     .then(res => {
    //       const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
    //       if (
    //         this.tableData.length == this.tableDataSelected.length &&
    //         this.searchRowData.page === totalPage &&
    //         this.searchRowData.page !== 1
    //       ) {
    //         this.searchRowData.page -= 1;
    //       }
    //       this.tableDataSelected = [];
    //       this.getTableData();
    //     })
    //     .finally(res => {
    //       this.tempTableLoading = false;
    //     });
    // }
  }
};
</script>

<style lang="scss" scoped>
</style>
