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
        @on-delete="handleDelete"
        @pro-status="statusChange"
        @on-edit="handleEdit"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <!-- <Input
              v-model="searchRowData.barcode"
              placeholder="商品条码"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>-->
            <Input
              v-model="searchRowData.productName"
              placeholder="商品名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.status"
              placeholder="商品状态"
              style="padding-right: 5px;width: 100px"
            >
              <Option
                v-for="(item,index) in couponStatusEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.memberLimitType"
              placeholder="用户范围"
              style="padding-right: 5px;width: 100px"
            >
              <Option
                v-for="(item,index) in memberLimitEnum"
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
            @click="addEntityExchange"
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
            :page-size="searchRowData.rows"
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
      :mask-closable="false"
      @on-visible-change="handleModalAdd"
    >
      <p slot="header">
        <i-col>配置实物兑换</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <Form
            ref="addForm"
            :model="addRelationDetail"
            :rules="relationRuleInline"
            :label-width="100"
          >
            <Row>
              <i-col span="6">
                <FormItem label="商品名称:" prop="productName">
                  <Input v-model="addRelationDetail.productName">
                  <Button slot="append" icon="ios-search" @click="handleRelation"></Button>
                  </Input>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="商品单位:" prop="unitId">
                  <Input v-show="false" v-model="addRelationDetail.unitName"></Input>
                  <Select
                    v-model="addRelationDetail.unitId"
                    style="width: 80px"
                    @on-change="unitChange"
                  >
                    <Option
                      v-for="(item,index) in unitsList"
                      :key="index"
                      :value="item.value"
                      class="ptb2-5"
                      style="padding-left: 5px"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="数量/重量:" prop="standardQty">
                  <Input v-model="addRelationDetail.standardQty" style="width: 80px"></Input>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="商品规格ID:" prop="standardId">
                  {{ addRelationDetail.standardId }}
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="商品条码:" prop="barcode">
                  {{ addRelationDetail.barcode }}
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="商品规格:" prop="specification">
                  {{ addRelationDetail.specification }}
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="基础重量:" prop="baseQty">
                  {{ addRelationDetail.baseQty }}
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="基础单位:" prop="baseUnitName">
                  {{ addRelationDetail.baseUnitName }}
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="商品主图:" prop="image">
                  <img :src="addRelationDetail.image" width="100" height="100">
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="商品详情图:" prop="detailImage">
                  <img :src="addRelationDetail.detailImage" width="100" height="100">
                </FormItem>
              </i-col>
            </Row>

            <Divider>关联商品后配置</Divider>

            <Row>
              <i-col span="6">
                <FormItem label="实物类型:" prop="entityType">
                  <Select
                    v-model="addRelationDetail.entityType"
                    placeholder="实物类型"
                    style="padding-right: 5px;width: 100px"
                  >
                    <Option
                      v-for="(item,index) in entityTypeEnum"
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
              <i-col span="6">
                <FormItem label="兑换积分" prop="points">
                  <InputNumber
                    v-model="addRelationDetail.points"
                    :min="0"
                    label="兑换积分"
                    style="width: 80px"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="促销积分:" prop="realPoints">
                  <InputNumber
                    v-model="addRelationDetail.realPoints"
                    :min="0"
                    label="促销积分"
                    style="width: 80px"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="兑换价格" prop="price">
                  <InputNumber
                    :min="0"
                    :value="exchangePrice"
                    label="兑换价格"
                    style="width: 80px"
                    @on-change="exchangePriceChange"
                  ></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="6">
                <FormItem label="用户范围:" prop="memberLimitType">
                  <Select
                    v-model="addRelationDetail.memberLimitType"
                    placeholder="用户范围"
                    style="padding-right: 5px;width: 100px"
                  >
                    <Option
                      v-for="(item,index) in memberLimitEnum"
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
                <FormItem label="每人限兑:" prop="receiveLimit">
                  <InputNumber v-model="addRelationDetail.receiveLimit" :min="0" label="限兑数量"></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="兑换总数:" prop="entityLimit">
                  <InputNumber v-model="addRelationDetail.entityLimit" :min="0" label="限购数量"></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="排序字段:" prop="rank">
                  <InputNumber v-model="addRelationDetail.rank" :min="0" label="排序字段"></InputNumber>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="兑换说明:" prop="exchangeRemark">
                  <Input
                    v-model="addRelationDetail.exchangeRemark"
                    type="textarea"
                    :autosize="{minRows: 3,maxRows: 8}"
                    placeholder="请输入兑换说明"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="关联门店:">
                  <Select v-model="addRelationDetail.relationStoreType" style="width: 220px">
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
                    style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;display:flex;"
                  >
                    <div style="margin-left:-54px;margin-right:18px">
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
                  <CheckboxGroup v-model="stores" @on-change="checkAllGroupChange">
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
                    style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;display:flex;"
                  >
                    <div style="margin-left:-54px;margin-right:18px">
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
                  <CheckboxGroup v-model="stores" @on-change="checkAllGroupChange1">
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
                    style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;display:flex;"
                  >
                    <div style="margin-left:-54px;margin-right:18px">
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
                  <CheckboxGroup v-model="stores" @on-change="checkAllGroupChange2">
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
                    style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;display:flex;"
                  >
                    <div style="margin-left:-54px;margin-right:18px">
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
                  <CheckboxGroup v-model="stores" @on-change="checkAllGroupChange3">
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
                    style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;display:flex;"
                  >
                    <div style="margin-left:-54px;margin-right:18px">
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
                  <CheckboxGroup v-model="stores" @on-change="checkAllGroupChange4">
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
                    style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;display:flex;"
                  >
                    <div style="margin-left:-54px;margin-right:18px">
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
                  <CheckboxGroup v-model="stores" @on-change="checkAllGroupChange5">
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
                    style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;display:flex;"
                  >
                    <div style="margin-left:-54px;margin-right:18px">
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
                  <CheckboxGroup v-model="stores" @on-change="checkAllGroupChange6">
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
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">
          关闭
        </Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="tempModalType=='create'? handleTemplateAdd('add'):handleTemplateAdd('edit')"
        >
          确定
        </Button>
      </div>
    </Modal>

    <Modal v-model="modalRelation" :width="1200" :z-index="1024" draggable>
      <tables
        ref="tables"
        v-model="couponTemplateData"
        :columns="proStandardColumns"
        :loading="tempTableLoading"
        border
        searchable
        search-place="top"
        @on-row-click="handleChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchTemplateRowData.productCode"
              placeholder="商品条码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchTemplateRowData.productName"
              placeholder="商品名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <!-- <Select v-model="searchTemplateRowData.couponType" placeholder="商品状态" style="padding-right: 5px;width: 100px" clearable>
              <Option
                v-for="(item,index) in couponTypeEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px">{{ item.label }}
              </Option>
            </Select>-->
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

      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
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
  getEntityExchangePages,
  deleteEntityExchange,
  createEntityExchange,
  editEntityExchange,
  getEntityTemplatePages,
  getProductStandardsPages,
  getHdCouponActivitiesPages,
  getProductUnits,
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
  couponUseLimitConvert,
  customPlanStatusConvert,
  memberLimitConvert
} from '@/libs/converStatus';
import {
  couponStatusEnum,
  couponTypeEnum,
  couponScopeEnum,
  couponUseLimitEnum,
  validDateTypeEnum,
  entityTypeEnum,
  memberLimitEnum,
  relationStoreTypeEnum
} from '@/libs/enumerate';
import {
  compareData,
  getSmallCouponActivity,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  replaceByTag,
  replaceByTab
} from '@/libs/util';

