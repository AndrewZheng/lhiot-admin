<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="16"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-delete="handleDelete"
        @on-edit="handleEdit"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.unitName"
            placeholder="单位名称"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Button
            v-waves
            :search-loading="searchLoading"
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
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="handleAdd">
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
            :current="page"
            :page-size="searchRowData.rows"
            :page-size-opts="templatePageOpts"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ unitDetail.id == "" ? "创建商品单位" : "编辑商品单位" }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
        <Form
          ref="editForm"
          :label-width="100"
          :model="unitDetail"
          :rules="ruleInline"
        >
          <Row>
            <FormItem label="单位编码:" prop="unitCode">
              <Input
                v-model="unitDetail.unitCode"
                placeholder="请输入单位编码"
                style="width: 200px"
              ></Input>
            </FormItem>
            <FormItem label="单位名称:" prop="unitName">
              <Input
                v-model="unitDetail.unitName"
                placeholder="请输入单位名称"
                style="width: 200px"
              ></Input>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button
          :loading="loadingSubmit"
          type="primary"
          @click="handleSubmit"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getProductUnitsPages,
  editProductUnits,
  delProductUnits,
  createProductUnits
} from '@/api/lhfarm-small';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';

const unitDetail = {
  id: 0,
  unitCode: '',
  unitName: ''
};

const roleRowData = {
  unitName: '',
  page: 1,
  rows: 20
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      ids: [],
      templatePageOpts: [20, 50],
      loadingSubmit: false,
      clearSearchLoading: false,
      searchRowData: this._.cloneDeep(roleRowData),
      unitDetail: this._.cloneDeep(unitDetail),
      ruleInline: {
        unitCode: { required: true, message: '请填写单位编码' },
        unitName: { required: true, message: '请填写单位名称' }
      },
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center'
        },
        {
          title: '编号',
          align: 'center',
          key: 'id'
        },
        {
          title: '单位编码',
          align: 'center',
          key: 'unitCode'
        },
        {
          title: '单位名称',
          align: 'center',
          key: 'unitName'
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          options: ['edit', 'delete']
        }
      ]
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      getProductUnitsPages(this.searchRowData).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    handleEdit(params) {
      this.$refs.editForm.resetFields();
      this.tempModalType = this.modalType.edit;
      this.unitDetail = this._.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleAdd() {
      this.$refs.editForm.resetFields();
      this.tempModalType = this.modalType.create;
      this.unitDetail = unitDetail;
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.createTableRow();
          } else if (this.isEdit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error('请完善商品单位信息!');
        }
      });
    },
    editTableRow() {
      this.loadingSubmit = true;
      editProductUnits(this.unitDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.info('修改成功！');
          this.getTableData();
        })
        .finally(() => {
          this.loadingSubmit = false;
        });
    },
    createTableRow() {
      this.loadingSubmit = true;
      createProductUnits(this.unitDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.info('创建成功！');
          this.getTableData();
        })
        .finally(() => {
          this.loadingSubmit = false;
        });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    deleteTable(ids) {
      this.loading = true;
      delProductUnits({
        ids
      })
        .then((res) => {
          const totalPage = Math.ceil(this.total / this.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.page === totalPage &&
            this.page !== 1
          ) {
            this.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.img {
  width: 150px;
  height: auto !important;
}
.add-image {
  line-height: 48px;
  vertical-align: text-bottom;
  margin-right: 10px;
}
</style>
