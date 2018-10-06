import { getParams } from '@/libs/util';

export const getSystemList = req => {
  return {
    'array': [
      {
        'pid': null,
        'id': 1,
        'name': '拼团小程序',
        'code': 'team-buy-system',
        'status': null,
        'sort': 1,
        'icon': '-'
      },
      {
        'pid': null,
        'id': 7,
        'name': '后台管理系统',
        'code': 'system',
        'status': null,
        'sort': null,
        'icon': '-'
      },
      {
        'pid': null,
        'id': 2,
        'name': '微商城小程序',
        'code': 'wechat-system',
        'status': null,
        'sort': 2,
        'icon': '-'
      },
      {
        'pid': null,
        'id': 3,
        'name': 'App应用',
        'code': 'app',
        'status': null,
        'sort': 3,
        'icon': '-'
      },
      {
        'pid': null,
        'id': 5,
        'name': '微商城用户管理',
        'code': 'wechat-user',
        'status': null,
        'sort': 100,
        'icon': '-'
      }
    ]
  };
};
