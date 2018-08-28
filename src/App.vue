<template>
  <div id="app" v-if="showContent">	
   <!--不缓存-->
   <!--不缓存-->
   <keep-alive>
      <router-view v-if="$route.meta.keepAlive" ></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

  </div>
</template>

<script>
import store from './VueX/store'
import {mapState,mapGetters,mapActions,mapMutations}from'vuex' 
import 'normalize.css'
import axios from 'axios'

export default {
  name: 'App',
  computed:{
   
  },
 
  data(){
    return{
      isRouterAlive:true, //刷新
      showContent:false,
    }
  },
   provide(){
    return{
      reload:this.reload
    }
   },
   methods:{
     reload(){
      this.isRouterAlive=false;
      this.$nextTick(function(){
        this.isRouterAlive=true;
          
      })
    }
   }, 
  computed: {
    mykey() {
        return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
    }
   }, 
  created(){
    this.activeDate=new Date();
  	setTimeout(() => {
            this.showContent = true;
    }, 0);
   
    
  } 	
}


</script>

<style>

*{ 
  margin:0px;
  padding:0px; 
    
}

html,body{
  font-size:10px;
}


input,button,select,textarea{ outline:none;}
*:not(input,textarea) {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
} 
textarea{resize:none}
ol,ul,li{
	list-style: none;
}
	[v-cloak] {
			  display: none;
			}
 img:not([src]){opacity:0;}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
iframe{
  display: none !important;
}
body > iframe{  /*用于屏蔽广告信息*/
	opacity:0;
	display:none;
}
div#last-div ~ div {
	display: none; 
	opacity:0;
}
input{ 
-webkit-appearance: none;   /*兼容ios的内影效果*/
-webkit-tap-highlight-color:rgba(0,0,0,0);
}
textarea{ 
-webkit-appearance: none;   /*兼容ios的内影效果*/
-webkit-tap-highlight-color:rgba(0,0,0,0);
}
button{
  -webkit-appearance: none;   /*兼容ios的内影效果*/
  -webkit-tap-highlight-color:rgba(0,0,0,0);
}
img{
  background-size:cover;
  vertical-align:middle;
}

.mint-header{
    background-color: #ff8800 !important;
    font-size: 18px !important;
    height: 64px !important;
    line-height: 64px !important;
    width: 100%;
    padding-top: 10px !important;
    position: fixed !important;
    z-index: 999;
    text-align:center;
    
}
.mintui{
  font-size:18px !important;; 
}
.mint-header-title{
  font-size:18px;
  z-index:999;
}
.mint-cell-title{
  position:absolute !important;
  left:20px !important;
  
}

.mint-searchbar-core{
  padding-left:10px;
  font-size: 14px !important;
}
.mint-searchbar-inner{
  padding:0px !important;
  
}
.mint-searchbar-inner .mintui-search{
  font-size:16px;
}
.mint-searchbar{
  font-size: 16px !important;
  width: 95% !important;
  background-color:#ffffff !important;
  border: 1px solid #dfdfdf !important;
  
}

.mint-tab-container-wrap{
  margin:0px !important;
}
.mint-searchbar-cancel{
  color:#ff8800 !important;
}
.mint-search-list{
  padding-top:20px;
  top:80px;
 overflow:visible !important;
}
.mint-tab-container-wrap{
  margin: 0px 20px 0px 0px;
}
.mint-spinner-snake{
  display: inline-block !important;
  vertical-align: middle !important;
}
img[src='']{
    visibility: hidden !important;
}
.showImgs{
   position: fixed;
    z-index: 1200;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.92);
    width: 100%;
    height: 100%;
    
}

/*
*确认框
*/
.mint-msgbox-title{
    color: #ff8800;
    padding: 20px 10px !important;
}
.mint-msgbox-cancel{
  background: #f4f4f4 !important;
  border-right:0 none !important;

}
.mint-msgbox-confirm{
  background:#ff8800 !important;
  color:#fff !important;  
}

/*
*滚动刷新
*/
.loading-background, .mint-loadmore-top span {
    -webkit-transition: .2s linear;
    transition: .2s linear
}
.mint-loadmore-top span {
    display: inline-block;
    vertical-align: middle
}

.mint-loadmore-top span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
}

.page-loadmore .mint-spinner {
    display: inline-block;
    vertical-align: middle
}

.page-loadmore-desc {
    text-align: center;
    color: #666;
    padding-bottom: 5px
}

.page-loadmore-desc:last-of-type,
.page-loadmore-listitem {
    border-bottom: 1px solid #eee
}

.page-loadmore-listitem {
    height: 50px;
    line-height: 50px;
    text-align: center
}

.page-loadmore-listitem:first-child {
    border-top: 1px solid #eee
}

.page-loadmore-wrapper {
    overflow: scroll;
    background-color:rgba(255,255,255,0.8) !important;
}

.mint-loadmore-bottom span {
    display: inline-block;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle
}

.mint-loadmore-bottom span.is-rotate {
   
}

.more_loading{
  width: 100%;
  display: flex;     display:-webkit-box;     display:-webkit-flex;     display:-ms-flexbox;
  justify-content: center;
  font-size: 1.4rem;
}
/*图片赖加载*/
image[lazy=loading] {
  width: 40px;
  height: 300px;
  margin: auto;
}
.loadings{
    height: 100vh;
    padding-top:100px;
    font-size: 16px;
    display: flex ;
    justify-content: center;
    background-color: #fff;
}
.loadings span{
  padding-left:10px;
}

/*
*暂无数据
*/

/*
*暂无数据
*/
.noNull{
  display: block !important;
  text-align: center !important;
  margin-bottom: 50px;

}
.noNull img{
    width: 15rem;
    height: 15rem;
    margin-top:50px;
}
.noNull p{
  padding-left: 10px;
  padding-top: 10px;
  font-size: 14px;
  color: #999999;
}

.noMore{
    display: block !important;
    text-align: center !important;
    margin-top: 30px;
    margin-bottom: 30px;
    width: 90%;
    margin: 0px auto;
}
.textloading{
     width: 100%;
    text-align: center !important;
    margin-bottom: 50px !important;
    color: #333;
    height: 36px;
    display: flex; 
    display:-webkit-box;
    display:-webkit-flex;
    display:-ms-flexbox;
    justify-content: center;
    font-size: 1.4rem;
    justify-content: center;
    margin-top: 30px !important;
}
.textloading img{
  width:2.4rem !important;
  height:2.4rem !important;
}

/*网络状态*/
.noFetch{
    height: 100vh;
    color: #999999;
    font-size: 14px;
    text-align: center;
    
}
.noFetch img{
    width: 94px;
    height: 94px;
    margin-top: 100px;
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
.vjs-tech {   /*禁用单击暂停*/
    pointer-events: none;
}

/*
*进度条
*/
 
.line_loading {
  width: 100%;
  height: 2px;
  background: #158447;
  opacity: 0.1;
  border-radius: 20px;
  -webkit-animation: line 3s ease-in-out infinite;
  animation: line 3s ease-in-out infinite;
}

@-webkit-keyframes line {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes line {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}


</style>

