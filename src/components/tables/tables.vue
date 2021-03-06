<template>
  <div>
    <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top">
      <Row :gutter="24" type="flex" align="top" justify="space-between">
        <i-col :span="searchAreaColumn">
          <!-- 自带下拉搜索 -->
          <!-- <Select v-model="searchKey" class="search-col">
            <Option v-for="item in columns" v-if="item.key !== 'handle' && item.type!=='selection'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
          </Select>
          <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"></Input>
          <Button v-waves @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search"/>&nbsp;搜索</Button> -->
          <!-- 自定义搜索条件 -->
          <slot name="searchCondition"></slot>
        </i-col>
        <i-col :span="operateAreaColumn">
          <slot name="operations"></slot>
        </i-col>
      </Row>
    </div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      :show-summary="showSummary"
      :sum-text="sumText"
      :draggable="draggable"
      :tooltip-theme="tooltipTheme"
      :row-key="rowKey"
      :indent-size="indentSize"
      :context-menu="contextMenu"
      :show-context-menu="showContextMenu"
      :summary-method="summaryMethod"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot slot="header" name="header"></slot>
      <slot slot="footer" name="footer"></slot>
      <slot slot="loading" name="loading"></slot>
    </Table>
    <div v-if="searchable && searchPlace === 'bottom'" class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-show="item.key !== 'handle' && item.type!=='selection'" :key="`search-col-${item.key}`" :value="item.key">
          {{ item.title }}
        </Option>
      </Select>
      <Input v-model="searchValue" placeholder="输入关键字搜索" class="search-input"></Input>
      <Button class="search-btn" type="primary">
        <Icon type="search" />搜索
      </Button>
    </div>
    <a id="hrefToExportTable" style="display: none;width: 0px;height: 0px;"></a>
  </div>
</template>

<script>
import TablesEdit from './edit.vue';
import handleBtns from './handle-btns';
import excel from '@/libs/excel';
import zip from '@/libs/zip';
import './index.less';

