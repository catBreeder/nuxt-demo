<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Feeback</template>
<!--          <template #right>-->
<!--            <van-icon name="wap-home-o" size="22" color="#333" @click="goIndexHandle"/>-->
<!--          </template>-->
        </van-nav-bar>
      </van-sticky>
      <div class="feeback-content">
        <div class="check-item d_flex d_flex_end">
          <span class=" check-item-inner d_flex" @click="checkFeebackListHandle"><van-icon name="notes-o" size="16" />&nbsp;View all your Feedback</span>
        </div>
        <div class="form-item">
          <div class="form-item-label"><span class="color_orange_red">*</span>Content</div>
          <van-field
            v-model="content"
            rows="2"
            type="textarea"
            maxlength="50"
            placeholder="Content"
            show-word-limit
          />
        </div>
        <div class="form-item">
          <div class="form-item-label">Image</div>
          <van-uploader  accept=".jpg, .jpeg, .png" max-count="1" :after-read="afterReadHandle" v-model="fileList"/>
        </div>

       <div class="d_flex d_flex_center">
         <van-button type="primary" @click="submitHandle">Submit</van-button>
       </div>
      </div>
      <van-overlay :show="isLoading" >
        <div class="wrapper" @click.stop>
          <van-loading type="spinner"  color="#fcc900" />
        </div>
      </van-overlay>
    </div>
</template>

<script>
  import { uploadImageApi } from '@/api/common';
  import {questionOperateFeebackApi} from '@/api/account'
    export default {
        name: "index",
        data(){
          return{
            content:'',
            isLoading:false,
            fileList:[],
            image:''
          }
        },
        methods:{
          checkFeebackListHandle(){
            this.$router.push('/questionFeedback/index')
          },
          submitHandle(){
            if(!this.content){
              return this.$toast({message:'Please fill in Content'})
            }
            questionOperateFeebackApi({
              content:this.content,
              image:this.image
            }).then(res=>{
              console.log(res);
              if(res.status==0){
                this.$toast({message:'Operate Success'})
                this.$router.push('/questionFeedback/index')
              }
            })
          },
          afterReadHandle(file){
            this.isLoading = true;
            uploadImageApi(file).then(res=>{
              if(res.data.status==0){
                this.isLoading = false;
                this.image= res.data.data.picurl;
              }else{
                this.isLoading = false;
                return this.$toast({message:res.data.message})
              }
            })
          },
          goBackHandle(){this.$router.back()},
          goIndexHandle(){
            this.$router.replace('/');
            this.$emit('toIndex')
          },
        }
    }
</script>

<style scoped lang="less">
.feeback-content{
  padding:15px 25px;
  .check-item{
    font-size:15px;
    color:#fcc900;
    .check-item-inner{
      border-bottom:1px solid #fcc900;
      padding-bottom:4px;
    }
  }
  .form-item{
    margin-bottom: 25px;
    .form-item-label{
      margin-bottom: 10px;
      font-size:16px;
      font-weight: bold;
    }
  }
}
  /deep/.van-cell{
    background:#EEEEED;
    border-radius: 4px;
  }
</style>
