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
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
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
        <span>{{ unitDetail.id == ''?'创建商品单位':'编辑商品单位' }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
        <Form ref="editForm" :label-width="100" :model="unitDetail" :rules="ruleInline">
          <Row>
            <FormItem label="单位名称:" prop="unitName">
              <Input v-model="unitDetail.unitName" placeholder="请输入单位名称" style="width: 200px"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="是否可拆分:" prop="splitStatus">
              <Select
                v-model="unitDetail.splitStatus"
                class="search-col mr5"
                placeholder="是否可拆分"
                style="width:200px"
                clearable
              >
                <Option
                  v-for="item in splitStatus"
                  :key="item.value"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit">确定</Button>
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
} from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import { splitConvert } from '@/libs/converStatus';

const unitDetail = {
  id: '',
  splitStatus: null,
  unitName: ''
};

const roleRowData = {
  id: '',
  splitStatus: null,
  unitName: '',
  page: 1,
  rows: 10
};
export default {
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      ids: [],
      splitStatus: [
        {
          label: '是',
          value: 'SEPARABLE'
        },
        {
          label: '否',
          value: 'NO_SEPARABLE'
        }
      ],
      ruleInline: {
        splitStatus: { required: true, message: '请填写是否可拆分' },
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
          title: '单位名称',
          align: 'center',
          key: 'unitName'
        },
        {
          title: '是否可拆分',
          align: 'center',
          key: 'splitStatus',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{splitConvert(row.splitStatus).label}</div>;
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          options: ['edit', 'delete']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      unitDetail: _.cloneDeep(unitDetail)
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    resetFields() {
      this.$refs.editForm.resetFields();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    getTableData() {
      getProductUnitsPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    handleAdd() {
      this.resetFields();
      this.tempModalType = this.modalType.create;
      this.unitDetail = unitDetail;
      this.modalEdit = true;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.unitDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
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
    createTableRow() {
      this.modalEditLoading = true;
      createProductUnits(this.unitDetail)
        .then(res => {
          this.modalEdit = false;
          this.getTableData();
        })
        .finally(res => {
          this.modalEditLoading = false;
        });
    },
    editTableRow() {
      this.modalEditLoading = true;
      editProductUnits(this.unitDetail)
        .then(res => {
          this.modalEdit = false;
          this.getTableData();
        }).finally(() => {
          this.modalEditLoading = false;
        });
    },
    deleteTable(ids) {
      delProductUnits({
        ids
      })
        .then(res => {
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
