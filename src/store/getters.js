const getters = {
  token: state => state.user.token,
  hasGetInfo: state => state.user.hasGetInfo,
  systemList: state => state.app.systemList
};

export default getters;
