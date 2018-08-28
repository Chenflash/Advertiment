<template>
  <div class="abountMerchantPage">
       <mt-header title="商户介绍">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goback"></mt-button>
        </router-link>
        <mt-button  slot="right" >
        </mt-button>
        </mt-header>
      <!--有网络-->
       <div v-if="!noFetch"  v-show="!isloading">
       <div class="abountContainer">
         <div class="listHeader">
            <span class="avatars"><img :src="store_avatar==null?require('../../assets/mine.png'):store_avatar" :onerror="loadImg"/></span>
            <div class="leftHeader">
              <p class="merchantName">{{seller_name}}</p>
              <p class="merchantNums"><span>活跃度 {{activity_num==null?'0':activity_num}}</span><span>发布数 {{examine_num==null?'0':examine_num}}</span> </p> 
            </div>
          </div> 
          <ul class="infos">
            <li><span class="leftCell">所在城区</span><span class="rightCell">{{province}}{{city}}</span></li>
            <li><span class="leftCell">所在行业</span><span class="rightCell" style="line-height:18px;">
            <span v-for="(list,i) of gcName" :key="i" v-if="list.gc_name!=null" style="flex: 0.3; display: inline-block;">{{list.gc_name}}  &nbsp;&nbsp;</span>
          </span></li>
            <li><span class="leftCell">详细地址</span><span class="rightCell">{{area==null?'未填写':area}}</span></li>  
            <li><span class="leftCell">联系电话</span><span class="rightCell" @click="toCall">{{store_phone}}</span></li>
            <div class="info"><span class="leftCell">经营介绍</span>
            <p >{{store_content}} </p>
            
            </div>

          </ul>

       </div>


       </div>  
   
      
      


  </div>
</template>
<script>
     
</script>
<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast,Indicator} from 'mint-ui';
import userPhoto  from '../../assets/mine.png';

export default {
  name: 'abountMerchantPage',
  data () {
    return {
       loadImg:'this.src="' + userPhoto + '"',
      store_avatar:null,
      seller_name:null,
      activity_num:null,
      examine_num:null,
      gcName:null,
      province:'',
      city:'',     
      area:'',
      store_phone:'',
      store_content:'',
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
        Indicator.open("加载中...");
      	this.$store.commit("increatement"); 
        this.fetchAbout();
    }else{   //无网络状态
       this.noFetch=true;
        Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
    }
  },
  methods:{
     fetchAbout(){
     var that=this;
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      
      axios({
              method: 'Post',
              url:domain+'/mobile/index.php?act=index&op=storeBusiness&store_id='+that.$route.params.storeId,
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
            if(response!=undefined){
              if(response.data.code==200){
           var result=response.data.datas;
           that.store_avatar=result.store_avatar;
           that.seller_name=result.seller_name;
           that.activity_num=result.activity_num;
           that.examine_num=result.examine_num;
           that.province=result.province;
           that.city=result.city;
           that.area=result.area;
           that.gcName=result.class_name;
           if(result.is_phone==1){
             that.store_phone=result.store_phone.replace(result.store_phone.slice(3,11),"********用户未公开");
           }else if(result.is_phone==0){
              that.store_phone=result.store_phone;
           }
           that.store_content=result.store_content;

         }else{
            Indicator.close();
           Toast("发生网络错误，请稍后重试");
         }
         }else{
           Indicator.close();
           Toast("发生网络错误，请稍后重试");
         }

      });
     },
      goback(){
        this.$router.go(-1);
      },
      toCall(){  //调用原生电话方法
         app.call(this.store_phone);
      },
       loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
          this.$store.commit("increatement");
           this.fetchAbout();
         }else{   //无网络状态
            this.noFetch=true;
               Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
          }
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
  margin: 0 10px;
}
.abountMerchantPage{
}
.abountContainer{
   background-color:#f2f2f2;
   padding-top:64px;
  
}

/*
*头部内容
*/
.listHeader{
    display: flex;
    align-items: center;
    height: 70px;
    padding-left: 10px;
    font-size: 14px;
    margin-bottom:10px;
    background-color:#ffffff;
}
.leftHeader{
    display: flex;
    padding-left: 10px;
    flex-direction: column;
    text-align: left;
    line-height: 28px;
}
.avatars{
    width: 48px;
    height: 48px;
    background-size: contain;
    border-radius: 50%;
    overflow: hidden;
}
.avatars img{
  width:100%;
  height:100%;
}

.merchantNums span{
    padding-right: 30px;
    color: #999999;
}

/*
*介绍内容
*/
.infos{
  background-color:#fff;
  height:auto;
  font-size:14px;
}

.infos .leftCell{
  flex: 0.25;
  text-align: left;
}
.leftCols{
  flex: 0.35;
  text-align: left;
}
.rightCols{
   color: #666666;
    text-align: left;
    height: auto;
    flex: 0.65;
    display:inline-block;
}
.infos .rightCell{
    color: #666666;
    text-align: left;
    height: auto;
    flex: 0.75;
}

.infos li{
  border-bottom:1px solid #d9d9d9;
  min-height:48px;
  height: auto;
    display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
  align-items:center;
}
.info{
    text-align: left;
}
.info span{
      display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
  margin-left: 10px;
  margin-top:10px;
}
.info p{
    color: #666666;
    padding-top: 20px;
    line-height: 24px;
    width:90%;
    margin:0px auto;
  
}
/*加载中*/


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

.merchantName{
      width: 96%;
    margin-top: 10px;
    line-height: 18px;
}

</style>

