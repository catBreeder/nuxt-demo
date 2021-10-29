<template>
  <section>
    <div class="count-operate-box">
      <div class="count-operate-wrapper d_flex">
        <div class="count-left" @click="qtyOperateHandle('minus')"><van-icon name="minus" size="20" /></div>
        <div class="count-inner">
          <van-field v-model="qty" type="number" class="count-input"/>
        </div>
        <div class="count-right" @click="qtyOperateHandle('add')"><van-icon name="plus" size="20"/></div>
      </div>
      <div class="confirm-btn">
        <van-button class="operate-btn" size="medium" block @click="changeQtyHandle">Confirm</van-button>
      </div>
    </div>

    <van-dialog v-model="infoVisible">
      <common-dialog type="info"
                     title="Warning"
                     cancelText="Cancel"
                     :hasTwoBtn="true"
                     confirmBorder="#fcc900"
                     @confirmEmit="confirmHandle"
                     confirmBg="#fcc900"
                     @cancelEmit="hidePopHandle"
                     :intro="`Are you sure you want to delete 1 quantities?`"/>
    </van-dialog>
  </section>

</template>

<script>
import CommonDialog from '@/components/common/CommonDialog'
import {
  cartUpdateQtyApi ,
} from '@/api/cart'
export default {
  name: "index",
  components:{CommonDialog},
  props: {
    selectProduct:{type:Object,default:()=>{}}
  },
  data(){
    return{
      qty:0,
      infoVisible:false,

    }
  },
  watch:{
    selectProduct:{
      deep:true,
      immediate:true,
      handler(newVal){
        if(newVal){
          this.qty = newVal.qty;
        }
      }
    }
  },
  methods:{
    confirmHandle(){
      this.confirmQtyHandle()
    },
    hidePopHandle(){
      this.infoVisible = false;
    },
    changeQtyHandle(){
      if(this.qty>0){
        this.confirmQtyHandle();
      }else{
        this.infoVisible = true;
      }
    },
    confirmQtyHandle(){
      const {id,shoporderid} = this.selectProduct;
      cartUpdateQtyApi({
        did:id,
        id:shoporderid,
        qty:this.qty
      }).then(res=>{
        if(res.status==500){
          return this.$toast({message:res.message})
        }
        this.infoVisible = false;
        if(res.data.info){
          this.$emit('uptoMaxEmit',{
            shoporderid,
            list:res.data.list,
            totalzar:res.data.totalzar
          })
        }else{
          this.$toast({message:'Commodity modified successfully'})
          this.$emit('changeSuccessEmit',{
            shoporderid,
            list:res.data.list,
            totalzar:res.data.totalzar
          })
        }

      })
    },
    qtyOperateHandle(type){
      if(type==='add'){
        this.qty ++;
      }else if(type==='minus'){
        if(this.qty>0){
          this.qty --;
        }else{
          this.qty =0;

        }
      }
    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="less">
  /deep/.van-dialog__footer{
    display: none ;
  }
.count-operate-box{
  padding:20px 15px;

}
.count-operate-wrapper{
  .count-left,.count-right{
    width:40px;
    height:40px;
    display: flex;
    justify-content: center;align-items: center;
    border-top:1px solid #EEEEED;
    border-bottom:1px solid #eeeeed;
  }
  .count-left{
    border-left: 1px solid #EEEEED;
  }
  .count-right{
    border-right: 1px solid #EEEEED;
  }
  .count-inner{
      flex:1;
      height:42px;
    .count-input{
      height:42px;
      line-height:42px;
      font-size:20px;
      background-color: #fff;
      border:1px solid #EEEEED;
    }
    /deep/.van-icon-search,/deep/.van-icon-clear{
      display: none;
    }
    /deep/.van-search__content{
      background-color: #fff;
    }
    /deep/.van-field__control{
      text-align: center;
    }
  }
}
.confirm-btn{
  margin-top: 20px;
  .operate-btn{
    border-radius: 6px;
    background:#fcc900;
  }
}
</style>
