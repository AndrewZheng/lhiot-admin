import Cookies from 'js-cookie';
// cookie保存的天数
import config from '@/config';
import { forEach, hasOneOf, objEqual } from '@/libs/tools';
import { PcLockr, enums } from '@/util/';
import _ from 'lodash';

export const TOKEN_KEY = 'token';
export const IF_REMEMBER = 'if_remember'
export const GOODS_STANDARD = 'goodsStandard';
export const SMAL_GOODS_STANDARD = 'smallGoodsStandard';
export const WHOLESALE_GOODS = 'wholesaleGoods';
export const WHOLESALE_ACTIVITY = 'wholesaleActivity';
export const SMALL_COUPON_ACTIVITY = 'smallCouponActivity';
export const ARTICLE = 'article';
export const LHIOT_TOKEN = 'lhiot_token';

export const setGoodsStandard = (goodsStandard) => {
  const string = JSON.stringify(goodsStandard);
  Cookies.set(GOODS_STANDARD, string, {
    expires: config.cookieExpires || 1
  });
};

export const getGoodsStandard = () => {
  return JSON.parse(Cookies.get(GOODS_STANDARD));
};

export const setSmallGoodsStandard = (smallGoodsStandard) => {
  const string = JSON.stringify(smallGoodsStandard);
  Cookies.set(SMAL_GOODS_STANDARD, string, {
    expires: config.cookieExpires || 1
  });
};

export const getSmallGoodsStandard = () => {
  return JSON.parse(Cookies.get(SMAL_GOODS_STANDARD));
};

export const setWholesaleGoods = (goods) => {
  const string = JSON.stringify(goods);
  Cookies.set(WHOLESALE_GOODS, string, {
    expires: config.cookieExpires || 1
  });
};

export const getWholesaleGoods = () => {
  return JSON.parse(Cookies.get(WHOLESALE_GOODS));
};

export const setActivity = (activity) => {
  const string = JSON.stringify(activity);
  Cookies.set(WHOLESALE_ACTIVITY, string, {
    expires: config.cookieExpires || 1
  });
};

export const getActivity = () => {
  return JSON.parse(Cookies.get(WHOLESALE_ACTIVITY));
};

export const setSmallCouponActivity = (smallCouponActivity) => {
  const string = JSON.stringify(smallCouponActivity);
  Cookies.set(SMALL_COUPON_ACTIVITY, string, {
    expires: config.cookieExpires || 1
  });
};

export const getSmallCouponActivity = () => {
  return JSON.parse(Cookies.get(SMALL_COUPON_ACTIVITY));
};

export const setArticle = (article) => {
  const string = JSON.stringify(article);
  Cookies.set(ARTICLE, string, {
    expires: config.cookieExpires || 1
  });
};

export const getArticle = () => {
  return JSON.parse(Cookies.get(ARTICLE));
};

// 是否记住用户账号密码
export const setRemember = (if_remember) => {
  const string = JSON.stringify({ if_remember });
  Cookies.set(IF_REMEMBER, string, {
    expires: config.cookieExpires || 1
  });
};

// 是否记住用户账号密码
export const getRemember = () => {
  const tempRemember = Cookies.get(IF_REMEMBER);
  if (tempRemember) {
    const token = JSON.parse(tempRemember);
    if (token) return token.if_remember;
    else return false;
  } else {
    return false;
  }
};

export const setToken = (token) => {
  const remember = getRemember();
  if (remember) {
    // 记住账号密码
    Cookies.set(TOKEN_KEY, token, {
      expires: config.cookieExpires || 1
    });
  } else {
    // 没有记住账号密码
    sessionStorage.setItem(LHIOT_TOKEN, token);
  }
};

export const getToken = () => {
  const remember = getRemember();
  if (remember) {
    // 记住账号密码
    const token = Cookies.get(TOKEN_KEY);
    if (token) return token;
    else return false;
  } else {
    // 没有记住账号密码
    const tempLhiot_token = sessionStorage.getItem(LHIOT_TOKEN);
    if (tempLhiot_token) return tempLhiot_token;
    else return false;
  }
};

