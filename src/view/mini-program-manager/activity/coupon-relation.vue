<template>
  <div class="m-role">
    <Card>
      <h4 v-if="couponDetail.activityName" class="brand-red">
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
        highlight-row
        search-place="top"
        @on-delete="handleDelete"
        @on-edit="handleEdit"
        @on-sale="switchStatus"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <!-- 数量少暂时不做条件过滤 <Row>
            <Input
              v-model="searchRowData.couponName"
              placeholder="优惠券名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Select v-model="searchRowData.couponStatus" placeholder="优惠券状态" style="padding-right: 5px;width: 100px" clearable>
              <Option
                v-for="(item,index) in couponStatusEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px">{{ item.label }}
              </Option>
            </Select>
            <DatePicker
              v-model="searchRowData.effectiveStartTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="生效时间起"
              class="search-input"
              style="width: 150px"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.effectiveEndTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="生效时间止"
              class="search-input  mr5"
              style="width: 150px"
              />
            <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除
            </Button>
          </Row>-->
          <div
            v-show="activityCouponType === 'SHARE_COUPON_ACTIVITY'"
            class="ml15 mt10"
          >
            <b style="color: red">*</b> 排序字段设置
            <b style="color: red">-1</b>为系统默认券
          </div>
        </div>
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
            v-show="activityCouponType != 'BUY_COUPON_ACTIVITY'"
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
                  v-show="activityCouponType != 'BUY_COUPON_ACTIVITY'"
                  v-model="searchTemplateRowData.couponType"
                  placeholder="优惠券类型"
                  style="padding-right: 5px; width: 120px"
                  clearable
                >
                  <Option
                    v-for="(item, index) in couponTypeEnum"
                    :key="index"
                    :value="item.value"
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
            ref="hdTables"
            v-model="hdCouponTemplateData"
            :columns="hdTemplateColumns"
            :loading="tempTableLoading"
            border
            searchable
            highlight-row
            search-place="top"
            @on-current-change="handleHdTemplateChange"
          >
          </tables>
          <div class="ml15 mt10">
            <i style="color: red">*</i> 超值购券只允许添加满减券与现金券
          </div>
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
            :rules="ruleInline"
            :label-width="100"
          >
            <Row>
              <i-col span="6">
                <FormItem label="用户范围:" prop="userScope">
                  <Select
                    v-model="addRelationDetail.userScope"
                    placeholder="请选择"
                    style="padding-right: 5px; width: 165px"
                    disabled
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
              <i-col span="6">
                <FormItem
                  label="优惠券名称:"
                  prop="couponName"
                  :label-width="140"
                >
                  <Input
                    v-model="addRelationDetail.couponName"
                    clearable
                    style="padding-right: 5px; width: 165px"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="排序字段:" prop="rank" :label-width="180">
                  <InputNumber
                    v-model="addRelationDetail.rank"
                    label
                  ></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem
                  v-if="activityCouponType != 'BUY_COUPON_ACTIVITY'"
                  label="券有效期:"
                  prop="useLimitType"
                >
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
                      style="padding-left: 5px; width: 120px"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem v-else label="券有效期:" prop="useLimitType">
                  {{
                    addRelationDetail.validDateType === "UN_FIXED_DATE"
                      ? "相对发券日"
                      : "N/A"
                  }}
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
                      style="width: 95px"
                    ></InputNumber>&nbsp;天生效
                  </FormItem>
                </i-col>
                <i-col span="7">
                  <FormItem label="有效天数:" prop="endDay">
                    <InputNumber
                      v-model="addRelationDetail.endDay"
                      :min="0"
                      label="有效天数"
                      style="width: 95px"
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
              <i-col
                v-show="activityCouponType != 'BUY_COUPON_ACTIVITY'"
                span="6"
              >
                <FormItem label="发券总数:" prop="couponLimit">
                  <InputNumber
                    v-model="addRelationDetail.couponLimit"
                    :min="0"
                    label="限购数量"
                    style="padding-right: 5px; width: 110px"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem
                  v-show="tempModalType == 'addHdTemplate'"
                  label="券使用范围:"
                  prop="couponScope"
                >
                  <Select
                    v-model="addRelationDetail.couponScope"
                    placeholder="请选择"
                    style="padding-right: 5px; width: 165px"
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
                >
                  {{ addRelationDetail.couponScope | couponScopeFilter }}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem
                  v-show="tempModalType == 'addHdTemplate'"
                  label="券使用限制:"
                  prop="useLimitType"
                  :label-width="140"
                >
                  <Select
                    v-model="addRelationDetail.useLimitType"
                    placeholder="请选择"
                    style="padding-right: 5px; width: 165px"
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
                  :label-width="140"
                >
                  {{ addRelationDetail.useLimitType | couponUseLimitFilter }}
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col v-if="tempModalType == 'addTemplate'" span="6">
                <FormItem
                  v-if="addRelationDetail.maxDiscountFee"
                  :label-width="100"
                  label="最高优惠金额:"
                  prop="maxDiscountFee"
                >
                  {{ addRelationDetail.maxDiscountFee | fenToYuanDot2Filters }}
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
                <FormItem label="使用规则:" prop="couponRules">
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
                <FormItem :label-width="85" label="所属城市:">
                  <Select
                    v-model="cityCode"
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
                  <div class="bottom-line">
                    <div style="margin-left: -54px; margin-right: 18px">
                      地级市全部门店
                    </div>
                    <Checkbox
                      :value="checkAllStore"
                      @click.prevent.native="handleCheckAll(-1)"
                    >
                      全选/反选
                    </Checkbox>
                  </div>
                </FormItem>
              </i-col>
              <i-col v-if="storeData.length > 0" span="24">
                <FormItem>
                  <div class="bottom-line">
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
              <i-col v-if="storeData1.length > 0" span="24">
                <FormItem>
                  <div class="bottom-line">
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
              <i-col v-if="storeData2.length > 0" span="24">
                <FormItem>
                  <div class="bottom-line">
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
              <i-col v-if="storeData3.length > 0" span="24">
                <FormItem>
                  <div class="bottom-line">
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
              <i-col v-if="storeData4.length > 0" span="24">
                <FormItem>
                  <div class="bottom-line">
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
              <i-col v-if="storeData5.length > 0" span="24">
                <FormItem>
                  <div class="bottom-line">
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
              <i-col v-if="storeData6.length > 0" span="24">
                <FormItem>
                  <div class="bottom-line">
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
            </Row> </Form>*Tips：请先选择要关联的优惠券，然后输入关联配置信息，不可关联多个优惠券模板
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose"> 关闭 </Button>
        <Button
          v-if="!buyCouponActStatus"
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
      :width="800"
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
            <i-col span="12">
              <FormItem label="用户范围:" prop="userScope">
                <Select
                  v-model="addRelationDetail.userScope"
                  placeholder="请选择"
                  disabled
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
            <i-col span="12">
              <FormItem
                v-if="addRelationDetail.maxDiscountFee"
                label="最高优惠金额:"
                prop="maxDiscountFee"
              >
                {{ addRelationDetail.maxDiscountFee | fenToYuanDot2Filters }}
              </FormItem>
              <FormItem v-else label="最高优惠金额:" prop="maxDiscountFee">
                {{ "N/A" }}
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="优惠券名称:">
                <Input
                  v-model="addRelationDetail.couponName"
                  clearable
                  style="padding-right: 5px; width: 165px"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="优惠券类型:">
                {{ addRelationDetail.couponType | couponTypeFilter }}
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
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
            <i-col span="12">
              <FormItem label="最小购买金额:" prop="minBuyFee">
                {{ addRelationDetail.minBuyFee | fenToYuanDot2Filters }}
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="优惠券状态:" prop="couponStatus">
                {{ addRelationDetail.couponStatus | couponStatusFilter }}
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="使用范围:" prop="couponScope">
                {{ addRelationDetail.couponScope | couponScopeFilter }}
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem label="券有效期:" prop="useLimitType">
                <Select
                  v-model="addRelationDetail.validDateType"
                  placeholder="券有效期类型"
                  style="padding-right: 5px; width: 165px"
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
          </Row>
          <Row>
            <template v-if="addRelationDetail.validDateType == 'UN_FIXED_DATE'">
              <i-col span="12">
                <FormItem label="发放券后:" prop="beginDay">
                  <InputNumber
                    v-model="addRelationDetail.beginDay"
                    :min="0"
                    label="生效开始"
                    style="width: 165px"
                  ></InputNumber>&nbsp;天生效
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="有效天数:" prop="endDay">
                  <InputNumber
                    v-model="addRelationDetail.endDay"
                    :min="0"
                    label="有效天数"
                    style="width: 165px"
                  ></InputNumber>&nbsp;天
                </FormItem>
              </i-col>
            </template>
            <template v-if="addRelationDetail.validDateType == 'FIXED_DATE'">
              <i-col span="12">
                <FormItem label="生效时间:" prop="effectiveStartTime">
                  <DatePicker
                    :value="addRelationDetail.effectiveStartTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="生效时间"
                    style="width: 165px"
                    @on-change="effectiveStartTimeChange"
                  />
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="失效时间:" prop="effectiveEndTime">
                  <DatePicker
                    :value="addRelationDetail.effectiveEndTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="结束时间"
                    style="width: 165px"
                    @on-change="effectiveEndTimeChange"
                  />
                </FormItem>
              </i-col>
            </template>
            <!-- <i-col span="7">
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
            </i-col>-->
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="发券限制:" prop="couponLimit">
                <InputNumber
                  v-model="addRelationDetail.couponLimit"
                  :min="0"
                  label="限购数量"
                  style="width: 165px"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="排序字段:" prop="rank">
                <InputNumber
                  v-model="addRelationDetail.rank"
                  label
                  style="width: 165px"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="18">
              <FormItem label="使用规则:" prop="couponRules">
                <Input
                  v-model="addRelationDetail.couponRules"
                  :rows="6"
                  placeholder="使用规则"
                  type="textarea"
                  style="width: 550px"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="关联门店:">
                <Select
                  v-model="addRelationDetail.relationStoreType"
                  style="width: 165px"
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
              <FormItem :label-width="85" label="所属城市:">
                <Select
                  v-model="cityCode"
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
                <div class="bottom-line">
                  <div style="margin-left: -54px; margin-right: 18px">
                    地级市全部门店
                  </div>
                  <Checkbox
                    :value="checkAllStore"
                    @click.prevent.native="handleCheckAll(-1)"
                  >
                    全选/反选
                  </Checkbox>
                </div>
              </FormItem>
            </i-col>
            <i-col v-if="storeData.length > 0" span="24">
              <FormItem>
                <div class="bottom-line">
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
            <i-col v-if="storeData1.length > 0" span="24">
              <FormItem>
                <div class="bottom-line">
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
            <i-col v-if="storeData2.length > 0" span="24">
              <FormItem>
                <div class="bottom-line">
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
            <i-col v-if="storeData3.length > 0" span="24">
              <FormItem>
                <div class="bottom-line">
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
            <i-col v-if="storeData4.length > 0" span="24">
              <FormItem>
                <div class="bottom-line">
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
            <i-col v-if="storeData5.length > 0" span="24">
              <FormItem>
                <div class="bottom-line">
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
            <i-col v-if="storeData6.length > 0" span="24">
              <FormItem>
                <div class="bottom-line">
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
                  class="bottom-line"
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

