<template>
  <div class="merchantClassPage">

       
          <mt-header :title="className">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="toback"></mt-button>
        </router-link>
        <mt-button  slot="right" >
           <mt-button  @click="openMap">街景</mt-button>
        </mt-button>
        </mt-header>

         <!--
           进度条
         -->       
          
         <!--定位与搜索导航栏-->
         <div v-if="!noFetch" v-show="!isloading" style="width:100%;">
            <div class="mapSearch">
	          <div class="areaCell" @click="openArea" >
	          <span>{{cityNames==null?'筛选地区':cityNames.length>6?cityNames.slice(0,5)+"...":cityNames}}<img src="../../assets/lowArrow.png" class="low"/></span>
	          </div>
           <div class="icons" @click="openSearch"> <img src="../../assets/searchIcon.png" class="searchIcon" /></div>
         </div>
         <!--一级分类广告-->
         <div class="LevelTitle">
             <div class="classification" @click="toLevelClass">
            <img src="../../assets/clssMerchant.png"/>   
            <p>分类</p>
          </div>
         <ul class="classLevel">
            <li class="clasLevelLi" v-for="(list,i) in levelList" :key="i" @click="toSonClass(list.gc_id)">
            <img :src="list.gc_pic"/>   
            <p>{{list.gc_name.length>6?list.gc_name.slice(0,5)+'...':list.gc_name}}</p>
          </li>
          
         </ul>

         </div>
         
        
           <!--城市筛选-->
           <div v-if="!noData">
            <ul class="merchantList" 
             infinite-scroll-disabled="loading"
              infinite-scroll-distance="0"
               v-infinite-scroll="loadMore"
              infinite-scroll-immediate-check="false"
               >
            
             
             <li
               v-for="(item,i) of seletedList" :key="i"  @click="toMerchantDetail(item.store_id)"> 
               <p class="avatarList"><img v-lazy="item.store_avatar==null?require('../../assets/noImg.png'):item.store_avatar" class="infoImage"  />
              <div class="SearchInfo">
                <p class="merchantNames">{{item.seller_name==null?'未填写':item.seller_name}}</p> 
                <p class="infos">活跃度：{{item.activity_num==null?0:item.activity_num}}</p>
                <p class="contents">商户介绍：{{item.store_content}}</p>
              </div>
              <div style="clear:both"></div>
            </li>
          </ul>
          
               <!--底部判断是加载图标还是提示“全部加载”-->
                 <div class="noMore"  v-if="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
               </div>
           </div>    
           <div class="noNull" v-if="noData"  >
            <img src="../../assets/noMessage.png"/>
            <p>暂无数据</p>   
            </div>   

       
       
     <div class="footerback" @click="gotoFind(className)">
      <img src="../../assets/goto.png"/>
      <span>进入发现</span>
     </div>    

      </div>
           
    

  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
