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
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="operations">
          <Button
            v-if="tableData.length < 1"
            v-waves
            :loading="createLoading"
            type="success"
            class="mr5"
            @click="addSystemSetting"
          >
            <Icon type="md-add" />添加
          </Button>
          <!-- <Poptip
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
          </Poptip>-->
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
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>系统参数详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                主键ID:
              </i-col>
              <i-col span="20">
                {{ systemDetail.id }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                键:
              </i-col>
              <i-col span="20">
                {{ systemDetail.indexName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                左侧主标题:
              </i-col>
              <i-col span="20">
                {{ systemDetail.indexValueTemp.titleParams[0].mainTitle }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                左侧副标题:
              </i-col>
              <i-col span="20">
                {{ systemDetail.indexValueTemp.titleParams[0].subTitle }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                左侧标题顺序:
              </i-col>
              <i-col span="20">
                {{ systemDetail.indexValueTemp.titleParams[0].order }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                左侧标题类型:
              </i-col>
              <i-col
                span="20"
              >
                {{ systemDetail.indexValueTemp.titleParams[0].type | teamBuyTypeFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                右侧主标题:
              </i-col>
              <i-col span="20">
                {{ systemDetail.indexValueTemp.titleParams[1].mainTitle }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                右侧副标题:
              </i-col>
              <i-col span="20">
                {{ systemDetail.indexValueTemp.titleParams[1].subTitle }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                右侧标题顺序:
              </i-col>
              <i-col span="20">
                {{ systemDetail.indexValueTemp.titleParams[1].order }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                右侧标题类型:
              </i-col>
              <i-col
                span="20"
              >
                {{ systemDetail.indexValueTemp.titleParams[1].type | teamBuyTypeFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                描述:
              </i-col>
              <i-col span="20">
                {{ systemDetail.description }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                分类ID:
              </i-col>
              <i-col span="20">
                {{ systemDetail.categoryId }}
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

    <Modal v-model="modalEdit" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改系统参数':'创建系统参数' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="systemDetail" :rules="ruleInline" :label-width="120">
          <Row>
            <Col span="12">
            <FormItem label="键:" prop="indexName">
              <Input
                v-model="systemDetail.indexName"
                readonly="readonly"
                placeholder="键"
                style="width: 230px"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="左侧主标题:" prop="indexValueTemp.titleParams[0].mainTitle">
              <Input
                v-model="systemDetail.indexValueTemp.titleParams[0].mainTitle"
                placeholder="左侧主标题"
                style="width: 230px"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="左侧副标题:" prop="indexValueTemp.titleParams[0].subTitle">
              <Input
                v-model="systemDetail.indexValueTemp.titleParams[0].subTitle"
                placeholder="左侧副标题"
                style="width: 230px"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="左侧标题顺序:" prop="indexValueTemp.titleParams[0].order">
              <Input
                v-model="systemDetail.indexValueTemp.titleParams[0].order"
                :readonly="modalTypeComputed"
                placeholder="键"
                style="width: 230px"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="左侧标题类型:" prop="indexValueTemp.titleParams[0].type">
              <!-- 类型不能修改，如果是新增则可以修改 -->
              <Select
                v-model="systemDetail.indexValueTemp.titleParams[0].type"
                :disabled="modalTypeComputed"
              >
                <Option
                  v-for="item in teamBuyTypeEnum"
                  :key="item.value"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="右侧主标题:" prop="indexValueTemp.titleParams[1].mainTitle">
              <Input
                v-model="systemDetail.indexValueTemp.titleParams[1].mainTitle"
                placeholder="右侧主标题"
                style="width: 230px"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="右侧副标题:" prop="indexValueTemp.titleParams[1].subTitle">
              <Input
                v-model="systemDetail.indexValueTemp.titleParams[1].subTitle"
                placeholder="右侧副标题"
                style="width: 230px"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="右侧标题顺序:" prop="indexValueTemp.titleParams[1].order">
              <Input
                v-model="systemDetail.indexValueTemp.titleParams[1].order"
                :readonly="modalTypeComputed"
                placeholder="键"
                style="width: 230px"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="右侧标题类型:" prop="indexValueTemp.titleParams[1].type">
              <Select
                v-model="systemDetail.indexValueTemp.titleParams[1].type"
                :disabled="modalTypeComputed"
              >
                <Option
                  v-for="item in teamBuyTypeEnum"
                  :key="item.value"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="描述:" prop="description">
              <Input v-model="systemDetail.description" placeholder="描述" style="width: 230px"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="分类:" prop="categoryId">
              <!-- <InputNumber :min="0" v-model="systemDetail.categoryId" placeholder="分类id"></InputNumber> -->
              <Cascader
                v-model="defaultSystemCategoryData"
                :data="systemCategoryData"
                span="21"
                style="width: 100%"
                @on-change="systemCategoryChange"
              ></Cascader>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">
          关闭
        </Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  deleteSystemSetting,
  getSystemSettingPages,
  editSystemSetting,
  createSystemSetting,
  getSystemSettingCategoryTree
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import { teamBuyTypeEnum } from '@/libs/enumerate';
import { buildMenu, convertTreeCategory } from '@/libs/util';

const systemDetail = {
  id: 0,
  indexName: 'WXSMALL_PIN_TUAN',
  indexValue: '',
  indexValueTemp: {
    titleParams: [
      {
        mainTitle: '',
        order: 1,
        subTitle: '',
        type: null
      },
      {
        mainTitle: '',
        order: 2,
        subTitle: '',
        type: null
      }
    ]
  },
  description: '',
  categoryId: 0
};

const roleRowData = {
  indexName: 'WXSMALL_PIN_TUAN',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, tableMixin],
  data() {
    return {
      systemCategoryData: [],
      defaultSystemCategoryData: [],
      systemCategoriesTreeList: [],
      teamBuyTypeEnum,
      ruleInline: {
        indexName: [{ required: true, message: '请输入键' }],
        // indexValue 查分为多条子数据
        'indexValueTemp.titleParams[0].mainTitle': [
          { required: true, message: '请输入左侧主标题' }
        ],
        'indexValueTemp.titleParams[0].subTitle': [
          { required: true, message: '请输入左侧副标题' }
        ],
        'indexValueTemp.titleParams[0].order': [
          { required: true, message: '请输入左侧标题顺序' }
        ],
        'indexValueTemp.titleParams[0].type': [
          { required: true, message: '请选择左侧标题类型' }
        ],
        'indexValueTemp.titleParams[1].mainTitle': [
          { required: true, message: '请输入右侧主标题' }
        ],
        'indexValueTemp.titleParams[1].subTitle': [
          { required: true, message: '请输入右侧副标题' }
        ],
        'indexValueTemp.titleParams[1].order': [
          { required: true, message: '请输入右侧标题顺序' }
        ],
        'indexValueTemp.titleParams[1].type': [
          { required: true, message: '请选择右侧标题类型' }
        ],
        categoryId: [
          { required: true, message: '请选择系统分类' },
          { message: '必须为非零整数', pattern: /^[1-9]\d*$/ }
        ],
        description: [{ required: true, message: '请输入描述' }]
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '键',
          align: 'center',
          key: 'indexName'
        },
        {
          title: '左侧主标题',
          align: 'center',
          key: 'indexValue',
          render: (h, params) => {
            const { row } = params;
            return <div>{row.indexValueTemp.titleParams[0].mainTitle}</div>;
          }
        },
        {
          title: '左侧副标题',
          align: 'center',
          key: 'indexValue',
          render: (h, params) => {
            const { row } = params;
            return <div>{row.indexValueTemp.titleParams[0].subTitle}</div>;
          }
        },
        {
          title: '右侧主标题',
          align: 'center',
          key: 'indexValue',
          render: (h, params) => {
            const { row } = params;
            return <div>{row.indexValueTemp.titleParams[1].mainTitle}</div>;
          }
        },
        {
          title: '右侧副标题',
          align: 'center',
          key: 'indexValue',
          render: (h, params) => {
            const { row } = params;
            return <div>{row.indexValueTemp.titleParams[1].subTitle}</div>;
          }
        },
        {
          title: '描述',
          align: 'center',
          key: 'description'
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 80,
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      systemDetail: _.cloneDeep(systemDetail)
    };
  },
  computed: {
    modalTypeComputed() {
      return this.isEdit;
    }
  },
  mounted() {
    this.getTableData();
    this.getSysSettingTree();
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
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            this.systemDetail.indexValueTemp.titleParams[0].type ===
            this.systemDetail.indexValueTemp.titleParams[1].type
          ) {
            this.$Message.error('左侧标题类型和右侧标题类型不能相同');
            return;
          }
          if (
            this.systemDetail.indexValueTemp.titleParams[0].order >
            this.systemDetail.indexValueTemp.titleParams[1].order
          ) {
            this.$Message.error('左侧标题顺序必须大于右侧标题顺序');
            return;
          }
          if (this.isCreate) {
            this.createSystemSetting();
          } else if (this.isEdit) {
            this.editSystemSetting();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createSystemSetting() {
      this.modalViewLoading = true;
      this.systemDetail.indexValue = JSON.stringify(this.systemDetail.indexValueTemp);
      createSystemSetting(this.systemDetail)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    editSystemSetting() {
      this.modalViewLoading = true;
      this.systemDetail.indexValue = JSON.stringify(this.systemDetail.indexValueTemp);
      editSystemSetting(this.systemDetail)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success('操作成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    addSystemSetting() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.systemDetail = _.cloneDeep(systemDetail);
      }
      this.modalEdit = true;
    },
    deleteTable(ids) {
      deleteSystemSetting({
        ids
      })
        .then(res => {
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
        });
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.systemDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.systemDetail = _.cloneDeep(params.row);
      this.defaultGoodsCategoryData = [];
      this.findGroupId(this.systemDetail.categoryId);
      this.defaultGoodsCategoryData.reverse();
      this.modalEdit = true;
    },
    getTableData() {
      getSystemSettingPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          if (this.tableData !== null) {
            this.tableData.forEach(element => {
              element.indexValueTemp = JSON.parse(element.indexValue);
            });
          }
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getSysSettingTree() {
      getSystemSettingCategoryTree()
        .then(res => {
          if (res && res.array.length > 0) {
            this.systemCategoriesTreeList = res.array;
            const menuList = buildMenu(res.array);
            const map = {
              id: 'id',
              title: 'title',
              children: 'children'
            };
            this.systemCategoryData = convertTreeCategory(menuList, map, true);
            this.createLoading = false;
          }
        })
        .catch(() => {
          this.createLoading = false;
        });
    },
    // 选择分类
    systemCategoryChange(value, selectedData) {
      if (selectedData.length > 0) {
        this.systemDetail.categoryId = selectedData[selectedData.length - 1].id;
      } else {
        this.systemDetail.categoryId = null;
      }
      this.defaultSystemCategoryData = selectedData;
    },
    findGroupId(id) {
      const obj = this.systemCategoriesTreeList.find(item => {
        return item.id === id;
      });
      this.defaultSystemCategoryData.push(id);
      if (obj && obj.parentid !== 0) {
        this.findGroupId(obj.parentid);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
