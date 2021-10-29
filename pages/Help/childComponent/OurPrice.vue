<template>
  <div class="our-price-wrapper">
    <scroll-view class="scrollViewHeight">
      <price-modal title="The total cost" intro=" = Product Price + China Freight + Service Fee + International Freight (+ clearance), including:"/>
      <price-modal title="Product Price：" intro=" The price of the product."/>
      <price-modal title="China Freight：" intro=" The freight of Goods shipped from the seller to our partner’s warehouse."/>
      <price-modal title="Service Fee：" intro=" (Product Price+ China Freight) x 4-6%."/>
      <price-modal title="Currency Translation：" intro=" (Product Price+ China Freight + Service Fee) x 2%, for ZAR/USD payment"/>
      <price-modal title="International freight：" intro=" This freight is charged according to your goods weight/volumetric weight)"/>
      <price-modal title="*Exchange Rate：" intro=" Updated weekly according to the floating of exchange rate"/>
      <price-modal title="Storage free period：" :intro='`60 days, calculated from the order status of "collected" . After the free storage period ends：`'/>
      <price-modal  intro="
                      1. The storage rate for 1 order is R10 per day per cubicmeter( at least R1) in the first month, and R20 in the second month."/>
      <price-modal  intro="
                      2. If you have not submitted parcel delivery order or offered no feedback after further 30 days, the items will be automatically deem abandoned and processed as overdue (in this case, SSS will have the ownership of it).
                                      "/>
      </scroll-view>
  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
import PriceModal from './Modal/PriceModal'
export default {
  name: "OurPrice",
  components:{PriceModal,ScrollView}
}
</script>

<style scoped lang="less">
.our-price-wrapper{
  font-size:14px;

}
.scrollViewHeight{
  height:calc(100vh - 50px - 50px)
}
</style>
