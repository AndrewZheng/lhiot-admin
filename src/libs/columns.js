export const goods_on_sales_columns = [
  {
    title: '上架图片',
    key: 'id',
    width: 120,
    render: (h, params, vm) => {
      let {row} = params
      const str = <img src={row.image} style="margin-top:5px" height="60" width="60" margin-top="10px"/>;
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
    key: 'shelfStatus',
  }
]

export const custom_plan_columns = [

]