axios.defaults.timeout = 3000
import { Toast,Indicator } from 'mint-ui';
export default {
 inject:['reload'], //依赖注入
  
  name: 'merchantClassPage',
  data () {
    return {
        isSelected:false,
        className:'',
        levelList:[],
        loading:false,
         //初始化无限加载相关参数
         haveTwoMore:false,
          haveMore:false, //是否还有更多内容
          pageNum: 0,
          isCount:0,
          showMore:false,
          isMore:false,
        noData:false,   //加载完毕，在没有数据的时候显示,
        noLoadingData:false,
        noFetch:false, //网络状态
        cityNames:this.$route.params.getCity, //城市地址
        resultList:[],     //返回分类的信息结果
        seletedList:[],   //城市筛选
        keys:this.$route.query.keys,//获取用户的token，传参
        dingweiCity:this.$route.query.dingweiCity
        

    }
  },
  computed: {
    isloading(){
      return this.$store.state.isloading;
    },
   
  },
  
  watch:{
    
  },
  
  mounted(){
     if(navigator.onLine){   //有网络状态
       this.$store.commit("increatement");
     this.selectedCity();
     localStorage.setItem('dingwei',this.dingweiCity);
      
    }else{   //无网络状态
       this.noFetch=true;
       this.showMore=true;
        Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
    }
  },
  methods:{
    
    selectedCity(){
       this.className="";
       this.cityNames=this.$route.params.getCity;
       this.isSelected=true;
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        this.$store.commit("increatement");
        
        if(this.cityNames=="undefined"|| this.cityNames=="全国"){  //没有筛选，默认设置为全国的条件
        var that=this;
        axios({
            url: domain+'/mobile/index.php?act=index&op=towGoodsClassList&gc_id='+that.$route.params.gc_id+"&address_name=全国",
            data:{
              curpage:++that.pageNum
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
            },
            timeout:5000,
          
       }).then(function(response){  
           that.$store.commit("decrement");
           Indicator.close();
           if(response!=undefined){
              if(response.data.code==200){
            var results=response.data.datas;
             that.className=results.gc_parent_name;
             that.levelList=results.goodsClassList;
             if(that.isCount==0){
              
                 if(results.store_list.length!=0 && results.store_list.length<15){
                 that.seletedList=results.store_list;
                 that.haveMore = false;   
                }else if(results.store_list.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.seletedList=that.seletedList.concat(results.store_list);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }else{ //加载第N页面
                   if(results.store_list.length==0){
                  that.haveMore = false;
                  that.isMore=true;
                  that.showMore=true;
                  that.pageNum--
                }else{
                   that.seletedList=that.seletedList.concat(results.store_list);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }
             
             }else if(response.data.code==400){
                  that.noData=true;
                  that.isMore=false;
              }else{
                that.isMore=false;
                 Toast(response.data.datas.error);
                  that.noData=true;
              } 
           }else{
              Indicator.close();
              that.isMore=false;
              that.$store.commit("decrement");
                Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
           }
           
       });
    }else {
       var that=this;
      axios({
            method: 'Post',
            url:  domain+'/mobile/index.php?act=index&op=towGoodsClassList&gc_id='+that.$route.params.gc_id+"&address_name="+that.cityNames,
            data:{
              curpage:++that.pageNum
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
              }, 
               timeout:5000,
     }).then(function(response){  
           that.$store.commit("decrement");
           Indicator.close();
           if(response!=undefined){
              if(response.data.code==200){
            var results=response.data.datas;
             that.className=results.gc_parent_name;
             that.levelList=results.goodsClassList;
             if(that.isCount==0){
                 if(results.store_list.length!=0 && results.store_list.length<15){
                 that.seletedList=results.store_list;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.store_list.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.seletedList=that.seletedList.concat(results.store_list);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }else{ //加载第N页面
                   if(results.store_list.length==0){
                  that.haveMore = false;
                  that.isMore=true;
                  that.showMore=true;
                  that.pageNum--
                }else{
                   that.seletedList=that.seletedList.concat(results.store_list);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }
             
             }else if(response.data.code==400){
                  that.noData=true;
                  that.isMore=false;
              }else{
                 Toast("发生网络错误，请稍后重试！");
                  that.noData=true;
                   that.isMore=false;
              } 
           }else{
              that.$store.commit("decrement");
              that.isMore=false;
                Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
               Indicator.close();

           }
       },(err)=>{
            Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
          
       });   
    }
    },
    
    toback(){
       app.gohome();
    },
    loadMore(){
      if(this.haveMore){
        this.loading=true;
        this.showMore=false;
        this.isCount=1;
        that.pageNum--
        this.selectedCity();
      }
    },
    openSearch(){  //打开搜索栏目
      if(this.$route.query.isSelected==1){
        this.$router.push({name:'searchMerchantPage',query:{keys:this.$route.query.keys,gc_id:this.$route.params.gc_id,
        dingweiCity:this.dingweiCity,
        getCity:this.$route.params.getCity,isSelected:1}})
      }else{
        this.$router.push({name:'searchMerchantPage',query:{keys:this.$route.query.keys,gc_id:this.$route.params.gc_id,
        dingweiCity:this.dingweiCity,
        getCity:this.$route.params.getCity}})
      }
    },
    toMerchantDetail(ids){ //跳转商户详情
      //  var domains = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
      // location.href=domains+"#/merchantDetailPage/"+ids+"?keys="+this.$route.query.keys+"&isDetail=1&dingweiCity="+this.dingweiCity;
       this.$router.push({name:'merchantDetailPage',params:{storeId:ids},query:{keys:this.$route.query.keys,isDetail:1,
        dingweiCity:this.dingweiCity}})
    },
   
    gotoFind(gcName){   //进入发现
      app.showFind(gcName);
    },
    openArea(){  //打开城市筛选
       var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
       this.$router.push({name:'City',query:{keys:this.$route.query.keys,gc_id:this.$route.params.gc_id,dingweiCity:this.dingweiCity,isCity:1}}); 
    },
    openMap(){  //打开街景页面
    if(this.cityNames==''&& this.$route.params.gc_id==''){
     return false;
    }else{
      this.$router.push({name:'streetscapePage',query:{citys:this.cityNames,keys:this.$route.query.keys,dingweiCity:this.dingweiCity},params:{gc_id:this.$route.params.gc_id}}); 
      
    }
      
    },
    toLevelClass(){  //打开分类筛选
     if(this.$route.query.isSelected==1){
        this.$router.push({name:'merchantLevelPage',query:{keys:this.$route.query.keys,gc_id:this.$route.params.gc_id,getCity:this.cityNames,
        dingweiCity:this.dingweiCity,
       isSelected:1
      }});  
     }else{
        this.$router.push({name:'merchantLevelPage',query:{keys:this.$route.query.keys,gc_id:this.$route.params.gc_id,getCity:this.cityNames,
        dingweiCity:this.dingweiCity,
      
      }});  
     }
    },
    call(e,storePhone){   //打电话
   	  e.preventDefault(); //阻止事件冒泡
   	  e.stopPropagation(); //阻止事件跳转
   	  if(storePhone!=""){
   	  	app.call(storePhone);
   	  }else{
   	  	return  false;
   	  }
   },
    loadFetch(){  //重新请求加载
      this.noFetch=false;
         if(navigator.onLine){   //有网络状态
          this.selectedCity();
         }else{   //无网络状态
            this.noFetch=true;
            this.showMore=true;
               Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
          }
    },
    toSonClass(gId){   //点击获取下一级分类
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       var that=this;
      axios({
         method: 'Post',
                    url: domain+'/mobile/index.php?act=index&op=towGoodsClassList&gc_id='+gId+"&address_name="+that.$route.params.getCity,
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
            var results=response.data.datas;
            if(response.data.code==200){
                 if(results.goodsClassList.length==0){
                   Toast("当前没有下级分类");
                   return false;
                 }else{
                    // window.location.href="#/merchantClassPage/"+gId+'/'+that.$route.params.getCity+'?keys='+that.$route.query.keys
                    // +"&isSelected=1";
                    that.$router.push({name:'merchantClassPage',params:{gc_id:gId,getCity:that.$route.params.getCity},query:{
                      keys:that.$route.query.keys, dingweiCity:that.dingweiCity,isSelected:1,
                    }});
                    that.className=results.gc_parent_name;
                    that.levelList=results.goodsClassList;
                    that.levelList=results.goodsClassList;
                    that.selectedCity();
                     that.$forceUpdate();
                    
                   
                 }
                                            
            }         

       },(err)=>{
          that.$store.commit("decrement");
          Toast("请求失败，请稍后重试");
       });
    }

  }

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
}
.merchantClassPage{
   height: auto; 
}
/*
*二级广告分类模块
*/
.screenMap{
    width: 28px;
    height: 28px;
}
/**
*定位和搜索框
 */

.mapSearch{
     height: 56px;
    margin-bottom: 0.5rem;
    background-color: #ffffff;
    position: relative;
    text-align: left;
    padding-top: 5.6rem;
    display: flex;
    align-items:center;
    border-bottom:5px solid #f2f2f2;

}
.areaCell{
    display: inline-block;
    height: 48px;
    border: 0px none;
    font-size: 16px;
    margin-left: 10px
}

.areaCell span{
    line-height: 48px;
    height:48px; 
}
.areaCell img{
   width: 18px;
    margin-left: 5px;
    height: 12px;
    background-size: contain;
    vertical-align: middle;
}

.searchInfo{
    margin: auto 9px;
    -ms-flex: 1;
    -ms-flex-align: center;
    align-items: center;
    flex: 1;
    -ms-flex-pack: start;
    justify-content: flex-start;
    text-align: left;
    border-radius: 5px;
    display: -ms-flexbox;
    display: flex;
    color: #666;
    font-size: 1.4rem;
    background-color: #fff;

}
.searchInfo img{
    width: 22px;
    height: 22px;
    position: absolute;
    right: 15px;
    top:0px;
}
.icons{
    width: 60%;
    height: 32px;
    border: 1px solid #d9d9d9;
    margin-right: 5px;
    margin-left: 5px;
    float: right;
    position: relative;
    display: inline-block;
    flex:1;
    border-radius:2px;
}
.searchIcon{
    width: 22px;
    height: 22px;
    position: absolute;
    top: 5px;
    right: 10px
  
}
.contents{
	  color: #666666;
    height: 5.5rem;
    font-size: 1.2rem;
    line-height: 1.8rem;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}


/** 
*广告分类标题
*/
.LevelTitle{
    width: 100%;
    height: auto;
    background-color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -ms-flex-align: center;
    margin-bottom: 1rem;
    padding-bottom:1.8rem;
    font-size: 14px;
    border-bottom:5px solid #f2f2f2;
}
/*分类*/
.classification{
        color: #666666;
    display: -webkit-box;
    display: -ms-flexbox;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    text-align: center;
    -ms-flex-align: center;
    padding-left: 16px;
}
.classification p{
 font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #999;
	letter-spacing: 4px;
}
.classification img{
    width: 45px;
    height: 45px;
    background-size: contain;
    padding: 10px 10px;
}
.classLevel{
    overflow: scroll;
    overflow-x:auto;
    overflow-y: hidden;
    -ms-flex-wrap: wrap;
    -webkit-box-pack: justify;
    -ms-flex-pack: distribute;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex:1;
    margin-left: 1.2rem;
}
.classLevel::-webkit-scrollbar {display:none}
.clasLevelLi{
     display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

}
.clasLevelLi img{
    width: 45px;
    height: 45px;
    background-size: contain;
    padding: 10px 18px;
}
.clasLevelLi p{
    font-size: 14px;
    font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #999;
}

/*
*一级分类的列表
*/
.merchantList{
    display: block;
    width:100%;
    height: auto;
    margin-bottom: 50px;
    background-color: #fff;
}
.merchantList li{
     display: flex;
    background-color: #fff;
    text-align: left;
    height: auto;
    border-bottom: 1px solid #d9d9d9;
}
.merchantList li:last-of-type{
  border-bottom: 0 none;
}
.avatarList{
    width: 8rem;
    height: 8rem;
    min-width: 8rem;
    min-height: 8rem;
    vertical-align: middle;
    overflow: hidden;
    margin: 10px;
    display: inline-block;
    vertical-align: middle;
}
.infoImage{
    display: inline-block;
    min-height: 8rem;
    width: 100%;
}
.InfoList{
    padding-top: 10px;
    line-height: 22px;
    font-size: 14px;
}



.merchantNames{
  margin-right:5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;


}
.city{
 color:#666666;
}
.infos{
  color:#666666;
  font-size: 1.4rem;
}

/*
*进入发现
*/
.footerback{
  width:100%;
  height:64px;
  background-color:#ffffff;
  position:fixed;
  bottom:0px;
  font-size:14px;
  display: -webkit-box; 
    display: -moz-box; 
    display:-webkit-flex;
    display: -ms-flexbox;
        display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;;
  justify-content:center;
  align-items:center;
  color:#ff8800;
}
.footerback img{
  width:24px;
  height:24px;
}
.footerback span{
  margin-left:10px;
}

/*
*加载全部
*/
.more_loading{
     height: 64px;
    line-height: 64px;
    border-bottom: 0px;
     align-items: center;
     display: flex !important;
     background-color: #fff;
}
.more_loading span{
  margin:0 auto;
  font-size: 1.4rem;
}
.clearBoth{
   clear: both;
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
.searchList li{
    display: block;
    background-color: #fff;
    width:100%;
    text-align: left;
    border-bottom: 1px solid #d9d9d9;
    height: auto;
}

.SearchInfo{
	  padding-top: 10px;
    padding-bottom: 10px;
    margin-right: 5px;
    line-height: 22px;
    font-size: 1.4rem;
    display: inline-block;
    min-width: 55%;
}
.searchInfo{
    margin: auto 9px;
    -ms-flex: 1;
    -ms-flex-align: center;
    align-items: center;
    flex: 1;
    -ms-flex-pack: start;
    justify-content: flex-start;
    text-align: left;
    border-radius: 5px;
    display: -ms-flexbox;
    display: flex;
    color: #666;
    font-size: 14px;
    background-color: #fff;
}
.searchInfo img{
    width: 22px;
    height: 22px;
    position: absolute;
    right: 15px;
}


/*
*暂无数据
*/
.noNull{
  text-align: center;
  display: block;  
  width:100%;
  height:auto;
  margin-bottom:70px;
  background-color:#ffffff;
}
.noNull img{
    width: 15rem;
    height: 15rem;
}
.noNull p{
  padding-left: 10px;
  font-size: 14px;
  color: #999999;
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

@media screen and (max-width:330px) {
    .merchantNames {
        width:55%;
    }
    .contents{

    }
}
@media only screen and (min-width: 330px) and (max-width:420px) {
    .merchantNames {
        width:65%;
    }
    .contents{

    }
}

</style>

