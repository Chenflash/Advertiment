<template>
  <div class="merchantLevelPage">
      <header  class="mint-header">
       <div class="mint-header-button is-left"  @click="toBack()">
       <a  href="javascript:;" class="router-link-active">
       <button  class="mint-button mint-button--default mint-button--normal">
       <span class="mint-button-icon"><i class="mintui mintui-back"></i></span> 
       <label class="mint-button-text"></label>
       </button></a>
       </div> 
       <h1 class="mint-header-title">全部分类</h1>
        <div class="mint-header-button is-right">
        <button  class="mint-button mint-button--default mint-button--normal" @click="openSerach"><!---->
          <img src="../../assets/searchs.png" class="screenMap"/>
         </button>
         </div>
         </header>
          
       <!--在网络的情况下--> 
       <div v-if="!noFetch" v-show="!isloading">
       	  
       	 <!--全部分类--> 
         <div class="grade-eject" >
           <!--一级分类-->
            <ul class="grade-w gradesClass" id="gradew">
                <p @click="grade1(adverts.gc_id,$event)" v-for="(adverts,i) in advertList" >{{adverts.gc_name}}<span class="textName"></span></p>
            </ul>
            <!--二级分类-->
            <ul class="grade-t" id="gradet">
                <p @click="gradet(list.gc_id,list.gc_name,$event)" v-for="(list,i) in advertData" ><span  class="textName">{{list.gc_name}}</span></p>
            </ul>
            <!--三级分类-->
            <ul class="grade-s " id="grades">
                <p  v-if="getgcName!=''" @click="toSeleted(getgcId)"><span  class="textName">{{getgcName}}</span></p>       
               <p @click="grades(listItem.gc_id)" v-for="(listItem,i) in listData"><span  class="textName">{{listItem.gc_name}}</span></p>      
                                   
            </ul>

        </div>
    
       </div>
       
      

          

  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast,Indicator } from 'mint-ui';
