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
        @on-delete="handleDelete"
        @on-edit="handleEdit"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.keyword"
              placeholder="关键词"
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
            @click="addKeywords"
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

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>关键词详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                关键词:
              </i-col>
              <i-col span="18">
                {{ keywordDetail.keyword }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                商品规格ID:
              </i-col>
              <i-col span="18">
                {{ keywordDetail.mappingId }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                商品规格名称:
              </i-col>
              <i-col span="18">
                {{ keywordDetail.productName }}
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

    <Modal
      v-model="modalEdit"
      :mask-closable="false"
      :z-index="1000"
      :width="800"
    >
      <p slot="header">
        <i-col>
          {{
            tempModalType === modalType.edit ? "修改关键词" : "创建关键词"
          }}
        </i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="modalEdit"
          :model="keywordDetail"
          :rules="ruleInline"
          :label-width="130"
        >
          <Row>
            <Col span="18">
            <FormItem label="关键词:" prop="keyword">
              <Input
                v-model="keywordDetail.keyword"
                placeholder="请选择关键词"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="关联规格ID:" prop="mappingId">
              <Input
                v-model="keywordDetail.mappingId"
                placeholder="请选择关联规格ID"
                readonly
              >
              <Button
                slot="append"
                icon="ios-search"
                @click="handleRelation"
              ></Button>
              </Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="商品规格列表:">
              <div
                v-for="(item, index) in standardIdsArray"
                :key="index"
                :value="item.value"
                class="standardidList"
              >
                {{ item.label }}
                <p
                  class="delete"
                  @click.stop="deleteGoods(index, item.value)"
                ></p>
              </div>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="关联商品规格名称:" prop="productName">
              <Input
                v-model="keywordDetail.productName"
                :autosize="{ minRows: 3, maxRows: 8 }"
                type="textarea"
                readonly
                placeholder="关联商品规格名称"
              ></Input>
            </FormItem>
            </Col>
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
          @click="handleSubmit('modalEdit')"
        >
          确定
        </Button>
      </div>
    </Modal>

    <!-- 关联规格商品 -->
    <Modal
      v-model="modalProduct"
      :mask-closable="false"
      :width="1200"
      :z-index="1000"
    >
      <p slot="header">
        <span>{{ "关联规格商品" }}</span>
      </p>
      <div class="modal-content">
        <Form ref="goodsForm" :model="productStandardRelation">
          <Row>
            <FormItem>
              <tables
                ref="tables"
                v-model="productData"
                :columns="productColumns"
                search-place="top"
                searchable
                highlight-row
                border
                @on-select-all="onSelectionAllGoods"
                @on-selection-change="onSelectionChangeGoods"
              >
                <div slot="searchCondition">
                  <Row>
                    <Input
                      v-model="searchProductRowData.barcode"
                      placeholder="商品条码"
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
                      @click="hanldeProductClear"
                    >
                      <Icon type="md-refresh" />&nbsp;清除
                    </Button>
                  </Row>
                </div>
              </tables>
              <div style="margin: 10px; overflow: hidden">
                <Row type="flex" justify="end">
                  <Page
                    :total="productTotal"
                    :current="searchProductRowData.page"
                    show-sizer
                    show-total
                    @on-change="changeStaProductPage"
                    @on-page-size-change="changeStaProductPageSize"
                  ></Page>
                </Row>
              </div>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleGoodsClose">
          关闭
        </Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleGoodsSubmit"
        >
          确认
        </Button>
      </div>
    </Modal>
    <Modal
      v-model="deleteAffirm"
      title="正在进行删除操作"
      @on-ok="affirmOk"
      @on-cancel="affirmCancel"
    >
      <p>
        是否确认删除规格ID为
        <b style="color: #ff3861">{{ deleteStandardId }}</b>
        的商品?
      </p>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  deleteKeywords,
  getKeywordsPages,
  updateKeywords,
  createKeywords,
  getProductStandardsPages
} from '@/api/mini-program';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { imageStatusConvert } from '@/libs/converStatus';
import { imageStatusEnum } from '@/libs/enumerate';
import { fenToYuanDot2 } from '@/libs/util';
import { customPlanStatusConvert } from '@/libs/converStatus';
const keywordDetail = {
  keyword: '',
  mappingId: '',
  productName: ''
};

const roleRowData = {
  keyword: '',
  mappingId: '',
  productName: '',
  page: 1,
  rows: 10
};
const productColumns = [
  {
    type: 'selection',
    key: '',
    width: 60,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '规格ID',
    key: 'id',
    align: 'center',
    minWidth: 70
  },
  {
    title: '商品条码',
    key: 'barcode',
    minWidth: 150,
    align: 'center'
  },
  {
    title: '商品编号',
    key: 'productCode',
    align: 'center',
    minWidth: 150
  },
  {
    title: '商品名称',
    key: 'productName',
    minWidth: 150,
    align: 'center'
  },
  {
    title: '规格',
    key: 'specification',
    minWidth: 90,
    align: 'center'
  },
  {
    title: '单位',
    key: 'productUnit',
    minWidth: 90,
    align: 'center'
  },
  {
    title: '售价',
    key: 'price',
    minWidth: 90,
    align: 'center',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: '起购份数',
    key: 'startNum',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '商品类型',
    minWidth: 120,
    key: 'expandType',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;

      if (row.productStandardExpand != null) {
        if (row.productStandardExpand.expandType == 'DISCOUNT_PRODUCT') {
          return (
            <div>
              <tag color='magenta'>
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == 'PULL_NEW_PRODUCT') {
          return (
            <div>
              <tag color='orange'>
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == 'SECKILL_PRODUCT') {
          return (
            <div>
              <tag color='blue'>
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == 'SHARE_PRODUCT') {
          return (
            <div>
              <tag color='blue'>
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == 'ASSIST_PRODUCT') {
          return (
            <div>
              <tag color='green'>
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        }
      } else {
        return (
          <div>
            <tag color='cyan'>{'普通商品'}</tag>
          </div>
        );
      }
    }
  },
  {
    title: '商品状态',
    minWidth: 100,
    key: 'shelvesStatus',
    align: 'center',
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
const productRowData = {
  productStandardId: '',
  productId: '',
  barcode: '',
  productCode: '',
  productName: '',
  shelvesStatus: 'VALID',
  minPrice: '',
  maxPrice: '',
  page: 1,
  rows: 10,
  expandType: 'IGNORE_TYPE'
};
const relationData = {
  id: 0,
  productStandardIds: 0,
  productSectionId: 0,
  productSectionRank: 0
};
export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        activityCode: [{ required: true, message: '请输入活动编码' }],
        activityName: [{ required: true, message: '请输入活动名称' }]
      },
      modalProduct: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          align: 'center',
          key: 'id',
          width: 60
        },
        {
          title: '关键词',
          align: 'center',
          key: 'keyword',
          width: 180
        },
        {
          title: '关联规格ID',
          align: 'center',
          key: 'mappingId',
          width: 260
        },
        {
          title: '关联商品规格名称',
          align: 'center',
          key: 'productName'
        },
        {
          title: '操作',
          align: 'center',
          width: 180,
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      deleteAffirm: false,
      goodsIndex: '',
      deleteStandardId: '',
      productColumns: productColumns,
      standardIdList: [],
      standardIdsArray: [],
      productNameList: [],
      productNameArray: [],
      productData: [],
      productTotal: 0,
      searchRowData: _.cloneDeep(roleRowData),
      keywordDetail: _.cloneDeep(keywordDetail),
      productStandardRelation: _.cloneDeep(relationData),
      searchProductRowData: _.cloneDeep(productRowData)
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
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createKeywords();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.updateKeywords();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createKeywords() {
      this.modalViewLoading = true;
      createKeywords(this.keywordDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    updateKeywords() {
      this.modalViewLoading = true;
      updateKeywords(this.keywordDetail)
        .then((res) => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.$Message.success('修改成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addKeywords() {
      this.standardIdList = [];
      this.productNameList = [];
      this.standardIdsArray = [];
      this.productNameArray = [];
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.keywordDetail = _.cloneDeep(keywordDetail);
      }
      this.modalEdit = true;
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    deleteTable(ids) {
      this.loading = true;
      deleteKeywords({
        ids
      })
        .then((res) => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length == this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.$Message.success('删除成功!');
          this.tableDataSelected = [];
          this.getTableData();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.keywordDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.keywordDetail = _.cloneDeep(params.row);
      this.standardIdList = [];
      this.productNameList = [];
      this.standardIdsArray = [];
      this.productNameArray = [];
      const standardIdsData = [];
      const productNameData = [];
      if (this.keywordDetail.mappingId) {
        standardIdsData.push(this.keywordDetail.mappingId.split(','));
        standardIdsData[0].forEach((value) => {
          const map = { label: 'label', value: 'value' };
          map.value = value;
          map.label = value;
          this.standardIdsArray.push(map);
        });
        productNameData.push(this.keywordDetail.productName.split(','));
        productNameData[0].forEach((value) => {
          const map = { label: 'label', value: 'value' };
          map.value = value;
          map.label = value;
          this.productNameArray.push(map);
        });
      }
      this.modalEdit = true;
    },
    getTableData() {
      this.loading = true;
      getKeywordsPages(this.searchRowData)
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
    handleRelation() {
      this.getProductTableData();
      this.modalProduct = true;
    },
    getProductTableData() {
      getProductStandardsPages(this.searchProductRowData).then((res) => {
        this.productData = res.rows;
        this.productTotal = res.total;
      });
    },
    changeStaProductPage(page) {
      this.searchProductRowData.page = page;
      this.getProductTableData();
    },
    changeStaProductPageSize(pageSize) {
      this.searchProductRowData.page = 1;
      this.searchProductRowData.rows = pageSize;
      this.getProductTableData();
    },
    handleProductSearch() {
      this.getProductTableData();
    },
    hanldeProductClear() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    onSelectionAllGoods(selection) {
      this.standardIdList.push(selection.map((item) => item.id));
      this.productNameList.push(selection.map((item) => item.productName));
    },
    onSelectionChangeGoods(selection) {
      this.standardIdList.push(selection.map((item) => item.id));
      this.productNameList.push(selection.map((item) => item.productName));
    },
    handleGoodsClose() {
      this.standardIdList = [];
      this.productNameList = [];
      this.standardIdsArray = [];
      this.productNameArray = [];
      this.modalProduct = false;
    },
    handleGoodsSubmit() {
      const keywordData = this.keywordDetail.mappingId.split(',');
      const standardIdData = this.standardIdList[this.standardIdList.length - 1];
      for (const value of keywordData) {
        for (const val of standardIdData) {
          if (value == val) {
            this.$Message.info('当前关键字商品列表中存在选中的商品!');
            return;
          }
        }
      }
      if (this.standardIdList.length > 0) {
        this.standardIdList[this.standardIdList.length - 1].forEach((value) => {
          const map = { label: 'label', value: 'value' };
          map.value = value;
          map.label = value;
          this.standardIdsArray.push(map);
        });
        this.productNameList[this.productNameList.length - 1].forEach(
          (value) => {
            const map = { label: 'label', value: 'value' };
            map.value = value;
            map.label = value;
            this.productNameArray.push(map);
          }
        );
        this.keywordDetail.mappingId = this.standardIdsArray
          .map((item) => item.value)
          .join(',');
        this.keywordDetail.productName = this.productNameArray
          .map((item) => item.value)
          .join(',');
      }
      this.modalProduct = false;
    },
    deleteGoods(index, standardId) {
      this.goodsIndex = '';
      this.deleteStandardId = '';
      this.deleteAffirm = true;
      this.goodsIndex = index;
      this.deleteStandardId = standardId;
    },
    affirmOk() {
      this.standardIdsArray.splice(this.goodsIndex, 1);
      this.productNameArray.splice(this.goodsIndex, 1);
      this.keywordDetail.mappingId = this.standardIdsArray
        .map((item) => item.value)
        .join(',');
      this.keywordDetail.productName = this.productNameArray
        .map((item) => item.value)
        .join(',');
      this.deleteAffirm = false;
    },
    affirmCancel() {
      this.deleteAffirm = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.standardidList {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: #ff3861;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 38px;
  margin-right: 8px;
  margin-bottom: 5px;
  cursor: pointer;
  position: relative;
  .delete {
    width: 12px;
    height: 12px;
    background-image: url("http://resource.shuiguoshule.com.cn/product_image/h5/2020-08-05/UkYn1xNUt48yOxSQv4ty.png");
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    right: -5px;
  }
}
</style>