const relationDetail = {
  baseQty: 0,
  unitName: '',
  description: '',
  detailImage: null,
  entityLimit: 999,
  entityType: 'COMMON_GOODS', // COMMON_GOODS(普通商品),PERIPHERY_GOODS(周边商品)
  exchangeRemark: '',
  id: 0,
  image: null,
  memberLimitType: 'ALL', // (ALL(所有会员) 默认不限制会员兑换
  points: 0,
  price: 0,
  productName: '',
  rank: 0,
  realPoints: 0,
  receiveCount: 0,
  receiveLimit: 999,
  standardId: 0,
  standardQty: 0,
  status: 'VALID',
  unitId: 0,
  baseUnitName: null,
  stores: null,
  relationStoreType: 'ALL',
  barcode: '', // inherit
  specification: ''
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

const roleRowData = {
  // status: '',
  productName: null,
  // barcode: '',
  page: 1,
  rows: 10,
  sidx: 'createTime',
  sort: 'desc'
};

const templateRowData = {
  productId: '',
  barcode: '',
  productCode: '',
  productName: '',
  shelvesStatus: 'VALID',
  page: 1,
  rows: 5
};

const dataColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '商品条码',
    align: 'center',
    key: 'barcode',
    minWidth: 80
  },
  {
    title: '商品名称',
    align: 'center',
    key: 'productName',
    minWidth: 160
  },
  {
    title: '商品规格',
    align: 'center',
    key: 'specification',
    minWidth: 80
  },
  {
    title: '商品状态',
    key: 'status',
    align: 'center',
    minWidth: 30,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.status === 'VALID') {
        return (
          <div>
            <tag color='success'>上架</tag>
          </div>
        );
      } else if (row.status === 'INVALID') {
        return (
          <div>
            <tag color='error'>下架</tag>
          </div>
        );
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '用户范围',
    align: 'center',
    key: 'memberLimitType',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.memberLimitType === 'ALL') {
        return <div>{memberLimitConvert(row.memberLimitType).label}</div>;
      } else if (row.userScope === 'SVIP') {
        return <div>{memberLimitConvert(row.memberLimitType).label}</div>;
      }
      return <div>{row.memberLimitType}</div>;
    },
    minWidth: 40
  },
  {
    title: '创建时间',
    align: 'center',
    key: 'createTime',
    minWidth: 100
  },
  {
    title: '操作',
    align: 'center',
    minWidth: 80,
    key: 'handle',
    options: ['proStatus', 'edit', 'delete']
  }
];

