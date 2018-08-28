<template>
  <div class="streetscapePage">
       
       <header  class="mint-header">
         <div class="mint-header-button is-left">
           <a  href="javascript:;" class="router-link-active">
           <button  @click="toBack" class="mint-button mint-button--default mint-button--normal">
             <span class="mint-button-icon"><i class="mintui mintui-back"></i></span>
              <label class="mint-button-text"></label></button></a></div> 
              <h1 class="mint-header-title">街景</h1> <div class="mint-header-button is-right">
              
         </button>
        </div>
       </header>

       <!--手势图片放大列表-->
         <div class="showImgs" v-if="showImg">
          <swiper :options="swiperOption" ref="imgOverview" style="height: 100%;" >
        <swiper-slide v-for="(img, index) of previewImg" :key="index">
          <p class="swiper-zoom-container" @click="showImg=false">
            <img :src="img" alt="" @click="showImg=false">
          </p>
        </swiper-slide>
      </swiper>
       </div> 
       <!--有网络状态-->
       <div v-if="!noFetch" v-show="!isloading">
       	
        <!--筛选地区-->
        <ul class="areaTitle">
          <li @click="openCity" :data-id="isSeleted==undefined?0:1" class="seletedClass"><img src="../../assets/seleted.png" class="low"/><span>筛选地区</span></li> 
          <li >{{cityNames!=null?cityNames:'全国'}}</li>
        </ul>
    
        <!--街景列表展示内容-->
        <div  v-if="isSeleted==1?false:true">
         <ul class="listContainer"
         infinite-scroll-disabled="loading"
              infinite-scroll-distance="0"
               v-infinite-scroll="loadMore"
              infinite-scroll-immediate-check="false"
             >
             
              <!--街景名称--> 
              <li v-for="(list,i) in streetList" :key="i+'aaa'" :data-id="list.id" class="streetLi">
                <p class="mapMerchant"><img class=""   :src="list.bgpic"  @click="clickImg($event,list.bgpic)"/></p>
                <p class="userCity"><span class="userNames">{{list.name}}</span><span class="citys"><img src="../../assets/location.png" class="locations"/>{{list.address==''?'未知位置':list.address}} {{list.city}}</span></p>
                <p class="streetTitle" id="streetTitle" v-html="list.decoration.replace(/<\/?.+?>/g,'').length>200?list.decoration.slice(0,200)+'...':list.decoration"></p>
                <p  @click="toggle($event,list.decoration)"  v-if="list.decoration.replace(/<\/?.+?>/g,'').length>200" class="showViews">全文</p>    
              </li>
             </ul>  
               <!--底部判断是加载图标还是提示“全部加载”-->
                 <div class="noMore"  v-show="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
               </div>

        </div>
        <!--筛选城市的结果-->
        <div v-if="isSeleted==1?true:false" >
         <ul class="listContainer" 
         infinite-scroll-disabled="loading"
              infinite-scroll-distance="0"
              infinite-scroll-immediate-check="false">
             
              <!--街景名称--> 
              <li v-for="(list,i) in resultList" :key="i+'aaa'" class="streetLi">
                <p class="mapMerchant"><img class=""   v-lazy="list.bgpic"  @click="clickImg($event,list.bgpic)"/></p>
                <p class="userCity"><span class="userNames">{{list.name}}</span><span class="citys"><img src="../../assets/location.png" class="locations"/>{{list.address==''?'未知位置':list.address}} {{list.city}}</span></p>
                <p class="streetTitle" id="streetTitle" v-html="list.decoration.replace(/<\/?.+?>/g,'').length>200?list.decoration.slice(0,200)+'...':list.decoration"></p>
                <p  @click="toggle($event,list.decoration)"  v-if="list.decoration.replace(/<\/?.+?>/g,'').length>200" class="showViews">全文</p>    
              
              </li>
        </ul>
         <!--底部判断是加载图标还是提示“全部加载”-->
                 <div class="noMore"  v-if="TwoisMore">
                <div class="textloading" v-if="!TwoshowMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
               </div>
          </div>     
        
             
        
     <div class="noNull" v-if="noData"  >
      <img src="../../assets/noMessage.png"/>
      <p>暂无数据</p>   
      </div>   

       	
       </div>
   
  

  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast,Indicator } from 'mint-ui';
