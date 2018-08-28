<template>
 <div class="StreetCity" id="City">
   <!--城市列表-->
      <header class="navHeaders" id="navHeaders">
     <span class="leftIcon" @click=" goBack"><img src="../../assets/left.png"  /></span> 
      <mt-search v-model="keySearch" cancel-text=""  placeholder="请输入城市/拼音" id="searchHeader">  </mt-search>
   </header>
   <div style="padding-top:64px;" class="isTop"></div>
        <!--、城市列表内容-->
          <div v-if="!noFetch" v-show="!isloading" style="position:relative">
        <!--、城市列表内容-->
        <div class="listContent">
          <div class="hotCity" id="userHot" v-show="isSearch">
             <h3>定位城市</h3>
             <ul class="hotClass">
               <li  @click="getDingwei($event)"><img src="../../assets/dingwei.png" class="dingwei"/>{{dingweiCity==undefined?'未定位':dingweiCity.length>=5?dingweiCity.slice(0,4)+'...':dingweiCity}}</li>
            </ul>   
          </div> 
          <!--热门城市的选择-->
           <div class="hotCity" id="userHot" v-show="isSearch" v-if="useList.length>0" >
             <h3>常用</h3>
             <ul class="hotClass">
               <li v-for="(list,i ) of useList" :key="i" v-if="i<9" @click="getList(list)">{{list}}</li>
            </ul>   
          </div>  
          <div class="hotCity" id="hotCity" v-show="isSearch">
             <h3>热门城市</h3>
            <ul class="hotClass">
                <li @click="getLocation(hot)" v-for="(hot,i) in hotCity" >{{hot}}</li>
            </ul> 
          </div>
         
          <div id="showCityContent" v-show="noshowCity">抱歉,未找到相关位置，可尝试修改重试</div>
          <div v-for="item in showCity" class="letter-item" >
            <div ><a :id="item.letter" v-if="showLetter">{{item.letter}}</a></div>
            <div v-for="i in item.useListsst" @click="getList(i)">{{i}} </div>
          </div>
        
          
        <div id="tip">
          {{tipString}}
      </div>
      
        <aside class="letter-aside" id="aslides" v-show="isSearch">
          <ul>
            <li @click="navHot('热门')" > 热门</li>
            <li v-for="item in showCity" @click="naver(item.letter)">{{item.letter}} </li>
          </ul>
        </aside>
     </div>
     </div>
     </div>
          
          



 </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import pyfl from 'pyfl';  //引入拼音转化首个字母插件


