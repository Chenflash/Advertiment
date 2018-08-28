<template>
  <div class="merchantDetailPage">
      
       <header class="mint-header">
         <div class="mint-header-button is-left">
           <a href="javascript:;" class="router-link-active">
           <button @click="goBack" class="mint-button mint-button--default mint-button--normal">
             <span class="mint-button-icon"><i class="mintui mintui-back"></i></span>
              <label class="mint-button-text"></label></button></a></div> 
              <h1 class="mint-header-title">商户店铺</h1> <div class="mint-header-button is-right">
                <button @click="showShare()" class="mint-button -mob-share-ui-button -mob-share-open mint-button--default mint-button--normal">
                  <!----> <label class="mint-button-text">
               <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABzUlEQVRYR+2VjzEDURDGv68C0YEORAXogApEBaICVEAqQAdUICoQFYgK6GDN72Zvxhh37yQXxkzezM0kmZfb79/uWn98/Mf1tQawVqA3BSJiT9KlpKGkuaRT23elkPcCICK2JD1Jupd0IwkwZ5L2bU/bQPQF4FzSgW3YVyciKDy3PfotAHu2YV4DQAmtHEDKf52yj21PIgLW/HZYysHCFkTEQNKJpLGkV0kEjs8bKcKFbaxpPQsBiIiDTPwmRW1Xcqf32DCz/V4qXlnUdikiYABL2FLkNtNNkYmk866Fmuo0AsjiSMoDG8BsS3qUNLJNry992gBQAIaVvBm2F0k7tmdLV84XtAGANUyraZahe+syXH4Crg0AzJH8MF/IZKO9sGKyrPc1yDYABA/2u3mZVrtKAChxXBqzXZQotmF6P6h9TysAcpSdwdLp1HLfASoCaGKR2w+bGDx0CouIbchiAhCDqBjWhQF8GjxkgnxwntM2lhLW0TGt7bo0gOwQQBDQYW1HRMB+aht1Gk+fAL7bhmSHsb1yAIzmh3pGRAQW8J0cENjVAkgbKMTeIIC08H2JPf/rxYJPgYQ5D9uw2AG9A+gyeL7e6VWBNYB/qcAHaXysIfkd9uQAAAAASUVORK5CYII=" class="shares ">
           </label>
         </button>
        </div>
       </header>


        <!--手势图片放大列表-->
         <div class="showImgs" v-if="showImg">
         <swiper :options="swiperOption" ref="mySwiper" style="width:100%;height: 100%;" >
        <swiper-slide v-for="(img, index) of previewImg" :key="index">
          <p class="swiper-zoom-container" @click="showImg=false">
            <img :src="img" alt="" @click="showImg=false">
          </p>
        </swiper-slide>
      </swiper>
       </div> 
       
       <div v-if="!noFetch" v-show="!isloading">
           <div class="listDetailContent">
            <div class="listHeader">

            <span class="avatars"><img :src="store_avatar?store_avatar:require('../../assets/mine.png')"    :onerror="loadImg"/></span>
            <div class="leftHeader">
               <p class="merchantName">{{seller_name}}</p>
              <p class="merchantNums"><span>活跃度 {{activity_num==null?'0':activity_num}}</span><span>发布数 {{examine_num==null?'0':examine_num}}</span> </p> 
            </div>
            <div :class="storeExists==0?'righAttention':'isAttection'" @click="attections">
                {{storeExists==0?'关注':'取消关注'}}
            </div>
          </div>  

        
             <!--我的店铺-导航栏-->
          <mt-navbar v-model="selected" class="listNav">
          <mt-tab-item id="2" class="listItems" >
           <div @click="changeSelected(2)" class="lists">
             <span>商品展示</span>
             <img v-bind:src="selected==2?require('../../assets/list.png'):require('../../assets/listNo.png')" class="selectIcon"  v-if="listSelected" @click="changeList($event)"/>   
             <img v-bind:src="selected==2?require('../../assets/selectImg.png'):require('../../assets/imgNoSelece.png')" class="selectIcon" style="height:18px;width:18px" v-else  @click="changeList($event)"/>   
             
          </div>
          </mt-tab-item>
           <mt-tab-item id="1" >
          <div @click="changeSelected(1)" style="font-size:1.5rem">我的发布  </div></mt-tab-item>
        
          </mt-navbar>
        <!-- tab-container -->
        <mt-tab-container v-model="selected" class="listTab">
          <mt-tab-container-item id="2">

          <div class="" v-if="listSelected">
            <div v-if="!noData"> 
              <ul class="listCenter" 
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="0"
               v-infinite-scroll="loadMore"
              infinite-scroll-immediate-check="false" ref="loadmore" >
                  <li class="listShow" v-for="(list,i) of resultsList" :key="i" >
                     <div class="listImage"><img v-lazy="list.image==''?require('../../assets/noImg.png'):list.image"   @click="clickImg($event,list.image)"/></div>
                     <div class="titles"><p class="listTitle">{{list.content}}</p></div>
                    <div style="clear:both"></div>
                   
                  </li>
                 <div style="clear:both"></div>
                  
              </ul>
            <div style="clear:both"></div>
                   <!--底部判断是加载图标还是提示“全部加载”-->
                    <div class=""  v-if="isMore">
                    <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                    <div class="textloading" v-else><span>没有更多了</span></div>
             </div>
            </div> 
              <!--暂无数据-->
                <div class="noNull" v-if="noData" >
                  <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
                  <p>暂无数据</p>   
              </div> 
               
             

          </div>    

           <!--图片形式展示-->
           <div  v-if="!listSelected">
             <div v-if="!noData">
              <ul class="ullist"  
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="0"
               v-infinite-scroll="loadMore"
              infinite-scroll-immediate-check="false" >
                
                  <div class="listItem"  v-for="(list,i) of resultsList" :key="i" >
                 <p class="itemImg" id="ImgItem"> <img v-lazy="list.image==''?require('../../assets/noImg.png'):list.image"    class="goodImage" @click="clickImg($event,list.image)"/></p>
                 <div class="goodsTitle">{{list.content}}</div>
                </div>
              </ul>
              <div style="clear:both"></div>
                <!--底部判断是加载图标还是提示“全部加载”-->
                    <div class=""  v-if="isMore">
                    <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                    <div class="textloading" v-else><span>没有更多了</span></div>
                  </div>
             </div>    
              <!--暂无数据-->
          <div class="noNull" v-if="noData" >
			      <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
			      <p>暂无数据</p>   
			   </div> 
          
         
       
           </div>  
          </mt-tab-container-item>
          <mt-tab-container-item id="1">
            <div v-if="!noPublishData">
             <ul class="shopItem" 
              infinite-scroll-disabled="Twoloading"
              infinite-scroll-distance="0"
               v-infinite-scroll="loadMore"
              infinite-scroll-immediate-check="false"
             
              >
                    <li v-for="(list,i) of pubResultList" :key="i" >
                      <div class="listPub">
                          <span class="avatars"><img :src="store_avatar"  :onerror="loadImg"  /></span>
                          <p style=" display:inline-block;font-size:1.5rem;" class="selelerName">{{seller_name.length>11?seller_name.slice(0,11)+'...':seller_name}}</p>
                          <p class="merchantNames"><img src="../../assets/baran.png"/>
                          <span class="titName">{{list.gc_name.gc_name.length>8?list.gc_name.gc_name.slice(0,6)+"...":list.gc_name.gc_name}}</span>
                          </p>
                          
                        </div> 
                        <div class="listCont">
                           <div style="clear:both"></div>
                            <p class="bodyContent" id="bodyContent" v-html="list.goods_body.replace(/<\/?.+?>/g,'').length>200?list.goods_body.slice(0,200)+'...':list.goods_body"></p>
                             <p  @click="toggle($event,list.goods_body)"  v-if="list.goods_body.replace(/<\/?.+?>/g,'').length>200" class="showViews">全文</p> 
                           <div style="clear:both"></div>
                          <div class="listImg">
                             <span  class="imgs"  v-show="item!=''&&(list.goods_video==null ||list.goods_video=='')"  v-for="(item,i) of (list.goods_image==null?require('../../assets/noImg.png'):list.goods_image).split(';')"  @click="clickImg($event,list.goods_image)">
                            <img 	v-lazy="item"  />
                            </span>                           
                              <video  v-if="(list.goods_video!=null &&list.goods_video!='')" style="width:80%; object-fit: fill; object-position: center center;height: 20rem;"
                                      id="my-player"
                                      class="video-js vjs-default-skin"
                                      controls
                                      webkit-playsinline="true"
                                       preload="auto"
                                      x-webkit-airplay="true"
                                       x5-playsinline="true"
                                       playsinline="true"
                                      x5-video-player-type="h5" 
                                      x5-video-player-fullscreen="true" 
                                      x5-video-orientation="portraint"
                                      :poster="list.goods_image.split(';')[0]"  
                                      controlslist="nodownload"
                                      data-setup='{"example_option":true}'>
                                    <source :src="list.goods_video" type="video/mp4" ></source>
                                    <source :src="list.goods_video" type="video/webm" ></source>
                                    <source :src="list.goods_video" type="video/ogg" ></source>
                                    
                                  </video>
                          </div>
                         	<div class="locationNums">
	                            <span> {{list.goods_addtime}}</span>
	                            <span class="rightlook"><img src="../../assets/looks.png" />{{list.goods_click==null?'0':list.goods_click}}</span>
                              </div>	
                        </div>

                    </li>
                   
                  </ul>
                   <!--底部判断是加载图标还是提示“全部加载”-->
                      <div class=""  v-if="TwoisMore">
                      <div class="textloading" v-if="!TwoshowMore"><img src="../../assets/load.gif"/></div>
                      <div class="textloading" v-else>没有更多了</div>
                    </div>
            </div> 
                  <!--暂无数据-->
              <div class="noNull" v-if="noPublishData" >
                  <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
                  <p>暂无数据</p>   
              </div>
             
          </mt-tab-container-item>
        </mt-tab-container>

         
  

        </div>
        <div class="footers">
          <p @click="shopAbout()"><img src="../../assets/about.png"/>商户详情</p>
          <p @click="shopCall()"><img src="../../assets/call.png"/>联系ta</p>
          
        </div>
       
         
       </div>

     <!--网络断开-->         
     

  </div>
