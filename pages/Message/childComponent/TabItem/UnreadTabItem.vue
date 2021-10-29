
<!--UnreadTabItem-->
<template>
  <div>
    <message-list-item
      v-mag-exp :data-info="`${item.id}@${item.type}@${item.readflg}`"
      :tabIndex="tabIndex+1" v-for="(item,index) in messageList" :key="index" :item="item" :index="index"/>
  </div>
</template>

<script>
import MessageListItem from "../MessageListItem";
export default {
  name: "UnreadTabItem",
  components:{MessageListItem},
  props:{
    tabIndex:{
      type:Number | String,
      item:{
        type:Object,
        default:()=>{}
      },
      messageList:{
        type:Array,
        default:()=>[]
      }
    }
  }
}
</script>

<style scoped>

</style>