export const hasChild = (item) => {
  return item.children && item.children.length !== 0;
};

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true;
    else return false;
  } else return true;
};

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list) => {
  const res = [];
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      const obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      };
      if ((hasChild(item) || (item.meta && item.meta.showAlways))) {
        obj.children = getMenuByRouter(item.children);
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href;
      res.push(obj);
    }
  });
  return res;
};

/**
 * 递归获取静态路由表的Names
 * @param routes constantRouterMap
 * @param currentRoute
 */
export const getNamesByRouters = (routes) => {
  let res = [];

  routes.forEach(route => {
    if (route.name) res.push(route.name);
    if (route.children) {
      res = res.concat(getNamesByRouters(route.children));
    }
  });

  return res;
};

/**
 * @param {Array} list 通过返回的用户权限菜单
 * @param {Array} list 本地所有路由
 * @returns {Array}
 */
export const filterLocalRoute = (routeList, routersLocal) => {
  let actualRouter = [];
  const findLocalRoute = (array, base) => {
    const replyResult = [];
    array.forEach(route => {
      // let pathKey = (base ? base + '/' : '') + route.path;
      // if (route.path == '/' || route.path == '/home') {
      //   pathKey = route.path;
      // }
      routeList.forEach(accessRoute => {
        if (accessRoute.code === route.name) {
          if (Array.isArray(route.children)) {
            route.children = findLocalRoute(route.children, route.path);
          }
          replyResult.push(route);
        }
      });
    });

    if (base) {
      return replyResult;
    } else {
      actualRouter = actualRouter.concat(replyResult);
    }
  };
  const tempRouteLocal = _.cloneDeep(routersLocal);
  findLocalRoute(tempRouteLocal);
  return actualRouter;
};

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  const routeMetched = route.matched;
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide;
  }).map(item => {
    const meta = {
      ...item.meta
    };
    if (meta.title && typeof meta.title === 'function') meta.title = meta.title(route);
    const obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    };
    return obj;
  });
  res = res.filter(item => {
    return !item.meta.hideInMenu;
  });
  return [Object.assign(homeRoute, {
    to: homeRoute.path
  }), ...res];
};

export const getRouteTitleHandled = route => {
  const router = {
    ...route
  };
  const meta = {
    ...route.meta
  };
  if (meta.title && typeof meta.title === 'function') meta.title = meta.title(router);
  router.meta = meta;
  return router;
};

export const showTitle = (item, vm) => vm.$config.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name);

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list);
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList;
  return list ? JSON.parse(list) : [];
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
  let i = -1;
  const len = routers.length;
  let homeRoute = {};
  while (++i < len) {
    const item = routers[i];
    if (item.children && item.children.length) {
      const res = getHomeRoute(item.children);
      if (res.name) return res;
    } else {
      // 获取子系统独立的首页
      if (PcLockr.get(enums.SYSTEM) != null) {
        let sname = 'home';
        const currentSystem = JSON.parse(PcLockr.get(enums.SYSTEM));
        sname = currentSystem.code.split('_')[0] + '-home';
        sname = sname === 'manager-home' ? 'home' : sname; // 如果是综合管理系统还是跳转公共首页
        if (item.name === sname) homeRoute = item;
      } else {
        if (item.name === 'home') homeRoute = item;
      }
    }
  }
  return homeRoute;
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const {
    name,
    path,
    meta
  } = newRoute;
  const newList = [...list];
  if (newList.findIndex(item => item.name === name) >= 0) return newList;
  else {
    newList.push({
      name,
      path,
      meta
    });
  }
  return newList;
};

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access);
  else return true;
};

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children);
      } else if (item.name === name) {
        return hasAccess(access, item);
      }
    });
  };

  return routePermissionJudge(routes);
};

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&');
  const paramObj = {};
  keyValueArr.forEach(item => {
    const keyValue = item.split('=');
    paramObj[keyValue[0]] = keyValue[1];
  });
  return paramObj;
};

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {};
  if (list.length === 2) {
    res = getHomeRoute(list);
  } else {
    const index = list.findIndex(item => routeEqual(item, route));
    console.log(route, index, list.length);
    if (index === list.length - 1) res = list[list.length - 2];
    else res = list[index + 1];
  }
  return res;
};

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1;
  while (++i < times) {
    callback(i);
  }
};

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  const nameSplit = file.name.split('.');
  const format = nameSplit[nameSplit.length - 1];
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file); // 以文本格式读取
    let arr = [];
    reader.onload = function(evt) {
      const data = evt.target.result; // 读到的数据
      const pasteData = data.trim();
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t');
      }).map(item => {
        return item[0].split(',');
      });
      if (format === 'csv') resolve(arr);
      else reject(new Error('[Format Error]:你上传的不是Csv文件'));
    };
  });
};

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = [];
  let tableData = [];
  if (array.length > 1) {
    const titles = array.shift();
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      };
    });
    tableData = array.map(item => {
      const res = {};
      item.forEach((col, i) => {
        res[titles[i]] = col;
      });
      return res;
    });
  }
  return {
    columns,
    tableData
  };
};

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode;
    } else {
      return findNodeUpper(ele.parentNode, tag);
    }
  }
};

