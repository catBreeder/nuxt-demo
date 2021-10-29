<template>
  <div class="profile-form-content">
    <van-field v-model="userInfo.name" label-width="120" input-align="right" label="Name" />
    <van-field v-model="userInfo.cellphone" label-width="100" readonly label="Mobile Number"  @click-right-icon="editHandle('cellphone')">
      <template #right-icon>
        <div class="d_flex color_blue"><van-icon name="edit" size="18" color="#87CEFA"/>Change</div>
      </template>
    </van-field>
    <van-field  v-model="userInfo.email" label="Email" readonly  @click-right-icon="editHandle('email')">
      <template #right-icon>
        <div class="d_flex color_blue">
          <van-icon name="edit" size="18" color="#87CEFA"/>Change
        </div>
      </template>
    </van-field>
    <div class="form-operate-area">
        <div class="save-btn" @click="saveHandle">Save</div>
        <div class="cancel-btn"
             @click="changeModelHandle"
            >Cancel</div>
    </div>
  </div>
</template>

<script>
  import {accountUserInfoApi,accountUserInfoUpdateApi} from '@/api/account'
    export default {
        name: "index",
        data(){
          return{
            userInfo:{}
          }
        },
        methods:{
          saveHandle(){
            accountUserInfoUpdateApi({
              name:this.userInfo.name,
              cellphone:this.userInfo.cellphone,
              email:this.userInfo.email
            }).then(res=>{
              if(res.status==0){
                this.$toast({message:res.message});
                this.changeModelHandle()
              }
            })
          },
          editHandle(type){
            this.$router.push(`/user/info/change/${type}`)
          },
          //该改变模式
          changeModelHandle(){
            this.$emit('changeModelEvent')
          },
          getUserInfo(){
            accountUserInfoApi().then(res=>{
              if(res){
                let  {user} = res;
                this.userInfo  = user;

              }
            })
          }
      },
      activated() {
          this.getUserInfo()
      },
      mounted() {
          this.getUserInfo()
      }
    }
</script>

<style scoped lang="less">
.profile-form-content{
  margin: 20px 8px;
  border:1px solid #EEEEEE;
  background-color: #fff;
  padding:0 8px 10px;
  border-radius: 4px;
  .form-operate-area{
    padding:20px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .save-btn{
      background-color: #fcc900;
      color:#2A2A2A;
      border-radius: 4px;
      padding:8px 20px;
      font-size:14px;
    }
    .cancel-btn{
      background-color: #fcc900;
      color:#2A2A2A;
      border-radius: 4px;
      padding:8px 15px;
      font-size:14px;
    }
  }
}
</style>
