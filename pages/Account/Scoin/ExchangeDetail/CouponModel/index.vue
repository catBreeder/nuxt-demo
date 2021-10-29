<template>
  <div class="exchange-detail-content">
    <div class="content">
      <van-row class="card-content">
        <van-col span="8" offset="2">
          <div class="card-content-price">
            <div class="price-title_r price-title">R</div>
            <div class="price-title"> 3000</div>
          </div>
        </van-col>
        <van-col span="11">
          <div class="card-content-desc">
              <div class="desc-upon">UPON R2000</div>
              <div class="desc-for">For Shopping</div>
          </div>
        </van-col>
      </van-row>
    </div>
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
  name: "index"
}
</script>

<style scoped lang="less">
.exchange-detail-content{
  padding:10px 6px 90px;
  background-color:#EEEEED;
  .content {
    width: 90%;
    height: 100px;
    margin: auto;
    -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60.031' height='60.031' viewBox='0 0 60.031 60.031'%3E%3Cpath d='M40 60.027H20.129A20.065 20.065 0 0 0 .065 40H0V20.127h.065A20.066 20.066 0 0 0 20.131.061v-.065H40v.065a20.065 20.065 0 0 0 20.027 20.064V40A20.063 20.063 0 0 0 40 60.027z' fill-rule='evenodd'/%3E%3C/svg%3E") 20;
    background: linear-gradient(45deg, orange, red);
  }
  /deep/.van-cell{
    border-radius: 10px;
  }
  /deep/.van-cell__label{
    color:#000;
  }
  .card-content{
    .card-content-price{
      height: 100px;
      display: flex;
      padding-right:10px;
      flex-direction: column;
      justify-content: center;
      //align-items: center;
      border-right:1px dashed #fff;
      .price-title{
        font-size:35px;
        text-shadow: 2px 2px 0px grey;
      }
      .price-title_r{
        text-align: left;
      }
    }
    .card-content-desc{
      padding-top:30px;
      text-align: center;
      color:#fff;
      .desc-upon{
          font-size:18px;
        margin-bottom: 10px;
      }
      .desc-for{
          text-align: right;
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
