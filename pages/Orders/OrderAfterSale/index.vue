<template>
   <div class="share-after-sale-wrapper">
     <van-sticky>
       <van-nav-bar @click-left="goBackHandle" >
         <template #left>
           <van-icon name="arrow-left" size="24" color="#8B8989"/>
         </template>
         <template #title>
           <div class="navbar-title">After Sale</div>
         </template>
       </van-nav-bar>
     </van-sticky>
     <scroll-view class="afterSaleScroll">
       <div class="share-after-content">
         <div class="after-sale-choose after-sale-box-common">
           <van-radio-group v-model="type" direction="horizontal">
             <van-radio icon-size="16" :name="item.id"
                        v-for="(item,index) in orderAfterSaleTypeList"
                        :key="index">{{item.name}}</van-radio>
           </van-radio-group>
           <div class="after-sale-remark">
             <div class="remark-title">
                <span class="color_warning">*</span>remark
             </div>
             <van-field v-model="remark" class="g_mb_l" rows="2" type="textarea" maxlength="100"
                        placeholder="remark" show-word-limit/>

           </div>
         </div>
         <div class="after-sale-upload after-sale-box-common">
           <div class="remark-title">
             Images <span class="remark-intro ">( Maximum 3 images )</span>
           </div>
           <van-uploader v-model="imgList"
                         :after-read.stop="afterReadImgHandle"
                         :before-delete="deleteImgHandle"
                         :max-count="3" multiple  accept="image/png, image/jpeg, image/gif, image/jpg">
              <div class="upload-box">
                <i class="icon iconfont icon-zhaoxiangji upload-img"></i>
              </div>
           </van-uploader>
           <div class="remark-title video-title">
             Video
           </div>
           <div v-if="showVideoFlag" class="video-content">
             <video :src="videoPath[0]" controls="controls" width="100%" height="150"/>
             <van-icon name="cross" class="close-tag" color="#fff"
                       @click="deleteVideoEditHandle"
                       size="20"/>
           </div>

           <van-uploader v-model="videoList" v-else
                         :before-delete="deleteVideoHandle"
                         :after-read.stop="afterReadVideoHandle"
                         :max-count="1" accept="video/*">
             <div class="upload-box" >
               <i class="icon iconfont icon-pingjia-shangchuanshipin upload-img" />
             </div>
           </van-uploader>
         </div>

         <div class="share-after-btn-area">
              <van-button class="commit-btn" @click="submitHandle">Commit</van-button>
         </div>
       </div>

     </scroll-view>
     <van-dialog v-model="dialogVisible" :show-confirm-button="false" :show-cancel-button="false">
       <common-dialog type="success" v-if="dialogVisible"
                      :isFont="false"
                      :isShowImg="false"
                      okText="Confirm"
                      @okEmit="closeDialogHandle"
       />
     </van-dialog>
   </div>
</template>

<script>
  import CommonDialog from '@/components/common/CommonDialog'
