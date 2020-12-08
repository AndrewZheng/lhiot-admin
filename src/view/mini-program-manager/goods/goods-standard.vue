<template>
  <div class="m-content">
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
        highlight-row
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-discount="handleDiscount"
        @custom-on-sale="customOnSale"
        @on-current-change="onCurrentChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row v-show="!showBack">
            <Input
              v-model="searchRowData.barcode"
              placeholder="商品条码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.productCode"
              placeholder="商品编号"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.productName"
              placeholder="商品名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.shelvesStatus"
              class="search-col"
              placeholder="上架状态"
              style="width:100px"
              clearable
            >
              <Option
                v-for="item in shelvesStatus"
                :key="item.value"
                :value="item.value"
                class="ml15 mt10 mr15"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.productType"
              class="ml5"
              placeholder="商品类型"
              style="width:100px"
              clearable
            >
              <Option
                v-for="item in expandTypeEnum"
                :key="item.value"
                :value="item.value"
                class="ml15 mt10 mr15"
              >{{ item.label }}</Option>
            </Select>
            <InputNumber
              v-model="searchMinPrice"
              placeholder="最低价格"
              class="search-input mr5"
              style="width: auto"
              clearable
              @on-change="searchMinPriceChange"
            ></InputNumber>
            <InputNumber
              v-model="searchMaxPrice"
              placeholder="最高价格"
              class="search-input mr5"
              style="width: auto"
              clearable
              @on-change="searchMaxPriceChange"
            ></InputNumber>
            <Button
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
          </Row>
          <div class="ml15 mt10">
            <i style="color:red">*</i> 选中单条数据再点击添加,可复制当前数据
          </div>
        </div>
        <div slot="operations">
          <Button
            v-show="showBack"
            v-waves
            class="search-btn ml5 mr5"
            type="primary"
            @click="goBack"
          >
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
          <Button v-waves class="search-btn ml5 mr5" type="success" @click="handleCreateView">
            <Icon type="md-add" />&nbsp;添加
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
          <Button class="search-btn mr2" type="warning" @click="handleDownload">
            <Icon type="md-download" />导出
          </Button>
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

    <Modal v-model="modalView" :mask-closable="false" :width="700">
      <p slot="header">
        <span>商品规格详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品ID:</i-col>
              <i-col span="16">{{ productStandardDetail.productId }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{ productStandardDetail.baseProductName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品分类:</i-col>
              <i-col span="16">{{ productStandardDetail.groupName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">基础单位:</i-col>
              <i-col span="16">{{ productStandardDetail.baseUnit }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品编号:</i-col>
              <i-col span="16">{{ productStandardDetail.productCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品条码:</i-col>
              <i-col span="16">{{ productStandardDetail.baseBarcode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品主图:</i-col>
              <i-col span="16">
                <img :src="productStandardDetail.baseImage" width="100" height="100">
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品描述:</i-col>
              <i-col span="16">{{ productStandardDetail.baseProductDescription }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">商品规格</Divider>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品名称:</i-col>
              <i-col span="16">{{ productStandardDetail.productName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品描述:</i-col>
              <i-col span="16">{{ productStandardDetail.productDescription }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品主图:</i-col>
              <i-col v-if="productStandardDetail.image" span="16">
                <img :src="productStandardDetail.image" width="100" height="100">
              </i-col>
            </Row>
          </i-col>
          <!-- <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品详情图:</i-col>
              <i-col v-if="productStandardDetail.detailImage" span="16">
                <img :src="productStandardDetail.detailImage" width="100" height="100" />
              </i-col>
            </Row>
          </i-col>-->
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品条码:</i-col>
              <i-col span="16">{{ productStandardDetail.barcode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品状态:</i-col>
              <i-col span="16">{{ productStandardDetail.shelvesStatus | customPlanStatusFilters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品规格:</i-col>
              <i-col span="16">{{ productStandardDetail.specification }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">数量/重量:</i-col>
              <i-col span="16">{{ productStandardDetail.standardQty }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品原价:</i-col>
              <i-col span="16">{{ productStandardDetail.price| fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">售卖价格:</i-col>
              <i-col span="16">{{ productStandardDetail.salePrice | fenToYuanDot2Filters }}</i-col>
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
              <i-col span="8">商品单位:</i-col>
              <i-col span="16">{{ productStandardDetail.productUnit }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品排序:</i-col>
              <i-col span="16">{{ productStandardDetail.rank }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">规格描述:</i-col>
              <i-col span="16">
                <div
                  v-for="item in descriptionList"
                  :key="item.id"
                  :v-show="descriptionList"
                  class="demo-upload-list"
                >
                  <img :src="item">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">分享图片:</i-col>
              <i-col span="16">
                <img :src="productStandardDetail.shareImage" width="100" height="100">
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <!-- 添加 -->
    <Modal v-model="modalEdit" :mask-closable="false" :width="900">
      <p slot="header">
        <span>{{ clickFlag==false?'编辑商品规格':'创建商品规格' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="productStandardDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <i-col span="12">
              <FormItem label="商品ID:" prop="productId">
                <Input v-model="productStandardDetail.productId" readonly="readonly">
                <Button slot="append" icon="ios-search" @click="handleRelation"></Button>
                </Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品名称:">{{ productStandardDetail.baseProductName }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品分类:">{{ productStandardDetail.groupName }}</FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="基础单位:">{{ productStandardDetail.baseUnit }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品编号:">{{ productStandardDetail.productCode }}</FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品条码:">{{ productStandardDetail.baseBarcode }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem v-if="productStandardDetail.baseImage" label="商品主图:">
                <img :src="productStandardDetail.baseImage" width="100" height="100">
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品描述:">{{ productStandardDetail.baseProductDescription }}</FormItem>
            </i-col>
          </Row>
          <Divider orientation="center">规格信息</Divider>
          <Row>
            <i-col span="12">
              <FormItem label="上架商品名称:" prop="productName">
                <Input v-model="productStandardDetail.productName"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="上架商品描述:" prop="productDescription">
                <Input v-model="productStandardDetail.productDescription"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="上架商品主图:建议尺寸;400x400(单位:px):" prop="image">
                <Input v-show="false" v-model="productStandardDetail.image" style="width: auto"></Input>
                <div
                  v-for="item in uploadListMain"
                  :key="item.url"
                  :v-show="productStandardDetail.image"
                  class="demo-upload-list"
                >
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url">
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
                  :max-num="1"
                  group-type="base_image"
                  file-dir="product"
                  @on-success="handleSuccessMain"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
            <!-- <i-col span="12">
              <FormItem label="上架商品详情图:建议尺寸;690x340(单位:px)" prop="detailImage">
                <Input
                  v-show="false"
                  v-model="productStandardDetail.detailImage"
                  style="width: auto"
                ></Input>
                <div
                  v-for="item in uploadListDetail"
                  :key="item.url"
                  :v-show="productStandardDetail.detailImage"
                  class="demo-upload-list"
                >
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveDetail(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadDetail"
                  :default-list="defaultListDetail"
                  :image-size="imageSize"
                  :max-num="1"
                  @on-success="handleSuccessDetail"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>-->
            <!-- 轮播图 -->
            <i-col span="12">
              <FormItem label="上架商品轮播图:建议尺寸;710x710(单位:px)" prop="rotationImage">
                <Input
                  v-show="false"
                  v-model="productStandardDetail.rotationImage"
                  style="width: auto"
                ></Input>
                <div
                  v-for="item in uploadListMultiple_"
                  :key="item.url"
                  :v-show="productStandardDetail.rotationImage"
                  class="demo-upload-list"
                >
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url">
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveMultiple_(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadMultiple_"
                  :default-list="defaultListMultiple_"
                  :image-size="imageSize"
                  :max-num="10"
                  group-type="base_image"
                  file-dir="product"
                  multiple
                  @on-success="handleSuccessMultiple_"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品条码:" prop="barcode">
                <Input v-model="productStandardDetail.barcode"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品状态:" prop="shelvesStatus">
                <Select v-model="productStandardDetail.shelvesStatus">
                  <Option
                    v-for="(item,index) in shelvesStatus"
                    :key="index"
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
              <FormItem label="商品规格:" prop="specification">
                <Input
                  v-model="productStandardDetail.specification"
                  @on-blur="productStandardChange"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="数量/重量:" prop="standardQty">
                <InputNumber v-model="productStandardDetail.standardQty" :min="0"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品单位:" prop="unitId">
                <Select v-model="productStandardDetail.unitId" @on-change="unitChange">
                  <Option
                    v-for="(item,index) in unitsList"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品排序:" prop="rank">
                <InputNumber v-model="productStandardDetail.rank" :min="0"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品原价:" prop="price">
                <InputNumber :min="0" :value="priceComputed" @on-change="priceInputNumberOnchange"></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="售卖价格:" prop="salePrice">
                <InputNumber
                  :min="0"
                  :value="salePriceComputed"
                  @on-change="salePriceInputNumberOnchange"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <!--  @on-change="productTypeChange" -->
            <i-col span="12">
              <FormItem :label-width="100" label="商品类型:" prop="productType">
                <Select
                  v-model="productStandardDetail.productType"
                  placeholder="请选择"
                  style="padding-right: 5px;width: 120px"
                  @on-change="productTypeChange"
                >
                  <Option
                    v-for="(item,index) in expandTypeEnum"
                    :key="index"
                    :value="item.value"
                    :disabled="clickFlag==false"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col v-show="productStandardDetail.productType==='ORDINARY_PRODUCT'" span="12">
              <FormItem label="起购份数:" prop="startNum">
                <InputNumber v-model="productStandardDetail.startNum" :min="1"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <!-- <i-col span="12">
              <FormItem label="SVIP价格:" prop="svipPrice">
                <InputNumber
                  :min="0"
                  :value="svipPriceComputed"
                  @on-change="svipPriceInputNumberOnchange"
                ></InputNumber>
              </FormItem>
            </i-col>-->
            <i-col span="12" style="float:right;margin-bottom:15px;margin-right:-30px">
              <Button v-waves type="warning" @click="handleHdSvipPrice">海鼎价格参考</Button>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="规格描述(推荐宽度为750px，高度自适应):" prop="description">
                <Input
                  v-show="false"
                  v-model="productStandardDetail.description"
                  style="width: auto"
                ></Input>
                <div
                  v-for="item in uploadListMultiple"
                  :key="item.url"
                  :v-show="productStandardDetail.description"
                  class="demo-upload-list"
                >
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url">
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveMultiple(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadMultiple"
                  :default-list="defaultListMultiple"
                  :image-size="imageSize"
                  :max-num="10"
                  group-type="base_image"
                  file-dir="product"
                  multiple
                  @on-success="handleSuccessMultiple"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
            <i-col span="12" style="float:right;margin-bottom:15px;margin-right:-30px">
              <Button v-waves type="info" @click="handleImageSort">规格描述排序</Button>
            </i-col>
          </Row>
          <!-- 分享图片 -->
          <Row>
            <i-col span="12">
              <FormItem label="商品分享图片:建议尺寸;500x400(单位:px):" prop="shareImage">
                <Input
                  v-show="false"
                  v-model="productStandardDetail.shareImage"
                  style="width: auto"
                ></Input>
                <div
                  v-for="item in uploadListShar"
                  :key="item.url"
                  :v-show="productStandardDetail.shareImage"
                  class="demo-upload-list"
                >
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url">
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveShar(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadShar"
                  :default-list="defaultListShar"
                  :image-size="imageSize"
                  :max-num="1"
                  group-type="base_image"
                  file-dir="product"
                  @on-success="handleSuccessShar"
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
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('editForm')">确定</Button>
      </div>
    </Modal>
    <!-- 折扣配置 -->
    <Modal v-model="modalDiscount" :mask-closable="false" :width="700" title="折扣配置">
      <p slot="header">
        <span>折扣配置</span>
      </p>
      <div class="modal-content">
        <Form ref="modalDiscount" :model="proStandardExpand" :label-width="100">
          <Row>
            <i-col span="12">
              <FormItem label="上架商品规格ID:" prop="id">
                <Input v-model="productStandardDetail.id" disabled></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="上架商品名称:" prop="productName">
                <Input v-model="productStandardDetail.productName" disabled></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品原价:" prop="price">
                <InputNumber :min="0" :value="priceComputed" placeholder="商品原价" disabled></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="售卖价格:">
                <InputNumber :min="0" :value="salePriceComputed" disabled></InputNumber>
              </FormItem>
            </i-col>
            <!-- <i-col span="12">
              <FormItem label="SVIP价格:">
                <InputNumber :min="0" :value="svipPriceComputed" disabled></InputNumber>
              </FormItem>
            </i-col>-->
          </Row>
          <Row>
            <i-col span="12">
              <Row style="margin-left:36px">
                <i-col span="5">商品类型:</i-col>
                <i-col v-if="productStandardDetail.productType === 'DISCOUNT_PRODUCT'" span="16">
                  <tag color="magenta">{{ "折扣商品" }}</tag>
                </i-col>
                <i-col
                  v-else-if="productStandardDetail.productType === 'PULL_NEW_PRODUCT'"
                  span="16"
                >
                  <tag color="orange">{{ "老拉新商品" }}</tag>
                </i-col>
                <i-col
                  v-else-if="productStandardDetail.productType === 'SECKILL_PRODUCT'"
                  span="16"
                >
                  <tag color="blue">{{ "限时秒杀商品" }}</tag>
                </i-col>
                <i-col v-else-if="productStandardDetail.productType === 'ASSIST_PRODUCT'" span="16">
                  <tag color="green">{{ "助力抢爆品商品" }}</tag>
                </i-col>
                <i-col v-else-if="productStandardDetail.productType === 'SHARE_PRODUCT'" span="16">
                  <tag color="green">{{ "分享赚商品" }}</tag>
                </i-col>
                <i-col v-else-if="productStandardDetail.productType === null" span="16">{{ "N/A" }}</i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <FormItem label="最低库存:" prop="limitQty">
                <InputNumber v-model="proStandardExpand.limitQty"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row v-if="productStandardDetail.productType==='DISCOUNT_PRODUCT'">
            <i-col span="12">
              <FormItem label="限购份数:" prop="limitNum">
                <Input v-model="proStandardExpand.limitNum"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="起购份数:" prop="startNum">
                <Input v-model="proStandardExpand.startNum" :min="1"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="活动价:">
                <InputNumber
                  :min="0"
                  :max="salePriceComputed > 0? salePriceComputed: priceComputed"
                  :value="discountPriceComputed"
                  @on-change="calDiscountRate"
                ></InputNumber>
                <div v-if="productStandardDetail.productType==='DISCOUNT_PRODUCT'">（以售卖价格优先计算折扣率）</div>
              </FormItem>
            </i-col>
            <!-- v1.8.0 -->
            <i-col v-if="productStandardDetail.productType==='SHARE_PRODUCT'" span="8">
              <FormItem label="佣金比例(单位%):" prop="commissionRate">
                <InputNumber v-model="proStandardExpand.commissionRate"></InputNumber>
              </FormItem>
            </i-col>
            <i-col v-if="productStandardDetail.productType==='DISCOUNT_PRODUCT'" span="8">
              <FormItem label="折扣率:" prop="discountRate">
                <Input v-model="proStandardExpand.discountRate" readonly></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleDiscountClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmitDiscount">确定</Button>
      </div>
    </Modal>

    <Modal v-model="modalProduct" :width="1000" title="关联商品">
      <Card>
        <tables
          ref="dataTables"
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
        <div style="margin: 10px;overflow: hidden">
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

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>

    <Modal v-model="modalSort" :mask-closable="false" title="图片排序">
      <p slot="header">
        <span>图片排序</span>
      </p>
      <div class="modal-content">
        <drag-list
          :list1.sync="uploadListMultiple"
          :drop-con-class="dropConClass"
          class="clearfix"
          @on-change="handleChange"
        >
          <img
            slot="left"
            slot-scope="left"
            :src="left.itemLeft.url"
            class="drag-item"
            width="80"
            height="80"
          >
        </drag-list>
      </div>
      <div slot="footer">
        <Button @click="modalSort=false">关闭</Button>
        <Button type="primary" @click="handleImgSort">确定</Button>
      </div>
    </Modal>
    <!-- 海鼎会员价 -->
    <Modal v-model="modalHdSvip" :width="800" :mask-closable="false" draggable scrollable>
      <p slot="header">
        <span>海鼎SVIP价格参考</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{ HdSvipInfo.gname }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">商品状态:</i-col>
              <i-col span="16">{{ HdSvipInfo.busname }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">商品编码:</i-col>
              <i-col span="16">{{ HdSvipInfo.code }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">条码:</i-col>
              <i-col span="16">{{ HdSvipInfo.code2 }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">商品描述:</i-col>
              <i-col span="16">{{ HdSvipInfo.description }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">商品分类:</i-col>
              <i-col span="16">{{ HdSvipInfo.sortcode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">基础单位:</i-col>
              <i-col span="16">{{ HdSvipInfo.munit }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">规格:</i-col>
              <i-col span="16">{{ HdSvipInfo.qpcstr }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">海鼎售价:</i-col>
              <i-col span="16">{{ HdSvipInfo.rtlprc }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">海鼎会员价:</i-col>
              <i-col span="16">{{ HdSvipInfo.mbrprc }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">SVIP价格:</i-col>
              <i-col span="16">{{ HdSvipInfo.svipprc }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">SVIP折扣:</i-col>
              <i-col span="16">{{ HdSvipInfo.svipzk }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleHdSvipClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import DragList from '_c/drag-list';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  createProductStandard,
  deleteProductStandard,
  getProStandardExpand,
  getProductStandardsPages,
  modifyProStandardExpand,
  editProductStandard,
  getProductUnits,
  getProductPages,
  getHdProductInfo,
  deletePicture
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  getSmallGoodsStandard,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from '@/libs/util';
import { expandTypeEnum } from '@/libs/enumerate';
import {
  customPlanStatusConvert,
  productStatusConvert,
  expandTypeConvert
} from '@/libs/converStatus';

const productStandardDetail = {
  id: 0,
  productId: 0,
  barcode: '',
  productType: '',
  specification: '',
  standardQty: 0,
  unitId: '',
  productUnit: '',
  price: 0,
  rotationImage: null,
  salePrice: 0,
  startNum: 1,
  rank: 0,
  description: null,
  shelvesStatus: null,
  applyType: '',
  productName: '',
  createUser: null,
  image: null,
  detailImage: null,
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
  dbId: null,
  svipPrice: null,
  shareImage: null
};

const roleRowData = {
  productId: '',
  barcode: '',
  productCode: '',
  productType: '',
  productName: '',
  shelvesStatus: null,
  minPrice: '',
  maxPrice: '',
  page: 1,
  rows: 10
};

const productDetail = {
  id: 0,
  productCode: '',
  productName: '',
  groupId: 0,
  sourceCode: '',
  image: '',
  smallImage: '',
  largeImage: '',
  status: null,
  unitId: '',
  baseBarcode: '',
  hdSkuid: '',
  videoUrl: '',
  videoImage: '',
  baseQty: 0,
  limitQty: 0,
  description: '',
  unitName: '',
  groupName: '',
  createUser: '',
  expandType: ''
};

const productRowData = {
  groupId: null,
  productCode: null,
  productName: null,
  status: 'NORMAL',
  page: 1,
  rows: 10
};

const proStandardExpand = {
  id: null,
  discountPrice: 0,
  discountRate: 0,
  limitNum: 0,
  standardId: 0,
  startNum: 1,
  // expandType: "DISCOUNT_PRODUCT",
  limitQty: 0,
  commissionRate: 0
};

export default {
  components: {
    Tables,
    IViewUpload,
    DragList
  },
  mixins: [uploadMixin, deleteMixin, searchMixin, tableMixin],
  data() {
    return {
      unitsList: [],
      descriptionList: [],
      rotationImageList: [],
      defaultListMain: [],
      defaultListShar: [],
      defaultListMultiple: [],
      defaultListMultiple_: [],
      defaultListDetail: [],
      uploadListMain: [],
      uploadListShar: [],
      uploadListDetail: [],
      uploadListMultiple: [],
      uploadListMultiple_: [],
      expandTypeEnum,
      clickFlag: '',
      ruleValidate: {
        limitNum: [
          { required: false, message: '请输入限购份数', trigger: 'blur' }
        ],
        startNum: [
          { required: false, message: '请输入起购份数', trigger: 'blur' }
        ],
        discountPrice: [
          { required: true, message: '请输入活动价格', trigger: 'change' }
        ],
        discountRate: [
          { required: false, message: '请计算折扣率', trigger: 'change' }
        ]
      },
      ruleInline: {
        productId: [
          { required: true, message: '请选择关联商品' },
          {
            message: '请选择要关联的商品',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        productName: [{ required: true, message: '请选择上架商品名称' }],
        description: [{ required: true, message: '请上传规格描述图' }],
        image: [{ required: true, message: '请上传上架商品主图' }],
        availableStatus: [{ required: true, message: '请选择商品分类' }],
        unitId: [{ required: true, message: '请选择商品单位' }],
        productType: [{ required: true, message: '请选择商品类型' }],
        productDescription: [{ required: true, message: '请输入上架商品描述' }],
        shelvesStatus: [{ required: true, message: '请选择商品状态' }],
        specification: [{ required: true, message: '请输入商品规格' }],
        price: [
          { required: true, message: '请输入商品价格' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        salePrice: [
          { required: true, message: '请输入售卖价格' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        barcode: [
          { required: true, message: '请输入商品条码' }
          // {
          //   validator(rule, value, callback, source, options) {
          //     const errors = [];
          //     if (!/^[0-9]\d*$/.test(value)) {
          //       errors.push(new Error("必须为整数"));
          //     }
          //     callback(errors);
          //   }
          // }
        ],
        specificationQty: [
          { required: true, message: '请输入安全库存' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        rank: [
          { required: true, message: '请输入商品排序' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        standardQty: [
          { required: true, message: '请输入重量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(value)) {
                errors.push(new Error('必须为大于0的数字'));
              }
              callback(errors);
            }
          }
        ]
      },
      columns: [
        {
          type: 'selection',
          key: '',
          minWidth: 50,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '规格ID',
          align: 'center',
          key: 'id',
          minWidth: 50
        },
        {
          title: '商品条码',
          align: 'center',
          key: 'barcode',
          minWidth: 70
        },
        {
          title: '商品编号',
          key: 'productCode',
          align: 'center',
          minWidth: 100
        },
        {
          title: '商品名称',
          align: 'center',
          key: 'productName',
          minWidth: 100
        },
        {
          title: '商品规格',
          align: 'center',
          key: 'specification',
          minWidth: 80
        },
        {
          title: '商品单位',
          align: 'center',
          minWidth: 80,
          key: 'productUnit'
        },
        {
          title: '商品原价',
          align: 'center',
          minWidth: 60,
          key: 'price',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: '售卖价格',
          align: 'center',
          minWidth: 60,
          key: 'salePrice',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.salePrice);
            return <div>{amount}</div>;
          }
        },
        // {
        //   title: "SVIP价格",
        //   align: "center",
        //   minWidth: 60,
        //   key: "svipPrice",
        //   render(h, params, vm) {
        //     const amount = fenToYuanDot2(params.row.svipPrice);
        //     return <div>{amount}</div>;
        //   }
        // },
        {
          title: '商品类型',
          minWidth: 100,
          key: 'productType',
          align: 'center',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.productType == 'DISCOUNT_PRODUCT') {
              return (
                <div>
                  <tag color='magenta'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'PULL_NEW_PRODUCT') {
              return (
                <div>
                  <tag color='orange'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'SECKILL_PRODUCT') {
              return (
                <div>
                  <tag color='blue'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'ASSIST_PRODUCT') {
              return (
                <div>
                  <tag color='green'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'SHARE_PRODUCT') {
              return (
                <div>
                  <tag color='green'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'ORDINARY_PRODUCT') {
              return (
                <div>
                  <tag color='cyan'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            }
          }
        },
        {
          title: '商品状态',
          minWidth: 80,
          key: 'shelvesStatus',
          align: 'center',
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
          title: '起购份数',
          key: 'startNum',
          minWidth: 60,
          align: 'center'
        },
        {
          title: '商品排序',
          align: 'center',
          minWidth: 60,
          key: 'rank'
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 180,
          key: 'handle',
          options: ['customOnSale', 'view', 'edit', 'discount']
        }
      ],
      productColumns: [
        {
          title: '商品图片',
          key: 'image',
          align: 'center',
          minWidth: 120,
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.image} height='60' width='60' />;
            return <div>{str}</div>;
          }
        },
        {
          title: '商品编码',
          key: 'productCode',
          sortable: true,
          align: 'center',
          minWidth: 140
        },
        {
          title: '商品名称',
          align: 'center',
          sortable: true,
          key: 'productName',
          minWidth: 120
        },
        {
          title: '商品类别',
          align: 'center',
          key: 'groupName',
          minWidth: 120
        },
        {
          title: '基础单位',
          align: 'center',
          minWidth: 90,
          key: 'unitName'
        },
        {
          title: '基础重量(kg)',
          align: 'center',
          minWidth: 90,
          key: 'baseQty'
        },
        {
          title: '商品状态',
          align: 'center',
          minWidth: 90,
          key: 'status',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === 'NORMAL') {
              return (
                <div>
                  <tag color='success'>
                    {productStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === 'STOP_MINING') {
              return (
                <div>
                  <tag color='error'>
                    {productStatusConvert(row.status).label}
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
        }
      ],
      modalType: {
        view: 'view',
        edit: 'edit',
        create: 'create'
      },
      dropConClass: {
        left: ['drop-box', 'left-drop-box'],
        right: ['drop-box', 'right-drop-box']
      },
      tempModalType: 'create',
      tableData: [],
      total: 0,
      productData: [],
      productTotal: 0,
      loading: true,
      modalViewLoading: false,
      modalView: false,
      modalEdit: false,
      modalDiscount: false,
      modalHdSvip: false,
      modalProduct: false,
      modalSort: false,
      searchRowData: roleRowData,
      searchProductRowData: productRowData,
      productStandardDetail: productStandardDetail,
      proStandardExpand: proStandardExpand,
      productDetail: productDetail,
      // 选中的行
      tableDataSelected: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      showBack: false,
      HdSvipInfo: '',
      shelvesStatus: [
        {
          label: '上架',
          value: 'VALID'
        },
        {
          label: '下架',
          value: 'INVALID'
        }
      ],
      searchMinPrice: null,
      searchMaxPrice: null
    };
  },
  computed: {
    priceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.price);
    },
    salePriceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.salePrice);
    },
    svipPriceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.svipPrice);
    },
    discountPriceComputed() {
      return fenToYuanDot2Number(this.proStandardExpand.discountPrice);
    }
  },
  created() {
    this.showBack = this.$route.name === 'small-goods-relation-standard';
    this.getTableData();
  },
  mounted() {
    getProductUnits().then(res => {
      res.array.forEach(value => {
        const map = { label: 'label', value: 'value' };
        map.value = value.id;
        map.label = value.unitName;
        this.unitsList.push(map);
        this.createLoading = false;
      });
    });
  },
  methods: {
    priceInputNumberOnchange(value) {
      this.productStandardDetail.price = yuanToFenNumber(value);
    },
    salePriceInputNumberOnchange(value) {
      this.productStandardDetail.salePrice = yuanToFenNumber(value);
    },
    svipPriceInputNumberOnchange(value) {
      this.productStandardDetail.svipPrice = yuanToFenNumber(value);
    },
    searchMinPriceChange(value) {
      this.searchRowData.minPrice = yuanToFenNumber(this.searchMinPrice);
    },
    searchMaxPriceChange(value) {
      this.searchRowData.maxPrice = yuanToFenNumber(this.searchMaxPrice);
    },
    calDiscountRate(value) {
      this.proStandardExpand.discountPrice = yuanToFenNumber(value);
      if (
        this.productStandardDetail.salePrice == 0 &&
        this.productStandardDetail.price == 0
      ) {
        return false;
      }
      // 优先获取售价
      const price =
        this.productStandardDetail.salePrice > 0
          ? this.productStandardDetail.salePrice
          : this.productStandardDetail.price;
      // 如果价格设置为售价则为10折
      if (this.proStandardExpand.discountPrice == price) {
        this.proStandardExpand.discountRate = 10;
        return false;
      }
      // 计算折扣率
      const discountRate = Number(
        (Number(this.proStandardExpand.discountPrice) / Number(price)) * 10
      ).toFixed(2);
      console.log(`discountRate by cal: ${discountRate}`);
      if (discountRate.length > 2) {
        this.proStandardExpand.discountRate = discountRate.substring(0, 3);
      }
    },
    handleChange() {},
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    poptipOk() {
      if (this.tableDataSelected.length < 1) {
        this.$Message.warning('请选中要删除的行');
        return;
      }
      const tempDeleteList = [];
      this.tableDataSelected.filter(value => {
        tempDeleteList.push(value.id);
      });
      const strTempDelete = tempDeleteList.join(',');
      this.deleteTable(strTempDelete);
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteProductStandard({
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
        .catch(() => {
          this.loading = false;
        });
    },
    unitChange(value) {
      this.productStandardDetail.productUnit = value;
    },
    handleImgSort() {
      this.descriptionList = [];
      this.uploadListMultiple.forEach(item => {
        if (item.url) {
          this.descriptionList.push(item.url);
        }
      });
      this.productStandardDetail.description = '';
      this.productStandardDetail.description = this.descriptionList.join(',');
      console.log('after sort:', this.productStandardDetail.description);
      this.modalSort = false;
    },
    handleImageSort() {
      this.modalSort = true;
    },
    handleDiscountClose() {
      this.modalDiscount = false;
      // 清楚掉表单数据
      this.$refs.modalDiscount.resetFields();
    },
    handleClose() {
      this.modalView = false;
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.productStandardDetail = this._.cloneDeep(params.row);
      if (this.productStandardDetail.description != null) {
        this.descriptionList = this.productStandardDetail.description.split(
          ','
        );
      }
      this.modalView = true;
    },
    handleEdit(params) {
      console.log('打开的数据', params.row);
      this.productStandardDetail.rotationImage = '';
      this.productStandardDetail.shareImage = '';
      this.uploadListMultiple_ = [];
      this.uploadListShar = [];
      this.save = [];
      this.save.push(params.row.image);
      this.clickFlag = false;
      this.tempModalType = this.modalType.edit;
      this.productStandardDetail = this._.cloneDeep(params.row);
      if (this.productStandardDetail.description != null) {
        this.descriptionList = this.productStandardDetail.description.split(
          ','
        );
      }
      if (this.productStandardDetail.rotationImage != null) {
        this.rotationImageList = this.productStandardDetail.rotationImage.split(
          ','
        );
      }
      this.setDefaultUploadList(params.row);
      this.$refs.editForm.resetFields();
      this.modalEdit = true;
    },
    handleDiscount(params) {
      if (params.row.productType == 'ORDINARY_PRODUCT') {
        this.$Message.error('普通商品不允许配置');
        return;
      }
      // 展示折扣配置弹窗
      this.productStandardDetail = this._.cloneDeep(params.row);
      // 先清除上次请求的数据
      this.proStandardExpand = proStandardExpand;
      this.proStandardExpand.limitQty = this.productStandardDetail.limitQty;
      this.productStandardDetail.expandType = proStandardExpand.expandType;
      this.proStandardExpand.discountPrice = 0;
      // this.productStandardDetail.productStandardExpand.expandType =
      //   params.row.productType;

      // 请求数据展示
      this.modalDiscount = true;
      getProStandardExpand({
        id: this.productStandardDetail.id
      })
        .then(res => {
          res.expandType = this.productStandardDetail.productType;
          this.proStandardExpand = res;
          this.modalDiscount = true;
        })
        .catch(() => {
          this.modalDiscount = true;
        });
    },
    // 海鼎会员价查询
    handleHdSvipPrice() {
      // this.modalHdSvip = true;
      // console.log(this.productStandardDetail.barcode)
      if (!this.productStandardDetail.barcode) {
        this.$Message.error('请先选择关联商品');
        return;
      }
      this.loading = true;
      const code = this.productStandardDetail.barcode;
      getHdProductInfo({ code: code })
        .then(res => {
          this.HdSvipInfo = res;
          this.loading = false;
          this.modalHdSvip = true;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleHdSvipClose() {
      this.modalHdSvip = false;
    },
    // 选中当前数据
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
    },
    handleCreateView() {
      this.clickFlag = true;
      // this.resetFields();
      this.defaultListMultiple = [];
      this.defaultListMultiple_ = [];
      this.uploadListMultiple = [];
      this.uploadListMultiple_ = [];
      if (this.tempModalType !== this.modalType.create) {
        this.productStandardDetail = _.cloneDeep(productStandardDetail);
      }
      // 复制数据
      if (this.currentTableRowSelected) {
        this.currentTableRowSelected.productId = null;
        // this.currentTableRowSelected.baseProductName = null;
        // this.currentTableRowSelected.groupName = null;
        // this.currentTableRowSelected.baseUnit = null;
        // this.currentTableRowSelected.productCode = null;
        // this.currentTableRowSelected.baseBarcode = null;
        // this.currentTableRowSelected.baseImage = null;
        // this.currentTableRowSelected.baseProductDescription = null;
        this.currentTableRowSelected.image = null;
        this.currentTableRowSelected.detailImage = null;
        this.currentTableRowSelected.barcode = null;
        this.currentTableRowSelected.price = null;
        this.currentTableRowSelected.salePrice = null;
        this.currentTableRowSelected.productStandardExpand = null;
        this.currentTableRowSelected.rotationImage = '';
        this.currentTableRowSelected.shareImage = '';
        this.productStandardDetail = _.cloneDeep(this.currentTableRowSelected);
      }
      this.tempModalType = this.modalType.create;
      this.productStandardDetail.description = null;
      // this.productStandardDetail.standardQty = 0;
      // this.productStandardDetail.rank = 0;
      this.setDefaultUploadList(this.productStandardDetail);
      this.modalEdit = true;
    },
    resetFields() {
      // 表单重置
      this.$refs.editForm.resetFields();
      // 图片上传列表清除
      this.uploadListMain = [];
      this.uploadListShar = [];
      this.uploadListDetail = [];
      this.uploadListMultiple = [];
      this.uploadListMultiple_ = [];
    },
    createStandard() {
      this.modalViewLoading = true;
      createProductStandard({
        productId: this.$route.params.id,
        ...this.productStandardDetail
      })
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    // 下载
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getProductStandardsPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        this.searchRowData.page = pageSize;
        // 表格数据导出字段翻译
        const _this = this;
        tableData.forEach(item => {
          item['price'] = (item['price'] / 100.0).toFixed(2);
          item['salePrice'] = (item['salePrice'] / 100.0).toFixed(2);
          item['svipPrice'] = (item['svipPrice'] / 100.0).toFixed(2);
          item['shelvesStatus'] = customPlanStatusConvert(
            item['shelvesStatus']
          ).label;
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `商品规格-${date}`,
          data: tableData
        });
      });
    },
    // ====
    handleSubmit(name) {
      // if (this.oldPicture.length > 0) {
      //   const urls = {
      //     urls: this.oldPicture
      //   };
      //   this.deletePicture(urls);
      // }

      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.productStandardDetail.salePrice) {
            this.$Message.error('请输入售卖价格');
            return;
          }
          if (this.productStandardDetail.salePrice < 0) {
            this.$Message.error('售卖价格不能小于0');
            return;
          }
          if (this.productStandardDetail.svipPrice < 0) {
            this.$Message.error('SVIP价格不能小于0');
            return;
          }
          if (
            this.productStandardDetail.salePrice >
            this.productStandardDetail.price
          ) {
            this.$Message.error('售卖价格不能大于原价');
            return;
          }
          if (
            this.productStandardDetail.svipPrice >
            this.productStandardDetail.salePrice
          ) {
            this.$Message.error('SVIP价格不能大于售卖价格');
            return;
          }
          if (this.tempModalType === this.modalType.create) {
            this.createStandard();
            this.currentTableRowSelected = null;
          } else if (this.tempModalType === this.modalType.edit) {
            this.editProductStandard();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    handleEditClose() {
      // if (this.newPicture.length > 0) {
      //   const urls = {
      //     urls: this.newPicture
      //   };
      //   this.deletePicture(urls);
      // }
      this.modalEdit = false;
      this.oldPicture = [];
      this.newPicture = [];
    },
    // deletePicture(urls) {
    //   deletePicture({
    //     urls
    //   })
    //     .then(res => {
    //       this.newPicture = [];
    //       this.oldPicture = [];
    //     })
    //     .catch(() => {});
    // },
    handleSubmitDiscount() {
      this.proStandardExpand.expandType = this.productStandardDetail.productType;
      this.$refs.modalDiscount.validate(valid => {
        if (valid) {
          if (this.proStandardExpand.discountPrice <= 0) {
            this.$Message.warning('活动价不能为0');
            return false;
          }
          if (this.proStandardExpand.expandType === 'DISCOUNT_PRODUCT') {
            if (this.proStandardExpand.limitNum <= 0) {
              this.$Message.warning('限购份数不能为0');
              return false;
            }
            if (
              this.proStandardExpand.startNum > this.proStandardExpand.limitNum
            ) {
              this.$Message.warning('起购份数不能大于限购份数');
              return false;
            }
          }
          if (this.proStandardExpand.expandType === 'SHARE_PRODUCT') {
            if (this.proStandardExpand.commissionRate <= 0) {
              this.$Message.warning('佣金比例不能为空');
              return false;
            }
          }
          this.updateProStandardExpand();
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    updateProStandardExpand() {
      this.proStandardExpand.standardId = this.productStandardDetail.id;
      // this.proStandardExpand.limitQty = this.productStandardDetail.limitQty;
      this.modalViewLoading = true;
      // 新增或修改
      modifyProStandardExpand({
        ...this.proStandardExpand
      })
        .then(res => {
          const msg = this.proStandardExpand.id ? '修改成功!' : '创建成功';
          this.modalDiscount = false;
          this.modalViewLoading = false;
          this.$Message.success(msg);
          this.getTableData();
        })
        .catch(() => {
          this.modalDiscount = false;
          this.modalViewLoading = false;
        });
    },
    editProductStandard() {
      this.modalViewLoading = true;
      editProductStandard({
        ...this.productStandardDetail
      })
        .then(res => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          // this.productStandardDetail = productStandardDetail;
          // this.productStandardDetail.productId = this.$route.params.id;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    changePage(page) {
      this.searchRowData.page = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.searchRowData.page = 1;
      this.searchRowData.rows = pageSize;
      this.getTableData();
    },
    getTableData() {
      // 获取商品页面传过来的商品信息
      console.log('this.$route.name:', this.$route.name);
      if (this.$route.name === 'small-goods-relation-standard') {
        const goodsStandard = getSmallGoodsStandard();
        console.log('standard from cookie:', goodsStandard);
        if (goodsStandard != null && goodsStandard !== '') {
          // 给商品规格的商品和搜索条件赋值
          this.searchRowData.productId = goodsStandard.id;
          this.productStandardDetail = this._.cloneDeep(goodsStandard);
          this.productStandardDetail.productId = goodsStandard.id;
          this.productStandardDetail.baseUnit = goodsStandard.unitName;
          this.productStandardDetail.baseProductName =
            goodsStandard.productName;
          this.productStandardDetail.baseImage = goodsStandard.image;
          this.productStandardDetail.image = goodsStandard.image;
          this.productStandardDetail.baseProductDescription =
            goodsStandard.description;
          this.productStandardDetail.productDescription =
            goodsStandard.description;
          // this.unitsList = goodsStandard.unitsList;
        }
      } else {
        // 清楚上次的查询条件
        this.searchRowData.productId = '';
      }

      getProductStandardsPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
    },
    statusChange(value) {
      this.productStandardDetail.shelvesStatus = value;
    },
    // 上架商品详情图
    handleSuccessDetail(response, file, fileList) {
      this.uploadListDetail = fileList;
      this.productStandardDetail.detailImage = null;
      this.productStandardDetail.detailImage = fileList[0].url;
    },
    // 上架商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.productStandardDetail.image = null;
      this.productStandardDetail.image = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    handleSuccessShar(response, file, fileList) {
      this.uploadListShar = fileList;
      this.productStandardDetail.shareImage = null;
      this.productStandardDetail.shareImage = fileList[0].url;
    },
    // 上架规格描述图
    handleSuccessMultiple(response, file, fileList) {
      console.log(response);
      this.uploadListMultiple = fileList;
      this.descriptionList = [];
      // this.newPicture = "";
      fileList.forEach(value => {
        if (value.url) {
          this.descriptionList.push(value.url);
        }
      });
      this.productStandardDetail.description = '';
      this.productStandardDetail.description = this.descriptionList.join(',');

      this.newPicture.push(response.fileUrl);
    },
    // 上架轮播图
    handleSuccessMultiple_(response, file, fileList) {
      console.log(response);
      this.uploadListMultiple_ = fileList;
      this.rotationImageList = [];
      // this.newPicture = "";
      fileList.forEach(value => {
        if (value.url) {
          this.rotationImageList.push(value.url);
        }
      });
      this.productStandardDetail.rotationImage = null;
      this.productStandardDetail.rotationImage = this.rotationImageList.join(
        ','
      );

      this.newPicture.push(response.fileUrl);
      console.log('new图片', this.newPicture);
    },
    // 设置编辑图片列表
    setDefaultUploadList(res) {
      if (res.image != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.image;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
      if (res.shareImage != null) {
        const map = { status: 'finished', url: 'url' };
        const sharImgArr = [];
        map.url = res.shareImage;
        sharImgArr.push(map);
        this.$refs.uploadShar.setDefaultFileList(sharImgArr);
        this.uploadListShar = sharImgArr;
      }
      // if (res.detailImage != null) {
      //   const map = { status: "finished", url: "url" };
      //   const detailImgArr = [];
      //   map.url = res.detailImage;
      //   detailImgArr.push(map);
      //   this.$refs.uploadDetail.setDefaultFileList(detailImgArr);
      //   this.uploadListDetail = detailImgArr;
      // }
      if (res.description != null) {
        const descriptionImgArr = [];
        const descriptionArr = res.description.split(',');
        descriptionArr.forEach(value => {
          const innerMapDetailImg = { status: 'finished', url: 'url' };
          innerMapDetailImg.url = value;
          descriptionImgArr.push(innerMapDetailImg);
        });
        this.$refs.uploadMultiple.setDefaultFileList(descriptionImgArr);
        this.uploadListMultiple = descriptionImgArr;
      }
      if (
        res.rotationImage != null &&
        res.rotationImage != '' &&
        res.rotationImage != 'null'
      ) {
        const rotationImageArr = [];
        const rotationArr = res.rotationImage.split(',');
        console.log('图片展示列表', rotationArr);
        rotationArr.forEach(value => {
          const innerMapDetailImg_ = { status: 'finished', url: 'url' };
          innerMapDetailImg_.url = value;
          rotationImageArr.push(innerMapDetailImg_);
        });
        this.$refs.uploadMultiple_.setDefaultFileList(rotationImageArr);
        this.uploadListMultiple_ = rotationImageArr;
      }
    },
    handleRemoveDetail(file) {
      this.$refs.uploadDetail.deleteFile(file);
      // this.productStandardDetail.detailImage = null;
    },
    handleRemoveShar(file) {
      this.$refs.uploadShar.deleteFile(file);
      this.productStandardDetail.shareImage = '';
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.productStandardDetail.image = null;
    },
    handleRemoveMultiple(file) {
      this.$refs.uploadMultiple.deleteFile(file);
      const index = this.descriptionList.indexOf(file.url);
      if (index > -1) {
        this.oldPicture.push(this.descriptionList[index]);
        this.descriptionList.splice(index, 1);
        this.productStandardDetail.description = this.descriptionList.join(',');
      }
      if (this.descriptionList.length === 0) {
        this.$refs.uploadMultiple.clearFileList();
        this.descriptionList = [];
        this.productStandardDetail.description = null;
      }
    },
    handleRemoveMultiple_(file) {
      this.$refs.uploadMultiple_.deleteFile(file);

      const index = this.rotationImageList.indexOf(file.url);
      if (index > -1) {
        this.oldPicture.push(this.rotationImageList[index]);
        this.rotationImageList.splice(index, 1);
        console.log('删除图片', this.rotationImageList.splice(index, 1));
        this.productStandardDetail.rotationImage = this.rotationImageList.join(
          ','
        );
        console.log('图片显示', this.productStandardDetail.rotationImage);
      }
      if (this.rotationImageList.length === 0) {
        // console.log("删除图片", this.rotationImageList.length);
        this.$refs.uploadMultiple_.clearFileList();
        this.rotationImageList = [];
        this.productStandardDetail.rotationImage = '';
        // console.log("轮播图", this.$refs.uploadMultiple_);
      }
    },
    customOnSale(params) {
      const rowData = this._.cloneDeep(params.row);
      if (params.row.shelvesStatus === 'VALID') {
        rowData.shelvesStatus = 'INVALID';
      } else {
        rowData.shelvesStatus = 'VALID';
      }
      this.loading = true;
      editProductStandard(rowData)
        .then(res => {
          this.$Message.success('修改成功!');
        })
        .finally(res => {
          this.loading = false;
          this.modalViewLoading = false;
          this.getTableData();
          this.modalEdit = false;
        });
    },
    goBack() {
      this.turnToPage('small-goods-info');
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    findUnit(unitId) {
      if (this.unitsList != null) {
        const obj = this.unitsList.find(item => item.value === unitId);
        if (obj) {
          return obj.label;
        }
      }
    },
    handleRelation() {
      this.getProductTableData();
      this.modalProduct = true;
    },
    getProductTableData() {
      getProductPages(this.searchProductRowData)
        .then(res => {
          this.productData = res.rows;
          this.productTotal = res.total;
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
    onRowClick(row, index) {
      // 给基础商品信息赋值
      this.productStandardDetail.productId = row.id;
      this.productStandardDetail.baseProductName = row.productName;
      this.productStandardDetail.groupName = row.groupName;
      this.productStandardDetail.baseUnit = row.unitName;
      this.productStandardDetail.productCode = row.sourceCode;
      this.productStandardDetail.baseBarcode = row.baseBarcode;
      this.productStandardDetail.baseImage = row.image;
      this.productStandardDetail.baseProductDescription = row.description;
      // 给要关联的规格信息设置默认值，用户可以选择修改
      this.productStandardDetail.productName = row.productName;
      this.productStandardDetail.productDescription = row.description;
      this.productStandardDetail.image = row.image;
      this.productStandardDetail.barcode = row.baseBarcode;
      this.productStandardDetail.shelvesStatus =
        row.status === 'NORMAL' ? 'VALID' : 'INVALID';
      this.setDefaultUploadList(this.productStandardDetail);
      this.modalProduct = false;
    },
    productTypeChange(value) {
      if (value != 'ORDINARY_PRODUCT') {
        this.productStandardDetail.startNum = 1;
      }
    },
    productStandardChange(value) {
      console.log(
        '商品规格',
        Number(this.productStandardDetail.specification.split('*')[0]) *
          Number(this.productStandardDetail.specification.split('*')[1])
      );
      if (
        Number(
          this.productStandardDetail.specification.split('*')[0] > 0 &&
            Number(this.productStandardDetail.specification.split('*')[1] > 0)
        )
      ) {
        this.productStandardDetail.standardQty =
          this.productStandardDetail.specification.split('*')[0] *
          this.productStandardDetail.specification.split('*')[1];
      } else {
        this.productStandardDetail.standardQty = 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
