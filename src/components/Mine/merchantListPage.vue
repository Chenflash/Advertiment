<template>
  <div class="merchantListPage">
        
        <header class="mint-header">
         <div class="mint-header-button is-left">
           <a href="javascript:;" class="router-link-active">
           <button @click="goBack" class="mint-button mint-button--default mint-button--normal">
             <span class="mint-button-icon"><i class="mintui mintui-back"></i></span>
              <label class="mint-button-text"></label></button></a></div> 
              <h1 class="mint-header-title">我的店铺</h1> <div class="mint-header-button is-right">
                <button @click="showShare()" class="mint-button -mob-share-ui-button -mob-share-open mint-button--default mint-button--normal">
                  <!----> <label class="mint-button-text">
               <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABzUlEQVRYR+2VjzEDURDGv68C0YEORAXogApEBaICVEAqQAdUICoQFYgK6GDN72Zvxhh37yQXxkzezM0kmZfb79/uWn98/Mf1tQawVqA3BSJiT9KlpKGkuaRT23elkPcCICK2JD1Jupd0IwkwZ5L2bU/bQPQF4FzSgW3YVyciKDy3PfotAHu2YV4DQAmtHEDKf52yj21PIgLW/HZYysHCFkTEQNKJpLGkV0kEjs8bKcKFbaxpPQsBiIiDTPwmRW1Xcqf32DCz/V4qXlnUdikiYABL2FLkNtNNkYmk866Fmuo0AsjiSMoDG8BsS3qUNLJNry992gBQAIaVvBm2F0k7tmdLV84XtAGANUyraZahe+syXH4Crg0AzJH8MF/IZKO9sGKyrPc1yDYABA/2u3mZVrtKAChxXBqzXZQotmF6P6h9TysAcpSdwdLp1HLfASoCaGKR2w+bGDx0CouIbchiAhCDqBjWhQF8GjxkgnxwntM2lhLW0TGt7bo0gOwQQBDQYW1HRMB+aht1Gk+fAL7bhmSHsb1yAIzmh3pGRAQW8J0cENjVAkgbKMTeIIC08H2JPf/rxYJPgYQ5D9uw2AG9A+gyeL7e6VWBNYB/qcAHaXysIfkd9uQAAAAASUVORK5CYII=" class="shares ">
           </label>
         </button>
        </div>
       </header>
        
          <div class="showImgs" v-if="showImg">
         <swiper :options="swiperOption" ref="imgOverview" style="height: 100%;" >
        <swiper-slide v-for="(img, index) of previewImg" :key="index">
          <p class="swiper-zoom-container" @click="showImg=false">
            <img :src="img"  alt="" @click="showImg=false">
          </p>
        </swiper-slide>
      </swiper>
       </div> 
       
       <div class="listContainer" v-if="!noFetch"  v-show="!isloading">
         
         <div class="listHeader">   
             <span class="avatars"><img :src="store_avatar?store_avatar:require('../../assets/mine.png')"    :onerror="loadImg"/></span>
          <div class="leftHeader">
             <p class="merchantName">{{seller_name}}</p>
             <p class="merchantNums"><span>活跃度 {{activity_num==null?'0':activity_num}}</span><span>发布数  {{examine_num==null?'0':examine_num}}</span> </p> 
          </div>
          <div class="rightHeader" @click="editMerchant">
                  简介编辑
          </div>
         </div>  
         
             <!--我的店铺-导航栏-->
          <mt-navbar v-model="selected" class="listNav">
          <mt-tab-item id="2" class="listItems" >
           <div @click="changeSelected(2)" class="lists">
             <span>商品展示</span>
             <img v-bind:src="selected==2?require('../../assets/list.png'):require('../../assets/listNo.png')" class="selectIcon"  v-if="listSelected" @click="changeList($event)"/>   
             <img v-bind:src="selected==2?require('../../assets/selectImg.png'):require('../../assets/imgNoSelece.png')" class="selectIcon" style="height:20px;width:18px" v-else  @click="changeList($event)"/>   
             
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
                    <div class="btn">
                        <p class="edit" @click="editShops(list.id)">编辑</p>
                        <p class="dels" @click="getmemberId(list.id)">删除</p>
                      </div> 
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
                 <p class="itemImg" id="ImgItem"><img v-lazy="list.image==''?require('../../assets/noImg.png'):list.image"    class="goodImage" @click="clickImg($event,list.image)"/></p>
                 <p class="goodsTitle">{{list.content}}</p>
                  <div class="btn">
                        <p class="edit" @click="editShops(list.id)">编辑</p>
                        <p class="dels" @click="getmemberId(list.id)">删除</p>
                      </div> 
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
                            <span class="avatars"><img :src="store_avatar!=null ?store_avatar:require('../../assets/mine.png')"    :onerror="loadImg"/></span>
                           <p style=" display:inline-block;font-size:1.5rem;" class="selelerName">{{seller_name.length>11?seller_name.slice(0,11)+'...':seller_name}}</p>
                          <p class="merchantNames"><img src="../../assets/baran.png"/><span class="titName">{{list.gc_name.gc_name}}</span></p>
                          
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
                              <video   v-if="(list.goods_video!=null &&list.goods_video!='')" style="width:80%; object-fit: fill; object-position: center center;height: 20rem;"
                                      id="my-player"
                                      class="video-js vjs-default-skin"
                                      webkit-playsinline="true"
                                       preload="auto"
                                        controls
                                      x-webkit-airplay="true"
                                       x5-playsinline="true"
                                       playsinline="true"
                                      x5-video-player-type="h5" 
                                      x5-video-player-fullscreen="true" 
                                      x5-video-orientation="portraint"
                                      controlslist="nodownload"
                                      data-setup='{"example_option":true}'>
                                    <source :src="list.goods_video" type="video/mp4" ></source>
                                    <source :src="list.goods_video" type="video/webm" ></source>
                                    <source :src="list.goods_video" type="video/ogg" ></source>
                                    
                                  </video>
                               
                            </span>

                           
                          </div>
                         	<div class="locationNums">
	                            <span> {{list.goods_addtime}}</span>
	                            <span class="rightlook"><img src="../../assets/looks.png" />{{list.goods_click==null?'0':list.goods_click}}</span>
                              </div>	
                        </div>
                        <div class="btnsPublish">
                            <p class="editPublish" @click="editPublish(list.goods_id)">重发</p>
                            <p class="delPublish" @click="delpublish(list.goods_id)">删除</p>
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

         

        <div class="footerAdd" @click="addMerchant()">
          <img src="../../assets/add.png"/>  
                添加商品
        </div>





       </div> 
    


  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast ,MessageBox,Loadmore,Indicator} from 'mint-ui';
