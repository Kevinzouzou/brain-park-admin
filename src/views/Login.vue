<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">
      <img class="logo" src="../assets/icon_logo_sh.png"> 运营管理平台
    </h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>

</template>

<script>
  // import { requestLogin } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: 'admin',
          checkPass: '123456'
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
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        this.logining = true;
        this.$router.push({
          path: '/circle'
        });
        this.logining = false;

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
            if (loginParams.username === 'admin' && loginParams.password === '123456') {
              this.logining = false;
              // sessionStorage.setItem('user', JSON.stringify(user));
              let parkId = '969878f1f1149e6a7afae38636c0abc';
              let userId = '71f3df48263f4c74be2efbb83250e66b';
              // let upUrl = 'http://192.168.2.214:2040/'; // other
              // let upUrl = 'http://218.17.39.178:2040'; //微品云（开发）
              let upUrl = 'https://yqdndev.vpclub.cn/api10005/'; //阿里云(开发)
              // let upUrl='https://shbeta.vpclub.cn/api10005';//新阿里云
              // let upUrl='http://39.107.252.186:10005';//阿里云地址（正式）

              sessionStorage.setItem('user', JSON.stringify(loginParams));
              localStorage.setItem("parkId", parkId);

              localStorage.setItem("userId", userId);
              localStorage.setItem("upUrl", upUrl);
              this.$router.push({
                path: '/userProfile'
              });
              console.log(localStorage.getItem("parkId") + '  --login parkid')
              console.log(localStorage.getItem("upUrl") + '  --login upUrl')
            }

            // requestLogin(loginParams).then(data => {
            //   this.logining = false;
            //   //NProgress.done();
            //   let { msg, code, user } = data;
            //   if (code !== 200) {
            //     this.$message({
            //       message: msg,
            //       type: 'error'
            //     });
            //   } else {
            //     sessionStorage.setItem('user', JSON.stringify(user));
            //     this.$router.push({ path: '/circle' });
            //   }
            // });

          } else {
            console.log('error submit!!');
            return false;
          }
        });
        // this.$refs.ruleForm2.validate((valid) => {
        //   if (valid) {
        //     //_this.$router.replace('/table');
        //     this.logining = true;
        //     //NProgress.start();
        //     var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
        //     requestLogin(loginParams).then(data => {
        //       this.logining = false;
        //       //NProgress.done();
        //       let { msg, code, user } = data;
        //       if (code !== 200) {
        //         this.$message({
        //           message: msg,
        //           type: 'error'
        //         });
        //       } else {
        //         sessionStorage.setItem('user', JSON.stringify(user));
        //         this.$router.push({ path: '/circle' });
        //       }
        //     });
        //   } else {
        //     console.log('error submit!!');
        //     return false;
        //   }
        // });
      }
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