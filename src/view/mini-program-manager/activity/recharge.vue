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
        @on-sale="onOff"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动标题"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <DatePicker
              v-model="searchRowData.startTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间起"
              class="search-input"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间止"
              class="search-input mr5"
              style="width: 150px"
              @on-change="endTimeChange"
            />
            <Select
              v-model="searchRowData.onOff"
              placeholder="活动状态"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in imageStatusEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px"
              >{{ item.label }}</Option>
            </Select>
            <Button
              :loading="searchLoading"
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
          </Row>
          <Row>
            <div>*同一时间段请不要开启多个活动，若开启多个活动，则以最新创建活动为主</div>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addRecharge">
            <Icon type="md-add"/>创建
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash"/>删除
            </Button>
          </Poptip>
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
        <span>充值活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">{{ rechargeDetail.activityName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col span="18">{{ rechargeDetail.onOff | imageStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">{{ rechargeDetail.startTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">{{ rechargeDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建人:</i-col>
              <i-col span="18">{{ rechargeDetail.createBy }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建时间:</i-col>
              <i-col span="18">{{ rechargeDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">更新时间:</i-col>
              <i-col span="18">{{ rechargeDetail.updateTime }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" style="z-index: 1000">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改充值活动':'创建充值活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="rechargeDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="18">
              <FormItem label="活动名称:" prop="activityName">
                <Input v-model="rechargeDetail.activityName" placeholder="活动名称"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
              <FormItem label="活动状态:" prop="onOff">
                <Select v-model="rechargeDetail.onOff" clearable>
                  <Option
                    v-for="(item,index) in imageStatusEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100%"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
              <FormItem label="开启时间:" prop="startTime">
                <DatePicker
                  v-model="rechargeDetail.startTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="有效期起"
                  class="search-input"
                  style="width: 170px"
                  @on-change="startTimeChange"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
              <FormItem label="结束时间:" prop="endTime">
                <DatePicker
                  v-model="rechargeDetail.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="有效期止"
                  class="search-input"
                  style="width: 170px"
                  @on-change="endTimeChange"
                />
              </FormItem>
            </Col>
          </Row>
          <!-- <Row>
            <Col span="18">
            <FormItem label="最低立减金额:" prop="minFee">
              <InputNumber
                :min="0"
                :value="minFeeComputed"
                placeholder="最低立减金额"
                style="width: 170px"
                @on-change="minFeeInputNumberOnChange"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="最高立减金额:" prop="maxFee">
              <InputNumber
                :min="0"
                :value="maxFeeComputed"
                placeholder="最高立减金额"
                style="width: 170px"
                @on-change="maxFeeInputNumberOnChange"></InputNumber>
            </FormItem>
            </Col>
          </Row>-->
          <Row v-if="tempModalType===modalType.edit">
            <Form
              ref="modalCreate"
              :model="addRelationDetail"
              :rules="relationRuleInline"
              :label-width="80"
            >
              <Row>
                <Col span="8">
                  <FormItem label="充值金额:" prop="rechargeFee">
                    <InputNumber
                      :min="0"
                      :value="rechargeFeeComputed"
                      placeholder="充值金额"
                      @on-change="rechargeFeeInputNumberOnChange"
                    ></InputNumber>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem label="赠送金额:" prop="giveFee">
                    <InputNumber
                      :min="0"
                      :value="giveFeeComputed"
                      placeholder="赠送金额"
                      @on-change="giveFeeInputNumberOnChange"
                    ></InputNumber>
                  </FormItem>
                </Col>
                <Col span="8">
                  <Button
                    v-waves
                    :loading="addTempDataLoading"
                    span="4"
                    class="search-btn ml20"
                    type="primary"
                    @click="addTempData('modalCreate')"
                  >
                    <Icon type="md-add"/>&nbsp;添加规则
                  </Button>
                </Col>
              </Row>
            </Form>
            <Divider orientation="center">充值活动规则</Divider>
            <tables
              :columns="relationColumns"
              v-model="relationDetail"
              :loading="tempTableLoading"
              border
              @on-delete="modalHandleDelete"
              @on-inline-edit="modalHandleEdit"
              @on-inline-save="modalHandleSave"
            ></tables>
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
import Tables from "_c/tables";
import _ from "lodash";
import {
  deleteRecharge,
  getRechargePages,
  editRecharge,
  createRecharge,
  deleteRechargeRule,
  getRechargeRulePages,
  editRechargeRule,
  createRechargeRule
} from "@/api/mini-program";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import { couponStatusConvert, imageStatusConvert } from "@/libs/converStatus";
import { couponStatusEnum, imageStatusEnum } from "@/libs/enumerate";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  compareData
} from "@/libs/util";

const rechargeDetail = {
  id: 0,
  activityName: "",
  startTime: null,
  endTime: null,
  onOff: null,
  createTime: null,
  updateTime: null,
  createBy: "",
  activityRechargeRules: []
};

const relationDetail = {
  id: 0,
  activityRechargeId: 0,
  rechargeFee: 0,
  giveFee: 0,
  isEdit: false
};

const roleRowData = {
  activityName: null,
  startTime: null,
  endTime: null,
  onOff: null,
  page: 1,
  rows: 10
};

const relationRowData = {
  activityRechargeId: 0,
  page: 1,
  rows: 10
};

const relationTempColumns = [
  {
    title: "充值金额/元",
    key: "rechargeFee",
    minWidth: 100,
    render(h, params) {
      if (params.row.isEdit) {
        return h("div", [
          h("InputNumber", {
            domProps: {
              value: params.row.rechargeFee
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.rechargeFee = event;
                }
              }
            }
          })
        ]);
      } else {
        return h("div", fenToYuanDot2(params.row.rechargeFee));
      }
    }
  },
  {
    title: "赠送金额/元",
    key: "giveFee",
    minWidth: 100,
    render(h, params) {
      if (params.row.isEdit) {
        return h("div", [
          h("InputNumber", {
            domProps: {
              value: params.row.giveFee
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.giveFee = event;
                }
              }
            }
          })
        ]);
      } else {
        return h("div", fenToYuanDot2(params.row.giveFee));
      }
    }
  }
];

export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        activityName: [{ required: true, message: "请输入活动名称" }],
        // minFee: [
        //   { required: true, message: '请输入最低立减金额' },
        //   { message: '必须为大于0的数字', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/ }
        // ],
        // maxFee: [
        //   { required: true, message: '请输入最高立减金额' },
        //   { message: '必须为大于0的数字', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/ }
        // ],
        onOff: [{ required: true, message: "请选择活动状态" }],
        startTime: [{ required: true, message: "请选择开始时间" }],
        endTime: [{ required: true, message: "请选择结束时间" }]
      },
      relationRuleInline: {
        rechargeFee: [
          { required: true, message: "请输入充值金额" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        giveFee: [
          { required: true, message: "请输入赠送金额" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ]
      },
      couponStatusEnum,
      imageStatusEnum,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "主键id",
          key: "id"
        },
        {
          title: "活动名称",
          key: "activityName"
        },
        {
          title: "活动状态",
          key: "onOff",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.onOff === "ON") {
              return (
                <div>
                  <tag color="success">
                    {imageStatusConvert(row.onOff).label}
                  </tag>
                </div>
              );
            } else if (row.onOff === "OFF") {
              return (
                <div>
                  <tag color="error">{imageStatusConvert(row.onOff).label}</tag>
                </div>
              );
            }
            return <div>{row.onOff}</div>;
          }
        },
        {
          title: "活动开启时间",
          key: "startTime"
        },
        {
          title: "活动结束时间",
          key: "endTime"
        },
        {
          title: "创建人",
          key: "createBy"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "更新时间",
          key: "updateTime"
        },
        {
          title: "操作",
          minWidth: 80,
          key: "handle",
          options: ["onSale", "view", "edit", "delete"]
        }
      ],
      relationColumns: [
        ...relationTempColumns,
        {
          title: "操作",
          minWidth: 100,
          key: "handle",
          options: ["inlineEdit", "delete"]
        }
      ],
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRelationRowData: _.cloneDeep(relationRowData),
      rechargeDetail: _.cloneDeep(rechargeDetail),
      relationDetail: _.cloneDeep(relationDetail),
      addRelationDetail: _.cloneDeep(relationDetail)
    };
  },
  computed: {
    minFeeComputed() {
      return fenToYuanDot2Number(this.rechargeDetail.minFee);
    },
    maxFeeComputed() {
      return fenToYuanDot2Number(this.rechargeDetail.maxFee);
    },
    rechargeFeeComputed() {
      return fenToYuanDot2Number(this.relationDetail.rechargeFee);
    },
    giveFeeComputed() {
      return fenToYuanDot2Number(this.relationDetail.giveFee);
    }
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
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            compareData(
              this.rechargeDetail.startTime,
              this.rechargeDetail.endTime
            )
          ) {
            this.$Message.error("结束时间必须大于开始时间!");
            return;
          }
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createRecharge();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editRecharge();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createRecharge() {
      this.modalViewLoading = true;
      createRecharge(this.rechargeDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editRecharge() {
      this.modalViewLoading = true;
      editRecharge(this.rechargeDetail)
        .then(res => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addRecharge() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.rechargeDetail = _.cloneDeep(rechargeDetail);
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
      deleteRecharge({
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
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.rechargeDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      // this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.rechargeDetail = _.cloneDeep(params.row);
      this.searchRelationRowData.activityRechargeId = params.row.id;
      this.addRelationDetail.activityRechargeId = params.row.id;
      this.getRelationTableData();
      this.modalEdit = true;
    },
    getTableData() {
      getRechargePages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getRelationTableData() {
      getRechargeRulePages(this.searchRelationRowData)
        .then(res => {
          // 设置行是否可编辑
          if (res.rows.length !== 0) {
            res.rows.forEach(element => {
              element.isEdit = false;
            });
            this.relationDetail = res.rows;
          } else {
            this.relationDetail = null;
          }
          // this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    onOff(params) {
      this.rechargeDetail = this._.cloneDeep(params.row);
      if (params.row.onOff === "ON") {
        this.rechargeDetail.onOff = "OFF";
      } else {
        this.rechargeDetail.onOff = "ON";
      }
      this.loading = true;
      this.editRecharge();
    },
    startTimeChange(value, date) {
      this.rechargeDetail.startTime = value;
    },
    endTimeChange(value, date) {
      this.rechargeDetail.endTime = value;
    },
    minFeeInputNumberOnChange(value) {
      this.rechargeDetail.minFee = yuanToFenNumber(value);
    },
    maxFeeInputNumberOnChange(value) {
      this.rechargeDetail.maxFee = yuanToFenNumber(value);
    },
    modalHandleEdit(params) {
      this.$set(params.row, "isEdit", true);
    },
    modalHandleSave(params) {
      const row = params.row;
      if (row.activityRechargeId == null || row.activityRechargeId == 0) {
        this.$Message.error("充值活动不存在！请先添加充值活动");
        return;
      }
      if (
        row.id == null ||
        row.id == 0 ||
        row.rechargeFee <= 0 ||
        row.giveFee <= 0
      ) {
        this.$Message.error("请输入非0数");
        return;
      } else if (row.giveFee > row.rechargeFee) {
        this.$Message.error("赠送金额不能大于充值金额");
        return;
      }
      editRechargeRule(row)
        .then(res => {
          this.getRelationTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
      this.tempTableLoading = false;
      this.$set(params.row, "isEdit", false);
      // console.log('modalHandleSave' + JSON.stringify(params.row));
    },
    modalHandleDelete(params) {
      this.tempTableLoading = true;
      deleteRechargeRule({ ids: params.row.id })
        .then(res => {
          this.relationDetail = this.relationDetail.filter(
            (item, index) => index !== params.row.initRowIndex
          );
          this.getRelationTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
    },
    addTempData(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            this.addRelationDetail.giveFee > this.addRelationDetail.rechargeFee
          ) {
            this.$Message.error("赠送金额不能大于充值金额");
            return;
          }
          // 如果前端没有剩余数量字段,则初始化剩余数量=商品数量
          // this.addRelationDetail.remainCount = this.addRelationDetail.goodsLimit;
          this.createRelation();
        } else {
          this.$Message.error("请完善信息!");
        }
      });
      // this.createFlashsaleProductRelation(this.addRelationDetail)
    },
    createRelation() {
      this.modalViewLoading = true;
      createRechargeRule(this.addRelationDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getRelationTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    rechargeFeeInputNumberOnChange(value) {
      this.addRelationDetail.rechargeFee = yuanToFenNumber(value);
    },
    giveFeeInputNumberOnChange(value) {
      this.addRelationDetail.giveFee = yuanToFenNumber(value);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