const proStandardColumns = [
  {
    type: 'selection',
    key: '',
    minWidth: 60,
    align: 'center',
    fixed: 'left'
  },
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
    align: 'center',
    key: 'productCode',
    minWidth: 120
  },
  {
    title: '商品名称',
    align: 'center',
    key: 'productName',
    minWidth: 100
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
    title: '售卖价格',
    minWidth: 120,
    align: 'center',
    key: 'salePrice',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.salePrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: '商品状态',
    minWidth: 100,
    align: 'center',
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
        productName: [{ required: true, message: '请先关联一个商品' }],
        entityType: [{ required: true, message: '请选择实物类型' }],
        exchangeRemark: [{ required: true, message: '请输入兑换说明' }],
        rank: [{ required: true, message: '请输入排序字段' }],
        memberLimitType: [{ required: true, message: '请选择用户范围' }],
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
        entityLimit: [
          { required: true, message: '请输入兑换限制的总数' },
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
      unitsList: [],
      couponStatusEnum,
      relationStoreTypeEnum,
      couponTypeEnum,
      couponScopeEnum,
      couponUseLimitEnum,
      validDateTypeEnum,
      entityTypeEnum,
      memberLimitEnum,
      dataColumns: dataColumns,
      proStandardColumns: proStandardColumns,
      templatePageOpts: [5, 10],
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      relationDetail: _.cloneDeep(relationDetail),
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
      couponHdTemplateTotal: 0,
      modalRelation: false
    };
  },
  computed: {
    exchangePrice() {
      return fenToYuanDot2Number(this.addRelationDetail.price);
    },
    minBuyFeeComputed() {
      return fenToYuanDot2Number(this.addRelationDetail.minBuyFee);
    }
  },
  created() {
    getProductUnits().then((res) => {
      res.array.forEach((item) => {
        const map = { label: 'label', value: 'value' };
        map.value = item.id;
        map.label = item.unitName;
        this.unitsList.push(map);
      });
    });
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData); // 刷新清除上次搜索结果
    this.getStore();
    this.getTableData();
  },
  methods: {
    // changeMemberLimit(value) {
    //   if (value) {
    //     this.addRelationDetail.memberLimitType = "MEMBER";
    //   } else {
    //     this.addRelationDetail.memberLimitType = "ALL";
    //   }
    // },
    exchangePriceChange(value) {
      this.addRelationDetail.price = yuanToFenNumber(value);
    },
    statusChange(params) {
      this.addRelationDetail = _.cloneDeep(params.row);
      if (params.row.status === 'VALID') {
        this.addRelationDetail.status = 'INVALID';
      } else {
        this.addRelationDetail.status = 'VALID';
      }
      this.editEntityExchange();
    },
    unitChange(value) {
      const unit = this.unitsList.find((x) => x.value == value);
      this.addRelationDetail.unitId = value;
      this.addRelationDetail.unitName = unit;
    },
    handleEdit(params) {
      const _this = this;
      this.stores = [];
      this.addRelationDetail.relationStoreType = 'ALL';
      this.tempModalType = this.modalType.edit;
      this.addRelationDetail = _.cloneDeep(params.row);
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
      this.replaceTextByTab();
      this.modalAdd = true;
      this.getProStandardData();
    },
    handleModalAdd(isShow) {
      // 如果是创建则先清除对象
      if (isShow && this.tempModalType === this.modalType.create) {
        this.resetFields();
      }
    },
    addEntityExchange() {
      this.showStoreList = false;
      this.stores = [];
      this.tempModalType = this.modalType.create;
      this.modalAdd = true;
      this.getProStandardData();
    },
    handleRelation() {
      this.modalRelation = true;
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
      getAreaStorePages()
        .then((res) => {
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
        })
        .catch((error) => {
          console.log(error);
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
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.addForm.resetFields();
      this.addRelationDetail = _.cloneDeep(relationDetail);
    },
    getTableData() {
      getEntityExchangePages(this.searchRowData)
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
    getProStandardData() {
      getProductStandardsPages(this.searchTemplateRowData)
        .then((res) => {
          this.couponTemplateData = res.rows;
          this.couponTemplateTotal = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    changeProductPage(page) {
      this.searchTemplateRowData.page = page;
      this.getProStandardData();
    },
    changeProductPageSize(pageSize) {
      this.searchTemplateRowData.page = 1;
      this.searchTemplateRowData.rows = pageSize;
      this.getProStandardData();
    },
    handleTemplateSearch() {
      this.searchTemplateRowData.page = 1;
      this.searchLoading = true;
      this.getProStandardData();
    },
    handleTemplateClear() {
      this.clearSearchLoading = true;
      this.searchTemplateRowData = _.cloneDeep(templateRowData);
      this.handleTemplateSearch();
    },
    createEntityExchange() {
      if (this.addRelationDetail.realPoints > this.addRelationDetail.points) {
        this.$Message.error('促销积分不能大于兑换积分');
        return false;
      }
      this.modalViewLoading = true;
      createEntityExchange(this.addRelationDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.$Message.success('创建成功!');
          this.modalAdd = false;
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    editEntityExchange() {
      this.modalViewLoading = true;
      editEntityExchange(this.addRelationDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success('修改成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    replaceTextByTab() {
      if (this.addRelationDetail.exchangeRemark) {
        this.addRelationDetail.exchangeRemark = replaceByTab(
          this.addRelationDetail.exchangeRemark
        );
      }
    },
    replaceTextByTag() {
      if (this.addRelationDetail.exchangeRemark) {
        this.addRelationDetail.exchangeRemark = replaceByTag(
          this.addRelationDetail.exchangeRemark
        );
      }
    },
    handleTemplateAdd(name) {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.replaceTextByTag();
          if (name === 'add') {
            this.createEntityExchange();
          } else {
            this.editEntityExchange();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    handleChange(row, index) {
      // 关联选择相关规格的商品
      this.addRelationDetail.baseQty = row.baseQty;
      this.addRelationDetail.baseUnitName = row.baseUnit;
      this.addRelationDetail.description = row.description;
      this.addRelationDetail.detailImage = row.detailImage;
      this.addRelationDetail.image = row.image;
      this.addRelationDetail.standardId = row.id;
      this.addRelationDetail.standardQty = row.standardQty;
      this.addRelationDetail.productName = row.productName;
      this.addRelationDetail.barcode = row.barcode; // 商品条码
      this.addRelationDetail.unitId = row.unitId;
      this.addRelationDetail.unitName = row.productUnit; // 商品规格单位
      this.addRelationDetail.specification = row.specification; // 商品规格描述
      this.modalRelation = false;
    },
    handleAddClose() {
      this.modalAdd = false;
    },
    // 批量删除-单行删除内部也是调用此方法
    deleteTable(ids) {
      this.tempTableLoading = true;
      deleteEntityExchange({ ids })
        .then((res) => {
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
        .finally((res) => {
          this.tempTableLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
