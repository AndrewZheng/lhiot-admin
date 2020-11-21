<template>
  <div class="m-role">
    <Card style="padding: 20px 0 20px 30px; width: 600px">
      <h3 class="title">后台统一导出</h3>
      <div class="explort">
        <p style="margin-left: 30px">
          <i style="color: #ff3861">*</i> 数据分类：
        </p>
        <Select
          class="search-col mr5"
          placeholder="请选择需导出的数据"
          style="width: 200px"
          @on-change="handSelectExport"
        >
          <Option
            v-for="(item, index) in exportList"
            :key="`orderType-col-${item.value}`"
            :value="index"
            class="ptb2-5"
            style="padding: 5px 0 0 8px"
          >
            {{ item.label }}
          </Option>
        </Select>
        <p
          v-if="!searchRowData.id"
          style="margin-left:20px; font-size: 12px; color: #ff3861"
        >
          {{ `*请先选择数据分类` }}
        </p>
      </div>
      <div v-if="exportCondition[0]" class="ptb2-5">
        <div v-show="exportCondition[0]" class="explort ptb2-5">
          <p><i style="color: #ff3861">*</i> {{ exportCondition[0] + "：" }}</p>
          <Input
            v-if="exportCondition[0] != '开始时间'"
            v-model="searchRowData.p1"
            :placeholder="exportCondition[0]"
            class="search-input mr5"
            style="width: 200px"
            clearable
          ></Input>
          <DatePicker
            v-else
            :value="searchRowData.p1"
            format="yyyy-MM-dd"
            type="date"
            placeholder="开始时间"
            class="search-input"
            style="width: 200px"
            :clearable="false"
            @on-change="searchRowData.p1 = $event"
          />
          <p
            v-if="exportCondition[0] === '开始时间'"
            style="margin: 18px 0 0 20px; font-size: 12px; color: #ff3861"
          >
            *开始时间包含当天
          </p>
        </div>
        <div v-show="exportCondition[1]" class="explort ptb2-5">
          <p><i style="color: #ff3861">*</i> {{ exportCondition[1] + "：" }}</p>
          <Input
            v-if="exportCondition[1] != '结束时间'"
            v-model="searchRowData.p2"
            :placeholder="exportCondition[1]"
            class="search-input mr5"
            style="width: 200px"
            clearable
          ></Input>
          <DatePicker
            v-else
            :value="searchRowData.p2"
            format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间"
            class="search-input"
            style="width: 200px"
            :clearable="false"
            @on-change="searchRowData.p2 = $event"
          />
          <p
            v-if="exportCondition[1] === '结束时间'"
            style="margin: 18px 0 0 20px; font-size: 12px; color: #ff3861"
          >
            *结束时间不包含当天
          </p>
        </div>
        <div v-show="exportCondition[2]" class="explort ptb2-5">
          <p><i style="color: #ff3861">*</i> {{ exportCondition[2] + "：" }}</p>
          <Input
            v-model="searchRowData.p3"
            :placeholder="exportCondition[2]"
            class="search-input mr5"
            style="width: 200px"
          ></Input>
          <p
            v-if="!searchRowData.p3"
            style="margin: 18px 0 0 20px; font-size: 12px; color: #ff3861"
          >
            {{ `*请先输入${exportCondition[2]}` }}
          </p>
        </div>
      </div>
      <div class="handDownload" @click="handleDownload">导出</div>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import config from '@/config';
import { getUnifyExportList } from '@/api/mini-program';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';

const roleRowData = {
  id: '',
  p1: '',
  p2: '',
  p3: ''
};

export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      exportList: [],
      exportData: [],
      exportCondition: [],
      exportUrl: '',
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData)
    };
  },
  mounted() {
    this.getTableData();
  },
  created() {},
  methods: {
    getTableData() {
      const projectName = config.classifyTypeC;
      getUnifyExportList(projectName).then((res) => {
        this.exportData = res;
        res.forEach((value) => {
          const map = { label: 'label', value: 'value' };
          map.value = value.id;
          map.label = value.export_name;
          this.exportList.push(map);
        });
      });
    },
    handSelectExport(val) {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.searchRowData.id = this.exportData[val].id;
      if (this.exportData[val].condit_desc) {
        this.exportCondition = this.exportData[val].condit_desc.split(',');
        if (this.exportCondition[0] === '开始时间') {
          const date = new Date();
          const date1 = new Date();
          date.setDate(date.getDate() - 30);
          date1.setDate(date1.getDate());
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const year1 = date1.getFullYear();
          const month1 = date1.getMonth() + 1;
          const day1 = date1.getDate();
          const p1 = `${year1}-${month1}-${day1}`;
          const p2 = `${year}-${month}-${day}`;
          this.searchRowData.p1 = p2;
          this.searchRowData.p2 = p1;
        }
      } else {
        this.exportCondition = [];
      }
    },
    handleDownload() {
      console.log('数据', this.searchRowData);
      window.open(
        `http://172.16.10.196:5000/export?id=${this.searchRowData.id}&p1=${
          this.searchRowData.p1
        }&p2=${this.searchRowData.p2}${
          this.searchRowData.p3 ? '&p3=' + this.searchRowData.p3 : ''
        }`
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: -18px 0 30px -18px;
}
.explort {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}
.handDownload {
  display: block;
  width: 80px;
  height: 30px;
  background: #ff9900;
  margin-left: 230px;
  margin-top: 40px;
  text-align: center;
  line-height: 30px;
  border-radius: 3px;
  color: #ffffff;
  cursor: pointer;
}
</style>
