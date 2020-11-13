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
import {
  getEntityExchangePages,
  deleteEntityExchange,
  createEntityExchange,
  editEntityExchange,
  getProductStandardsPages,
  getProductUnits
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import relationStoreMixin from '@/mixins/relationStoreMixin.js';
import {
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
  specification: '',
  cityCode: '0731'
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
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin, relationStoreMixin],
  data() {
    return {
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      unitsList: [],
      addRelationList: [],
      couponTemplateData: [],
      hdCouponTemplateData: [],
      templatePageOpts: [5, 10],
      modalRelation: false,
      showValidDate: true,
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      couponTemplateTotal: 0,
      couponHdTemplateTotal: 0,
      showStoreName: '',
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
      searchRowData: _.cloneDeep(roleRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      relationDetail: _.cloneDeep(relationDetail),
      addRelationDetail: _.cloneDeep(relationDetail),
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
      }
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
    this.getTableData();
  },
  methods: {
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
      this.storeIds = [];
      this.addRelationDetail.relationStoreType = 'ALL';
      this.tempModalType = this.modalType.edit;
      this.addRelationDetail = _.cloneDeep(params.row);
      if (
        this.addRelationDetail.stores !== null &&
        this.addRelationDetail.stores !== ''
      ) {
        this.showStoreList = true;
        this.addRelationDetail.relationStoreType = 'PART';
        const storeIds = this.addRelationDetail.stores.substring(1, this.addRelationDetail.stores.length - 1).split('][');
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
      this.storeIds = [];
      this.tempModalType = this.modalType.create;
      this.modalAdd = true;
      this.getProStandardData();
    },
    handleRelation() {
      this.modalRelation = true;
    },
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