//引入手势缩放和左右滑动
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import userPhoto  from '../../assets/mine.png';
export default {
  name: 'merchantListPage',
  components: {
      swiper,
      swiperSlide,
  },
  inject:['reload'], //注入依赖
  data () {
    return {
        loadImg:'this.src="' + userPhoto + '"',
      videoInfo:{
         paused: false,
         volume: null,
         currentTime: null,
         playbackRate: null
      },
      isCountLoading:0,
      selected:"2",
      store_avatar:'',
      seller_name:'',
      activity_num:null,
      examine_num:null,
      listSelected:true, //列表图片格式的显示
      topStatus:'',
      bottomStatus:'',
      wrapperHeight:0,
      allLoaded:false,
      noNull:false,
      params:'',
      showImg:false,
      merchantList:[],
      resultsList:[], //返回结果
      publishList:[],
      pubResultList:[], //返回结果
      noPublishData:false,
      PublishqueryLoading:false,
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
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      scrollMode:"touch", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      totalpage:0,
      loading:false,
       bottomText: '',  //下拉刷新
       bottomStatus: '',
       wrapperHeight: 0,
      topStatus: '',
      store_id:null,
      noData:false,   //没有数据加载
      noFetch:false, //网络状态
      imgList:[],
      contentStatus:false,  //查看全文 
      store_code:null,
      curHeight:0,
      bodyHeight:5000,
      previewImg:[], //定义获取的数据图片
      swiperOption:{  //手势信息
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
   
  },
  mounted(){
  
    if(navigator.onLine){ //网络状态的判断
      this.fetchMerchant();
      this.fetchData();
    }else{  
       this.noFetch=true;
       this.showMore=true;
        Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500}) 
    }
  },
  watch:{
   
  },
  methods:{
     
    fetchPublish(){
      var that=this;      
      if(that.isCountLoading==0){
        Indicator.open("加载中...");
        that.isCountLoading=1;
      }
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
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
       }).then(function(response){  //我的发布内容  
          that.$store.commit('decrement');
          Indicator.close();
          if(response!=undefined){
            if(response.data.code==200){
            var results=response.data.datas;
             if(that.isTwoCount==0){
               that.isTwoCount=1;
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
                }else{
                   that.pubResultList=that.pubResultList.concat(results);
                   that.haveTwoMore=true; //可以加载更多
                   that.TwoisMore=true;
                   that.TwoshowMore=false;
                } 
               }
           
            
          }else if(response.data.code==400){
            that.noPublishData=true;
          }
          }else{
            Indicator.close();
            that.$store.commit("decrement");
             that.noPublishData=true; 
          }       
           
     },(err)=>{
         Indicator.close();
         that.noFetch=true;
         that.$store.commit("decrement");
       }); 
      
    },
    fetchData(){
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
       }).then(function(response){  //我的商品  
             that.$store.commit('decrement'); 
             var results=response.data.datas;  
             Indicator.close();      
             if(response!=undefined){
               if(response.data.code==200){
               if(that.isCount==0){
                 if(results.length!=0 && results.length<=15){
                 that.resultsList=results;
                 that.isMore=false;
                that.showMore=true; //没有更多
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
              }else if(response.data.code==400){
                that.noData=true;
              }else{
                that.noFetch=true;
              }
             }else {
                that.noFetch=true;
                 that.$store.commit("decrement");
                setTimeout(()=>{
                  Indicator.close();
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
    fetchMerchant(){
       var that=this;
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       axios.post(domain+'/mobile/index.php?act=index&op=storeDetail&key='+that.$route.params.key+'&store_id='+that.$route.params.storeId,Object.assign({},this.param)).then((res) => {     
              that.$store.commit("decrement");
              Indicator.close();
            if(res!=undefined){
              if(res.data.code==200){
              var result=res.data.datas;
              that.store_avatar=result.store_avatar;
              that.seller_name=result.seller_name;
              that.examine_num=result.examine_num;
              that.activity_num=result.activity_num;
              that.store_id=result.store_id;
              that.store_code=result.qrcore;
              if(that.store_avatar==''){
                 that.store_avatar=require('../../assets/mine.png');
              }
              
            }
            }else{
               Indicator.close(); 
         that.$store.commit("decrement");
          Toast("发生网络错误，请稍后重试！");
            }
       },(err)=>{
         Indicator.close(); 
         that.$store.commit("decrement");
          Toast("发生网络错误，请稍后重试！");
       });  
       
    },
   
      changeSelected(id){
      this.selected=id;
      if(id==1){
         this.isTwoCount=0;
         this.towPagenum=0;
         this.fetchPublish();
      }else if(id==2){
      }
    },
     loadMore() {
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

    editShops(ids,content,image){  //编辑商品
       this.reload();
       app.editGoods(ids);
    },
    getmemberId(ids){   //删除商品
        MessageBox.confirm('','确定删除该商品？').then(action => {
          if (action == 'confirm') {
            var that=this;
              var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
              axios({
                methond:'POST',
                url: domain+'/mobile/index.php?act=member_index&op=delete_store_goods&key='+ that.$route.params.key+"&id="+ids,
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
                   that.$store.commit("increatement");
                    that.pageNum=0;
                    that.fetchMerchant();
                    that.fetchData();
                    Toast(response.data.datas);
                }else{
                    Toast("发生网络错误，请稍后重试！");
                }
              })
          }else if(action=='cancel'){
            return false;
          }  
        });

    },
    editPublish(goodId){ // 编辑广告
      this.reload();
      app.editAdv(goodId);
    },
    editMerchant(){
        this.reload();
       app.editStore(this.store_id) 
    },
    delpublish(goodId){  //删除广告
         MessageBox.confirm('','确定删除该发布？').then(action => {
          if (action == 'confirm') {
             var that=this;
              var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
              axios({
                methond:'POST',
                url: domain+'/mobile/index.php?act=member_index&op=delete_goods&key='+ that.$route.params.key+"&goods_id="+goodId,
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
                    that.$store.commit("increatement");
                    that.towPagenum=0;
                    that.pubResultList=[];
                    that.isTwoCount=0;
                    that.fetchMerchant();
                    that.fetchPublish();
                   setTimeout(function(){
                    Toast(response.data.datas);
                      
                   },2000);
                }else{
                      Toast("发生网络错误，请稍后重试！");
                }
              })
          }else if(action=='cancel'){
            return false;
          }
         });
       
    },
    addMerchant(){  //添加商品
      app.postGoods();
    },
    loadFetch(){
        this.noFetch=false;
         if(navigator.onLine){   //有网络状态
             this.$store.commit("increatement");
             this.fetchMerchant();
			       this.fetchData();
			       this.fetchPublish();
         }else{   //无网络状态
            this.noFetch=true;
            this.showMore=true;
            this.$store.commit("decrement");
             Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
        
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
      app.back();
    },
    showShare(){   //分享链接
      var titles="同城广告发现好东西，开启品质新生活";
      var content="专业服务于装饰建材行业，为广大商家提供推广服务平台";
      var pic=this.store_avatar;
      var links="http://tongcheng.intexh.com/wap/dist/#/shareShop?keys="+this.$route.params.key+"&isDetail=1&storeId="+this.$route.params.storeId;
      var wapisH5="1";
      var store_code=this.store_code;
      app.share(titles,content,pic,links,wapisH5,store_code);



    }

  },
  destroyed(e){
    this.fetchMerchant();
		this.fetchData();
    this.fetchPublish();
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
.shares{
   width:28px;
   height:28px;
   background-size:cover;
}

.listContainer{
    background-color: #f2f2f2;
    margin-bottom: 5rem;
    text-align: left;
    padding-top: 56px;
}
.merchantListPage{
}
/*
*头部内容
*/
.listHeader{
   width:100%;
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
    width:75%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    text-align: left;
    font-size: 1.4rem;
}
.merchantName{
   word-break: break-all;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    word-wrap:normal;
    line-height: 2.2rem;
    vertical-align:middle;
    color:#333;
}
.merchantNums{
  line-height: 2.2rem;
  color: #666;
  
}
.rightHeader{
    width: 64px;
    height: 22px;
    top: 30px;
    background-color: #ff8800;
    color: #fff;
    position: absolute;
    right: 10px;
    padding: 2px;
    line-height: 24px;
    border-radius:  13px;
    text-align:center;
    font-size:14px;
  

}
.merchantName{
   word-break: break-all;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    word-wrap:normal;
    line-height: 2.2rem;
    vertical-align:middle;
    color:#333;
}
.avatars{
    max-width:44px;
    max-height:44px;
    min-width: 44px;
    min-height: 44px;
    background-size: contain;
    border-radius: 50%;
    margin-left:10px;
    margin-right:10px;
    overflow: hidden;
    display: inline-block;
}
.avatars img{
  width:100%;
  height:100%;
  min-width: 44px;
    min-height: 44px;
}


.merchantNums span{
    padding-right: 3rem;
      color: #999999;
}
.videos{
     padding: 0.5rem;
    display: inline-block;
    overflow: hidden;
    object-fit: contain;
    width: 80%;
    height:auto;
}
.playVideo{
  width:100%;
  height:100%;
}
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
  border-bottom:3px solid #ff8800;
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
    margin: 0 auto;    
    margin-bottom: 8rem;
    text-align:left;
    background-color: #fff;
}

.shopTitle{
    padding-left: 5px;
    width: 95%;
    line-height: 2.4rem;
}
.btns{
    position: absolute;
    right: 1rem;
    bottom: 0.2rem;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
  
}
.btns p{
    margin:auto;
    padding:0px 1rem;
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
    width: 24px;
    height: 26px;
    background-size: cover;
    position: absolute;
    right: 5px;
    top:-5px;
}
.btn{
     position: absolute;
    right: 10px;
    bottom: 5px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
}
.btn p{
    width: 50px;
    height:22px;
    line-height: 22px;
    text-align: center;
    display: -ms-flexbox;
    -ms-flex-pack: center;
    -ms-flex-align: center;
    border-radius: 18px;
    font-size: 14px;
}
.edit{
    background-color: #ff8800;
    color: #fff;
}

.dels{
  border: 1px solid #ff8800;
   color: #ff8800;
   margin-left:20px;
}

/**
*我的发布
*/

/*
*推荐列表
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
}

.leftPub{
  display: flex;
  line-height: 2.8rem;
    
  flex-direction: column;
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
        overflow:hidden;
        float:left;

    }
 .listImg .imgs:nth-of-type(3n+1){
      margin-left: 0px;
    }
 .imgs  img{
      width:100%;
      height:100%;
      min-height:6.2rem;
    }
  .firstImgs{
        width: 45%;
        height: 8rem;
        overflow:hidden;
         float:left;
    }
     .firstImgs  img{
      width:100%;
       min-height:8rem;
    }
 .videos{
        padding: 5px;
        display: inline-block;
        overflow: hidden;
        height: 10rem;
    }

.locationNums{
    margin-left: 65px;
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
	  bottom: 1rem;
    margin: 0px auto;
}
.rightlook{
	position: absolute;
  right:10%;
  font-family: PingFangSC-Regular;
	font-size: 1.2rem;
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
    height: 19rem;
    background-color: #ffffff;
    overflow: hidden;
    margin: 0.5rem;
    position:relative; 
    letter-spacing: normal;
    word-spacing: normal;
}
.itemImg{
    width:100%;
     height: 10rem;
    margin: 0.5rem;
    background-size: cover;
    overflow: hidden;
    display: block;
}

.itemImg img{
     width:100%;
     height:100%;
     background-size: 100% auto;
}
.goodsTitle{
    word-wrap: break-word;
    word-break: break-all;
    text-align: left;
    font-size: 1.2rem;
    font-family: PingFangSC-Regular;
    letter-spacing: 1px;
    padding-left: 0.5rem;
    margin-bottom: 1rem;
    height: 5rem;
    line-height: 1.8rem;
    color: #333;
    overflow: scroll !important;
}


/*
*列表形式展示
*/

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
    position: relative;
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
  padding-top: 1rem;
}
.listTitle{
    font-family: PingFangSC-Regular;
    font-size: 1.2rem;
    color: #333333;
    word-break: break-all;
    word-wrap: break-word;
    margin-right: 0.5rem;
    line-height: 1.8rem;
    height: 7rem;
    overflow: scroll;
}




.locationNums img{
    width: 1.8rem;
    height: 1rem;
    vertical-align: middle;
    margin-right: 0.5rem;
}
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
    display: flex;
    margin-right:  6%;
    margin-top: 10px;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -ms-flex-align: center;
    align-items: center;
    font-size: 14px;
    margin-bottom: 10px;
}
.btnsPublish p{
     width: 54px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    display: -ms-flexbox;
    -ms-flex-pack: center;
    -ms-flex-align: center;
    border-radius: 18px;
    font-size: 14px;
    margin-right:5px;
    
}
.delPublish{
    display: -ms-flexbox;
    display: flex;
    border: 1px solid #f80;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    color: #f80;
    border-radius: 5px;
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
.editPublish{
    background: #ff8800;
    display: -webkit-box;   
    display: -moz-box; 
    display: -ms-flexbox;  
    display:-webkit-flex; 
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    border-radius: 0.5rem;
}


/**
*底部添加商品
*/
.footerAdd{
    position: fixed;
    z-index: 99;
    bottom: 0px;
    display: -webkit-box;   
    display: -moz-box; 
    display: -ms-flexbox;  
    display:-webkit-flex; 
    display: flex;
    width: 100%;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 4rem;
    border-top: 1px solid #d9d9d9;
    background-color: #ffffff;
    color: #ff8800;
    font-size: 1.4rem;
}
.footerAdd img{
  width:2,4rem;
  height:2.4rem;
  margin-right:0.5rem;
}


.isAttection{
    width: 6.4rem;
    height: 2.8rem;
    background-color: #c1bdbd;
    color: #fff;
    position: absolute;
    right: 1rem;
    top: 2rem;
   display: -webkit-box;   
    display: -moz-box; 
    display: -ms-flexbox;  
    display:-webkit-flex; 
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 5px;
}

.listImg .imgs:nth-of-type(3n+1){
   margin-left: 0px;
}

/*
*加载全部
*/
.more_loading{
     height: 6.4rem;
    line-height: 6.4rem;
    border-bottom: 0px;
     align-items: center;
     display: flex !important;
}
.more_loading span{
  font-size: 1.4rem;
}
.clearBoth{
   clear: both;
}

/*
*暂无数据
*/
.noNull{
  display: block         /* 新版本语法: Opera 12.1, Firefox 22+ */;
  width:100%;
  background-color: #fff; 
}
.noMessage{
     width: 15rem;
    height: 15rem;

}
.noNull p{
  padding-top: 1rem;
  font-size: 1.4rem;
  color: #999999;
}
/*网络状态*/
.noFetch{
    height: 100vh;
    color: #999999;
    font-size: 1.4rem;
   display: -webkit-box;   
    display: -moz-box; 
    display: -ms-flexbox;  
    display:-webkit-flex; 
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
    width: 0.4rem;
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
    font-size: 16px;
    letter-spacing: 0.4rem;
    border-radius: 0.5rem;
}

.imgsList{
    justify-content: flex-start;
    margin: 0 auto;
    display: -webkit-box;   
    display: -moz-box; 
    display: -ms-flexbox;  
    display:-webkit-flex; 
    display: flex;
    -ms-flex-pack: distribute;
    margin-bottom: 2rem;
    padding-left:4.5rem;
}
.imgsList img{
    width: 6.5rem;
    height: 6.5rem;
    margin: 0px 0.5rem;
}

/*查看全文*/
.bodyFont{
    color: #333;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
    margin-bottom: 1.2rem;
    height: auto;
    overflow: hidden;
    max-height: 100%;
    padding-left: 4rem;

 }
 .bodyFont span{
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: #333333;
    letter-spacing: 0;
    line-height: 2.2rem;
    padding-right: 0.5rem;
 }
  .showViews{
    padding-left: 65px;
    padding-top:1rem;
    font-size: 1.4rem;
 }

 .contentToggle{
 height:6rem;
 line-height:6rem;
 text-align: center;
 border-radius: 0.5rem ;
 margin-bottom:3rem;
 }
 .listBottom{
    margin-bottom: 7.5pt;
    color: #888888;
 }
.noMore{
  display: block !important;
  width: 100%;
  text-align: center;
}
.textloading{
    width: 100%;
    display: block;
    text-align: center;
    margin-bottom: 3rem;
    color: #333;
    height: 3.6rem;
    font-size: 1.5rem;
    padding-top:3rem;
}
.textloading img{
  width:2.4rem;
  height:2.4rem;
}
.selelerName{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    margin-right:10px;
    font-family: PingFangSC-Regular;
    color: #333333;
    letter-spacing: 0;
}
@media screen and (max-width:330px) {
    .merchantName {
        width:63%;
    }

}
@media only screen and (min-width: 330px) and (max-width:420px) {
    .merchantName {
        width:65%;
    }
   
}
@media only screen and (min-width: 420px) and (max-width: 592px){
  .merchantName {
        width:73%;
    }
  

}
@media screen and (min-width:600px) {
    .merchantName {
        width:80%;
    }
   

}

</style>