export const findNodeUpperByClasses = (ele, classes) => {
  const parentNode = ele.parentNode;
  if (parentNode) {
    const classList = parentNode.classList;
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode;
    } else {
      return findNodeUpperByClasses(parentNode, classes);
    }
  }
};

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase();
  if (ele.childNodes.length) {
    let i = -1;
    const len = ele.childNodes.length;
    while (++i < len) {
      const child = ele.childNodes[i];
      if (child.tagName === tagName) return child;
      else return findNodeDownward(child, tag);
    }
  }
};

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access);
};

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {};
  const params2 = route2.params || {};
  const query1 = route1.query || {};
  const query2 = route2.query || {};
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2);
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  const len = tagNavList.length;
  let res = false;
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true;
  });
  return res;
};

// sessionStorage
export const session = function(key, value) {
  if (value === void (0)) {
    var lsVal = sessionStorage.getItem(key);
    if (lsVal && lsVal.indexOf('autostringify-') === 0) {
      return JSON.parse(lsVal.split('autostringify-')[1]);
    } else {
      return lsVal;
    }
  } else {
    if (typeof (value) === 'object' || Array.isArray(value)) {
      value = 'autostringify-' + JSON.stringify(value);
    }
    return sessionStorage.setItem(key, value);
  }
};

// 生成随机数
export const getUUID = function(len) {
  len = len || 6;
  len = parseInt(len, 10);
  len = isNaN(len) ? 6 : len;
  var seed = '0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ';
  var seedLen = seed.length - 1;
  var uuid = '';
  while (len--) {
    uuid += seed[Math.round(Math.random() * seedLen)];
  }
  return uuid;
};

// 深拷贝
export const deepcopy = function(source) {
  if (!source) return source;
  const sourceCopy = source instanceof Array ? [] : {};
  for (const item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item];
  }
  return sourceCopy;
};

// 菜单数据组织
export const buildMenu = (array, ckey, isFind = true) => {
  const menuData = [];
  const indexKeys = Array.isArray(array) ? array.map((e) => {
    return e.id;
  }) : [];
  ckey = ckey || 'parentid';
  array.forEach((e) => {
    // 一级菜单
    if (!e[ckey] || (e[ckey] === e.id) || e[ckey] == '0') {
      delete e[ckey];
      menuData.push(deepcopy(e)); // 深拷贝
    } else if (Array.isArray(indexKeys)) {
      // 检测ckey有效性
      const parentIndex = indexKeys.findIndex((id) => {
        return id == e[ckey];
      });
      if (parentIndex === -1) {
        menuData.push(e);
      }
    }
  });

  const findChildren = (parentArr) => {
    if (Array.isArray(parentArr) && parentArr.length) {
      parentArr.forEach((parentNode) => {
        array.forEach((node) => {
          if (parentNode.id === node[ckey]) {
            if (parentNode.children) {
              parentNode.children.push(node);
            } else {
              parentNode.children = [node];
            }
          }
        });
        // 过滤掉重复的项
        parentNode.children = _.uniqBy(parentNode.children, 'id');
        if (parentNode.children && isFind) {
          findChildren(parentNode.children);
        }
      });
    }
  };
  findChildren(menuData);
  console.log('menuData mutile level: ', menuData);
  return menuData;
};