let useListssts=[];       //定义城称数组
let cityNames=[];       //定义城市名称组件   
let cityNamesFilter=[]; //筛选城市名称的数组
let letter=[];          //定义显示文本数组
let countPage=0;        //定义统计页  
let tipLetter='';       //放大展示文本
let keySearch ="";
let showCity=[];       //城市显示数组
let showuseListsst=[];   //显示城市列表
let  showCityTemp="";  //显示城市字体 
let hotCity=["全国","北京","广州","上海","杭州","深圳",'佛山','重庆',"成都","东莞","中山","厦门"];       //热门城市   
export default {
  name: 'StreetCity',
  mounted(){
     if(window.localStorage.getItem('useLists')==null){
        this.useList=[];
     }else{
       this.useList=JSON.parse(window.localStorage.getItem('useLists')); 
       
     }
    var that=this;
     that.gc_id=that.$route.query.gc_id;
    countPage++;
    if(countPage<2){
       var domain = process.env.NODE_ENV == 'development' ?'http://' + window.location.host: 'http://tongcheng.intexh.com/wap/dist' ;
        axios({
            method: 'get',
            url: domain+'/static/city.json',
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
           if(response.status==200){
             let useListsst=response.data.provinces,i=0,j=0; //省份
            for(let i in useListsst){
              useListssts=useListsst[i].citys;  //获取城市数组
              for(let j in useListssts){
                  cityNames.push(useListssts[j].citysName);   //获取城市名称
              }
            }
            cityNamesFilter=cityNames; //获取到筛选后的城市名称
            that.cityFilter(that.keySearch, "all") //调用城市筛选的方法
           }
          },(err)=>{
            Toast("网络加载出错，请稍后重试！");
          });
            var u = navigator.userAgent, app = navigator.appVersion;
          var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
          var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
          if(isiOS){
            document.getElementById("navHeaders").classList.add("fixeds");
          }
    }

    
    
  },
  created(){
     //滚动到相应的位置
   window.scrollTo(0,0);
  },
  computed: {
    isloading(){
      return this.$store.state.isloading;
    },

  },
  
  methods:{
     buildLetter(){ //构建字母项,26个字母表排序
      letter = [];
      for (let i = 0; i < 26; i++) {
          let obj = {};
          obj.letter = String.fromCharCode((65 + i));
          obj.useListsst =[];
          letter.push(obj);
      }
     },   
      getFirstLetter(str){  //得到城市第一个首字母
        return pyfl(str);
      },
      buildItem(cityNamesFilter){ //构建城市名称
       this.buildLetter()
        let _this = this
        for (let i = 0; i < 26; i++) {
          letter[i].useListsst = []
        }
        for (let i = 0; i < cityNamesFilter.length; i++) {
          var indexs=Number(_this.getFirstLetter(cityNamesFilter[i]).charCodeAt()-65);
       
          if (indexs >= 0 && indexs < 26) {
            letter[indexs].useListsst.push(cityNamesFilter[i]);
            
          }
        }
        // 如果letter中useListsst中没有值的话，过滤这一项
        showCity = showCityTemp = letter.filter(function (value) {
          let len = value.useListsst.length;
          return len >=0
        })
      },
      naver(id){ //点击右边字母滚动
       var that=this;
        that.tipString=id;
        let obj = document.getElementById(id)
        let tip = document.getElementById('tip');
        tip.style.display="block";
        tip.setAttribute('class','tipAppear');
        setTimeout(()=>{
          tip.removeAttribute('class');
          tip.style.display="none";
        },500);
        let oPos=obj.offsetTop;
        return window.scrollTo(0,oPos-36);

      },
       cityFilter:function(city){  //城市的搜索筛选
         let showuseListsstTemp
        this.buildItem(cityNamesFilter)
        showCity = showCityTemp
        showCity = showCity.filter(function (value) {
          showuseListsst = value.useListsst
          showuseListsstTemp = showuseListsst.filter(function (val) {
            return (val.indexOf(city) > -1)
          })
          value.useListsst = showuseListsstTemp
          return value.useListsst.length >0
        })
          this.showCity=showCity;
         if(showCity.length==0){
            this.noshowCity=true;
            this.isSearch=false;
          }
      },
      navHot(id){  //热门
        var that=this;
        that.tipString=id;
        let obj = document.getElementById(id)
        let tip = document.getElementById('tip');
        tip.style.display="block"; 
        tip.setAttribute('class','tipAppear');
        setTimeout(()=>{
          tip.removeAttribute('class');
           tip.style.display="none";
        },500);
        window.scrollTo(0,42);
      },
      getLocation(val){   //获取热门地址
         if(val!="全国"){
          val=val+"市"
          if(this.$route.query.falg==1){
          this.$router.push({name:'streetscapePage',params:{gc_id:this.gc_id,getCity:this.$route.query.citys},query:{keys:this.$route.query.keys,falg:this.$route.query.falg,isCity:1,getCity:val,dingweiCity:this.dingweiCity}});
              
          }else{
            this.$router.push({name:'streetscapePage',params:{gc_id:this.gc_id,getCity:this.$route.query.citys},query:{keys:this.$route.query.keys,isCity:1,getCity:val,dingweiCity:this.dingweiCity}});
          } 
          this.useList.unshift(val);
          var listData=[];
          listData=Array.from(new Set(this.useList));
         this.useList=listData;
           if(this.useList.length>9){
             this.useList=listData.slice(0,9)
          }
          localStorage.setItem('useLists',JSON.stringify(this.useList));
            }else{
             this.$router.push({name:'streetscapePage',params:{gc_id:this.gc_id,getCity:this.$route.query.citys},query:{keys:this.$route.query.keys,isCity:1,getCity:val,dingweiCity:this.dingweiCity}});
         
            }
        
      },
      getList(i){ //获取城市的选择
        if(this.$route.query.falg==1){
         this.$router.push({name:'streetscapePage',params:{gc_id:this.gc_id,getCity:this.$route.query.citys},query:{falg:this.$route.query.falg,isCity:1,getCity:i,keys:this.$route.query.keys,dingweiCity:this.dingweiCity},});
           	
        }else{
        	 this.$router.push({name:'streetscapePage',params:{gc_id:this.gc_id,getCity:this.$route.query.citys,},query:{isCity:1,getCity:i,keys:this.$route.query.keys,dingweiCity:this.dingweiCity}});
        }
        this.useList.unshift(i);
          var listData=[];
          listData=Array.from(new Set(this.useList));
         this.useList=listData;
           if(this.useList.length>9){
             this.useList=listData.slice(0,9)
          }
          localStorage.setItem('useLists',JSON.stringify(this.useList));
      },
      getDingwei(){
           this.$router.push({name:'streetscapePage',params:{gc_id:this.gc_id,getCity:this.$route.query.citys},query:{falg:this.$route.query.falg,isCity:1,
           keys:this.$route.query.keys,
           getCity:this.dingweiCity,dingweiCity:this.dingweiCity}});      
           this.useList.unshift(this.dingweiCity);
          var listData=[];
          listData=Array.from(new Set(this.useList));
         this.useList=listData;
           if(this.useList.length>9){
             this.useList=listData.slice(0,9)
          }
          localStorage.setItem('useLists',JSON.stringify(this.useList));
          
      },
      goBack(){
         this.$router.go(-1);
      }
  

   },
   data () {
    return {
       cityNames:cityNamesFilter,
       letter:letter,
       tipString:tipLetter,
       keySearch:keySearch, 
       showCity:showCity,
       hotCity:hotCity,
       showLetter:true,
       gc_id:null,
        noFetch:false,
       isSearch:true,
       noshowCity:false,
       dingweiCity:this.$route.query.dingweiCity,
        useList:'', //常用功能 
    }
  },
  watch:{  //检测属性值的改变
   keySearch:function(newkeySearch){
      if(newkeySearch!=""){
           this.isSearch=false;
            this.showLetter=false;
            this.noshowCity=false;
           this.cityFilter(newkeySearch);
      }else{
           this.showLetter=true;
           this.isSearch=true;
           this.noshowCity=false;
           this.cityFilter(newkeySearch);
      }
    },
  },

}        