import {
  getCouponTemplateRelationPages,
  deleteCouponTemplateRelation,
  createCouponTemplateRelation,
  editCouponTemplateRelation,
  getCouponTemplatePages,
  getHdCouponActivitiesPages
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import relationStoreMixin from '@/mixins/relationStoreMixin.js';

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
  userScopeEnum,
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
  activityId: 0,
  activityName: '',
  activityRuel: '',
  activityContent: '',
  ifEffective: null,
  beginTime: null,
  endTime: null,
  effectiveStartTime: '',
  effectiveEndTime: '',
  createUser: '',
  createTime: null,
  applicationType: null,
  activityImage: '',
  activityUrl: '',
  maxDiscountFee: null,
  rank: 0, // 排序字段
  validDateType: 'FIXED_DATE',
  stores: null,
  relationStoreType: 'ALL',
  beginDay: 0,
  endDay: 0
};

// 关联的优惠券配置对象
const relationDetail = {
  id: 0,
  activityCouponId: 0,
  couponName: '',
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: '',
  effectiveStartTime: '',
  effectiveEndTime: '',
  couponLimit: 0,
  receiveCount: 0,
  couponRules: '',
  couponScope: null,
  useLimitType: null,
  hdActivityId: 0,
  source: 'SMALL', // 默认来源为系统优惠券
  userScope: '',
  rank: 0, // 排序字段
  validDateType: 'UN_FIXED_DATE',
  stores: null,
  relationStoreType: 'ALL',
  beginDay: 0,
  endDay: 0
};