//引入手势缩放和左右滑动
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  name: 'streetscapePage',
  components: {
      swiper,
      swiperSlide,

  },
  data () {
    return {
      isTwoCount:0,
         TwoisMore:false,
         TwoshowMore:false,
         loading:false,
         //初始化无限加载相关参数
         haveTwoMore:false,
          haveMore:false, //是否还有更多内容
          pageNum: 0,
          towPagenum:0,
          isCount:0,
          pageNum:0,
          showMore:false,
          isMore:false,
        noData:false,   //没有数据加载
        cityNames:null, //城市地址
        streetList:[],   //街景列表
        resultList:[], //筛选后的街景列表
        isSeleted:this.$route.query.isCity, //标记，是否被点击
        isCache:null,                      //缓存传递的城市参数
        decorationTitles:'',  //超出的标题
        showTitle:'全文',
        noFetch:false,
        showView:false, //超出指定字体
        previewImg:[], //定义获取的数据图片
        showImg:false,
        swiperOption:{  //手势信息
        width:window.innerWidth,
        zoom:true,
        initialSlide:0,
        autoplay: 3000,
        centeredSlides: true,
        effect:"coverflow",
          grabCursor : true,
          setWrapperSize :true,
          // autoHeight: true,
          // paginationType:"bullets",
          pagination : '.swiper-pagination',
          paginationClickable :true,
          prevButton:'.swiper-button-prev',
          nextButton:'.swiper-button-next',
          // scrollbar:'.swiper-scrollbar',
          mousewheelControl : true,
          observeParents:true,
      }
    }
  },
  computed: {
    isloading(){
      return this.$store.state.isloading;
    },
    showChose(){   //城市选择
       return this.$store.state.showChose;
    }
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      this.cityNames=this.$route.query.getCity;
      this.isCache=this.$route.query.citys;
      Indicator.open("加载中...")
	    this.$store.commit("increatement");
	    if(this.isSeleted==1){
	        this.fetchCity();
	    }else{
	      this.fetchStreet();
	    }
    }
    else{   //无网络状态
    	this.noFetch=true;
    	 Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500});
    }
  },
  methods:{
      fetchStreet(){   //城市列表
          var that=this;
          var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        axios({
            method:'post',
            url: domain+'/mobile/index.php?act=index&op=streest',
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
            for(var j=0;j<results.length;j++){
            	results[j].decoration=results[j].decoration.replace(/&lt;/g, "<").replace(/&gt;/g, ">").
              replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
            }
             if(that.isCount==0){
                 if(results.length!=0 && results.length<15){
                 that.streetList=results;
                 that.isMore=true;
                that.showMore=true; //没有更多
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.streetList=that.streetList.concat(results);
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
                   that.streetList=that.streetList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }
           
            
          }else{
            that.noData=true;
            Toast(response.data.datas.error);
            that.isMore=false;
          }
          }else{
            that.noFetch=true;
            that.isMore=false;
          }
         
           
       },(err)=>{
         that.$store.commit("decrement");
         Toast("发生网络错误，请稍后重试！");
       });
    
      
      },
      fetchCity(){  //请求街景列表
       var that=this;
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       if(this.cityNames==undefined|| this.cityNames=="全国"){  //没有筛选，默认设置为全国的条件
       var that=this;
      axios({
            url: domain+'/mobile/index.php?act=index&op=search_streetsc_address',
            data:{
              curpage:++that.towPagenum
            },
            method:'POST',
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
       	    setTimeout(()=>{
           that.$store.commit("decrement");
         },500);
         Indicator.close();
         if(response!=undefined){
            if(response.data.code==200){
            var results=response.data.datas;
            for(var j=0;j<results.length;j++){
            	results[j].decoration=results[j].decoration.replace(/&lt;/g, "<").replace(/&gt;/g, ">").
              replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
            }
             if(that.isTwoCount==0){
                 if(results.length!=0 && results.length<10){
                 that.resultList=results;
                 that.TwoisMore=true;
                that.TwoshowMore=true; //没有更多
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.TwoisMore=false;
                  that.noData=true;
                }else{
                   that.resultList=that.resultList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.TwoisMore=true;
                   that.TwoshowMore=false;
                } 
               }else{ //加载第N页面
                   if(results.length==0){
                  that.haveMore = false;
                  that.TwoisMore=true;
                  that.TwoshowMore=true;
                  that.towPagenum--
                }else{
                   that.resultList=that.resultList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.TwoisMore=true;
                   that.TwoshowMore=false;
                } 
               }
           
            
          }else{
            that.noData=true;
          }
          }else{
            that.noFetch=true;
             Indicator.close();
             that.$store.commit("decrement");
               Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
          }
           
       },(err)=>{
         that.$store.commit("decrement");
         Toast("发生网络错误，请稍后重试！");
       });
    }else {
       var that=this;
      axios({
            method: 'Post',
            url:  domain+'/mobile/index.php?act=index&op=search_streetsc_address&address_name='+that.cityNames,
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
            for(var j=0;j<results.length;j++){
            	results[j].decoration=results[j].decoration.replace(/&lt;/g, "<").replace(/&gt;/g, ">").
              replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
            }
             if(that.isTwoCount==0){
                 if(results.length!=0 && results.length<10){
                 that.resultList=results;
                 that.TwoisMore=true;
                that.TwoshowMore=true; //没有更多
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.TwoisMore=false;
                  that.noData=true;
                }else{
                   that.resultList=that.resultList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.TwoisMore=true;
                   that.TwoshowMore=false;
                } 
               }else{ //加载第N页面
                   if(results.length==0){
                  that.haveMore = false;
                  that.TwoisMore=true;
                  that.TwoshowMore=true;
                  that.towPagenum--
                }else{
                   that.resultList=that.resultList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.TwoisMore=true;
                   that.TwoshowMore=false;
                } 
               }
           
            
          }else{
            that.noData=true;
          }
          }else{
            that.noFetch=true;
            Indicator.close();
             that.$store.commit("decrement");
               Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
          }
           
       },(err)=>{
         that.$store.commit("decrement");
         Toast("发生网络错误，请稍后重试！");
       });   
    }
    },
    toggle(e,decoration){  //切换上下文
    	var listId=$(e.target.parentNode).attr("data-id");
 
    		if(e.target.innerText=="全文"){
             $(e.target.previousElementSibling).html(decoration);
             e.target.innerText="收起"
    		  }else if(e.target.innerText=="收起"){
            e.target.innerText="全文";
            decoration=decoration.slice(0,200)+"...";
             $(e.target.previousElementSibling).html(decoration);
    		   }
    
    },
      openCity(){   //打开城市
           if(this.$route.query.falg==1){
          	this.$router.push({name:'StreetCity',query:{falg:1,gc_id:this.$route.params.gc_id,isCity:1,keys:this.$route.query.keys,citys:this.$route.params.getCity,dingweiCity:this.$route.query.dingweiCity}});
          }else{
          	 this.$router.push({name:'StreetCity',query:{gc_id:this.$route.params.gc_id,isCity:1,keys:this.$route.query.keys,citys:this.$route.params.getCity,dingweiCity:this.$route.query.dingweiCity}});         
          }
      },
      toBack(){
         if(this.$route.query.falg==1){
           this.$router.push({name:'merchantClassPage',params:{gc_id:this.$route.params.gc_id,getCity:this.$route.params.getCity},query:{falg:1,keys:window.localStorage.getItem('tokens'),keys:this.$route.query.keys,dingweiCity:this.$route.query.dingweiCity}});
         }else{
           this.$router.push({name:'merchantClassPage',prams:{gc_id:this.$route.params.gc_id,getCity:this.$route.params.getCity},query:{keys:window.localStorage.getItem('tokens'),keys:this.$route.query.keys,dingweiCity:this.$route.query.dingweiCity}});     
         }

     },
     clickImg(e,imgList) {
                this.showImg = true;
                // 获取当前图片地址
                this.previewImg=imgList.split(';');
                for(var i = 0;i< this.previewImg.length;i++){
                    if( this.previewImg[i]==''|| this.previewImg[i]==null||typeof( this.previewImg[i])==undefined){
                        this.previewImg.splice(i,1);
                        i=i-1;
                    }
                }
    }, 
     loadMore(){       //加载更多
       
      if(this.isSeleted==1){
        if(this.haveMore){
        this.loading=true;
        this.showMore=false;
        this.isCount=1;
         this.fetchCity();
      }
       
      }else{
        if(this.haveMore){
        this.loading=true;
        this.TwoshowMore=false;
        this.isTwoCount=1;
         this.fetchStreet();
      }
        
      }
      
     },
     loadFetch(){
        this.noFetch=false;
         if(navigator.onLine){   //有网络状态
             this.$store.commit("increatement");
             if(this.isSeleted==1){
                this.fetchCity();
              }else{
                this.fetchStreet();
              }
         }else{   //无网络状态
            this.noFetch=true;
            this.showMore=true;
            this.$store.commit("decrement");
             Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
        
        }
    },

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

