<template>
  <div class="exchange-detail-content">
    <van-cell title="Card Type"  >
      <template #label>
        <van-row gutter="12">
          <van-col span="8">
            <div class="card-item " :class="{'border-active':cardType===1}">
              <div class="card-item-img">
<!--                <img src="~assets/images/Account/scoin.png" alt="">-->
              </div>
              <div class="card-item-info">
                <div class="card-item-name">Platinum</div>
                <div class="card-item-price">30000 S Coin</div>
                <div class="card-item-month">pre month</div>
              </div>
            </div>
          </van-col>
          <van-col span="8">
            <div class="card-item" :class="{'border-active':cardType===2}">
              <div class="card-item-img">
<!--                <img src="~assets/images/Account/scoin.png" alt="">-->
              </div>
              <div class="card-item-info">
                <div class="card-item-name">Golden</div>
                <div class="card-item-price">30000 S Coin</div>
                <div class="card-item-month">pre month</div>
              </div>
            </div>
          </van-col>
          <van-col span="8">
            <div class="card-item" :class="{'border-active':cardType===3}">
              <div class="card-item-img">
<!--                <img src="~assets/images/Account/scoin.png" alt="">-->
              </div>
              <div class="card-item-info">
                <div class="card-item-name">Platinum</div>
                <div class="card-item-price">30000 S Coin</div>
                <div class="card-item-month">pre month</div>
              </div>
            </div>
          </van-col>
        </van-row>
      </template>
    </van-cell>
    <van-cell title="Member description"  class="g_mt_l">
      <template #label>
         <div class="member-desc-box">
           <div>1. You can enjoy the distinguished service of your members when you hold a card. Please take the initiative to show this card when you consume it.</div>
           <div>2. This card is a stored value/integral card. Please keep it properly. If it is lost, please report it to our store in time.</div>
           <div>3. Once this card is handled for non-store reasons, it will not be changed, presented or returned.</div>
           <div>4. This card is a real-name registration system membership card, which is for my own use only and cannot be lent to others.</div>
           <div>5. Please refer to the detailed membership system announcement and official website in the store for detailed membership card usage rules.</div>
           <div>6. The final interpretation right of this card belongs to our store.</div>
           <div>7. The validity period of this card shall be subject to the contract and calculated from the card opening date.</div>
           <div>8. This card can be used universally in all chain stores of our company.</div>
         </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "index",
  props:['memberShipType'],
  data(){
    return{
      cardType:1
    }
  },
  watch:{
    memberShipType:{
      deep:true,
      immediate:true,
      handler(newVal){
        if(newVal){
          this.cardType = Number(newVal)
        }
      }
    }
  },
}
</script>

<style scoped lang="less">

.exchange-detail-content{
  padding:10px 6px 90px;
  background-color:#EEEEED;
  /deep/.van-cell__title{
    font-size:16px;
    font-weight: bold;
  }
/deep/.van-cell{
  border-radius: 10px;
}
/deep/.van-cell__label{
  color:#000;
}
.border-active{
  border:1px solid #FCC900;
}
  .card-item{
  display: flex;
  flex-direction: column;
  text-align: center;
  color:#000;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 0 3px lightgrey;
  padding:10px 0;
  border-radius: 8px;
.card-item-img{
  height:30px;
  width:30px;
  margin-bottom: 10px;
img{
  width:100%;
  height:100%;
  object-fit: cover;
}
}
.card-item-info{
.card-item-name{
  margin-bottom: 6px;
  font-size:14px;
  font-weight: 400;
}
.card-item-price{
  margin-bottom: 4px;
  font-size:13px;
  color:#ff0000;
  font-weight: 400;
}
.card-item-month{
  color:gray;
  font-size:12px;
  font-weight: 400;
}
}
}
  .member-desc-box{
    font-size:15px;
    font-weight: 400;
    line-height:1.6;
    div{
      margin-bottom: 8px;
    }
  }
}
</style>
