import { fenToYuanDot2 } from './util';
import { onSaleStatusConvert } from './converStatus';

export const goodsOnSalesColumns = [
  {
    title: '上架图片',
    key: 'id',
    width: 120,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.image} style='margin-top:5px' height='60' width='60' margin-top='10px'/>;
      return <div>{str}</div>;
    }
  },
  {
    title: '商品名称',
    key: 'productName',
    width: 150
  },
  {
    title: '上架名称',
    width: 150,
    key: 'name'
  },
  {
    title: '上架规格',
    width: 150,
    key: 'shelfSpecification'
  },
  {
    title: '规格条码',
    width: 150,
    key: 'barcode'
  },
  {
    title: '商品原价',
    minWidth: 120,
    key: 'originalPrice',
    sortable: true
  },
  {
    title: '商品特价',
    minWidth: 120,
    key: 'price',
    sortable: true
  },
  {
    title: '排序',
    minWidth: 80,
    key: 'sorting',
    sortable: true
  },
  {
    title: '是否上架',
    minWidth: 100,
    key: 'shelfStatus'
  }
];

export const customPlanColumns = [
  {
    title: '定制计划主图',
    width: 120,
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.image} style='margin-top:5px' height='60' width='60' margin-top='10px'/>;
      return <div>{str}</div>;
    }
  },
  {
    title: '定制计划名称',
    key: 'name',
    width: 150
  },
  {
    title: '价格(周/单人)',
    width: 120,
    render: (h, params, vm) => {
      const { row } = params;
      if (!row.periodList) {
        return <div></div>;
      }
      const obj = row.periodList.find(item => {
        return item.planPeriod === 7;
      });
      if (!obj) {
        return <div></div>;
      }
      if (!obj.specificationList) {
        return <div></div>;
      }
      const innerObj = obj.specificationList.find(item => {
        return item.quantity === 1;
      });
      if (!innerObj) {
        return <div></div>;
      }
      return <div>{fenToYuanDot2(innerObj.price)}</div>;
    }
  },
  {
    title: '价格(周/双人)',
    width: 120,
    render: (h, params, vm) => {
      const { row } = params;
      if (!row.periodList) {
        return <div></div>;
      }
      const obj = row.periodList.find(item => {
        return item.planPeriod === 7;
      });
      if (!obj) {
        return <div></div>;
      }
      if (!obj.specificationList) {
        return <div></div>;
      }
      const innerObj = obj.specificationList.find(item => {
        return item.quantity === 2;
      });
      if (!innerObj) {
        return <div></div>;
      }
      return <div>{fenToYuanDot2(innerObj.price)}</div>;
    }
  },
  {
    title: '价格(周/三人)',
    width: 120,
    render: (h, params, vm) => {
      const { row } = params;
      if (!row.periodList) {
        return <div></div>;
      }
      const obj = row.periodList.find(item => {
        return item.planPeriod === 7;
      });
      if (!obj) {
        return <div></div>;
      }
      if (!obj.specificationList) {
        return <div></div>;
      }
      const innerObj = obj.specificationList.find(item => {
        return item.quantity === 3;
      });
      if (!innerObj) {
        return <div></div>;
      }
      return <div>{fenToYuanDot2(innerObj.price)}</div>;
    }
  },
  {
    title: '价格(月/单人)',
    width: 120,
    render: (h, params, vm) => {
      const { row } = params;
      if (!row.periodList) {
        return <div></div>;
      }
      const obj = row.periodList.find(item => {
        return item.planPeriod === 30;
      });
      if (!obj) {
        return <div></div>;
      }
      if (!obj.specificationList) {
        return <div></div>;
      }
      const innerObj = obj.specificationList.find(item => {
        return item.quantity === 1;
      });
      if (!innerObj) {
        return <div></div>;
      }
      return <div>{fenToYuanDot2(innerObj.price)}</div>;
    }
  },
  {
    title: '价格(月/双人)',
    width: 120,
    render: (h, params, vm) => {
      const { row } = params;
      if (!row.periodList) {
        return <div></div>;
      }
      const obj = row.periodList.find(item => {
        return item.planPeriod === 30;
      });
      if (!obj) {
        return <div></div>;
      }
      if (!obj.specificationList) {
        return <div></div>;
      }
      const innerObj = obj.specificationList.find(item => {
        return item.quantity === 2;
      });
      if (!innerObj) {
        return <div></div>;
      }
      return <div>{fenToYuanDot2(innerObj.price)}</div>;
    }
  },
  {
    title: '价格(月/三人)',
    width: 120,
    render: (h, params, vm) => {
      const { row } = params;
      if (!row.periodList) {
        return <div></div>;
      }
      const obj = row.periodList.find(item => {
        return item.planPeriod === 30;
      });
      if (!obj) {
        return <div></div>;
      }
      if (!obj.specificationList) {
        return <div></div>;
      }
      const innerObj = obj.specificationList.find(item => {
        return item.quantity === 3;
      });
      if (!innerObj) {
        return <div></div>;
      }
      return <div>{fenToYuanDot2(innerObj.price)}</div>;
    }
  },
  {
    title: '是否上架',
    width: 100,
    render: (h, params, vm) => {
      const { row } = params;
      return <div>{onSaleStatusConvert(row.status).label}</div>;
    }
  }
];

export const goodsModulsColumns = [
  {
    title: 'ID',
    key: 'id',
    sortable: true,
    minWidth: 80,
    fixed: 'left'
  },
  {
    title: '板块名称',
    minWidth: 150,
    key: 'sectionName'
  },
  {
    title: '创建时间',
    minWidth: 160,
    key: 'createAt'
  },
  {
    title: '板块排序',
    minWidth: 150,
    key: 'sorting'
  }
];

export const customPlanSectionColumns = [
  {
    title: 'ID',
    key: 'id',
    sortable: true,
    width: 80,
    fixed: 'left'
  },
  {
    title: '板块名称',
    minWidth: 200,
    key: 'sectionName'
  },
  {
    title: '创建时间',
    width: 160,
    key: 'createAt'
  },
  {
    title: '板块排序',
    width: 150,
    key: 'sort'
  }
];

export const articleColumns = [
  {
    title: '文章标题',
    key: 'title',
    sortable: true,
    minWidth: 180,
    fixed: 'left'
  },
  {
    title: '关键词',
    key: 'keywords',
    minWidth: 150
  },
  {
    title: '作者',
    minWidth: 150,
    key: 'author'
  },
  {
    title: '创建时间',
    minWidth: 110,
    key: 'createAt'
  },
  {
    title: '发布状态',
    minWidth: 100,
    key: 'articleStatus',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.articleStatus === 'PUBLISH') {
        return <div>{'发布'}</div>;
      } else if (row.articleStatus === 'UN_PUBLISH') {
        return <div>{'未发布'}</div>;
      } else {
        return <div>{row.articleStatus}</div>;
      }
    }
  },
  {
    title: '发布时间',
    width: 110,
    key: 'publishAt',
    sortable: true
  }
];