/*
*街景
*/
.streetscapePage{
  
}
.header-title{
  font-size:16px;
}
/*
*筛选条���
*/
.areaTitle{
      display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
  width:webkit-fill-available;
  align-items:center;
  justify-content:center;
  height:48px;
  background-color:#fff;
  border-bottom:1px solid #D9D9D9;
  padding-top: 64px;

}

.areaTitle li{
  flex:1;
  height: 48px;
  line-height: 48px;
  color:#666666;
  font-size:14px;
}
.areaTitle li:first-of-type{
  border-right:1px solid #D9D9D9;
}
.areaTitle .low{
  width: 18px;
  height: 12px;
  margin-right: 10px;
  background-size:contain;
}

/*
*列表展示
*/
.listContainer{
  background-color:#ffffff;
}
.listContainer li{
    border-bottom: 1px solid #d9d9d9;
    height: auto;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    text-align: left;
    font-size: 15px;
    flex-direction: column;
    line-height: 28px;
    color:#333333;
    width:98%;
    margin:15px auto;
}
.listContainer li:last-of-type{
  border-bottom:0 none;
}
.mapMerchant{
  
    height: 18rem;
    background-size: contain;
    width: 100%;  
    overflow: hidden;
}
@media only screen and (max-width: 520px) {
	 .mapMerchant{
	 	height:18rem;
	 }
	 
}
@media only screen (min-width:521px) and (max-width: 920px) {
	
	  .mapMerchant{
	 	height:18rem;
	 }
}
@media only screen (min-width:921px) and (max-width: 1921px) {
	 
	.mapMerchant{
	 	height:24rem;
	 }
}
.mapMerchant img{
  width:100%;
  min-height: 18rem;
}
.locations{
  width:12px;
  height:12px;
  background-size:contain;

}
.userCity{
    line-height: 35px;
    font-family: PingFangSC-Medium;
    font-size: 15px;
    color: #333333;
    letter-spacing: 0;
    display: flex;
    justify-content: space-between;
    width: 95%;
    margin: 10px auto; 
}
.userNames{
  font-size:15px;
  font-weight: 900;
  color: #333;
}
.citys{
  margin-left:15px;
  font-size: 12px;
  color:#888888;
}
.streetTitle{
  font-family: PingFangSC-Regular;
	font-size: 15px;
	color: #333333;
	line-height: 23px;
	width:95%;
	margin:0 auto;
}

.showViews {
	 padding-top:5px;
	 margin-left: 10px;
	 display: block;
}
.hideViews{
	padding-top:5px;
	margin-left: 10px;
	display: none;
}


/*
*滚动加载更多
*/
.page-loadmore-wrapper {
}
.mint-loadmore-bottom{
 
}
.mint-loadmore-bottom span {
    display: inline-block;
    margin-bottom:15px;   
    margin-bottom:25px;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle
}
.mint-loadmore-bottom span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
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
  text-align: center;
  display: block;  
  width:100%;
  background-color:#ffffff;
}
.noNull img{
    width: 15rem;
  height: 15rem;
    margin-top:100px;
}
.noNull p{
  padding-top: 30px;
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


/*
*加载全部
*/
.more_loading{
     height: 64px;
    line-height: 64px;
    border-bottom: 0px;
    align-items: center;
    margin-top: 30px;
    background-color: rgba(247, 247, 247, 0.6) !important;
}
.more_loading span{
  margin:0 auto;
    font-size: 1.4rem;
}

.textloading{
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    height: 36px;
    font-size: 1.5rem;
    padding-top:30px;
}
.textloading img{
  width:2.4rem;
  height:2.4rem;
}

</style>

