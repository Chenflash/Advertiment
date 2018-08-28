<template>
  <div class="download">
     
    <img class="bg" src="../../assets/bgdown.png">
    <div class="buttons">
        <a class="button ios">
            <img src="../../assets/ios.png">
            <span>iOS下载</span>
        </a>
        <a class="button android">
            <img src="../../assets/android.png">
            <span>安卓下载</span>
        </a>
    </div>

  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast } from 'mint-ui';
export default {
  name: 'download',
  data () {
    return {
      member_phone:'',
      content:'',
    }
  },
  mounted(){

  },
  methods:{
    
    
    goback(){
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
.bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
}
.buttons{
     display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120px;
    position: fixed;
    left: 0;
    width: 100%;
    bottom: 60px;
}
.buttons .button{
      display: inline-block;
    width: 200px;
    background: #fff;
    height: 49px;
    border-radius: 49px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}
.buttons .button img{
    height: 23px;
}
.buttons .button span{
   margin-left: 14px;
    font-size: 18px;
    color: #11D499;
}

</style>

