import { getParams } from '@/libs/util';

const USER_MAP = {
  super_admin: {
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  },
  opreator: {
    name: 'opreator',
    user_id: '3',
    access: ['opreator'],
    token: 'opreator',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
};

export const login = req => {
  req = JSON.parse(req.body);
  return {
    token: USER_MAP[req.userName].token
  };
};

export const getUserInfo = req => {
  const params = getParams(req.url);
  return USER_MAP[params.token];
};

export const logout = req => {
  return null;
};
 
export const getMenusByUser = req => {
  const params = getParams(req.url);
  const { userid } = params;
   /**
   *  meta: {
        hideInMenu: (default: false) 设为true后在左侧菜单不会显示该页面选项
        showAlways: (default: false) 设为true后如果该路由只有一个子路由，在菜单中也会显示该父级菜单
        notCache: (default: false) 设为true后页面不会缓存
        access: (default: null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
        icon: (default: -) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
        href: 'https://xxx' (default: null) 用于跳转到外部连接
      }
   */
  return [{
    'systemType': 'APP',
    'routeList': [
      {
        'id': '1',
        'parentid': 0,
        'code': 'home',
        'path': '/home',
        'component': 'Home',
        'meta': {
          'title': '首页',
          'icon': 'ios-home',
          hideInMenu: true,
          notCache: true
        }
      },
      {
        'id': '2',
        'parentid': 0,
        'code': 'doc',
        'path': '',
        'meta': {
          'title': '文档',
          'icon': 'ios-book',
          'href': 'https://lison16.github.io/iview-admin-doc/#/'
        }
      },
      {
        'id': '3',
        'parentid': 0,
        'code': 'join',
        'path': '/join',
        'component': 'Main'
      },
      {
        'id': '4',
        'parentid': 3,
        'code': 'join_page',
        'path': 'join_page',
        'component': 'JoinPage',
        'meta': {
          'title': '实战演练',
          'icon': '_qq',
          'href': ''
        }
      },
      {
        'id': '5',
        'parentid': 0,
        'code': 'components',
        'path': '/components',
        'meta': {
          'title': '组件',
          'icon': 'logo-buffer'
        },
        'component': 'Main'
      },
      {
        'id': '6',
        'parentid': 5,
        'code': 'count_to_page',
        'path': 'count_to_page',
        'component': 'CountTo',
        'meta': {
          'title': '数字渐变',
          'icon': 'md-trending-up'
        }
      },
      {
        'id': '7',
        'parentid': 5,
        'code': 'drag_list_page',
        'path': 'drag_list_page',
        'component': 'DragList',
        'meta': {
          'title': '拖拽列表',
          'icon': 'ios-infinite'
        }
      },
      {
        'id': '8',
        'parentid': 5,
        'path': 'tables_page',
        'code': 'tables_page',
        'component': 'Tables',
        'meta': {
          'title': '多功能表格',
          'icon': 'md-grid'
        }
      },
      {
        'id': '9',
        'parentid': 5,
        'path': 'split_pane_page',
        'code': 'split_pane_page',
        'component': 'SplitPane',
        'meta': {
          'title': '分割窗口',
          'icon': 'md-pause'
        }
      },
      {
        'id': '10',
        'parentid': 5,
        'path': 'markdown_page',
        'code': 'markdown_page',
        'component': 'MarkDown',
        'meta': {
          'icon': 'logo-markdown',
          'title': 'Markdown编辑器'
        }
      },
      // {
      //   'id': '11',
      //   'parentid': 5,
      //   'path': 'editor_page',
      //   'code': 'editor_page',
      //   'component': 'Editor',
      //   'meta': {
      //     'icon': 'ios-create',
      //     'title': '富文本编辑器'
      //   }
      // },
      // {
      //   'id': '12',
      //   'parentid': 5,
      //   'component': 'Icons',
      //   'path': 'icons_page',
      //   'code': 'icons_page',
      //   'meta': {
      //     'icon': '_bear',
      //     'title': '自定义图标'
      //   }
      // },
      {
        'id': '13',
        'parentid': 5,
        'path': 'tinymce_editor_page',
        'code': 'tinymce_editor_page',
        'component': 'TinymceEditor',
        'meta': {
          'icon': 'ios-create',
          'title': 'Tinymce编辑器'
        }
      }
    ]
  }];
};
