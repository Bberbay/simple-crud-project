import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state : {
        selectedItem : "products",
    },
    getters : {
        itemSelector(state) {
            return state.selectedItem;
        },
    }
})