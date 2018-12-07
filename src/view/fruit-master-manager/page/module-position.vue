<template>
  <div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns1"
              :loading="loading"
              :searchAreaColumn="24"
              @on-view="handleView"
              @on-edit="handleEdit"
      >
        <div slot="searchCondition">
          <Input :clearable="true" placeholder="板块位置描述" class="search-input mr5" v-model="searchRowData.description"
                 style="width: auto"/>
          <Select ref="selectRef" v-model="searchRowData.positionType" class="search-col mr5" placeholder="位置类型"
                  :clearable="true">
            <Option v-for="item in positionSelectList" :value="item.value"
                    class="pl15 pt5 pb5"
                    :key="`search-col-${item.value}`">{{item.label}}
            </Option>
          </Select>
          <Button v-waves @click="handleSearch" class="search-btn mr5" :loading="searchLoading" type="primary">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button v-waves @click="handleClear" class="search-btn" :loading="clearSearchLoading" type="info">
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer
                show-total></Page>
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
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="7">板块位置ID:</i-col>
              <i-col span="17">{{uiPositionDetail.id}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">位置描述:</i-col>
              <i-col span="16">{{uiPositionDetail.description}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">板块位置编码:</i-col>
              <i-col span="16">{{uiPositionDetail.code}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">位置类型:</i-col>
              <i-col span="16">{{uiPositionDetail.positionType}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Table
          v-if="uiPositionDetail.positionType === 'ADVERTISEMENT'&& uiPositionDetail.advertisementList !== null"
          border
          :columns="columnsAdvertisement"
          :data="uiPositionDetail.advertisementList"
        ></Table>
        <Table
          v-if="uiPositionDetail.positionType === 'PRODUCT'&& uiPositionDetail.productSectionList.length>0"
          class="mt30"
          border
          :columns="columnsModule"
          :data="uiPositionDetail.productSectionList"
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
  import {getUiPosition, getuiPositionsPages} from '@/api/fruitermaster';
  import tableMixin from '@/mixins/tableMixin.js'
  import searchMixin from '@/mixins/searchMixin.js'
  import _ from 'lodash'

  const uiPositionDetail = {
    applicationType: "HEALTH_GOOD",
    code: "carousel",
    description: "鲜果师轮播图",
    id: 0,
    positionType: "ADVERTISEMENT",
    productSectionList: [],
    advertisementList: []
  }
  const roleRowData = {
    page: 1,
    rows: 10,
    positionType: null,
    description: null
  };

  export default {
    components: {
      Tables
    },
    created() {
      this.searchRowData = _.cloneDeep(roleRowData)
      this.getTableData();
    },
    mixins: [tableMixin, searchMixin],
    data() {
      return {
        columnsAdvertisement: [
          {
            title: '广告图',
            render: (h, params, vm) => {
              let {row} = params
              const str = <img src={row.image} style="margin-top:5px" height="60" width="60" margin-top="10px"/>;
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
              let {row} = params
              let array = []
              if (row.productShelfList.length > 0) {
                row.productShelfList.forEach(value => {
                  array.push(value.name)
                })
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
            key: 'positionType'
          },
          {
            title: '操作',
            minWidth: 80,
            key: 'handle',
            options: ['view']
          }
        ],
        searchRowData: _.cloneDeep(roleRowData),
        uiPositionDetail: uiPositionDetail
      };
    },
    methods: {
      resetSearchRowData() {
        this.searchRowData = _.cloneDeep(roleRowData);
      },
      handleView(params) {
        this.loading = true;
        getUiPosition({id: params.row.id}).then(res => {
          console.log(res);
          this.uiPositionDetail = res
          console.log(uiPositionDetail.advertisementList);
          console.log(uiPositionDetail.advertisementList === null);
          this.modalView = true;
          this.loading = false
        })

      },
      handleEdit(params) {
        this.fruitMasterDetail = params.row;
        params.row.this.modalEdit = true;
      },
      getTableData() {
        getuiPositionsPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
          this.clearSearchLoading = false
          this.searchLoading = false
        });
      },
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${new Date().valueOf()}.csv`
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