const roleRowData = {
  activityCouponId: null,
  // couponName: '',
  // couponStatus: '',
  // effectiveStartTime: null,
  // effectiveEndTime: null,
  page: 1,
  rows: 10,
  sidx: 'rank',
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
      if (row.source === 'SMALL' && row.validDateType === 'FIXED_DATE') {
        return <div>{row.effectiveStartTime}</div>;
      } else if (
        row.source === 'SMALL' &&
        row.validDateType === 'UN_FIXED_DATE'
      ) {
        return <div>{row.beginDay}</div>;
      } else if (row.source === 'HD') {
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
      if (row.source === 'SMALL' && row.validDateType === 'FIXED_DATE') {
        if (!compareCouponData(row.effectiveEndTime)) {
          return (
            <div style='color:red'>{row.effectiveEndTime + ' 已过期'}</div>
          );
        } else {
          return <div>{row.effectiveEndTime}</div>;
        }
      } else if (
        row.source === 'SMALL' &&
        row.validDateType === 'UN_FIXED_DATE'
      ) {
        return <div>{row.endDay}</div>;
      } else if (row.source === 'HD') {
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
    minWidth: 120,
    key: 'handle',
    fixed: 'right',
    options: ['onSale', 'edit']
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
  mixins: [tableMixin, uploadMixin, relationStoreMixin],
  data() {
    return {
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      addRelationList: [],
      couponTemplateData: [],
      hdCouponTemplateData: [],
      templatePageOpts: [5, 10],
      buyCouponActStatus: false,
      showValidDate: true,
      addTempDataLoading: false,
      tempTableLoading: false,
      activityCouponType: '',
      PresellTotal: 0,
      couponTemplateTotal: 0,
      couponHdTemplateTotal: 0,
      couponStatusEnum,
      couponTypeEnum,
      couponScopeEnum,
      couponUseLimitEnum,
      validDateTypeEnum,
      relationStoreTypeEnum,
      userScopeEnum,
      dataColumns: dataColumns,
      ruleInline: {
        effectiveStartTime: [{ required: false, message: '请选择生效时间' }],
        effectiveEndTime: [{ required: false, message: '请选择失效时间' }],
        couponName: [{ required: true, message: '请输入券名称' }],
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
      templateColumns: _.cloneDeep(templateColumns),
      hdTemplateColumns: _.cloneDeep(hdTemplateColumns),
      searchRowData: _.cloneDeep(roleRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      searchHdTemplateRowData: _.cloneDeep(hdTemplateRowData),
      couponDetail: _.cloneDeep(couponDetail),
      addRelationDetail: _.cloneDeep(relationDetail)
    };
  },
  computed: {
    minBuyFeeComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.minBuyFee);
    },
    showBack() {
      return this.$route.name === 'small-activity-relation-coupon';
    },
    maxDiscountFeeComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.maxDiscountFee);
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
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
      this.storeIds = [];
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
        const storeIds = this.addRelationDetail.stores
          .substring(1, this.addRelationDetail.stores.length - 1)
          .split('][');
        storeIds.forEach((element) => {
          this.storeIds.push(parseInt(element));
        });
        console.log('selected storeIds:', this.storeIds);
        const firstStoreId = this.storeIds[0];
        // 编辑时从返回的第一个storeId单独查询下cityCode来反选城市
        const storeObj = this.allStoreList.find(
          (item) => item.storeId === firstStoreId
        );
        this.cityCode = storeObj.cityCode;
        this.getStore(true);
      } else {
        this.showStoreList = false;
        this.addRelationDetail.relationStoreType = 'ALL'; // storeIds为''默认关联的门店则是全部门店
      }
      this.modalEdit = true;
    },
    switchStatus(params) {
      this.addRelationDetail = _.cloneDeep(params.row);
      // 有效 VALID 无效 INVALID
      if (params.row.couponStatus === 'VALID') {
        this.addRelationDetail.couponStatus = 'INVALID';
      } else {
        this.addRelationDetail.couponStatus = 'VALID';
      }
      this.loading = true;
      editCouponTemplateRelation(this.addRelationDetail)
        .then((res) => {
          this.getRelationTableData();
          this.loading = false;
        })
        .finally((res) => {
          this.loading = false;
        });
    },
    goBack() {
      this.$router.back();
      // this.turnToPage("small-activity-coupon");
    },
    getTableData() {
      // 获取优惠券活动页面传过来的优惠券活动信息
      if (this.$route.name === 'small-activity-relation-coupon') {
        const couponActivity = getSmallCouponActivity();
        this.activityCouponType = couponActivity.activityType;
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
      getCouponTemplateRelationPages(this.searchRowData)
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
      // if (this.activityCouponType === 'BUY_COUPON_ACTIVITY') {
      //   this.searchTemplateRowData.couponType = 'FULL_CUT_COUPON';
      // }
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
    handleTemplateChange(currentRow, oldCurrentRow) {
      // 选中关联的优惠券模板冗余对应字段到配置对象中- 默认为最后选择的一条数据
      this.addRelationDetail.couponName = currentRow.couponName;
      this.addRelationDetail.couponFee = currentRow.couponFee;
      this.addRelationDetail.minBuyFee = currentRow.minBuyFee;
      this.addRelationDetail.couponStatus = currentRow.couponStatus;
      this.addRelationDetail.couponType = currentRow.couponType;
      this.addRelationDetail.maxDiscountFee = currentRow.maxDiscountFee;
      // svip默认展示付费会员
      if (this.$route.name === 'small-activity-relation-coupon') {
        const couponActivity = getSmallCouponActivity();
        if (couponActivity.activityType === 'SVIP_COUPON_CENTER_ACTIVITY') {
          this.addRelationDetail.userScope = 'SVIP';
        } else {
          this.addRelationDetail.userScope = 'ALL';
        }
      }
      if (this.activityCouponType === 'BUY_COUPON_ACTIVITY') {
        this.addRelationDetail.couponLimit = 9999999;
      }
      if (
        currentRow.couponType === 'DISCOUNT_COUPON' &&
        this.activityCouponType === 'BUY_COUPON_ACTIVITY_ALL'
      ) {
        this.buyCouponActStatus = true;
      } else {
        this.buyCouponActStatus = false;
      }
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
      this.addRelationDetail.maxDiscountFee = currentRow.maxDiscountFee;
      this.addRelationDetail.userScope = 'SVIP';
      if (currentRow.couponType === 'DISCOUNT_COUPON') {
        this.addRelationDetail.couponFee =
          parseFloat(currentRow.discount) * 100;
      }
      // svip默认展示付费会员
      if (this.$route.name === 'small-activity-relation-coupon') {
        const couponActivity = getSmallCouponActivity();
        if (couponActivity.activityType === 'SVIP_COUPON_CENTER_ACTIVITY') {
          this.addRelationDetail.userScope = 'SVIP';
        } else {
          this.addRelationDetail.userScope = 'ALL';
        }
      }
      this.addRelationDetail.hdActivityId = currentRow.activityId;
      this.addRelationDetail.minBuyFee = minBuyFee * 100;
      this.addRelationDetail.couponStatus = 'VALID'; // 海鼎券默认为有效状态
      this.addRelationDetail.effectiveStartTime = currentRow.beginDate; // 海鼎活动开始时间
      this.addRelationDetail.effectiveEndTime = currentRow.endDate; // 海鼎活动结束时间
      if (
        currentRow.couponType === 'DISCOUNT_COUPON' &&
        this.activityCouponType === 'BUY_COUPON_ACTIVITY_ALL'
      ) {
        this.buyCouponActStatus = true;
      } else {
        this.buyCouponActStatus = false;
      }
    },
    effectiveStartTimeChange(value, date) {
      this.addRelationDetail.effectiveStartTime = value;
    },
    effectiveEndTimeChange(value, date) {
      this.addRelationDetail.effectiveEndTime = value;
    },
    addCouponTemplate(name) {
      this.showStoreList = false;
      this.storeIds = [];
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
      if (this.tempModalType === 'addTemplate') {
        this.addRelationDetail.couponScope = 'SMALL';
        this.addRelationDetail.useLimitType = 'SMALL_ALL';
      }
      this.modalAdd = true;
    },
    createRelation() {
      this.modalViewLoading = true;
      // 添加的是系统券，填写来源为系统优惠券 默认券有效期类型
      this.addRelationDetail.source = 'SMALL';
      this.addRelationDetail.activityCouponId = this.couponDetail.id;
      this.addRelationList.push(this.addRelationDetail);
      createCouponTemplateRelation(this.addRelationList)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success('创建成功!');
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
      this.addRelationDetail.source = 'HD';
      this.addRelationDetail.activityCouponId = this.couponDetail.id;
      this.addRelationList.push(this.addRelationDetail);
      createCouponTemplateRelation(this.addRelationList)
        .then((res) => {
          this.$Message.success('创建成功!');
          this.modalAdd = false;
          this.getRelationTableData();
          this.addRelationList = [];
        })
        .finally(() => {
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

          if (this.isEdit) {
            // 编辑状态
            this.tempTableLoading = true;
            editCouponTemplateRelation(this.addRelationDetail)
              .then((res) => {
                this.getRelationTableData();
                this.modalEdit = false;
                this.$Message.success('操作成功!');
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
      if (this.addRelationDetail.couponName === '') {
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
    handleAddClose() {
      this.modalAdd = false;
    },
    // 批量删除-单行删除内部也是调用此方法
    deleteTable(ids) {
      this.tempTableLoading = true;
      deleteCouponTemplateRelation({ ids })
        .then((res) => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.tableDataSelected = [];
          this.getRelationTableData();
        })
        .finally((res) => {
          this.tempTableLoading = false;
        });
    },
    maxDiscountFeeInputNumberOnchange(value) {
      this.addRelationDetail.maxDiscountFee = yuanToFenNumber(value);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
