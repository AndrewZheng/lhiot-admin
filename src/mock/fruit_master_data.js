import Mock from 'mockjs';
import {
  doCustomTimes,
  getParams
} from '@/libs/util';

const Random = Mock.Random;

export const getFruitMasterUserData = req =>{
  const {page = 1, rows = 10} = JSON.parse(req.body);
  let list = [];
  let randomData = Mock.mock({
    'array|50': [{
      'id|500000000000000-599999999999999': 500000000000000,
      name: '@name',
      phoneNumber: Random.integer(13100000000, 19999999999),
      openid:'254dsgsd2sdgsdg54as45',
      unionid:'254dsgsd2sdgsdg54as45',
      cash: Random.integer(1, 1000),
      bonus: '0',
      status: '正常',
      registerTime: '2018-10-28'
    }]
  }).array;
  list.push(...randomData);
  const pageList = list.filter((item, index) => index < rows * page && index >= rows * (page - 1));
  return {
    'array': pageList,
    'total': list.length
  };
}