</template>
<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast,Loadmore,Indicator} from 'mint-ui';
import userPhoto  from '../../assets/mine.png';
//引入手势缩放和左右滑动
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'normalize.css'
export default {
  name: 'merchantDetailPage',
   components: {
      swiper,
      swiperSlide,
  },
  
  data () {
    return {
      loadImg:'this.src="' + userPhoto + '"',
      isCountLoading:0,
      infoUserName:"",
      tokens:this.$route.query.keys,
      selected:"2",
      store_avatar:'',
      seller_name:'',
      activity_num:null,
      examine_num:null,
      listSelected:true, //列表图片格式的显示
      haveTwoMore:false,
      haveMore:false, //是否还有更多内容
       pageNum: 0,
       towPagenum:0,
       isCount:0,
       isTwoCount:0,
       showMore:false,
       TwoshowMore:false,
       isMore:false,
       TwoisMore:false, 
      noNull:false,
      noPublishData:false,
      params:'',
      showImg:false,
      merchantList:[],
      resultsList:[], //返回结果
      publishList:[],
      pubResultList:[], //返回结果
      goodImageList:[],
      totalNum: 0,
      pageSize: 10,
      store_code :"",
      scrollMode:"touch", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      totalpage:0,
      loading:false,
       bottomText: '',  //下拉刷新
       bottomStatus: '',
       wrapperHeight: 0,
       topStatus: '',
       //wrapperHeight: 0,
       translate: 0,
       moveTranslate: 0,
      imgSrc:'', //返回显示结果
      imgList:[], //图片列表的显示
      isPublishLoading:false,
      noData:false,   //没有数据加载
      isFetch:false, //是否再次请求
      storeExists:'', //是否关注，0未关注，1为1关注
      store_id:null,
      noFetch:false, //网络状态
      chat_id:null, //聊天id
      contentStatus:false,  //查看全文 
      curHeight:0,
      bodyHeight:5000,
      robot:"", //是否开通聊天功能
      storeCode:'', //二维码图片
      previewImg:[], //定义获取的数据图片
      swiperOption:{  //手势信息
      width:window.innerWidth,
       zoom:true,
        initialSlide:0, //当前所在索引
        autoplay: 3000,
        centeredSlides: true,
        effect:"coverflow",
          grabCursor : true,
          setWrapperSize :true,
          pagination : '.swiper-pagination',
          paginationClickable :true,
          prevButton:'.swiper-button-prev',
          nextButton:'.swiper-button-next',
          mousewheelControl : true,
          observeParents:true,
           
      }

     }
  },
   computed: {
     
    isloading(){
      return this.$store.state.isloading;
    },
    player() {
        return this.$refs.videoPlayer.player
      }
   
  },
  created() {
    
  },
 
  mounted(){ 
  if(navigator.onLine){   //有网络状态
        
        Indicator.open("加载中...");
        this.fetchDetail();
        this.fetchData();
      
    }else{   //无网络状态
       this.noFetch=true;
       this.showMore=true;
        Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
    }
    
    
  },
  watch:{
    

  },
  methods:{
   
    fetchPublish(){   //我的发布
      var that=this;
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      if(that.isCountLoading==0){
        Indicator.open("加载中...");
        that.isCountLoading=1;
      }
       axios({
            method: 'POST',
            url: domain+'/mobile/index.php?act=index&op=myStoreExamine&store_id='+that.$route.params.storeId+"&type=1",
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
         
            setTimeout(()=>{
              Indicator.close();
            },500);
          if(response!=undefined){
            if(response.data.code==200){
            var results=response.data.datas;
           
             
             if(that.isTwoCount==0){
                 if(results.length!=0 && results.length<=15){
                 that.pubResultList=results;
                 
                 that.TwoisMore=false;
                that.TwoshowMore=true; //没有更多
                 that.haveTwoMore = false;   
                }else if(results.length==0){
                  that.haveTwoMore = false;
                  that.TwoisMore=false;
                  that.noPublishData=true;
                }else{
                   that.pubResultList=that.pubResultList.concat(results);
                   that.haveTwoMore=true; //可以加载更多
                   that.TwoisMore=true;
                   that.TwoshowMore=false;
                } 
               }else if(that.isTwoCount==1){ //加载第N页面
                   if(results.length==0){
                  that.haveTwoMore = false;
                  that.TwoisMore=true;
                  that.TwoshowMore=true;
                  that.towPagenum--
                }else{
                   that.pubResultList=that.pubResultList.concat(results);
                   that.haveTwoMore=true; //可以加载更多
                   that.TwoisMore=true;
                   that.TwoshowMore=false;
                } 
               }
           
            
          }else if(response.data.code==400){
            that.noPublishData=true;
            that.towPagenum--;
          }
          }else{
            that.noFetch=true;
            that.$store.commit("decrement");
            setTimeout(()=>{
              Indicator.close();
             Toast("发生网络错误，请稍后重试！");              
            },1000);
            
          }
       },(err)=>{
         that.noFetch=true;
            setTimeout(()=>{
              Indicator.close();
            },1000);
         that.$store.commit("decrement");
         Toast("发生网络错误，请稍后重试！");
       }); 
        
    },
    fetchDetail(){  //商户详情
        var that=this;
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        
          axios({
              method: 'POST',
              url: domain+'/mobile/index.php?act=index&op=storeDetail&key='+that.tokens+'&store_id='+that.$route.params.storeId,
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
         if(response.data.code==200){
           var result=response.data.datas;
           that.seller_name=result.seller_name;
           that.examine_num=result.examine_num;
           that.activity_num=result.activity_num;
           that.store_id=result.store_id;
           that.storeExists=result.storeExists;
           that.robot=result.robot;
           that.storeCode=result.store_qr_code;
           that.store_code=result.qrcore;
           that.chat_id=result.chat_data.chat_id;
           that.store_avatar=result.store_avatar;
           if(that.store_avatar=='' ||that.store_avatar==null){
            that.store_avatar=require('../../assets/mine.png');
           }else{
           that.store_avatar=result.store_avatar;
           }

         }
           
    }); 
    }, 
     fetchData(){     //商品展示
      var that=this;
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       axios({
            method: 'POST',
            url: domain+'/mobile/index.php?act=index&op=myStoreExamine&store_id='+that.$route.params.storeId+"&type=2",
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
        }
       }).then(function(response){  
            that.$store.commit("decrement");
            if(response!=undefined){
            if(response.data.code==200){
            var results=response.data.datas;
            for(var i=0;i<results.length;i++){
                 that.goodImageList.push(results[i].goods_image);

              }
             if(that.isCount==0){
                 if(results.length!=0 && results.length<15){
                 that.resultsList=results;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.resultsList=that.resultsList.concat(results);
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
                   that.resultsList=that.resultsList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }
           
            
          }else{
            that.noData=true;
          }
          }else{
            that.noFetch=true;
          }
             
       },(err)=>{
           that.$store.commit("decrement");
           that.noData=true;
       }); 
    },
    
    attections(){  //商户关注
      if(this.tokens!='undefined' && this.tokens!="''"&& this.tokens!='""' && this.tokens!="null" && this.tokens!="(null)"){
        var that=this;
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        if(that.storeExists==0){  //未关注
          axios({
              method: 'POST',
              url:domain+'/mobile/index.php?act=index&op=follow&key='+that.tokens+"&store_id="+that.$route.params.storeId,
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
         if(response.data.code==200){
           that.storeExists=response.data.datas;
           Toast("关注成功");
         }else if(response.data.code==400){
           Toast(response.data.datas.error);
         }else{
           Toast(response.data.datas.error);
         }

      });
        }else if(that.storeExists==1){   //取消关注
          axios({
                  method: 'POST',
                  url:domain+'/mobile/index.php?act=index&op=calcel_store&key='+ that.tokens+"&store_id="+that.$route.params.storeId,
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
            if(response.data.code==200){
              that.storeExists=0;
              Toast(response.data.datas);
            }else if(response.data.code==400){
              Toast(response.data.datas.error);
            }else{
              Toast(response.data.datas.error);
            }

          });
          }
      }else{
            
            Toast("您尚未登录，无法关注该商户!");
        }
    },
    shopAbout(){  //商品介绍
       var storeId=this.store_id;
       this.$router.push({name:'abountMerchantPage',params:{storeId:storeId}})
    },
    shopCall(){  //官方客服
      if(this.tokens!='undefined' && this.tokens!="''"&& this.tokens!='""' && this.tokens!="null" && this.tokens!="(null)"){
         //跳转原生页面
        if(this.root!=1){
        	app.chatWithConversationId(this.chat_id,this.store_id,this.seller_name,this.store_avatar);
        }else{
        	Toast("没有开通聊天功能");
        }
      }else{
        Toast("您尚未登录，无法联系商户!");        
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
                    if(e.target.src==this.previewImg[i]){
                      this.swiperOption.initialSlide=i; //当前索引
                    }
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
    goBack(){
       if(this.$route.query.isDetail==1){
          var ua = navigator.userAgent.toLowerCase();
          if (/iphone|ipad|ipod/.test(ua)) {
            app.back();
          }else{
             this.$router.go(-1);
          }
        
       
       }else{
         app.back();
       }
    },
    cancel(){ //取消分享
      $("#shares").css("display","none");
    },
    showShare(){ //分享详情页面
      var titles="同城广告发现好东西，开启品质新生活";
      var content="专业服务于装饰建材行业，为广大商家提供推广服务平台";
      var pic=this.store_avatar;
      var links="http://tongcheng.intexh.com/wap/dist/#/shareShop?keys="+this.$route.query.keys+"&isDetail=1&storeId="+this.$route.params.storeId;
      var wapisH5="1";
      var store_code=this.store_code;
      app.share(titles,content,pic,links,wapisH5,store_code);


    },
   
     loadMore() {
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      var that=this;
        if(that.selected==2){
           if(that.haveMore){
              that.loading=true;
              that.showMore=false;
              that.isCount=1;
              that.fetchData();
           }
        }else if(that.selected==1){
             if(that.haveTwoMore){
              that.Twoloading=true;
              that.TwoshowMore=false;
              that.isTwoCount=1;
              that.fetchPublish();
           }
        }
      }, 
   
    onPlayerPause(player){
      // alert("pause");
    },
    changeList(event){ //设置隐藏和显示
       event.stopPropagation()
       if(this.selected==1){
         return false;
       }else if(this.selected==2){
         if(this.listSelected==true){
         this.listSelected=false;
        }else if(this.listSelected==false){
            this.listSelected=true; 
        } 
         return false;
       }
      
    },
    changeSelected(id){
      this.selected=id;
      if(id==1){
         this.towPagenum=0;
         this.fetchPublish();
      }else if(id==2){
         this.pageNum=0;
      }
    },
     loadFetch(){  //重新请求加载
      this.noFetch=false;
         if(navigator.onLine){   //有网络状态
             this.fetchDetail();
             this.fetchData();
             this.fetchPublish();
         }else{   //无网络状态
            this.noFetch=true;
            this.showMore=true;
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
}

.merchantDetailPage{

}
/*
*头部内容
*/
.listHeader{
    display: -webkit-box;   
    display: -moz-box; 
    display: -ms-flexbox;  
    display:-webkit-flex; 
    display: flex;
    align-items: center;
    height: 7rem;
    font-size: 1.4rem;
    margin-bottom:1rem;
    background-color:#ffffff;
    position: relative;
}
.leftHeader{
    display: -webkit-box;   
    display: -moz-box; 
    display: -ms-flexbox;  
    display:-webkit-flex; 
    display: flex;
    padding-left: 1rem;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    text-align: left;
    font-size: 1.4rem;
    line-height:2.2rem;
    width:75%;
}
.merchantName{
   line-height: 2.2rem;
   word-break: break-all;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    word-wrap:normal;
    vertical-align:middle;
    color:#333;
}
.merchantNums{
  line-height: 2.2rem;
  font-size:1.3rem;

}
.righAttention{
    width: 64px;
    height: 28px;
    line-height: 28px;
    background-color: #FF8800;
    color: #fff;
    position: absolute;
    right: 10px;
    top:20px;
    text-align: center;
    border-radius: 10px;

}
.isAttection{
    width: 6.4rem;
    line-height: 2.8rem;
    height: 2.8rem;
    background-color: #c1bdbd;
    color: #fff;
    position: absolute;
    right: 1rem;
    top: 2rem;
    text-align: center;
    border-radius: 0.5rem;
}
.avatars{
    max-width:44px;
    max-height:44px;
    min-width: 44px;
    min-height: 44px;
    background-size: contain;
    border-radius: 50%;
    margin-left:10px;
    overflow: hidden;
    display: inline-block;
}
.avatars img{
  width:100%;
  height:100%;
  min-height:44px;
}

.merchantNums span{
    padding-right:10px;
    color: #666;
}

/**
*我的商户详情
*/
/**
*我的店铺-导航栏
 */

 .listNav{
    width: 100%;
    height:52px;
    border-bottom: 1px solid #ddd;
 }

.mint-navbar .mint-tab-item.is-selected{
  color:#ff8800 ;
  border-bottom:0.3rem solid #ff8800;
   margin-bottom: 0px;
}

.lists{
  
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 1.5rem;
}

.listTab{
    width: 100%;
    height:auto;
    margin-bottom: 5rem;
    text-align:left;
    margin: 0 auto;
    background-color: #fff;
}

.shopTitle{
    padding-left: 0.5rem;
    width: 95%;
    line-height: 2.4rem;
}
.btns{
    position: absolute;
    right: 10%;
    bottom: 1rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 88%;
    margin: 0 auto;
    justify-content: space-between;
  
}
.btns p{
    margin:auto;
    padding:0rem 1rem;
    height: 2.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ff8800;
    color: #ff8800;
    border-radius: 0.5rem;
    margin-right:1rem;
}
.btnEdit{
  background-color:#ff8800;
  color:#fff !important
}
.tabsList{
  position:relative;
}
.selectIcon{
    width: 2rem;
    height: 2rem;
    background-size: cover;
    position: absolute;
    right:0.5rem;
    top:-0.3rem;
}
.btn{
     position: absolute;
    right: 1rem;
    bottom: 0.5rem;
    display: flex;
    align-items: center;
}
.btn p{
    width: 4.8rem;
    height: 2.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    margin-right: 0.5rem;
     font-size: 1.3rem;
}
.edit{
    background-color: #ff8800;
    color: #fff;
}

.dels{
  border: 1px solid #ff8800;
   color: #ff8800;
   margin-left:2rem;
}
.imgContainer{
     width: 75%;
    margin: 0 auto;
    display: -webkit-box;
    display: -ms-flexbox;
    -ms-flex-pack: distribute;
    margin-left: 6rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
}
/**
*我的发布
*/

.shopItem{
    background-color: #fff;
    text-align: left;
    margin-top:1rem;
}

.shopItem li{
   width: 100%;
    margin: 0 auto;
    height: auto;
    position: relative;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #d9d9d9;
}
.shopItem li:last-of-type{
  border-bottom:0px;
}
.listPub{
   font-size: 1.4rem;
    display: flex;
    align-items: center;
    flex-wrap:wrap;
}

.leftPub{
  display: flex;
  line-height: 2.8rem;
    
  flex-direction: column;
}
.merchantName{
   line-height: 2.2rem;
   word-break: break-all;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    word-wrap:normal;
    vertical-align:middle;
    color:#333;
    width:60%;
}
 .merchantNames{
        font-size: 1.2rem;
        border: 1px solid #d9d9d9;
        opacity: 0.65;
        text-align: left;
        display: inline-block;
        padding:0.2rem 0.5rem;
        border-radius:  0.5rem;
        -webkit-border-radius:0.5rem;
        -moz-border-radius: 0.5rem;
        -o-border-radius:0.5rem;
        border-radius: 0.5rem;
        vertical-align: middle;
        display:flex;
        align-items:center;
    }
    .merchantNames .titName{
        color: #ff8800;
        padding-left: 5px;
        padding-right:5px;
        vertical-align: middle;
        
    }
    .merchantNames img{
         width: 12px;
         height: 12px;
    }


.merchantNums span{
   padding-right: 3rem;
   color: #999999;
}

.rightPub{
    position: absolute;
    right: 0.5rem;
    top: 1rem;
    border:1px solid #ff8800;
    color:#ff8800;
    padding: 0px 0.5rem;
    border-radius: 0.5rem;
}

.listCont{

}
.listImg{
     width: 80%;
    margin: 0 auto;
      display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: start;
    -ms-flex-pack: distribute;
    margin-left: 65px;
    margin-top: 1rem;
    margin-bottom: 1rem;
  
}

.listImg .imgs{
     width: 28%;
    height: 6.2rem;
    margin: 5px;
    overflow: hidden;
    float: left;

    }
 .listImg .imgs:nth-of-type(3n+1){
      margin-left: 0px;
    }
   .imgs img{
      width:100%;
      height:100%;
      min-height:6.2rem;
    }
  .firstImgs{
        width: 45%;
        height: 8rem;
        overflow:hidden;
        float: left;
    }
     .firstImgs  img{
      width:100%;
      height:100%;
       min-height:8rem;
    }
 .videos{
        padding: 5px;
        display: inline-block;
        overflow: hidden;
        height: 10rem;
    }
.playVideo{
      width: 100%;
    height: 100%;
}

.locationNums{
    margin-left: 60px;
    padding-bottom: 1rem;
    position: relative;
    word-break: break-all;
    display: block;
    width:80%;
    font-family: PingFangSC-Regular;
    font-size: 1.2rem;
    color: #888888;
    letter-spacing: 0;

}
.locationNums span{
   align-items: center;
   font-family: PingFangSC-Regular;
	color: #999;
	letter-spacing: 0;
}
.locationNums img{
    width: 18px;
    height: 10px;
    vertical-align: middle;
    margin-right: 0.5rem;
}
.locationInfo{
   
    text-align: left;
    margin-left: -4rem;
}
.chats{
    width: 6.4rem;
    height: 2.4rem;
    background-color: #ff8800;
    color: #fff;
    border-radius: 0.5rem;
    margin-right: 1rem;
}
.listBottom{
	  bottom: 101rem;
    margin: 0px auto;
}
.rightlook{
	position: absolute;
  right: 10%;
  font-family: PingFangSC-Regular;
	font-size:  1.2rem;
	color: #888888;
	letter-spacing: 0;	
	
}
.content{
 margin-left: 5.5rem;
    font-size: 1.4rem;
    line-height: 2.4rem;
    display: block;
    word-break: break-all;
    width: 85%;
}
/*
*图片列表
*/
.listCenter{
    background-color: #f4f4f4;
    width: 100%;
    display: block;
    height: auto;
    margin: 0px auto;
    margin-bottom: 1rem;
}
.ullist{
   display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: start;
    height: auto;
    width: 95%;
    margin: 1rem auto;
    font-size: 0;
    letter-spacing: -3px;
    vertical-align: top;

}
.listItem{
    width: 44.5%;
    height: 16rem;
    background-color: #ffffff;
    overflow: hidden;
     padding: 0.5rem;
    letter-spacing: normal;
    word-spacing: normal;
}
.ullist>.listItem:nth-of-type(2n+1){
  padding-left:0px;
}
.itemImg{
    height: 10rem;
    width:100%;
    padding: 0.5rem;
    background-size: cover;
    overflow: hidden;
    vertical-align:top;
    display: block;
}

.itemImg img{
     width:100%;
     height:100%;
     background-size: auto auto;
}
.goodsTitle{
    word-wrap: break-word;
    word-break: break-all;
    text-align: left;
    font-size: 1.2rem;
    font-family: PingFangSC-Regular;
    letter-spacing: 0.1rem;
    padding-left: 0.5rem;
    height: 5rem;
    line-height: 1.8rem;
    color: #333;
    overflow: scroll;
}
.goodsTitle::-webkit-scrollbar {display:none}


/*
*列表形式展示
*/
.listShow{
    display: block;
    height: auto;
    width: 100%;
    margin: 0 auto;
    border-bottom:1px solid #ddd;
    background: #fff;
}
.listShow:last-of-type{
  border:0 none;
}
.listImage{
    width: 10rem;
    height: 10rem;
    margin:1rem;
    background-size: cover;
    overflow: hidden;
    -ms-background-clip: border-box;
    background-clip: border-box;
    float: left;
    vertical-align: top;
}
.listImage img{
  width:100%;
  height: 100%;
  min-width:100%;
  min-height:100%;

}
.titles{
  padding-top: 10px;
}
.listTitle{
    font-family: PingFangSC-Regular;
    font-size: 1.2rem;
    color: #333333;
    word-break: break-all;
    word-wrap: break-word;
    margin-right: 0.5rem;
    line-height: 1.8rem;
    height: 10rem;
    overflow: scroll;
}
.listTitle::-webkit-scrollbar {display:none}


.editPublish{
    background: #ff8800;
    width: 5rem;
    color: #ffffff;
    border-radius: 0.5rem;
}

.rightCell{
  position: absolute;
  right: 10%;
}
.btnsPublish{
      
    margin-bottom: 2rem;
    justify-content: flex-end;
    align-items: center;
    font-size: 1.4rem;
}
.btnsPublish p{
   letter-spacing: 0.2rem;
   margin: 0px 1rem;
   height:2.6rem;
}
.delPublish{
     
    border: 1px solid #ff8800;
    width: 5rem;
    color: #ff8800;
    border-radius: 0.5rem;
}
.bodyContent{
    word-break: break-all;
    display: block;
    width: 75%;
    margin-left:65px;
    font-size: 1.4rem;
    font-family: PingFangSC-Regular;
    color: #333333;
    letter-spacing: 0;
    line-height: 2.2rem;
}
/**
*底部添加商品
*/
.footerAdd{
    position: fixed;
    bottom: 0px;
    height: 4.8rem;
    border-top: 1px solid #d9d9d9;
    color: #ff8800;
    font-size: 1.4rem;
}
.footerAdd img{
  width:2.8rem;
  height:2.8rem;
  margin-right:5rem;
}

.showImgs{

}

.listDetailContent{
  background-color: #f2f2f2;
  margin-bottom: 5rem;
  text-align: left;
  padding-top: 64px;
}

.clearBoth{
   clear: both;
}


.imgsList{
     margin: 0 auto; 
    margin-bottom: 2rem;
    padding-left:4.5rem;
}
.imgsList img{
    width: 6.5rem;
    height: 6.5rem;
    margin: 0rem 0.5rem;
}

/*查看全文*/
.bodyFont{
    color: #333;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
    margin-bottom: 12px;
    height: auto;
    overflow: hidden;
    max-height: 100%;
    margin-top: 1. 5rem;
    padding-left: 4rem;

 }
 .bodyFont span{
    width: 94%;
    color: #333333;
    letter-spacing: 0;
    line-height: 2.2rem;
    font-size:1.4rem;
    padding-left: 1rem;
    padding-right:5rem;
 }
 .bodyHeight{
 height:5000px;
 }
 .contentToggle{
 height:6rem;
 line-height:6rem;
 text-align: center;
 border-radius: 0.5rem;
 margin-bottom:3rem;
 }
 .listBottom{
   color: #888888;
    width: 85%;
    margin: 0 auto
 }
 .showViews{
    padding-left: 65px;
    padding-top:1rem;
    font-size: 1.4rem;
 }

/*底部内容*/
.footers{
      display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
  flex:1;
  height:4.8rem;
  border-top:1px solid #d9d9d9;
    background-color:#f4f4f4;
  justify-content:center;
  align-items:center;
  bottom:0px;
  position:fixed;
  width:100%;
  z-index: 998

}
.footers p{
  flex:0.5;
  font-size: 1.4rem;
}

.footers img{
  width: 2.4rem;
  height: 2.4rem;
  margin-right: 1rem;
}


/*网络状态*/
.noFetch{
    height: 100vh;
    color: #999999;
    font-size: 1.4rem;
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
    width: 9.4rem;
    height: 9.4rem;
}
.noFetch p{
    line-height: 4.8rem;
}
.btnFetch{
    width: 8.2rem;
    height: 4.2rem;
    background-color: #ff8800;
    color: #ffffff;
    font-size: 1.5rem;
    letter-spacing: 0.4rem;
    border-radius: 0.5rem;
}
.selelerName{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    margin-right:5px;
    margin-left:10px;
    font-family: PingFangSC-Regular;
    color: #333333;
    letter-spacing: 0;
}
 @media screen and (max-width:330px) {
    .merchantName {
        width:60%;
    }
   
   

}
@media only screen and (min-width: 330px) and (max-width:420px) {
    .merchantName {
        width:63%;
    }
    
    
}
@media only screen and (min-width: 330px) and (max-width: 592px){
  
   

}

</style>

