<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns1"
        :loading="loading"
        :search-area-column="24"
        editable
        searchable
        border
        search-place="top"
        @on-view="handleView"
      >
        <div slot="searchCondition">
          <Input
            :clearable="true"
            v-model="searchRowData.description"
            placeholder="板块位置描述"
            class="search-input mr5"
            style="width: auto"></Input>
          <Select
            ref="selectRef"
            v-model="searchRowData.positionType"
            :clearable="true"
            class="search-col mr5"
            placeholder="位置类型">
            <Option
              v-for="item in positionSelectList"
              :value="item.value"
              :key="`search-col-${item.value}`"
              class="pl15 pt5 pb5">{{ item.label }}
            </Option>
          </Select>
          <Button v-waves :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
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
      :width="800"
    >
      <p slot="header">
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="7">板块位置ID:</i-col>
              <i-col span="17">{{ uiPositionDetail.id }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">位置描述:</i-col>
              <i-col span="16">{{ uiPositionDetail.description }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">板块位置编码:</i-col>
              <i-col span="16">{{ uiPositionDetail.code }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">位置类型:</i-col>
              <i-col span="16">{{ uiPositionDetail.positionType }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Table
          v-if="uiPositionDetail.positionType === 'ADVERTISEMENT'&& uiPositionDetail.advertisementList !== null"
          :columns="columnsAdvertisement"
          :data="uiPositionDetail.advertisementList"
          border
        ></Table>
        <Table
          v-if="uiPositionDetail.positionType === 'PRODUCT'&& uiPositionDetail.productSectionList !== null"
          :columns="columnsModule"
          :data="uiPositionDetail.productSectionList"
          class="mt30"
          border
        ></Table>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import { getUiPosition, getuiPositionsPages } from '@/api/fruitermaster';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';

const uiPositionDetail = {
  applicationType: null,
  code: 'carousel',
  description: '鲜果师轮播图',
  id: 0,
  positionType: 'ADVERTISEMENT',
  productSectionList: [],
  advertisementList: []
};
const roleRowData = {
  page: 1,
  rows: 10,
  positionType: null,
  description: null,
  applicationType: null
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      columnsAdvertisement: [
        {
          title: '广告图',
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.image} style='margin-top:5px' height='60' width='60' margin-top='10px'/>;
            return <div>{str}</div>;
          }
        },
        {
          title: '广告名称',
          key: 'advertiseName'
        },
        {
          title: '广告类别',
          key: 'advertiseType'
        },
        {
          title: '广告链接',
          key: 'advertiseRelation'
        },
        {
          title: '序号',
          key: 'sorting'
        }
      ],
      columnsModule: [
        {
          title: '板块名称',
          key: 'sectionName'
        },
        {
          title: '关联商品',
          key: 'productShelfList',
          render: (h, params, vm) => {
            const { row } = params;
            const array = [];
            if (row.productShelfList.length > 0) {
              row.productShelfList.forEach(value => {
                array.push(value.name);
              });
            }
            return <div>{array.join(',  ')}</div>;
          }
        },
        {
          title: '序号',
          key: 'sorting'
        }
      ],
      positionSelectList: [
        {
          value: 'PRODUCT',
          label: '商品'
        },
        {
          value: 'ADVERTISEMENT',
          label: '广告'
        },
        {
          value: 'ARTICLE',
          label: '文章'
        }
      ],
      columns1: [
        {
          title: '板块位置ID',
          key: 'id',
          sortable: true,
          minWidth: 120,
          fixed: 'left'
        },
        {
          title: '板块位置描述',
          key: 'description',
          minWidth: 150
        },
        {
          title: '板块位置编码',
          minWidth: 150,
          key: 'code'
        },
        {
          title: '位置类型',
          minWidth: 150,
          key: 'positionType',
          render: (h, params, vm) => {
            const { row } = params;
            switch (row.positionType) {
              case 'PRODUCT':
                return <div>{'商品'}</div>;
              case 'ADVERTISEMENT':
                return <div>{'广告'}</div>;
              case 'ARTICLE':
                return <div>{'文章'}</div>;
              default :
                return <div>{row.positionType}</div>;
            }
          }
        },
        {
          title: '操作',
          minWidth: 80,
          key: 'handle',
          options: ['view']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      uiPositionDetail: _.cloneDeep(uiPositionDetail)
    };
  },
  created() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleView(params) {
      this.loading = true;
      getUiPosition({ id: params.row.id }).then(res => {
        this.uiPositionDetail = res;
        this.modalView = true;
        this.loading = false;
      }).catch(() => {
        this.modalView = true;
        this.loading = false;
      });
    },
    getTableData() {
      this.searchRowData.applicationType = this.applicationType;
      getuiPositionsPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.clearSearchLoading = false;
        this.searchLoading = false;
      }).catch(() => {
        this.loading = false;
        this.clearSearchLoading = false;
        this.searchLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-role /deep/ .ivu-select-dropdown{
  background: lightgray;
}
</style>
