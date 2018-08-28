<template>
  <div class="showImgs" >
          <swiper :options="swiperOption" ref="imgOverview" style="width:100%;height: 100%;" >
        <swiper-slide v-for="(img, index) of previewImg" :key="index">
          <p class="swiper-zoom-container" @click="showImg=false">
            <img :src="img" alt="" @click="showImg=false">
          </p>
        </swiper-slide>
      </swiper>
       <div class="swiper-pagination"></div> 
       </div> 
</template>
<script>
//引入手势缩放和左右滑动
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
    name:'showImgs',
    components:{
         swiper,
        swiperSlide,
    },
    data(){
        return{
         
        }
    },
    methods: {
       
    }
}


</script>

<style scope>
<style scoped>
/*动画*/
.fade-enter-active,
.fade-leave-active {
    transition: all .2s linear;
    transform: translate3D(0, 0, 0);
}

.fade-enter,
.fade-leave-active {
    transform: translate3D(100%, 0, 0);
}


/* bigimg */

.img-view {
    position: relative;
    width: 100%;
    height: 100%;
}

/*遮罩层样式*/
.img-view .img-layer {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 7);
    width: 100%;
    height: 100%;
    overflow: scroll;
}
.img-view .img{
	width:100%;
}
/*不限制图片大小，实现居中*/
.img-view .img img {
    width: 100%;
    max-height: 280px;
    top: 25%;
    display: block;
    position: fixed;
    z-index: 1000;
}
</style>

</style>