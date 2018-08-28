
<template>
  <div class="walletPage">
       <mt-header title="钱包明细">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goBakc()"></mt-button>
        </router-link>
        <mt-button  slot="right"></mt-button>
        </mt-header>
     

   <!--有网络-->  
   <div v-if="!noFetch"  v-show="!isloading" style="padding-top:56px">
        <ul class="walletlist" 
               infinite-scroll-disabled="loading"
              infinite-scroll-distance="0"
               v-infinite-scroll="loadMore" v-if="!noData">
               <li v-for="(wallet,i) in walletlists" :key="i">
                  <div class="leftCell">
                      <p class="">{{wallet.content}}</p> 
                      <p class="createTime">{{wallet.create_time}}</p> 
                  </div>
                  <div class="rightCell">
                    <p v-bind:class="parseInt(wallet.total)>0?'redWallet':''"> {{wallet.total}}</p>
                  </div>
                </li>
                 <!--底部判断是加载图标还是提示“全部加载”-->
                  <div style="clear:both"></div>
                   <!--底部判断是加载图标还是提示“全部加载”-->
                    <div class="noMore"  v-if="isMore">
                    <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                    <div class="textloading" v-else>没有更多了</div>
                  </div>
              </ul> 
          <!--暂无数据-->
          <div class="noNull" v-if="noData"   >
            <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
            <p>暂无数据</p>   
         </div> 
    

  </div>



   </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast,Indicator } from 'mint-ui';

export default {
  name: 'walletPage',
  data () {
    return {
      //初始化无限加载相关参数
      loadingVal:0, //进度
      queryLoading: false,
      moreLoading: false,
      allLoaded: false,
      totalNum: 0,
      pageSize: 10,
      pageNum: 1,
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      scrollMode:"touch", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      totalpage:0,
      loading:false,
       haveMore:false, //是否还有更多内容
       pageNum: 0,
       isCount:0,
       showMore:false,
       isMore:false,
      
       walletlists:[],
       noData:false,
       noFetch:false


    }
  },
  props:{
     /*
     *每10毫秒自增幅度
     */
    step:{
      type:Number,
      default:5
    },
    /*
    *初始值
    */
   initVal:{
     type:Number,
     default:0,
   },
   /*
   *到一定进度停止
   ***/
    stopVal:{
      type:Number,
      default:80,
    },
    /*
    *进度条继续到成功
    */
    isOk:{
       type:Boolean,
       default:false, 
    },
  },
  computed: {
   
   isloading(){
      return this.$store.state.isloading;
    },
   
  },
  mounted(){
   
    if(navigator.onLine){   //有网络状态
      this.$store.commit("increatement");
      Indicator.open("加载中...");
      this.fetchWalletPage();
    }else{   //无网络状态
       this.noFetch=true;
       this.showMore=true;
        Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
    }
  },
  watch:{
    //监听组件props的变化决定是否继续加载 
    isOk(){
      let val=this.loadingVal;
      let step=this.step;
      let timer=setInterval(()=>{
          val=val+step
          this.$el.style.width=val+"%"
          //加载到百分百完成
          if(val>=100){
              //关闭定时器
              clearInterval(timer);
               that.$store.commit("decrement");

          }
      },10);
    }
  },
  methods:{
     fetchWalletPage(){

      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      var that=this;
      axios({
              method: 'POST',
              url:domain+'/mobile/index.php?act=member_index&op=waller_detail&key='+that.$route.params.key,
             data:{
              curpage:++that.towPagenum
            },
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
         that.$store.commit("decrement");
         Indicator.close();     
         var results=response.data.datas;   
         if(response!=undefined ){
           if(response.data.code==200){
               if(that.isCount==0){
                 if(results.length!=0 && results.length<=15){
                 that.walletlists=results;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.walletlists=that.walletlists.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }else{ //加载第N页面
                   if(results.length==0){
                  that.haveMore = false;
                  that.isMore=true;
                  that.showMore=true;
                  that.pageNum--
                }else{
                   that.walletlists=that.walletlists.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
              }
              }else if(response.data.code==400){
                that.noData=true;
                that.isMore=false;
                Toast(response.data.datas.error);
              }
         }else{
           that.noFetch=true;
            that.isMore=false;
            that.$store.commit("decrement");
             Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
         }    

      },(err)=>{
               Indicator.close();
              that.$store.commit("decrement");
              Toast("发生网络错误，请稍后重试！");
       });
     }, 
     handleTopChange(status) {
        this.moveTranslate = 1;
        this.topStatus = status;
    },
    translateChange(translate) {
        const translateNum = +translate;
        this.translate = translateNum.toFixed(2);
        this.moveTranslate = (1 + translateNum / 70).toFixed(2);
      },
    loadTop() {
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded();
          location.reload();
        }, 1500);
      },
      loadMore(){
        var that=this;
         if(that.haveMore){
              that.loading=true;
              that.showMore=false;
              that.isCount=1;
              that.fetchWalletPage();
           }
      },
      loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
           this.$store.commit("increatement");
           this.fetchWalletPage();
         }else{   //无网络状态
            this.noFetch=true;
            this.showMore=true;
               Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
          }
      },
      goBakc(){
        app.back();
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

.walletlist li{
    display: flex;
    display: -moz-flex;    /*Firefox*/
    display: -webkit-flex; /*Safari,Opera,Chrome*/
    display: -o-flex;
    display: -ms-flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    height: 78px;
    border-bottom: 1px solid #d8d8d8;
    font-size: 16px;
    color:#666;
    font-weight:bold;
    position: relative;
    background-color: #ffffff;
}

.leftCell{
    display: flex;
    display: -moz-flex;    /*Firefox*/
    display: -webkit-flex; /*Safari,Opera,Chrome*/
    display: -o-flex;
    display: -ms-flex;
    flex-direction: column;
    text-align: left;
    line-height: 28px;
}

.createTime{
    color: #999999;
    font-size: 1.4rem;
}
.rightCell{
    position: absolute;
    right: 20px;
    top:20px;
    
}
.redWallet{
  color:#f01;
}


.itemsUl{
     display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 100px;
}
.itemsUl img{
    display: -webkit-box;
    width: 100px;
    height: 72px;
}


/*
*暂无数据
*/
.noNull{
  display: block;
  width:100%;
  background-color:#fff;
}
.noNull img{
    width: 15rem;
    height: 15rem;

}
.noNull p{
  font-size: 16px;
  padding-top: 10px;
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

/*
*进度条加载
*/
.loadings{
   
}
.progress-bar{
    

}

</style>
