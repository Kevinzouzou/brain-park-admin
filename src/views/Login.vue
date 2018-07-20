<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">
      <img class="logo" src="../assets/icon_logo_sh.png"> 运营管理平台
    </h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" @keyup.enter.native="doLogin" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" @keyup.enter.native="doLogin" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" @change="rememberPassword" class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>

</template>

<script>
  import { loginUrl } from '../api/api';
  import axios from 'axios'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [{
              required: true,
              message: '请输入账号',
              trigger: 'blur'
            },
            //{ validator: validaePass }
          ],
          checkPass: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            //{ validator: validaePass2 }
          ]
        },
        checked: false,
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        let _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
              //_this.$router.replace('/table');
              this.logining = true;
              //NProgress.start();
              let loginParams = {
                username: this.ruleForm2.account,
                password: this.ruleForm2.checkPass
              };
              let rememberStatus = this.checked; // 记住密码
              let userInfo = loginParams.username + '&' + loginParams.password;
              let url=loginUrl+'&phone='+this.ruleForm2.account+'&password='+this.ruleForm2.checkPass;
              axios.get(url,{}).then((res)=>{
                this.logining = false;
                let data=res.data.responseList;
                let token=data.token;
                let parkId=data.userInfo.parkId;
                let userId=data.userInfo.id;
                let upUrl = 'https://yqdndev.vpclub.cn/api10005/'; //阿里云(开发)
                // let upUrl = 'http://172.16.0.111:10005/'; //阿里云(开发)
                // let upUrl='https://shbeta.vpclub.cn/api10005';//新阿里云
                sessionStorage.setItem('user', JSON.stringify(loginParams));
                sessionStorage.setItem('token', token);
                localStorage.setItem("parkId", parkId);

                localStorage.setItem("userId", userId);
                localStorage.setItem("upUrl", upUrl);
                this.$router.push({
                    path: '/userProfile'
                    // path: '/deviceMg'
                });

                sessionStorage.setItem('permission',JSON.stringify(data.permissionList));
            })  .catch(err=>{
                // reject(err)
                  alert("登录账号或密码错误！");
            });

            // 勾选记住密码，保存到Cookie中
            if (rememberStatus) {
                this.setCookie('userInfo', userInfo, 1440 * 3);
            } else {
                this.delCookie('userInfo');
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /**
       * 设置cookie
       */
       setCookie (name, value, expiremMinutes) {
          let exDate = new Date();
          exDate.setTime(exDate.getTime() + expiremMinutes * 60 * 1000);
          document.cookie = name + '=' + escape(value) + ((expiremMinutes == null) ? '' : ';expires=' + exDate.toGMTString());
      },
      /**
       * 读取cookie
       */
       getCookie (name) {
          if (document.cookie.length > 0) {
              let start = document.cookie.indexOf(name + '=');
              if (start !== -1) {
                  start = start + name.length + 1;
                  let end = document.cookie.indexOf(';', start);
                  if (end === -1) {
                      end = document.cookie.length;
                      return unescape(document.cookie.substring(start, end));
                  }
              }
          }
          return '';
       },
        /**
         * 删除cookie
         */
        delCookie (name) {
            let exp = new Date();
            exp.setTime(exp.getTime() - 1);
            let cval = this.getCookie(name);
            if (cval != null) {
                document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
            }
        },
        // 回车登录事件
        doLogin () {
            this.handleSubmit2();
        },
        // 记住密码
        rememberPassword () {
            console.log(this.checked);
        },
        loadUserInfo () {
            let userInfo =this.getCookie('userInfo');
            if (!!userInfo === true) {
                let userName = '';
                let passWord = '';
                let index = userInfo.indexOf('&');
                userName = userInfo.substring(0, index);
                passWord = userInfo.substring(index + 1);
                this.ruleForm2.account = userName;
                this.ruleForm2.checkPass = passWord;
                this.checked = true;
            }
        },
    },
    mounted(){
        this.loadUserInfo();
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      font-size: 20px;
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
      .logo {
        width: 150px;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>