<template>
  <div class="input-field">
    <div class="input-field-name d_flex">
      {{label}} <span class="color_warning" v-if="isRequired">*</span>
      <slot name="extra"></slot>
    </div>
    <div class="input-field-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    props:{
      label:String,
      isRequired:{type:Boolean,default:true}
    }
  }
</script>

<style scoped lang="less">
  .input-field{
    margin-bottom: 14px;
    .input-field-name{
      font-weight: bold;
      font-size:15px;
      margin-bottom: 8px;
    }
    span{
      margin-left:4px;
    }

  }
</style>