export default {
  name: 'merchantLevelPage',
  data () {
    return {
        //广告全部分类页面
        advertList:[],
        advertData:[], //二级分类
        listData:[], //三级分类
        noshow:true,
        noFetch:false,
        getgcId:'',
        getgcName:'', //定义获取的分类内容
    
     }
  },
   computed: {
    isloading(){
      return this.$store.state.isloading;
    }
  },
  mounted(){
      if(navigator.onLine){   //有网络状态
         Indicator.open("加载中");
      	this.$store.commit("increatement"); 
        this.fetchLevel();
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
    }
  },
  methods:{
  	fetchLevel(){
  		var that=this;
     var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       
      axios({
            method: 'Post',
            url:domain+ '/mobile/index.php?act=index&op=goodsClassList',
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
             that.advertList=result;
           
         }else{
           that.noFetch=true;  
           Toast("发生网络错误，请稍后重试！");
         } 
         }else{
             Indicator.close(); 
            that.$store.commit("decrement");
            Toast("发生网络错误，请稍后重试！");
         }

      },(err)=>{
          Indicator.close(); 
          that.$store.commit("decrement");
           Toast({message:'网络连接断开,请检查网络设置',position: 'center',duration: 1500})
      });
  	},
    openSerach(){
      this.$router.replace({name:'levelSearchPage',query:{keys:this.$route.query.keys,getCity:this.$route.query.getCity,
      gc_id:this.$route.query.gc_id,dingweiCity:this.$route.query.dingweiCity,isSelected:this.$route.query.isSelected}});
    },
    //一级分类的点击获取
    grade1(gId,event){
      Indicator.open("加载中...");  
        if(event.target.nodeName=="P"){
              for(var i=0;i<event.target.parentNode.children.length;i++){
                  if(event.target.parentNode.children[i].className=='active'){
                      event.target.parentNode.children[i].className='';
                      break;
                  }
              }
               $(event.target).addClass('active');
            }else if(event.target.nodeName=="SPAN"){
                for(var i=0;i<event.target.parentNode.parentNode.children.length;i++){
                  if(event.target.parentNode.parentNodechildren[i].className=='active'){
                      event.target.parentNode.parentNode.children[i].className='';
                      break;
                  }
              }
                $(event.target.parentNode).addClass('active');
               
        }

         for(let key of this.advertList){
           if(key.gc_id==gId){
               var that=this;
               var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      
                axios({
                    method: 'Post',
                    url: domain+'/mobile/index.php?act=index&op=towGoodsClassList&gc_id='+key.gc_id,
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
                           that.advertData=response.data.datas.goodsClassList;
                           $('html, body').animate({scrollTop: 0}, 200);
                           if(that.advertData.length==0){
                               Toast("当前没有下级分类");  
                             }

                        }else{
                          Toast(response.data.datas.error);
                        }
                        }else{
                            Indicator.close(); 
                            that.$store.commit("decrement");
                            Toast("发生网络错误，请稍后重试！");
                        }

                    });
            }
         }
         $(".grade-t").css("left","31.48%");
         $(".grade-s").css("display","none");
    },
    //监听二级分类界面
    gradet(gId,gName){
       Indicator.open("加载中...");
         if(event.target.nodeName=="P"){
              for(var i=0;i<event.target.parentNode.children.length;i++){
                  if(event.target.parentNode.children[i].className=='active'){
                      event.target.parentNode.children[i].className='';
                      break;
                  }
              }
               $(event.target).addClass('active');
                $(".grade-s").css("display","none");
            }else if(event.target.nodeName=="SPAN"){
                for(var i=0;i<event.target.parentNode.parentNode.children.length;i++){
                  if(event.target.parentNode.parentNode.children[i].className=='active'){
                      event.target.parentNode.parentNode.children[i].className='';
                      break;
                  }
              }
                $(event.target.parentNode).addClass('active');
                 $(".grade-s").css("display","none");
        }

         for(let key of this.advertData){
           if(key.gc_id===gId){
               var that=this;
               var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
               
                axios({
                    method: 'Post',
                    url: domain+'/mobile/index.php?act=index&op=towGoodsClassList&gc_id='+key.gc_id,
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
                           that.getgcId=gId;
                        that.getgcName=gName;
                        if(response.data.code==200){
                             that.listData=response.data.datas.goodsClassList;
                              $('html, body').animate({scrollTop: 0}, 200);
                             if(that.listData.length==0){
                                 that.$router.push({name:'merchantClassPage',params:{gc_id:gId,getCity:'全国'},query:{keys:that.$route.query.keys,dingweiCity:that.$route.query.dingweiCity}});  
                             }
                            
                        }else{
                         Toast(response.data.datas.error);
                        } 
                        }else{
                            Indicator.close(); 
                            that.$store.commit("decrement");
                            Toast("发生网络错误，请稍后重试！");      
                        }

                    });
           }

         }
        $(".grade-s").css("display","block");
        $(".grade-s").css("left","60.94%"); 

    },
    toSeleted(getgcId,getgcName){ //点击三级分类选择
       var that=this;
        that.$router.push({name:'merchantClassPage',params:{gc_id:getgcId,getCity:'全国'},query:{keys:that.$route.query.keys,dingweiCity:this.$route.query.dingweiCity}});  
    },
    
    //监听三级分类页面的获取
    grades(gId){
      var arr=document.getElementById("grades").getElementsByTagName("li");
      if(event.target.nodeName=="P"){
            $(".grade-s>p").css("backgroundColor","#fff");  
            event.target.style.background="#eee";  
         }else if(event.target.nodeName=="SPAN"){
           $(".grade-s>p").css("backgroundColor","#fff");   
           event.target.parentNode.style.background="#eee"; 
         }
        this.$router.push({name:'merchantClassPage',params:{gc_id:gId,getCity:'全国'},query:{keys:this.$route.query.keys,dingweiCity:this.$route.query.dingweiCity}});   
         
    },
    toBack(){
        window.location.href="#/merchantClassPage/"+this.$route.query.gc_id+'/'+this.$route.query.getCity+'?keys='+this.$route.query.keys
          +"&isSelected="+this.$route.query.isSelected+"&dingweiCity="+this.$route.query.dingweiCity;
    },
    loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
          this.$store.commit("increatement");
           this.fetchLevel();
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
body{
 background-color:#fff;
}
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
*搜索
*/
.screenMap{
   width: 24px;
    height: 26px;
    margin-right: 10px;
}

/*
*广告分类
*/
/* grade */
#gradew{
    width: 33.2%;
    height: auto;
    background-color:#eee;
 }
 .gradesClass{
    margin-left: -10px;
 }
 .gradesClass p{
    padding-left: 20px;
    position: relative;
    height:48px;
    font-size: 1.4rem;
    line-height: 48px;
    text-align: left;
    border-bottom: 0.5px solid #D9D9D9;
 }
 #gradet{
    left: 32.3%; 
    width: 32.3%;
    
 }
 .grade-eject{
     padding-top: 64px;
 }
 #gradet p{
    padding-left: 15px;
    position: relative;
     height:48px;
    line-height: 48px;
    text-align: left;
 }
 .grade-eject>ul.grade-w,.Category-eject>ul.Category-w{
    background: #ffffff;
    position: absolute;
    z-index: 2;
}
.grade-eject>ul.grade-t,.Category-eject>ul.Category-t{
    background: #ffffff;
    position: absolute;
    z-index: 2;
    left: 100%;
}
.leftArrow{
    width: 12px;
    height: 14px;
    position: absolute;
    right: 5px;
    top: 35%;
}
#grades{
    left: 60.94%;
    z-index: 3;
    width: 128px;
    position: absolute;
    height: auto;
}
#grades p{
    padding-left: 20px;
    position: relative;
     height:48px;
    line-height: 48px;
    text-align: left;
}

/*禁止点击*/
.disableds{
     pointer-events: none;
     cursor: default;
     background-color:#eee;
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

.active{
    background-color: #fff;
    color:#ff8800;
    border-right:0px none;
}
.textName{
    font-size: 1.4rem;
}
</style>

