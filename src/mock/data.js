import Mock from 'mockjs';
import {
  doCustomTimes,
  getParams
} from '@/libs/util';

const Random = Mock.Random;

export const getTableData = req => {
  let tableData = [];
  const {
    page = 1, rows = 10
  } = getParams(req.url);
  doCustomTimes(47, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      createTime: '@date'
    }));
  });

  const pageList = tableData.filter((item, index) => index < rows * page && index >= rows * (page - 1));

  return {
    'data': pageList,
    'total': tableData.length
  };
};

export const getDragList = req => {
  let dragList = [];
  doCustomTimes(5, () => {
    dragList.push(Mock.mock({
      name: Random.csentence(10, 13),
      id: Random.increment(10)
    }));
  });
  return dragList;
};
