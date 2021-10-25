export default ({$axios},inject)=>{
    //test方法注入到context/vue/store中
    inject('test',data=>$axios.$get('/test'))
    inject('test2',()=>$axios.$post('/test'))
}