"use strict";(self["webpackChunkweb_admin"]=self["webpackChunkweb_admin"]||[]).push([[421],{59421:(e,n,t)=>{t.r(n),t.d(n,{default:()=>g});var o=t(35280),r=t(48677),a={id:"login"},c={class:"login-content"},s=(0,o.Lk)("div",{class:"login-logo"},[(0,o.Lk)("img",{src:r,class:"h-20 mr-6"}),(0,o.Lk)("div",{class:"login-logo-content"},[(0,o.Lk)("h4",{class:"font-bold"},"出货单据打印系统"),(0,o.Lk)("span",null,"Express Document Printing System")])],-1),i=(0,o.Lk)("i",{class:"ri-user-line"},null,-1),u=(0,o.Lk)("i",{class:"ri-lock-line"},null,-1);function l(e,n,t,r,l,d){var p=(0,o.g2)("a-input"),k=(0,o.g2)("a-form-item"),f=(0,o.g2)("a-input-password"),h=(0,o.g2)("a-button"),v=(0,o.g2)("a-form");return(0,o.uX)(),(0,o.CE)("div",a,[(0,o.Lk)("div",c,[s,(0,o.bF)(v,{layout:"vertical"},{default:(0,o.k6)((function(){return[(0,o.bF)(k,{label:"账号"},{default:(0,o.k6)((function(){return[(0,o.bF)(p,{placeholder:"请输入账号",value:l.account,"onUpdate:value":n[0]||(n[0]=function(e){return l.account=e})},{prefix:(0,o.k6)((function(){return[i]})),_:1},8,["value"])]})),_:1}),(0,o.bF)(k,{label:"密码"},{default:(0,o.k6)((function(){return[(0,o.bF)(f,{placeholder:"请输入密码",value:l.password,"onUpdate:value":n[1]||(n[1]=function(e){return l.password=e}),onKeydown:d.onKeyDownListener},{prefix:(0,o.k6)((function(){return[u]})),_:1},8,["value","onKeydown"])]})),_:1}),(0,o.bF)(k,{class:"submit"},{default:(0,o.k6)((function(){return[(0,o.bF)(h,{type:"primary",size:"large",block:"",onClick:(0,o.D$)(d.onLoginClick,["prevent"])},{default:(0,o.k6)((function(){return[(0,o.eW)("登录")]})),_:1},8,["onClick"])]})),_:1})]})),_:1})])])}var d=t(14048),p=t(30388),k=(t(62010),t(27495),t(25440),t(42762),t(83496)),f=t(25818),h=t(26443);const v={data:function(){return{accountJson:h.Y,account:"",password:"",vercode:"",vercodePath:"",vcodeToken:"",companyLogo:"",companyName:"",background:"",showVercode:!0,ROOT_IMAGE:f.tl.ROOT_IMAGE,VERSION:f.qN.VERSION_NAME}},created:function(){var e=this;return(0,p.A)((0,d.A)().mark((function n(){return(0,d.A)().wrap((function(n){while(1)switch(n.prev=n.next){case 0:k.A.utils.isEmpty(k.A.getToken())||e.toMain();case 1:case"end":return n.stop()}}),n)})))()},methods:{toMain:function(){var e=this;return(0,p.A)((0,d.A)().mark((function n(){var t;return(0,d.A)().wrap((function(n){while(1)switch(n.prev=n.next){case 0:t=function(e,n){e.children&&e.children.length>0?t(e.children[0],n):(console.log(e,e.path),n(e.path))},e.$router.replace({path:"/print/index"});case 3:case"end":return n.stop()}}),n)})))()},onKeyDownListener:function(e){if(13==e.keyCode){var n=this.showVercode,t=this.vercode;n&&k.A.utils.isEmpty(t)||this.onLoginClick()}},onVercodeClick:function(){var e=this;return(0,p.A)((0,d.A)().mark((function n(){var t;return(0,d.A)().wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,k.A.getAsync(k.A.URLS.VERIFY_CODE_TOKEN);case 2:t=n.sent,e.vcodeToken=t.data,e.vercodePath=k.A.URLS.VERIFY_CODE+"?vcodeToken="+e.vcodeToken;case 5:case"end":return n.stop()}}),n)})))()},onLoginClick:function(){var e=this;return(0,p.A)((0,d.A)().mark((function n(){var t,o,r,a,c;return(0,d.A)().wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(t=e.account,o=e.password,e.vercode,e.vcodeToken,e.showVercode,r={loginType:f.qN.LOGIN_TYPE},!k.A.utils.isEmpty(t)){n.next=5;break}return k.A.showToast("请输入用户名"),n.abrupt("return");case 5:if(r.account=(t+"").trim(),!k.A.utils.isEmpty(o)){n.next=9;break}return k.A.showToast("请输入密码"),n.abrupt("return");case 9:return r.password=(o+"").trim(),k.A.showLoading(),console.log(k.A.utils.getMD5String(r.password)),h.Y[r.account]&&h.Y[r.account].pwd==k.A.utils.getMD5String(r.password)?(k.A.hideLoading(),k.A.setToken(r.account),k.A.userInfo.set({name:h.Y[r.account].name}),e.toMain()):(k.A.hideLoading(),k.A.showToast("用户名或密码错误")),n.abrupt("return");case 17:a=n.sent,k.A.hideLoading(),0==a.status?(c=a.data,k.A.setToken(c.token),k.A.userInfo.set(c.userInfo),e.toMain()):(e.showVercode=!0,e.onVercodeClick());case 20:case"end":return n.stop()}}),n)})))()}}};var A=t(71241);const w=(0,A.A)(v,[["render",l]]),g=w},48677:(e,n,t)=>{e.exports=t.p+"img/ecs-logo.47042b78.png"}}]);