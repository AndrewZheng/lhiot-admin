<template>
  <div class="m-role">
    <Card>
      <h4 v-if="couponDetail.activityName">
        当前活动：{{ couponDetail.activityName }}
      </h4>
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
        @on-edit="handleEdit"
        @coupon-status="statusChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-view="handleView"
      >
        <div slot="operations">
          <Button
            v-show="showBack"
            v-waves
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
              <i-col span="8"> 优惠券名称: </i-col>
              <i-col span="16">
                {{ addRelationDetail.couponName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8"> 优惠券类型: </i-col>
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
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8"> 优惠/折扣额度: </i-col>
              <i-col
                v-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'"
                span="16"
              >
                {{ addRelationDetail.couponFee | fenToDiscountFilters }}
              </i-col>
              <i-col v-else span="16">
                {{ addRelationDetail.couponFee | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8"> 最小购买金额: </i-col>
              <i-col span="16">
                {{ addRelationDetail.minBuyFee | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8"> 优惠券状态: </i-col>
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
              <i-col span="8"> 已兑换统计: </i-col>
              <i-col span="16">
                {{ addRelationDetail.receiveCount }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8"> 券有效期类型: </i-col>
              <i-col span="16">
                {{ addRelationDetail.validDateType | validDateTypeFilter }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8"> 发券总数: </i-col>
              <i-col span="16">
                {{ addRelationDetail.couponLimit }}
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
              <i-col span="8"> 生效开始: </i-col>
              <i-col span="16">
                {{ addRelationDetail.beginDay }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8"> 有效天数: </i-col>
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
              <i-col span="8"> 生效时间: </i-col>
              <i-col span="16">
                {{ addRelationDetail.effectiveStartTime }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8"> 失效时间: </i-col>
              <i-col span="16">
                {{ addRelationDetail.effectiveEndTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8"> 券使用范围: </i-col>
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
              <i-col span="8"> 券使用限制: </i-col>
              <i-col span="16">
                {{ addRelationDetail.useLimitType | couponUseLimitFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8"> 最高优惠金额: </i-col>
              <i-col v-if="addRelationDetail.maxDiscountFee != null" span="16">
                {{ addRelationDetail.maxDiscountFee | fenToYuanDot2Filters }}
              </i-col>
              <i-col v-else span="16">
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8"> 使用规则: </i-col>
              <i-col span="16">
                {{ addRelationDetail.couponRules }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4"> 关联门店: </i-col>
              <i-col span="16">
                {{ showStoreName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose"> 关闭 </Button>
      </div>
    </Modal>
    <!-- 添加 -->
    <Modal
      v-model="modalAdd"
      :width="1000"
      :z-index="1000"
      :mask-closable="false"
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
                  style="padding-right: 5px; width: 120px"
                  clearable
                >
                  <Option
                    v-for="(item, index) in couponTypeEnum"
                    :key="index"
                    :value="item.value"
                    :disabled="index == 3"
                    class="ptb2-5"
                    style="padding-left: 5px; width: 120px"
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
                <FormItem label="券有效期:" prop="validDateType">
                  <Select
                    v-model="addRelationDetail.validDateType"
                    placeholder="券有效期类型"
                    style="padding-right: 5px; width: 130px"
                  >
                    <Option
                      v-for="(item, index) in validDateTypeEnum"
                      :key="index"
                      :value="item.value"
                      class="ptb2-5"
                      style="padding-left: 5px; width: 130px"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
              <template
                v-if="addRelationDetail.validDateType == 'UN_FIXED_DATE'"
              >
                <i-col span="7">
                  <FormItem label="发放券后:" prop="beginDay">
                    <InputNumber
                      v-model="addRelationDetail.beginDay"
                      :min="0"
                      label="生效开始"
                      style="width: 100px"
                    ></InputNumber>&nbsp;天生效
                  </FormItem>
                </i-col>
                <i-col span="7">
                  <FormItem label="有效天数:" prop="endDay">
                    <InputNumber
                      v-model="addRelationDetail.endDay"
                      :min="0"
                      label="有效天数"
                      style="width: 100px"
                    ></InputNumber>&nbsp;天
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
                <FormItem label="发券总数:" prop="couponLimit">
                  <InputNumber
                    v-model="addRelationDetail.couponLimit"
                    :min="0"
                    label="限购数量"
                    style="padding-right: 5px; width: 120px"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6" style="margin-right: 40px">
                <FormItem
                  v-show="tempModalType == 'addHdTemplate'"
                  label="券使用范围:"
                  prop="couponScope"
                  :label-width="110"
                >
                  <Select
                    v-model="addRelationDetail.couponScope"
                    placeholder="请选择"
                    style="padding-right: 5px; width: 100px"
                    clearable
                  >
                    <Option
                      v-for="(item, index) in couponScopeEnum"
                      :key="index"
                      :value="item.value"
                      :disabled="
                        tempModalType == 'addHdTemplate' &&
                          item.value === 'SMALL'
                      "
                      class="ptb2-5"
                      style="padding-left: 5px; width: 100px"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem
                  v-show="tempModalType == 'addTemplate'"
                  label="券使用范围:"
                  prop="couponScope"
                  :label-width="112"
                >
                  {{ addRelationDetail.couponScope | couponScopeFilter }}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem
                  v-show="tempModalType == 'addHdTemplate'"
                  label="券使用限制:"
                  prop="useLimitType"
                  :label-width="100"
                >
                  <Select
                    v-model="addRelationDetail.useLimitType"
                    placeholder="请选择"
                    style="padding-right: 5px; width: 120px"
                    clearable
                    :disabled="tempModalType == 'addHdTemplate'"
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
                <FormItem
                  v-show="tempModalType == 'addTemplate'"
                  label="券使用限制:"
                  prop="useLimitType"
                  :label-width="112"
                >
                  {{ addRelationDetail.useLimitType | couponUseLimitFilter }}
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="排序字段:" prop="rank" :label-width="100">
                  <InputNumber
                    v-model="addRelationDetail.rank"
                    label
                    style="padding-right: 5px; width: 120px"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col v-if="tempModalType == 'addTemplate'" span="6">
                <FormItem
                  v-if="addRelationDetail.maxDiscountFee"
                  :label-width="112"
                  label="最高优惠金额:"
                  prop="maxDiscountFee"
                >
                  {{ addRelationDetail.maxDiscountFee | fenToYuanDot2Filters }}
                </FormItem>
                <FormItem
                  v-else
                  :label-width="112"
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
                <FormItem label="券使用规则:" prop="couponRules">
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
            </Row>
            <Row v-show="showStoreList">
              <i-col span="24">
                <FormItem>
                  <div
                    style="
                      border-bottom: 1px solid #e9e9e9;
                      padding-bottom: 6px;
                      margin-bottom: 6px;
                      display: flex;
                    "
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
                    v-model="stores"
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
              <i-col span="24">
                <FormItem>
                  <div
                    style="
                      border-bottom: 1px solid #e9e9e9;
                      padding-bottom: 6px;
                      margin-bottom: 6px;
                      display: flex;
                    "
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
                    v-model="stores"
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
              <i-col span="24">
                <FormItem>
                  <div
                    style="
                      border-bottom: 1px solid #e9e9e9;
                      padding-bottom: 6px;
                      margin-bottom: 6px;
                      display: flex;
                    "
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
                    v-model="stores"
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
              <i-col span="24">
                <FormItem>
                  <div
                    style="
                      border-bottom: 1px solid #e9e9e9;
                      padding-bottom: 6px;
                      margin-bottom: 6px;
                      display: flex;
                    "
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
                    v-model="stores"
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
              <i-col span="24">
                <FormItem>
                  <div
                    style="
                      border-bottom: 1px solid #e9e9e9;
                      padding-bottom: 6px;
                      margin-bottom: 6px;
                      display: flex;
                    "
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
                    v-model="stores"
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
              <i-col span="24">
                <FormItem>
                  <div
                    style="
                      border-bottom: 1px solid #e9e9e9;
                      padding-bottom: 6px;
                      margin-bottom: 6px;
                      display: flex;
                    "
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
                    v-model="stores"
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
              <i-col span="24">
                <FormItem>
                  <div
                    style="
                      border-bottom: 1px solid #e9e9e9;
                      padding-bottom: 6px;
                      margin-bottom: 6px;
                      display: flex;
                    "
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
                    v-model="stores"
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
              <!-- <i-col span="24">
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
                  <CheckboxGroup v-model="stores" @on-change="checkAllGroupChange7">
                    <Checkbox
                      v-for="item in storeData7"
                      ref="checkBox"
                      :key="item.storeId"
                      :label="item.storeId"
                    >{{ item.storeName }}</Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </i-col>-->
            </Row> </Form>*Tips：请先选择要关联的优惠券，然后输入关联配置信息，不可关联多个优惠券模板
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose"> 关闭 </Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleTemplateAdd"
        >
          确定
        </Button>
      </div>
    </Modal>

    <Modal
      v-model="modalEdit"
      :width="900"
      :z-index="1000"
      :mask-closable="false"
    >
      <p slot="header">
        <i-col>修改优惠券活动和模板关联</i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="addRelationDetail"
          :rules="ruleInline"
          :label-width="100"
        >
          <Row>
            <i-col span="6">
              <FormItem label="优惠券类型:">
                {{ addRelationDetail.couponType | couponTypeFilter }}
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                v-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'"
                label="折扣额度:"
                prop="couponFee"
              >
                {{ addRelationDetail.couponFee | fenToDiscountFilters }}
              </FormItem>
              <FormItem v-else label="优惠金额:" prop="couponFee">
                {{ addRelationDetail.couponFee | fenToYuanDot2Filters }}
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="最小购买金额:" prop="minBuyFee">
                {{ addRelationDetail.minBuyFee | fenToYuanDot2Filters }}
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="券使用限制:"
                prop="useLimitType"
                :label-width="100"
              >
                {{ addRelationDetail.useLimitType | couponUseLimitFilter }}
              </FormItem>
            </i-col>
          </Row>
          <Divider>可修改部分</Divider>
          <Row>
            <i-col span="6">
              <FormItem label="优惠券名称:" :label-width="100">
                <Input v-model="addRelationDetail.couponName"></Input>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="　发券数量:"
                prop="couponLimit"
                :label-width="100"
              >
                <InputNumber
                  v-model="addRelationDetail.couponLimit"
                  :min="0"
                  label="限购数量"
                  style="padding-right: 5px; width: 115px"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="优惠券状态:"
                prop="couponStatus"
                :label-width="100"
              >
                <Select
                  v-model="addRelationDetail.couponStatus"
                  placeholder="请选择"
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
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem label="排序字段:" prop="rank" :label-width="100">
                <InputNumber
                  v-model="addRelationDetail.rank"
                  label
                  style="width: 120px"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                v-if="addRelationDetail.source == 'SMALL'"
                label="券使用范围:"
                prop="couponScope"
                :label-width="100"
              >
                {{ addRelationDetail.couponScope | couponScopeFilter }}
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
                    :disabled="index == 2"
                    class="ptb2-5"
                    style="padding-left: 5px; width: 120px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col v-if="addRelationDetail.source == 'SMALL'" span="6">
              <FormItem label="券有效期:" prop="useLimitType">
                <Select
                  v-model="addRelationDetail.validDateType"
                  placeholder="券有效期类型"
                  disabled
                  style="padding-right: 5px; width: 130px"
                >
                  <Option
                    v-for="(item, index) in validDateTypeEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px; width: 130px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <template
              v-if="
                addRelationDetail.source == 'SMALL' &&
                  addRelationDetail.validDateType == 'UN_FIXED_DATE'
              "
            >
              <i-col span="7">
                <FormItem label="发券后:" prop="beginDay">
                  <InputNumber
                    v-model="addRelationDetail.beginDay"
                    :min="0"
                    label="生效开始"
                    style="width: 90px"
                  ></InputNumber>&nbsp;天生效
                </FormItem>
              </i-col>
              <i-col span="7">
                <FormItem label="有效天数:" prop="endDay">
                  <InputNumber
                    v-model="addRelationDetail.endDay"
                    :min="0"
                    label="有效天数"
                    style="width: 90px"
                  ></InputNumber>&nbsp;天
                </FormItem>
              </i-col>
            </template>
            <template
              v-if="
                addRelationDetail.source == 'SMALL' &&
                  addRelationDetail.validDateType == 'FIXED_DATE'
              "
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
              <FormItem
                label="券使用规则:"
                prop="couponRules"
                :label-width="100"
              >
                <Input
                  v-model="addRelationDetail.couponRules"
                  :rows="3"
                  placeholder="使用规则"
                  type="textarea"
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
          </Row>
          <Row v-show="showStoreList">
            <i-col span="24">
              <FormItem>
                <div
                  style="
                    border-bottom: 1px solid #e9e9e9;
                    padding-bottom: 6px;
                    margin-bottom: 6px;
                    display: flex;
                  "
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
                  v-model="stores"
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
            <i-col span="24">
              <FormItem>
                <div
                  style="
                    border-bottom: 1px solid #e9e9e9;
                    padding-bottom: 6px;
                    margin-bottom: 6px;
                    display: flex;
                  "
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
                  v-model="stores"
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
            <i-col span="24">
              <FormItem>
                <div
                  style="
                    border-bottom: 1px solid #e9e9e9;
                    padding-bottom: 6px;
                    margin-bottom: 6px;
                    display: flex;
                  "
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
                  v-model="stores"
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
            <i-col span="24">
              <FormItem>
                <div
                  style="
                    border-bottom: 1px solid #e9e9e9;
                    padding-bottom: 6px;
                    margin-bottom: 6px;
                    display: flex;
                  "
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
                  v-model="stores"
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
            <i-col span="24">
              <FormItem>
                <div
                  style="
                    border-bottom: 1px solid #e9e9e9;
                    padding-bottom: 6px;
                    margin-bottom: 6px;
                    display: flex;
                  "
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
                  v-model="stores"
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
            <i-col span="24">
              <FormItem>
                <div
                  style="
                    border-bottom: 1px solid #e9e9e9;
                    padding-bottom: 6px;
                    margin-bottom: 6px;
                    display: flex;
                  "
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
                  v-model="stores"
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
            <i-col span="24">
              <FormItem>
                <div
                  style="
                    border-bottom: 1px solid #e9e9e9;
                    padding-bottom: 6px;
                    margin-bottom: 6px;
                    display: flex;
                  "
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
                  v-model="stores"
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
            <!-- <i-col span="24">
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
                <CheckboxGroup v-model="stores" @on-change="checkAllGroupChange7">
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
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose"> 关闭 </Button>
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
import _ from 'lodash';
import {
  getRegisteredGiftPages,
  deleteRegisterGift,
  createRegisterGift,
  editRegisterGift,
  getCouponTemplatePages,
  getHdCouponActivitiesPages,
  getAreaStorePages
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  couponStatusConvert,
  couponTypeConvert,
  couponScopeConvert,
  couponUseLimitConvert
} from '@/libs/converStatus';
import {
  couponStatusEnum,
  couponTypeEnum,
  couponScopeEnum,
  couponUseLimitEnum,
  validDateTypeEnum,
  relationStoreTypeEnum
} from '@/libs/enumerate';
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
} from '@/libs/util';

// 优惠券活动对象
const couponDetail = {
  formBeginTime: null,
  formEndTime: null,
  activityShareId: 0,
  id: 0,
  activityRegisterId: 0,
  activityName: '',
  activityRuel: '',
  activityContent: '',
  ifEffective: null,
  beginTime: null,
  endTime: null,
  createUser: '',
  maxDiscountFee: null,
  createTime: null,
  applicationType: null,
  activityImage: '',
  activityUrl: '',
  hdActivityId: '',
  stores: null,
  relationStoreType: 'ALL',
  rank: 0
};

// 关联的优惠券配置对象
const relationDetail = {
  activityRegisterId: 0,
  couponName: '',
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  effectiveStartTime: null,
  effectiveEndTime: null,
  couponLimit: 0,
  receiveCount: 0,
  couponRules: '',
  couponScope: null,
  useLimitType: null,
  hdActivityId: 0,
  source: 'SMALL', // 默认来源为系统对象
  validDateType: 'UN_FIXED_DATE',
  beginDay: 0,
  endDay: 0,
  stores: null,
  relationStoreType: 'ALL'
};

// 系统优惠券模板对象
const couponTemplateDetail = {
  id: 0,
  couponName: '',
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: '',
  createUser: '',
  createTime: null,
  couponRules: '',
  couponScope: null,
  rank: 0
};

// 海鼎优惠券模板对象
const hdCouponTemplateDetail = {
  activityRegisterId: 0,
  beginDate: null,
  endDate: null,
  couponFee: 0,
  couponName: '',
  couponRemark: '',
  couponType: '',
  faceValue: 0,
  price: 0,
  useRule: '',
  couponLimit: 0,
  couponRules: '',
  couponScope: null,
  couponStatus: null,
  minBuyFee: 0,
  receiveCount: 0,
  source: 'HD',
  useLimitType: null,
  validDateType: 'FIXED_DATE',
  hdActivityId: '',
  rank: 0
};

const roleRowData = {
  activityRegisterId: null,
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
  couponStatus: 'VALID',
  page: 1,
  rows: 5,
  sidx: 'create_time',
  sort: 'desc'
};

const hdTemplateRowData = {
  storeId: null,
  sortKey: null,
  desc: null,
  platformId: null,
  activityTypes: ['component'],
  activityRegisterId: null,
  page: 1,
  rows: 5
};

const dataColumns = [
  {
    title: '优惠券名称',
    key: 'couponName',
    align: 'center',
    minWidth: 180,
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
    title: '使用范围',
    align: 'center',
    key: 'couponScope',
    minWidth: 100,
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
    title: '券使用限制',
    align: 'center',
    key: 'useLimitType',
    minWidth: 130,
    render: (h, params, vm) => {
      const { row } = params;
      return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
    }
  },
  {
    title: '来源',
    align: 'center',
    key: 'source',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source === 'SMALL') {
        return <div>小程序</div>;
      } else if (row.source === 'HD') {
        return <div>海鼎</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '优惠/折扣额度',
    align: 'center',
    key: 'couponFee',
    minWidth: 130,
    render(h, params) {
      const { row } = params;
      if (row.couponType === 'DISCOUNT_COUPON') {
        return <div>{row.couponFee / 10 + '折'}</div>;
      } else {
        return <div>{fenToYuanDot2(row.couponFee)}</div>;
      }
    }
  },
  {
    title: '最小购买金额',
    align: 'center',
    key: 'minBuyFee',
    minWidth: 130,
    render(h, params) {
      return h('div', fenToYuanDot2(params.row.minBuyFee));
    }
  },
  {
    title: '最高优惠金额',
    align: 'center',
    key: 'maxDiscountFee',
    minWidth: 130,
    render(h, params) {
      const { row } = params;
      if (row.maxDiscountFee != null) {
        return <div>{'¥' + row.maxDiscountFee / 100}</div>;
      } else {
        return <div>{'N/A'}</div>;
      }
      return <div>{row.maxDiscountFee}</div>;
    }
  },
  {
    title: '券状态',
    align: 'center',
    key: 'couponStatus',
    minWidth: 90,
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
    title: '生效时间',
    key: 'effectiveStartTime',
    align: 'center',
    minWidth: 180,
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
    key: 'effectiveEndTime',
    align: 'center',
    minWidth: 230,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source == 'SMALL' && row.validDateType === 'FIXED_DATE') {
        if (!compareCouponData(row.effectiveEndTime)) {
          return (
            <div style='color:red'>{row.effectiveEndTime + ' 已过期'}</div>
          );
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
    title: '已领取统计',
    align: 'center',
    key: 'receiveCount',
    minWidth: 120
  },
  {
    title: '发券总数限制',
    align: 'center',
    key: 'couponLimit',
    minWidth: 130
  },
  {
    title: '排序',
    align: 'center',
    key: 'rank',
    minWidth: 70
  },
  {
    title: '操作',
    align: 'center',
    minWidth: 150,
    key: 'handle',
    fixed: 'right',
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
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      ruleInline: {
        effectiveStartTime: [{ required: true, message: '请选择生效时间' }],
        effectiveEndTime: [{ required: true, message: '请选择失效时间' }],
        couponStatus: [{ required: true, message: '请选择优惠券状态' }],
        couponType: [{ required: true, message: '请选择优惠券类型' }],
        couponName: [
          { required: true, message: '请输入优惠券名称' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 20) {
                errors.push(new Error('字数限制20字'));
              }
              callback(errors);
            }
          }
        ],
        couponScope: [{ required: true, message: '请选择券使用范围' }],
        couponRules: [
          { required: true, message: '请输入券使用规则' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 200) {
                errors.push(new Error('字数限制200字'));
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
      },
      relationRuleInline: {
        effectiveStartTime: [{ required: false, message: '请选择生效时间' }],
        effectiveEndTime: [{ required: false, message: '请选择失效时间' }],
        couponName: [
          { required: true, message: '请输入优惠券名称' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 20) {
                errors.push(new Error('字数限制20字'));
              }
              callback(errors);
            }
          }
        ],
        couponStatus: [{ required: true, message: '请选择优惠券状态' }],
        couponType: [{ required: true, message: '请选择优惠券类型' }],
        couponScope: [{ required: true, message: '请选择券使用范围' }],
        useLimitType: [{ required: true, message: '请选择券使用限制' }],
        couponRules: [
          { required: true, message: '请输入券使用规则' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 200) {
                errors.push(new Error('字数限制200字'));
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
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      templatePageOpts: [5, 10],
      couponStatusEnum,
      couponTypeEnum,
      validDateTypeEnum,
      couponScopeEnum,
      relationStoreTypeEnum,
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
      storeNameList: [],
      storeList: [],
      storeData: [],
      storeData1: [],
      storeData2: [],
      storeData3: [],
      storeData4: [],
      storeData5: [],
      storeData6: [],
      storeData7: [],
      stores: [],
      storeListData: [],
      showStoreList: false,
      showValidDate: true,
      indeterminate: false,
      indeterminate1: false,
      indeterminate2: false,
      indeterminate3: false,
      indeterminate4: false,
      indeterminate5: false,
      indeterminate6: false,
      indeterminate7: false,
      checkAll: false,
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkAll4: false,
      checkAll5: false,
      checkAll6: false,
      checkAll7: false,
      showStoreName: '',
      couponTemplateTotal: 0,
      couponHdTemplateTotal: 0
    };
  },
  computed: {
    systemCouponFixDate() {
      return (
        this.tempModalType === 'addTemplate' &&
        this.addRelationDetail.validDateType == 'FIXED_DATE'
      );
    },
    systemCouponUnFixDate() {
      return (
        this.tempModalType === 'addTemplate' &&
        this.addRelationDetail.validDateType == 'UN_FIXED_DATE'
      );
    },
    minBuyFeeComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.minBuyFee);
    },
    showBack() {
      return this.$route.name === 'small-vip-activities-associated';
    },
    maxDiscountFeeComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.maxDiscountFee);
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getStore();
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
      this.editRegisterGift();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleEdit(params) {
      const _this = this;
      this.stores = [];
      this.addRelationDetail.relationStoreType = 'ALL';
      this.tempModalType = this.modalType.edit;
      this.addRelationDetail = _.cloneDeep(params.row);
      // 编辑时处理下活动规则转换
      if (this.addRelationDetail.couponRules) {
        this.addRelationDetail.couponRules = replaceByTab(
          this.addRelationDetail.couponRules
        );
      }
      if (
        this.addRelationDetail.stores !== null &&
        this.addRelationDetail.stores !== ''
      ) {
        this.showStoreList = true;
        this.addRelationDetail.relationStoreType = 'PART';
        const stores = this.addRelationDetail.stores
          .substring(1, this.addRelationDetail.stores.length - 1)
          .split('][');
        stores.forEach((element) => {
          this.stores.push(parseInt(element));
        });
        // 全选/反选按钮的样式
        const sameArray = _this.storeList[0].storeList.filter(function(item) {
          return _this.stores.indexOf(item.storeId) != -1;
        });

        if (
          sameArray.length > 0 &&
          sameArray.length === this.storeList[0].storeList.length
        ) {
          this.indeterminate = false;
          this.checkAll = true;
        } else if (
          sameArray.length > 0 &&
          sameArray.length < this.storeList[0].storeList.length
        ) {
          this.indeterminate = true;
          this.checkAll = false;
        } else {
          this.indeterminate = false;
          this.checkAll = false;
        }
        const sameArray1 = _this.storeList[1].storeList.filter(function(item) {
          return _this.stores.indexOf(item.storeId) != -1;
        });
        if (
          sameArray1.length > 0 &&
          sameArray1.length === this.storeList[1].storeList.length
        ) {
          this.indeterminate1 = false;
          this.checkAll1 = true;
        } else if (
          sameArray1.length > 0 &&
          sameArray1.length < this.storeList[1].storeList.length
        ) {
          this.indeterminate1 = true;
          this.checkAll1 = false;
        } else {
          this.indeterminate1 = false;
          this.checkAll1 = false;
        }
        const sameArray2 = _this.storeList[2].storeList.filter(function(item) {
          return _this.stores.indexOf(item.storeId) != -1;
        });
        if (
          sameArray2.length > 0 &&
          sameArray2.length === this.storeList[2].storeList.length
        ) {
          this.indeterminate2 = false;
          this.checkAll2 = true;
        } else if (
          sameArray2.length > 0 &&
          sameArray2.length < this.storeList[2].storeList.length
        ) {
          this.indeterminate2 = true;
          this.checkAll2 = false;
        } else {
          this.indeterminate2 = false;
          this.checkAll2 = false;
        }
        const sameArray3 = _this.storeList[3].storeList.filter(function(item) {
          return _this.stores.indexOf(item.storeId) != -1;
        });
        if (
          sameArray3.length > 0 &&
          sameArray3.length === this.storeList[3].storeList.length
        ) {
          this.indeterminate3 = false;
          this.checkAll3 = true;
        } else if (
          sameArray3.length > 0 &&
          sameArray3.length < this.storeList[3].storeList.length
        ) {
          this.indeterminate3 = true;
          this.checkAll3 = false;
        } else {
          this.indeterminate3 = false;
          this.checkAll3 = false;
        }
        const sameArray4 = _this.storeList[4].storeList.filter(function(item) {
          return _this.stores.indexOf(item.storeId) != -1;
        });
        if (
          sameArray4.length > 0 &&
          sameArray4.length === this.storeList[4].storeList.length
        ) {
          this.indeterminate4 = false;
          this.checkAll4 = true;
        } else if (
          sameArray4.length > 0 &&
          sameArray4.length < this.storeList[4].storeList.length
        ) {
          this.indeterminate4 = true;
          this.checkAll4 = false;
        } else {
          this.indeterminate4 = false;
          this.checkAll4 = false;
        }
        const sameArray5 = _this.storeList[5].storeList.filter(function(item) {
          return _this.stores.indexOf(item.storeId) != -1;
        });
        if (
          sameArray5.length > 0 &&
          sameArray5.length === this.storeList[5].storeList.length
        ) {
          this.indeterminate5 = false;
          this.checkAll5 = true;
        } else if (
          sameArray5.length > 0 &&
          sameArray5.length < this.storeList[5].storeList.length
        ) {
          this.indeterminate5 = true;
          this.checkAll5 = false;
        } else {
          this.indeterminate5 = false;
          this.checkAll5 = false;
        }
        const sameArray6 = _this.storeList[6].storeList.filter(function(item) {
          return _this.stores.indexOf(item.storeId) != -1;
        });
        if (
          sameArray6.length > 0 &&
          sameArray6.length === this.storeList[6].storeList.length
        ) {
          this.indeterminate6 = false;
          this.checkAll6 = true;
        } else if (
          sameArray6.length > 0 &&
          sameArray6.length < this.storeList[6].storeList.length
        ) {
          this.indeterminate6 = true;
          this.checkAll6 = false;
        } else {
          this.indeterminate6 = false;
          this.checkAll6 = false;
        }
        // let sameArray7 = _this.storeList[7].storeList.filter(function (item) {
        //   return _this.stores.indexOf(item.storeId) != -1;
        // });
        // if (
        //   sameArray7.length > 0 &&
        //   sameArray7.length === this.storeList[7].storeList.length
        // ) {
        //   this.indeterminate7 = false;
        //   this.checkAll7 = true;
        // } else if (
        //   sameArray7.length > 0 &&
        //   sameArray7.length < this.storeList[7].storeList.length
        // ) {
        //   this.indeterminate7 = true;
        //   this.checkAll7 = false;
        // } else {
        //   this.indeterminate7 = false;
        //   this.checkAll7 = false;
        // }
      } else {
        this.showStoreList = false;
        this.addRelationDetail.relationStoreType = 'ALL'; // storeIds为''默认关联的门店则是全部门店
      }
      this.modalEdit = true;
    },
    selectStore(options) {
      if (options.value === 'ALL') {
        this.addRelationDetail.relationStoreType = 'ALL';
        this.tempModalType === 'edit'
          ? (this.addRelationDetail.stores = '')
          : (this.addRelationDetail.stores = null);
        this.showStoreList = false;
      } else if (options.value === 'PART') {
        this.addRelationDetail.relationStoreType = 'PART';
        this.indeterminate = false;
        this.checkAll = false;
        this.indeterminate1 = false;
        this.checkAll1 = false;
        this.indeterminate2 = false;
        this.checkAll2 = false;
        this.indeterminate3 = false;
        this.checkAll3 = false;
        this.indeterminate4 = false;
        this.checkAll4 = false;
        this.indeterminate5 = false;
        this.checkAll5 = false;
        this.indeterminate6 = false;
        this.checkAll6 = false;
        this.indeterminate7 = false;
        this.checkAll7 = false;
        this.stores = [];
        this.addRelationDetail.stores = '';
        this.showStoreList = true;
      }
    },
    getStore() {
      getAreaStorePages().then((res) => {
        this.storeList = res.array;
        this.storeData = res.array[0].storeList;
        this.storeData1 = res.array[1].storeList;
        this.storeData2 = res.array[2].storeList;
        this.storeData3 = res.array[3].storeList;
        this.storeData4 = res.array[4].storeList;
        this.storeData5 = res.array[5].storeList;
        this.storeData6 = res.array[6].storeList;
        // this.storeData7 = res.array[7].storeList;
        const data = [];
        for (const val of res.array) {
          this.storeNameList.push(val.storeName);
          data.push(val.storeList);
        }
        for (const value of data) {
          this.storeListData = this.storeListData.concat(value);
        }
      });
    },
    handleCheckAll(value) {
      const _this = this;
      if (value === 0) {
        const allIds = [];
        const beforeIds = [];
        if (this.indeterminate) {
          this.checkAll = false;
        } else {
          this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;
        if (this.checkAll) {
          if (this.stores != null) {
            for (const val of this.stores) {
              allIds.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds.push(item.storeId);
          });
          this.stores = allIds;
          this.addRelationDetail.stores = '[' + allIds.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.stores.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.stores = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 1) {
        const allIds1 = [];
        const beforeIds = [];
        if (this.indeterminate1) {
          this.checkAll1 = false;
        } else {
          this.checkAll1 = !this.checkAll1;
        }
        this.indeterminate1 = false;
        if (this.checkAll1) {
          if (this.stores != null) {
            for (const val of this.stores) {
              allIds1.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds1.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.stores = allIds1;
          this.addRelationDetail.stores = '[' + allIds1.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.stores.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.stores = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 2) {
        const allIds2 = [];
        const beforeIds = [];
        if (this.indeterminate2) {
          this.checkAll2 = false;
        } else {
          this.checkAll2 = !this.checkAll2;
        }
        this.indeterminate2 = false;
        if (this.checkAll2) {
          if (this.stores != null) {
            for (const val of this.stores) {
              allIds2.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds2.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.stores = allIds2;
          this.addRelationDetail.stores = '[' + allIds2.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.stores.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.stores = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 3) {
        const allIds3 = [];
        const beforeIds = [];
        if (this.indeterminate3) {
          this.checkAll3 = false;
        } else {
          this.checkAll3 = !this.checkAll3;
        }
        this.indeterminate3 = false;
        if (this.checkAll3) {
          if (this.stores != null) {
            for (const val of this.stores) {
              allIds3.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds3.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.stores = allIds3;
          this.addRelationDetail.stores = '[' + allIds3.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.stores.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.stores = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 4) {
        const allIds4 = [];
        const beforeIds = [];
        if (this.indeterminate4) {
          this.checkAll4 = false;
        } else {
          this.checkAll4 = !this.checkAll4;
        }
        this.indeterminate4 = false;
        if (this.checkAll4) {
          if (this.stores != null) {
            for (const val of this.stores) {
              allIds4.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds4.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.stores = allIds4;
          this.addRelationDetail.stores = '[' + allIds4.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.stores.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.stores = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 5) {
        const allIds5 = [];
        const beforeIds = [];
        if (this.indeterminate5) {
          this.checkAll5 = false;
        } else {
          this.checkAll5 = !this.checkAll5;
        }
        this.indeterminate5 = false;
        if (this.checkAll5) {
          if (this.stores != null) {
            for (const val of this.stores) {
              allIds5.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds5.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.stores = allIds5;
          this.addRelationDetail.stores = '[' + allIds5.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.stores.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.stores = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 6) {
        const allIds6 = [];
        const beforeIds = [];
        if (this.indeterminate6) {
          this.checkAll6 = false;
        } else {
          this.checkAll6 = !this.checkAll6;
        }
        this.indeterminate6 = false;
        if (this.checkAll6) {
          if (this.stores != null) {
            for (const val of this.stores) {
              allIds6.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds6.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.stores = allIds6;
          this.addRelationDetail.stores = '[' + allIds6.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.stores.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.stores = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 7) {
        const allIds7 = [];
        const beforeIds = [];
        if (this.indeterminate7) {
          this.checkAll7 = false;
        } else {
          this.checkAll7 = !this.checkAll7;
        }
        this.indeterminate7 = false;
        if (this.checkAll7) {
          if (this.stores != null) {
            for (const val of this.stores) {
              allIds7.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds7.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.stores = allIds7;
          this.addRelationDetail.stores = '[' + allIds7.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.stores.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.stores = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
        }
      }
    },
    checkAllGroupChange(data) {
      const sameArray = this.storeList[0].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray.length === this.storeList[0].storeList.length
      ) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (
        data.length > 0 &&
        sameArray.length < this.storeList[0].storeList.length
      ) {
        this.indeterminate = true;
        this.checkAll = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      }
      if (sameArray.length === 0) {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    checkAllGroupChange1(data) {
      const sameArray1 = this.storeList[1].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray1.length === this.storeList[1].storeList.length
      ) {
        this.indeterminate1 = false;
        this.checkAll1 = true;
      } else if (
        data.length > 0 &&
        sameArray1.length < this.storeList[1].storeList.length
      ) {
        this.indeterminate1 = true;
        this.checkAll1 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      }
      if (sameArray1.length == 0) {
        this.indeterminate1 = false;
        this.checkAll1 = false;
      }
    },
    checkAllGroupChange2(data) {
      const sameArray2 = this.storeList[2].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray2.length === this.storeList[2].storeList.length
      ) {
        this.indeterminate2 = false;
        this.checkAll2 = true;
      } else if (
        data.length > 0 &&
        sameArray2.length < this.storeList[2].storeList.length
      ) {
        this.indeterminate2 = true;
        this.checkAll2 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      }
      if (sameArray2.length == 0) {
        this.indeterminate2 = false;
        this.checkAll2 = false;
      }
    },
    checkAllGroupChange3(data) {
      const sameArray3 = this.storeList[3].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray3.length === this.storeList[3].storeList.length
      ) {
        this.indeterminate3 = false;
        this.checkAll3 = true;
      } else if (
        data.length > 0 &&
        sameArray3.length < this.storeList[3].storeList.length
      ) {
        this.indeterminate3 = true;
        this.checkAll3 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      }
      if (sameArray3.length === 0) {
        this.indeterminate3 = false;
        this.checkAll3 = false;
      }
    },
    checkAllGroupChange4(data) {
      const sameArray4 = this.storeList[4].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray4.length === this.storeList[4].storeList.length
      ) {
        this.indeterminate4 = false;
        this.checkAll4 = true;
      } else if (
        data.length > 0 &&
        sameArray4.length < this.storeList[4].storeList.length
      ) {
        this.indeterminate4 = true;
        this.checkAll4 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      }
      if (sameArray4.length === 0) {
        this.indeterminate4 = false;
        this.checkAll4 = false;
      }
    },
    checkAllGroupChange5(data) {
      const sameArray5 = this.storeList[5].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray5.length === this.storeList[5].storeList.length
      ) {
        this.indeterminate5 = false;
        this.checkAll5 = true;
      } else if (
        data.length > 0 &&
        sameArray5.length < this.storeList[5].storeList.length
      ) {
        this.indeterminate5 = true;
        this.checkAll5 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      }
      if (sameArray5.length === 0) {
        this.indeterminate5 = false;
        this.checkAll5 = false;
      }
    },
    checkAllGroupChange6(data) {
      const sameArray6 = this.storeList[6].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray6.length === this.storeList[6].storeList.length
      ) {
        this.indeterminate6 = false;
        this.checkAll6 = true;
      } else if (
        data.length > 0 &&
        sameArray6.length < this.storeList[6].storeList.length
      ) {
        this.indeterminate6 = true;
        this.checkAll6 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      }
      if (sameArray6.length === 0) {
        this.indeterminate6 = false;
        this.checkAll6 = false;
      }
    },
    // checkAllGroupChange7(data) {
    //   let sameArray7 = this.storeList[7].storeList.filter(function (item) {
    //     return data.indexOf(item.storeId) != -1;
    //   });
    //   if (
    //     data.length > 0 &&
    //     sameArray7.length === this.storeList[7].storeList.length
    //   ) {
    //     this.indeterminate7 = false;
    //     this.checkAll7 = true;
    //   } else if (
    //     data.length > 0 &&
    //     sameArray7.length < this.storeList[7].storeList.length
    //   ) {
    //     this.indeterminate7 = true;
    //     this.checkAll7 = false;
    //     this.addRelationDetail.stores = "[" + data.join("][") + "]";
    //   }
    //   if (sameArray7.length === 0) {
    //     this.indeterminate7 = false;
    //     this.checkAll7 = false;
    //   }
    // },
    goBack() {
      this.turnToPage('small-activity-register-reward');
    },
    getTableData() {
      // 获取优惠券活动页面传过来的优惠券活动信息
      if (this.$route.name === 'small-vip-activities-associated') {
        const couponActivity = getSmallCouponActivity();
        if (couponActivity) {
          // 给商品规格的商品和搜索条件赋值
          this.searchRowData.activityRegisterId = couponActivity.id;
          this.addRelationDetail.activityRegisterId = couponActivity.id;
          this.couponDetail = _.cloneDeep(couponActivity);
        }
      }
      this.getRelationTableData();
    },
    getRelationTableData() {
      getRegisteredGiftPages(this.searchRowData)
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
    editRegisterGift() {
      // 编辑状态
      this.tempTableLoading = true;
      editRegisterGift(this.addRelationDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('修改成功!');
          this.getTableData();
        })
        .finally((res) => {
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
      this.addRelationDetail.maxDiscountFee = currentRow.maxDiscountFee;
    },
    handleHdTemplateChange(currentRow, oldCurrentRow) {
      // 选中关联的优惠券模板冗余对应字段到配置对象中- 默认为最后选择的一条数据
      const startIndex = currentRow.useRule.indexOf('满');
      const endIndex = currentRow.useRule.indexOf('元');
      const minBuyFee = currentRow.useRule.slice(startIndex + 1, endIndex);
      this.addRelationDetail.useLimitType = currentRow.useLimitType; // 海鼎券的uselimitType从couponRemark解析出
      this.addRelationDetail.couponName = currentRow.couponName;
      this.addRelationDetail.couponType = currentRow.couponType;
      this.addRelationDetail.couponFee = currentRow.faceValue;
      this.addRelationDetail.hdActivityId = currentRow.activityId;
      this.addRelationDetail.maxDiscountFee = currentRow.maxDiscountFee;
      if (currentRow.couponType === 'DISCOUNT_COUPON') {
        this.addRelationDetail.couponFee =
          parseFloat(currentRow.discount) * 100;
      }
      this.addRelationDetail.minBuyFee = minBuyFee * 100;
      this.addRelationDetail.couponStatus = 'VALID'; // 海鼎券默认为有效状态
      this.addRelationDetail.effectiveStartTime = currentRow.beginDate; // 海鼎活动开始时间
      this.addRelationDetail.effectiveEndTime = currentRow.endDate; // 海鼎活动结束时间
    },
    effectiveStartTimeChange(value, date) {
      this.addRelationDetail.effectiveStartTime = value;
    },
    effectiveEndTimeChange(value, date) {
      this.addRelationDetail.effectiveEndTime = value;
    },
    addCouponTemplate(name) {
      this.showStoreList = false;
      this.stores = [];
      if (name === 'SMALL') {
        this.getTemplateTableData();
        this.tempModalType = 'addTemplate';
      } else {
        this.getHdTemplateTableData();
        this.tempModalType = 'addHdTemplate';
      }
      // 添加对象初始化
      this.$refs.addForm.resetFields();
      this.addRelationDetail = _.cloneDeep(relationDetail);
      // 当展示的是添加系统优惠券
      if (this.tempModalType == 'addTemplate') {
        this.addRelationDetail.couponScope = 'SMALL';
        this.addRelationDetail.useLimitType = 'SMALL_ALL';
      }
      this.modalAdd = true;
    },
    createRelation() {
      this.modalViewLoading = true;
      // 添加的是系统券，填写来源为系统优惠券 默认券有效期类型
      this.addRelationDetail.source = 'SMALL';
      this.addRelationDetail.activityRegisterId = this.couponDetail.id;
      createRegisterGift(this.addRelationDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success('创建成功!');
          this.getRelationTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    createHdRelation() {
      this.modalViewLoading = true;
      // 添加的是系统券，填写来源为系统优惠券
      this.addRelationDetail.source = 'HD';
      this.addRelationDetail.activityRegisterId = this.couponDetail.id;
      createRegisterGift(this.addRelationDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.$Message.success('创建成功!');
          this.modalAdd = false;
          this.getRelationTableData();
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
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleTemplateEdit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (
            compareData(
              this.addRelationDetail.effectiveStartTime,
              this.addRelationDetail.effectiveEndTime
            )
          ) {
            this.$Message.error('结束时间必须大于开始时间!');
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
              .then((res) => {
                this.getRelationTableData();
                this.modalEdit = false;
                this.$Message.success('修改成功!');
              })
              .finally((res) => {
                this.tempTableLoading = false;
              });
            this.tempTableLoading = false;
          }
        } else {
          this.$Message.error('请完善信息!');
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
          if (
            compareData(
              this.addRelationDetail.effectiveStartTime,
              this.addRelationDetail.effectiveEndTime
            )
          ) {
            this.$Message.error('优惠券失效时间必须大于生效时间!');
            return;
          }
          // 活动规则换行用“&”拼接
          if (this.addRelationDetail.couponRules) {
            this.addRelationDetail.couponRules = replaceByTag(
              this.addRelationDetail.couponRules
            );
          }
          if (this.tempModalType === 'addTemplate') {
            this.createRelation();
          } else if (this.tempModalType === 'addHdTemplate') {
            this.createHdRelation();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
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
      if (
        this.addRelationDetail.stores === null ||
        this.addRelationDetail.stores === ''
      ) {
        return '全部门店';
      }
      const ids = this.addRelationDetail.stores
        .substring(1, this.addRelationDetail.stores.length - 1)
        .split('][');
      const list = this.storeListData;
      let str = '';
      if (list.length > 0) {
        ids.forEach((id) => {
          const item = list.find((item) => item.storeId == id);
          str += item.storeName + ',';
        });
        return str.substring(0, str.length - 1);
      }
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
    maxDiscountFeeInputNumberOnchange(value) {
      this.addRelationDetail.maxDiscountFee = yuanToFenNumber(value);
    }
    // 批量删除-单行删除内部也是调用此方法
    // deleteTable(ids) {
    //   this.tempTableLoading = true;
    //   deleteRegisterGift({ ids })
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
    //       this.getRelationTableData();
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