export default {
  name: 'Tables',
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    width: {
      type: [Number, String],
      default: ''
    },
    height: {
      type: [Number, String],
      default: ''
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default(row, index) {
        return '';
      }
    },
    size: {
      type: String,
      default: 'default'
    },
    noDataText: {
      type: String,
      default: '暂无数据'
    },
    noFilteredDataText: {
      type: String,
      default: '暂无筛选结果'
    },
    disabledHover: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 表格是否需要按钮权限控制
     */
    needPermission: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: 'top'
    },
    searchAreaColumn: {
      type: [Number, String],
      default: 20
    },
    operateAreaColumn: {
      type: [Number, String],
      default: 4
    },
    filename: {
      type: String,
      default: '导出'
    },
    exportType: {
      type: String,
      default: 'xlsx'
    },
    draggable: {
      type: Boolean,
      default: false
    },
    tooltipTheme: {
      type: String,
      default: 'dark'
    },
    /**
     * @description 是否强制使用内置的 row-key，开启后可能会影响性能，4.1.0 支持 String
     */
    rowKey: {
      type: [Boolean, String],
      default: false
    },
    /**
     * @description v4.0.0升级-合并行或列的计算方法
     */
    spanMethod: {
      type: Function,
      default({ row, column, rowIndex, columnIndex }) {
        return;
      }
    },
    /**
     * @description v4.0.0升级-是否在表尾显示合计行
     */
    showSummary: {
      type: Boolean,
      default: false
    },
    /**
     * @description v4.0.0升级-合计行第一列的文本
     */
    sumText: {
      type: String,
      default: '合计'
    },
    /**
     * @description v4.0.0升级-自定义的合计计算方法
     */
    summaryMethod: {
      type: Function,
      default() {
        return;
      }
    },
    /**
     * @description v4.1.0升级-树形数据缩进宽度，单位 px
     */
    indentSize: {
      type: Number,
      default: 16
    },
    /**
     * @description v4.1.0升级-异步加载树形数据的方法
     */
    loadData: {
      type: Function,
      default(item, callback) {
        return;
      }
    },
    /**
     * @description v4.1.0升级-当前行点击右键是否会阻止默认行为
     */
    contextMenu: {
      type: Boolean,
      default: false
    },
    /**
     * @description v4.2.0升级-点击右键弹出菜单，需配合 slot contextMenu 一起使用，详见示例
     */
    showContextMenu: {
      type: Boolean,
      default: false
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data() {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: '',
      exportTitle: [],
      exportKey: []
    };
  },
  watch: {
    columns(columns) {
      this.handleColumns(columns);
      this.setDefaultSearchKey();
    },
    value(val) {
      this.handleTableData();
      this.handleSearch();
    }
  },
  mounted() {
    this.handleColumns(this.columns);
    this.setDefaultSearchKey();
    this.handleTableData();
  },
  methods: {
    suportEdit(item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            'input': val => {
              this.edittingText = val;
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`;
              this.$emit('on-start-edit', params);
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = '';
              this.$emit('on-cancel-edit', params);
            },
            'on-save-edit': (params) => {
              this.value[params.row.initRowIndex][params.column.key] = this.edittingText;
              this.$emit('input', this.value);
              this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }));
              this.edittingCellId = '';
            }
          }
        });
      };
      return item;
    },
    surportHandle(item) {
      const options = item.options || [];
      const insideBtns = [];
      const btnPermissions = this.btnPermissions;
      if (this.needPermission && options.length > 0 && btnPermissions.length > 0) {
        options.forEach(item => {
          if (handleBtns[item] && btnPermissions.includes(item)) insideBtns.push(handleBtns[item]);
        });
      } else {
        options.forEach(item => {
          if (handleBtns[item]) insideBtns.push(handleBtns[item]);
        });
      }
      const btns = item.button ? [].concat(insideBtns, item.button) : insideBtns;
      item.render = (h, params) => {
        params.tableData = this.value;
        return h('div', btns.map(item => item(h, params, this)));
      };
      return item;
    },
    handleColumns(columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item;
        if (res.editable) res = this.suportEdit(res, index);
        if (res.key === 'handle') res = this.surportHandle(res);
        return res;
      });
    },
    setDefaultSearchKey() {
      const columnArr = this.columns.filter(item => item.key !== 'handle' && item.key !== 'id' && item.type !== 'selection');
      this.searchKey = columnArr.length > 0 ? columnArr[0].key : '';
    },
    handleClear(e) {
      if (e.target.value === '') this.insideTableData = this.value;
    },
    handleSearch() {
      this.insideTableData = this.value.filter(item => {
        if (typeof item[this.searchKey] === 'string') {
          return item[this.searchKey].indexOf(this.searchValue) > -1;
        } else {
          return true;
        }
      });
    },
    handleTableData() {
      this.insideTableData = this.value.map((item, index) => {
        const res = item;
        res.initRowIndex = index;
        return res;
      });
    },
    exportCsv(params) {
      this.$refs.tablesMain.exportCsv(params);
    },
    exportExcel(params) {
      if (params.data.length) {
        const params1 = {
          title: this.exportTitle,
          key: this.exportKey,
          data: params.data,
          autoWidth: true,
          filename: params.filename
        };
        excel.export_array_to_excel(params1);
        // 清空数据
        this.exportTitle = [];
        this.exportKey = [];
      } else {
        this.$Message.info('表格数据不能为空！');
      }
    },
    exportZip(params) {
      const data = this.formatJson(this.exportKey, params.data);
      const params1 = {
        th: this.exportTitle,
        jsonData: data,
        txtName: params.filename,
        zipName: params.filename
      };
      zip.export_txt_to_zip(params1);
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    handleDownload(params) {
      this.columns.forEach(item => {
        if (item.key !== 'handle' && item.type !== 'selection') {
          this.exportTitle.push(item['title']);
          this.exportKey.push(item['key']);
        }
      });
      switch (this.exportType) {
        case 'xlsx':
          this.exportExcel(params);
          break;
        case 'csv':
          this.exportCsv({
            filename: params.filename
          });
          break;
        case 'zip':
          this.exportZip(params);
          break;
        default:
          this.exportExcel(params);
          break;
      }
    },
    handleCustomDownload(params) {
      params.columns.forEach(item => {
        this.exportTitle.push(item['title']);
        this.exportKey.push(item['key']);
      });
      switch (this.exportType) {
        case 'xlsx':
          this.exportExcel(params);
          break;
        case 'csv':
          this.exportCsv({
            filename: params.filename
          });
          break;
        case 'zip':
          this.exportZip(params);
          break;
        default:
          this.exportExcel(params);
          break;
      }
    },
    clearCurrentRow() {
      this.$refs.tablesMain.clearCurrentRow();
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow);
    },
    onSelect(selection, row) {
      this.$emit('on-select', selection, row);
    },
    onSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row);
    },
    onSelectAll(selection) {
      this.$emit('on-select-all', selection);
    },
    onSelectionChange(selection) {
      this.$emit('on-selection-change', selection);
    },
    onSortChange(column, key, order) {
      this.$emit('on-sort-change', column, key, order);
    },
    onFilterChange(row) {
      this.$emit('on-filter-change', row);
    },
    onRowClick(row, index) {
      this.$emit('on-row-click', row, index);
    },
    onRowDblclick(row, index) {
      this.$emit('on-row-dblclick', row, index);
    },
    onExpand(row, status) {
      this.$emit('on-expand', row, status);
    }
  }
};
</script>
