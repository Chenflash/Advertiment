<template>
  <div class="opinionPage">
       
          <mt-header title="意见反馈">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goback"></mt-button>
        </router-link>
        <mt-button  slot="right"  @click="submitOpinion()">提交</mt-button>
        </mt-header>
       
        <div class="opinionContent">
          <div class="content">
            <textarea rows="4" autofus v-model="content" placeholder="输入您宝贵的意见" maxlength="150"/>
            <span :style="content.length>=150?'color:#f01':''">{{content.length}}/150</span>
          </div>
          <input type="number" class="tels" placeholder="输入您的联系电话" v-model="member_phone"/>


        </div>




  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast } from 'mint-ui';
export default {
  name: 'opinionPage',
  data () {
    return {
      member_phone:'',
      content:'',
    }
  },
  mounted(){

  },
  methods:{
    
    submitOpinion(){   //提交投诉建议
      if(this.content!="" && this.member_phone!=""){
         var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
            var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=document&op=mb_feedback&member_phone='+that.member_phone+"&content="+that.content,
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
                Toast("感谢您的反馈，我们将持续改进");
                setTimeout(()=>{app.back()},2000); //跳转页面
              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{

            });
      }else{
        return false;
      }

    },
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
input,textarea{
  border:0px none;
}
li {
  display: inline-block;
  margin: 0 10px;
}
input::-webkit-input-placeholder{
  padding-left:10px;
  font-size:16px;
  background-color:#ffffff;
}
textarea::-webkit-input-placeholder{
  padding-top:10px;
  padding-left:10px;
  font-size:16px;
  background-color:#ffffff;
  text-align: left !important;
}
.opinionPage{
  height:100%;
   background-color: rgba(247, 247, 247, 0.6);
}
.opinionContent{
     padding-top: 66px;
}
.content{
    width: 95%;
    height:14rem;
    display: grid;
    margin: 0 auto;
    position: relative;
    font-size: 1.6rem;
    margin-bottom: 10px;
    border:1px solid #d9d9d9;
    background-color:#ffffff;
}
.content textarea{
    outline:0px none;
    height: 120px;
    resize:0;
    text-align: left !important;
    width:100%;
}
.content span{
    position: absolute;
    bottom: 5px;
    right: 5px;
}

.tels{
    display: grid;
    width: 95%;
    height: 3.6rem;
    line-height: 3.6rem;
    margin: 0 auto;
    border: 1px solid #d9d9d9;
    background-color:#ffffff;
    font-size:1.6rem;
}
.tels:focus{
 background-color:#ffffff;
}

</style>

