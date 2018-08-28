<template>
  <div class="explainPage">
       <mt-header title="使用说明">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goback"></mt-button>
        </router-link>
        <mt-button  slot="right"></mt-button>
        </mt-header>
        

          
        <div v-if="!noFetch" v-show="!isloading">
           
            <ul class="Content" v-show="!isloading">
              <li @click="toDetail(item.doc_id)" v-for="(item,i) in list" :key="i">{{item.doc_title}}<img src="../../assets/leftArrow.png" class="leftArrow"/></li>
          </ul>

        </div>
         <!--没有网络的状态-->
       
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast,Indicator} from 'mint-ui';
export default {
  name: 'explainPage',
  data () {
    return {
       list:[],
       noFetch:false,
    }
  },
  computed: {
    isloading(){
      return this.$store.state.isloading;
    }
  },
  mounted(){
      if(navigator.onLine){   //有网络状态
        Indicator.open("加载中...")
      	this.$store.commit("increatement"); 
        this.fetchData();
    }else{   //无网络状态
       this.noFetch=true;
        Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
    }
  },
  methods:{
     fetchData(){
      
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       var that=this;
       axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=document&op=agreement',
                   transformRequest: [function (data) {
                      let ret = ''
                      for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                      }
                      return ret
                    }],
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(function(response){ 
                 Indicator.close();

               if(response!=undefined){
                that.$store.commit("decrement");
                if(response.data.code==200){
                  that.list=response.data.datas;

                }else{
                  Toast(response.data.datas.error);
                }
               }else{
                 that.noFetch=true;
                  Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
               }

            },(err)=>{
              Indicator.close();             
              that.$store.commit("decrement");
              Toast("发生网络错误，请稍后重试！");
            });
     },
     toDetail(ids){
       var domains = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
       window.location.href=domains+"#/explainDetailPage/"+ids;
     },
      goback(){
        app.toMine(); //返回我的模块
     },
      loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
          this.$store.commit("increatement");
          this.fetchData();
         }else{   //无网络状态
            this.noFetch=true;

               Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
          }
      }
    
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.mint-cell-title{
    display: -webkit-inline-box;
    font-size: 14px;
}
.Content{
  color:#000;
  background-color:#fff;
  padding-top: 5.6rem;

}
.Content li{
    display: flex;
    border-bottom: 1px solid #D9D9D9;
    height: 56px;
    font-size: 16px;
    position: relative;
    align-items: center;
}

.leftArrow{
   position: absolute;
    width: 15px;
    height: 18px;
    right: 10px;
}
.tits{

}

/*加载中*/

/*
*暂无数据
*/
.noNull{
    display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
  justify-content:center;
  flex-direction: column;
  align-items:center;
  width:100%;
}
.noNull img{
    width: 15rem;
   height: 15rem;
    margin-top: 100px;

}
.noNull p{
  font-size: 14px;
  padding-top:10px;
  color: #999999;
  line-height: 60px;
}

/*网络状态*/
.noFetch{
    height: 100vh;
    color: #999999;
    font-size: 14px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.noFetch img{
    width: 94px;
    height: 94px;
}
.noFetch p{
    line-height: 48px;
}
.btnFetch{
    width: 82px;
    height: 42px;
    background-color: #ff8800;
    color: #ffffff;
    font-size: 16px;
    letter-spacing: 4px;
    border-radius: 5px;
}


</style>