import {accountWorkOrderDetailApi,accountWorkOrderSaveApi} from '@/api/account'
import ScrollView from "@/components/common/ScrollView";
import {objectTranToArrayString} from "@/utils";
 export default {
   head(){
     return {
       title:'After Sale - shopshipshake'
     }
   },
   data(){
     return{
       type:'40',
       remark:'',
       imgList:[],
       videoList:[],
       orderInfo:{},
       imgPath:[],
       videoPath:[],
       dialogVisible:false,
       showVideoFlag:false,
       fromType:'',
       orderAfterSaleTypeList:[
         {id:'40',name:'Damaged'},
         {id:'30',name:'Wrong Qty'},
         {id:'50',name:'Wrong Product'},
       ]
     }
   },
   beforeRouteEnter(to,from,next){
     next(vm=>{
       if(from.name =='AfterSaleService'){
         vm.fromType = 'AfterSaleService'
       }
     })
   },
     components:{ScrollView,CommonDialog},
      methods:{
      closeDialogHandle(){
        this.dialogVisible = false;
        if(this.fromType =='AfterSaleService'){
          this.$router.back()
        }else{
          this.$router.push(`/workorder/index`)
        }

      },
      submitHandle(){
        if(!this.remark){
          return this.$toast({message:'Please enter remark'})
        }
        if(this.videoPath.length==0 && this.imgPath.length==0){
          return this.$toast({message:'Please upload one picture or one video at least.'})
        }
        accountWorkOrderSaveApi({
          id:this.orderInfo.id,
          content:this.remark,
          type:this.type,
          shoporderid:this.orderInfo.shoporder.id,
          shoporderno:this.orderInfo.shoporder.orderno,
          image1:this.imgPath.length!=0?this.imgPath.join(','):'',
          video:this.videoPath.length!=0?this.videoPath.join(','):''

        }).then(res=>{
          if(res.status==0){
              this.dialogVisible=true;
          }else{
            this.$toast({message:res.message})
          }
        })
      },
      afterReadVideoHandle(file){
        let _upload = new XCUPload({
          file:file.file,
          savePath:'3simgs',
          onComplete:(info)=>{
            file.status = 'uploading';
            file.message = 'uploading...';
            if(info.code===1){
              setTimeout(()=>{
                file.status = 'success';
              },500)
            }
            let path  = this.$config.onlineImgURL + info.path;
            this.videoPath = [...this.videoPath,path];
          }
        })
        _upload.upload()
      },
      afterReadImgHandle(file){
        for(let i =0;i<this.imgList.length;i++){
          let _upload = new XCUPload({
            file:this.imgList[i].file,
            savePath:'3simgs',
            onComplete:(info)=>{
              file.status = 'uploading';
              file.message = 'uploading...';
              if(info.code===1){
                setTimeout(()=>{
                  file.status = 'success';
                },500)
              }
              let path  = this.$config.onlineImgURL + info.path;
              this.imgPath = [...this.imgPath,path];
              this.imgList.forEach((item, index) => {
                item['id'] = this.imgPath[index]
              })
              if(this.imgPath.length == this.imgList.length){
                this.$toast({message:'Image uploaded successfully'});
              }
            }
          })
          _upload.upload()
        }
      },
      deleteImgHandle(file){
        if(this.orderInfo.id!=0){
          this.imgPath.splice(file.index,1);
        }else{
          let index = this.imgPath.indexOf(file.id)
          if(file.id){
            this.imgPath.splice(index, 1)
          }
        }
        return true;
      },
      deleteVideoHandle(file){
        if(this.orderInfo.id!=0){
          this.videoPath.splice(file.index,1);
        }else{
          let index = this.videoPath.indexOf(file.id)
          if(file.id){
            this.videoPath.splice(index, 1)
          }
        }
        return true;
      },
      deleteVideoEditHandle(){
        this.showVideoFlag = false;
        this.videoPath =[];
        this.videoList =[]

      },
      //返回上一页
      goBackHandle(){
        this.$router.back()
      },
      getAfterSaleDetailHandle(){
        accountWorkOrderDetailApi(this.$route.params.id).then(res=>{
          this.orderInfo= res;
          if(this.orderInfo.id!=0){
            this.renderHandle(this.orderInfo)
          }
        })
      },
      renderHandle(orderInfo){
        this.remark = orderInfo.workorder.content ;
        this.type = orderInfo.workorder.type +'';
        if(orderInfo.images){
          this.imgPath = orderInfo.images;
          this.imgPath.forEach(item=>{
            this.imgList.push({
              index:this.imgList.length,
              url:item
            })
          })
        }
        if(orderInfo.workorder && orderInfo.workorder.video){
          this.videoPath = [orderInfo.workorder.video];
          this.showVideoFlag = true;
          this.videoPath.forEach(item=>{
            this.videoList.push({
              index:this.videoPath.length,
              url:item,
            })
          })
        }

      }
    },
     mounted() {
       console.log(this.orderAfterSaleTypeList);
       this.getAfterSaleDetailHandle()
     }


 }
</script>

<style scoped lang="less">
  .video-content{
    position: relative;
    width:85%;
    .close-tag{
      position: absolute;
      top:5px;
      right:20px;
    }
  }
.share-after-sale-wrapper{
    /deep/.van-radio__icon--checked .van-icon{
      background-color: #fcc900;
      border-color: #fcc900;
    }
    .afterSaleScroll{
      height:calc(100vh - 50px - 46px);
      background-color: #eeeeee;
    }
  .share-after-content{
    /deep/.van-radio__label{
      margin-left: 3px;
    }
    /deep/.van-radio--horizontal{
      margin-right: 20px;
    }
    margin:10px 4px;
    .after-sale-box-common{
      border-radius: 6px;
      margin-bottom: 8px;
      background-color: #fff;
      padding:10px 8px;
    }
    .video-title{
      margin-top: 15px;
    }
    .remark-title{
      font-size:15px;
      font-weight: bold;
      margin-bottom: 15px;
      .remark-intro{
        font-size:13px;
        font-weight: normal;
        color:gray;
      }
    }
    .after-sale-remark{
      margin:20px 4px 10px;

      /deep/.van-cell{
        background-color: #f0f0f0;
        border-radius: 6px;
      }
    }
    .after-sale-upload{
      .upload-box{
        width:77px;
        height:77px;
        margin:0 4px 4px 0;
        background:#f7f8fa;
        border-radius: 4px;
        .upload-img{
          font-size:30px;
          color:lightgray;
          position:absolute;
          top:46%;
          left:46%;
          transform: translate(-50%,-50%);
        }
      }
    }
    .share-after-btn-area{
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .commit-btn{
        background-color: #FCC900;
        font-size:16px;
        border-radius: 4px;
      }
    }
  }

}
</style>
