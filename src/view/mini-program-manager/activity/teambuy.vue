<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="24"
        :operate-area-column="6"
        editable
        searchable
        border
        highlight-row
        search-place="top"
        @on-delete="handleDelete"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-current-change="onCurrentChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Select
              v-model="searchRowData.status"
              placeholder="状态"
              style="padding-right: 5px; width: 70px"
              clearable
              @on-change="activityStatusChange"
            >
              <Option
                v-for="(item, index) in teamBuyStatusEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px; width: 80px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.content"
              placeholder="活动内容"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <DatePicker
              v-model="searchRowData.startTimeBegin"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="有效时间起"
              class="mr5"
              style="width: 160px"
              @on-change="createTimeStartChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.startTimeEnd"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="有效时间止"
              class="mr5"
              style="width: 160px"
              @on-change="createTimeEndChange"
            />
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
            <Button
              v-waves
              :loading="createLoading"
              type="success"
              class="mr5"
              @click="addStore"
            >
              <Icon type="md-add" />添加
            </Button>
            <Button
              v-waves
              :loading="exportExcelLoading"
              type="primary"
              class="mr5"
              @click="handleDownload"
            >
              <Icon type="md-download" />导出
            </Button>
          </Row>
          <div class="ml15 mt10">
            <i style="color: red">*</i> 选中单条数据再点击添加,可复制当前数据
          </div>
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

    <Modal v-model="modalView" :mask-closable="false" :width="720">
      <p slot="header">
        <span>团购活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                团购活动编号:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.id }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动类型:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.teamBuyType | teamBuyTypeFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动名称:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.activityName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                创建时间:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动内容:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.content }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动状态:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.status | teamBuyStatusFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                排序序号:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.rank }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动banner:
              </i-col>
              <i-col span="18">
                <img :src="teambuyDetail.banner" style="width: 100%">
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                有效期起:
              </i-col>
              <i-col span="18">
                {{
                  (this.teambuyDetail.startTime = this.$moment(
                    this.teambuyDetail.startTime
                  ).format("YYYY-MM-DD HH:mm:ss"))
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <!-- {{ teambuyDetail.endTime }} -->
              <i-col span="6">
                有效期止:
              </i-col>
              <i-col span="18">
                {{
                  (this.teambuyDetail.endTime = this.$moment(
                    this.teambuyDetail.endTime
                  ).format("YYYY-MM-DD HH:mm:ss"))
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row v-if="teambuyDetail.deliveryEndTimeDay > 0">
              <i-col span="6">
                提货截止天数:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.deliveryEndTimeDay }}
              </i-col>
            </Row>
            <Row v-else>
              <i-col span="6">
                提货截止时间:
              </i-col>
              <i-col span="18">
                {{
                  (teambuyDetail.deliveryEndTime = this.$moment(
                    teambuyDetail.deliveryEndTime
                  ).format("YYYY-MM-DD HH:mm:ss"))
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                成团有效时长:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.validSeconds }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                成团人数:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.fullUserNum }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                参团信息列表:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.joinInfoStatus | teamBuyStatusFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                是否模拟成团:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.robot | teamBuyStatusFilter }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                状态多少秒:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.robotStartSecond }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                商品规格:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.standardId }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                规格描述:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.standardDesc }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                原价:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.originalPrice | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                活动价:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.activityPrice | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                成本价:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.costPrice | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                商品毛利:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.productProfitPrice | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                佣金比例:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.commissionScale + "%" }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                佣金金额:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.commissionPrice | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                团长优惠:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.tourDiscount | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                限购次数:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.triesLimit }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                库存数量:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.productNum }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                已售份数:
              </i-col>
              <i-col span="18">
                {{ teambuyDetail.saleQuantity }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                红包活动设置:
              </i-col>
              <i-col span="18">
                {{
                  teambuyDetail.rewardActivitySetting
                    | rewardActivitySettingFilter
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">
                关联门店:
              </i-col>
              <i-col span="16">
                {{ showStoreName }}
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
      :z-index="1000"
      :width="800"
      :mask-closable="false"
    >
      <p slot="header">
        <i-col>
          {{
            tempModalType === modalType.edit ? "修改团购活动" : "创建团购活动"
          }}
        </i-col>
      </p>
      <div class="modal-content">
        <Tabs v-model="step" size="small">
          <TabPane label="商品规格" name="firstStep">
            <Form
              ref="editForm"
              :model="teambuyDetail"
              :rules="ruleInline"
              :label-width="140"
            >
              <Row v-show="tempModalType === modalType.edit">
                <i-col span="12">
                  <FormItem label="团购ID:" prop="id">
                    {{ teambuyDetail.id }}
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="创建时间:" prop="createTime">
                    {{ teambuyDetail.createTime }}
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="活动名称:" prop="activityName">
                    <Input
                      v-model="teambuyDetail.activityName"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                      style="width: 200px"
                    ></Input>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="活动类型:" prop="teamBuyType">
                    <Select
                      v-model="teambuyDetail.teamBuyType"
                      style="width: 200px"
                      :disabled="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
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
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="活动内容:" prop="content">
                    <Input
                      v-model="teambuyDetail.content"
                      style="width: 200px"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                    ></Input>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="活动状态:" prop="status">
                    <Select v-model="teambuyDetail.status" style="width: 200px">
                      <Option
                        v-for="item in activityStatus"
                        :key="item.value"
                        :value="item.value"
                        :disabled="
                          tempModalType === modalType.create &&
                            item.value == 'expire'
                        "
                        class="ptb2-5"
                        style="padding-left: 5px"
                      >
                        {{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem
                    :label-width="130"
                    label="活动Banner 推荐尺寸750*304(单位:px):"
                    prop="banner"
                  >
                    <Input
                      v-show="false"
                      v-model="teambuyDetail.banner"
                      style="width: auto"
                    ></Input>
                    <div
                      v-for="item in uploadListMain"
                      :key="item.url"
                      class="demo-upload-list"
                    >
                      <template v-if="item.status === 'finished'">
                        <div>
                          <img :src="item.url">
                          <div class="demo-upload-list-cover">
                            <Icon
                              type="ios-eye-outline"
                              @click.native="handleUploadView(item)"
                            ></Icon>
                            <Icon
                              type="ios-trash-outline"
                              @click.native="handleRemoveMain(item)"
                            ></Icon>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <Progress
                          v-if="item.showProgress"
                          :percent="item.percentage"
                          hide-info
                        ></Progress>
                      </template>
                    </div>
                    <IViewUpload
                      ref="uploadMain"
                      :default-list="defaultListMain"
                      :image-size="imageSize"
                      group-type="activity_image"
                      file-dir="activity"
                      @on-success="handleSuccessMain"
                    >
                      <div
                        slot="content"
                        style="width: 58px; height: 58px; line-height: 58px"
                      >
                        <Icon type="ios-camera" size="20"></Icon>
                      </div>
                    </IViewUpload>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="有效期起:" prop="startTime">
                    <DatePicker
                      v-model="teambuyDetail.startTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="有效期起"
                      class="search-input"
                      style="width: 200px"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                      @on-change="startTimeChange"
                    />
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="有效期止:" prop="endTime">
                    <DatePicker
                      v-model="teambuyDetail.endTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="有效期止"
                      class="search-input"
                      style="width: 200px"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                      @on-change="endTimeChange"
                    />
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="提货截止时间类型:" prop="validDateType">
                    <Select
                      v-model="teambuyDetail.validDateType"
                      placeholder="券有效期类型"
                      style="width: 205px"
                      :disabled="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                    >
                      <Option
                        v-for="(item, index) in validDateTypeEnum"
                        :key="index"
                        :value="item.value"
                        class="ptb2-5"
                        style="width: 205px"
                        @click.native="selectValidDateType(item.value)"
                      >
                        {{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                </i-col>
                <i-col
                  v-if="
                    this.showValidDate ||
                      teambuyDetail.validDateType == 'FIXED_DATE'
                  "
                  span="12"
                >
                  <FormItem label="提货截止时间:" prop="deliveryEndTime">
                    <DatePicker
                      v-model="teambuyDetail.deliveryEndTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="提货截止时间"
                      class="search-input"
                      style="width: 200px"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                      @on-change="deliveryEndTimeChange"
                    />
                  </FormItem>
                </i-col>
                <i-col v-else span="12">
                  <FormItem label="提货截止天数:" prop="deliveryEndTimeDay">
                    <InputNumber
                      v-model="teambuyDetail.deliveryEndTimeDay"
                      :min="0"
                      label="提货截止天数"
                      style="width: 160px"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                    ></InputNumber>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="成团人数:" prop="fullUserNum">
                    <InputNumber
                      v-model="teambuyDetail.fullUserNum"
                      :min="0"
                      style="width: 200px"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="成团有效时长:" prop="validSeconds">
                    <!-- TODO 后期插件修改 -->
                    <!-- <TimePicker type="time" placeholder="成团有效时长" style="width: 200px" @on-change=""></TimePicker> -->
                    <InputNumber
                      v-model="teambuyDetail.hour"
                      :min="0"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                      style="width: 60px"
                      @on-change="validSecondsChange"
                    ></InputNumber>&nbsp;时
                    <InputNumber
                      v-model="teambuyDetail.minute"
                      :min="0"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                      style="width: 60px"
                      @on-change="validSecondsChange"
                    ></InputNumber>&nbsp;分
                    <InputNumber
                      v-model="teambuyDetail.second"
                      :min="0"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                      style="width: 60px"
                      @on-change="validSecondsChange"
                    ></InputNumber>&nbsp;秒
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="是否模拟成团:" prop="robot">
                    <Select v-model="teambuyDetail.robot" style="width: 200px">
                      <Option
                        v-for="item in teamBuyStatus"
                        :key="item.value"
                        :value="item.value"
                        class="ptb2-5"
                        style="padding-left: 5px"
                      >
                        {{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="参团信息列表:" prop="joinInfoStatus">
                    <Select
                      v-model="teambuyDetail.joinInfoStatus"
                      style="width: 200px"
                    >
                      <Option
                        v-for="item in teamBuyStatus"
                        :key="item.value"
                        :value="item.value"
                        :disabled="item.value == 'expire'"
                        class="ptb2-5"
                        style="padding-left: 5px"
                      >
                        {{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="商品规格:" prop="standardId">
                    <Input
                      v-model="teambuyDetail.standardId"
                      readonly="readonly"
                      style="width: 200px"
                    >
                    <Button
                      v-show="tempModalType !== modalType.edit"
                      slot="append"
                      icon="ios-search"
                      @click="handleRelation"
                    ></Button>
                    </Input>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="多少秒后虚位补齐:" prop="robotStartSecond">
                    <Input
                      v-model="teambuyDetail.robotStartSecond"
                      style="width: 200px"
                    ></Input>
                  </FormItem>
                </i-col>
              </Row>
              <Row v-show="teambuyDetail.standardId">
                <i-col span="6" style="margin-left: 140px">
                  <Button v-waves type="warning" @click="aboutGoods">
                    关联商品详情
                  </Button>
                </i-col>
                <i-col span="8" style="margin-left: 53px">
                  <FormItem label="原价:" prop="originalPrice">
                    {{ teambuyDetail.originalPrice | fenToYuanDot2Filters }}
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="活动价:" prop="activityPrice">
                    <InputNumber
                      :min="0"
                      :value="activityPriceComputed"
                      placeholder="活动价"
                      style="width: 200px"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                      @on-change="activityPriceInputNumberOnchange"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="团长优惠:" prop="tourDiscount">
                    <InputNumber
                      :min="0"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                      :value="tourDiscountComputed"
                      placeholder="团长优惠"
                      style="width: 200px"
                      @on-change="tourDiscountInputNumberOnchange"
                    ></InputNumber>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <!-- <i-col span="12">
                  <FormItem label="成本价:" prop="costPrice">
                    <InputNumber
                      :min="0"
                      readonly
                      :value="costPriceComputed"
                      @on-change="costPriceInputNumberOnchange"
                      style="width: 200px"
                    ></InputNumber>
                  </FormItem>
                </i-col> -->
                <i-col span="12">
                  <FormItem label="成本价:" prop="costPrice">
                    {{ teambuyDetail.costPrice | fenToYuanDot2Filters }}
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="商品毛利:" prop="productProfitPrice">
                    {{
                      teambuyDetail.productProfitPrice | fenToYuanDot2Filters
                    }}
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <p style="color: #ff3861; margin-left: 58px">
                  * 佣金比例为0~50的整数 (单位%)　　　　　　　　　　　　 *
                  按活动价的比例计算佣金
                </p>
                <i-col span="12">
                  <FormItem label="佣金比例:" prop="commissionScale">
                    <InputNumber
                      v-model="teambuyDetail.commissionScale"
                      :min="0"
                      :readonly="
                        tempModalType === modalType.edit &&
                          teambuyDetail.status === 'on'
                      "
                      style="padding-right: 5px; width: 200px"
                      @on-change="commissionScaleOnchange"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="佣金金额:" prop="commissionPrice">
                    {{ "¥" + teambuyDetail.commissionPrice / 100 }}
                  </FormItem>
                </i-col>
              </Row>
              <Divider v-show="tempModalType === modalType.edit">
                可修改部分
              </Divider>
              <Row>
                <i-col span="12">
                  <FormItem label="规格描述:" prop="standardDesc">
                    <Input
                      v-model="teambuyDetail.standardDesc"
                      style="width: 585px"
                    ></Input>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="排序序号:" prop="rank">
                    <InputNumber
                      v-model="teambuyDetail.rank"
                      style="width: 200px"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="限购份数:" prop="triesLimit">
                    <InputNumber
                      v-model="teambuyDetail.triesLimit"
                      :min="0"
                      style="width: 200px"
                      placeholder="默认999"
                    ></InputNumber>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="库存数量:" prop="productNum">
                    <InputNumber
                      v-model="teambuyDetail.productNum"
                      placeholder="库存数量"
                      style="width: 200px"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="已售份数:" prop="saleQuantity">
                    <InputNumber
                      v-model="teambuyDetail.saleQuantity"
                      :min="0"
                      style="width: 200px"
                    ></InputNumber>
                  </FormItem>
                </i-col>
              </Row>
            </Form>
          </TabPane>
          <TabPane label="关联门店" :disabled="firstSuccess" name="secondStep">
            <Form
              ref="editFormSecond"
              :model="teambuyDetail"
              :rules="ruleInline"
              :label-width="130"
            >
              <Row>
                <i-col span="12">
                  <FormItem label="红包活动设置:" prop="rewardActivitySetting">
                    <Select
                      v-model="teambuyDetail.rewardActivitySetting"
                      style="width: 200px"
                    >
                      <Option
                        v-for="item in rewardActivitySettingEnum"
                        :key="item.value"
                        :value="item.value"
                        class="ptb2-5"
                        style="padding-left: 5px"
                      >
                        {{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="关联门店:">
                    <Select
                      v-model="teambuyDetail.relationStoreType"
                      style="width: 200px"
                    >
                      <Option
                        v-for="item in relationStoreTypeEnum"
                        :key="item.value"
                        :value="item.value"
                        class="ptb2-5"
                        style="padding-left: 5px"
                        @click.native="selectStore(item)"
                      >
                        {{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                </i-col>
                <i-col v-show="showStoreList" span="12">
                  <FormItem
                    :label-width="85"
                    label="所属城市:"
                    prop="cityCode"
                  >
                    <Select
                      v-model="teambuyDetail.cityCode"
                      style="width: 220px"
                      @on-change="handleCitySwitch"
                    >
                      <Option
                        v-for="(item, index) in cityList"
                        :key="index"
                        :value="item.cityCode"
                        class="ptb2-5"
                        style="padding-left: 5px"
                      >
                        {{ item.cityName }}
                      </Option>
                    </Select>
                  </FormItem>
                </i-col>
              </Row>
              <Row v-show="showStoreList">
                <i-col v-if="storeData.length>0" span="24">
                  <FormItem>
                    <div
                      class="bottom-line"
                    >
                      <div style="margin-left: -54px; margin-right: 18px">
                        {{ storeNameList[0] }}
                      </div>
                      <Checkbox
                        :indeterminate="indeterminate"
                        :value="checkAll"
                        @click.prevent.native="handleCheckAll(0)"
                      >
                        全选/反选
                      </Checkbox>
                    </div>
                    <CheckboxGroup
                      v-model="storeIds"
                      @on-change="checkAllGroupChange"
                    >
                      <Checkbox
                        v-for="item in storeData"
                        ref="checkBox"
                        :key="item.storeId"
                        :label="item.storeId"
                      >
                        {{ item.storeName }}
                      </Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </i-col>
                <i-col v-if="storeData1.length>0" span="24">
                  <FormItem>
                    <div
                      class="bottom-line"
                    >
                      <div style="margin-left: -54px; margin-right: 18px">
                        {{ storeNameList[1] }}
                      </div>
                      <Checkbox
                        :indeterminate="indeterminate1"
                        :value="checkAll1"
                        @click.prevent.native="handleCheckAll(1)"
                      >
                        全选/反选
                      </Checkbox>
                    </div>
                    <CheckboxGroup
                      v-model="storeIds"
                      @on-change="checkAllGroupChange1"
                    >
                      <Checkbox
                        v-for="item in storeData1"
                        ref="checkBox"
                        :key="item.storeId"
                        :label="item.storeId"
                      >
                        {{ item.storeName }}
                      </Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </i-col>
                <i-col v-if="storeData2.length>0" span="24">
                  <FormItem>
                    <div
                      class="bottom-line"
                    >
                      <div style="margin-left: -54px; margin-right: 18px">
                        {{ storeNameList[2] }}
                      </div>
                      <Checkbox
                        :indeterminate="indeterminate2"
                        :value="checkAll2"
                        @click.prevent.native="handleCheckAll(2)"
                      >
                        全选/反选
                      </Checkbox>
                    </div>
                    <CheckboxGroup
                      v-model="storeIds"
                      @on-change="checkAllGroupChange2"
                    >
                      <Checkbox
                        v-for="item in storeData2"
                        ref="checkBox"
                        :key="item.storeId"
                        :label="item.storeId"
                      >
                        {{ item.storeName }}
                      </Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </i-col>
                <i-col v-if="storeData3.length>0" span="24">
                  <FormItem>
                    <div
                      class="bottom-line"
                    >
                      <div style="margin-left: -54px; margin-right: 18px">
                        {{ storeNameList[3] }}
                      </div>
                      <Checkbox
                        :indeterminate="indeterminate3"
                        :value="checkAll3"
                        @click.prevent.native="handleCheckAll(3)"
                      >
                        全选/反选
                      </Checkbox>
                    </div>
                    <CheckboxGroup
                      v-model="storeIds"
                      @on-change="checkAllGroupChange3"
                    >
                      <Checkbox
                        v-for="item in storeData3"
                        ref="checkBox"
                        :key="item.storeId"
                        :label="item.storeId"
                      >
                        {{ item.storeName }}
                      </Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </i-col>
                <i-col v-if="storeData4.length>0" span="24">
                  <FormItem>
                    <div
                      class="bottom-line"
                    >
                      <div style="margin-left: -54px; margin-right: 18px">
                        {{ storeNameList[4] }}
                      </div>
                      <Checkbox
                        :indeterminate="indeterminate4"
                        :value="checkAll4"
                        @click.prevent.native="handleCheckAll(4)"
                      >
                        全选/反选
                      </Checkbox>
                    </div>
                    <CheckboxGroup
                      v-model="storeIds"
                      @on-change="checkAllGroupChange4"
                    >
                      <Checkbox
                        v-for="item in storeData4"
                        ref="checkBox"
                        :key="item.storeId"
                        :label="item.storeId"
                      >
                        {{ item.storeName }}
                      </Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </i-col>
                <i-col v-if="storeData5.length>0" span="24">
                  <FormItem>
                    <div
                      class="bottom-line"
                    >
                      <div style="margin-left: -54px; margin-right: 18px">
                        {{ storeNameList[5] }}
                      </div>
                      <Checkbox
                        :indeterminate="indeterminate5"
                        :value="checkAll5"
                        @click.prevent.native="handleCheckAll(5)"
                      >
                        全选/反选
                      </Checkbox>
                    </div>
                    <CheckboxGroup
                      v-model="storeIds"
                      @on-change="checkAllGroupChange5"
                    >
                      <Checkbox
                        v-for="item in storeData5"
                        ref="checkBox"
                        :key="item.storeId"
                        :label="item.storeId"
                      >
                        {{ item.storeName }}
                      </Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </i-col>
                <i-col v-if="storeData6.length>0" span="24">
                  <FormItem>
                    <div
                      class="bottom-line"
                    >
                      <div style="margin-left: -54px; margin-right: 18px">
                        {{ storeNameList[6] }}
                      </div>
                      <Checkbox
                        :indeterminate="indeterminate6"
                        :value="checkAll6"
                        @click.prevent.native="handleCheckAll(6)"
                      >
                        全选/反选
                      </Checkbox>
                    </div>
                    <CheckboxGroup
                      v-model="storeIds"
                      @on-change="checkAllGroupChange6"
                    >
                      <Checkbox
                        v-for="item in storeData6"
                        ref="checkBox"
                        :key="item.storeId"
                        :label="item.storeId"
                      >
                        {{ item.storeName }}
                      </Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </i-col>
              </Row>
            </Form>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">
          关闭
        </Button>
        <!-- <Button :loading="modalViewLoading" type="primary" @click="handleSubmit">确定</Button>-->
        <Button
          v-if="step == 'firstStep'"
          :loading="modalViewLoading"
          type="primary"
          @click="handlefirstStep('editForm')"
        >
          下一步
        </Button>
        <Button
          v-else
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit('editFormSecond')"
        >
          确定
        </Button>
      </div>
    </Modal>

    <Modal v-model="modalProduct" :width="1200" title="关联商品" footer-hide>
      <Card>
        <tables
          ref="products"
          v-model="productData"
          :columns="productColumns"
          :loading="loading"
          editable
          searchable
          border
          search-place="top"
          @on-row-click="onRowClick"
        >
          <div slot="searchCondition">
            <Row>
              <Input
                v-model="searchProductRowData.productCode"
                placeholder="商品编码"
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
                :search-loading="searchLoading"
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
                @click="handleProductClear"
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
              @on-change="changeProductPage"
              @on-page-size-change="changeProductPageSize"
            ></Page>
          </Row>
        </div>
      </Card>
    </Modal>

    <!-- 商品规格展示 -->
    <Modal v-model="modalGoodsStandard" :mask-closable="false" :width="700">
      <p slot="header">
        <span>商品规格详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品ID:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.productId }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品名称:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.baseProductName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品分类:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.groupName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                基础单位:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.baseUnit }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品编号:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.productCode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品条码:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.baseBarcode }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品主图:
              </i-col>
              <i-col span="16">
                <img
                  :src="productStandardDetail.baseImage"
                  width="100"
                  height="100"
                >
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品描述:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.baseProductDescription }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">
          商品规格
        </Divider>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                上架商品名称:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.productName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                上架商品描述:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.productDescription }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                上架商品主图:
              </i-col>
              <i-col v-if="productStandardDetail.image" span="16">
                <img
                  :src="productStandardDetail.image"
                  width="100"
                  height="100"
                >
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品条码:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.barcode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品状态:
              </i-col>
              <i-col span="16">
                {{
                  productStandardDetail.shelvesStatus | customPlanStatusFilters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品规格:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.specification }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                数量/重量:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.standardQty }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品原价:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.price | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                售卖价格:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.salePrice | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">SVIP价格:</i-col>
              <i-col span="16">{{ productStandardDetail.svipPrice | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>-->

        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品单位:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.productUnit }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                商品排序:
              </i-col>
              <i-col span="16">
                {{ productStandardDetail.rank }}
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleGoodsClose">
          关闭
        </Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import config from '@/config';
import IViewUpload from '_c/iview-upload';

import {
  deleteTeamBuy,
  getTeamBuyPages,
  editTeamBuy,
  createTeamBuy,
  getAreaStorePages,
  getProductStandardsPages,
  getStorePages,
  getStoreCityPages,
  deletePicture,
  getGoodsStandard
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  teamBuyStatusConvert,
  customPlanStatusConvert,
  expandTypeConvert
} from '@/libs/converStatus';
import {
  teamBuyStatusEnum,
  teamBuyTypeEnum,
  rewardActivitySettingEnum,
  relationStoreTypeEnum,
  expandTypeEnum
} from '@/libs/enumerate';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  compareData,
  secondsToDate,
  compareCouponData
} from '@/libs/util';

const teambuyDetail = {
  remainingProductNum: 0,
  triesLimit: 999, // 默认限购次数999
  teamGuaranteeURL: '',
  storeId: 0,
  storeIds: null,
  singleTeambuyPrice: null,
  originalPrice: 0,
  saleQuantity: 0,
  createTime: '',
  costPrice: 0,
  productProfitPrice: 0,
  commissionScale: 0,
  commissionPrice: 0,
  teamBuyType: 'ORDINARY_TEAM', // 默认普通团
  teamBuyNum: 0,
  rewardActivitySetting: 'DISABLE', // 默认红包活动关闭
  joinInfoStatus: 'on', // 默认参团信息列表状态开启
  teamResultEnum: null,
  id: 0,
  activityName: '',
  content: '',
  status: 'off', // 默认活动关闭
  rank: 0,
  startTime: null,
  endTime: null,
  deliveryEndTime: null,
  deliveryStartTime: null,
  deliveryEndTimeDay: null,
  banner: '',
  totalNum: 0,
  activityPrice: 0,
  tourDiscount: 0,
  fullUserNum: 0,
  standardId: 0,
  validSeconds: null,
  standardDesc: '',
  fullTeambuyCount: 0,
  robot: 'off', // 默认关闭模拟成团
  teamBuys: null,
  productStandard: null,
  leftTime: '',
  productNum: 0,
  robotStartSecond: 0,
  hour: null,
  minute: null,
  second: null,
  relationStoreType: 'ALL',
  validDateType: 'FIXED_DATE',
  cityCode: '0731'
};

const roleRowData = {
  status: 'on',
  activityName: null,
  startTimeBegin: null,
  startTimeEnd: null,
  page: 1,
  rows: 10,
  sidx: 'rank',
  sort: 'asc',
  content: ''
};

const productStandardDetail = {
  id: 0,
  productId: 0,
  barcode: '',
  specification: '',
  standardQty: 0,
  unitId: 0,
  productUnit: '',
  price: 0,
  salePrice: 0,
  rank: 0,
  description: null,
  shelvesStatus: null,
  applyType: '',
  productName: '',
  createUser: null,
  image: null,
  productDescription: '',
  productCode: '',
  baseProductName: '',
  baseProductDescription: '',
  groupId: 0,
  groupName: '',
  sourceCode: '',
  baseImage: '',
  smallImage: '',
  largeImage: '',
  status: '',
  baseUnitId: 0,
  baseUnit: '',
  baseBarcode: '',
  hdSkuid: '',
  videoUrl: '',
  videoImage: '',
  baseQty: 0,
  limitQty: 0,
  queryStatus: null,
  invEnough: null,
  invNum: null,
  saleCount: null,
  positionName: null,
  dbId: null
};

const productRowData = {
  productId: '',
  productType: 'TEAM_BUY_PRODUCT',
  barcode: '',
  productCode: '',
  productName: '',
  shelvesStatus: 'VALID',
  minPrice: '',
  maxPrice: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {

      defaultListMain: [],
      uploadListMain: [],
      activityStatus: [
        { label: '未开始', value: 'off' },
        { label: '进行中', value: 'on' },
        { label: '已结束', value: 'expire' }
      ],
      teamBuyStatus: [
        { label: '关闭', value: 'off' },
        { label: '开启', value: 'on' }
      ],
      validDateTypeEnum: [
        {
          label: '绝对时间',
          value: 'FIXED_DATE'
        },
        {
          label: '相对时间',
          value: 'UN_FIXED_DATE'
        }
      ],
      teamBuyStatusEnum,
      teamBuyTypeEnum,
      expandTypeEnum,
      rewardActivitySettingEnum,
      relationStoreTypeEnum,
      groupStatus: '',
      modalGoodsStandard: false,
      isEnvironment: null,
      flagShipList: [],
      storeNameList: [],
      allStoreList: [],
      cityList: [],
      storeList: [],
      storeData: [],
      storeData1: [],
      storeData2: [],
      storeData3: [],
      storeData4: [],
      storeData5: [],
      storeData6: [],
      storeData7: [],
      storeIds: [],
      storeListData: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      productStandardDetail: [],
      productData: [],
      productTotal: 0,
      loading: true,
      showStoreName: '',
      modalProduct: false,
      createLoading: false,
      modalViewLoading: false,
      exportExcelLoading: false,
      showStoreList: false,
      showValidDate: true,
      indeterminate: false,
      indeterminate1: false,
      indeterminate2: false,
      indeterminate3: false,
      indeterminate4: false,
      indeterminate5: false,
      indeterminate6: false,
      indeterminate7: false,
      checkAll: false,
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkAll4: false,
      checkAll5: false,
      checkAll6: false,
      checkAll7: false,
      step: 'firstStep',
      firstSuccess: true,
      currentTableRowSelected: null,
      tableDataSelected: [],
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center",
        //   fixed: "left"
        // },
        {
          title: '活动名称',
          key: 'activityName',
          align: 'center',
          fixed: 'left',
          minWidth: 200
        },
        {
          title: '活动状态',
          align: 'center',
          key: 'status',
          minWidth: 100,
          render: (h, params) => {
            const { row } = params;
            if (row.status == 'on') {
              return (
                <div>
                  <tag color='success'>
                    {teamBuyStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status == 'off') {
              return (
                <div>
                  <tag color='error'>
                    {teamBuyStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status == 'expire') {
              return (
                <div>
                  <tag color='warning'>
                    {teamBuyStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{row.status}</tag>
              </div>
            );
          }
        },
        {
          title: '活动内容',
          align: 'center',
          minWidth: 160,
          key: 'content'
        },
        {
          title: '有效期起',
          align: 'center',
          width: 120,
          key: 'startTime'
        },
        {
          title: '有效期止',
          align: 'center',
          width: 180,
          key: 'endTime',
          render(h, params) {
            if (!compareCouponData(params.row.endTime)) {
              return (
                <div style='color:red'>{params.row.endTime + '已过期'}</div>
              );
            } else {
              return <div>{params.row.endTime}</div>;
            }
          }
        },
        {
          title: '库存',
          align: 'center',
          minWidth: 80,
          key: 'productNum'
        },
        {
          title: '活动价',
          minWidth: 90,
          key: 'activityPrice',
          align: 'center',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.activityPrice)}</div>;
          }
        },
        {
          title: '成本价',
          minWidth: 90,
          key: 'costPrice',
          align: 'center',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.costPrice)}</div>;
          }
        },
        {
          title: '毛利',
          minWidth: 90,
          key: 'productProfitPrice',
          align: 'center',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.productProfitPrice)}</div>;
          }
        },
        {
          title: '佣金比例',
          minWidth: 100,
          key: 'commissionScale',
          align: 'center',
          render(h, params) {
            if (params.row.commissionScale) {
              return <div>{params.row.commissionScale + '%'}</div>;
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '佣金金额',
          minWidth: 100,
          key: 'commissionPrice',
          align: 'center',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.commissionPrice)}</div>;
          }
        },
        {
          title: '团长优惠',
          align: 'center',
          minWidth: 100,
          key: 'tourDiscount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.tourDiscount)}</div>;
          }
        },
        {
          title: '成团有效时长',
          align: 'center',
          minWidth: 130,
          key: 'validSeconds',
          render(h, params) {
            return <div>{secondsToDate(params.row.validSeconds)}</div>;
          }
        },
        {
          title: '提货截止时间/天数',
          align: 'center',
          minWidth: 180,
          key: 'deliveryEndTime',
          render: (h, params) => {
            const { row } = params;
            if (row.deliveryEndTimeDay > 0) {
              return <div>{row.deliveryEndTimeDay}天</div>;
            } else {
              return <div>{row.deliveryEndTime}</div>;
            }
          }
        },
        {
          title: '规格ID',
          align: 'center',
          minWidth: 90,
          key: 'standardId'
        },
        {
          title: '规格描述',
          align: 'center',
          minWidth: 120,
          key: 'standardDesc',
          tooltip: true
        },
        {
          title: '限购次数',
          align: 'center',
          minWidth: 100,
          key: 'triesLimit'
        },
        {
          title: '排序',
          align: 'center',
          minWidth: 70,
          key: 'rank'
        },
        {
          title: '是否模拟成团',
          align: 'center',
          minWidth: 130,
          key: 'robot',
          render: (h, params) => {
            const { row } = params;
            if (row.robot === 'on') {
              return (
                <div>
                  <tag color='success'>
                    {teamBuyStatusConvert(row.robot).label}
                  </tag>
                </div>
              );
            } else if (row.robot === 'off') {
              return (
                <div>
                  <tag color='error'>
                    {teamBuyStatusConvert(row.robot).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{row.robot}</tag>
              </div>
            );
          }
        },
        {
          title: '操作',
          minWidth: 120,
          align: 'center',
          fixed: 'right',
          key: 'handle',
          options: ['view', 'edit']
        }
      ],
      productColumns: [
        // {
        //   type: "selection",
        //   key: "",
        //   minWidth: 60,
        //   align: "center",
        //   fixed: "left"
        // },
        {
          title: '规格ID',
          align: 'center',
          key: 'id',
          minWidth: 90
        },
        {
          title: '商品条码',
          key: 'barcode',
          align: 'center',
          minWidth: 150
        },
        {
          title: '商品编号',
          key: 'productCode',
          align: 'center',
          minWidth: 150
        },
        {
          title: '商品名称',
          align: 'center',
          key: 'productName',
          minWidth: 150
        },
        {
          title: '商品类型',
          align: 'center',
          key: 'productType',
          minWidth: 130,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.productType == 'TEAM_BUY_PRODUCT') {
              return (
                <div>
                  <tag color='magenta'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else {
              return <div>N/A</div>;
            }
          }
        },
        {
          title: '规格',
          align: 'center',
          key: 'specification',
          minWidth: 80
        },
        {
          title: '单位',
          align: 'center',
          minWidth: 80,
          key: 'productUnit'
        },
        {
          title: '原价',
          align: 'center',
          minWidth: 80,
          key: 'price',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: '优惠价',
          align: 'center',
          minWidth: 80,
          key: 'salePrice',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.salePrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: '状态',
          align: 'center',
          minWidth: 80,
          key: 'shelvesStatus',
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
        },
        {
          title: '排序',
          align: 'center',
          minWidth: 70,
          key: 'rank'
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      productDetail: _.cloneDeep(productStandardDetail),
      teambuyDetail: _.cloneDeep(teambuyDetail),
      ruleInline: {
        rank: [
          { required: true, message: '请输入排序序号' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        activityName: [{ required: true, message: '请输入活动名称' }],
        teamBuyType: [{ required: true, message: '请选择活动类型' }],
        content: [{ required: true, message: '请输入活动内容' }],
        status: [{ required: true, message: '请选择活动状态' }],
        banner: [{ required: true, message: '请上传活动banner ' }],
        startTime: [{ required: true, message: '请输入有效期起' }],
        endTime: [{ required: true, message: '请输入有效期止' }],
        deliveryEndTime: [{ required: true, message: '请输入提货截止时间' }],
        validSeconds: [{ required: true, message: '请输入成团有效时长' }],
        productProfitPrice: [{ required: true, message: '商品毛利' }],
        commissionPrice: [{ required: true, message: '佣金金额' }],
        originalPrice: [{ required: true, message: '商品原价' }],
        commissionScale: [
          { required: true, message: '请输入佣金比例' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^([1-4]?\d(\.[05])?|50(\.0)?)$/.test(value)) {
                errors.push(new Error('必须为0~50的整数'));
              }
              callback(errors);
            }
          }
        ],
        fullUserNum: [
          { required: true, message: '请输入成团人数' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        costPrice: [
          { required: true, message: '请输入商品成本价' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        joinInfoStatus: [{ required: true, message: '请选择参团信息列表状态' }],
        robot: [{ required: true, message: '请选择是否模拟成团' }],
        robotStartSecond: [
          { required: true, message: '请填写状态多少秒:' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        standardId: [{ required: true, message: '请选择商品规格' }],
        standardDesc: [{ required: true, message: '请输入规格描述' }],
        activityPrice: [
          { required: true, message: '请输入商品活动价' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        tourDiscount: [{ required: true, message: '请选择团长优惠' }],
        triesLimit: [
          { required: true, message: '请输入限购次数' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        productNum: [
          { required: true, message: '请选择库存数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        saleQuantity: [
          { required: true, message: '请输入已售份数' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        // singleTeambuyPrice: [
        //   { required: true, message: "请输入单人团购价格" },
        //   {
        //     message: "必须为大于0的数字",
        //     pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
        //   }
        // ],
        rewardActivitySetting: [
          { required: true, message: '请选择红包活动设置' }
        ]
      }
    };
  },
  computed: {
    originalPriceComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.originalPrice);
    },
    activityPriceComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.activityPrice);
    },
    // singleTeambuyPriceComputed() {
    //   return fenToYuanDot2Number(this.teambuyDetail.singleTeambuyPrice);
    // },
    tourDiscountComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.tourDiscount);
    },
    costPriceComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.costPrice);
    }
  },
  watch: {
    numberInput(v) {
      if (String(v).indexOf('.') > 0) this.teambuyDetail.hour = '';
      this.$nextTick(() => {
        this.testInput = String(v).replace(/\D/g, '');
      });
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getStorePages();
    this.getStoreCityPages();
    this.getStore();
    this.getTableData();
  },
  created() {
    this.isEnvironment = config.isEnvironment;
  },
  methods: {
    getStorePages() {
      getStorePages({ rows: -1 })
        .then((res) => {
          this.allStoreList = res.rows;
        });
    },
    getStoreCityPages() {
      getStoreCityPages({
        sidx: 'id',
        sort: 'asc',
        page: 1,
        rows: -1
      })
        .then((res) => {
          this.cityList = res.rows;
        })
    },
    getStore() {
      getAreaStorePages(this.teambuyDetail.cityCode)
        .then((res) => {
          this.storeList = res.array;
          this.storeData = res.array[0] && res.array[0].storeList || [];
          this.storeData1 = res.array[1] && res.array[1].storeList || [];
          this.storeData2 = res.array[2] && res.array[2].storeList || [];
          this.storeData3 = res.array[3] && res.array[3].storeList || [];
          this.storeData4 = res.array[4] && res.array[4].storeList || [];
          this.storeData5 = res.array[5] && res.array[5].storeList || [];
          this.storeData6 = res.array[6] && res.array[6].storeList || [];
          const data = [];
          this.storeNameList = [];
          res.array.forEach(item => {
            this.storeNameList.push(item.storeName);
            data.push(item.storeList);
          });
          this.storeListData = data;
        });
    },
    handleCitySwitch() {
      // 清空上次选择的值
      this.storeCheckRest();
      // 切换城市，重新获取区域列表
      this.getStore();
    },
    costPriceInputNumberOnchange(value) {
      this.teambuyDetail.costPrice = yuanToFenNumber(value);
      this.teambuyDetail.productProfitPrice =
        this.teambuyDetail.activityPrice - this.teambuyDetail.costPrice;
    },
    commissionScaleOnchange(value) {
      this.teambuyDetail.commissionPrice = Math.floor(
        this.teambuyDetail.activityPrice * (value / 100)
      );
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.teambuyDetail.banner = null;
    },
    handlefirstStep(name) {
      const _this = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (
            _this.teambuyDetail.teamBuyType === 'OLD_AND_NEW' &&
            _this.teambuyDetail.fullUserNum <= 1
          ) {
            _this.$Message.error('老带新团成团人数必须大于1');
            return;
          }
          if (_this.teambuyDetail.validDateType === 'FIXED_DATE') {
            _this.teambuyDetail.deliveryEndTimeDay = 0;
          } else {
            _this.teambuyDetail.deliveryEndTime = null;
          }
          if (
            compareData(
              _this.teambuyDetail.startTime,
              _this.teambuyDetail.endTime
            )
          ) {
            _this.$Message.error('结束时间必须大于开始时间!');
            return;
          }
          if (
            compareData(
              _this.teambuyDetail.endTime,
              _this.teambuyDetail.deliveryEndTime
            )
          ) {
            _this.$Message.error('提货截止时间必须大于有效期止时间!');
            return;
          }
          if (
            _this.teambuyDetail.robotStartSecond >
            _this.teambuyDetail.validSeconds
          ) {
            _this.$Message.error('虚位补齐时间不能超过成团有效时长!');
            return;
          }
          if (
            parseInt(_this.teambuyDetail.productNum) %
              parseInt(_this.teambuyDetail.fullUserNum) !==
            0
          ) {
            _this.$Message.error('商品份额必须被成团人数整除!');
            return;
          }
          // if (
          //   _this.teambuyDetail.productNum < _this.teambuyDetail.fullUserNum
          // ) {
          //   _this.$Message.error("库存数量不能小于成团人数!");
          //   return;
          // }
          if (
            _this.teambuyDetail.tourDiscount >=
            _this.teambuyDetail.activityPrice
          ) {
            _this.$Message.error('团长优惠不能大于等于活动金额!');
            return;
          }
          var numRe = new RegExp(/^[0-9]+$/);
          if (!numRe.test(_this.teambuyDetail.validSeconds)) {
            _this.$Message.error('成团有效时长不能为小数');
            return;
          }
          this.step = 'secondStep';
          this.firstSuccess = false;
        } else {
          _this.$Message.error('请完善信息!');
        }
      });
    },
    handleSubmit(name) {
      const _this = this;
      if (
        _this.teambuyDetail.relationStoreType === 'PART' &&
        (_this.teambuyDetail.storeIds == null ||
          _this.teambuyDetail.storeIds == '')
      ) {
        _this.$Message.error('选择部分门店时必须选择至少一个门店!');
        return;
      }
      // 活动格式转换Formart
      if (_this.teambuyDetail.startTime.indexOf('GMT') > 0) {
        _this.teambuyDetail.startTime = _this
          .$moment(_this.teambuyDetail.startTime)
          .format('yyyy-MM-dd HH:mm:ss');
      }

      if (_this.teambuyDetail.endTime.indexOf('GMT') > 0) {
        _this.teambuyDetail.endTime = _this
          .$moment(_this.teambuyDetail.endTime)
          .format('yyyy-MM-dd HH:mm:ss');
      }

      if (_this.teambuyDetail.validDateType === 'FIXED_DATE') {
        if (_this.teambuyDetail.deliveryEndTime.indexOf('GMT') > 0) {
          _this.teambuyDetail.deliveryEndTime = _this
            .$moment(_this.teambuyDetail.deliveryEndTime)
            .format('yyyy-MM-dd HH:mm:ss');
        }
      }
      if (_this.tempModalType === _this.modalType.create) {
        // 添加状态
        _this.createStore();
      } else if (_this.tempModalType === _this.modalType.edit) {
        // 编辑状态
        _this.editStore();
      }
    },
    handleEditClose() {
      // if (this.newPicture.length > 0) {
      //   const urls = {
      //     urls: this.newPicture
      //   };
      //   this.deletePicture(urls);
      // }
      this.oldPicture = [];
      this.newPicture = [];
      this.modalEdit = false;
    },
    // deletePicture(urls) {
    //   deletePicture({
    //     urls
    //   })
    //     .then(res => {})
    //     .catch(() => {});
    // },
    createStore() {
      this.modalViewLoading = true;
      this.teambuyDetail.id = null; // 新建时不需要传递id
      createTeamBuy(this.teambuyDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          // this.modalEdit = false;
          // this.getTableData();
        });
    },
    editStore() {
      this.modalViewLoading = true;
      if (this.teambuyDetail.startTime.indexOf('T') > -1) {
        this.teambuyDetail.startTime = this.$moment(
          this.teambuyDetail.startTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.teambuyDetail.endTime.indexOf('T') > -1) {
        this.teambuyDetail.endTime = this.$moment(
          this.teambuyDetail.endTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.teambuyDetail.deliveryEndTimeDay < 0) {
        if (this.teambuyDetail.deliveryEndTime.indexOf('T') > -1) {
          this.teambuyDetail.deliveryEndTime = this.$moment(
            this.teambuyDetail.deliveryEndTime
          ).format('YYYY-MM-DD HH:mm:ss');
        }
      }
      editTeamBuy(this.teambuyDetail)
        .then((res) => {
          this.getTableData();
          this.modalEdit = false;
          this.modalViewLoading = false;
        })
        .catch(() => {
          // this.modalEdit = false;
          // this.getTableData();
          this.modalViewLoading = false;
        });
    },
    // 选取一条数据
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
    },
    addStore() {
      this.step = 'firstStep';
      this.firstSuccess = true;
      this.resetFields();
      this.showStoreList = false;
      this.storeIds = [];
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.teambuyDetail = _.cloneDeep(teambuyDetail);
      }
      if (this.currentTableRowSelected) {
        var secondTime = parseInt(this.currentTableRowSelected.validSeconds);
        var minuteTime = 0;
        var hourTime = 0;
        if (secondTime >= 60) {
          minuteTime = parseInt(secondTime / 60);
          secondTime = parseInt(secondTime % 60);
          if (minuteTime >= 60) {
            hourTime = parseInt(minuteTime / 60);
            minuteTime = parseInt(minuteTime % 60);
          }
        }
        this.currentTableRowSelected.id = null;
        this.currentTableRowSelected.createTime = null;
        this.currentTableRowSelected.standardId = null;
        this.currentTableRowSelected.originalPrice = null;
        this.currentTableRowSelected.costPrice = null;
        this.currentTableRowSelected.productProfitPrice = null;
        this.currentTableRowSelected.commissionScale = null;
        this.currentTableRowSelected.commissionPrice = null;
        this.currentTableRowSelected.status = null;
        this.currentTableRowSelected.rank = null;
        this.currentTableRowSelected.storeId = null;
        this.currentTableRowSelected.storeIds = null;
        this.currentTableRowSelected.relationStoreType = 'ALL';
        this.currentTableRowSelected.validDateType = 'FIXED_DATE';
        this.currentTableRowSelected.deliveryEndTime = null;
        this.currentTableRowSelected.deliveryEndTimeDay = null;
        this.currentTableRowSelected.activityPrice = null;
        this.currentTableRowSelected.singleTeambuyPrice = null;
        this.currentTableRowSelected.hour = hourTime;
        this.currentTableRowSelected.minute = minuteTime;
        this.currentTableRowSelected.second = secondTime;
        if (this.isEnvironment) {
          this.currentTableRowSelected.banner = null;
        }
        this.teambuyDetail = _.cloneDeep(this.currentTableRowSelected);
        this.setDefaultUploadList(this.teambuyDetail);
      }

      // this.getStore();
      this.modalEdit = true;
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.storeId);
    },
    deleteTable(ids) {
      this.loading = true;
      deleteTeamBuy({
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
          this.tableDataSelected = [];
          this.getTableData();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.banner != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.banner;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.teambuyDetail = _.cloneDeep(params.row);
      this.showStoreName = this.relationStore();
      this.modalView = true;
    },
    relationStore() {
      if (
        this.teambuyDetail.storeIds === null ||
        this.teambuyDetail.storeIds === ''
      ) {
        return '全部门店';
      }
      const ids = this.teambuyDetail.storeIds
        .substring(1, this.teambuyDetail.storeIds.length - 1)
        .split('][');
      const list = this.storeListData;
      let str = '';
      if (list.length > 0) {
        ids.forEach((id) => {
          const item = list.find((item) => item.storeId == id);
          str += item.storeName + ',';
        });
        return str.substring(0, str.length - 1);
      }
    },
    handleEdit(params) {
      this.step = 'firstStep';
      this.firstSuccess = true;
      this.save = [];
      this.save.push(params.row.banner);
      this.teambuyDetail.storeId = null;
      this.teambuyDetail.storeIds = '';
      this.storeIds = [];
      this.teambuyDetail.relationStoreType = 'ALL';
      this.teambuyDetail.validDateType = 'FIXED_DATE';
      this.groupStatus = '';
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.teambuyDetail = _.cloneDeep(params.row);
      this.groupStatus = this.teambuyDetail.status;
      this.setDefaultUploadList(this.teambuyDetail);
      if (this.teambuyDetail.validSeconds > 0) {
        this.teambuyDetail.hour = parseInt(
          this.teambuyDetail.validSeconds / 3600
        );
        this.teambuyDetail.minute = parseInt(
          (this.teambuyDetail.validSeconds % 3600) / 60
        );
        this.teambuyDetail.second =
          (this.teambuyDetail.validSeconds % 3600) % 60;
      }
      if (this.teambuyDetail.deliveryEndTimeDay > 0) {
        this.showValidDate = false;
        this.teambuyDetail.validDateType = 'UN_FIXED_DATE';
      } else {
        this.showValidDate = true;
        this.teambuyDetail.validDateType = 'FIXED_DATE';
      }

      if (
        this.teambuyDetail.storeIds !== null &&
        this.teambuyDetail.storeIds !== ''
      ) {
        this.showStoreList = true;
        this.teambuyDetail.relationStoreType = 'PART';
        const storeIds = this.teambuyDetail.storeIds.substring(1, this.teambuyDetail.storeIds.length - 1).split('][');
        storeIds.forEach((element) => { this.storeIds.push(parseInt(element)); });
        console.log('selected storeIds:', this.storeIds);
        const firstStoreId = this.storeIds[0];
        // 编辑时从返回的第一个storeId单独查询下cityCode来反选城市
        const storeObj = this.allStoreList.find(item => item.storeId === firstStoreId);
        this.teambuyDetail.cityCode = storeObj.cityCode;
        this.getStore();
        this.handleCheckSelected();
      } else {
        this.showStoreList = false;
        this.teambuyDetail.relationStoreType = 'ALL'; // storeIds为''默认关联的门店则是全部门店
      }
      this.modalEdit = true;
    },
    handleCheckSelected() {
      const _this = this;
      // 全选/反选按钮的样式
      if (!_this.storeList[0]) {
        this.indeterminate = false;
        this.checkAll = false;
      } else {
        const sameArray = _this.storeList[0].storeList.filter((item) => _this.storeIds.includes(item.storeId));
        console.log('sameArray:', sameArray);
        if (
          sameArray.length > 0 &&
          sameArray.length === this.storeList[0].storeList.length
        ) {
          this.indeterminate = false;
          this.checkAll = true;
        } else if (
          sameArray.length > 0 &&
          sameArray.length < this.storeList[0].storeList.length
        ) {
          this.indeterminate = true;
          this.checkAll = false;
        } else {
          this.indeterminate = false;
          this.checkAll = false;
        }
      }

      if (!_this.storeList[1]) {
        this.indeterminate1 = false;
        this.checkAll1 = false;
      } else {
        const sameArray1 = _this.storeList[1].storeList.filter((item) => _this.storeIds.includes(item.storeId));
        console.log('sameArray1:', sameArray1);
        if (
          sameArray1.length > 0 &&
          sameArray1.length === this.storeList[1].storeList.length
        ) {
          this.indeterminate1 = false;
          this.checkAll1 = true;
        } else if (
          sameArray1.length > 0 &&
          sameArray1.length < this.storeList[1].storeList.length
        ) {
          this.indeterminate1 = true;
          this.checkAll1 = false;
        } else {
          this.indeterminate1 = false;
          this.checkAll1 = false;
        }
      }

      if (!_this.storeList[2]) {
        this.indeterminate2 = false;
        this.checkAll2 = false;
      } else {
        const sameArray2 = _this.storeList[2].storeList.filter((item) => _this.storeIds.includes(item.storeId));
        console.log('sameArray2:', sameArray2);
        if (
          sameArray2.length > 0 &&
            sameArray2.length === this.storeList[2].storeList.length
        ) {
          this.indeterminate2 = false;
          this.checkAll2 = true;
        } else if (
          sameArray2.length > 0 &&
            sameArray2.length < this.storeList[2].storeList.length
        ) {
          this.indeterminate2 = true;
          this.checkAll2 = false;
        } else {
          this.indeterminate2 = false;
          this.checkAll2 = false;
        }
      }

      if (!_this.storeList[3]) {
        this.indeterminate3 = false;
        this.checkAll3 = false;
      } else {
        const sameArray3 = _this.storeList[3].storeList.filter((item) => _this.storeIds.includes(item.storeId));
        console.log('sameArray3:', sameArray3);
        if (
          sameArray3.length > 0 &&
          sameArray3.length === this.storeList[3].storeList.length
        ) {
          this.indeterminate3 = false;
          this.checkAll3 = true;
        } else if (
          sameArray3.length > 0 &&
          sameArray3.length < this.storeList[3].storeList.length
        ) {
          this.indeterminate3 = true;
          this.checkAll3 = false;
        } else {
          this.indeterminate3 = false;
          this.checkAll3 = false;
        }
      }

      if (!_this.storeList[4]) {
        this.indeterminate4 = false;
        this.checkAll4 = false;
      } else {
        const sameArray4 = _this.storeList[4].storeList.filter((item) => _this.storeIds.includes(item.storeId));
        console.log('sameArray4:', sameArray4);
        if (
          sameArray4.length > 0 &&
          sameArray4.length === this.storeList[4].storeList.length
        ) {
          this.indeterminate4 = false;
          this.checkAll4 = true;
        } else if (
          sameArray4.length > 0 &&
          sameArray4.length < this.storeList[4].storeList.length
        ) {
          this.indeterminate4 = true;
          this.checkAll4 = false;
        } else {
          this.indeterminate4 = false;
          this.checkAll4 = false;
        }
      }

      if (!_this.storeList[5]) {
        this.indeterminate5 = false;
        this.checkAll5 = false;
      } else {
        const sameArray5 = _this.storeList[5].storeList.filter((item) => _this.storeIds.includes(item.storeId));
        console.log('sameArray5:', sameArray5);
        if (
          sameArray5.length > 0 &&
          sameArray5.length === this.storeList[5].storeList.length
        ) {
          this.indeterminate5 = false;
          this.checkAll5 = true;
        } else if (
          sameArray5.length > 0 &&
          sameArray5.length < this.storeList[5].storeList.length
        ) {
          this.indeterminate5 = true;
          this.checkAll5 = false;
        } else {
          this.indeterminate5 = false;
          this.checkAll5 = false;
        }
      }

      if (!_this.storeList[6]) {
        this.indeterminate6 = false;
        this.checkAll6 = false;
      } else {
        const sameArray6 = _this.storeList[6].storeList.filter((item) => _this.storeIds.includes(item.storeId));
        console.log('sameArray6:', sameArray6);
        if (
          sameArray6.length > 0 &&
          sameArray6.length === this.storeList[6].storeList.length
        ) {
          this.indeterminate6 = false;
          this.checkAll6 = true;
        } else if (
          sameArray6.length > 0 &&
          sameArray6.length < this.storeList[6].storeList.length
        ) {
          this.indeterminate6 = true;
          this.checkAll6 = false;
        } else {
          this.indeterminate6 = false;
          this.checkAll6 = false;
        }
      }
    },
    handleDownload() {
      this.exportExcelLoading = true;
      getTeamBuyPages(this.searchRowData).then((res) => {
        const tableData = res.rows;
        // 表格数据导出字段翻译
        tableData.forEach((item) => {
          item['groupId'] = item['groupName'];
          item['status'] = teamBuyStatusConvert(item['status']).label;
          item['activityPrice'] = (item['activityPrice'] / 100.0).toFixed(2);
          item['costPrice'] = (item['costPrice'] / 100.0).toFixed(2);
          item['productProfitPrice'] = (
            item['productProfitPrice'] / 100.0
          ).toFixed(2);
          item['commissionPrice'] = (item['commissionPrice'] / 100.0).toFixed(
            2
          );
          item['commissionScale'] = item['commissionScale'] + '%';
          item['tourDiscount'] = (item['tourDiscount'] / 100.0).toFixed(2);
          item['robot'] = teamBuyStatusConvert(item['robot']).label;
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `拼团活动信息-${date}`,
          data: tableData
        });
        this.exportExcelLoading = false;
      });
    },
    getTableData() {
      if (!this.searchRowData.status) {
        this.searchRowData.sidx = 'createTime';
        this.searchRowData.sort = 'desc';
      }
      getTeamBuyPages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.teambuyDetail.storeImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.teambuyDetail.banner = null;
      this.teambuyDetail.banner = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    startTimeChange(value, date) {
      this.teambuyDetail.startTime = value;
      if (this.teambuyDetail.startTime.indexOf('T') > -1) {
        this.teambuyDetail.startTime = this.$moment(
          this.teambuyDetail.startTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    endTimeChange(value, date) {
      this.teambuyDetail.endTime = value;
      if (this.teambuyDetail.endTime.indexOf('T') > -1) {
        this.teambuyDetail.endTime = this.$moment(
          this.teambuyDetail.endTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    createTimeStartChange(value, date) {
      this.teambuyDetail.startTimeBegin = value || null;
    },
    createTimeEndChange(value, date) {
      this.teambuyDetail.startTimeEnd = value || null;
    },
    deliveryEndTimeChange(value, date) {
      this.teambuyDetail.deliveryEndTime = value;
      if (this.teambuyDetail.deliveryEndTime.indexOf('T') > -1) {
        this.teambuyDetail.deliveryEndTime = this.$moment(
          this.teambuyDetail.deliveryEndTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    deliveryStartTimeChange(value, date) {
      this.teambuyDetail.deliveryStartTime = value;
      if (this.teambuyDetail.deliveryStartTime.indexOf('T') > -1) {
        this.teambuyDetail.deliveryStartTime = this.$moment(
          this.teambuyDetail.deliveryStartTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    activityStatusChange(value, date) {
      if (value === 'expire' || value === 'off') {
        this.searchRowData.sidx = 'createTime';
        this.searchRowData.sort = 'desc';
      }
    },
    validSecondsChange() {
      const hour = this.teambuyDetail.hour * 60 * 60;
      const minute = this.teambuyDetail.minute * 60;
      const second = this.teambuyDetail.second;
      this.teambuyDetail.validSeconds = hour + minute + second;
    },
    originalPriceInputNumberOnchange(value) {
      this.teambuyDetail.originalPrice = yuanToFenNumber(value);
    },
    activityPriceInputNumberOnchange(value) {
      this.teambuyDetail.activityPrice = yuanToFenNumber(value);
      this.teambuyDetail.productProfitPrice =
        this.teambuyDetail.activityPrice - this.teambuyDetail.costPrice;
    },
    // singleTeambuyPriceInputNumberOnchange(value) {
    //   this.teambuyDetail.singleTeambuyPrice = yuanToFenNumber(value);
    // },
    tourDiscountInputNumberOnchange(value) {
      this.teambuyDetail.tourDiscount = yuanToFenNumber(value);
    },
    selectStore(options) {
      if (options.value === 'ALL') {
        this.teambuyDetail.relationStoreType = 'ALL';
        this.tempModalType === 'edit'
          ? (this.teambuyDetail.storeIds = '')
          : (this.teambuyDetail.storeIds = null);
        this.showStoreList = false;
      } else if (options.value === 'PART') {
        this.teambuyDetail.relationStoreType = 'PART';
        this.storeCheckRest();
        this.getStore();
        this.showStoreList = true;
      }
    },
    selectValidDateType(options) {
      if (options === 'FIXED_DATE') {
        this.showValidDate = true;
        this.teambuyDetail.validDateType = 'FIXED_DATE';
      } else if (options === 'UN_FIXED_DATE') {
        this.showValidDate = false;
        this.teambuyDetail.validDateType = 'UN_FIXED_DATE';
      }
    },
    storeCheckRest() {
      this.indeterminate = false;
      this.checkAll = false;
      this.indeterminate1 = false;
      this.checkAll1 = false;
      this.indeterminate2 = false;
      this.checkAll2 = false;
      this.indeterminate3 = false;
      this.checkAll3 = false;
      this.indeterminate4 = false;
      this.checkAll4 = false;
      this.indeterminate5 = false;
      this.checkAll5 = false;
      this.indeterminate6 = false;
      this.checkAll6 = false;
      this.indeterminate7 = false;
      this.checkAll7 = false;
      this.storeIds = [];
      this.teambuyDetail.storeIds = '';
    },
    handleCheckAll(value) {
      const _this = this;
      if (value === 0) {
        const allIds = [];
        const beforeIds = [];
        if (this.indeterminate) {
          this.checkAll = false;
        } else {
          this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;
        if (this.checkAll) {
          if (this.storeIds != null) {
            for (const val of this.storeIds) {
              allIds.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds.push(item.storeId);
          });
          this.storeIds = allIds;
          this.teambuyDetail.storeIds = '[' + allIds.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.teambuyDetail.storeIds = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 1) {
        const allIds1 = [];
        const beforeIds = [];
        if (this.indeterminate1) {
          this.checkAll1 = false;
        } else {
          this.checkAll1 = !this.checkAll1;
        }
        this.indeterminate1 = false;
        if (this.checkAll1) {
          if (this.storeIds != null) {
            for (const val of this.storeIds) {
              allIds1.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds1.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.storeIds = allIds1;
          this.teambuyDetail.storeIds = '[' + allIds1.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.teambuyDetail.storeIds = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 2) {
        const allIds2 = [];
        const beforeIds = [];
        if (this.indeterminate2) {
          this.checkAll2 = false;
        } else {
          this.checkAll2 = !this.checkAll2;
        }
        this.indeterminate2 = false;
        if (this.checkAll2) {
          if (this.storeIds != null) {
            for (const val of this.storeIds) {
              allIds2.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds2.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.storeIds = allIds2;
          this.teambuyDetail.storeIds = '[' + allIds2.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.teambuyDetail.storeIds = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 3) {
        const allIds3 = [];
        const beforeIds = [];
        if (this.indeterminate3) {
          this.checkAll3 = false;
        } else {
          this.checkAll3 = !this.checkAll3;
        }
        this.indeterminate3 = false;
        if (this.checkAll3) {
          if (this.storeIds != null) {
            for (const val of this.storeIds) {
              allIds3.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds3.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.storeIds = allIds3;
          this.teambuyDetail.storeIds = '[' + allIds3.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.teambuyDetail.storeIds = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 4) {
        const allIds4 = [];
        const beforeIds = [];
        if (this.indeterminate4) {
          this.checkAll4 = false;
        } else {
          this.checkAll4 = !this.checkAll4;
        }
        this.indeterminate4 = false;
        if (this.checkAll4) {
          if (this.storeIds != null) {
            for (const val of this.storeIds) {
              allIds4.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds4.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.storeIds = allIds4;
          this.teambuyDetail.storeIds = '[' + allIds4.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.teambuyDetail.storeIds = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 5) {
        const allIds5 = [];
        const beforeIds = [];
        if (this.indeterminate5) {
          this.checkAll5 = false;
        } else {
          this.checkAll5 = !this.checkAll5;
        }
        this.indeterminate5 = false;
        if (this.checkAll5) {
          if (this.storeIds != null) {
            for (const val of this.storeIds) {
              allIds5.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds5.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.storeIds = allIds5;
          this.teambuyDetail.storeIds = '[' + allIds5.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.teambuyDetail.storeIds = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 6) {
        const allIds6 = [];
        const beforeIds = [];
        if (this.indeterminate6) {
          this.checkAll6 = false;
        } else {
          this.checkAll6 = !this.checkAll6;
        }
        this.indeterminate6 = false;
        if (this.checkAll6) {
          if (this.storeIds != null) {
            for (const val of this.storeIds) {
              allIds6.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds6.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.storeIds = allIds6;
          this.teambuyDetail.storeIds = '[' + allIds6.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.teambuyDetail.storeIds = '[' + newArray.join('][') + ']';
        }
      }
      if (value === 7) {
        const allIds7 = [];
        const beforeIds = [];
        if (this.indeterminate7) {
          this.checkAll7 = false;
        } else {
          this.checkAll7 = !this.checkAll7;
        }
        this.indeterminate7 = false;
        if (this.checkAll7) {
          if (this.storeIds != null) {
            for (const val of this.storeIds) {
              allIds7.push(val);
            }
          }
          this.storeList[value].storeList.forEach((item) => {
            allIds7.push(item.storeId);
            beforeIds.push(item.storeId);
          });
          this.storeIds = allIds7;
          this.teambuyDetail.storeIds = '[' + allIds7.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.teambuyDetail.storeIds = '[' + newArray.join('][') + ']';
        }
      }
    },
    checkAllGroupChange(data) {
      const sameArray = this.storeList[0].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray.length === this.storeList[0].storeList.length
      ) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (
        data.length > 0 &&
        sameArray.length < this.storeList[0].storeList.length
      ) {
        this.indeterminate = true;
        this.checkAll = false;
        this.teambuyDetail.storeIds = '[' + data.join('][') + ']';
      }
      if (sameArray.length === 0) {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    checkAllGroupChange1(data) {
      const sameArray1 = this.storeList[1].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray1.length === this.storeList[1].storeList.length
      ) {
        this.indeterminate1 = false;
        this.checkAll1 = true;
      } else if (
        data.length > 0 &&
        sameArray1.length < this.storeList[1].storeList.length
      ) {
        this.indeterminate1 = true;
        this.checkAll1 = false;
        this.teambuyDetail.storeIds = '[' + data.join('][') + ']';
      }
      if (sameArray1.length == 0) {
        this.indeterminate1 = false;
        this.checkAll1 = false;
      }
    },
    checkAllGroupChange2(data) {
      const sameArray2 = this.storeList[2].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray2.length === this.storeList[2].storeList.length
      ) {
        this.indeterminate2 = false;
        this.checkAll2 = true;
      } else if (
        data.length > 0 &&
        sameArray2.length < this.storeList[2].storeList.length
      ) {
        this.indeterminate2 = true;
        this.checkAll2 = false;
        this.teambuyDetail.storeIds = '[' + data.join('][') + ']';
      }
      if (sameArray2.length == 0) {
        this.indeterminate2 = false;
        this.checkAll2 = false;
      }
    },
    checkAllGroupChange3(data) {
      const sameArray3 = this.storeList[3].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray3.length === this.storeList[3].storeList.length
      ) {
        this.indeterminate3 = false;
        this.checkAll3 = true;
      } else if (
        data.length > 0 &&
        sameArray3.length < this.storeList[3].storeList.length
      ) {
        this.indeterminate3 = true;
        this.checkAll3 = false;
        this.teambuyDetail.storeIds = '[' + data.join('][') + ']';
      }
      if (sameArray3.length === 0) {
        this.indeterminate3 = false;
        this.checkAll3 = false;
      }
    },
    checkAllGroupChange4(data) {
      const sameArray4 = this.storeList[4].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray4.length === this.storeList[4].storeList.length
      ) {
        this.indeterminate4 = false;
        this.checkAll4 = true;
      } else if (
        data.length > 0 &&
        sameArray4.length < this.storeList[4].storeList.length
      ) {
        this.indeterminate4 = true;
        this.checkAll4 = false;
        this.teambuyDetail.storeIds = '[' + data.join('][') + ']';
      }
      if (sameArray4.length === 0) {
        this.indeterminate4 = false;
        this.checkAll4 = false;
      }
    },
    checkAllGroupChange5(data) {
      const sameArray5 = this.storeList[5].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray5.length === this.storeList[5].storeList.length
      ) {
        this.indeterminate5 = false;
        this.checkAll5 = true;
      } else if (
        data.length > 0 &&
        sameArray5.length < this.storeList[5].storeList.length
      ) {
        this.indeterminate5 = true;
        this.checkAll5 = false;
        this.teambuyDetail.storeIds = '[' + data.join('][') + ']';
      }
      if (sameArray5.length === 0) {
        this.indeterminate5 = false;
        this.checkAll5 = false;
      }
    },
    checkAllGroupChange6(data) {
      const sameArray6 = this.storeList[6].storeList.filter(function(item) {
        return data.indexOf(item.storeId) != -1;
      });
      if (
        data.length > 0 &&
        sameArray6.length === this.storeList[6].storeList.length
      ) {
        this.indeterminate6 = false;
        this.checkAll6 = true;
      } else if (
        data.length > 0 &&
        sameArray6.length < this.storeList[6].storeList.length
      ) {
        this.indeterminate6 = true;
        this.checkAll6 = false;
        this.teambuyDetail.storeIds = '[' + data.join('][') + ']';
      }
      if (sameArray6.length === 0) {
        this.indeterminate6 = false;
        this.checkAll6 = false;
      }
    },
    onRowClick(row, index) {
      // 给团购活动赋值
      this.teambuyDetail.standardId = row.id;
      this.teambuyDetail.originalPrice = row.price;
      this.teambuyDetail.costPrice = row.costPrice ? row.costPrice : 0;
      this.modalProduct = false;
    },
    handleRelation() {
      this.getProductTableData();
      this.modalProduct = true;
    },
    getProductTableData() {
      getProductStandardsPages(this.searchProductRowData)
        .then((res) => {
          this.productData = res.rows;
          this.productTotal = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    changeProductPage(page) {
      this.searchProductRowData.page = page;
      this.getProductTableData();
    },
    changeProductPageSize(pageSize) {
      this.searchProductRowData.page = 1;
      this.searchProductRowData.rows = pageSize;
      this.getProductTableData();
    },
    handleProductSearch() {
      this.searchProductRowData.page = 1;
      this.searchLoading = true;
      this.getProductTableData();
    },
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    handleProductClear() {
      // 重置商品搜索数据
      this.resetSearchProductRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleProductSearch();
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
    aboutGoods() {
      getGoodsStandard(this.teambuyDetail)
        .then((res) => {
          this.productStandardDetail = res;
          this.modalGoodsStandard = true;
        })
    },
    handleGoodsClose() {
      this.loading = false;
      this.modalGoodsStandard = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.bopx {
  display: flex;
}
</style>
