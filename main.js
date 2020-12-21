import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";

new Vue({
    el: "#app",
    // render(createElement) {
    //     return createElement(App);
    // },
    router,
    store,
    render: (h) => h(App),
});