</script>


<style scope>
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

.navHeaders{
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
    position: fixed;
    z-index: 2000;
}
.leftIcon{
    width: 27px;
    height: 27px;
    margin-right: 5px;
    vertical-align: middle;
    display: inline-block;
     margin-top:20px;
}

/*
*搜索
*/
#searchHeader{
    display: flex;
    background-color: #ff8800;
    height: 30px;
    line-height:30px;
    width: 90%;
     margin-top:20px;
}
.mint-searchbar{
  width: 100% ;
}
.mint-searchbar-inner{
  
  border-radius:5px;
}
.listContent{
  position:relative;
  background-color:#fff;
  overflow:scroll !important;
}
/*城市地址*/
#City {
    position: relative;
    height: 100%;
}
.letter-item{
  text-align:left;
}
 .letter-item >div:first-child{
  font-size: 16px;
  line-height: 2em;
  background: #f4f4f4;
  padding-left:5%;
  color: #666666;
}
.letter-item >div{
  padding-right: 10%;
  padding-left: 8%;
  border-bottom: 1px solid #D9D9D9;
  line-height:48px;
  font-size:14px;
}
.letter-aside {
    position: fixed;
    right: 10px;
    bottom: 0px;
    top: 0px;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
}   
 .letter-aside ul{
     display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    font-size: 14px;
    color: #ff8800;
    line-height: 40px;
    font-weight: bold;
    overflow: scroll;
     margin-top:64px;
 }
 
#tip {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: #333;
    width: 100px;
    height: 100px;
    z-index: 999;
    text-align: center;
    line-height: 100px;
    font-size: 50px;
    color: #fff;
    opacity: 0;
    display: none;
  }
  .tipAppear {
    animation: appearTip 1 linear 0.5s;
  }
  @keyframes appearTip {
    0% {
      opacity: 1;
    }
    80% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
    }
  }
.search-city {
    text-align: center;
    padding: 5px 0;
}
.search-city input{
      line-height: 24px;
      border-radius: 5px;
      outline: none;
}
.tipShow {
    text-align: center;
    line-height: 60px;
    font-size: 16px;
    color: #ffffff;
}

/*
*未查找地址
*/
#showCityContent{
 background-color:#f4f4f4;
 line-height:36px;
}

/*
*热门城市
*/
.hotCity{
   text-align:left;
}
.hotCity h3{
   font-size:16px;
   color:#666;
   padding-left:8%;
   line-height: 48px;
}
.hotClass{
    width: 85%;
    display: inline-block;
    
    font-size: 14px;

}

.hotClass li{
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    line-height: 28px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 10px;
    float: left;
    width: 25%;
}
.dingwei{
    width: 24px;
    height: 22px;

}
.fixeds{
  position:absolute !important;
  z-index:2000;
}
</style>



