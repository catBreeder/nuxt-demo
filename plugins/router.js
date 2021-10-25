
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
export default ({app})=>{
    app.router.beforeEach((to,from,next)=>{
        NProgress.start();
        document.title = `${to.meta.content}-shopshipshake`;
        next()
    })
    app.router.afterEach((to,from)=>{
        NProgress.done();
    })
}