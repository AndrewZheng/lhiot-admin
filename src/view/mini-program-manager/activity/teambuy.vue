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
      >
        <div slot="searchCondition">
          <Row>
            <Select v-model="searchRowData.status" placeholder="活动状态" style="padding-right: 5px;width: 100px" clearable>
              <Option
                v-for="(item,index) in teamBuyStatusEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px">{{ item.label }}
              </Option>
            </Select>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <DatePicker
              v-model="searchRowData.createTimeStart"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="创建时间起"
              class="mr5"
              style="width: 160px"
              @on-change="createTimeStartChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.createTimeEnd"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="创建时间止"
              class="mr5"
              style="width: 160px"
              @on-change="createTimeEndChange"
            />
            <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addStore">
            <Icon type="md-add"/>
            创建
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
            @on-page-size-change="changePageSize"></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalView"
      :mask-closable="false"
      width="720"
    >
      <p slot="header">
        <span>团购活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">团购活动编号:</i-col>
              <i-col span="18">{{ teambuyDetail.id }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">活动类型:</i-col>
              <i-col span="18">{{ teambuyDetail.teamBuyType | teamBuyTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">{{ teambuyDetail.activityName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">创建时间:</i-col>
              <i-col span="18">{{ teambuyDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">活动内容:</i-col>
              <i-col span="18">{{ teambuyDetail.content }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col span="18">{{ teambuyDetail.status | teamBuyStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">排序序号:</i-col>
              <i-col span="18">{{ teambuyDetail.rank }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">活动banner:</i-col>
              <i-col span="18">
                <img :src="teambuyDetail.banner" style="width: 100%">
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">有效期起:</i-col>
              <!-- <i-col span="18">{{ startTimeComputed }}</i-col> -->
              <i-col span="18">{{ teambuyDetail.startTime }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">有效期止:</i-col>
              <i-col span="18">{{ teambuyDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">提货截止时间:</i-col>
              <i-col span="18">{{ teambuyDetail.deliveryEndTime }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">成团有效时长:</i-col>
              <i-col span="18">{{ teambuyDetail.validSeconds }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">成团人数:</i-col>
              <i-col span="18">{{ teambuyDetail.fullUserNum }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">参团信息列表:</i-col>
              <i-col span="18">{{ teambuyDetail.joinInfoStatus | teamBuyStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">是否模拟成团:</i-col>
              <i-col span="18">{{ teambuyDetail.robot | teamBuyStatusFilter }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">状态多少秒:</i-col>
              <i-col span="18">{{ teambuyDetail.robotStartSecond }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">商品规格:</i-col>
              <i-col span="18">{{ teambuyDetail.standardId }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">规格描述:</i-col>
              <i-col span="18">{{ teambuyDetail.standardDesc }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">原价:</i-col>
              <i-col span="18">{{ teambuyDetail.originalPrice | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">活动价:</i-col>
              <i-col span="18">{{ teambuyDetail.activityPrice | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">团长优惠:</i-col>
              <i-col span="18">{{ teambuyDetail.tourDiscount | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">限购次数:</i-col>
              <i-col span="18">{{ teambuyDetail.triesLimit }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">库存数量:</i-col>
              <i-col span="18">{{ teambuyDetail.productNum }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">已售份数:</i-col>
              <i-col span="18">{{ teambuyDetail.saleQuantity }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">单人团购价格:</i-col>
              <i-col span="18">{{ teambuyDetail.singleTeambuyPrice | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">红包活动设置:</i-col>
              <i-col span="18">{{ teambuyDetail.rewardActivitySetting | rewardActivitySettingFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">关联门店:</i-col>
              <i-col span="18">{{ teambuyDetail.storeIds }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal
      v-model="modalEdit"
      style="z-index: 1000"
      width="720px"
    >
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改团购活动':'创建团购活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="teambuyDetail" :rules="ruleInline" :label-width="80">
          <Row v-show="tempModalType===modalType.edit">
            <Col span="12">
            <FormItem label="团购ID:" prop="id">
              {{ teambuyDetail.id }}
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="创建时间:" prop="createTime">
              {{ teambuyDetail.createTime }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="活动名称:" prop="activityName">
              <Input v-model="teambuyDetail.activityName" ></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="活动类型:" prop="teamBuyType">
              <Select v-model="teambuyDetail.teamBuyType">
                <Option
                  v-for="item in teamBuyTypeEnum"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="活动内容:" prop="content">
              <Input v-model="teambuyDetail.content" ></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="活动状态:" prop="status">
              <Select v-model="teambuyDetail.status">
                <Option
                  v-for="item in teamBuyStatus"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="排序序号:" prop="rank">
              <InputNumber :min="0" v-model="teambuyDetail.rank" style="width: 200px"></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="活动banner 推荐使用尺寸为400X225(单位:px):" prop="banner" >
              <Input v-show="false" v-model="teambuyDetail.banner" style="width: auto"></Input>
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
                @on-success="handleSuccessMain"
              >
                <div slot="content">
                  <Button type="primary">
                    上传图片
                  </Button>
                </div>
              </IViewUpload>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="有效期起:" prop="startTime">
              <DatePicker
                :readonly="tempModalType === modalType.edit"
                v-model="teambuyDetail.startTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="有效期起"
                class="search-input"
                style="width: 200px"
                @on-change="startTimeChange"
              />
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="有效期止:" prop="endTime">
              <DatePicker
                :readonly="tempModalType === modalType.edit"
                v-model="teambuyDetail.endTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="有效期止"
                class="search-input"
                style="width: 200px"
                @on-change="endTimeChange"
              />
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="提货截止时间:" prop="deliveryEndTime">
              <DatePicker
                :readonly="tempModalType === modalType.edit"
                v-model="teambuyDetail.deliveryEndTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="提货截止时间"
                class="search-input"
                style="width: 200px"
                @on-change="deliveryEndTimeChange"
              />
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="成团有效时长:" prop="validSeconds">
              <!-- TODO 后期插件修改 -->
              <!-- <TimePicker type="time" placeholder="成团有效时长" style="width: 200px" @on-change=""></TimePicker> -->
              <InputNumber :min="0" v-model="teambuyDetail.hour" :readonly="tempModalType === modalType.edit" style="width: 70px" @on-change="validSecondsChange"></InputNumber>时
              <InputNumber :min="0" v-model="teambuyDetail.minute" :readonly="tempModalType === modalType.edit" style="width: 70px" @on-change="validSecondsChange"></InputNumber>分
              <InputNumber :min="0" v-model="teambuyDetail.second" :readonly="tempModalType === modalType.edit" style="width: 70px" @on-change="validSecondsChange"></InputNumber>秒
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="成团人数:" prop="fullUserNum">
              <InputNumber :min="0" v-model="teambuyDetail.fullUserNum" style="width: 200px"></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="参团信息列表:" prop="joinInfoStatus">
              <Select v-model="teambuyDetail.joinInfoStatus">
                <Option
                  v-for="item in teamBuyStatus"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="是否模拟成团:" prop="robot">
              <Select v-model="teambuyDetail.robot">
                <Option
                  v-for="item in teamBuyStatus"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="多少秒后虚位补齐:" prop="robotStartSecond">
              <Input v-model="teambuyDetail.robotStartSecond" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品规格:" prop="standardId">
              <Input v-model="teambuyDetail.standardId" readonly="readonly"><Button v-show="tempModalType !== modalType.edit" slot="append" icon="ios-search" @click="handleRelation"></Button></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="规格描述:" prop="standardDesc">
              <Input v-model="teambuyDetail.standardDesc" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="原价:">
              {{ teambuyDetail.originalPrice | fenToYuanDot2Filters }}
              <!-- <InputNumber
                :min="0"
                :value="originalPriceComputed"
                readonly="readonly"
                placeholder="原价"
                style="width: 200px"
                @on-change="originalPriceInputNumberOnchange"></InputNumber> -->
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="活动价:" prop="activityPrice">
              <InputNumber
                :min="0"
                :value="activityPriceComputed"
                placeholder="活动价"
                style="width: 200px"
                @on-change="activityPriceInputNumberOnchange"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="团长优惠:" prop="tourDiscount">
              <InputNumber
                :min="0"
                :value="tourDiscountComputed"
                placeholder="团长优惠"
                style="width: 200px"
                @on-change="tourDiscountInputNumberOnchange"></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="限购次数:" prop="triesLimit">
              <InputNumber :min="0" v-model="teambuyDetail.triesLimit" style="width: 200px" placeholder="默认999"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="库存数量:" prop="productNum">
              <InputNumber v-model="teambuyDetail.productNum" placeholder="库存数量" style="width: 200px" ></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="已售份数:" prop="saleQuantity">
              <InputNumber :min="0" v-model="teambuyDetail.saleQuantity" style="width: 200px"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="单人团购价格:" prop="singleTeambuyPrice">
              <InputNumber
                :min="0"
                :value="singleTeambuyPriceComputed"
                placeholder="单人团购价格"
                style="width: 200px"
                @on-change="singleTeambuyPriceInputNumberOnchange"></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="红包活动设置:" prop="rewardActivitySetting">
              <Select v-model="teambuyDetail.rewardActivitySetting">
                <Option
                  v-for="item in rewardActivitySettingEnum"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="关联门店:">
              <Select v-model="teambuyDetail.relationStoreType">
                <Option
                  v-for="item in relationStoreTypeEnum"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                  @click.native="selectStore(item)">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row v-show="showStoreList">
            <Col span="24">
            <FormItem label="门店列表:">
              <CheckboxGroup v-model="model" @on-change="checkAllGroupChange">
                <Checkbox
                  v-for="item in storeList"
                  ref="checkBox"
                  :key="item.storeId"
                  :label="item.storeId"
                >{{ item.storeName }}
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="View Image">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>

    <Modal v-model="modalProduct" :width="1000" title="关联商品">
      <Card>
        <tables
          ref="tables"
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
              <Input v-model="searchProductRowData.productCode" placeholder="商品编码" class="search-input mr5" style="width: auto" clearable></Input>
              <Input v-model="searchProductRowData.productName" placeholder="商品名称" class="search-input mr5" style="width: auto" clearable></Input>
              <Button :searchLoading="searchLoading" class="search-btn mr5" type="primary" @click="handleProductSearch">
                <Icon type="md-search"/>&nbsp;搜索
              </Button>
              <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleProductClear">
                <Icon type="md-refresh"/>&nbsp;清除条件
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
              @on-page-size-change="changeProductPageSize"></Page>
          </Row>
        </div>
      </Card>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import { deleteTeamBuy, getTeamBuyPages, editTeamBuy, createTeamBuy, getStorePages, getProductStandardsPages } from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { teamBuyStatusConvert, customPlanStatusConvert } from '@/libs/converStatus';
import { teamBuyStatusEnum, teamBuyTypeEnum, rewardActivitySettingEnum, relationStoreTypeEnum } from '@/libs/enumerate';
import { fenToYuanDot2, fenToYuanDot2Number, yuanToFenNumber, compareData } from '@/libs/util';

const teambuyDetail = {
  remainingProductNum: 0,
  triesLimit: 0,
  teamGuaranteeURL: '',
  storeId: 0,
  storeIds: '',
  singleTeambuyPrice: null,
  originalPrice: null,
  saleQuantity: 0,
  createTime: '',
  teamBuyType: null,
  teamBuyNum: 0,
  rewardActivitySetting: '',
  joinInfoStatus: '',
  teamResultEnum: null,
  id: 0,
  activityName: '',
  content: '',
  status: null,
  rank: 0,
  startTime: '',
  endTime: '',
  banner: '',
  totalNum: 0,
  activityPrice: null,
  tourDiscount: null,
  fullUserNum: 0,
  standardId: 0,
  validSeconds: null,
  deliveryEndTime: '',
  standardDesc: '',
  fullTeambuyCount: 0,
  robot: null,
  teamBuys: null,
  productStandard: null,
  leftTime: '',
  productNum: 0,
  robotStartSecond: 0,
  hour: null,
  minute: null,
  second: null,
  relationStoreType: 'ALL'
};

const roleRowData = {
  status: null,
  activityName: null,
  createTimeStart: null,
  createTimeEnd: null,
  page: 1,
  rows: 10
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
        activityName: [
          { required: true, message: '请输入活动名称' }
        ],
        teamBuyType: [
          { required: true, message: '请选择活动类型' }
        ],
        content: [
          { required: true, message: '请输入活动内容' }
        ],
        status: [
          { required: true, message: '请选择活动状态' }
        ],
        banner: [
          { required: true, message: '请上传活动banner ' }
        ],
        startTime: [
          { required: true, message: '请输入有效期起' }
        ],
        endTime: [
          { required: true, message: '请输入有效期止' }
        ],
        deliveryEndTime: [
          { required: true, message: '请输入提货截止时间' }
        ],
        validSeconds: [
          { required: true, message: '请输入成团有效时长' }
        ],
        fullUserNum: [
          { required: true, message: '请输入成团人数' },
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
        joinInfoStatus: [
          { required: true, message: '请选择参团信息列表状态' }
        ],
        robot: [
          { required: true, message: '请选择是否模拟成团' }
        ],
        robotStartSecond: [
          { required: true, message: '请填写状态多少秒:' },
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
        standardId: [
          { required: true, message: '请选择商品规格' }
        ],
        standardDesc: [
          { required: true, message: '请输入规格描述' }
        ],
        originalPrice: [
          { required: true, message: '请输入商品原价' },
          { message: '必须为大于0的数字', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/ }
        ],
        activityPrice: [
          { required: true, message: '请输入商品活动价' },
          { message: '必须为大于0的数字', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/ }
        ],
        tourDiscount: [
          { required: true, message: '请选择团长优惠' }
        ],
        triesLimit: [
          { required: true, message: '请输入限购次数' },
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
        productNum: [
          { required: true, message: '请选择库存数量' },
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
        ],
        singleTeambuyPrice: [
          { required: true, message: '请输入单人团购价格' },
          { message: '必须为大于0的数字', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/ }
        ],
        rewardActivitySetting: [
          { required: true, message: '请选择红包活动设置' }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      teamBuyStatus: [{ label: '关闭', value: 'off' }, { label: '开启', value: 'on' }],
      teamBuyStatusEnum,
      teamBuyTypeEnum,
      rewardActivitySettingEnum,
      relationStoreTypeEnum,
      flagShipList: [],
      storeList: [],
      model: [],
      columns: [
        {
          title: '活动名称',
          key: 'activityName',
          sortable: true,
          fixed: 'left',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '活动状态',
          key: 'status',
          minWidth: 90,
          render: (h, params) => {
            const { row } = params;
            if (row.status == 'on') {
              return <div><tag color='success'>{teamBuyStatusConvert(row.status).label}</tag></div>;
            } else if (row.status == 'off') {
              return <div><tag color='error'>{teamBuyStatusConvert(row.status).label}</tag></div>;
            } else if (row.status == 'expire') {
              return <div><tag color='warning'>{teamBuyStatusConvert(row.status).label}</tag></div>;
            }
            return <div><tag color='primary'>{row.status}</tag></div>;
          }
        },
        {
          title: '有效期起',
          minWidth: 160,
          key: 'startTime'
        },
        {
          title: '有效期止',
          minWidth: 160,
          key: 'endTime'
        },
        {
          title: '商品库存',
          minWidth: 100,
          key: 'productNum'
        },
        {
          title: '活动价',
          minWidth: 100,
          key: 'activityPrice',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.activityPrice)}</div>;
          }
        },
        {
          title: '团长优惠',
          minWidth: 100,
          key: 'tourDiscount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.tourDiscount)}</div>;
          }
        },
        {
          title: '成团有效时长',
          minWidth: 100,
          key: 'validSeconds'
        },
        {
          title: '提货截至时间',
          minWidth: 160,
          key: 'deliveryEndTime'
        },
        {
          title: '规格描述',
          minWidth: 120,
          key: 'standardDesc',
          tooltip: true
        },
        {
          title: '限购次数',
          minWidth: 80,
          key: 'triesLimit'
        },
        {
          title: '是否模拟成团',
          minWidth: 120,
          key: 'robot',
          render: (h, params) => {
            const { row } = params;
            if (row.robot === 'on') {
              return <div><tag color='success'>{teamBuyStatusConvert(row.robot).label}</tag></div>;
            } else if (row.robot === 'off') {
              return <div><tag color='error'>{teamBuyStatusConvert(row.robot).label}</tag></div>;
            }
            return <div><tag color='primary'>{row.robot}</tag></div>;
          }
        },
        {
          title: '操作',
          minWidth: 120,
          key: 'handle',
          options: ['view', 'edit']
        }
      ],
      productColumns: [
        {
          type: 'selection',
          key: '',
          minWidth: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '规格ID',
          key: 'id',
          minWidth: 80
        },
        {
          title: '商品条码',
          key: 'barcode',
          minWidth: 80
        },
        {
          title: '商品编号',
          key: 'productCode',
          minWidth: 100
        },
        {
          title: '商品名称',
          key: 'productName',
          minWidth: 100
        },
        {
          title: '商品规格',
          key: 'specification',
          minWidth: 100
        },
        {
          title: '商品单位',
          minWidth: 100,
          key: 'productUnit'
        },
        {
          title: '商品原价',
          minWidth: 120,
          key: 'price',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: '优惠价格',
          minWidth: 120,
          key: 'salePrice',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.salePrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: '商品状态',
          minWidth: 100,
          key: 'shelvesStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.shelvesStatus === 'VALID') {
              return <div><tag color='success'>{customPlanStatusConvert(row.shelvesStatus).label}</tag></div>;
            } else if (row.shelvesStatus === 'INVALID') {
              return <div><tag color='error'>{customPlanStatusConvert(row.shelvesStatus).label}</tag></div>;
            }
            return <div><tag color='primary'>{customPlanStatusConvert(row.shelvesStatus).label}</tag></div>;
          }
        },
        {
          title: '商品排序',
          minWidth: 100,
          key: 'rank'
        }
      ],
      productData: [],
      productTotal: 0,
      loading: true,
      modalProduct: false,
      createLoading: false,
      modalViewLoading: false,
      showStoreList: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      productDetail: _.cloneDeep(productStandardDetail),
      teambuyDetail: _.cloneDeep(teambuyDetail)
    };
  },
  computed: {
    originalPriceComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.originalPrice);
    },
    activityPriceComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.activityPrice);
    },
    singleTeambuyPriceComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.singleTeambuyPrice);
    },
    tourDiscountComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.tourDiscount);
    },
    validSecondsComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.validSeconds);
    }
  },
  watch: {
    numberInput(v) {
      if (String(v).indexOf('.') > 0) this.teambuyDetail.hour = '';
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
  created() {
  },
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.teambuyDetail.banner = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.teambuyDetail.teamBuyType === 'OLD_AND_NEW' && this.teambuyDetail.fullUserNum <= 1) {
            this.$Message.error('老带新团成团人数必须大于1');
            return;
          }
          if (compareData(this.teambuyDetail.startTime, this.teambuyDetail.endTime)) {
            this.$Message.error('结束时间必须大于开始时间!');
            return;
          }
          if (compareData(this.teambuyDetail.endTime, this.teambuyDetail.deliveryEndTime)) {
            this.$Message.error('提货截止时间必须大于有效期止时间!');
            return;
          }
          if (this.teambuyDetail.robotStartSecond > this.teambuyDetail.validSeconds) {
            this.$Message.error('虚位补齐时间不能超过成团有效时长!');
            return;
          }
          if (parseInt(this.teambuyDetail.productNum) % parseInt(this.teambuyDetail.fullUserNum) !== 0) {
            this.$Message.error('商品份额必须被成团人数整除!');
            return;
          }
          if (this.teambuyDetail.relationStoreType === 'PART' && (this.teambuyDetail.storeIds == null || this.teambuyDetail.storeIds === '')) {
            this.$Message.error('选择部分门店时必须选择至少一个门店!');
            return;
          }
          if (this.teambuyDetail.productNum < this.teambuyDetail.fullUserNum) {
            this.$Message.error('库存数量不能小于成团人数!');
            return;
          }
          if (this.teambuyDetail.tourDiscount >= this.teambuyDetail.activityPrice) {
            this.$Message.error('团长优惠不能大于等于活动金额!');
            return;
          }
          // if (this.teambuyDetail.activityPrice > this.teambuyDetail.originalPrice) {
          //   this.$Message.info('活动价不能高于商品原价');
          //   return;
          // }
          // if (this.teambuyDetail.singleTeambuyPrice > this.teambuyDetail.originalPrice) {
          //   this.$Message.error('单人团购价格不能大于原价');
          //   return;
          // }
          var numRe = new RegExp(/^[0-9]+$/)
          if (!numRe.test(this.teambuyDetail.validSeconds)) {
            this.$Message.error('成团有效时长不能为小数');
            return;
          }
          if (this.teambuyDetail.triesLimit == null || this.teambuyDetail.triesLimit == 0) {
            this.teambuyDetail.triesLimit = 999;
          }
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createStore();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editStore();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createStore() {
      this.modalViewLoading = true;
      createTeamBuy(this.teambuyDetail).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      }).catch(() => {
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
    },
    editStore() {
      this.modalViewLoading = true;
      editTeamBuy(this.teambuyDetail).then(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      }).catch(() => {
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    addStore() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.teambuyDetail = _.cloneDeep(teambuyDetail)
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
      }).then(res => {
        const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
        if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
          this.searchRowData.page -= 1;
        }
        this.tableDataSelected = [];
        this.getTableData();
      }
      ).catch(err => {
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
      this.teambuyDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.teambuyDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(this.teambuyDetail);
      if (this.teambuyDetail.validSeconds > 0) {
        this.teambuyDetail.hour = parseInt(this.teambuyDetail.validSeconds / 3600);
        this.teambuyDetail.minute = parseInt(this.teambuyDetail.validSeconds % 3600 / 60);
        this.teambuyDetail.second = this.teambuyDetail.validSeconds % 3600 % 60;
      }
      if (this.teambuyDetail.storeIds !== null && this.teambuyDetail.storeIds !== '') {
        this.showStoreList = true;
        this.teambuyDetail.relationStoreType = 'PART';
        const storeIds = this.teambuyDetail.storeIds.split(',');
        storeIds.forEach(element => {
          this.model.push(parseInt(element));
        });
      } else {
        this.showStoreList = false;
      }
      this.modalEdit = true;
    },
    getTableData() {
      getTeamBuyPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.teambuyDetail.storeImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.teambuyDetail.banner = null;
      this.teambuyDetail.banner = fileList[0].url;
    },
    startTimeChange(value, date) {
      this.teambuyDetail.startTime = value;
    },
    endTimeChange(value, date) {
      this.teambuyDetail.endTime = value;
    },
    createTimeStartChange(value, date) {
      this.teambuyDetail.createTimeStart = value;
    },
    createTimeEndChange(value, date) {
      this.teambuyDetail.createTimeEnd = value;
    },
    deliveryEndTimeChange(value, date) {
      this.teambuyDetail.deliveryEndTime = value;
    },
    validSecondsChange() {
      const hour = this.teambuyDetail.hour * 60 * 60;
      const minute = this.teambuyDetail.minute * 60;
      const second = this.teambuyDetail.second;
      this.teambuyDetail.validSeconds = hour + minute + second;
    },
    originalPriceInputNumberOnchange(value) {
      this.teambuyDetail.originalPrice = yuanToFenNumber(value);
    },
    activityPriceInputNumberOnchange(value) {
      this.teambuyDetail.activityPrice = yuanToFenNumber(value);
    },
    singleTeambuyPriceInputNumberOnchange(value) {
      this.teambuyDetail.singleTeambuyPrice = yuanToFenNumber(value);
    },
    tourDiscountInputNumberOnchange(value) {
      this.teambuyDetail.tourDiscount = yuanToFenNumber(value);
    },
    selectStore(options) {
      if (options.value === 'ALL') {
        this.showStoreList = false;
      } else if (options.value === 'PART') {
        this.showStoreList = true;
      }
    },
    // TODO 选择门店id方法
    getStore() {
      getStorePages({ page: 1, rows: -1 }).then(res => {
        this.storeList = res.rows;
      }).catch(error => {
        console.log(error);
      });
    },
    checkAllGroupChange(data) {
      this.teambuyDetail.storeIds = data.join(',');
    },
    handleRelation() {
      this.getProductTableData();
      this.modalProduct = true;
    },
    getProductTableData() {
      getProductStandardsPages(this.searchProductRowData).then(res => {
        this.productData = res.rows;
        this.productTotal = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(error => {
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
    onRowClick(row, index) {
      // 给团购活动赋值
      this.teambuyDetail.standardId = row.id;
      this.teambuyDetail.originalPrice = row.price;
      this.modalProduct = false;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
