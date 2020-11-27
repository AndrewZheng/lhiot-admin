<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="24"
        :operate-area-column="5"
        editable
        searchable
        border
        highlight-row
        search-place="top"
        @on-view="handleView"
        @on-hand="handleReimburse"
        @on-receive="handSureReceive"
        @on-meituan="handMeituan"
        @on-current-change="onCurrentChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-show="this.$route.name != 'small-skip-order'"
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.orderCode"
              placeholder="订单编码"
              class="search-input"
              style="width: 170px"
              clearable
            ></Input>
            <Input
              v-show="this.$route.name != 'small-skip-order'"
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.phone"
              placeholder="用户手机号"
              class="search-input"
              style="width: 110px"
              clearable
            ></Input>
            <Input
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.productName"
              placeholder="商品名称"
              class="search-input"
              style="width: 120px"
              clearable
            ></Input>
            <Input
              v-show="this.$route.name != 'small-skip-order'"
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.storeName"
              placeholder="下单门店"
              class="search-input"
              style="width: 120px"
              clearable
            ></Input>
            <Input
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.storeName"
              placeholder="下单门店"
              class="search-input"
              style="width: 120px"
              clearable
            ></Input>
            <Select
              v-show="this.$route.name != 'small-skip-order'"
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.apply"
              :clearable="true"
              style="width: 110px"
              placeholder="应用类型"
            >
              <Option
                v-for="item in appTypeEnum"
                :key="`appTypeEnum-col-${item.value}`"
                :value="item.value"
                class="ml15 mt10"
                style="padding-left: 5px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-show="this.$route.name != 'small-skip-order'"
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.orderType"
              class="search-col"
              placeholder="订单类型"
              style="width: 120px"
              clearable
            >
              <Option
                v-for="item in orderType"
                :key="`orderType-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-show="this.$route.name != 'small-skip-order'"
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.receivingWay"
              class="search-col"
              placeholder="提货方式"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in receivingWayEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-show="this.$route.name != 'small-skip-order'"
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.status"
              class="search-col"
              placeholder="订单状态"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in miniOrderStatusEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-show="this.$route.name != 'small-skip-order'"
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.hdStatus"
              class="search-col"
              placeholder="海鼎状态"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in miniHdStatusEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <!-- 提货时间 -->
            <DatePicker
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.recieveStartTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="提货时间起"
              style="width: 160px; margin-top: 10px"
              @on-change="recieveStartTimeChange"
            />
            <i v-show="this.$route.name != 'small-skip-order'">-</i>
            <DatePicker
              v-show="this.$route.name != 'small-skip-order'"
              v-model="searchRowData.recieveEndTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="提货时间止"
              style="width: 160px; margin-top: 10px"
              @on-change="recieveEndTimeChange"
            />
            <RadioGroup
              v-show="this.$route.name != 'small-skip-order'"
              v-model="button"
              type="button"
              @on-change="timeChange"
            >
              <Radio label="今日"></Radio>
              <Radio label="自定义时间"></Radio>
            </RadioGroup>
            <DatePicker
              v-show="mark === true || this.$route.name == 'small-skip-order'"
              v-model="searchRowData.startTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间"
              style="width: 160px; margin-top: 10px"
              @on-change="startTimeChange"
            />
            <i
              v-show="mark === true || this.$route.name == 'small-skip-order'"
            >-</i>
            <DatePicker
              v-show="mark === true || this.$route.name == 'small-skip-order'"
              v-model="searchRowData.endTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              class="mr20"
              placeholder="结束时间"
              style="width: 160px; margin-top: 10px"
              @on-change="endTimeChange"
            />
            <Button
              v-waves
              :loading="searchLoading"
              class="search-btn"
              type="primary"
              @click="handleSearch"
            >
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button
              v-show="this.$route.name != 'small-skip-order'"
              v-waves
              :loading="clearSearchLoading"
              class="search-btn"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
            <Button
              v-show="this.$route.name == 'small-skip-order'"
              v-waves
              class="search-btn"
              type="warning"
              @click="goBack"
            >
              <Icon type="md-home" />&nbsp;返回首页
            </Button>
          </Row>
          <Row
            v-show="this.$route.name != 'small-skip-order'"
            style="float: right; margin-top: 10px"
          >
            <Button
              v-waves
              :loading="deliverOrderLoading"
              class="search-btn mr2"
              type="success"
              @click="deliverOrder"
            >
              门店调货
            </Button>
            <Button
              v-waves
              class="search-btn ml2 mr2"
              type="success"
              @click="resendToHd"
            >
              海鼎重发
            </Button>
            <!-- 多类型导出 -->
            <!-- <BookTypeOption v-model="exportType" class="mr5"/> -->
            <Button
              :loading="downloadLoading"
              class="search-btn mr2"
              type="warning"
              @click="handleDownload"
            >
              <Icon type="md-download" />导出
            </Button>
            <Button
              :loading="downloadLoading"
              class="search-btn"
              type="success"
              ghost
              @click="couponDetails"
            >
              <Icon type="md-search" />&nbsp;用券数据
            </Button>
            <Button
              :loading="downloadLoading"
              class="search-btn"
              type="success"
              ghost
              @click="monthOrder"
            >
              <Icon type="md-search" />&nbsp;跨月退款数据
            </Button>
            <!-- <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="请核实下结束时间，再确认手动退款(一次最多退20条)"
            @on-ok="handleRefund"
          >
            <Button type="error" class="mr5">
              <Icon type="md-money"/>手动退款
            </Button>
          </Poptip>-->
          </Row>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current.sync="page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>
    <!--查看订单详情-->
    <Modal v-model="modalView" :width="1000" :mask-closable="false">
      <p slot="header">
        <span>查看订单详情</span>
      </p>
      <div class="modal-content">
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                订单编号:
              </i-col>
              <i-col span="16">
                {{ orderDetail.code }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                订单状态:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.orderStatus | miniOrderStatusFilter
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                海鼎编码:
              </i-col>
              <i-col span="16">
                {{ orderDetail.hdOrderCode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                海鼎状态:
              </i-col>
              <i-col v-if="orderDetail.hdStatus === 'NOT_SEND'" span="16">
                <tag color="warning">
                  {{ "未发送" }}
                </tag>
              </i-col>
              <i-col v-else-if="orderDetail.hdStatus === 'SEND_OUT'" span="16">
                <tag color="success">
                  {{ "成功" }}
                </tag>
              </i-col>
              <i-col
                v-else-if="orderDetail.hdStatus === 'SEND_FAILURE'"
                span="16"
              >
                <tag color="error">
                  {{ "失败" }}
                </tag>
              </i-col>
              <i-col v-else-if="orderDetail.hdStatus === null" span="16">
                {{
                  "N/A"
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                收货方式:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.receivingWay | receivingWayFilters
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                海鼎备货时间:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.hdStockAt ? orderDetail.hdStockAt : "N/A"
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                订单类型:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.orderType | miniOrderTypeFilter
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                应用类型:
              </i-col>
              <i-col span="16">
                {{ orderDetail.apply | appTypeFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">
          用户信息
        </Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                下单用户:
              </i-col>
              <i-col span="16">
                {{ orderDetail.receiveUser }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                下单时间:
              </i-col>
              <i-col span="16">
                {{ orderDetail.createAt }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                下单门店:
              </i-col>
              <i-col span="16">
                {{ orderDetail.storeName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                提货截止时间:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.deliveryEndTime
                    ? orderDetail.deliveryEndTime
                    : "N/A"
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                门店编码:
              </i-col>
              <i-col span="16">
                {{ orderDetail.storeCode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                优惠券编号:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.couponId ? orderDetail.couponId : "未使用"
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">
          支付信息
        </Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                订单总额:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.totalAmount | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                优惠金额:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.couponAmount | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col v-if="orderDetail.receivingWay === 'TO_THE_HOME'" span="12">
            <Row class-name="mb10">
              <i-col span="8">
                运费:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.deliveryAmount | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                应付金额:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.amountPayable | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                是否允许退货:
              </i-col>
              <i-col span="16">
                {{
                  orderDetail.allowRefund | yesNoFilter
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                退货原因:
              </i-col>
              <i-col span="16">
                {{ orderDetail.reason }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">
          配送信息
        </Divider>

        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                收货人:
              </i-col>
              <i-col span="16">
                {{ orderDetail.receiveUser }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">
                联系方式:
              </i-col>
              <i-col span="16">
                {{ orderDetail.contactPhone }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row
          v-if="orderDetail.receivingWay === 'TO_THE_HOME'"
          style="background: lightgray; margin-bottom: 10px"
        >
          <Row>
            <i-col span="16">
              <Row class="mb10 pt5">
                <i-col span="6">
                  收货地址:
                </i-col>
                <i-col span="18">
                  {{ shippingAddress }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="16">
              <Row class-name="mb10">
                <i-col span="6">
                  配送时间段:
                </i-col>
                <i-col span="18">
                  {{
                    orderDetail.deliverTime.startTime +
                      " - " +
                      orderDetail.deliverTime.endTime
                  }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="16">
              <Row class-name="mb10">
                <i-col span="6">
                  配送状态:
                </i-col>
                <i-col
                  v-if="
                    orderDetail.deliverNote != null &&
                      deliveryStatus === 'TRANSFERING'
                  "
                  span="18"
                >
                  {{ "配送中" }}
                </i-col>
                <i-col
                  v-else-if="
                    orderDetail.deliverNote != null && deliveryStatus === 'DONE'
                  "
                  span="18"
                >
                  {{ "配送完成" }}
                </i-col>
                <i-col
                  v-else-if="
                    orderDetail.deliverNote != null &&
                      deliveryStatus === 'FAILURE'
                  "
                  span="18"
                >
                  {{ "配送失败" }}
                </i-col>
                <i-col
                  v-else-if="
                    orderDetail.deliverNote != null &&
                      deliveryStatus === 'UNRECEIVE'
                  "
                  span="18"
                >
                  {{ "未接单" }}
                </i-col>
                <i-col
                  v-else-if="
                    orderDetail.deliverNote != null &&
                      deliveryStatus === 'WAIT_GET'
                  "
                  span="18"
                >
                  {{ "待取货" }}
                </i-col>
                <i-col v-else span="8">
                  {{ "N/A" }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row span="16" class-name="mb10">
            <i-col span="4">
              配送距离(km):
            </i-col>
            <i-col
              v-if="orderDetail.deliverNote != null && distance != null"
              span="8"
            >
              {{ distance }}
            </i-col>
            <i-col v-else span="8">
              {{ "N/A" }}
            </i-col>
            <i-col span="4">
              配送重量(kg):
            </i-col>
            <i-col
              v-if="orderDetail.deliverNote != null && weight != null"
              span="8"
            >
              {{ weight }}
            </i-col>
            <i-col v-else span="8">
              {{ "N/A" }}
            </i-col>
          </Row>
          <Row span="16" class-name="mb10">
            <i-col span="4">
              配送员姓名:
            </i-col>
            <i-col
              v-if="orderDetail.deliverNote != null && deliverName != null"
              span="8"
            >
              {{ deliverName }}
            </i-col>
            <i-col v-else span="8">
              {{ "N/A" }}
            </i-col>
            <i-col span="4">
              配送员电话:
            </i-col>
            <i-col
              v-if="orderDetail.deliverNote != null && deliverPhone != null"
              span="8"
            >
              {{ deliverPhone }}
            </i-col>
            <i-col v-else span="8">
              {{ "N/A" }}
            </i-col>
          </Row>
        </Row>
        <div v-if="orderDetail.orderType === 'TEAM_BUYING'">
          <Divider orientation="center">
            拼团信息
          </Divider>
          <Row>
            <i-col span="12">
              <Row class-name="mb10">
                <i-col span="8">
                  需满员人数:
                </i-col>
                <i-col span="16">
                  {{
                    orderDetail.teamBuyOrderInfo.fullNum
                  }}
                </i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row class-name="mb10">
                <i-col span="8">
                  已支付人数:
                </i-col>
                <i-col span="16">
                  {{
                    orderDetail.teamBuyOrderInfo.paidNum
                  }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <Row class-name="mb10">
                <i-col span="8">
                  团购状态:
                </i-col>
                <i-col
                  v-if="orderDetail.teamBuyOrderInfo.status === 'tourUnpaid'"
                  span="16"
                >
                  {{ "团长未支付" }}
                </i-col>
                <i-col
                  v-else-if="orderDetail.teamBuyOrderInfo.status === 'open'"
                  span="16"
                >
                  {{ "已开团" }}
                </i-col>
                <i-col
                  v-else-if="orderDetail.teamBuyOrderInfo.status === 'full'"
                  span="16"
                >
                  {{ "已满团" }}
                </i-col>
                <i-col
                  v-else-if="orderDetail.teamBuyOrderInfo.status === 'invalid'"
                  span="16"
                >
                  {{ "已失效" }}
                </i-col>
                <i-col v-else span="16">
                  {{ "N/A" }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <tables
              v-model="orderDetail.teamBuyOrderInfo.teambuyUserList"
              :columns="teambuyUserColumn"
              border
            ></tables>
          </Row>
        </div>
        <Divider orientation="center">
          商品信息
        </Divider>
        <Row>
          <tables
            v-model="orderDetail.orderProducts"
            :columns="orderViewRelationsColumn"
            border
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">
          关闭
        </Button>
      </div>
    </Modal>
    <!-- 订单调货 -->
    <Modal v-model="transferModalView">
      <p slot="header">
        <span>订单调货</span>
      </p>
      <Row v-if="currentTableRowSelected">
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">
              订单编号:
            </i-col>
            <i-col span="16">
              {{ currentTableRowSelected.code }}
            </i-col>
          </Row>
        </i-col>
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">
              送货方式:
            </i-col>
            <i-col span="16">
              {{
                currentTableRowSelected.receivingWay | receivingWayFilters
              }}
            </i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="currentTableRowSelected">
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">
              当前门店:
            </i-col>
            <i-col span="16">
              {{
                storeList.find(
                  (item) => currentTableRowSelected.storeId === item.storeId
                ).storeName
              }}
            </i-col>
          </Row>
        </i-col>
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">
              订单状态:
            </i-col>
            <i-col span="16">
              {{
                currentTableRowSelected.orderStatus | miniOrderStatusFilter
              }}
            </i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="currentTableRowSelected">
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">
              海鼎状态:
            </i-col>
            <i-col span="16">
              {{
                currentTableRowSelected.hdStatus | miniHdStatusFilter
              }}
            </i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="currentTableRowSelected">
        <i-col span="15">
          <Row :gutter="8" type="flex" align="middle" class-name="mb10">
            <i-col span="8">
              调货门店:
            </i-col>
            <Select
              v-model="currentTableRowSelected.newStoreId"
              class="search-col mr5"
              placeholder="调货门店"
              style="width: 200px"
              clearable
            >
              <Option
                v-for="item in storeList"
                :key="`storeList-col-${item.storeId}`"
                :value="item.storeId"
                class="ptb2-5"
              >
                {{ item.storeName }}
              </Option>
            </Select>
          </Row>
        </i-col>
      </Row>
      <Row style="background: lightgray">
        <i-col span="24" style="padding-left: 15px">
          满足以下几个条件的订单才允许调货：
          <br>1.仅门店自提订单； <br>2.订单状态为待发货；
          <br>3.海鼎状态为发送成功
          <br>
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="handleEditCloseTransferModalView">
          关闭
        </Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit"
        >
          调货
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getOrderCouponDetails,
  getOrderPages,
  getOrder,
  getStorePages,
  modifyStoreInOrder,
  resendToHd,
  ordersRefund,
  refundWx,
  refundPt,
  sureReceive,
  sureMaituan
} from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  getSmallGoodsStandard
} from '@/libs/util';
import {
  receivingWayEnum,
  receivingWay,
  orderStatusEnum,
  miniOrderTypeEnum,
  appTypeEnum,
  payTypeEnum,
  miniOrderStatusEnum,
  miniOrderStatus,
  miniHdStatusEnum,
  miniHdStatus,
  isAllRefundEnum
} from '@/libs/enumerate';
import {
  orderTypeConvert,
  thirdDeliverStatusConvert,
  miniOrderStatusConvert,
  miniHdStatusConvert,
  receivingWayConvert,
  appTypeConvert,
  payTypeConvert,
  isAllRefundConvert
} from '@/libs/converStatus';
import BookTypeOption from '_c/book-type-option';

const orderDetail = {
  id: 0,
  code: '',
  userId: 0,
  apply: null,
  orderType: null,
  storeId: 0,
  storeCode: '',
  storeName: '',
  receivingWay: null,
  totalAmount: 0,
  amountPayable: 0,
  deliveryAmount: 0,
  couponAmount: 0,
  hdStatus: null,
  orderStatus: null,
  address: '',
  reason: '',
  isAllRefund: '',
  createAt: null,
  recieveTime: '',
  receiveUser: '',
  contactPhone: '',
  remark: '',
  deliveryEndTime: null,
  payType: '',
  payAt: null,
  activityTeambuyContent: '',
  hdOrderCode: '',
  orderProducts: [],
  orderFlows: [],
  allowRefund: null,
  deliverTime: {
    display: '',
    startTime: null,
    endTime: null,
    status: null
  }
};

const roleRowData = {
  phone: '',
  orderType: '',
  orderCode: '',
  apply: '',
  startTime: null,
  endTime: null,
  page: 1,
  rows: 10,
  storeName: null,
  recieveStartTime: null,
  recieveEndTime: null,
  productNames: '',
  totalOrderType: null
};

export default {
  components: {
    Tables,
    BookTypeOption
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      mark: true,
      button: '今日',
      num: 0,
      searchMark: true,
      deliverNoteList: [],
      haiDingStatus: [],
      storeList: [],
      transferModalView: false,
      modalViewLoading: false,
      deliverOrderLoading: false,
      orderType: miniOrderTypeEnum,
      orderStatus: orderStatusEnum,
      receivingWayEnum,
      receivingWay,
      isAllRefundEnum,
      appTypeEnum,
      payTypeEnum,
      miniOrderStatusEnum,
      miniOrderStatus,
      miniHdStatusEnum,
      miniHdStatus,
      shippingAddress: '',
      deliveryStatus: '',
      weight: '',
      distance: '',
      deliverName: '',
      deliverPhone: '',
      orderState: '',
      tempColumnsView: [
        {
          title: '配送方',
          minWidth: 100,
          key: 'deliverType'
        },
        {
          title: '配送距离',
          minWidth: 100,
          key: 'distance'
        },
        {
          title: '配送费',
          minWidth: 100,
          key: 'fee',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.fee);
            return <div>{amount}</div>;
          }
        },
        {
          title: '配送状态',
          minWidth: 100,
          key: 'deliverStatus',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{thirdDeliverStatusConvert(row.deliverStatus)}</div>;
          }
        },
        {
          title: '接单时间',
          minWidth: 100,
          key: 'receiveTime'
        },
        {
          title: '配送员手机号',
          minWidth: 110,
          key: 'deliverPhone'
        }
      ],
      orderViewRelationsColumn: [
        {
          title: '编码',
          key: 'barcode',
          align: 'center'
        },
        {
          title: '名称',
          align: 'center',
          key: 'productName'
        },
        {
          title: '规格',
          align: 'center',
          width: 85,
          render(h, params, vm) {
            const { row } = params;
            return <div>{row.productQty + '*' + row.standardQty}</div>;
          }
        },
        {
          title: '数量',
          align: 'center',
          width: 85,
          key: 'productQty'
        },
        {
          title: '单位',
          key: 'unitName',
          width: 85,
          align: 'center'
        },
        {
          title: '原价',
          key: 'price',
          width: 85,
          align: 'center',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: '折后价',
          align: 'center',
          width: 85,
          key: 'discountPrice',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.discountPrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: '总价',
          align: 'center',
          width: 85,
          key: 'discountPrice',
          render(h, params, vm) {
            const amount = params.row.discountPrice / 100;
            const price = amount * params.row.productQty;
            return <div>{'¥' + price.toFixed(2)}</div>;
          }
        },
        {
          title: '是否退款',
          align: 'center',
          width: 100,
          key: 'refundStatus',
          render: (h, params, vm) => {
            const orderStates = this.orderState;
            const { row } = params;
            if (row.refundStatus === 'REFUND' && orderStates === 'FAILURE') {
              return <div>未退款</div>;
            } else if (
              row.refundStatus === 'REFUND' &&
              orderStates === 'RETURNING'
            ) {
              return <div>退款中</div>;
            } else if (
              row.refundStatus === 'REFUND' &&
              orderStates === 'ALREADY_RETURN'
            ) {
              return <div>已退款</div>;
            } else if (row.refundStatus === 'NOT_REFUND') {
              return <div>未退款</div>;
            } else {
              return <div>N/A</div>;
            }
          }
        }
        // {
        //   title: "退款金额",
        //   width: 100,
        //   key: "refundFee",
        //   render(h, params, vm) {
        //     const refund = fenToYuanDot2(params.row.refundFee);
        //     return <div>{refund}</div>;
        //   }
        // }
      ],
      teambuyUserColumn: [
        {
          title: '成员ID',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '用户昵称',
          key: 'nickName',
          align: 'center'
        },
        {
          title: '联系方式',
          key: 'receiverMobile',
          align: 'center',
          width: 130
        },
        {
          title: '是否团长',
          key: 'tour',
          align: 'center',
          width: 100,
          render(h, params, vm) {
            const { row } = params;
            if (row.tour === 'yes') {
              return <div>{'是'}</div>;
            } else {
              return <div>{'否'}</div>;
            }
          }
        },
        {
          title: '参团时间',
          key: 'joinTime',
          align: 'center',
          width: 120
        },
        {
          title: '订单编码',
          key: 'orderCode',
          align: 'center',
          width: 190
        },
        {
          title: '是否支付',
          key: 'payStatus',
          align: 'center',
          width: 100,
          render(h, params, vm) {
            const { row } = params;
            if (row.payStatus === 'paid') {
              return <div>{'已支付'}</div>;
            } else if (row.payStatus === 'unpaid') {
              return <div>{'未支付'}</div>;
            } else if (row.payStatus === 'paying') {
              return <div>{'支付中'}</div>;
            } else if (row.payStatus === 'invalid') {
              return <div>{'已失效'}</div>;
            } else if (row.payStatus === 'refund') {
              return <div>{'已退款'}</div>;
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        }
      ],
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '订单编号',
          key: 'code',
          sortable: true,
          width: 190,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '应用类型',
          align: 'center',
          key: 'apply',
          width: 110,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.apply === 'WXSMALL_SHOP') {
              return (
                <div>
                  <tag color='green'>{appTypeConvert(row.apply).label}</tag>
                </div>
              );
            } else if (row.apply === 'S_MALL') {
              return (
                <div>
                  <tag color='gold'>{appTypeConvert(row.apply).label}</tag>
                </div>
              );
            } else {
              return <div>{row.apply}</div>;
            }
          }
        },
        {
          title: '支付类型',
          align: 'center',
          width: 110,
          key: 'payType',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.payType === 'weixin') {
              return (
                <div>
                  <tag color='success'>{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else if (row.payType === 'balance') {
              return (
                <div>
                  <tag color='pink'>{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else if (row.payType === 'haiding') {
              return (
                <div>
                  <tag color='warning'>{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else if (row.payType === 'points') {
              return (
                <div>
                  <tag color='pink'>{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '创建时间',
          align: 'center',
          width: 120,
          key: 'createAt'
        },
        {
          title: '提货时间',
          align: 'center',
          width: 120,
          key: 'recieveTime'
        },
        {
          title: '订单用户',
          align: 'center',
          width: 120,
          key: 'receiveUser'
        },
        {
          title: '手机号码',
          align: 'center',
          width: 130,
          key: 'contactPhone'
        },
        {
          title: '商品名称',
          align: 'center',
          minWidth: 300,
          key: 'productNames'
        },
        {
          title: '下单门店',
          align: 'center',
          width: 140,
          key: 'storeId',
          render: (h, params) => {
            const { row } = params;
            const obj = this.storeList.find(
              (item) => row.storeId === item.storeId
            );
            if (obj) {
              return h('span', obj.storeName);
            }
            return h('span', row.storeId);
          }
        },
        {
          title: '商品总价',
          align: 'center',
          width: 100,
          key: 'totalAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.totalAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '运费',
          align: 'center',
          width: 100,
          key: 'deliveryAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.deliveryAmount);
            return <div>{amount || 'N/A'}</div>;
          }
        },
        {
          title: '订单总价',
          align: 'center',
          width: 100,
          key: 'allAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(
              params.row.totalAmount + params.row.deliveryAmount
            );
            return <div>{amount || 'N/A'}</div>;
          }
        },
        {
          title: '运费',
          align: 'center',
          width: 100,
          key: 'deliveryAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.deliveryAmount);
            return <div>{amount || 'N/A'}</div>;
          }
        },
        {
          title: '订单总价',
          align: 'center',
          width: 100,
          key: 'allAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(
              params.row.totalAmount + params.row.deliveryAmount
            );
            return <div>{amount || 'N/A'}</div>;
          }
        },
        {
          title: '优惠金额',
          align: 'center',
          width: 100,
          key: 'couponAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.couponAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '优惠券金额',
          align: 'center',
          width: 110,
          key: 'couponTicketAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.couponTicketAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '应付金额',
          align: 'center',
          width: 100,
          key: 'amountPayable',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.amountPayable);
            return <div>{amount}</div>;
          }
        },
        {
          title: '活动名称',
          width: 120,
          key: 'activityTeambuyContent'
        },
        {
          title: '券名称',
          align: 'center',
          width: 150,
          key: 'couponName'
        },
        {
          title: '提货类型',
          align: 'center',
          width: 110,
          key: 'receivingWay',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.receivingWay === 'TO_THE_HOME') {
              return (
                <div>
                  <tag color='green'>
                    {receivingWayConvert(row.receivingWay)}
                  </tag>
                </div>
              );
            } else if (row.receivingWay === 'TO_THE_STORE') {
              return (
                <div>
                  <tag color='gold'>
                    {receivingWayConvert(row.receivingWay)}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.receivingWay}</div>;
            }
          }
        },
        {
          title: '是否退款',
          align: 'center',
          width: 110,
          key: 'isAllRefund',
          render: (h, params, vm) => {
            const { row } = params;
            if (
              row.isAllRefund === 'NO' &&
              row.orderStatus === 'ALREADY_RETURN'
            ) {
              return (
                <div>
                  <tag color='cyan'>{isAllRefundConvert(row.isAllRefund)}</tag>
                </div>
              );
            } else if (row.orderStatus === 'ALREADY_RETURN') {
              return (
                <div>
                  <tag color='blue'>全部退款</tag>
                </div>
              );
            } else {
              return <div>N/A</div>;
            }
          }
        },
        {
          title: '退款金额',
          align: 'center',
          width: 110,
          key: 'refundFee',
          render(h, params, vm) {
            const refund = fenToYuanDot2(params.row.refundFee);
            return <div>{refund}</div>;
          }
        },
        {
          title: '订单状态',
          align: 'center',
          width: 110,
          key: 'orderStatus',
          fixed: 'right',
          render: (h, params, vm) => {
            const { row } = params;
            // WAIT_PAYMENT("待支付"),PAYMENTING("支付中"),WAIT_SEND_OUT("待发货"),
            // SEND_OUT("已发货"),DISPATCHING("配送中"),RECEIVED("已收货"),RETURNING("退货中"),
            // ALREADY_RETURN("退货完成"),FAILURE("已失效")
            // FINISHED("已完成")
            if (
              row.orderStatus === 'WAIT_PAYMENT' ||
              row.orderStatus === 'PAYMENTING' ||
              row.orderStatus === 'WAIT_SEND_OUT'
            ) {
              return (
                <div>
                  <tag color='default'>
                    {miniOrderStatusConvert(row.orderStatus).label}
                  </tag>
                </div>
              );
            } else if (
              row.orderStatus === 'SEND_OUT' ||
              row.orderStatus === 'DISPATCHING' ||
              row.orderStatus === 'RECEIVED' ||
              row.orderStatus === 'RETURNING'
            ) {
              return (
                <div>
                  <tag color='primary'>
                    {miniOrderStatusConvert(row.orderStatus).label}
                  </tag>
                </div>
              );
            } else if (row.orderStatus === 'FAILURE' || row.orderStatus === 'EXPIRED') {
              return (
                <div>
                  <tag color='error'>
                    {miniOrderStatusConvert(row.orderStatus).label}
                  </tag>
                </div>
              );
            } else if (
              row.orderStatus === 'ALREADY_RETURN' ||
              row.orderStatus === 'FINISHED'
            ) {
              return (
                <div>
                  <tag color='success'>
                    {miniOrderStatusConvert(row.orderStatus).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.orderStatus}</div>;
            }
          }
        },
        {
          title: '海鼎状态',
          align: 'center',
          width: 100,
          fixed: 'right',
          key: 'hdStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.hdStatus === 'NOT_SEND') {
              return (
                <div>
                  <tag color='warning'>
                    {miniHdStatusConvert(row.hdStatus).label}
                  </tag>
                </div>
              );
            } else if (row.hdStatus === 'SEND_OUT') {
              return (
                <div>
                  <tag color='success'>
                    {miniHdStatusConvert(row.hdStatus).label}
                  </tag>
                </div>
              );
            } else if (row.hdStatus === 'SEND_FAILURE') {
              return (
                <div>
                  <tag color='error'>
                    {miniHdStatusConvert(row.hdStatus).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.hdStatus}</div>;
            }
          }
        },
        // {
        //   title: '海鼎备货时间',
        //   width: 160,
        //   key: 'hdStockAt',
        //   sortable: true
        // },
        // {
        //   title: '配送状态',
        //   width: 160,
        //   key: 'deliverStatus',
        //   sortable: true
        // },
        // {
        //   title: '配送距离(km)',
        //   width: 160,
        //   key: 'distance',
        //   sortable: true
        // },
        // {
        //   title: '配送重量(kg)',
        //   width: 160,
        //   key: 'weight',
        //   sortable: true
        // },
        {
          title: '操作',
          minWidth: 180,
          align: 'center',
          fixed: 'right',
          key: 'handle',
          options: ['view', 'onHand', 'onReceive', 'onMeituan']
        }
      ],
      currentTableRowSelected: null,
      searchRowData: _.cloneDeep(roleRowData),
      orderDetail: _.cloneDeep(orderDetail),
      exportType: 'xlsx',
      downloadLoading: false,
      tableDataSelected: []
    };
  },
  created() {
    this.getTableData();
    this.getStore();
  },
  methods: {
    handleSearch() {
      this.num++;
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.getTableData();
    },
    orderStatusesOnChange(value) {
      if (value.length === 0) {
        this.searchRowData.orderStatuses = null;
      }
    },
    // 提货时间
    recieveStartTimeChange(value, date) {
      this.searchRowData.recieveStartTime = value;
    },
    recieveEndTimeChange(value, data) {
      this.searchRowData.recieveEndTime = value;
    },
    handleEditCloseTransferModalView() {
      this.transferModalView = false;
    },
    handleEditClose() {
      this.modalViewLoading = false;
    },
    handleRefund() {
      if (!this.searchRowData.endTime) {
        this.$Message.error('请先选择结束时间，再手动退款');
        return false;
      }
      // 处理手动退款
      ordersRefund({ endTime: this.searchRowData.endTime }).then((res) => {
        this.resetSearchRowData();
      });
    },
    handleReimburse(params) {
      if (params.row.orderStatus === 'RETURNING') {
        this.$Message.error('退货中订单不能操作退款');
        return;
      }
      if (params.row.orderStatus === 'ALREADY_RETURN') {
        this.$Message.error('退货完成订单不能操作退款');
        return;
      }
      if (params.row.orderStatus === 'FAILURE') {
        this.$Message.error('已失效的订单不能操作退款');
        return;
      }
      // if (params.row.orderType === "POINTS_BUYING") {
      //   this.$Message.error("积分兑换的订单不能操作退款");
      //   return;
      // }
      if (params.row.apply === 'S_MALL') {
        refundPt({ orderCode: params.row.code })
          .then((res) => {
            this.loading = false;
            this.$Message.success('拼团小程序退款成功');
            this.getTableData();
          })
          .catch(() => {
            this.loading = false;
          });
      } else if (params.row.apply === 'WXSMALL_SHOP') {
        refundWx({ orderCode: params.row.code })
          .then((res) => {
            this.loading = false;
            this.$Message.success('微信小程序退款成功');
            this.getTableData();
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    // 确认收货
    handSureReceive(params) {
      if (
        params.row.orderStatus === 'SEND_OUT' ||
        params.row.orderStatus === 'DISPATCHING' ||
        params.row.orderStatus === 'RETURNING'
      ) {
        sureReceive({ orderId: params.row.id })
          .then((res) => {
            this.loading = false;
            this.$Message.success('操作成功');
            this.getTableData();
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.$Message.error('只有已发货和配送中的订单才能操作收货');
      }
    },
    // 发送美团
    handMeituan(params) {
      if (params.row.receivingWay === 'TO_THE_HOME') {
        if (
          params.row.orderStatus === 'WAIT_SEND_OUT' ||
          params.row.orderStatus === 'SEND_OUT' ||
          params.row.orderStatus === 'DISPATCHING'
        ) {
          sureMaituan({ orderCode: params.row.code })
            .then((res) => {
              this.loading = false;
              this.$Message.success('操作成功');
              this.getTableData();
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$Message.error(
            '只有待发货、已发货和配送中的订单才能操作发送美团'
          );
        }
      } else {
        this.$Message.error('只有送到家的订单才能操作发送美团');
      }
    },
    // 门店调货
    handleSubmit() {
      if (!this.currentTableRowSelected) {
        this.$Message.error(
          '请用鼠标左键点击选择下方表格一行订单数据,才能进行调货处理'
        );
        return;
      }
      if (this.currentTableRowSelected.apply != 'S_MALL') {
        this.$Message.error('该功能只适用于拼团小程序');
        return;
      }
      if (
        !this.currentTableRowSelected.storeId ||
        !this.currentTableRowSelected.newStoreId
      ) {
        this.$Message.error('该订单门店id为空');
        return;
      }
      if (
        this.currentTableRowSelected.receivingWay !== receivingWay.TO_THE_STORE
      ) {
        this.$Message.error('该订单提货方式不是门店自提！');
        return;
      }
      if (
        this.currentTableRowSelected.orderStatus !==
        miniOrderStatus.WAIT_SEND_OUT
      ) {
        this.$Message.error('该订单不为待发货！');
        return;
      }
      if (this.currentTableRowSelected.hdStatus !== miniHdStatus.SEND_OUT) {
        this.$Message.error('该订单海鼎发送没有成功！');
        return;
      }
      this.modifyStoreInOrder();
      this.currentTableRowSelected = null;
    },
    deliverOrder() {
      if (!this.currentTableRowSelected) {
        this.$Message.error(
          '请用鼠标左键点击选择下方表格一行门店自提订单数据,才能进行调货处理'
        );
        return;
      }
      this.transferModalView = true;
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.loading = true;
      getOrder({ orderCode: params.row.code })
        .then((res) => {
          this.orderDetail = res;
          let addresss = '';
          if (
            this.orderDetail.receivingWay === 'TO_THE_HOME' &&
            this.orderDetail.receivingWay != null
          ) {
            if (this.orderDetail.address.substr(0, 1) === '{') {
              addresss = JSON.parse(this.orderDetail.address);
              this.shippingAddress =
                addresss.address + addresss.detailedAddress;
            } else {
              this.shippingAddress = this.orderDetail.address;
            }
          }
          if (
            this.orderDetail.receivingWay === 'TO_THE_HOME' &&
            this.orderDetail.deliverNote != null
          ) {
            this.deliveryStatus = this.orderDetail.deliverNote.deliverStatus;
            this.distance = this.orderDetail.deliverNote.distance;
            this.weight = this.orderDetail.deliverNote.weight;
            this.deliverName = this.orderDetail.deliverNote.deliverName;
            this.deliverPhone = this.orderDetail.deliverNote.deliverPhone;
          }
          if (
            this.orderDetail != null &&
            this.orderDetail.deliverTime != '' &&
            this.orderDetail.deliverTime != null
          ) {
            this.orderDetail.deliverTime = JSON.parse(
              this.orderDetail.deliverTime
            );
          }
          this.loading = false;
          this.tempModalType = this.modalType.view;
          this.modalView = true;
          this.orderState = this.orderDetail.orderStatus;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    couponDetails(params) {
      this.turnToPage({
        name: 'small-order-coupon-details'
      });
    },
    monthOrder(params) {
      this.turnToPage({
        name: 'small-order-month-orders'
      });
    },
    // 获取数据
    getTableData() {
      this.loading = true;
      if (this.$route.name === 'small-skip-order') {
        const orderDel = getSmallGoodsStandard();
        this.searchRowData.totalOrderType = orderDel.typeCode;
        const date = new Date();
        const nowDate = new Date();
        date.setDate(date.getDate() - orderDel.queryDay + 1);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        nowDate.setDate(nowDate.getDate());
        var nowYear = nowDate.getFullYear();
        var nowMonth = nowDate.getMonth() + 1;
        var nowDay = nowDate.getDate();
        var start = `${year}-${month}-${day} 00:00:00`;
        var end = `${nowYear}-${nowMonth}-${nowDay} 23:59:59`;
        if (this.searchMark) {
          this.searchRowData.startTime = start;
          this.searchRowData.endTime = end;
        } else {
          this.searchRowData.startTime = this.$moment(
            this.searchRowData.startTime
          ).format('YYYY-MM-DD HH:mm:ss');
          this.searchRowData.endTime = this.$moment(
            this.searchRowData.endTime
          ).format('YYYY-MM-DD HH:mm:ss');
        }
      } else {
        const date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var day1 = date.getDate() + 1;
        var start = `${year}-${month}-${day} 00:00:00`;
        var end = `${year}-${month}-${day} 23:59:59`;
        if (this.button === '今日') {
          this.searchRowData.startTime = start;
          this.searchRowData.endTime = end;
        }
        this.searchRowData.startTime = this.$moment(
          this.searchRowData.startTime
        ).format('YYYY-MM-DD HH:mm:ss');
        this.searchRowData.endTime = this.$moment(
          this.searchRowData.endTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      getOrderPages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.clearSearchLoading = false;
          this.searchLoading = false;
          if (this.num < 1) {
            this.handleSearch();
          }
        })
        .catch(() => {
          this.loading = false;
          this.clearSearchLoading = false;
          this.searchLoading = false;
        });
    },
    timeChange(value) {
      if (value === '今日') {
        this.mark = true;
        this.getTableData();
      } else if (value === '自定义时间') {
        this.mark = true;
      }
    },
    startTimeChange(value, date) {
      this.searchMark = false;
      this.button = '自定义时间';
      this.searchRowData.startTime = value;
    },
    endTimeChange(value, date) {
      this.searchMark = false;
      this.button = '自定义时间';
      this.searchRowData.endTime = value;
    },
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getOrderPages(this.searchRowData).then((res) => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 20;
        this.searchRowData.page = pageSize;
        // 表格数据导出字段翻译
        const _this = this;
        tableData.forEach((item) => {
          const obj = _this.storeList.find((x) => item.storeId === x.storeId);
          item['code'] = item['code'] + '';
          item['apply'] = appTypeConvert(item['apply']).label;
          item['storeId'] =
            obj && obj.storeName ? obj.storeName : item['storeId']; // 如果找不到就显示门店Id
          item['totalAmount'] = (item['totalAmount'] / 100.0).toFixed(2);
          item['deliveryAmount'] = (item['deliveryAmount'] / 100.0).toFixed(2);
          item['couponAmount'] = (item['couponAmount'] / 100.0).toFixed(2);
          item['couponTicketAmount'] = (
            item['couponTicketAmount'] / 100.0
          ).toFixed(2);
          item['amountPayable'] = (item['amountPayable'] / 100.0).toFixed(2);
          item['refundFee'] = (item['refundFee'] / 100.0).toFixed(2);
          item['orderType'] = orderTypeConvert(item['orderType']);
          item['deliverStatus'] = thirdDeliverStatusConvert(
            item['deliverStatus']
          );
          item['orderStatus'] = miniOrderStatusConvert(
            item['orderStatus']
          ).label;
          item['hdStatus'] = miniHdStatusConvert(item['hdStatus']).label;
          item['receivingWay'] = receivingWayConvert(item['receivingWay']);
          item['status'] = miniOrderStatusConvert(item['status']).label;
          item['payType'] = payTypeConvert(item['payType']).label;
          item['isAllRefund'] = isAllRefundConvert(item['isAllRefund']);
          item['allAmount'] =
            Number(item['totalAmount']) + Number(item['deliveryAmount']);
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `普通订单信息-${date}`,
          data: tableData
        });
      });
    },
    handleSummary({ columns, data }) {
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: '合计'
          };
          return;
        }
        const values = data.map((item) => Number(item[key]));
        if (!values.every((value) => isNaN(value))) {
          const v = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[key] = {
            key,
            value: v + ' 元'
          };
        } else {
          sums[key] = {
            key,
            value: 'N/A'
          };
        }
      });
      return sums;
    },
    getStore() {
      getStorePages({ page: 1, rows: -1 })
        .then((res) => {
          this.storeList = res.rows;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    modifyStoreInOrder() {
      // TODO 未测试
      modifyStoreInOrder(this.currentTableRowSelected)
        .then((res) => {
          this.$Message.info('调货成功！');
          this.transferModalView = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    resendToHd() {
      // TODO 未测试
      if (this.tableDataSelected.length > 0) {
        const tempDeleteList = [];
        this.tableDataSelected.filter((value) => {
          tempDeleteList.push(value.id);
        });
        const ids = tempDeleteList.join(',');
        resendToHd({ ids: ids }).then((res) => {
          const { disqualification, failure } = res;
          if (failure.length === 0) {
            this.$Message.info('海鼎重发成功');
          } else {
            const lst = failure.join(',');
            this.$Message.error({
              content: `海鼎重发失败订单：${lst}`,
              duration: 30,
              closable: true
            });
          }
        });
      }
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
      if (selection.length === 1) {
        this.currentTableRowSelected = selection[0];
      } else {
        this.currentTableRowSelected = null;
      }
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
      if (selection.length === 1) {
        this.currentTableRowSelected = selection[0];
      } else {
        this.currentTableRowSelected = null;
      }
    },
    goBack() {
      this.$router.back();
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
