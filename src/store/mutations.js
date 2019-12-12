const mutations = {
  changeName(state, v) {
    state.name = v;
  },
  changeDetails(state, v) {
    state.details = v;
  },
  //显示蒙版
  showMask(state, v) {
    state.isMask = v;
  }
}
export default mutations
