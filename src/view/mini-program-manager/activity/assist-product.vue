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
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-sale="onOff"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-relevance="onRelevance"
      >
        <!--  @on-delete="handleDelete" -->
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.title"
              placeholder="活动标题"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <DatePicker
              v-model="searchRowData.beginTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              class="search-input mr5"
              style="width: 170px"
              placeholder="开始时间"
              @on-change="edBeginTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
              type="datetime"
              placeholder="结束时间"
              style="width: 170px"
              class="mr5"
              @on-change="edFinishTimeChange"
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
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addFlashsale">
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
              <Icon type="md-trash" />批量删除
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
    <!-- 查看活动详情 -->
    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>限时秒杀活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动ID:</i-col>
              <i-col span="18">{{ flashsaleDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">{{ flashsaleDetail.title }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">{{ flashsaleDetail.beginTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">{{ flashsaleDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col v-if="flashsaleDetail.status === 'ON'" span="18">
                <tag color="success">{{ "开启" | imageStatusFilter }}</tag>
              </i-col>
              <i-col v-else-if="flashsaleDetail.status === 'OFF'" span="18">
                <tag color="error">{{ "关闭" | imageStatusFilter }}</tag>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">领取奖励有效天数:</i-col>
              <i-col span="18">{{ flashsaleDetail.receiveValidDays }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">使用奖励有效天数:</i-col>
              <i-col span="18">{{ flashsaleDetail.useValidDays }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">描述:</i-col>
              <i-col span="18">{{ flashsaleDetail.remark }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <!-- 创建活动/修改活动/添加活动关联 -->
    <Modal v-model="modalEdit" :width="1200" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType==modalType.edit?'修改助力抢爆品活动':(tempModalType==modalType.create?'创建助力抢爆品活动': '添加助力抢爆品活动和商品/券关联') }}</i-col>
      </p>
      <div class="modal-content">
        <Row v-if="tempModalType == modalType.edit || tempModalType == modalType.create">
          <Form ref="editForm" :model="flashsaleDetail" :rules="ruleInline" :label-width="140">
            <Row>
              <i-col span="18">
                <FormItem label="活动标题:" prop="title">
                  <Input v-model="flashsaleDetail.title" placeholder="活动标题" style="width: 170px"></Input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="有效期起:" prop="beginTime">
                  <DatePicker
                    :value="flashsaleDetail.beginTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期起"
                    class="search-input"
                    style="width: 170px"
                    :readonly="editStatus"
                    @on-change="flashsaleDetail.beginTime=$event"
                  />
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="有效期止:" prop="endTime">
                  <DatePicker
                    :value="flashsaleDetail.endTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期止"
                    class="search-input"
                    style="width: 170px"
                    :readonly="editStatus"
                    @on-change="flashsaleDetail.endTime=$event"
                  />
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="活动状态:" prop="status">
                  <Select v-model="flashsaleDetail.status" clearable style="width: 170px">
                    <Option
                      v-for="(item,index) in imageStatusEnum"
                      :value="item.value"
                      :key="index"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 170px"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="领取奖励有效天数:" prop="receiveValidDays">
                  <Input v-model="flashsaleDetail.receiveValidDays" style="width: 170px"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="使用奖励有效天数:" prop="useValidDays">
                  <Input v-model="flashsaleDetail.useValidDays" style="width: 170px"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="活动描述:" prop="remark">
                  <Input
                    v-model="flashsaleDetail.remark"
                    :autosize="{minRows: 3,maxRows: 8}"
                    type="textarea"
                    placeholder="请输入活动描述"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </Row>
        <!-- 添加助力抢爆品活动和商品/券关联 -->
        <Row v-if="tempModalType == null">
          <Row>
            <Card>
              <div class="tabChange">
                <b
                  :class=" topStatus=='PROD' ? 'hot' : '' "
                  data-index="PROD"
                  @click="assistDataChange"
                >助力商品</b>
                <b
                  :class=" topStatus=='COUPON' ? 'hot' : '' "
                  data-index="COUPON"
                  @click="assistDataChange"
                >优惠券</b>
              </div>
              <!-- 助力商品 -->
              <div v-show="topStatus==='PROD'">
                <tables
                  ref="tables"
                  v-model="products"
                  :columns="productColumns"
                  :loading="tempTableLoading"
                  border
                  searchable
                  search-place="top"
                  highlight-row
                  @on-selection-change="onProductSelectionChange"
                  @on-current-change="handleTemplateChange"
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
                      <Button class="search-btn mr5" type="primary" @click="handleProductSearch">
                        <Icon type="md-search" />&nbsp;搜索
                      </Button>
                      <Button v-waves class="search-btn" type="info" @click="handleProductClear">
                        <Icon type="md-refresh" />&nbsp;清除
                      </Button>
                    </Row>
                  </div>
                </tables>

                <div style="margin: 10px 10px 20px 10px;overflow: hidden">
                  <Row type="flex" justify="end">
                    <Page
                      :total="productTotal"
                      :current="searchProductRowData.page"
                      :page-size="searchProductRowData.rows"
                      :page-size-opts="templatePageOpts"
                      show-sizer
                      show-total
                      @on-change="changeProductPage"
                      @on-page-size-change="changeProductPageSize"
                    ></Page>
                  </Row>
                </div>
              </div>
              <!-- 优惠券 -->
              <div v-show="topStatus==='COUPON'">
                <tables
                  ref="tables"
                  v-model="coupons"
                  :columns="couponColumns"
                  :loading="tempTableLoading"
                  border
                  searchable
                  search-place="top"
                  highlight-row
                  @on-delete="modalHandleDelete"
                  @on-selection-change="onProductSelectionChange"
                  @on-current-change="handleTemplateChange"
                >
                  <div slot="searchCondition">
                    <Row>
                      <Input
                        v-model="searchCouponRowData.couponName"
                        placeholder="优惠券名称"
                        class="search-input mr5"
                        style="width: auto"
                        clearable
                      ></Input>
                      <Button class="search-btn mr5" type="primary" @click="handleCouponSearch">
                        <Icon type="md-search" />&nbsp;搜索
                      </Button>
                      <Button v-waves class="search-btn" type="info" @click="handleCouponClear">
                        <Icon type="md-refresh" />&nbsp;清除
                      </Button>
                    </Row>
                  </div>
                </tables>

                <div style="margin: 10px 10px 20px 10px;overflow: hidden">
                  <Row type="flex" justify="end">
                    <Page
                      :total="couponsTotal"
                      :current="searchCouponRowData.page"
                      :page-size="searchCouponRowData.rows"
                      :page-size-opts="templatePageOpts"
                      show-sizer
                      show-total
                      @on-change="changeCouponPage"
                      @on-page-size-change="changeCouponPageSize"
                    ></Page>
                  </Row>
                </div>
              </div>
              <Form
                ref="modalCreate"
                :model="addRelationDetail"
                :rules="relationRuleInline"
                :label-width="110"
              >
                <Row>
                  <i-col span="5">
                    <FormItem label="商品库存总数:" prop="activityLimit">
                      <Input
                        :min="0"
                        v-model="addRelationDetail.activityLimit"
                        class="ml10"
                        label="商品库存总数"
                        style="padding-right: 5px;width: 100px"
                      ></Input>
                    </FormItem>
                  </i-col>
                  <i-col span="5">
                    <FormItem label="需助力人数:" prop="peopleNumber">
                      <Input
                        :min="0"
                        v-model="addRelationDetail.peopleNumber"
                        class="ml10"
                        label="需助力人数"
                        style="padding-right: 5px;width: 100px"
                      ></Input>
                    </FormItem>
                  </i-col>
                  <i-col span="5">
                    <FormItem label="有效时长(小时):" prop="validHour">
                      <Input
                        :min="0"
                        v-model="addRelationDetail.validHour"
                        class="ml10"
                        label="有效时长(小时)"
                        style="padding-right: 5px;width: 100px"
                      ></Input>
                    </FormItem>
                  </i-col>
                  <i-col span="5">
                    <FormItem label="排序:" prop="rank">
                      <Input
                        :min="0"
                        v-model="addRelationDetail.rank"
                        class="ml10"
                        label="排序"
                        style="padding-right: 5px;width: 100px"
                      ></Input>
                    </FormItem>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="5">
                    <FormItem label="分享图片:" prop="shareImage">
                      <Input
                        v-show="false"
                        v-model="addRelationDetail.shareImage"
                        style="width: auto"
                      ></Input>
                      <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
                        <template v-if="item.status === 'finished'">
                          <div>
                            <img :src="item.url" />
                            <div class="demo-upload-list-cover">
                              <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                              <Icon type="ios-trash-outline" @click.native="handleRemoveMain(item)"></Icon>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                      </div>
                      <IViewUpload
                        ref="uploadMain"
                        :default-list="defaultListMain"
                        :image-size="imageSize"
                        @on-success="handleSuccessMain"
                      >
                        <div slot="content" style="width:58px;height:58px;line-height:58px">
                          <Icon type="ios-camera" size="20"></Icon>
                        </div>
                      </IViewUpload>
                    </FormItem>
                  </i-col>
                  <i-col span="4">
                    <Button
                      v-waves
                      v-show="this.proFlag===true"
                      :loading="addTempDataLoading"
                      span="4"
                      class="search-btn"
                      type="primary"
                      style="margin-left: 50px;"
                      @click="addTempData('modalCreate')"
                    >
                      <Icon type="md-add" />&nbsp;关联助力商品/券
                    </Button>
                  </i-col>
                </Row>
              </Form>*Tips：请先选择要关联的商品/券，然后输入关联配置信息，添加完成后可在下方表格修改.
            </Card>
          </Row>

          <Divider orientation="center">已关联助力抢爆品活动商品/券</Divider>
          <tables
            :columns="relationColumns"
            v-model="relationProducts"
            :loading="tempTableLoading"
            border
            @on-sale="switchStatus"
            @on-delete="modalHandleDelete"
            @on-view="handleRelevanceView"
            @on-edit="handleRelevanceEdit"
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button
          v-if="tempModalType == modalType.edit || tempModalType == modalType.create"
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit('editForm')"
        >确定</Button>
      </div>
    </Modal>
    <!-- 查看关联商品/券详情 -->
    <Modal v-model="modalRelevanceView" :width="800" :mask-closable="false" draggable scrollable>
      <p slot="header">
        <span>关联的商品/优惠券详情</span>
      </p>
      <div v-if="activitiesRelevanceDetail.type==='COUPON'" class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">优惠券名称:</i-col>
              <i-col span="16">{{ activitiesCouponDetail.couponName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">优惠券类型:</i-col>
              <i-col v-if="activitiesCouponDetail.couponType === 'FULL_CUT_COUPON'" span="16">
                <tag color="magenta">{{ "满减券" }}</tag>
              </i-col>
              <i-col v-else-if="activitiesCouponDetail.couponType === 'DISCOUNT_COUPON'" span="16">
                <tag color="orange">{{ "折扣券" }}</tag>
              </i-col>
              <i-col v-else-if="activitiesCouponDetail.couponType === 'CASH_COUPON'" span="16">
                <tag color="cyan">{{ "现金券" }}</tag>
              </i-col>
              <i-col v-else-if="activitiesCouponDetail.couponType === 'FREIGHT_COUPON'" span="16">
                <tag color="cyan">{{ "运费券" }}</tag>
              </i-col>
              <i-col v-else-if="activitiesCouponDetail.couponType === null" span="16">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">优惠/折扣额度:</i-col>
              <i-col
                v-if="activitiesCouponDetail.couponType === 'DISCOUNT_COUPON'"
                span="16"
              >{{ activitiesCouponDetail.couponFee | fenToDiscountFilters }}</i-col>
              <i-col v-else span="16">{{ activitiesCouponDetail.couponFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">最小购买金额:</i-col>
              <i-col span="16">{{ activitiesCouponDetail.minBuyFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">优惠券状态:</i-col>
              <i-col v-if="activitiesCouponDetail.couponStatus === 'VALID'" span="16">
                <tag color="success">{{ "有效" }}</tag>
              </i-col>
              <i-col v-else-if="activitiesCouponDetail.couponStatus === 'INVALID'" span="16">
                <tag color="error">{{ "无效" }}</tag>
              </i-col>
              <i-col v-else-if="activitiesCouponDetail.couponStatus === null" span="16">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">券有效期类型:</i-col>
              <i-col span="16">{{ activitiesCouponDetail.validDateType | validDateTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row
          v-show="activitiesCouponDetail.validDateType=='UN_FIXED_DATE' && activitiesCouponDetail.source == 'SMALL'"
          class-name="mb20"
        >
          <i-col span="12">
            <Row>
              <i-col span="8">生效开始:</i-col>
              <i-col span="16">{{ activitiesCouponDetail.beginDay }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">有效天数:</i-col>
              <i-col span="16">{{ activitiesCouponDetail.endDay }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row
          v-show="activitiesCouponDetail.validDateType=='FIXED_DATE' && activitiesCouponDetail.source == 'SMALL'"
          class-name="mb20"
        >
          <i-col span="12">
            <Row>
              <i-col span="8">生效时间:</i-col>
              <i-col span="16">{{ activitiesCouponDetail.effectiveStartTime }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">失效时间:</i-col>
              <i-col span="16">{{ activitiesCouponDetail.effectiveEndTime }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">券使用范围:</i-col>
              <i-col v-if="activitiesCouponDetail.couponScope === 'STORE'" span="16">
                <tag color="magenta">{{ "门店" }}</tag>
              </i-col>
              <i-col v-else-if="activitiesCouponDetail.couponScope === 'SMALL'" span="16">
                <tag color="cyan">{{ "商城" }}</tag>
              </i-col>
              <i-col v-else-if="activitiesCouponDetail.couponScope === 'STORE_AND_SMALL'" span="16">
                <tag color="orange">{{ "全场通用" }}</tag>
              </i-col>
              <i-col v-else-if="activitiesCouponDetail.couponScope === null" span="16">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">券使用限制:</i-col>
              <i-col span="16">{{ activitiesCouponDetail.useLimitType | couponUseLimitFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="20">
            <Row>
              <i-col span="5">使用规则:</i-col>
              <i-col span="18">{{ activitiesCouponDetail.couponRules }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row v-if="activitiesRelevanceDetail.type==='COUPON'" class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">优惠券分享图:</i-col>
              <i-col span="21">
                <img :src="activitiesRelevanceDetail.shareImage" style="width: 200px;height:100px" />
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div v-if="activitiesRelevanceDetail.type==='PROD'" class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{ activitiesProductDetail.baseProductName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">商品单位:</i-col>
              <i-col span="16">{{ activitiesProductDetail.baseUnit }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">商品原价:</i-col>
              <i-col span="16">{{ activitiesProductDetail.price | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">商品助力价:</i-col>
              <i-col span="16">{{ "¥"+discountPrice }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row v-if="activitiesRelevanceDetail.type==='PROD'" class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品分享图:</i-col>
              <i-col span="21">
                <img :src="activitiesRelevanceDetail.shareImage" style="width: 200px;height:100px" />
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleRelevanceClose">关闭</Button>
      </div>
    </Modal>
    <!-- 修改关联商品/券详情 -->
    <Modal v-model="modalRelevanceEdit" :mask-closable="false" :width="1000" draggable>
      <p slot="header">
        <i-col>修改关联商品/券关联</i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="editRelevanceForm"
          :model="addRelationDetail"
          :rules="relationRuleInline"
          :label-width="110"
        >
          <Row>
            <i-col span="5">
              <FormItem label="商品库存总数:" prop="activityLimit">
                <Input
                  :min="0"
                  v-model="addRelationDetail.activityLimit"
                  class="ml10"
                  label="商品库存总数"
                  style="padding-right: 5px;width: 100px"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="5">
              <FormItem label="需助力人数:" prop="peopleNumber">
                <Input
                  :min="0"
                  v-model="addRelationDetail.peopleNumber"
                  class="ml10"
                  label="需助力人数"
                  style="padding-right: 5px;width: 100px"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="5">
              <FormItem label="有效时长(小时):" prop="validHour">
                <Input
                  :min="0"
                  v-model="addRelationDetail.validHour"
                  class="ml10"
                  label="有效时长(小时)"
                  style="padding-right: 5px;width: 100px"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="5">
              <FormItem label="排序:" prop="rank">
                <Input
                  :min="0"
                  v-model="addRelationDetail.rank"
                  class="ml10"
                  label="排序"
                  style="padding-right: 5px;width: 100px"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="5">
              <FormItem label="分享图片:" prop="shareImage">
                <Input v-show="false" v-model="addRelationDetail.shareImage" style="width: auto"></Input>
                <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url" />
                      <!-- <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveMain(item)"></Icon>
                      </div>-->
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadMain"
                  :default-list="defaultListMain"
                  :image-size="imageSize"
                  @on-success="handleSuccessMain"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditRelevanceClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleconfirmEdit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import IViewUpload from "_c/iview-upload";
import _ from "lodash";
import {
  deleteAssist,
  getAssistPages,
  editAssist,
  createAssist,
  getAssistProductRelationPages,
  deleteAssistProductRelation,
  createAssistProductRelation,
  editAssistProductRelation,
  getProductStandardsPages,
  getCouponPagess,
} from "@/api/mini-program";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  imageStatusConvert,
  expandTypeConvert,
  onSaleStatusConvert,
  couponTypeConvert,
  couponStatusConvert,
  couponUseLimitConvert,
} from "@/libs/converStatus";
import { imageStatusEnum, onSaleStatusEnum } from "@/libs/enumerate";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  compareCouponData,
} from "@/libs/util";
import { customPlanStatusConvert, appTypeConvert } from "@/libs/converStatus";

const flashsaleDetail = {
  beginTime: null,
  createTime: null,
  endTime: null,
  id: "",
  remark: "",
  status: "",
  title: "",
  updateTime: null,
  userActivityLimit: "",
  userActivitySurplus: "",
};

const relationDetail = {
  // baseProductName: "123",
  // price: 0,
  // standardIds: "",
  id: 0,
  activityId: 0,
  standardId: 0,
  peopleNumber: "",
  validHour: "",
  isEdit: false,
  status: "",
  createTime: "",
  updateTime: "",
  rank: "",
  activityLimit: "",
  productStandard: {},
  couponConfigManage: {},
  couponConfigId: 0,
  type: "PROD",
  shareImage: "",
};

const productDetail = {
  id: 0,
  productId: 0,
  barcode: "",
  specification: "",
  standardQty: 0,
  unitId: 0,
  productUnit: "",
  price: 0,
  salePrice: 0,
  rank: 0,
  description: "",
  shelvesStatus: null,
  applyType: null,
  productName: "",
  createUser: null,
  image: "",
  productDescription: "",
  productCode: "",
  baseProductName: "",
  baseProductDescription: "",
  groupId: 0,
  groupName: "",
  sourceCode: "",
  baseImage: "",
  smallImage: "",
  largeImage: "",
  status: "",
  baseUnitId: 0,
  baseUnit: "",
  baseBarcode: "",
  hdSkuid: "",
  videoUrl: "",
  videoImage: "",
  baseQty: 0,
  limitQty: 0,
  queryStatus: null,
  invEnough: null,
  invNum: null,
  saleCount: null,
  positionName: null,
  dbId: null,
};

const roleRowData = {
  beginTime: null,
  endTime: null,
  title: "",
  page: 1,
  rows: 10,
  sidx: "createTime",
  sort: "desc",
};

const relationRowData = {
  id: null,
  activityId: null,
  page: 1,
  rows: 100,
};

const productRowData = {
  applyType: null,
  sectionName: null,
  productName: null,
  barcode: null,
  shelvesStatus: "VALID",
  expandType: "ASSIST_PRODUCT",
  page: 1,
  rows: 5,
};
const couponRowData = {
  couponName: "",
  couponBusinessType: "ACTIVITY_ASSIST_COUPON",
  page: 1,
  rows: 5,
  couponStatus: "VALID",
  sidx: "createTime",
  sort: "desc",
};

const relationTempColumns = [
  {
    title: "商品名称/券名称",
    key: "baseProductName",
    minWidth: 100,
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.type === "PROD") {
        return <div>{row.productStandard.baseProductName}</div>;
      } else if (row.type === "COUPON") {
        return <div>{row.couponConfigManage.couponName}</div>;
      }
    },
  },
  {
    title: "商品价格/券额度",
    key: "discountPrice",
    minWidth: 100,
    align: "center",
    render(h, params) {
      const { row } = params;
      if (row.type === "PROD") {
        return (
          <div>
            {fenToYuanDot2(
              row.productStandard.productStandardExpand.discountPrice
            )}
          </div>
        );
      } else if (row.type === "COUPON") {
        if (row.couponConfigManage.couponType === "DISCOUNT_COUPON") {
          return <div>{row.couponConfigManage.couponFee / 10 + "折"}</div>;
        } else {
          return <div>{fenToYuanDot2(row.couponConfigManage.couponFee)}</div>;
        }
      }
    },
  },
  {
    title: "商品/券类型",
    align: "center",
    key: "couponType",
    width: 120,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.type === "COUPON") {
        if (row.couponConfigManage.couponType === "FULL_CUT_COUPON") {
          return (
            <div>
              <tag color="magenta">
                {couponTypeConvert(row.couponConfigManage.couponType).label}
              </tag>
            </div>
          );
        } else if (row.couponConfigManage.couponType === "DISCOUNT_COUPON") {
          return (
            <div>
              <tag color="orange">
                {couponTypeConvert(row.couponConfigManage.couponType).label}
              </tag>
            </div>
          );
        } else if (row.couponConfigManage.couponType === "CASH_COUPON") {
          return (
            <div>
              <tag color="cyan">
                {couponTypeConvert(row.couponConfigManage.couponType).label}
              </tag>
            </div>
          );
        } else if (row.couponConfigManage.couponType === "FREIGHT_COUPON") {
          return (
            <div>
              <tag color="blue">
                {couponTypeConvert(row.couponConfigManage.couponType).label}
              </tag>
            </div>
          );
        }
        return <div>{row.couponConfigManage.couponType}</div>;
      } else if (row.type === "PROD") {
        if (
          row.productStandard.productStandardExpand.expandType ==
          "ASSIST_PRODUCT"
        ) {
          return (
            <div>
              <tag color="green">
                {
                  expandTypeConvert(
                    row.productStandard.productStandardExpand.expandType
                  ).label
                }
              </tag>
            </div>
          );
        }
      }
    },
  },
  // {
  //   title: "创建时间",
  //   key: "createTime",
  //   align: "center",
  //   minWidth: 100
  // },
  // {
  //   title: "修改时间",
  //   key: "updateTime",
  //   minWidth: 100
  // },
  {
    title: "排序",
    key: "rank",
    align: "center",
    minWidth: 100,
    // render: (h, params) => {
    //   if (params.row.isEdit) {
    //     return h("div", [
    //       h("InputNumber", {
    //         domProps: {
    //           value: params.row.rank
    //         },
    //         on: {
    //           input: function(event) {
    //             if (event > 0) {
    //               params.row.rank = event;
    //             }
    //           }
    //         }
    //       })
    //     ]);
    //   } else {
    //     return h("div", params.row.rank);
    //   }
    // }
  },
  {
    title: "商品库存总数",
    key: "activityLimit",
    align: "center",
    minWidth: 100,
    // render: (h, params) => {
    //   if (params.row.isEdit) {
    //     return h("div", [
    //       h("InputNumber", {
    //         domProps: {
    //           value: params.row.activityLimit
    //         },
    //         on: {
    //           input: function(event) {
    //             if (event > 0) {
    //               params.row.activityLimit = event;
    //             }
    //           }
    //         }
    //       })
    //     ]);
    //   } else {
    //     return h("div", params.row.activityLimit);
    //   }
    // }
  },
  {
    title: "需助力人数",
    key: "peopleNumber",
    align: "center",
    minWidth: 100,
    // render: (h, params) => {
    //   if (params.row.isEdit) {
    //     return h("div", [
    //       h("InputNumber", {
    //         domProps: {
    //           value: params.row.peopleNumber
    //         },
    //         on: {
    //           input: function(event) {
    //             if (event > 0) {
    //               params.row.peopleNumber = event;
    //             }
    //           }
    //         }
    //       })
    //     ]);
    //   } else {
    //     return h("div", params.row.peopleNumber);
    //   }
    // }
  },
  {
    title: "有效时长(小时)",
    key: "validHour",
    align: "center",
    minWidth: 100,
    // render: (h, params) => {
    //   if (params.row.isEdit) {
    //     return h("div", [
    //       h("InputNumber", {
    //         domProps: {
    //           value: params.row.validHour
    //         },
    //         on: {
    //           input: function(event) {
    //             if (event > 0) {
    //               params.row.validHour = event;
    //             }
    //           }
    //         }
    //       })
    //     ]);
    //   } else {
    //     return h("div", params.row.validHour);
    //   }
    // }
  },
  {
    title: "商品/券状态",
    align: "center",
    key: "status",
    minWidth: 100,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.status === "ON") {
        return (
          <div>
            <tag color="success">{"上架"}</tag>
          </div>
        );
      } else if (row.status === "OFF") {
        return (
          <div>
            <tag color="error">{"下架"}</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">{row.status}</tag>
        </div>
      );
    },
  },
];

const productColumns = [
  {
    type: "index",
    width: 60,
    align: "center",
  },
  {
    title: "规格id",
    key: "id",
    minWidth: 60,
    align: "center",
  },
  {
    title: "商品条码",
    key: "barcode",
    minWidth: 70,
    align: "center",
  },
  {
    title: "商品编号",
    key: "productCode",
    align: "center",
    minWidth: 120,
  },
  {
    title: "商品名称",
    key: "productName",
    minWidth: 100,
    align: "center",
  },
  {
    title: "商品规格",
    key: "specification",
    minWidth: 80,
    align: "center",
  },
  {
    title: "商品单位",
    key: "productUnit",
    minWidth: 80,
    align: "center",
  },
  {
    title: "助力价格",
    key: "price",
    minWidth: 80,
    align: "center",
    render(h, params, vm) {
      const amount = fenToYuanDot2(
        params.row.productStandardExpand.discountPrice
      );
      return <div>{amount}</div>;
    },
  },
  {
    title: "商品类型",
    minWidth: 120,
    key: "expandType",
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.productStandardExpand != null) {
        if (row.productStandardExpand.expandType == "DISCOUNT_PRODUCT") {
          return (
            <div>
              <tag color="magenta">
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == "PULL_NEW_PRODUCT") {
          return (
            <div>
              <tag color="orange">
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == "SECKILL_PRODUCT") {
          return (
            <div>
              <tag color="blue">
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == "ASSIST_PRODUCT") {
          return (
            <div>
              <tag color="green">
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        }
      } else {
        return (
          <div>
            <tag color="cyan">{"普通商品"}</tag>
          </div>
        );
      }
    },
  },
  {
    title: "排序",
    key: "rank",
    minWidth: 60,
    align: "center",
  },
];
const couponColumns = [
  {
    type: "index",
    width: 60,
    align: "center",
  },
  {
    title: "优惠券名称",
    key: "couponName",
    align: "center",
    minWidth: 80,
  },
  {
    title: "优惠券类型",
    align: "center",
    key: "couponType",
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === "FULL_CUT_COUPON") {
        return (
          <div>
            <tag color="magenta">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "DISCOUNT_COUPON") {
        return (
          <div>
            <tag color="orange">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "CASH_COUPON") {
        return (
          <div>
            <tag color="cyan">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "FREIGHT_COUPON") {
        return (
          <div>
            <tag color="blue">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    },
  },
  {
    title: "优惠/折扣额度",
    align: "center",
    key: "couponFee",
    minWidth: 80,
    render(h, params) {
      const { row } = params;
      if (row.couponType === "DISCOUNT_COUPON") {
        return <div>{row.couponFee / 10 + "折"}</div>;
      } else {
        return <div>{fenToYuanDot2(row.couponFee)}</div>;
      }
    },
  },
  {
    title: "最小购买金额",
    key: "minBuyFee",
    align: "center",
    minWidth: 80,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
    },
  },
  {
    title: "最高优惠金额",
    align: "center",
    key: "maxDiscountFee",
    minWidth: 40,
    render(h, params) {
      const { row } = params;
      if (row.maxDiscountFee != null) {
        return <div>{fenToYuanDot2(row.maxDiscountFee)}</div>;
      } else {
        return <div>{"N/A"}</div>;
      }
      return <div>{fenToYuanDot2(row.maxDiscountFee)}</div>;
    },
  },
  {
    title: "生效时间",
    key: "effectiveStartTime",
    align: "center",
    minWidth: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source == "SMALL" && row.validDateType === "FIXED_DATE") {
        return <div>{row.effectiveStartTime}</div>;
      } else if (
        row.source == "SMALL" &&
        row.validDateType === "UN_FIXED_DATE"
      ) {
        return <div>{row.beginDay}</div>;
      } else if (row.source == "HD") {
        return <div>{row.effectiveStartTime}</div>;
      } else {
        return <div>N/A</div>;
      }
    },
  },
  {
    title: "失效时间",
    key: "effectiveEndTime",
    align: "center",
    minWidth: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source == "SMALL" && row.validDateType === "FIXED_DATE") {
        if (!compareCouponData(row.effectiveEndTime)) {
          return <div style="color:red">{row.effectiveEndTime + "已过期"}</div>;
        } else {
          return <div>{row.effectiveEndTime}</div>;
        }
      } else if (
        row.source == "SMALL" &&
        row.validDateType === "UN_FIXED_DATE"
      ) {
        return <div>{row.endDay}</div>;
      } else if (row.source == "HD") {
        if (!compareCouponData(row.effectiveEndTime)) {
          return <div style="color:red">{row.effectiveEndTime + "已过期"}</div>;
        } else {
          return <div>{row.effectiveEndTime}</div>;
        }
      } else {
        return <div>N/A</div>;
      }
    },
  },
];
export default {
  components: {
    Tables,
    IViewUpload,
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        beginTime: [{ required: true, message: "请选择活动开始时间" }],
        endTime: [{ required: true, message: "请选择活动结束时间" }],
        status: [{ required: true, message: "请选择活动状态" }],
        title: [{ required: true, message: "请输入活动标题" }],
        receiveValidDays: [
          { required: true, message: "请输入领取奖励有效天数" },
        ],
        useValidDays: [{ required: true, message: "请输入使用奖励有效天数" }],
      },
      relationRuleInline: {
        activityLimit: [
          { required: true, message: "请输入商品库存总数" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            },
          },
        ],
        rank: [
          { required: true, message: "请输入商品排序" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            },
          },
        ],
        peopleNumber: [
          { required: true, message: "请输入需助力人数" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            },
          },
        ],
        validHour: [
          { required: true, message: "请输入有效时长(单位小时)" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            },
          },
        ],
        shareImage: [{ required: true, message: "请上传分享图片" }],
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      templatePageOpts: [5, 10],
      imageStatusEnum,
      editStatus: false,
      onSaleStatusEnum,
      topStatus: "PROD",
      discountPrice: "",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "活动ID",
          align: "center",
          key: "id",
        },
        {
          title: "活动标题",
          align: "center",
          key: "title",
        },
        {
          title: "开始时间",
          align: "center",
          key: "beginTime",
        },
        {
          title: "结束时间",
          align: "center",
          key: "endTime",
          render: (h, params, vm) => {
            const { row } = params;
            if (!compareCouponData(row.endTime)) {
              return <div style="color:red">{row.endTime + "已过期"}</div>;
            } else {
              return <div>{row.endTime}</div>;
            }
          },
        },
        {
          title: "修改时间",
          align: "center",
          key: "updateTime",
        },
        {
          title: "活动状态",
          align: "center",
          key: "status",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "ON") {
              return (
                <div>
                  <tag color="success">
                    {imageStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === "OFF") {
              return (
                <div>
                  <tag color="error">
                    {imageStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">{row.status ? row.status : "N/A"}</tag>
              </div>
            );
          },
        },
        {
          title: "领取奖励有效天数",
          align: "center",
          key: "receiveValidDays",
        },
        {
          title: "使用奖励有效天数",
          align: "center",
          key: "useValidDays",
        },
        {
          title: "操作",
          align: "center",
          minWidth: 80,
          key: "handle",
          // "delete",
          options: ["onSale", "view", "edit", "settings"],
        },
      ],
      relationColumns: [
        ...relationTempColumns,
        {
          title: "操作",
          align: "center",
          minWidth: 150,
          key: "handle",
          options: ["onSale", "view", "edit"],
        },
      ],
      productColumns: _.cloneDeep(productColumns),
      couponColumns: _.cloneDeep(couponColumns),
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRelationRowData: _.cloneDeep(relationRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      searchCouponRowData: _.cloneDeep(couponRowData),
      flashsaleDetail: _.cloneDeep(flashsaleDetail),
      relationProducts: [],
      addRelationDetail: _.cloneDeep(relationDetail),
      productDetail: _.cloneDeep(productDetail),
      products: [],
      coupons: [],
      productTotal: 0,
      couponsTotal: 0,
      activitiesRelevanceDetail: {},
      activitiesProductDetail: {},
      activitiesCouponDetail: {},
      modalRelevanceView: false,
      modalRelevanceEdit: false,
      proFlag: true,
    };
  },
  computed: {},
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
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    resetSearchCouponRowData() {
      this.searchCouponRowData = _.cloneDeep(couponRowData);
      this.getCouponTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
      this.addRelationDetail.shareImage = null;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.addRelationDetail.shareImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.addRelationDetail.shareImage = null;
      this.addRelationDetail.shareImage = fileList[0].url;
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.shareImage != null) {
        const map = { status: "finished", url: "url" };
        const mainImgArr = [];
        map.url = res.shareImage;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.flashsaleDetail.startTime > this.flashsaleDetail.endTime) {
            this.$Message.error("开始时间不能大于结束时间!");
            return;
          }
          if (this.flashsaleDetail.beginTime.toString().indexOf("T") > -1) {
            this.flashsaleDetail.beginTime = this.$moment(
              this.flashsaleDetail.beginTime
            ).format("YYYY-MM-DD HH:mm:ss");
          }
          if (this.flashsaleDetail.endTime.toString().indexOf("T") > -1) {
            this.flashsaleDetail.endTime = this.$moment(
              this.flashsaleDetail.endTime
            ).format("YYYY-MM-DD HH:mm:ss");
          }
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createAssist();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editAssist();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createAssist() {
      this.modalViewLoading = true;
      createAssist(this.flashsaleDetail)
        .then((res) => {
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
    editAssist() {
      this.modalViewLoading = true;
      this.flashsaleDetail.beginTime = this.$moment(
        this.flashsaleDetail.beginTime
      ).format("YYYY-MM-DD HH:mm:ss");
      this.flashsaleDetail.endTime = this.$moment(
        this.flashsaleDetail.endTime
      ).format("YYYY-MM-DD HH:mm:ss");

      editAssist(this.flashsaleDetail)
        .then((res) => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.$Message.success("修改成功!");
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addFlashsale() {
      this.editStatus = false;
      // this.resetFields();
      this.tempModalType = this.modalType.create;
      this.flashsaleDetail = _.cloneDeep(flashsaleDetail);
      this.modalEdit = true;
    },
    // 删除
    // handleDelete(params) {
    //   this.tableDataSelected = [];
    //   this.tableDataSelected.push(params.row);
    //   this.deleteTable(params.row.id);
    // },
    deleteTable(ids) {
      this.loading = true;
      deleteAssist({
        ids,
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
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.flashsaleDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      // this.resetFields();
      this.editStatus = !compareCouponData(params.row.beginTime);
      this.tempModalType = this.modalType.edit;
      this.flashsaleDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getAssistPages(this.searchRowData)
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
    getRelationTableData() {
      getAssistProductRelationPages(this.searchRelationRowData)
        .then((res) => {
          // 设置行是否可编辑
          // if (res && res.rows.length > 0) {
          res.rows.forEach((element) => {
            element.isEdit = false;
          });
          this.relationProducts = res.rows;
          // }
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    onOff(params) {
      this.flashsaleDetail = this._.cloneDeep(params.row);
      if (params.row.status === "ON") {
        this.flashsaleDetail.status = "OFF";
      } else {
        this.flashsaleDetail.status = "ON";
      }
      this.loading = true;
      this.editAssist();
    },
    startTimeChange(value, date) {
      this.flashsaleDetail.beginTime = value;
    },
    endTimeChange(value, date) {
      this.flashsaleDetail.endTime = value;
    },
    // ====
    edBeginTimeChange(value) {
      this.searchRowData.beginTime = value;
    },
    edFinishTimeChange(value) {
      this.searchRowData.endTime = value;
    },
    onRelevance(params) {
      this.tempModalType = null;
      (this.addRelationDetail = _.cloneDeep(relationDetail)),
        (this.uploadListMain = []);
      // FIXME 查询商品规格分页信息（后期按钮触发，或者先存储，需要时再调用接口）
      this.getProductTableData();
      this.getCouponTableData();
      // 查询限时抢购关联商品
      this.searchRelationRowData.activityId = params.row.id;
      this.addRelationDetail.activityId = params.row.id;
      this.getRelationTableData();
      this.modalEdit = true;
    },
    addTempData(name) {
      if (this.addRelationDetail.type === "PROD") {
        if (this.addRelationDetail.standardId === 0) {
          this.$Message.error("请选择一个要关联的商品或券!");
          return;
        }
      }
      if (this.addRelationDetail.type === "COUPON") {
        if (this.addRelationDetail.couponConfigId === 0) {
          this.$Message.error("请选择一个要关联的商品或券!");
          return;
        }
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.createRelation();
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    // modalHandleEdit(params) {
    //   this.$set(params.row, "isEdit", true);
    // },
    // modalHandleSave(params) {
    //   const row = params.row;
    //   // if (
    //   //   row.id == null ||
    //   //   row.id == 0 ||
    //   //   row.salePrice <= 0 ||
    //   //   row.goodsLimit <= 0 ||
    //   //   row.userLimit <= 0
    //   // ) {
    //   //   this.$Message.error("请输入非0数");
    //   //   return;
    //   // }
    //   // this.tempTableLoading = true;
    //   // 如果前端没有剩余数量字段,则初始化剩余数量=商品数量
    //   // row.remainCount = row.goodsLimit;
    //   editAssistProductRelation(row)
    //     .then(res => {
    //       this.getRelationTableData();
    //     })
    //     .finally(res => {
    //       this.tempTableLoading = false;
    //     });
    //   this.tempTableLoading = false;
    //   this.$set(params.row, "isEdit", false);
    // },
    modalHandleDelete(params) {
      this.tempTableLoading = true;
      deleteAssistProductRelation({ ids: params.row.id })
        .then((res) => {
          this.relationProducts = this.relationProducts.filter(
            (item, index) => index !== params.row.initRowIndex
          );
          this.getRelationTableData();
        })
        .finally((res) => {
          this.tempTableLoading = false;
        });
    },
    getProductTableData() {
      this.loading = true;
      getProductStandardsPages(this.searchProductRowData).then((res) => {
        this.products = res.rows;
        this.productTotal = res.total;
        this.loading = false;
        this.searchLoading = false;
      });
    },
    getCouponTableData() {
      this.loading = true;
      getCouponPagess(this.searchCouponRowData).then((res) => {
        this.coupons = res.rows;
        this.couponsTotal = res.total;
        this.loading = false;
        this.searchLoading = false;
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
    changeCouponPage(page) {
      this.searchCouponRowData.page = page;
      this.getCouponTableData();
    },
    changeCouponPageSize(pageSize) {
      this.searchCouponRowData.page = 1;
      this.searchCouponRowData.rows = pageSize;
      this.getCouponTableData();
    },
    handleProductSearch() {
      this.searchProductRowData.page = 1;
      // this.searchLoading = true;
      this.getProductTableData();
    },
    handleProductClear() {
      // 重置数据
      this.resetSearchProductRowData();
      this.page = 1;
      this.pageSize = 10;
      // this.clearSearchLoading = true;
      this.handleProductSearch();
    },
    handleCouponSearch() {
      this.searchCouponRowData.page = 1;
      // this.searchLoading = true;
      this.getCouponTableData();
    },
    handleCouponClear() {
      // 重置数据
      this.resetSearchCouponRowData();
      this.page = 1;
      this.pageSize = 10;
      // this.clearSearchLoading = true;
      this.handleCouponSearch();
    },
    onProductSelectionAll(selection) {
      this.addRelationDetail.standardId = selection
        .map((item) => item.id.toString())
        .join(",");
    },
    onProductSelectionChange(selection) {
      this.addRelationDetail.standardId = selection
        .map((item) => item.id.toString())
        .join(",");
    },
    handleTemplateChange(currentRow, oldCurrentRow) {
      const couponTemplate = currentRow;
      const mark = [];
      mark.push(currentRow);
      if (this.addRelationDetail.type === "PROD") {
        const activityProducts = this.relationProducts;
        const standardIds = [];
        for (var item = 0; item < activityProducts.length; item++) {
          standardIds.push(activityProducts[item].standardId);
        }
        if (
          standardIds.indexOf(currentRow.productStandardExpand.standardId) != -1
        ) {
          this.proFlag = false;
          this.$Message.error("活动商品已存在");
        } else {
          this.proFlag = true;
        }
        this.addRelationDetail.standardId = mark
          .map((item) => item.id.toString())
          .join(",");
        this.addRelationDetail.status = "ON";
        this.addRelationDetail.couponConfigManage = null;
        this.addRelationDetail.couponConfigId = null;
        this.addRelationDetail.productStandard = couponTemplate;
      } else if (this.addRelationDetail.type === "COUPON") {
        const activityProducts = this.relationProducts;
        const couponIds = [];
        for (var item = 0; item < activityProducts.length; item++) {
          couponIds.push(activityProducts[item].couponConfigId);
        }
        if (couponIds.indexOf(currentRow.id) != -1) {
          this.proFlag = false;
          this.$Message.error("活动优惠券已存在");
        } else {
          this.proFlag = true;
        }
        this.addRelationDetail.couponConfigId = mark
          .map((item) => item.id.toString())
          .join(",");
        this.addRelationDetail.status = "ON";
        this.addRelationDetail.productStandard = null;
        this.addRelationDetail.standardId = null;
        this.addRelationDetail.couponConfigManage = couponTemplate;
      }
    },
    priceInputNumberOnchange(value) {
      this.addRelationDetail.price = yuanToFenNumber(value);
    },
    salePriceInputNumberOnchange(value) {
      this.addRelationDetail.salePrice = yuanToFenNumber(value);
    },
    createRelation() {
      this.modalViewLoading = true;
      createAssistProductRelation(this.addRelationDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getRelationTableData();
          this.topStatus = "PROD";
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    assistDataChange(e) {
      const index = e.currentTarget.dataset.index;
      if (this.topStatus === index) {
        return;
      }
      this.topStatus = index;
      this.addRelationDetail.type = this.topStatus;
    },
    // 查看商品/券详情
    handleRelevanceView(params) {
      this.activitiesRelevanceDetail = _.cloneDeep(params.row);
      if (params.row.type === "PROD") {
        this.activitiesProductDetail = _.cloneDeep(params.row.productStandard);
        this.discountPrice = _.cloneDeep(
          params.row.productStandard.productStandardExpand.discountPrice / 100
        );
      } else if (params.row.type === "COUPON") {
        this.activitiesCouponDetail = _.cloneDeep(
          params.row.couponConfigManage
        );
      }
      this.modalRelevanceView = true;
    },
    handleRelevanceClose() {
      this.activitiesRelevanceDetail = {};
      this.activitiesProductDetail = {};
      this.activitiesCouponDetail = {};
      this.modalRelevanceView = false;
    },
    handleRelevanceEdit(params) {
      this.addRelationDetail = _.cloneDeep(params.row);
      this.modalRelevanceEdit = true;
    },
    handleEditRelevanceClose() {
      this.modalRelevanceEdit = false;
      this.uploadListMain = [];
    },
    handleconfirmEdit() {
      editAssistProductRelation(this.addRelationDetail)
        .then((res) => {
          this.modalRelevanceEdit = false;
          this.$Message.success("修改成功!");
          this.getRelationTableData();
          (this.addRelationDetail = _.cloneDeep(relationDetail)),
            (this.uploadListMain = []);
          // this.uploadListMain = [];
        })
        .finally((res) => {
          this.tempTableLoading = false;
        });
    },
    // 上下架
    switchStatus(params) {
      // this.relationProducts.status = this._.cloneDeep(params.row.status);
      if (params.row.status === "ON") {
        params.row.status = "OFF";
      } else {
        params.row.status = "ON";
      }
      this.loading = true;
      // console.log("上下架", params.row);
      editAssistProductRelation(params.row)
        .then((res) => {
          this.getRelationTableData();
        })
        .finally((res) => {
          this.tempTableLoading = false;
        });
      this.tempTableLoading = false;
      this.$set(params.row, "isEdit", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabChange {
  height: 50px;
  width: 230px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  bottom: 0;
  left: 0;
  background-color: #fff;
  border: 1px solid rgb(232, 234, 236);
  border-radius: 10px 10px 0 0;
  b {
    display: block;
    width: 113px;
    height: 48px;
    cursor: pointer;
    line-height: 50px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  }
}
.hot {
  display: inline-block;
  // color: red;
  background: rgb(245, 247, 249);
}
</style>
