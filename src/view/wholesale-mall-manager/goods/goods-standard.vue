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
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-discount="handleRegin"
        @on-delete="handleDelete"
        @custom-on-sale="handlePublish"
        @on-inline-edit="modalHandleEdit"
        @on-inline-save="modalHandleSave"
        @on-abolish="modalHandleAbolish"
        @on-selection-change="handleSelectionChange"
      >
        <div slot="searchCondition">
          <Row v-show="!showBack">
            <Input
              v-model="searchRowData.barCode"
              placeholder="商品条码"
              class="search-input"
              style="width: 130px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.goodsName"
              placeholder="商品名称"
              class="search-input"
              style="width: 120px"
              clearable
            ></Input>
            <Cascader
              ref="showClass"
              :data="goodsCategoryData"
              change-on-select
              style="width: 170px"
              placeholder="请选择商品分类"
              class="search-col"
              @on-change="goodsCategoryChange"
            ></Cascader>
            <Select
              v-model="searchRowData.vaild"
              class="search-col"
              placeholder="上架状态"
              style="width: 70px"
              clearable
            >
              <Option
                v-for="item in vaild"
                :key="item.value"
                :value="item.value"
                class="ml15 mt10 mr15"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.goodsType"
              class=""
              placeholder="商品类型"
              style="width: 120px"
              clearable
            >
              <Option
                v-for="item in pfExpandTypeEnum"
                :key="item.value"
                :value="item.value"
                class="ml15 mt10 mr15"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.isHasPriceRegion"
              placeholder="区间价"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in hasPriceRegionList"
                :key="item.value"
                :value="item.value"
                class="ml15 mt10 mr15"
              >{{ item.label }}</Option>
            </Select>
            <!-- <InputNumber
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
            ></InputNumber>-->
            <Button
              :search-loading="searchLoading"
              class="search-btn"
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
              v-show="showBack"
              v-waves
              class="search-btn"
              type="warning"
              @click="goBack"
            >
              <Icon type="ios-arrow-back" />&nbsp;返回
            </Button>
            <Button
              v-waves
              class="search-btn"
              type="success"
              @click="handleCreate"
            >
              <Icon type="md-add" />&nbsp;添加
            </Button>
            <Button
              :loading="downloadLoading"
              class="search-btn"
              type="warning"
              @click="handleDownload"
            >
              <Icon type="md-download" />导出
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
          </Row>
          <!-- <div class="ml15 mt10">
            <i style="color:red">*</i> 选中单条数据再点击添加,可复制当前数据
          </div>-->
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            :page-size="20"
            :page-size-opts="templatePageOpts"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <!-- 查询 -->
    <Modal v-model="modalView" :mask-closable="false" :width="700">
      <p slot="header">
        <span>商品规格详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品ID:</i-col>
              <i-col span="16">{{ productStandardDetail.goodsId }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{ productStandardDetail.baseGoodsName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品分类:</i-col>
              <i-col span="16">{{ productStandardDetail.categoryName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">基础单位:</i-col>
              <i-col span="16">{{ productStandardDetail.unitName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品编码:</i-col>
              <i-col span="16">{{ productStandardDetail.goodsCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品条码:</i-col>
              <i-col span="16">{{ productStandardDetail.barCode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品主图:</i-col>
              <i-col span="16">
                <img
                  :src="productStandardDetail.goodsImage"
                  width="100"
                  height="100"
                >
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">商品规格</Divider>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品名称:</i-col>
              <i-col span="16">{{
                productStandardDetail.standardGoodsName
              }}</i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品主图:</i-col>
              <i-col v-if="productStandardDetail.goodsImage" span="16">
                <img :src="productStandardDetail.goodsImage" width="100" height="100" >
              </i-col>
            </Row>
          </i-col>
        </Row>-->
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品条码:</i-col>
              <i-col span="16">{{ productStandardDetail.barCode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品规格描述:</i-col>
              <i-col span="16">{{ productStandardDetail.standardDesc }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">数量/重量:</i-col>
              <i-col span="16">{{ productStandardDetail.weight }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品价格:</i-col>
              <i-col span="16">{{
                productStandardDetail.price | fenToYuanDot2Filters
              }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">进货价:</i-col>
              <i-col span="16">{{
                productStandardDetail.purchasePrice | fenToYuanDot2Filters
              }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品单位:</i-col>
              <i-col span="16">{{ productStandardDetail.goodsUnit }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品排序:</i-col>
              <i-col span="16">{{ productStandardDetail.rank }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="modalView = false">关闭</Button>
      </div>
    </Modal>

    <!-- 编辑 -->
    <Modal v-model="modalEdit" :mask-closable="false" :width="900">
      <p slot="header">
        <span>{{ isCreate ? "创建商品规格" : "编辑商品规格" }}</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="productStandardDetail"
          :rules="ruleInline"
          :label-width="120"
        >
          <Row>
            <i-col span="12">
              <FormItem label="商品ID:" prop="goodsId">
                <Input
                  v-model="productStandardDetail.goodsId"
                  readonly="readonly"
                >
                <Button
                  slot="append"
                  icon="ios-search"
                  @click="handleRelation"
                ></Button>
                </Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品名称:">{{
                productStandardDetail.baseGoodsName
              }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品分类:">{{
                productStandardDetail.categoryName
              }}</FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="基础单位:">{{
                productStandardDetail.unitName
              }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem
                v-if="productStandardDetail.goodsImage"
                label="商品主图:"
              >
                <img
                  :src="productStandardDetail.goodsImage"
                  width="100"
                  height="100"
                >
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品条码:">{{
                productStandardDetail.barCode
              }}</FormItem>
            </i-col>
          </Row>
          <Divider orientation="center">规格信息</Divider>
          <Row>
            <i-col span="12">
              <FormItem label="上架商品名称:" prop="standardGoodsName">
                <Input
                  v-model="productStandardDetail.standardGoodsName"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品条码:" prop="barCode">
                <Input v-model="productStandardDetail.barCode"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <!-- 主图 -->
            <i-col span="12">
              <FormItem
                label="上架商品主图:建议尺寸;690x690(单位:px):"
                prop="goodsImage"
              >
                <Input
                  v-show="false"
                  v-model="productStandardDetail.goodsImage"
                  style="width: auto"
                ></Input>
                <div
                  v-for="item in uploadListMain"
                  :key="item.url"
                  :v-show="productStandardDetail.goodsImage"
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
                  :max-num="1"
                  group-type="base_image"
                  file-dir="product"
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

            <!-- 主图轮播 -->
            <i-col span="12">
              <FormItem
                label="上架商品轮播图:建议尺寸;710x710(单位:px)"
                prop="rotationImage"
              >
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
                        <Icon
                          type="ios-eye-outline"
                          @click.native="handleUploadView(item)"
                        ></Icon>
                        <Icon
                          type="ios-trash-outline"
                          @click.native="handleRemoveMultiple_(item)"
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
                  ref="uploadMultiple_"
                  :default-list="defaultListMultiple_"
                  :image-size="imageSize"
                  :max-num="5"
                  group-type="base_image"
                  file-dir="product"
                  multiple
                  @on-success="handleSuccessMultiple_"
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
            <!-- 详情图 ==== -->
            <i-col span="12">
              <FormItem
                label="商品详情(推荐宽度为750px，高度自适应):"
                prop="goodsImages"
              >
                <Input
                  v-show="false"
                  v-model="productStandardDetail.goodsImages"
                  style="width: auto"
                ></Input>
                <div
                  v-for="item in uploadListMultiple"
                  :key="item.url"
                  :v-show="productStandardDetail.goodsImages"
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
                          @click.native="handleRemoveMultiple(item)"
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
                  ref="uploadMultiple"
                  :default-list="defaultListMultiple"
                  :image-size="imageSize"
                  :max-num="15"
                  group-type="base_image"
                  file-dir="product"
                  multiple
                  @on-success="handleSuccessMultiple"
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
            <i-col
              span="9"
              style="float: right; margin-bottom: 10px; margin-right: 9px"
            >
              <Button
                v-waves
                type="info"
                @click="modalSort = true"
              >商品详情图排序</Button>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品类型:" prop="goodsType" style="width: 200px">
                <Select
                  v-model="productStandardDetail.goodsType"
                  :disabled="tempModalType === modalType.edit"
                >
                  <Option
                    v-for="(item, index) in pfExpandTypeEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="安全库存:" prop="stockLimit">
                <InputNumber
                  v-model="productStandardDetail.stockLimit"
                  placeholder="安全库存"
                  style="width: 100px"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品状态:" prop="vaild" style="width: 200px">
                <Select v-model="productStandardDetail.vaild">
                  <Option
                    v-for="(item, index) in vaild"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <Row>
                <i-col span="12">
                  <FormItem
                    label="商品单位:"
                    prop="unitCode"
                    style="width: 180px"
                  >
                    <Select
                      v-model="productStandardDetail.unitCode"
                      style="width: 100px"
                      @on-change="unitChange"
                    >
                      <Option
                        v-for="(item, index) in unitsList"
                        :key="index"
                        :value="item.value"
                        class="ptb2-5"
                        style="padding-left: 5px"
                      >{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="数量/重量:" prop="weight">
                <InputNumber
                  v-model="productStandardDetail.weight"
                  :min="0"
                  style="width: 100px"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品净重:" prop="netWeight">
                <Input
                  v-model="productStandardDetail.netWeight"
                  style="width: 100px"
                ></Input
                >千克
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品价格:" prop="price">
                <InputNumber
                  :min="0"
                  :value="priceComputed"
                  style="width: 100px"
                  @on-change="priceOnchange"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品进货价:" prop="purchasePrice">
                <InputNumber
                  :min="0"
                  :value="purchasePriceComputed"
                  style="width: 100px"
                  @on-change="purchasePriceOnchange"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="区域:" prop="goodsArea">
                <Select
                  :value="productStandardDetail.goodsArea"
                  style="width: 100px"
                  @on-change="goodsAreaChange"
                >
                  <Option
                    v-for="(item, index) in goodsAreaList"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="品牌:" prop="goodsBrand">
                <Input
                  v-model="productStandardDetail.goodsBrand"
                  placeholder="品牌"
                  style="width: 100px"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="产地:" prop="placeOfOrigin">
                <Input
                  v-model="productStandardDetail.placeOfOrigin"
                  placeholder="产地"
                  style="width: 100px"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <Row>
              <i-col span="12">
                <FormItem label="商品规格:" prop="standard">
                  <Input
                    v-model="productStandardDetail.standard"
                    :autosize="{ minRows: 2, maxRows: 6 }"
                    type="textarea"
                    placeholder="请输入商品规格..."
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="规格描述:" prop="standardDesc">
                  <Input
                    v-model="productStandardDetail.standardDesc"
                    :autosize="{ minRows: 2, maxRows: 6 }"
                    type="textarea"
                    placeholder="请输入规格描述..."
                  ></Input>
                </FormItem>
              </i-col>
              <!-- <i-col span="12">
              <FormItem label="商品排序:" prop="rank">
                <InputNumber :min="0" v-model="productStandardDetail.rank"></InputNumber>
              </FormItem>
              </i-col>-->
            </Row>
            <!-- v1.2.0 -->
            <i-col span="12">
              <FormItem label="商品特征:" prop="goodsDes">
                <Input
                  v-model="productStandardDetail.goodsDes"
                  :autosize="{ minRows: 6, maxRows: 6 }"
                  placeholder="请输入商品特征..."
                  type="textarea"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="售后标准:" prop="afterDes">
                <Input
                  v-model="productStandardDetail.afterDes"
                  :autosize="{ minRows: 6, maxRows: 6 }"
                  placeholder="请输入售后标准..."
                  type="textarea"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button
          :loading="modalEditLoading"
          type="primary"
          @click="handleSubmit"
        >确定</Button>
      </div>
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
        <Button @click="modalSort = false">关闭</Button>
        <Button type="primary" @click="handleImgSort">确定</Button>
      </div>
    </Modal>
    <!-- 关联商品弹窗-->
    <Modal v-model="modalProduct" :width="1000" title="关联商品" footer-hide>
      <Card>
        <tables
          ref="dataTables"
          v-model="productData"
          :columns="productColumns"
          :loading="loadingProduct"
          editable
          searchable
          border
          search-place="top"
          @on-row-click="handleGoodsRelation"
        >
          <div slot="searchCondition">
            <Row>
              <Input
                v-model="searchProductRowData.baseBar"
                placeholder="基础条码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchProductRowData.goodsName"
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

    <!-- 价格区间弹窗-->
    <Modal
      v-model="modalRegion"
      :width="1200"
      :z-index="1000"
      title="区间价格管理"
    >
      <Card>
        <tables
          ref="dataTables"
          v-model="priceRegionData"
          :columns="regionColumns"
          :loading="loadingRegion"
          :search-area-column="18"
          :operate-area-column="6"
          editable
          searchable
          border
          highlight-row
          search-place="top"
          @on-edit="handleEditRegion"
          @on-delete="handleDeleteRegion"
        >
          <div slot="searchCondition">
            <i-col
              span="12"
            >{{
              productStandardDetail.standardGoodsName
            }}--区间价格设置</i-col>
          </div>
          <div slot="operations">
            <Button
              v-waves
              class="search-btn ml5 mr5"
              type="success"
              @click="handleRegionAdd"
            >
              <Icon type="md-add" />&nbsp;添加
            </Button>
            <Poptip
              confirm
              placement="bottom"
              style="width: 100px"
              title="您确认删除选中的内容吗?"
              @on-ok="handleBatchDel"
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
              :total="regionTotal"
              :current="priceRegionRowData.page"
              show-sizer
              show-total
              @on-change="changePriceRegionPage"
              @on-page-size-change="changePriceRegionPageSize"
            ></Page>
          </Row>
        </div>
      </Card>
    </Modal>

    <!-- 价格区间的创建或修改-->
    <Modal v-model="modalEditRegion" :mask-closable="false">
      <p slot="header">
        <span>{{
          goodsPriceRegion.id === 0 ? "创建商品区间价格" : "编辑商品区间价格"
        }}</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editRegionForm"
          :model="goodsPriceRegion"
          :rules="ruleInlineRegion"
          :label-width="100"
        >
          <Row>
            <i-col span="12">
              <FormItem label="商品名称:">{{
                productStandardDetail.standardGoodsName
              }}</FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品价格:" prop="price">
                <InputNumber
                  :min="0"
                  :value="reginPriceComputed"
                  @on-change="reginPriceOnchange"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="最低购买:" prop="minQuantity">
                <Input v-model="goodsPriceRegion.minQuantity"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem
                label="最高购买:"
                prop="maxQuantity"
                style="width: 200px"
              >
                <Input v-model="goodsPriceRegion.maxQuantity"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="规格数量描述:" prop="standardDes">
                <Input v-model="goodsPriceRegion.standardDes"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品排序:" prop="reorder">
                <InputNumber
                  v-model="goodsPriceRegion.reorder"
                  :min="0"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="modalEditRegion = false">关闭</Button>
        <Button
          :loading="modalEditLoading"
          type="primary"
          @click="handleSubmitRegin"
        >确定</Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import DragList from '_c/drag-list';
import IViewUpload from '_c/iview-upload';
import {
  getProductPages,
  getProductStandardsPages,
  getGoodsPriceRegionPages,
  getProductUnits,
  createProductStandard,
  createGoodsPriceRegion,
  deleteProductStandard,
  deleteGoodsPriceRegion,
  editProductStandard,
  editGoodsPriceRegion,
  exporGoodsStandard,
  deletePicture,
  getProductCategoriesTree
} from '@/api/wholesale';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  getWholesaleGoods,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  buildMenu,
  convertTreeCategory,
  setWholesaleGoods,
  convertTree
} from '@/libs/util';
import {
  customPlanStatusConvert,
  pfExpandTypeConvert
} from '@/libs/converStatus';
import { pfExpandTypeEnum } from '@/libs/enumerate';

const productStandardDetail = {
  barCode: '',
  unitName: '',
  categoryName: '',
  goodsCode: '',
  goodsId: 0,
  goodsImage: null,
  goodsImages: null,
  rotationImage: null,
  goodsName: '',
  goodsPriceRegionList: [], // 商品价格区间
  goodsUnit: '',
  hdSkuId: '',
  id: null,
  goodsType: 'NORMAL',
  netWeight: '', // 商品净重
  price: 0,
  purchasePrice: 0,
  standard: '',
  standardDesc: '',
  standardGoodsName: '',
  unitCode: '',
  vaild: '',
  weight: 0,
  rank: 0, // 先保留后续扩展
  baseGoodsName: '', // 先保留可扩展
  isHasPriceRegion: '',
  // v1.2.0
  stockLimit: 0,
  goodsArea: '',
  goodsBrand: '',
  placeOfOrigin: '',
  goodsDes: '',
  afterDes: ''
};

const roleRowData = {
  goodsId: '',
  barCode: '',
  goodsCode: '',
  goodsName: '',
  vaild: 'yes',
  goodsType: '',
  minPrice: '',
  maxPrice: '',
  page: 1,
  rows: 20,
  isHasPriceRegion: '',
  categoryName: '',
  categoryId: null
};

const productDetail = {
  id: 0,
  goodsCode: '',
  goodsName: '',
  goodsImage: '',
  otherImage: '',
  goodsImages: '',
  goodsDes: '',
  unitCode: 0,
  categoryId: 0,
  stockLimit: 0,
  baseBar: '',
  baseUnit: '',
  unitName: '',
  categoryName: ''
};

const productRowData = {
  categoryId: null,
  goodsCode: null,
  goodsName: null,
  baseBar: null,
  page: 1,
  rows: 10
};

const priceRegionRowData = {
  goodsStandardId: 0,
  page: 1,
  rows: 10
};

const goodsPriceRegion = {
  id: 0,
  goodsStandardId: 0,
  minQuantity: 0,
  maxQuantity: 0,
  price: 0,
  reorder: 0, // 排序
  standardDes: '' // 价格区间描述
};

const standardColumns = [
  {
    title: '规格ID',
    align: 'center',
    key: 'id',
    fixed: 'left',
    minWidth: 90
  },
  {
    title: '商品条码',
    align: 'center',
    key: 'barCode',
    fixed: 'left',
    minWidth: 100
  },
  {
    title: '商品名称',
    align: 'center',
    fixed: 'left',
    key: 'standardGoodsName',
    minWidth: 120
  },
  {
    title: '商品图片',
    key: 'goodsImage',
    align: 'center',
    minWidth: 100,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.goodsImage} height='60' width='60' />;
      return <div>{str}</div>;
    }
  },
  {
    title: '商品规格',
    align: 'center',
    key: 'standard',
    minWidth: 120
  },
  {
    title: '单位',
    align: 'center',
    minWidth: 80,
    key: 'goodsUnit'
  },
  {
    title: '商品价格',
    align: 'center',
    minWidth: 100,
    key: 'price',
    render(h, params, vm) {
      const { row } = params;
      if (row.isEdit) {
        return h(
          'Div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column'
            }
          },
          [
            h(
              'Span',
              {
                style: {
                  lineHeight: '32px',
                  marginLeft: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                on: {}
              },
              fenToYuanDot2(row.afterPrice)
            ),
            h('Input', {
              style: {
                marginLeft: '4px',
                width: '100%'
              },
              props: {
                type: 'number',
                value: '' // 使用key的键值
              },
              on: {
                input: (event) => {
                  row.price = event;
                }
              }
            })
          ]
        );
      } else {
        return h('div', fenToYuanDot2(row.price));
      }
    }
  },
  {
    title: '进货价',
    align: 'center',
    minWidth: 100,
    key: 'purchasePrice',
    render(h, params, vm) {
      const { row } = params;
      if (row.isEdit) {
        return h(
          'Div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column'
            }
          },
          [
            h(
              'Span',
              {
                style: {
                  lineHeight: '32px',
                  marginLeft: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                on: {}
              },
              fenToYuanDot2(row.afterPurchasePrice)
            ),
            h('Input', {
              style: {
                marginLeft: '4px',
                width: '100%'
              },
              props: {
                type: 'number',
                value: ''
              },
              on: {
                input: (event) => {
                  row.purchasePrice = event;
                }
              }
            })
          ]
        );
      } else {
        return h('div', fenToYuanDot2(row.purchasePrice));
      }
    }
  },
  {
    title: '库存',
    align: 'center',
    key: 'stockLimit',
    minWidth: 90,
    render(h, params, vm) {
      const { row } = params;
      if (row.isEdit) {
        return h(
          'Div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column'
            }
          },
          [
            h('Input', {
              style: {
                marginLeft: '4px',
                width: '100%'
              },
              props: {
                type: 'number',
                value: row.stockLimit // 使用key的键值
              },
              on: {
                input: (event) => {
                  row.stockLimit = event;
                }
              }
            })
          ]
        );
      } else {
        return h('div', row.stockLimit);
      }
    }
  },
  {
    title: '商品类型',
    minWidth: 140,
    key: 'goodsType',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.goodsType == 'NORMAL') {
        return (
          <div>
            <tag color='cyan'>{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      } else if (row.goodsType == 'VIP') {
        return (
          <div>
            <tag color='orange'>{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      } else if (row.goodsType == 'FLASHSALE') {
        return (
          <div>
            <tag color='blue'>{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color='primary'>N/A</tag>
        </div>
      );
    }
  },
  {
    title: '状态',
    minWidth: 80,
    key: 'vaild',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.vaild === 'yes') {
        return (
          <div>
            <tag color='success'>上架</tag>
          </div>
        );
      } else if (row.vaild === 'no') {
        return (
          <div>
            <tag color='error'>下架</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color='primary'>N/A</tag>
        </div>
      );
    }
  },
  {
    title: '区间价',
    minWidth: 80,
    key: 'isHasPriceRegion',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.isHasPriceRegion === 'yes') {
        return (
          <div>
            <tag color='success'>有</tag>
          </div>
        );
      } else if (row.isHasPriceRegion === 'no') {
        return (
          <div>
            <tag color='error'>无</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color='primary'>N/A</tag>
        </div>
      );
    }
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    minWidth: 240,
    key: 'handle',
    options: [
      'amendEdit',
      'abolish',
      'customOnSale',
      'view',
      'edit',
      'discount'
    ]
  }
];

const productColumns = [
  {
    title: '商品图片',
    key: 'goodsImage',
    align: 'center',
    minWidth: 120,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.goodsImage} height='60' width='60' />;
      return <div>{str}</div>;
    }
  },
  {
    title: '基础条码',
    align: 'center',
    sortable: true,
    key: 'baseBar',
    minWidth: 80
  },
  {
    title: '商品名称',
    align: 'center',
    sortable: true,
    key: 'goodsName',
    minWidth: 120
  },
  {
    title: '商品类别',
    align: 'center',
    key: 'categoryName',
    minWidth: 120
  },
  {
    title: '基础单位',
    align: 'center',
    minWidth: 90,
    key: 'unitName'
  }
];

const goodsPriceRegionColumns = [
  {
    type: 'selection',
    key: '',
    minWidth: 40,
    align: 'center'
  },
  {
    title: '规格ID',
    align: 'center',
    key: 'goodsStandardId',
    minWidth: 60
  },
  {
    title: '商品价格',
    key: 'price',
    align: 'center',
    minWidth: 100,
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: '最低购买数量',
    align: 'center',
    key: 'minQuantity',
    minWidth: 120
  },
  {
    title: '最高购买数量',
    align: 'center',
    key: 'maxQuantity',
    minWidth: 120
  },
  {
    title: '排序',
    align: 'center',
    key: 'reorder',
    minWidth: 80
  },
  {
    title: '规格数量描述',
    align: 'center',
    key: 'standardDes',
    minWidth: 150
  },
  {
    title: '操作',
    align: 'center',
    minWidth: 200,
    key: 'handle',
    options: ['delete', 'edit']
  }
];

export default {
  components: {
    Tables,
    IViewUpload,
    DragList
  },
  mixins: [uploadMixin, deleteMixin, searchMixin, tableMixin],
  data() {
    return {
      templatePageOpts: [20, 50],
      hasPriceRegionList: [
        { label: '有', value: 'no' },
        { label: '无', value: 'yes' }
      ],
      productTotal: 0,
      downloadLoading: false,
      regionTotal: 0,
      unitsList: [],
      productDetailsList: [],
      masterProductDetailsList: [],
      defaultListMultiple: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      // ====
      uploadListMain: [],
      uploadListMultiple: [],
      productData: [],
      defaultListMain: [],
      masterImage: '',
      priceRegionData: [],
      goodsImageList: [],
      tableDataSelected: [],
      goodsCategoryData: [],
      regionTableDataSelected: [],
      uploadListMultiple_: [],
      defaultListMultiple_: [],
      modalEditLoading: false,
      modalDiscount: false,
      modalProduct: false,
      modalSort: false,
      modalRegion: false,
      openStatus: false,
      modalEditRegion: false,
      loadingProduct: false,
      loadingRegion: false,
      showBack: false,
      afterPurchasePrice: 0,
      afterPrice: 0,
      pfExpandTypeEnum,
      searchRowData: _.cloneDeep(roleRowData),
      priceRegionRowData: _.cloneDeep(priceRegionRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      productStandardDetail: _.cloneDeep(productStandardDetail),
      productDetail: _.cloneDeep(productDetail),
      goodsPriceRegion: _.cloneDeep(goodsPriceRegion),
      columns: standardColumns,
      productColumns: productColumns,
      regionColumns: goodsPriceRegionColumns,
      searchMinPrice: null,
      searchMaxPrice: null,
      currentTableRowSelected: null,
      dropConClass: {
        left: ['drop-box', 'left-drop-box'],
        right: ['drop-box', 'right-drop-box']
      },
      goodsAreaList: [
        { label: '国产', value: 'domestic' },
        { label: '进口', value: 'imported' }
      ],
      vipEnum: [
        {
          label: '是',
          value: 'yes'
        },
        {
          label: '否',
          value: 'no'
        }
      ],
      vaild: [
        {
          label: '上架',
          value: 'yes'
        },
        {
          label: '下架',
          value: 'no'
        }
      ],
      ruleInlineRegion: {
        goodsStandardId: [
          { required: true, message: '请先选择规格商品' },
          {
            message: '请先选择规格商品',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        price: [
          { required: true, message: '请输入商品价格' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        reorder: [
          { required: false, message: '请输入商品排序' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        minQuantity: [
          { required: true, message: '请输入最低购买数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        maxQuantity: [
          { required: true, message: '请输入最高购买数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ]
      },
      ruleInline: {
        goodsId: [
          { required: true, message: '请选择关联商品' },
          {
            message: '请选择要关联的商品',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        isVip: [{ required: true, message: '请选择商品的类型' }],
        standardGoodsName: [{ required: true, message: '请输入上架商品名称' }],
        goodsImage: [{ required: true, message: '请上传上架商品主图' }],
        rotationImage: [{ required: false, message: '请上传上架商品轮播图' }],
        goodsImages: [{ required: true, message: '请上传上架商品详情图' }],
        unitCode: [{ required: true, message: '请选择商品单位' }],
        vaild: [{ required: true, message: '请选择商品状态' }],
        // standard: [{ required: true, message: "请输入商品规格" }],
        standardDesc: [{ required: true, message: '请输入规格描述' }],
        goodsDes: [{ required: true, message: '请输入商品特征' }],
        afterDes: [{ required: true, message: '请输入售后标准' }],
        stockLimit: [{ required: true, message: '请输入安全库存' }],
        price: [
          { required: true, message: '请输入商品价格' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        purchasePrice: [
          { required: true, message: '请输入商品进货价' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        barCode: [{ required: true, message: '请输入商品条码' }],
        standard: [
          { required: true, message: '请输入商品规格' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 25) {
                errors.push(new Error('字数不得超过25个字'));
              }
              callback(errors);
            }
          }
        ],
        weight: [
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
        // netWeight: [
        //   { required: false, message: "请输入商品净重" },
        //   {
        //     validator(rule, value, callback, source, options) {
        //       const errors = [];
        //       if (!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(value)) {
        //         errors.push(new Error("必须为大于0的数字"));
        //       }
        //       callback(errors);
        //     }
        //   }
        // ]
      }
    };
  },
  computed: {
    reginPriceComputed() {
      return fenToYuanDot2Number(this.goodsPriceRegion.price);
    },
    priceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.price);
    },
    purchasePriceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.purchasePrice);
    }
  },
  created() {
    this.showBack = this.$route.name === 'wholesale-goods-relation-standard';
    this.getTableData();
  },
  mounted() {
    this.getProductUnits();
    this.getProductCategoriesTree();
  },
  methods: {
    // 变化函数
    priceOnchange(value) {
      this.productStandardDetail.price = yuanToFenNumber(value);
    },
    reginPriceOnchange(value) {
      this.goodsPriceRegion.price = yuanToFenNumber(value);
    },
    purchasePriceOnchange(value) {
      this.productStandardDetail.purchasePrice = yuanToFenNumber(value);
    },
    searchMinPriceChange(value) {
      this.searchRowData.minPrice = yuanToFenNumber(this.searchMinPrice);
    },
    searchMaxPriceChange(value) {
      this.searchRowData.maxPrice = yuanToFenNumber(this.searchMaxPrice);
    },
    unitChange(value) {
      this.productStandardDetail.goodsUnit = value;
    },
    // 数据查询
    getTableData() {
      // 获取基础商品页面传过来的商品信息
      if (this.$route.name === 'wholesale-goods-relation-standard') {
        const goods = getWholesaleGoods();
        if (goods) {
          // 给商品规格的商品和搜索条件赋值
          this.searchRowData.goodsId = goods.id;
          this.productDetail = _.cloneDeep(goods);
          this.productStandardDetail.goodsId = goods.id;
          this.productStandardDetail.unitName = goods.unitName;
          this.productStandardDetail.barCode = goods.baseBar;
          this.productStandardDetail.baseGoodsName = goods.baseGoodsName;
          this.productStandardDetail.standardGoodsName =
            goods.standardGoodsName; // 默认先读取以前的商品名称
          this.productStandardDetail.goodsImage = goods.goodsImage;
          this.productStandardDetail.categoryName = goods.categoryName;
        }
      } else {
        // 清楚上次的查询条件
        this.searchRowData.goodsId = 0;
      }
      getProductStandardsPages(this.searchRowData)
        .then((res) => {
          res.rows.forEach((element) => {
            element.isEdit = false;
            element.afterPurchasePrice = element.purchasePrice;
            element.afterPrice = element.price;
          });
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getProductTableData() {
      getProductPages(this.searchProductRowData)
        .then((res) => {
          this.productData = res.rows;
          this.productTotal = res.total;
        })
        .finally(() => {
          this.loadingProduct = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getPriceRegionTableData() {
      this.loadingRegion = true;
      getGoodsPriceRegionPages(this.priceRegionRowData)
        .then((res) => {
          this.priceRegionData = res.rows;
          this.regionTotal = res.total;
        })
        .finally(() => {
          this.loadingRegion = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getProductUnits() {
      getProductUnits().then((res) => {
        res.forEach((value) => {
          const map = { label: 'label', value: 'value' };
          map.value = value.unitCode;
          map.label = value.unitName;
          this.unitsList.push(map);
          this.createLoading = false;
        });
      });
    },
    // 创建或修改相关函数
    createPriceRegion() {
      this.modalEditLoading = true;
      createGoodsPriceRegion({
        ...this.goodsPriceRegion
      })
        .then((res) => {
          this.$Message.success('创建成功!');
          this.getPriceRegionTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
          this.modalEditRegion = false;
        });
    },
    editPriceRegion() {
      this.modalEditLoading = true;
      editGoodsPriceRegion({
        ...this.goodsPriceRegion
      })
        .then((res) => {
          this.$Message.success('修改成功');
          this.getPriceRegionTableData();
        })
        .finally(() => {
          this.modalEditRegion = false;
          this.modalEditLoading = false;
        });
    },
    createProductStandard() {
      this.modalEditLoading = true;
      createProductStandard({
        ...this.productStandardDetail
      })
        .then((res) => {
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
    },
    editProductStandard(row) {
      this.modalEditLoading = true;
      const data = row || {
        ...this.productStandardDetail
      };
      editProductStandard(data)
        .then((res) => {
          this.$Message.success('修改成功');
          this.getTableData();
          this.openStatus = false;
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalEditLoading = false;
        });
    },
    // 数据删除
    deleteRegionTable(ids) {
      this.loadingRegion = true;
      deleteGoodsPriceRegion({
        ids
      })
        .then((res) => {
          const totalPage = Math.ceil(
            this.regionTotal / this.priceRegionRowData.rows
          );
          if (
            this.priceRegionData.length ==
              this.regionTableDataSelected.length &&
            this.priceRegionRowData.page === totalPage &&
            this.priceRegionRowData.page !== 1
          ) {
            this.priceRegionRowData.page -= 1;
          }
          this.regionTableDataSelected = [];
          this.getPriceRegionTableData();
        })
        .finally(() => {
          this.loadingRegion = false;
        });
    },
    deleteTable(ids) {
      this.loading = true;
      deleteProductStandard({
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
        .catch(() => {
          this.loading = false;
        });
    },
    // 表格中操作按钮相关函数
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.productStandardDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.save = [];
      this.save.push(params.row.image);
      this.tempModalType = this.modalType.edit;
      this.uploadListMain = [];
      this.uploadListMultiple = [];
      this.uploadListMultiple_ = [];
      this.setDefaultUploadList(params.row);
      this.productStandardDetail = _.cloneDeep(params.row);
      this.$refs.editForm.resetFields();
      this.modalEdit = true;
      this.productDetailsList = this.productStandardDetail.goodsImages.split(
        ','
      );
      if (this.productStandardDetail.rotationImage != null) {
        this.goodsImageList = this.productStandardDetail.rotationImage.split(
          ','
        );
        this.masterImage = this.goodsImageList[0];
      }
    },
    handleEditRegion(params) {
      this.goodsPriceRegion = _.cloneDeep(params.row);
      this.$refs.editRegionForm.resetFields();
      this.modalEditRegion = true;
    },
    handleDeleteRegion(params) {
      this.regionTableDataSelected = [];
      this.regionTableDataSelected.push(params.row);
      this.deleteRegionTable(params.row.id);
    },
    handleCreate() {
      if (this.tempModalType !== this.modalType.create) {
        this.uploadListMain = [];
        this.uploadListMultiple = [];
        this.uploadListMultiple_ = [];
        this.$refs.editForm.resetFields();
        this.productStandardDetail = _.cloneDeep(productStandardDetail);
      }
      // 复制选中的数据
      if (this.currentTableRowSelected) {
        this.productStandardDetail = _.cloneDeep(this.currentTableRowSelected);
      }
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleImgSort() {
      this.descriptionList = [];
      this.uploadListMultiple.forEach((item) => {
        if (item.url) {
          this.descriptionList.push(item.url);
        }
      });
      this.productStandardDetail.goodsImages = '';
      this.productStandardDetail.goodsImages = this.descriptionList.join(',');
      this.modalSort = false;
    },
    handleSubmit() {
      this.defaultListMultiple_ = [];
      // if (this.oldPicture.length > 0) {
      //   const urls = {
      //     urls: this.oldPicture
      //   };
      //   this.deletePicture(urls);
      // }
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.createProductStandard();
          } else if (this.isEdit) {
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
      this.defaultListMultiple_ = [];
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
    handleSubmitRegin() {
      // 把规格ID赋值给goodsPriceRegion  goodsPriceRegion.maxQuantity minQuantity
      this.goodsPriceRegion.goodsStandardId = this.productStandardDetail.id;
      this.$refs.editRegionForm.validate((valid) => {
        if (valid) {
          if (this.goodsPriceRegion.price > this.productStandardDetail.price) {
            this.$Message.error('区间价不能高于商品原价!');
            return;
          }
          // if (
          //   this.goodsPriceRegion.maxQuantity <
          //   this.goodsPriceRegion.minQuantity
          // ) {
          //   this.$Message.error("最高起购份数不能小于最低起购份数!");
          //   return;
          // }
          // 后期发版 屏蔽最高购买份数
          // if (this.priceRegionData.length > 0) {
          //   for (let i = 0; i < this.priceRegionData.length; i++) {
          //     if (
          //       this.priceRegionData[i].minQuantity ==
          //       this.goodsPriceRegion.minQuantity
          //     ) {
          //       this.$Message.error("当前存在相同最小购买份数!");
          //       return;
          //     }
          //   }
          // }
          if (this.goodsPriceRegion.id === 0) {
            this.createPriceRegion();
          } else {
            this.editPriceRegion();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    // v1.2.2
    modalHandleEdit(params) {
      if (!this.openStatus) {
        this.openStatus = true;
        this.$set(params.row, 'isEdit', true);
        this.afterPurchasePrice = params.row.purchasePrice;
        this.afterPrice = params.row.price;
      } else {
        this.$Message.info('已有打开正在编辑中的窗口!');
      }
    },
    modalHandleSave(params) {
      const { row } = params;
      if (row.purchasePrice <= 0) {
        this.$Message.info('进货价不能小于0!');
        return;
      }
      if (row.price <= 0) {
        this.$Message.info('商品价格不能小于0!');
        return;
      }
      if (this.afterPurchasePrice != row.purchasePrice) {
        row.purchasePrice = row.purchasePrice * 100;
      }
      if (this.afterPrice != row.price) {
        row.price = row.price * 100;
      }
      this.editProductStandard(row);
      this.openStatus = false;
    },
    modalHandleAbolish(params) {
      this.$set(params.row, 'isEdit', false);
      this.openStatus = false;
    },
    handlePublish(params) {
      const rowData = _.cloneDeep(params.row);
      rowData.vaild = rowData.vaild === 'yes' ? 'no' : 'yes';
      this.loading = true;
      editProductStandard(rowData)
        .then((res) => {
          this.getTableData();
          this.$Message.success('操作成功!');
        })
        .finally((res) => {
          this.loading = false;
        });
    },
    handleBatchDel() {
      if (this.regionTableDataSelected.length < 1) {
        this.$Message.warning('请选中要删除的行');
        return;
      }
      const tempDeleteList = [];
      this.regionTableDataSelected.filter((value) => {
        tempDeleteList.push(value.id);
      });
      const strTempDelete = tempDeleteList.join(',');
      this.deleteRegionTable(strTempDelete);
    },
    handleRegin(params) {
      // 展示区间价格维护弹窗
      this.productStandardDetail = _.cloneDeep(params.row);
      this.priceRegionRowData.goodsStandardId = this.productStandardDetail.id;
      if (this.productStandardDetail.goodsType === 'FLASHSALE') {
        this.$Message.warning('活动商品不允许添加区间价');
        return;
      }
      this.getPriceRegionTableData();
      this.modalRegion = true;
    },
    handleSelectionChange(selection) {
      this.tableDataSelected = selection;
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.$refs.showClass.clearSelect();
    },
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    handleRegionAdd() {
      // 因为新增或修改由id是否为0判断
      this.goodsPriceRegion.id = 0;
      this.$refs.editRegionForm.resetFields();
      this.modalEditRegion = true;
    },
    handleRelation() {
      this.getProductTableData();
      this.modalProduct = true;
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
    changePriceRegionPage(page) {
      this.priceRegionRowData.page = page;
      this.getPriceRegionTableData();
    },
    changePriceRegionPageSize(pageSize) {
      this.searchProductRowData.page = 1;
      this.searchProductRowData.rows = pageSize;
      this.getPriceRegionTableData();
    },
    handleProductSearch() {
      this.searchProductRowData.page = 1;
      this.searchLoading = true;
      this.getProductTableData();
    },
    handleProductClear() {
      // 重置商品搜索数据
      this.resetSearchProductRowData();
      this.clearSearchLoading = true;
      this.handleProductSearch();
    },
    handleGoodsRelation(row, index) {
      // 给基础商品信息赋值
      this.productStandardDetail.goodsId = row.id;
      this.productStandardDetail.baseGoodsName = row.goodsName;
      this.productStandardDetail.categoryName = row.categoryName;
      this.productStandardDetail.unitName = row.unitName;
      this.productStandardDetail.barCode = row.baseBar; // 商品对象的条码和规格对象里条码不一致
      // 给要关联的规格信息设置默认值，用户可以选择修改
      this.productStandardDetail.standardGoodsName = row.goodsName;
      this.productStandardDetail.goodsImage = row.goodsImage;
      this.productStandardDetail.goodsImages = row.goodsImages;
      this.productStandardDetail.vaild = 'no'; // 默认是未上架的
      this.setDefaultUploadList(this.productStandardDetail);
      this.modalProduct = false;
    },
    // 导出
    handleDownload() {
      var tableData;
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      this.searchRowData.page = pageSize;
      getProductStandardsPages(this.searchRowData).then((res) => {
        tableData = res.rows;
        this.searchRowData.rows = 20;
        this.searchRowData.page = pageSize;
        this.handleDown(tableData);
      });
    },
    handleDown(tableData) {
      exporGoodsStandard({
        exportType: 'GOODS_STANDARD'
      }).then((res) => {
        const tableColumns = res;
        tableData.forEach((item) => {
          item['price'] = (item['price'] / 100.0).toFixed(2);
          item['salePrice'] = (item['salePrice'] / 100.0).toFixed(2);
          item['svipPrice'] = (item['svipPrice'] / 100.0).toFixed(2);
          if (item['vaild'] === 'yes') {
            item['vaild'] = '上架';
          } else {
            item['vaild'] = '下架';
          }
          if (item['goodsArea'] === 'domestic') {
            item['goodsArea'] = '国产';
          } else if (item['goodsArea'] === 'imported') {
            item['goodsArea'] = '进口';
          }
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleCustomDownload({
          filename: `商品规格-${date}`,
          data: tableData,
          columns: tableColumns
        });
      });
    },
    goBack() {
      this.turnToPage('wholesale-goods-info');
    },
    findUnit(unitCode) {
      if (this.unitsList != null) {
        const obj = this.unitsList.find((item) => item.value === unitCode);
        if (obj) {
          return obj.label;
        }
      }
    },
    resetFields() {
      // 表单重置
      this.$refs.editForm.resetFields();
      // 图片上传列表清除
      this.uploadListMain = [];
      this.uploadListMultiple = [];
      this.uploadListMultiple_ = [];
    },
    // 上架商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.productStandardDetail.goodsImage = null;
      this.productStandardDetail.goodsImage = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },

    // 上架轮播图
    handleSuccessMultiple_(response, file, fileList) {
      this.uploadListMultiple_ = fileList;
      this.goodsImageList = [];
      fileList.forEach((value) => {
        if (value.url) {
          this.goodsImageList.push(value.url);
        }
      });

      this.productStandardDetail.rotationImage = null;
      this.productStandardDetail.rotationImage = this.goodsImageList.join(',');
      this.masterImage = this.goodsImageList[0];
    },
    // 上架规格描述图
    handleSuccessMultiple(response, file, fileList) {
      this.uploadListMultiple = fileList;
      this.productDetailsList = [];
      fileList.forEach((value) => {
        if (value.url) {
          this.productDetailsList.push(value.url);
        }
      });
      this.productStandardDetail.goodsImages = '';
      this.productStandardDetail.goodsImages = this.productDetailsList.join(
        ','
      );
    },
    handleRemoveMultiple(file) {
      this.$refs.uploadMultiple.deleteFile(file);
      const index = this.productDetailsList.indexOf(file.url);
      if (Number(index) > -1) {
        this.productDetailsList.splice(index, 1);
        this.productStandardDetail.goodsImages = this.productDetailsList.join(
          ','
        );
      }
      if (this.productDetailsList.length === 0) {
        this.$refs.uploadMultiple.clearFileList();
        this.productDetailsList = [];
        this.productStandardDetail.goodsImages = '';
      }
    },
    // 设置编辑图片列表
    setDefaultUploadList(res) {
      if (res.goodsImage != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.goodsImage;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }

      if (res.goodsImages != null) {
        const descriptionImgArr = [];
        const descriptionArr = res.goodsImages.split(',');
        descriptionArr.forEach((value) => {
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
        const goodsImageArr = [];
        const rotationArr = res.rotationImage.split(',');
        rotationArr.forEach((value) => {
          const innerMapDetailImg_ = { status: 'finished', url: 'url' };
          innerMapDetailImg_.url = value;
          goodsImageArr.push(innerMapDetailImg_);
        });
        this.$refs.uploadMultiple_.setDefaultFileList(goodsImageArr);
        this.uploadListMultiple_ = goodsImageArr;
      }
    },
    handleRemoveMultiple_(file) {
      this.$refs.uploadMultiple_.deleteFile(file);
      const index = this.goodsImageList.indexOf(file.url);
      if (index > -1) {
        this.goodsImageList.splice(index, 1);
        this.productStandardDetail.rotationImage = this.goodsImageList.join(
          ','
        );
        this.masterImage = this.goodsImageList[0];
      }
      if (this.goodsImageList.length === 0) {
        this.$refs.uploadMultiple_.clearFileList();
        this.goodsImageList = [];
        this.productStandardDetail.rotationImage = '';
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.productStandardDetail.goodsImage = null;
    },

    goodsAreaChange(value) {
      this.productStandardDetail.goodsArea = value;
    },
    getProductCategoriesTree() {
      this.loading = true;
      getProductCategoriesTree()
        .then((res) => {
          if (res && res.length > 0) {
            const menuList = buildMenu(res);
            const map = {
              id: 'id',
              title: 'title',
              children: 'children'
            };
            this.goodsCategoryData = convertTreeCategory(menuList, map, true);
            console.log('21312321321313=========', this.goodsCategoryData);
          }
        })
        .finally(() => {
          this.loading = false;
        });
      this.getTableData();
    },
    goodsCategoryChange(value, selectedData) {
      if (selectedData.length > 0) {
        this.searchRowData.categoryId =
          selectedData[selectedData.length - 1].id;
      } else {
        this.searchRowData.categoryId = null;
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
}
</style>
