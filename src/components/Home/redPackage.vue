    <template>
    <div class="redPackage">
      
      

    <div class="container">
    <div class="noEnv animation" id="noEnv" v-if="showInput">
        <img src="../../assets/red.png" class="bg"/>
        <p class="inputs"><input type="text" @blur="scrollView" v-model="content" placeholder="输入口令,领取利是" class="inputCheck" id="inputCheck"/>
        <span @click="checkRed" class="getRed">确定</span></p>
    </div>

    <div class="redPage " v-else>
     <img src="../../assets/bgred.png" class="bg"/>
      <div class="item">
        <p class="avatars"><img :src="store_avatar==null?require('../../assets/mine.png'):store_avatar"/> </p>
        <p class="names">来自{{seller_name}}</p >
        <p class="nums">{{price==null?"0.00":price}}</p >
        <p class="redFont">已存入钱包</p >
        <p class="lookDetail" v-show="!showDetail" @click="showDetail=!showDetail">查看详情</p>
        <p class="lookDetail" v-show="showDetail" @click="showDetail=!showDetail">利是口令：{{content==null?'暂无利是口令':content}}</p>
      </div>
    </div>

     <p class="close"><img src="../../assets/close.png" @click="closeRed"/></p> 

    </div> 


    </div>
    </template>

    <script>
    import axios from 'axios' //引入异步加载的网络请求
    import { Toast } from 'mint-ui';
    export default {
    props:['envids'],    
    name: 'redPackage',
    data () {
    return {
    content:'',
    showInput:true,
    seller_name:"",
    store_avatar:null,
    price:null,
    toShow:false,
    showDetail:false,

    }
    },
   
    mounted(){
      $(".inputCheck").click('keyPress',function(e){
           if(/Android [4-6]/.test(navigator.appVersion)) {
                if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
                            setTimeout(function() {
                                    document.activeElement.scrollIntoViewIfNeeded(true); 
                            },300);
                 }
      
           }
      })
    },
    computed:{
      showRedPackage(){
      return this.$store.state.showRedPackage;
      }  
        
    },
    
    methods:{
    	
        checkRed(){ //检查利是口令
           if(this.content!=""){
               var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
                var that=this;
                axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=env&op=receive&key='+that.$route.params.key+"&id="+that.envids+"&content="+that.content,
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
                       that.showInput=false;
                       setTimeout(()=>{
                           that.fetchInfo();  //获取用户的头像和基本信息  
                       },2000);
                       that.price=response.data.datas; 
                        
                    }else if(response.data.code==400){
                       Toast(response.data.datas.error) 
                    }

                },(err)=>{
                    Toast(err.stautus);
                    
                });
           }
        },
        closeRed(){
            this.content="";
        	 this.$store.commit("decrementShow"); 
        },
        toBack(){
          this.$router.go(-1);
        },
        scrollView(){
           var ele=document.getElementById("noEnv");
           ele.scrollIntoView(true);
        },
        fetchInfo(){
            var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
            var that=this;
            axios({
              method: 'Post',
              url: domain+'/mobile/index.php?act=index&op=advDetail&goods_id='+that.$route.query.goodsId,
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
                var result=response.data.datas;
                that.seller_name=result.storeDetail.seller_name;
                that.store_avatar=result.storeDetail.store_avatar;
                }

            });
                
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
     background-color: rgba(247, 247, 247, 0.6);
    }
    input {
    border:0 none;
    }
    .headers{
        

    }
    .headers h1{
        font-size: 2rem;
        line-height: 56px;
    }
     .header-tit{
         font-size:18px;
     }
     .redPackage{
        background: rgba(0,0,0,0.41);
        width: 100%;
        height: 100%;
        z-index: 999;
        position: fixed;
     }
    /*
    *头部内容
    */
    .bg{
        width: 100%;
        height: 100%;
        background-size: contain;
        position: absolute;
    }
    .noEnv{
           height: 350px;
		    width: 280px;
		    -webkit-box-pack: start;
		    -ms-flex-pack: start;
		    justify-content: flex-start;
		    position: relative;
		    border-radius: 5px;
		    font-size: 14px;
		    background-size: contain;
		    display: -webkit-box;
		    display: -ms-flexbox;
		    -ms-flex-direction: column-reverse;
		    -webkit-box-orient: vertical;
		    -webkit-box-direction: reverse;
		    -webkit-box-align: center;
		    -ms-flex-align: center;
		    text-align: left;
		    position: relative;
  
    }
    .noEnv .inputs{
    opacity: 0.75;
    background: #FFFFFF;
    border-radius: 4px;
    z-index: 999;
    height: 48px;
    width: 80%;
    margin: auto auto;
    display: -webkit-box;
    display: -ms-flexbox;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    position: absolute;
    bottom: 30px;
    left: 10%;
    display: flex;
    justify-content: center;
    } 
    .noEnv .inputs input{
     width:90%; 	
      line-height: 48px;
      height:48px;
      -webkit-box-pack: center;
      justify-content: center;
    }

    .env{
          margin: 50px auto;
        line-height: 48px;
        background-color: #E55300;
        color: #fff;
        width: 65%;
        border: 2px solid #ffffff;
        border-radius: 5px;
        -webkit-box-pack: center;
        z-index: 99;
        -ms-flex-pack: center;
        justify-content: center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
    }
    .btnOpen{
        width: 100px;
        height: 100px;
        background-size: contain;
        position: absolute;
        left: 30%;
        bottom: 90px;
        z-index: 99;
    }
    .EnvContent{
        margin-top:50px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction:column;
        z-index:99px;
    }
    .Content{
        border: 2px solid #ffffff;
        padding: 0px 10px;
        border-radius: 5px;
        z-index:99px;
    }
    .btnOk{
        width: 48px;
        line-height: 48px;
        color: #ffffff;
        display:inline-block;
        z-index:99px;
    }
    input::-webkit-input-placeholder {
    padding-left: 10px;
    font-size: 14px;
    z-index:99px;
    }
    .container{
        display: flex;
	    justify-content: center;
	    z-index: 999;
	    align-items: center;
	    flex-direction: column;
	    margin-top: 60px;
	    

    }
    /*
    *利是详情
    */
    .redPage{
    width: 80%;
    height: 345px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    font-size:16px;
    line-height:48px;
    font-family: serif;
    position:relative;
    background-size: contain;
     animation:mymove 2s infinite;
     -moz-animation:mymove 2s infinite; ;
     -webkit-animation:mymove 2s infinite; 
    -o-animation:mymove 2s infinite;
    animation-iteration-count:1;
    -webkit-animation-iteration-count:1;
    
    }
    .close{
    	margin-top: 8%;
    }
    .close img{
    	width:48px;
    	height:48px;
    	background-size: contain;
    }
    .item{
      z-index: 99;
    }
    .lookDetail{
    	color: #ffcc00;
        margin-top: 20px;
    }
    input::-webkit-input-placeholder{
        display: flex;
        padding-left: 15%;
        font-family: PingFangSC-Regular;
		font-size: 16px;
		color: #FF8800;
		letter-spacing: 0;
    }

    @keyframes  mymove{
     0% {  
         transform:rotate(-7deg) scale3d(0.2,0.2,0.2);
        -ms-transform:rotate(-7deg) scale3d(0.2,0.2,0.2); 	/* IE 9 */
        -moz-transform:rotate(-7deg) scale3d(0.2,0.2,0.2);; 	/* Firefox */
        -webkit-transform:rotate(-7deg) scale3d(0.2,0.2,0.2);; /* Safari 和 Chrome */
        -o-transform:rotate(-7deg) scale3d(0.2,0.2,0.2);; 	/* Opera */
    
    }
     50% {  
         transform:rotate(0deg) ;
        -ms-transform:rotate(0deg)  ; 	/* IE 9 */
        -moz-transform:rotate(0deg)  ; 	/* Firefox */
        -webkit-transform:rotate(0deg)  ; /* Safari 和 Chrome */
        -o-transform:rotate(0deg)  ; 	/* Opera */
        
    }
    100% {
         transform:rotate(0deg) scale3d(1,1,1) rotate3d(0deg,180deg,360deg);
        -ms-transform:rotate(0deg) scale3d(1,1,1) rotate3d(0deg,180deg,360deg);	/* IE 9 */
        -moz-transform:rotate(0deg) scale3d(1,1,1) rotate3d(0deg,180deg,360deg);	/* Firefox */
        -webkit-transform:rotate(0deg) scale3d(1,1,1) rotate3d(0deg,180deg,360deg); /* Safari 和 Chrome */
        -o-transform:rotate(0deg) scale3d(1,1,1) rotate3d(0deg,180deg,360deg); 	/* Opera */
        
        }
    }
    .getRed{
        letter-spacing: 2px;
        background-color: #fff;
        display: inline-block;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        line-height: 48px;
        color: #ff8800;
        font-size: 1.4rem;
        width: 46px;
    }
    .redPage .names{
      color: #ffcc00;
    }
    .avatars{
     padding-top:30px;
     }
    .avatars img{
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    background-size: contain;
    border: 2px solid #ffffff;

    }
    .redPage .nums{
    font-size: 32px;
    color: #ffcc00;
    font-weight: bold;
    }
    .redPage .looks{
       color: #ffcc00; 
    }
    .redFont{
       color: #983F0A;
    }
    </style>
