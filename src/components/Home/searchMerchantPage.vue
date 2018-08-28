<template>
  <div class="searchMerchantPage">
  
  <header class="navHeader">
     <span class="leftIcon" @click="goback()"><img src="../../assets/left.png"/></span> 
     <div class="searchInput"><img class="searchIcon" src="../../assets/search.png"/><input type="search" v-model="keySearch" placeholder="请输入关键字" class="Inputvalue"/></div> 
     <span class="rightSearch" @click="fetchSearch">搜索</span>
   </header>
   <div style="padding-top:64px;"></div>
  <div v-show="!isloading">
    <div v-show="showSearch"  style="">
   <div v-if="!showValue" class="searchValue">
      <div v-if="searchCity.length!=0"><h3 class="searchTitle" >搜索历史</h3><img src="../../assets/delete.png" class="icons" @click="clearSearch"/></div>
    
      <ul class="searchs" v-if="searchCity.length!=0">
        <li v-for="(item,i) in searchCity" :key="i" @click="fetchList(item)">{{item}} </li>
     </ul>
   <!--暂无数据-->
         <div class="noList" v-else>
            <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
            <p>暂无搜索记录</p>   
         </div> 
   </div>

   <!--搜索有结果的时候-->
   <div v-else>
     <ul class="searchList"  v-if="results.length>0">
                    <li
                    v-for="(item,i) of results" :key="i" id="mtCell" @click="toMerchantDetail(item.store_id)"> 
                    <p class="avatarList"><img v-lazy="item.store_avatar==''?require('../../assets/noImg.png'):item.store_avatar" class="infoImage"  /></p>
                    <div class="SearchInfo">
                      <p class="merchantNames">{{item.seller_name==null?'未填写':item.seller_name}}</p> 
                      <p class="infos">活跃度：{{item.activity_num==null?0:item.activity_num}}</p>
                      <p class="contents">介绍：{{item.store_content==null?'未填写':item.store_content}}</p>
                    </div>
                  </li>
                  
                  
                  </ul>
      <div class="noList" v-else>
            <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
            <p>暂无符合条件记录</p>   
      </div> 

   </div>
    </div>
   </div>


  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast,Indicator,MessageBox} from 'mint-ui';
