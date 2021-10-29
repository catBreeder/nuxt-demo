<template>
  <div class="shipping-wrapper">
      <div class="shipping-item">● Door to door express</div>
      <div class="shipping-item">
        ● Shopping within 24 hours</div>
      <div class="shipping-item">
        ● China logistics takes 2-7 days (usually around 3 days, if the stock is available)</div>
      <div class="shipping-item">
        ● International logistics: standard 3-7 days; “1/8000” 5-12 days and save 37.5% on volumetric weight</div>
      <div class="shipping-item">
        ● Volumetric weight: Because the cost of a shipment can be affected by the amount of space that it occupies on an aircraft or a cargo ship, rather than the actual weight. This is the volumetric (or dimensional) weight. the formula is length*width*height/volumetric factor, all in CM</div>
    <div class="shipping-item">

      ● Volumetric factor: standard is 5000, “1/8000” is 8000
    </div>
  </div>
</template>

<script>
export default {
  name: "Shipping"
}
</script>

<style scoped lang="less">
.shipping-wrapper{
  color:#3d4145;
  font-size:14px;
  line-height:2;
}
.shipping-item{
  margin-bottom: 10px;
}
</style>
