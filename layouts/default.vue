<template>
    <div>
        <Header/>
        <div class="common_main">
            <nuxt/>
        </div>
        <Footer/>
    </div>
</template>
<script>


import Header from '../Layout/Header.vue'
import Footer from '../Layout/Footer.vue'
export default {
    components:{
        Header,
        Footer
        
    }
}
</script>
<style scoped>

.common_main{
    padding-top:90px;
    max-width:1140px;
    margin:0 auto;
    
}
</style>