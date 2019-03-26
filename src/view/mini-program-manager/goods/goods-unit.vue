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
            :searchLoading="searchLoading"
            class="search-btn mr5"
            type="primary"
            @click="handleSearch"
          >
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button
            v-waves
            :loading="clearSearchLoading"
            class="search-btn"
            type="info"
            @click="handleClear"
          >
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="handleAdd">
            <Icon type="md-add"/>
            新增
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash"/>
              删除
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

    <Modal v-model="modalEdit">
      <p slot="header">
        <span>{{ unitDetail.id == ''?'创建商品单位':'编辑商品单位' }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
        <Form ref="modalEdit" :label-width="100" :model="unitDetail" :rules="ruleInline">
          <Row>
            <FormItem label="单位名称:" prop="unitName">
              <Input v-model="unitDetail.unitName" placeholder="请输入单位名称"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="是否可拆分:" prop="splitStatus">
              <Select
                v-model="unitDetail.splitStatus"
                class="search-col mr5"
                placeholder="是否可拆分"
                style="width:100px"
                clearable
              >
                <Option
                  v-for="item in splitStatus"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import { getMiniProgramProductUnitsPages, editMiniProgramProductUnits, deleteMiniProgramProductUnits, createMiniProgramProductUnits } from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';

import {
  splitConvert
} from '@/libs/converStatus';

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
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
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
          key: 'id'
        },
        {
          title: '单位名称',
          key: 'unitName'
        },
        {
          title: '是否可拆分',
          key: 'splitStatus',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{splitConvert(row.splitStatus).label}</div>;
          }
        },
        {
          title: '操作',
          key: 'handle',
          options: ['edit', 'delete']
        }
      ],
      modalViewLoading: false,
      clearSearchLoading: false,
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
      searchRowData: this._.cloneDeep(roleRowData),
      unitDetail: this._.cloneDeep(unitDetail),
      ids: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    resetFields() {
      this.$refs.modalEdit.resetFields();
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            this.createTableRow();
          } else if (this.tempModalType === this.modalType.edit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error('请完善商品单位信息!');
        }
      });
    },
    editTableRow() {
      this.modalViewLoading = true;
      editMiniProgramProductUnits(this.unitDetail).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.getTableData();
        this.resetFields();
      });
    },
    createTableRow() {
      createMiniProgramProductUnits(this.unitDetail).then(res => {
      }).finally(res => {
        this.modalEditLoading = false;
        this.modalEdit = false;
        this.getTableData();
        this.resetFields();
      });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.unitDetail = this._.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getMiniProgramProductUnitsPages(this.searchRowData).then(res => {
        // this.tableData = res.array;
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    handleAdd() {
      this.$refs.modalEdit.resetFields();
      this.tempModalType = this.modalType.create;
      this.unitDetail = unitDetail;
      this.modalEdit = true;
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteMiniProgramProductUnits({
        ids
      }).then(res => {
        const totalPage = Math.ceil(this.total / this.pageSize);
        if (this.tableData.length === this.tableDataSelected.length && this.page === totalPage && this.page !== 1) {
          this.page -= 1;
        }
        this.tableDataSelected = [];
        this.getTableData();
        this.loading = false;
      }
      ).catch(() => {
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
