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
      'id|1-47': 1,
      name: '@name',
      'age|18-40': 1,
      sex: Random.integer(0, 1),
      email: '@email',
      birth: Random.date(),
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

export const getRoleData = req => {
  let tableData = [];
  const {
    page = 1, rows = 10
  } = getParams(req.url);
  doCustomTimes(47, () => {
    tableData.push(Mock.mock({
      'id|1-47': 1,
      name: '@name',
      status: Random.integer(0, 1),
      roleDesc: Random.csentence(10, 13),
      createBy: '@name',
      createAt: '@now'
    }));
  });

  const pageList = tableData.filter((item, index) => index < rows * page && index >= rows * (page - 1));

  return {
    'data': pageList,
    'total': tableData.length
  };
};
