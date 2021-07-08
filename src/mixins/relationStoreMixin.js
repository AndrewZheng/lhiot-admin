import {
  getStorePages,
  getStoreCityPages,
  getAreaStorePages
} from '@/api/mini-program';

const mixin = {
  data() {
    return {
      showStoreName: '',
      cityCode: '0744',
      cityList: [],
      storeNameList: [],
      allStoreList: [],
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
      showStoreList: false,
      indeterminate: false,
      indeterminate1: false,
      indeterminate2: false,
      indeterminate3: false,
      indeterminate4: false,
      indeterminate5: false,
      indeterminate6: false,
      indeterminate7: false,
      // checkAllStore: false,
      checkAll: false,
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkAll4: false,
      checkAll5: false,
      checkAll6: false,
      checkAll7: false
    };
  },
  computed: {
    // indeterminateAll: {
    //   get() {
    //     if (this.cityCode === '0744') {
    //       return this.indeterminate || this.indeterminate1 || this.indeterminate2 || this.indeterminate3 ||
    //       this.indeterminate4 || this.indeterminate5 || this.indeterminate6;
    //     } else {
    //       return this.indeterminate || this.indeterminate1 || this.indeterminate2;
    //     }
    //   },
    //   set(newValue) {
    //     return newValue;
    //   }
    // }
    checkAllStore: {
      get() {
        if (this.cityCode === '0744') {
          return this.checkAll && this.checkAll1 && this.checkAll2 && this.checkAll3 &&
          this.checkAll4 && this.checkAll5 && this.checkAll6;
        } else {
          return this.checkAll && this.checkAll1 && this.checkAll2;
        }
      },
      set(newValue) {
        if (newValue) {
          this.checkBoxRestTrue();
        } else {
          this.checkBoxRest();
        }
      }
    }
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
    getStore(isCheck) {
      getAreaStorePages(this.cityCode)
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
          if (isCheck) {
            this.handleCheckSelected();
          }
        });
    },
    selectStore(options) {
      if (options.value === 'ALL') {
        this.addRelationDetail.relationStoreType = 'ALL';
        this.tempModalType === 'edit'
          ? (this.addRelationDetail.stores = '')
          : (this.addRelationDetail.stores = null);
        this.showStoreList = false;
      } else if (options.value === 'PART') {
        this.addRelationDetail.relationStoreType = 'PART';
        // 默认反选长沙市
        this.cityCode = '0744';
        this.storeCheckRest();
        this.getStore();
        this.showStoreList = true;
      }
    },
    handleCitySwitch() {
      this.checkAllStore = false;
      // 切换城市时继续保留反选数据
      this.getStore(true);
    },
    checkBoxRestTrue() {
      this.indeterminate = false;
      this.checkAll = true;
      this.indeterminate1 = false;
      this.checkAll1 = true;
      this.indeterminate2 = false;
      this.checkAll2 = true;
      this.indeterminate3 = false;
      this.checkAll3 = true;
      this.indeterminate4 = false;
      this.checkAll4 = true;
      this.indeterminate5 = false;
      this.checkAll5 = true;
      this.indeterminate6 = false;
      this.checkAll6 = true;
      this.indeterminate7 = false;
      this.checkAll7 = true;
    },
    checkBoxRest() {
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
    },
    storeCheckRest() {
      this.checkBoxRest();
      this.storeIds = [];
      this.addRelationDetail.stores = '';
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
    handleCheckAll(value) {
      const _this = this;
      if (value === -1) {
        const allIds = [];
        const beforeIds = [];

        this.checkAllStore = !this.checkAllStore;
        // 当勾选全选
        if (this.checkAllStore) {
          if (this.storeIds != null) {
            for (const val of this.storeIds) {
              allIds.push(val);
            }
          }
          this.storeListData.forEach((item) => {
            item.forEach(x => {
              allIds.push(x.storeId);
            })
          });
          this.storeIds = allIds;
          console.log(`allIds when checkall: `, allIds);
          this.addRelationDetail.stores = '[' + allIds.join('][') + ']';
        } else {
          this.storeListData.forEach((item) => {
            item.forEach(x => {
              beforeIds.push(x.storeId);
            })
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
        }
      }

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
          this.addRelationDetail.stores = '[' + allIds.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
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
          this.addRelationDetail.stores = '[' + allIds1.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
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
          this.addRelationDetail.stores = '[' + allIds2.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
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
          this.addRelationDetail.stores = '[' + allIds3.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
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
          this.addRelationDetail.stores = '[' + allIds4.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
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
          this.addRelationDetail.stores = '[' + allIds5.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
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
          this.addRelationDetail.stores = '[' + allIds6.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
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
          this.addRelationDetail.stores = '[' + allIds7.join('][') + ']';
        } else {
          this.storeList[value].storeList.forEach((item) => {
            beforeIds.push(item.storeId);
          });
          const newArray = _this.storeIds.filter(function(item) {
            return beforeIds.indexOf(item) == -1;
          });
          this.storeIds = newArray;
          this.addRelationDetail.stores = '[' + newArray.join('][') + ']';
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
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      } else if (
        data.length > 0 &&
          sameArray.length < this.storeList[0].storeList.length
      ) {
        this.indeterminate = true;
        this.checkAll = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
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
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      } else if (
        data.length > 0 &&
          sameArray1.length < this.storeList[1].storeList.length
      ) {
        this.indeterminate1 = true;
        this.checkAll1 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
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
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      } else if (
        data.length > 0 &&
          sameArray2.length < this.storeList[2].storeList.length
      ) {
        this.indeterminate2 = true;
        this.checkAll2 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
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
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      } else if (
        data.length > 0 &&
          sameArray3.length < this.storeList[3].storeList.length
      ) {
        this.indeterminate3 = true;
        this.checkAll3 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
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
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      } else if (
        data.length > 0 &&
          sameArray4.length < this.storeList[4].storeList.length
      ) {
        this.indeterminate4 = true;
        this.checkAll4 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
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
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      } else if (
        data.length > 0 &&
          sameArray5.length < this.storeList[5].storeList.length
      ) {
        this.indeterminate5 = true;
        this.checkAll5 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
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
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      } else if (
        data.length > 0 &&
          sameArray6.length < this.storeList[6].storeList.length
      ) {
        this.indeterminate6 = true;
        this.checkAll6 = false;
        this.addRelationDetail.stores = '[' + data.join('][') + ']';
      }
      if (sameArray6.length === 0) {
        this.indeterminate6 = false;
        this.checkAll6 = false;
      }
    }
  },
  mounted() {
    this.getStorePages();
    this.getStore();
    this.getStoreCityPages();
  }
};

export default mixin;