export const getRoutes = (routeList) => {
  const routeHash = {};
  const setMenu2Hash = function(array, base) {
    array.map(key => {
      if (key.path) {
        const hashKey = ((base ? base + '/' : '') + key.path).replace(/^\//, '');
        routeHash['/' + hashKey] = true;
        if (Array.isArray(key.children)) {
          setMenu2Hash(key.children, key.path);
        }
      }
    });
  };

  if (Array.isArray(routeList)) {
    const arrayMenus = buildMenu(routeList, 'parentid');
    console.log('built menus: ', arrayMenus);
    setMenu2Hash(arrayMenus);
  }
  // Get hash structure
  return routeHash;
};

/**
 * tree 数据转换
 * @param  {Array} tree 待转换的 tree
 * @param  {Object} map  键值对映射
 * @param  {Boolean} isExpand 默人是否全展开
 * @return {Array}    转换后的 tree
 */
export const convertTree = (tree, map, isExpand = false) => {
  const result = [];

  // 遍历 tree
  tree.forEach((item) => {
    // 读取 map 的键值映射
    const title = item[map.title];
    let children = item[map.children];

    // 对应iview Tree Props
    const obj = {
      expand: isExpand,
      disabled: false,
      disableCheckbox: false,
      selected: false,
      checked: false
    };
    // 如果有子节点，递归
    if (children) {
      children = convertTree(children, map, isExpand);
    }

    result.push({
      ...item,
      ...obj,
      title,
      children
    });
  });

  return result;
};

export const convertTreeCategory = (tree, map, isExpand = false) => {
  const result = [];
  // 遍历 tree
  tree.forEach((item) => {
    // 读取 map 的键值映射
    const value = item[map.id];
    const label = item[map.title];
    let children = item[map.children];
    // 如果有子节点，递归
    if (children.length > 0) {
      children = convertTreeCategory(children, map, isExpand);
      result.push({
        ...item,
        disabled: false,
        value,
        label,
        children
      });
    } else {
      result.push({
        ...item,
        disabled: false,
        value,
        label,
        children
      });
    }
  });
  return result;
};

export const setTreeNodeChecked = (tree, ids) => {
  if (ids.length > 0) {
    ids.forEach(id => {
      tree.forEach(node => {
        if (id == node.id && node.type === 'SON') {
          node.checked = true;
        }
        if (node.children.length > 0) {
          setTreeNodeChecked(node.children, ids);
        }
      });
    });
  } else {
    tree.forEach(node => {
      node.checked = false;
      node.selected = false;
      if (node.children.length > 0) {
        setTreeNodeChecked(node.children, '');
      }
    });
  }
  return tree;
};

export const getParent = (tree, map, id) => {
  // let count = 0;
  const parentIds = [];
  // let find = false
  // 遍历 tree
  tree.forEach((item) => {
    const children = item[map.children];
    // 如果有子节点，递归
    if (children.length > 0) {
      // count = count + 1;
      getParent(children, map, id);
    } else {
      // if (count > 0) {
      //   // disabled: true,
      //   if (!find) {
      //     parentIds[0] = itemId;
      //   }
      // } else {
      //   // disabled: false,
      //   if (itemId === id) {
      //     console.log(itemId);
      //     parentIds[1] = itemId;
      //     find = true
      //   }
      // }
    }
  });
  return parentIds;
};

/**
 * @param {*} obj 对象
 * @param {*} oldKey 原有的key名称数组
 * @param {*} newKey 新的key名称数组
 * @description 批量修改原有对象key的名称（两个key名称数组长度必须一致,长度不一致的多余的key不替换）
 */
export const changeObjKeyName = (obj, oldKey, newKey) => {
  if (obj.length === 0) return [];
  else if (oldKey.length === 0 && newKey.length === 0) return obj;
  else {
    for (var i = 0; i < obj.length; i++) {
      // 如果oldKey数组长度 > newKey数组长度，则多余的那个oldKey名称不替换
      if (oldKey.length > newKey.length) {
        newKey.forEach((value, index) => {
          // 复制原有key的值，并把替换为新的key名称
          obj[i][newKey[index]] = obj[i][oldKey[index]];
          // 删除原有的key字段
          delete obj[i][oldKey[index]];
        });
      } else { // 如果oldKey数组长度 < newKey数组长度，则多余的那个newKey名称不替换,如果newKey数组长度 = oldKey数组，则全部替换
        oldKey.forEach((value, index) => {
          obj[i][newKey[index]] = obj[i][oldKey[index]];
          delete obj[i][oldKey[index]];
        });
      }
    }
    return obj;
  }
};

/**
 * 比较两个时间的大小
 * @param data1
 * @param data2
 */
export const compareData = (date1, date2) => {
  if (!(date1 && date2)) { return false; }
  const oDate1 = new Date(date1);
  const oDate2 = new Date(date2);
  return oDate1.getTime() > oDate2.getTime();
};

export const compareCouponData = (date) => {
  const time1 = new Date(date).getTime();
  const time2 = new Date().getTime();
  return time1 > time2;
};

/**
 * 计算分转元 保留两位小数
 */
export const fenToYuanDot2 = (number) => {
  if (typeof number === 'number') {
    return '¥' + (number / 100.00).toFixed(2);
  } else if (typeof number === 'string') {
    return '¥' + (parseInt(number) / 100.00).toFixed(2);
  }
  return number;
};

/**
 * 计算转化率
 */
export const percent = (number) => {
  if (typeof number === 'number') {
    return (number * 100.00).toFixed(2) + '%';
  } else if (typeof number === 'string') {
    return (number * 100.00).toFixed(2) + '%';
  }
  return number;
};

export const gitTime = (time) => {
  const date = new Date(time)
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var second = date.getSeconds();
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

// hd折扣
export const HdDiscount = (number) => {
  if (typeof number === 'number') {
    return (number * 10.00) + '折';
  }
  return number;
};
// 加¥和天数
export const addRnb = (number) => {
  if (typeof number === 'number') {
    return '¥' + (number).toFixed(2);
  }
  return number;
};

export const addDay = (number) => {
  if (typeof number === 'number') {
    return (number) + ' 天';
  }
  return number;
};

export const yuanToFenNumber = (value) => {
  if (typeof value === 'number') {
    return Math.round((value * 100));
  } else if (typeof value === 'string') {
    return Math.round((parseInt(value) * 100));
  }
};

export const fenToYuanDot2Number = (value) => {
  if (typeof value === 'number') {
    return Math.round(value) / 100.00;
  } else if (typeof value === 'string') {
    return Math.round(parseInt(value) / 100.00);
  } else {
    return null;
  }
};

export const secondsToDate = (value) => {
  if (!value) {
    return 'N/A';
  } else if (typeof value === 'number') {
    let hour = parseInt(value / 3600);
    let minute = parseInt(value % 3600 / 60);
    let secods = value % 3600 % 60;
    if (hour < 10) { hour = '0' + hour; }
    if (minute < 10) { minute = '0' + minute; }
    if (secods < 10) { secods = '0' + secods; }
    return hour + ':' + minute + ':' + secods;
  } else {
    return value;
  }
};

export const replaceByTag = (value, tag = '&') => {
  if (!value) { return value; }
  return value.replace(/\n|\r/g, tag);
}

export const replaceByTab = (value) => {
  if (!value) { return value; }
  return value.replace(/&/g, '\n');
}

export const download = (data, name) => {
  const content = data;
  const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
  const fileName = name;
  if ('download' in document.createElement('a')) { // 非IE下载
    const elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
    console.log('download excel:', fileName);
  } else { // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}

// 根据当前系统获取应该跳转的home页面的routerName
export const getSystemHomeName = () => {
  let name = 'home';
  if (PcLockr.get(enums.SYSTEM) != null) {
    const currentSystem = JSON.parse(PcLockr.get(enums.SYSTEM));
    name = currentSystem.code.split('_')[0] + '-home';
    name = name === 'manager-home' ? 'home' : name; // 如果是综合管理系统还是跳转公共首页
    console.log('current system home: ', name);
  }
  return name;
}
// 根据当前系统获取应该跳转的home页面的routerName
export const getSystemHomeNameNew = (toLodop) => {
  if (toLodop != '' && toLodop.indexOf('.exe') > 0) {
    return toLodop;
  }
  let name = 'home';
  if (PcLockr.get(enums.SYSTEM) != null) {
    const currentSystem = JSON.parse(PcLockr.get(enums.SYSTEM));
    name = currentSystem.code.split('_')[0] + '-home';
    name = name === 'manager-home' ? 'home' : name; // 如果是综合管理系统还是跳转公共首页
    console.log('current system home: ', name);
  }
  return name;
}
