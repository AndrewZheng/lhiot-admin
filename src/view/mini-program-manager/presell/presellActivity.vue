<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="22"
        :operate-area-column="6"
        editable
        searchable
        border
        highlight-row
        search-place="top"
        @on-delete="handleDelete"
        @on-view="handleView"
        @on-edit="handleEdit"
        @coupon-status="statusChange"
        @on-current-change="onCurrentChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Select
              v-model="searchRowData.status"
              placeholder="活动状态"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in activityStatus"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.startedFlag"
              placeholder="是否开始"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in startedFlagStatus"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.validDateType"
              placeholder="时间类型"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in validDateTypeEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.content"
              placeholder="活动内容"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <DatePicker
              v-model="searchRowData.startTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="有效时间起"
              class="mr5"
              style="width: 160px"
              @on-change="createTimeStartChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="有效时间止"
              class="mr5"
              style="width: 160px"
              @on-change="createTimeEndChange"
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
              class="search-btn mr5"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
            <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addStore">
              <Icon type="md-add" />添加
            </Button>
          </Row>
          <div class="ml15 mt10">
            <i style="color:red">*</i> 选中单条数据再点击添加,可复制当前数据
          </div>
        </div>
        <div slot="operations">
          <!-- <Button
            v-waves
            :loading="exportExcelLoading"
            type="primary"
            class="mr5"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出
          </Button>-->
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

    <Modal v-model="modalView" :mask-closable="false" :width="720">
      <p slot="header">
        <span>预售活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                预售活动编号:
              </i-col>
              <i-col span="18">
                {{ presellDetail.id }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动名称:
              </i-col>
              <i-col span="18">
                {{ presellDetail.activityName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动内容:
              </i-col>
              <i-col span="18">
                {{ presellDetail.content }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动状态:
              </i-col>
              <i-col v-if="presellDetail.status==='VALID'" span="18">
                {{ '上架' }}
              </i-col>
              <i-col v-else span="18">
                {{ '下架' }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                排序序号:
              </i-col>
              <i-col span="18">
                {{ presellDetail.rank }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动banner:
              </i-col>
              <i-col span="18">
                <img :src="presellDetail.banner" style="width: 100%">
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动开始时间:
              </i-col>
              <i-col span="18">
                {{ this.$moment(
                  presellDetail.startTime
                ).format("YYYY-MM-DD HH:mm:ss") }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动结束时间:
              </i-col>
              <i-col span="18">
                {{ this.$moment(
                  presellDetail.endTime
                ).format("YYYY-MM-DD HH:mm:ss") }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                提货时间类型:
              </i-col>
              <i-col v-if="presellDetail.validDateType==='FIXED_DATE'" span="18">
                {{ '绝对时间' }}
              </i-col>
              <i-col v-else span="18">
                {{ '相对时间' }}
              </i-col>
            </Row>
          </i-col>
          <i-col v-show="presellDetail.validDateType==='UN_FIXED_DATE'" span="12">
            <Row>
              <i-col span="6">
                几天后提货:
              </i-col>
              <i-col span="18">
                {{ presellDetail.beginDay+"天" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row v-show="presellDetail.validDateType==='FIXED_DATE'" class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                提货开始时间:
              </i-col>
              <i-col span="18">
                {{ this.$moment(
                  presellDetail.deliveryStartTime
                ).format("YYYY-MM-DD") }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                提货结束时间:
              </i-col>
              <i-col v-if="presellDetail.deliveryEndTime" span="18">
                {{ this.$moment(
                  presellDetail.deliveryEndTime
                ).format("YYYY-MM-DD") }}
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
              <i-col span="6">
                商品规格:
              </i-col>
              <i-col span="18">
                {{ presellDetail.standardId }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12" style>
            <Button v-waves type="warning" @click="aboutGoods">
              关联商品详情
            </Button>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                规格描述:
              </i-col>
              <i-col span="18">
                {{ presellDetail.standardDesc }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                原价:
              </i-col>
              <i-col span="18">
                {{ presellDetail.originalPrice | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动价:
              </i-col>
              <i-col span="18">
                {{ presellDetail.activityPrice | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                限购次数:
              </i-col>
              <i-col span="18">
                {{ presellDetail.triesLimit }}
              </i-col>
            </Row>
          </i-col>
          <!-- <i-col span="12">
            <Row>
              <i-col span="6">已购份数:</i-col>
              <i-col span="18">{{ presellDetail.flashCount }}</i-col>
            </Row>
          </i-col>-->
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                库存数量:
              </i-col>
              <i-col span="18">
                {{ presellDetail.invNum }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                已售份数:
              </i-col>
              <i-col span="18">
                {{ presellDetail.saleQuantity }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">
                关联门店:
              </i-col>
              <i-col span="21">
                {{ getRelationStore(presellDetail.storeIds) }}
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

    <Modal v-model="modalEdit" :z-index="1000" :width="800" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType === modalType.edit?'修改预售活动':'创建预售活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="presellDetail" :rules="ruleInline" :label-width="130">
          <Row v-show="tempModalType===modalType.edit">
            <i-col span="12">
              <FormItem label="预售ID:" prop="id">
                {{ presellDetail.id }}
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="活动名称:" prop="activityName">
                <Input
                  v-model="presellDetail.activityName"
                  style="width: 200px"
                  :readonly="presellDetail.startedFlag===true&&tempModalType===modalType.edit"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="活动状态:" prop="status">
                <Select v-model="presellDetail.status" style="width: 200px">
                  <Option
                    v-for="item in activityStatus"
                    :key="item.value"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="活动内容:" prop="content">
                <Input
                  v-model="presellDetail.content"
                  style="width: 200px"
                  :readonly="presellDetail.startedFlag===true&&tempModalType===modalType.edit"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem :label-width="130" label="活动Banner 推荐尺寸750*304(单位:px):" prop="banner">
                <Input v-show="false" v-model="presellDetail.banner" style="width: auto"></Input>
                <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url">
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
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="活动开始时间:" prop="startTime">
                <DatePicker
                  :value="presellDetail.startTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="活动开始时间"
                  :readonly="presellDetail.startedFlag===true&&tempModalType===modalType.edit"
                  class="search-input"
                  style="width: 200px"
                  @on-change="presellDetail.startTime=$event"
                />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="活动结束时间:" prop="endTime">
                <DatePicker
                  :value="presellDetail.endTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="活动结束时间"
                  :readonly="presellDetail.startedFlag===true&&tempModalType===modalType.edit"
                  class="search-input"
                  style="width: 200px"
                  @on-change="presellDetail.endTime=$event"
                />
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="提货时间:" prop="validDateType">
                <Select
                  v-model="presellDetail.validDateType"
                  placeholder="券有效期类型"
                  style="padding-right: 5px;width: 200px"
                  :disabled="presellDetail.startedFlag===true&&tempModalType===modalType.edit"
                  @on-change="handleChange"
                >
                  <Option
                    v-for="(item,index) in validDateTypeEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <template v-if="presellDetail.validDateType=='UN_FIXED_DATE'">
              <i-col span="12">
                <FormItem label="下单成功后第:" prop="beginDay">
                  <InputNumber
                    v-model="presellDetail.beginDay"
                    :min="0"
                    :readonly="presellDetail.startedFlag===true&&tempModalType===modalType.edit"
                    label="生效开始"
                    style="width: 60px"
                  ></InputNumber>天提货
                </FormItem>
              </i-col>
            </template>
            <template>
              <i-col v-if="presellDetail.validDateType=='FIXED_DATE'" span="12">
                <FormItem label="提货开始时间:" prop="deliveryStartTime">
                  <DatePicker
                    :value="presellDetail.deliveryStartTime"
                    format="yyyy-MM-dd"
                    type="date"
                    :readonly="presellDetail.startedFlag===true&&tempModalType===modalType.edit"
                    placeholder="提货开始时间"
                    style="width: 200px"
                    @on-change="presellDetail.deliveryStartTime=$event"
                  />
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="提货截止时间:" prop="deliveryEndTime">
                  <DatePicker
                    :value="presellDetail.deliveryEndTime"
                    format="yyyy-MM-dd"
                    type="date"
                    :readonly="presellDetail.startedFlag===true&&tempModalType===modalType.edit"
                    placeholder="提货截止时间"
                    style="width: 200px"
                    @on-change="presellDetail.deliveryEndTime=$event"
                  />
                </FormItem>
              </i-col>
            </template>
            <i-col span="12">
              <FormItem label="原价:">
                {{ presellDetail.originalPrice | fenToYuanDot2Filters }}
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品规格:" prop="standardId">
                <Input v-model="presellDetail.standardId" readonly="readonly" style="width: 200px">
                <Button
                  v-show="tempModalType !== modalType.edit"
                  slot="append"
                  icon="ios-search"
                  @click="handleRelation"
                ></Button>
                </Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="活动价:" prop="activityPrice">
                <InputNumber
                  :min="0"
                  :value="activityPriceComputed"
                  placeholder="活动价"
                  :readonly="presellDetail.startedFlag===true&&tempModalType===modalType.edit"
                  style="width: 200px"
                  @on-change="activityPriceInputNumberOnchange"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row v-show="presellDetail.standardId">
            <i-col span="12" style="margin-left:130px;margin-bottom:20px">
              <Button v-waves type="warning" @click="aboutGoods">
                关联商品详情
              </Button>
            </i-col>
          </Row>
          <Divider v-show="tempModalType === modalType.edit">
            可修改部分
          </Divider>
          <Row>
            <i-col span="12">
              <FormItem label="规格描述:" prop="standardDesc">
                <Input v-model="presellDetail.standardDesc" style="width: 585px"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="排序序号:" prop="rank">
                <InputNumber v-model="presellDetail.rank" style="width: 200px"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="库存数量:" prop="invNum">
                <InputNumber v-model="presellDetail.invNum" placeholder="库存数量" style="width: 200px"></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="限购次数:" prop="triesLimit">
                <InputNumber
                  v-model="presellDetail.triesLimit"
                  :min="0"
                  style="width: 200px"
                  placeholder="默认999"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="关联门店:">
                <Select v-model="presellDetail.relationStoreType" style="width: 200px">
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
            <i-col span="12">
              <FormItem label="已售份数:" prop="saleQuantity">
                <InputNumber v-model="presellDetail.saleQuantity" :min="0" style="width: 200px"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row></Row>
          <Row v-show="showStoreList">
            <i-col span="24">
              <FormItem label="门店列表:">
                <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                  <Checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll"
                  >
                    全选/反选
                  </Checkbox>
                </div>
                <CheckboxGroup v-model="storeIds" @on-change="checkAllGroupChange">
                  <Checkbox
                    v-for="item in storeList"
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
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit">
          确定
        </Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>

    <Modal v-model="modalProduct" :width="1200" title="关联商品" footer-hide>
      <Card>
        <tables
          ref="products"
          v-model="productData"
          :columns="productColumns"
          :loading="loading"
          editable
          searchable
          border
          search-place="top"
          @on-row-click="onRowClick"
        >
          <div slot="searchCondition">
            <Row>
              <Input
                v-model="searchProductRowData.productCode"
                placeholder="商品编码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchProductRowData.productName"
                placeholder="商品名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Button
                :loading="searchLoading"
                class="search-btn mr5"
                type="primary"
                @click="handleProductSearch"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                v-waves
                :loading="clearSearchLoading"
                class="search-btn"
                type="info"
                @click="handleProductClear"
              >
                <Icon type="md-refresh" />&nbsp;清除
              </Button>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="productTotal"
              :current="searchProductRowData.page"
              show-sizer
              show-total
              @on-change="changeProductPage"
              @on-page-size-change="changeProductPageSize"
            ></Page>
          </Row>
        </div>
      </Card>
    </Modal>

    <!-- 商品规格展示 -->
    <Modal v-model="modalGoodsStandard" :mask-closable="false" :width="700">
      <p slot="header">
        <span>商品规格详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品ID:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.productId }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品名称:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.baseProductName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品分类:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.groupName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                基础单位:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.baseUnit }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品编号:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.productCode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品条码:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.baseBarcode }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品主图:
              </i-col>
              <i-col span="16">
                <img :src="productStandardDetail.baseImage" width="100" height="100">
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品描述:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.baseProductDescription }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">
          商品规格
        </Divider>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                上架商品名称:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.productName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                上架商品描述:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.productDescription }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                上架商品主图:
              </i-col>
              <i-col v-if="productStandardDetail.image" span="16">
                <img :src="productStandardDetail.image" width="100" height="100">
              </i-col>
            </Row>
          </i-col>
          <!-- <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品详情图:</i-col>
              <i-col v-if="productStandardDetail.detailImage" span="16">
                <img :src="productStandardDetail.detailImage" width="100" height="100" />
              </i-col>
            </Row>
          </i-col>-->
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品条码:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.barcode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品状态:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.shelvesStatus | customPlanStatusFilters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品规格:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.specification }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                数量/重量:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.standardQty }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品原价:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.price| fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                售卖价格:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.salePrice | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">SVIP价格:</i-col>
              <i-col span="16">{{ productStandardDetail.svipPrice | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>-->

        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品单位:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.productUnit }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品排序:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.rank }}
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleGoodsClose">
          关闭
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  deleteTeamBuy,
  getPresellPages,
  editPresell,
  createPresell,
  getGoodsStandard,
  getStorePages,
  getProductStandardsPages,
  deletePicture
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  teamBuyStatusConvert,
  customPlanStatusConvert
} from '@/libs/converStatus';
import {
  teamBuyStatusEnum,
  teamBuyTypeEnum,
  rewardActivitySettingEnum,
  relationStoreTypeEnum
} from '@/libs/enumerate';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  compareData,
  secondsToDate,
  compareCouponData
} from '@/libs/util';

const preselldata = {
  activityName: '',
  activityPrice: 0,
  banner: '',
  beginDay: 0,
  content: '',
  deliveryEndTime: null,
  deliveryStartTime: null,
  endTime: null,
  flashCount: 0,
  id: 0,
  relationStoreType: 'ALL',
  invNum: 0,
  originalPrice: 0,
  rank: 0,
  saleQuantity: 0,
  standardDesc: '',
  standardId: 0,
  startTime: null,
  startedFlag: '',
  status: '',
  storeIds: null,
  triesLimit: 999,
  validDateType: 'UN_FIXED_DATE'
};

const roleRowData = {
  startTime: null,
  endTime: null,
  status: 'VALID',
  activityName: null,
  content: null,
  page: 1,
  rows: 10,
  sidx: 'rank',
  sort: 'asc',
  validDateType: null,
  startedFlag: true
};

const productStandardDetail = {
  id: 0,
  productId: 0,
  barcode: '',
  specification: '',
  standardQty: 0,
  unitId: 0,
  productUnit: '',
  price: 0,
  salePrice: 0,
  rank: 0,
  description: null,
  shelvesStatus: null,
  applyType: '',
  productName: '',
  createUser: null,
  image: null,
  productDescription: '',
  productCode: '',
  baseProductName: '',
  baseProductDescription: '',
  groupId: 0,
  groupName: '',
  sourceCode: '',
  baseImage: '',
  smallImage: '',
  largeImage: '',
  status: '',
  baseUnitId: 0,
  baseUnit: '',
  baseBarcode: '',
  hdSkuid: '',
  videoUrl: '',
  videoImage: '',
  baseQty: 0,
  limitQty: 0,
  queryStatus: null,
  invEnough: null,
  invNum: null,
  saleCount: null,
  positionName: null,
  dbId: null
};

const productRowData = {
  productType: 'ORDINARY_PRODUCT',
  productId: '',
  barcode: '',
  productCode: '',
  productName: '',
  shelvesStatus: 'VALID',
  minPrice: '',
  maxPrice: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        rank: [
          { required: true, message: '请输入排序序号' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        activityName: [{ required: true, message: '请输入活动名称' }],
        content: [{ required: true, message: '请输入活动内容' }],
        status: [{ required: true, message: '请选择活动状态' }],
        banner: [{ required: true, message: '请上传活动banner ' }],
        startTime: [{ required: true, message: '请输入活动开始时间' }],
        endTime: [{ required: true, message: '请输入活动结束时间' }],
        deliveryStartTime: [{ required: true, message: '请选择提货开始时间' }],
        beginDay: [
          { required: true, message: '请输入下单后第几天开始提货' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[1-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        standardId: [{ required: true, message: '请选择商品规格' }],
        standardDesc: [{ required: true, message: '请输入规格描述' }],
        activityPrice: [
          { required: true, message: '请输入预售活动价' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        invNum: [
          { required: true, message: '请输入库存数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        triesLimit: [
          { required: true, message: '请输入限购次数' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              if (value > 999) {
                errors.push(new Error('限购次数最大值999'));
              }
              callback(errors);
            }
          }
        ],
        saleQuantity: [
          { required: true, message: '请输入已售份数' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      startedFlagStatus: [
        { label: '是', value: 'true' },
        { label: '否', value: 'false' }
      ],
      activityStatus: [
        { label: '上架', value: 'VALID' },
        { label: '下架', value: 'INVALID' }
      ],
      validDateTypeEnum: [
        {
          label: '绝对时间',
          value: 'FIXED_DATE'
        },
        {
          label: '相对时间',
          value: 'UN_FIXED_DATE'
        }
      ],
      teamBuyStatus: [
        { label: '关闭', value: 'off' },
        { label: '开启', value: 'on' }
      ],
      teamBuyStatusEnum,
      teamBuyTypeEnum,
      rewardActivitySettingEnum,
      relationStoreTypeEnum,
      groupStatus: '',
      flagShipList: [],
      storeList: [],
      storeIds: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center",
        //   fixed: "left"
        // },
        {
          title: '活动名称',
          key: 'activityName',
          align: 'center',
          fixed: 'left',
          minWidth: 200
        },
        {
          title: '活动状态',
          align: 'center',
          key: 'status',
          minWidth: 90,
          render: (h, params) => {
            const { row } = params;
            if (row.status == 'VALID') {
              return (
                <div>
                  <tag color='success'>{'上架'}</tag>
                </div>
              );
            } else if (row.status == 'INVALID') {
              return (
                <div>
                  <tag color='error'>{'下架'}</tag>
                </div>
              );
            }
            return <div>{'N/A'}</div>;
          }
        },
        {
          title: '是否开始',
          align: 'center',
          key: 'startedFlag',
          minWidth: 90,
          render: (h, params) => {
            const { row } = params;
            if (row.startedFlag) {
              return (
                <div>
                  <tag color='success'>{'是'}</tag>
                </div>
              );
            } else if (!row.startedFlag) {
              return (
                <div>
                  <tag color='error'>{'否'}</tag>
                </div>
              );
            }
            return <div>{'N/A'}</div>;
          }
        },
        {
          title: '活动内容',
          align: 'center',
          minWidth: 160,
          key: 'content'
        },
        {
          title: '活动开始时间',
          align: 'center',
          minWidth: 160,
          key: 'startTime'
        },
        {
          title: '活动结束时间',
          align: 'center',
          minWidth: 160,
          key: 'endTime',
          render(h, params) {
            if (!compareCouponData(params.row.endTime)) {
              return (
                <div style='color:red'>{params.row.endTime + '已过期'}</div>
              );
            } else {
              return <div>{params.row.endTime}</div>;
            }
          }
        },
        {
          title: '商品库存',
          align: 'center',
          minWidth: 90,
          key: 'invNum'
        },
        {
          title: '原价',
          minWidth: 80,
          key: 'originalPrice',
          align: 'center',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.originalPrice)}</div>;
          }
        },
        {
          title: '活动价',
          minWidth: 80,
          key: 'activityPrice',
          align: 'center',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.activityPrice)}</div>;
          }
        },
        {
          title: '提货开始时间',
          align: 'center',
          minWidth: 160,
          key: 'deliveryStartTime',
          render(h, params) {
            if (params.row.deliveryStartTime) {
              return <div>{params.row.deliveryStartTime.split(' ')[0]}</div>;
            }
          }
        },
        {
          title: '提货截止时间',
          align: 'center',
          minWidth: 160,
          key: 'deliveryEndTime',
          render(h, params) {
            if (params.row.deliveryEndTime) {
              return <div>{params.row.deliveryEndTime.split(' ')[0]}</div>;
            }
          }
        },
        {
          title: '几天后开始提货',
          align: 'center',
          minWidth: 160,
          key: 'beginDay',
          render(h, params) {
            if (params.row.beginDay === 0) {
              return <div>{'N/A'}</div>;
            }
            return <div>{params.row.beginDay}</div>;
          }
        },
        // {
        //   title: "以购买数量",
        //   align: "center",
        //   minWidth: 160,
        //   key: "flashCount"
        // },
        {
          title: '规格描述',
          align: 'center',
          minWidth: 120,
          key: 'standardDesc',
          tooltip: true
        },
        {
          title: '限购次数',
          align: 'center',
          minWidth: 90,
          key: 'triesLimit'
        },
        {
          title: '排序',
          align: 'center',
          minWidth: 80,
          key: 'rank'
        },
        {
          title: '操作',
          minWidth: 150,
          align: 'center',
          fixed: 'right',
          key: 'handle',
          options: ['couponStatus', 'view', 'edit']
        }
      ],
      productColumns: [
        // {
        //   type: "selection",
        //   key: "",
        //   minWidth: 60,
        //   align: "center",
        //   fixed: "left"
        // },
        {
          title: '规格ID',
          align: 'center',
          key: 'id',
          minWidth: 80
        },
        {
          title: '商品条码',
          key: 'barcode',
          align: 'center',
          minWidth: 80
        },
        {
          title: '商品编号',
          key: 'productCode',
          align: 'center',
          minWidth: 130
        },
        {
          title: '商品名称',
          align: 'center',
          key: 'productName',
          minWidth: 150
        },
        {
          title: '商品规格',
          align: 'center',
          key: 'specification',
          minWidth: 100
        },
        {
          title: '商品单位',
          align: 'center',
          minWidth: 100,
          key: 'productUnit'
        },
        {
          title: '商品原价',
          align: 'center',
          minWidth: 120,
          key: 'price',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: '优惠价格',
          align: 'center',
          minWidth: 120,
          key: 'salePrice',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.salePrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: '商品状态',
          align: 'center',
          minWidth: 100,
          key: 'shelvesStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.shelvesStatus === 'VALID') {
              return (
                <div>
                  <tag color='success'>
                    {customPlanStatusConvert(row.shelvesStatus).label}
                  </tag>
                </div>
              );
            } else if (row.shelvesStatus === 'INVALID') {
              return (
                <div>
                  <tag color='error'>
                    {customPlanStatusConvert(row.shelvesStatus).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>
                  {customPlanStatusConvert(row.shelvesStatus).label}
                </tag>
              </div>
            );
          }
        },
        {
          title: '商品排序',
          align: 'center',
          minWidth: 100,
          key: 'rank'
        }
      ],
      productData: [],
      productStandardDetail: [],
      productTotal: 0,
      loading: true,
      modalProduct: false,
      modalGoodsStandard: false,
      createLoading: false,
      modalViewLoading: false,
      exportExcelLoading: false,
      showStoreList: false,
      indeterminate: false,
      checkAll: false,
      currentTableRowSelected: null,
      tableDataSelected: [],
      searchRowData: _.cloneDeep(roleRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      productDetail: _.cloneDeep(productStandardDetail),
      presellDetail: _.cloneDeep(preselldata)
    };
  },
  computed: {
    originalPriceComputed() {
      return fenToYuanDot2Number(this.presellDetail.originalPrice);
    },
    activityPriceComputed() {
      return fenToYuanDot2Number(this.presellDetail.activityPrice);
    },
    singleTeambuyPriceComputed() {
      return fenToYuanDot2Number(this.presellDetail.singleTeambuyPrice);
    },
    tourDiscountComputed() {
      return fenToYuanDot2Number(this.presellDetail.tourDiscount);
    }
  },
  watch: {
    numberInput(v) {
      if (String(v).indexOf('.') > 0) this.presellDetail.hour = '';
      this.$nextTick(() => {
        this.testInput = String(v).replace(/\D/g, '');
      });
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
    this.getStore();
  },
  created() {},
  methods: {
    getRelationStore(storeIds) {
      if (!storeIds) {
        return '全部门店';
      }
      const ids = storeIds.substring(1, storeIds.length - 1).split('][');
      const list = this.storeList;
      let str = '';
      if (list.length > 0) {
        ids.forEach(id => {
          const item = list.find(item => item.storeId == id);
          const itemName = item.storeName ? item.storeName : '';
          str += itemName + ',';
        });
        return str.substring(0, str.length - 1);
      }
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.presellDetail.banner = null;
    },
    handleSubmit() {
      const _this = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (_this.presellDetail.triesLimit > 999) {
            _this.presellDetail.triesLimit = 999;
          }
          if (
            compareData(
              _this.presellDetail.startTime,
              _this.presellDetail.endTime
            )
          ) {
            _this.$Message.error('结束时间必须大于开始时间!');
            return;
          }
          if (
            compareData(
              _this.presellDetail.endTime,
              _this.presellDetail.deliveryEndTime
            )
          ) {
            _this.$Message.error('提货截止时间必须大于活动截止时间!');
            return;
          }
          if (_this.presellDetail.validDateType === 'FIXED_DATE') {
            if (_this.presellDetail.deliveryEndTime) {
              if (
                compareData(
                  _this.presellDetail.deliveryStartTime,
                  _this.presellDetail.deliveryEndTime
                )
              ) {
                _this.$Message.error('提货截止时间必须大于提货开始时间!');
                return;
              }
            }
          }

          if (
            _this.presellDetail.relationStoreType === 'PART' &&
            _this.presellDetail.storeIds == null
          ) {
            _this.$Message.error('选择部分门店时必须选择至少一个门店!');
            return;
          }
          _this.presellDetail.startTime = _this
            .$moment(_this.presellDetail.startTime)
            .format('YYYY-MM-DD HH:mm:ss');
          _this.presellDetail.endTime = _this
            .$moment(_this.presellDetail.endTime)
            .format('YYYY-MM-DD HH:mm:ss');
          if (_this.presellDetail.deliveryEndTime) {
            _this.presellDetail.deliveryEndTime = _this
              .$moment(_this.presellDetail.deliveryEndTime)
              .format('YYYY-MM-DD HH:mm:ss');
          }
          if (_this.presellDetail.deliveryStartTime) {
            _this.presellDetail.deliveryStartTime = _this
              .$moment(_this.presellDetail.deliveryStartTime)
              .format('YYYY-MM-DD HH:mm:ss');
          }
          if (_this.tempModalType === _this.modalType.create) {
            // 添加状态
            _this.createStore();
          } else if (_this.tempModalType === _this.modalType.edit) {
            // 编辑状态
            _this.editStore();
          }
        } else {
          _this.$Message.error('请完善信息!');
        }
      });
    },
    handleEditClose() {
      this.oldPicture = [];
      this.newPicture = [];
      this.modalEdit = false;
    },
    createStore() {
      this.modalViewLoading = true;
      this.presellDetail.id = null; // 新建时不需要传递id
      createPresell(this.presellDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.getTableData();
        });
    },
    editStore() {
      this.modalViewLoading = true;
      editPresell(this.presellDetail)
        .then(res => {
          this.getTableData();
          this.modalEdit = false;
          this.modalViewLoading = false;
        })
        .catch(() => {
          this.modalEdit = false;
          this.getTableData();
          this.modalViewLoading = false;
        });
    },
    // 选取一条数据
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
    },
    addStore() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.presellDetail = _.cloneDeep(preselldata);
      }
      if (this.currentTableRowSelected) {
        this.currentTableRowSelected.id = null;
        this.currentTableRowSelected.createTime = null;
        this.currentTableRowSelected.standardId = null;
        this.currentTableRowSelected.originalPrice = null;
        this.currentTableRowSelected.banner = null;
        this.currentTableRowSelected.status = null;
        this.currentTableRowSelected.deliveryEndTime = null;
        this.currentTableRowSelected.deliveryStartTime = null;
        this.currentTableRowSelected.beginDay = 0;
        this.currentTableRowSelected.rank = null;
        this.currentTableRowSelected.storeId = null;
        this.currentTableRowSelected.storeIds = null;
        this.currentTableRowSelected.relationStoreType = 'ALL';
        this.currentTableRowSelected.activityPrice = null;
        this.presellDetail = _.cloneDeep(this.currentTableRowSelected);
      }
      this.getStore();
      this.modalEdit = true;
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.storeId);
    },
    deleteTable(ids) {
      this.loading = true;
      deleteTeamBuy({
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
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.banner != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.banner;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.presellDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.presellDetail.storeId = null;
      this.presellDetail.storeIds = null;
      this.storeIds = [];
      this.groupStatus = '';
      this.presellDetail.relationStoreType = 'ALL';
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.presellDetail = _.cloneDeep(params.row);
      this.groupStatus = this.presellDetail.status;
      this.setDefaultUploadList(this.presellDetail);
      if (this.presellDetail.storeIds != null) {
        this.showStoreList = true;
        this.presellDetail.relationStoreType = 'PART';
        const storeIds = this.presellDetail.storeIds
          .substring(1, this.presellDetail.storeIds.length - 1)
          .split('][');
        storeIds.forEach(element => {
          this.storeIds.push(parseInt(element));
        });
        // 全选/反选按钮的样式
        if (
          this.storeIds.length > 0 &&
          this.storeIds.length !== this.storeList.length
        ) {
          this.indeterminate = true;
        }
      } else {
        this.showStoreList = false;
        this.presellDetail.relationStoreType = 'ALL'; // storeIds为''默认关联的门店则是全部门店
      }
      this.modalEdit = true;
    },
    handleDownload() {
      this.exportExcelLoading = true;
      getTeamBuyPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['groupId'] = item['groupName'];
          item['status'] = teamBuyStatusConvert(item['status']).label;
          item['activityPrice'] = (item['activityPrice'] / 100.0).toFixed(2);
          item['tourDiscount'] = (item['tourDiscount'] / 100.0).toFixed(2);
          item['robot'] = teamBuyStatusConvert(item['robot']).label;
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `拼团活动信息-${date}`,
          data: tableData
        });
        this.exportExcelLoading = false;
      });
    },
    getTableData() {
      getPresellPages(this.searchRowData)
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
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.presellDetail.storeImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.presellDetail.banner = null;
      this.presellDetail.banner = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    startTimeChange(value, date) {
      this.presellDetail.startTime = value;
      // if (this.presellDetail.startTime.indexOf("T") > -1) {
      //   this.presellDetail.startTime = this.$moment(
      //     this.presellDetail.startTime
      //   ).format("YYYY-MM-DD HH:mm:ss");
      // }
    },
    endTimeChange(value, date) {
      this.presellDetail.endTime = value;
      // if (this.presellDetail.endTime.indexOf("T") > -1) {
      //   this.presellDetail.endTime = this.$moment(
      //     this.presellDetail.endTime
      //   ).format("YYYY-MM-DD HH:mm:ss");
      // }
    },
    createTimeStartChange(value, date) {
      this.searchRowData.startTime = value || null;
    },
    createTimeEndChange(value, date) {
      this.searchRowData.endTime = value || null;
    },
    effectiveStartTimeChange(value, date) {
      this.presellDetail.deliveryStartTime = value || null;
    },
    effectiveEndTimeChange(value, date) {
      this.presellDetail.deliveryEndTime = value || null;
    },
    activityStatusChange(value, date) {
      if (value === 'expire' || value === 'off') {
        this.searchRowData.sidx = 'start_time';
        this.searchRowData.sort = 'desc';
      }
    },
    validSecondsChange() {
      const hour = this.presellDetail.hour * 60 * 60;
      const minute = this.presellDetail.minute * 60;
      const second = this.presellDetail.second;
      this.presellDetail.validSeconds = hour + minute + second;
    },
    originalPriceInputNumberOnchange(value) {
      this.presellDetail.originalPrice = yuanToFenNumber(value);
    },
    activityPriceInputNumberOnchange(value) {
      this.presellDetail.activityPrice = yuanToFenNumber(value);
    },
    singleTeambuyPriceInputNumberOnchange(value) {
      this.presellDetail.singleTeambuyPrice = yuanToFenNumber(value);
    },
    tourDiscountInputNumberOnchange(value) {
      this.presellDetail.tourDiscount = yuanToFenNumber(value);
    },
    selectStore(options) {
      if (options.value === 'ALL') {
        this.presellDetail.relationStoreType = 'ALL';
        this.presellDetail.storeIds = null;
        this.showStoreList = false;
      } else if (options.value === 'PART') {
        this.presellDetail.relationStoreType = 'PART';
        this.indeterminate = false;
        this.checkAll = false;
        this.presellDetail.storeIds = '';
        this.showStoreList = true;
      }
    },
    // TODO 选择门店id方法
    getStore() {
      getStorePages({ page: 1, rows: -1 }).then(res => {
        this.storeList = res.rows;
      });
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        const allIds = [];
        this.storeList.forEach(item => {
          allIds.push(item.storeId);
        });
        this.storeIds = allIds;
      } else {
        this.storeIds = [];
      }
    },
    onRowClick(row, index) {
      // 给预售活动赋值
      this.presellDetail.standardId = row.id;
      this.presellDetail.originalPrice = row.price;
      this.modalProduct = false;
    },
    checkAllGroupChange(data) {
      if (data.length === this.storeList.length) {
        this.indeterminate = false;
        this.checkAll = true;
        this.presellDetail.storeIds = ''; // 全选存空字符串
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
        this.presellDetail.storeIds = '[' + data.join('][') + ']';
      } else {
        this.indeterminate = false;
        this.checkAll = false;
        this.presellDetail.storeIds = '';
      }
    },
    handleRelation() {
      this.getProductTableData();
      this.modalProduct = true;
    },
    getProductTableData() {
      getProductStandardsPages(this.searchProductRowData)
        .then(res => {
          this.productData = res.rows;
          this.productTotal = res.total;
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
    changeProductPage(page) {
      this.searchProductRowData.page = page;
      this.getProductTableData();
    },
    changeProductPageSize(pageSize) {
      this.searchProductRowData.page = 1;
      this.searchProductRowData.rows = pageSize;
      this.getProductTableData();
    },
    handleProductSearch() {
      this.searchProductRowData.page = 1;
      this.searchLoading = true;
      this.getProductTableData();
    },
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    handleProductClear() {
      // 重置商品搜索数据
      this.resetSearchProductRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleProductSearch();
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
    },
    statusChange(params) {
      this.presellDetail = _.cloneDeep(params.row);
      if (params.row.status === 'VALID') {
        this.presellDetail.status = 'INVALID';
      } else {
        this.presellDetail.status = 'VALID';
      }
      this.loading = true;
      this.editStore();
    },
    aboutGoods() {
      getGoodsStandard(this.presellDetail).then(res => {
        this.productStandardDetail = res;
        this.modalGoodsStandard = true;
      });
    },
    handleGoodsClose() {
      this.loading = false;
      this.modalGoodsStandard = false;
    },
    handleChange(value) {
      this.presellDetail.deliveryStartTime = '';
      this.presellDetail.deliveryEndTime = '';
      this.presellDetail.beginDay = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
