import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//路由配置赖加载
export default new Router({
  routes: [
   
    /**
    * 首页模块的路由配置
    */
    {
      path: '/streetscapePage/:gc_id/:getCity',           //街景
      name: 'streetscapePage',
      component: resolve=>require(['@/components/Home/streetscapePage'],resolve),
      meta:{
        title: "街景",
        keepAlive: false       //需要缓存
      }

    },
    {
      path: '/abountMerchantPage/:storeId',        //商户介绍
      name: 'abountMerchantPage',
      component:resolve=>require(['@/components/Home/abountMerchantPage'],resolve),

      meta:{
        keepAlive:true       //需要缓存
      }
    },
    {
      path: '/merchantClassPage/:gc_id/:getCity',       //二级分类
      name: 'merchantClassPage',
      component: resolve=>require(['@/components/Home/merchantClassPage'],resolve),
      meta:{
        keepAlive:false,      //需要缓存
        requiresAuth: true,
      },
      
    }, {
      path: '/merchantLevelPage',        //全部分类
      name: 'merchantLevelPage',
      component: resolve=>require(['@/components/Home/merchantLevelPage'],resolve),
      meta:{
        mode: 'history',
        keepAlive:false       //需要缓存
      }
    }, {
      path: '/shareShop',       //商户详情
      name: 'shareShop',
      component: resolve => require(['@/components/Common/shareShop'],resolve),
      meta:{
        keepAlive:false       //需要缓存
      }
    },
    {
      path: '/merchantDetailPage/:storeId',       //商户详情
      name: 'merchantDetailPage',
      component: resolve => require(['@/components/Home/merchantDetailPage'], resolve),
      meta: {
        keepAlive: false       //需要缓存
      }
    }, 
    { 
      path: '/searchMerchantPage',       //商户搜索  
      name: 'searchMerchantPage',
      component: resolve=>require(['@/components/Home/searchMerchantPage'],resolve),
    }, 
    { 
      path: '/levelSearchPage',       //全部分类-搜索  
      name: 'levelSearchPage',
      component: resolve=>require(['@/components/Home/levelSearchPage'],resolve),
    },
    { 
      path: '/homeSearchPage',       //首页-搜索  
      name: 'homeSearchPage',
      component: resolve=>require(['@/components/Home/homeSearchPage'],resolve),
    },
    {
      path: '/merchantInfoPage/:key/:goodsId',         //推广信息详情
      name: 'merchantInfoPage',
      component: resolve=>require(['@/components/Home/merchantInfoPage'],resolve),
      meta:{
      	keepAlive:true,    //需要缓存
      }
    },
    {
      path: '/redPackage/:key/:envId',       //红包  
      name: 'redPackage',
      component: resolve=>require(['@/components/Home/redPackage'],resolve),
      meta:{
        requiresAuth:false,
      }
    }, 

    /**
     * 我的模块路由配置
    */
    {
      path: '/walletPage/:key',            //钱包明细
      name: 'walletPage',
      component: resolve=>require(['@/components/Mine/walletPage'],resolve),
      meta: {
        keepAlive: true       //需要缓存
      }
    }, {
      path: '/opinionPage',         //意见反馈
      name: 'opinionPage',
      component: resolve=>require(['@/components/Mine/opinionPage'],resolve),
    },{
      path: '/explainPage',       //使用说明
      name: 'explainPage',
      component: resolve=>require(['@/components/Mine/explainPage'],resolve),
       meta: {
        keepAlive: true       //需要缓存
      }
    }, {
      path: '/explainDetailPage/:doc_id',      //使用说明详情页面
      name: 'explainDetailPage',
      component: resolve=>require(['@/components/Mine/explainDetailPage'],resolve),
       meta: {
        keepAlive: true       //需要缓存
      }
    }, {
      path: '/merchantListPage/:key/:storeId',       //我的店铺
      name: 'merchantListPage',
      component: resolve=>require(['@/components/Mine/merchantListPage'],resolve),
      meta: {
        keepAlive: false       //需要缓存
      }
    },
    {
      path: '/City',       
      name: 'City',
      component: resolve=>require(['@/components/Common/City'],resolve),
    },{
      path: '/StreetCity',
      name: 'StreetCity',
      component: resolve=>require(['@/components/Common/StreetCity'],resolve),
    },
    {
      path: '/download',     //下载页面   
      name: 'download',
      component: resolve => require(['@/components/Common/download'],resolve)
    },
    {
      path: '/SeletedCity',       
      name: 'SeletedCity',
      component: resolve=>require(['@/components/Common/SeletedCity'],resolve),
    }
    
  ]
})
