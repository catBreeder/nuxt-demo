<template>
 <div class="update_wrapper">
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left"  size="24" color="#8B8989"/>
       </template>
       <template #title>
         <div>Update Password</div>
       </template>
     </van-nav-bar>
   </van-sticky>
   <div class="update-content">
     <div class="update-form">
       <van-field v-model.trim="user.original"
                  :type="visibleInfo.originShow?'text':'password'"
                  :right-icon="visibleInfo.originShow?'eye-o':'closed-eye'"
                  @click-right-icon="showPwdHandle('origin')"
                  label-width="4rem" required label="Original Password" placeholder="Original Password" />
       <van-field v-model.trim="user.newPwd"

                  :type="visibleInfo.newShow?'text':'password'"
                  :right-icon="visibleInfo.newShow?'eye-o':'closed-eye'"
                  @click-right-icon="showPwdHandle('new')"
                  label-width="4rem" required label="New Password" placeholder="New Password" />
       <van-field v-model.trim="user.confirmPwd"
                  :type="visibleInfo.confirmShow?'text':'password'"
                  :right-icon="visibleInfo.confirmShow?'eye-o':'closed-eye'"
                  @click-right-icon="showPwdHandle('confirm')"
                  label-width="4rem" required label="Confirm Password" placeholder="Confirm Password" />
       <div class="update-btn-area">
         <van-button class="update-btn" @click="updateHandle">Update</van-button>
       </div>
     </div>
   </div>
   <van-overlay :show="isWaiting" >
     <div class="wrapper" @click.stop>
       <van-loading type="spinner" color="#fcc900" size="45" />
     </div>
   </van-overlay>
   <van-dialog v-model="dialogInfo.visible" :show-cancel-button="false" :show-confirm-button="false">
     <common-dialog  :isShowImg="false"
                     :type="dialogInfo.type"
                     :title="dialogInfo.content"
                     @okEmit="hideDialogHandle"/>
   </van-dialog>
 </div>
</template>

<script>
  import CommonDialog from '@/components/common/CommonDialog'
import {accountUpdatePasswordApi} from '@/api/account';
import {pwdValidate} from '@/utils'
  import {logoutApi } from '@/api/user';
  import {
    removeOrderShipAddressID,
    removeCategoryID,
    removeCategoryScroll,
    removeUserType,
    removeSensorData
  } from '@/utils/memory'
 export default {
   head(){
     return {
       title:'Change Your Password - shopshipshake'
     }
   },
  components:{CommonDialog},
   data(){
     return{
       user:{
         original:'',
         newPwd:'',
         confirmPwd:''
       },
       isWaiting:false,
       isVisible:false,
       visibleInfo:{
         originShow:false,
         newShow:false,
         confirmShow:false
       },
       dialogInfo:{
         type:'',
         content:'',
         visible:false
       }
     }
   },

    methods:{
      hideDialogHandle(){
        this.dialogInfo.visible = false;
        if(this.dialogInfo.type=='success'){
          logoutApi().then(res=>{
            this.clearAllHandle();
            this.$router.replace('/login')
          })
        }
      },
      clearAllHandle(){
        window.localStorage.clear();
        removeOrderShipAddressID();
        removeCategoryID();
        removeCategoryScroll();
        removeUserType();
        removeSensorData()
      },
      showPwdHandle(type){
        switch (type) {
          case 'origin':
            this.visibleInfo.originShow = !this.visibleInfo.originShow;
            break;
           case 'new':
             this.visibleInfo.newShow = !this.visibleInfo.newShow;
             break;
           case 'confirm':
             this.visibleInfo.confirmShow = !this.visibleInfo.confirmShow;
             break;
        }
      },
      goBackHandle(){
        this.$router.back()
      },
      checkValidateHandle(){
        if(!this.user.original){
           this.$toast({message:'Original Password is required!'});
           return false;
        }

        if(!this.user.newPwd){
          this.$toast({message:'New Password is required!'});
          return false;
        }

        if(!this.user.confirmPwd){
          this.$toast({message:'Confirm Password is required!'});
          return false;
        }

        if(this.user.newPwd != this.user.confirmPwd){
          this.$toast({message:'Confirm Password and New Password is not same !'});
          return false;
        }
        if(!pwdValidate(this.user.newPwd) || !pwdValidate(this.user.confirmPwd)){
          this.$toast({message:"6 to 20 digits,number + letter,such as \\'a123456\\', \\'123456aA\\'!"})
          return false;
        }
        return true;
      },
      updateHandle(){
        if(this.checkValidateHandle()){
          this.isWaiting = true;
          accountUpdatePasswordApi({
            oldPwd:this.user.original,
            newPwd:this.user.confirmPwd
          }).then(res=>{
            this.isWaiting = false;
            if(res.status!=0){
              this.dialogInfo={
                visible:  true,
                content:res.message,
                type:'error'
              }
            }else{
              this.dialogInfo={
                visible:  true,
                content:'Update Success !',
                type:'success'
              }
            }
          }).catch(err=>{
            this.isWaiting = false;
          })
        }
      }
    },


 }
</script>

<style scoped lang="less">
.update_wrapper{
    .update-content{
      padding:30px 6px;
      .update-form{
        border:1px solid #EEEEED;
        border-radius: 4px;
        .update-btn-area{
          padding:30px 0 ;
          display: flex;
          justify-content: center;
          .update-btn{
            background-color: #fcc900;
            border-radius: 6px;
          }
        }
        /deep/.van-cell{
          font-size:15PX;
        }
      }
    }
}
</style>
