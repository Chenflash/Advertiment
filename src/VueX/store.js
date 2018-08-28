import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);  //应用vueX，应用状态管理

//初始化定义state对象和mutation
const state={
    isloading:false,  //加载中的数据
    isCount:0,       //统计是否加载过，加载过则无需加载
    showRedPackage:false, //是否显示红包
    showChose:false,    //是否选择城市组件
    
    
}
const mutations={
  increatement(state){
      state.isloading=true;
  },
  decrement(state){
      state.isloading= false;
  },
  iscreateCount(state){
      state.isCount=1;
  },
  increateShow(state){
      state.showRedPackage=true;
  },
  decrementShow(state){
      state.showRedPackage=false;
  },
  increateChose(state){
    state.showChose=true;
  },
    decrementChose(state){
        state.showChose=false;
    }
  
}
export default new Vuex.Store({
    state,
    mutations
})