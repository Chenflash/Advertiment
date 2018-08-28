    <template>
      <div class="merchantInfoPage">
          <div v-show="showRedPackage">
            <red-Package :envids="envId"></red-Package>
          </div> 
          <div v-show="!showRedPackage" class="showPackage">
          <mt-header title="详情" >
            <router-link  to="" slot="left">
                <mt-button icon="back" @click="goBack()"></mt-button>
            </router-link>
            <mt-button  slot="right"></mt-button>
          </mt-header>
            
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
            <!--信���详情-->   
            <div class="infoContainer" v-if="!noFetch" v-show="!isloading">        
              <div class="infoDetail">
              <div class="info_header">
                  <span class="avatars" style="margin-left:10px;margin-right:10px;"><img :src="store_avatar==null?require('../../assets/mine.png'):store_avatar"  :onerror="loadImg"   @click="togoDetail(storeId)"/></span>
                  <span class="infoName">{{infoUserName.length>11?infoUserName.slice(0,11)+"...":infoUserName}}</span>
                  <span class="reds" @click="getRedPackage" v-if="envId!=0"><img src="../../assets/redPakcage.png"/>利是</span>
              </div>
                <p class="Avatarcontent" id="Avatarcontent" v-html="infoContent.replace(/<\/?.+?>/g,'').length>200?infoContent.slice(0,200)+'...':infoContent"></p>
                  <p  @click="toggle($event,infoContent)"  v-if="infoContent.replace(/<\/?.+?>/g,'').length>200" class="showViews">全文</p> 
              <div class="locationInfos">
                <p class="locations"><img src="../../assets/location.png"/>{{locationCity==null?'未知位置':locationCity}}<span class="rightCell">{{infoTime}}</span>   </p>  
                <p class="chats" @click="chat">联系ta</p>
              </div>
              <div class="imgList" >
                  <img  v-for="(item,i) of goods_image" :src="item" v-if="item!=''&& goods_video==null" :key="i"/>
                   <video  v-if="(goods_video!=null &&goods_video!='')" style="width:100%; object-fit: scale-down; object-position: center center;height: 20rem;"
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
                                      :poster="goods_image[0]"  
                                      controlslist="nodownload"
                                      data-setup='{"example_option":true}'>
                                    <source :src="goods_video" type="video/mp4" ></source>
                                    <source :src="goods_video" type="video/webm" ></source>
                                    <source :src="goods_video" type="video/ogg" ></source>
                                    
                                  </video>
              </div>
              
                
                
              <h3 class="infoTitle" v-if="envId!=0">利是口号：{{passwordTxt}}</h3>
              <!--推荐-->
              <p class="Recommend"><b>推荐</b></p>
                <div v-if="!noData">
                <ul class="shopItem" 
                  v-infinite-scroll="loadMore" 
                  infinite-scroll-disabled="moreLoading" 
                  infinite-scroll-distance="0" 
                  infinite-scroll-immediate-check="false" 
                  >
                        <li v-for="(list,i) of tuijianList" :key="i" >
                          <div class="listPub">
                                <span class="avatars"><img :src="store_avatar!=null?store_avatar:require('../../assets/mine.png')"  :onerror="loadImg"   @click="togoDetail(storeId)"/></span>
                              <p class="infoName">{{infoUserName.length>11?infoUserName.slice(0,11)+"...":infoUserName}}</p>
                              <p class="merchantNames"><img src="../../assets/baran.png"/><span class="titName">{{list.gc_name}}</span></p>
                              
                            </div> 
                            <div class="listCont">
                              <p class="content  clearfloat" id="bodyFont" v-html="list.goods_body.replace(/<\/?.+?>/g,'').length>200?list.goods_body.slice(0,200)+'...':list.goods_body"></p>
                                <p  @click="toggle($event,list.goods_body)"  v-if="list.goods_body.replace(/<\/?.+?>/g,'').length>200" class="showGoodViews">全文</p> 
                            
                              
                              <ul class="listImg">
                               <span  class="imgs"  v-show="item!=''&&(list.goods_video==null ||list.goods_video=='')"  v-for="(item,i) of (list.goods_image==null?require('../../assets/noImg.png'):list.goods_image).split(';')"  @click="clickImg($event,list.goods_image)">
                               <img 	v-lazy="item" :onerror="loadImg" /> 
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
                              </ul>
                              <div style="clear:both"></div>
                              <div class="locationNums">
                                  <span> {{list.goods_addtime}}</span>
                                  <span class="rightlook"><img src="../../assets/looks.png" />{{list.goods_click==null?'0':list.goods_click}}</span>
                                  </div>	
                            </div>

                        </li>
                        
                      
                      </ul>
                      <!--底部判断是加载图标还是提示“全部加载”-->
                        <div class="noMore"  v-if="isMore">
                        <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                        <div class="textloading" v-else>没有更多了</div>
                      </div>
                  </div>
            </div>
            <div class="noNull" v-if="noData"  v-show="!isloading" >
                    <img src="../../assets/noMessage.png"/>
                    <p>暂无数据</p>   
              </div>
            </div>
          <ul class="noFetch" v-show="!isloading" v-else>
            <img src="../../assets/noFetch.png" />
            <p>网络无法连接</p>
            <p  @click="loadFetch()"  class="btnFetch">刷新</p>
          </ul>  

          </div>

      </div>
    </template>

    <script>
    import axios from 'axios'  //引入异步加载的网络请求
    import { Toast,Indicator} from 'mint-ui';
    import redPackage from './redPackage.vue';
    //引入手势缩放和左右滑动
    import 'swiper/dist/css/swiper.css';
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    import userPhoto  from '../../assets/mine.png';

    export default {
      name: 'merchantInfoPage',
      components: {
        'red-Package':redPackage,
          swiper,
          swiperSlide,
      },
      data () {
        return {
          loadImg:'this.src="' + userPhoto + '"',
          store_avatar:null,
          infoUserName:"",
          infoTime:"",
          infoContent:"",
          locationCity:"",
          passwordTxt:"",
          haveMore:false, //是否还有更多内容
          pageNum: 0,
          isCount:0,
          showMore:false,
          isMore:false,
          noNull:false,
          noFetch:false,
          goods_image:null,
          goods_video:null,
          tuijianList:[], //推荐列表
          noData:false,
          tokens:this.$route.params.key,
          envId:'',
          contentStatus:false,  //查看全文 
          curHeight:0,
          bodyHeight:500,
          chat_id:null, //聊天id
          storeId:null,
          showImg:false,
          showPackage:false,
          previewImg:[], //定义获取的数据图片
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
              mousewheelControl : true,
              observeParents:true,
            
          },
          scrollbar:{
            el: '.swiper-scrollbar',
            hide: true, //滚动条是否自动隐藏。默认：false，不会自动隐藏。
            draggable: true, //该参数设置为true时允许拖动滚动条。
            snapOnRelease: true, //如果设置为false，释放滚动条时slide不会自动贴合
          }


        }
      },
      computed: {
        isloading(){
          return this.$store.state.isloading;
        },
        showRedPackage(){
          return this.$store.state.showRedPackage;
        } 
      },
    
      mounted(){
        if(navigator.onLine){   //有���络状态
          this.$store.commit("increatement"); 
          this.fetchInfo();
          
        }else{   //无网络状态
          this.noFetch=true;
          this.showMore=true;
            Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
        }
      },
      methods:{
        fetchInfo(){
          
        var that=this;
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
          
        axios({
                method: 'POST',
                url: domain+'/mobile/index.php?act=index&op=advDetail&goods_id='+that.$route.params.goodsId,
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
            Indicator.close();
            that.$store.commit("decrement");
            if(response!=undefined){
              if(response.data.code==200){
              var result=response.data.datas;
              console.log(result);
              that.infoUserName=result.storeDetail.seller_name;
              if(that.store_avatar==null){
                that.store_avatar=require('../../assets/mine.png');
              }else{
                that.store_avatar=result.storeDetail.store_avatar;
              }
              that.storeId=result.storeDetail.store_id;
              var times=result.goodsDetail.goods_addtime;
              times=new Date(times*1000);
              var hours=times.getHours()>=10?times.getHours():'0'+times.getHours();
              var minutes=times.getMinutes()>=10?times.getMinutes():'0'+times.getMinutes();
              times=times.getMonth()+1+"月"+times.getDate()+"日   "+ hours+":"+minutes;
              that.infoTime=times;
              that.infoContent=result.goodsDetail.goods_body;
              that.locationCity=result.goodsDetail.address_info;
              that.goods_image=result.goodsDetail.goods_image;
              that.goods_video=result.goodsDetail.goods_video;
              that.chat_id=result.chat_data.chat_id;  
              that.goods_image=that.goods_image.split(";");
              that.passwordTxt=result.env_content;
              if(result.goodsDetail.env_id==0){
                  that.envId=0;
              }else{
                that.envId=result.goodsDetail.env_id;
              }

              if(that.isCount==0){
                    if(result.tuijian.length!=0 && result.tuijian.length<15){
                    that.tuijianList=result.tuijian;
                    that.isMore=true;
                    that.showMore=true; //没有更多
                    that.haveMore = false;   
                    }else if(result.tuijian.length==0){
                      that.haveMore = false;
                      that.isMore=false;
                      that.noData=true;
                    }else{
                      that.tuijianList=that.tuijianList.concat(result.tuijian);
                      that.haveMore=true; //可以加载更多
                      that.isMore=true;
                      that.showMore=false;
                    } 
                  }else{ //加载第N页面
                      if(result.tuijian==undefined){
                      that.haveMore = false;
                      that.isMore=true;
                      that.showMore=true;
                      that.pageNum--
                    }else{
                      that.tuijianList=that.tuijianList.concat(result.tuijian);
                      that.haveMore=true; //可以加载更多
                      that.isMore=true;
                      that.showMore=false;
                    } 
                  }
            }else if(response.data.code=400){
                that.$store.commit("decrement");
                that.noData=true;
                  that.showMore=false;
            }
            }else{
              Indicator.close();
                  that.showMore=false;
                that.isMore=true;
                that.$store.commit("decrement");
                Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
            }

          },(err)=>{
                Indicator.close();
                  that.$store.commit("decrement");
                  $(".infoDetail").css('display','none');
                    Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
            });    

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
        togoDetail(storeId){  //点击用户头像，跳转商户详情
          this.$router.push({name:'merchantDetailPage',params:{storeId:storeId},query:{keys:this.tokens,isDetail:1}}); 
        },
        clickImg(e,imgList) {
            this.showImg=true;
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
        
          chat(){  //跳转原生���服界面
            if(this.tokens!='undefined' && this.tokens!="''"&& this.tokens!='""' && this.tokens!="null" && this.tokens!="(null)"){
              //跳转原生页面
              console.log(this.chat_id);
              if(this.root!=1){
                app.chatWithConversationId(this.chat_id,this.storeId,this.infoUserName,this.store_avatar);
              }else{
                Toast("没有开通聊天功能");
              }
            }else{
              Toast("您尚未登录，无法联系商户!");
            }
          },
          loadMore(){
            if(this.haveMore){
                  this.loading=true;
                  this.showMore=false;
                  this.isCount=1;
                  this.fetchInfo();
              }
      
          },
            loadFetch(){
              this.noFetch=false;
              if(navigator.onLine){   //有网络状态
                this.fetchInfo();
              }else{   //无网络状态
                  this.noFetch=true;
                  this.showMore=true;
                    Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
                }
            },
          getRedPackage(){  //获取利是
            var that=this;
            console.log(that.tokens);
            if(this.tokens!='undefined' && this.tokens!="''"&& this.tokens!='""' && this.tokens!="null" && this.tokens!="(null)"){
              that.$store.commit("increateShow");
            }else{
              Toast("您尚未登录，无法领取该利是!");
            }

          },
          goBack(){
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
    .merchantInfoPage{
      
    }
    .showPackage{
        width: 100%;
        height: auto;
        z-index: 999;
        position: absolute;
        top: 0px;
        bottom: 0px;
    }
    .infoContainer{
      font-size:1.4rem;
      width: 100%;
      margin:0 auto;
      margin-top:64px;
    }
    /*
    *信息详情
    */
    .infoDetail{
      text-align: left;
        height:auto;
      background-color:#fff;
      width:100%;
    }

    .info_header{
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        height: 6.4rem; 
    }
    .avatars{
        width: 44px;
        height:44px;
        margin-right:5px;
        background-size: contain;
        border-radius: 50%;
        overflow: hidden;
    }
    .avatars img{
    width:100%;
    height:100%;
    } 
    .infoName{
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        font-size: 1.4rem;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        word-wrap:normal;
        line-height: 1.6rem;
        vertical-align:middle;
    }
    .reds{
        border-radius: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        color:#FF5400;
    }
    .reds img{
        width: 1.8rem;
        height:1.8rem;
        background-size: contain;
        margin-right: 0.5rem;
    }
    .rightCell{
      margin-left:1rem;
    }
    .content{
    font-size: 1.4rem;
    line-height:2.4rem;
    width:80%;
    margin:0px auto;
    margin-left: 55px;
      
    }
    .Avatarcontent{
        line-height: 2.4rem;
        padding-left: 1rem;
        font-size: 14px;
        color:#333;
    }
    .locationInfos{
          display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        line-height: 3.6rem;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        text-align: left;
        margin-left: -4rem;
        font-family: PingFangSC-Regular;
        font-size:12px;
        color: #888888;
        letter-spacing: 0;
    }
    .locations img{
        width: 1.2rem;
        height: 1.2rem;
        margin-left: 4.5rem;
        margin-right: 0.5rem;
    }
    .imgList{
      width:95%;
      margin:0 auto;
      overflow:hidden;
    }
    .imgList img{
        width: 100%;
        height:100%;
        margin-bottom: 2rem;
        background-size:contain;
    }
    .infoTitle{
        color: #D0021B;
        text-align: center;
        margin-top: 3rem;
        font-size: 1.6rem;
    }
    .showViews{
      padding-left: 65px;
      padding-top:1rem;
      font-size: 1.4rem;
    }

    /*
    *推荐
    */
    .Recommend{
      width:95%;
      margin:0 auto;
        border-bottom: 1px solid #d9d9d9;
        font-size: 1.6rem;
        color: #333;
        position: relative;
        margin-top: 2rem;
        text-align: center
    } 
    .Recommend b{
        position: absolute;
        display: block;
        left: 40%;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        bottom: -1rem;
        letter-spacing: 4px;
        width: 7.5rem;
        background-color: #fff;
        z-index: 99;
    }


    /*
    *推荐列表
    */
    .shopItem{
        background-color: #fff;
        text-align: left;
        margin-top:3rem;
    }

    .shopItem li{
        width: 95%;
        height:auto;
        position: relative;
        margin-bottom:1.5rem;
        border-bottom:1px solid #d9d9d9;
    }
    .shopItem li:last-of-type{
      border-bottom:0px;
    }
    .listPub{
        font-size: 1.4rem;
        display: flex;
        align-items: center;
    }
    .listPub img{
        width: 44px; 
        height: 44px;
        border-radius: 50%;
        vertical-align: middle;
        background-size: contain;
    }
    .leftPub{
      display: flex;
      line-height: 2.8rem;
          display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
        display: -moz-box;     /* 老版本语法: Firefox (buggy) */
        display: -ms-flexbox;  /* 混合版本语法: IE 10 */
        display: -webkit-flex; /* 新版本语法: Chrome 21+ */
        display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
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

    .merchantNums span{
      padding-right: 1rem;
      color: #999999;
    }

    .rightPub{
        position: absolute;
        right: 0.5rem;
        top: 1rem;
        border:1px solid #ff8800;
        color:#ff8800;
        padding: 0px 5px;
        border-radius: 5px;
    }

    .listCont{

    }
    .contents{
        line-height: 2.4rem;
        margin-left: 5rem;
        margin-top: 2rem;
        margin-bottom: 2rem;
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
        flex-wrap: wrap;
        justify-content: start;
        -ms-flex-pack: distribute;
        margin-left:60px;
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
     .imgs  img{
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
       min-height:8rem;
    }
 .videos{
        padding: 5px;
        display: inline-block;
        overflow: hidden;
        height: 10rem;
    }
    .locationNums{
        margin-left: 60px;
        padding-bottom: 1rem;
        position: relative;
        word-break: break-all;
        display: block;
        width: 80%;
        font-family: PingFangSC-Regular;
        font-size: 1.2rem;
        color: #888888;
        letter-spacing: 0;

    }
    .locationNums span{
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 1.2rem;
      color: #888888;
      letter-spacing: 0;
    }
    .locationNums img{
        width: 18px;
        height: 10px;
        vertical-align: middle;
        margin-right: 0.5rem;
    }
    .locationInfo{
          display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        line-height:  4.8rem;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        text-align: left;
        margin-left: -4rem;
    }
    .chats{
        width: 6rem;
        height: 2.4rem;
        background-color: #ff8800;
        color: #fff;
        border-radius: 5px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        margin-right: 1rem;
    }
    .listBottom{
        width:80%;
        margin: 0px auto;
        padding-left: 4.5rem;

    }
    .rightlook{
      position: absolute;
      right: 10%;
      font-family: PingFangSC-Regular;
      font-size: 1.2rem;
      color: #888888;
      letter-spacing: 0;	
      
    }
    .showGoodViews{
      padding-left: 6rem;
      padding-top: 1rem;
      font-size: 1.4rem;
    }
    .videos{
        padding: 5px;
        display: inline-block;
        overflow: hidden;
        height: auto;
    }
    .playVideo{
      width:100%;
      height:100%;
    }
    /*加载中*/


    .loadings{
        font-size: 16px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        padding-top: 100px;
    }
    .loadings img{
      width: 100%;
        height: 100%;
    }

    /*
    *暂无数据
    */
    .noNull{
          display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
        display: -moz-box;     /* 老版本语法: Firefox (buggy) */
        display: -ms-flexbox;  /* 混合版本语法: IE 10 */
        display: -webkit-flex; /* 新版本语法: Chrome 21+ */
        display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
      background-color:#ffffff;
      justify-content:center;
      flex-direction: column;
      align-items:center;
      width:100%;
      padding-top:100px;
    }
    .noNull img{
      width: 15rem;
      height: 15rem;
      margin-top:30px;

    }
    .noNull p{
      padding-top:10px;
      font-size: 14px;
      color: #333333;
      line-height:48px;
    }

    /*
    *加载全部
    */
    .more_loading{
        height: 64px;
        line-height: 64px;
        border-bottom: 0px;
        align-items: center;
        border-bottom:0px none;
        display: flex;
    }
    .more_loading span{
      margin:0 auto;
        font-size: 1.4rem;
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

    .videoAll{
        margin: 10px;
        width: auto;
        max-width:95%;
        height: 20rem;
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
        margin-top: 6.5pt;
        padding-left: 4rem;

    }
    .bodyFont p{
      margin:1.6rem 0 0 0;
    }
    .bodyHeight{
    height:5000px;
    }
    .contentToggle{
    height:60px;
    line-height:55px;
    text-align: center;
    border-radius: 5px;
    margin-bottom:30px;
    }
    .listBottom{
      margin-bottom:20px;
    }
    .tops{
      position: fixed;
      bottom:30px;
      right:5px;
      z-index:98;

    }



    </style>