export default {
  name: 'searchMerchantPage',
  data () {
    return {
     keySearch:"", //关键字
     noData:false,
     searchCity:[], //搜索历史
     searchlist:[],
      results:[], //返回新的���表
     showValue:false,
     showList:[],
     isCount:0,
       pageNum:0,
      noMore:false,
      showMore:false,
      allLoaded: false,
       isMore:false,
      loading:false,
      finished:false,
      key:this.$route.query.key,
      showSearch:true,

    }
  },
  mounted() {
    //获取历史记录
    if(JSON.parse(localStorage.getItem('searchCity'))==null){
      this.searchCity=[];
    }else{
      this.searchCity=JSON.parse(localStorage.getItem('searchCity'));
    }
     var that=this;
     $(".Inputvalue").keydown(function(e){
        var keywd = e.target.value;
        if(event.keyCode == 13 && keywd) { 
            that.fetchSearch();
        } 
    });
  },

  computed:{
   isloading(){
      return this.$store.state.isloading;
    },
  },
  watch:{  //检测属性值的改变
    keySearch:function(newkeySearch){
      if(newkeySearch==""){
          this.showSearch=true; 
         this.showValue=false;
         if(JSON.parse(localStorage.getItem('searchCity'))==null){
          this.searchCity=[];
        }else{
          this.searchCity=JSON.parse(localStorage.getItem('searchCity'));
        }
      }
    },
  },
  methods:{
   
    fetchSearch(){  //搜索列表
      if(this.keySearch!=""){
        Indicator.open(); 
        this.showSearch=true;
        this.showValue=true; 
        this.$store.commit('increatement');  
        this.searchCity.push(this.keySearch);
          var  listData=[],isFlag; //数组去重
          for(var i=0;i<this.searchCity.length;i++){
            isFlag=false;
              if(this.searchCity[i]!=''){
                for(var j=0;j<listData.length;j++){
                  if(this.searchCity[i]==listData[j]){
                  isFlag=true;
                  break;
                  } 
              }
              if(!isFlag){
                listData.push(this.searchCity[i]);
              }
            }
          }
          this.searchCity=listData;
          localStorage.setItem('searchCity',JSON.stringify(listData));
          this.fetchList(this.keySearch);
      }else{
        return "";
      }    

    },
    fetchList(val){
      Indicator.open(); 
      this.showSearch=true;
       this.showValue=true; 
      
        this.$store.commit('increatement');  
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                     url:domain+'/mobile/index.php?act=index&op=searchGoods',
                   data:{
                    keyword:val
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
               if(response!=undefined){
                   if(response.data.code==200){
                    var results=response.data.datas;
                    that.results=results;
              }else if(response.data.code==400){
                  that.noData=true;
                  Toast(response.data.datas.error);
              }else{
                    Indicator.close();
                    Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
              }
               }else{
                  Indicator.close();
                   Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
               }
            },(err)=>{
              Indicator.close();
                 Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
            }); 
            that.keySearch=val;
    },
    goback(){
      var ua = navigator.userAgent.toLowerCase();
          if (/iphone|ipad|ipod/.test(ua)) {
            app.back();
          }else{
             this.$router.go(-1);
          }
    },
     toMerchantDetail(store_id){
       var domains = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
      location.href=domains+"#/merchantDetailPage/"+store_id+"?keys="+this.$route.query.keys+"&isDetail=1&dingweiCity="+this.dingweiCity;
    },
   clearSearch(){  //清空搜索记录
        MessageBox.confirm('','确定删除全部历史搜索?').then(action => {
          if (action == 'confirm') {
            window.localStorage.removeItem('searchCity');
            this.searchCity=[];
            this.showSearch=true;
          }else if(action=='cancel'){
            return false;
          }  
        });
    },
  
    goBack(){
      app.back();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul,li {
  list-style-type: none;
}
.searchMerchantPage{
  background-color:#fff;
  
}

.navHeader{
    background-color: #ff8800;
    width: 100%;
    height: 64px;
    text-align: left;
    font-size: 16px;
    display: -webkit-box;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
}
.leftIcon{
    width: 27px;
    height: 27px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 20px;
    vertical-align: middle;
    display: inline-block;
}
.rightIcon{
    width: 20px;
    height: 20px;
    vertical-align: middle;
    float: right;
    margin-top: 10px;
}
.leftIcon img{
     width: 27px;
    height: 27px;
}
.searchInput{
       display: inline-block;
    height: 36px;
    line-height: 36px;
    background-color: #fff;
    text-align: left;
    vertical-align: middle;
    color: #999;
    position: relative;
    -webkit-box-flex: 1.5;
    -ms-flex: 1.5;
    flex: 1.5;
    align-items: center;
    margin-top: 20px;
    border-radius:2px;
}
.searchInput img{
     width: 20px;
    height: 20px;
    margin-left: 10px;
    margin-right: 10px;
    vertical-align: middle;
}
.Inputvalue{
    width: 75%;
    border: 0 none;
     height: 30px;
    line-height: 30px;
    background: #fff;
    z-index: 1002;
    vertical-align: middle;
    text-align: left;
    font-size:14px;
}
.rightSearch{
     font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #fff;
    letter-spacing: 0.75px;
    margin-right: 10px;
    margin-left: 10px;
    margin-top: 20px;
}
/*
*搜索历史
*/
.searLocation{
    height: auto;
    text-align: left;
}
.searLocation li{
    height: 36px;
    line-height: 36px;
    font-family: PingFangSC-Regular;
    font-size: 1.2rem;
    color: #666666;
    letter-spacing: 0.7px;
    display: block;
    text-align: left;
    margin: 10px;
}
.icons{
    width: 20px;
    height: 20px;
    vertical-align: middle;
    padding: 10px;
    float: right;
}
.leftText{
    color: #666;
    vertical-align: middle;
}
.rightClose{
       width: 16px;
    height: 16px;
    float: right;
    margin-right: 10px;
    margin-top: 12px;
    vertical-align: middle;
}
.searchTitle{
      display: inline-block;
    font-size: 1.6rem;
    color: #333;
    padding-left: 10px;
    padding-top: 10px;
}
.searchValue{
  text-align:left;
}

/*
*空数据状态
*/
.noList{
    width: 100%;
    padding-top: 100px;
    display: block;
    text-align: center;
}
.noList img{
     width: 15rem;
    height: 15rem;
    height: auto;
    margin: 0 auto;
    padding-right: 10px;
}
.noList p{
  font-size:1.4rem;
  padding-top:20px;
   color:#666666
}

/*
*搜索结果
*/
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0} 
.clearfloat{zoom:1} 
.searchList{
  text-align: left;
  width:100%;
  display: block;
}

.searchList li{
    display: block;
    background-color: #fff;
    text-align: left;
    border-bottom: 1px solid #d9d9d9;
    height: auto;
}
..searchList li:last-of-type{
  border-bottom:0  none;
}
.infoImage{
    display: inline-block;
    min-width: 100%;
    min-height: 100%;
    height: auto;
    width: 100%;
}
.SearchInfo{
	    padding-top: 10px;
    padding-bottom: 10px;
    line-height: 20px;
    font-size: 1.4rem;
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
.contents{
	  color: #666666;
    height: 5.1rem;
    font-size: 1.4rem;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.avatarList{
    width: 8rem;
    height: 8rem;
    vertical-align: middle;
    float: left;
    overflow: hidden;
    margin: 10px;
    vertical-align: middle;
}
.infoImage{
    display: inline-block;
    min-width: 100%;
    min-height: 100%;
    height: auto;
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
*搜索历史记录
*/
.searchs{
     padding-top: 10px;
    width: 97%;
    margin: 0 auto;
    text-align: left;
}
.searchs li{
   width:auto;
   font-size:1.4rem;
   background-color: #eee;
   border-radius: 5px;
   padding:3px 5px ;
   color:#333;
   font-family: -webkit-pictograph;
   margin:8px;
   display: inline-block;
}

@media screen and (max-width:330px) {
    .merchantNames {
        width:56%;
    }
    .contents{

    }
}
@media only screen and (min-width: 330px) and (max-width:420px) {
    .merchantNames {
        width:60%;
    }
    .contents{

    }
}

</style>

