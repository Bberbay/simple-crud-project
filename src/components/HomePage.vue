<template>
  <div class="container-xl">
      <h1 class="Title"> Simple CRUD Project</h1>
          <div class="mt-5">
              <b-button-group class="d-flex justify-content-between mb-4">
                  <b-button class="mr-4 btnProducts" size="lg" @click="TableSelect('products')">Products</b-button>
                  <b-button class="ml-4 btnOrders" size="lg" @click="TableSelect('orders')" >Orders</b-button>
              </b-button-group>
          </div>
      <div v-if="this.$store.state.selectedItem === 'orders'">
          <OrderTable/>
      </div>
      <div v-else-if="this.$store.state.selectedItem === 'products'">
          <ProductTable/>
      </div>
  </div>
</template>

<script>
import OrderTable from "@/components/OrderTable.vue";
import ProductTable from "@/components/ProductTable.vue";
export default {
    data(){
      return{
          show: false,
      }
    },
    methods:{
        TableSelect : function (selectedTable) {
            this.$store.state.selectedItem = selectedTable;
        },
    },
    components :{
        OrderTable,
        ProductTable
    }
}
</script>

<style scoped>
.Title {
    color: black;
}
.btnProducts {
    background-color: rgba(32,33,35);
    color: white;
}
.btnOrders {
    background-color: rgba(32,33,35);
    color: white;
}
</style>
