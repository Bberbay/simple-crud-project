<template>
    <div class="table-container">
    <table id="example" class="table table-striped" style="width:100%"  v-if="orders.length > 0">
        <thead>
        <tr class="btn-dark">
            <th v-for="(title,key) in titles" :key="key">
                {{title}}
            </th>
            <th>
                Actions
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(order,index) in orders" :key="index" >
            <td>{{order.id}}</td>
            <td >{{order.orderDate}}</td>
            <td >{{order.description}}</td>
            <td >{{order.paymentType}}</td>
            <td >{{order.orderDetails}}</td>
            <td >{{order.customerName}}</td>
            <td>
                <b-button class="mr-1" size="sm" @click="deleteOrder(order.id)">
                    <b-icon-trash-fill></b-icon-trash-fill>
                </b-button>
                <b-button size="sm" @click="editOrder(order.id)">
                    <b-icon-pencil-fill></b-icon-pencil-fill>
                </b-button>
            </td>
        </tr>
        </tbody>
    </table>
            <b-button @click="addOrder"  variant="dark">Add Order</b-button>
        <div>
            <form>
                <b-modal
                    v-model="show"
                    :title="`${formActionTitle} ${this.$store.state.selectedItem}`"
                >
                    <b-container fluid>
                        <b-row class="mb-1 text-left">
                            <b-col cols="3"></b-col>
                        </b-row>

                        <b-row class="mb-1">
                            <b-col cols="4">ID</b-col>
                            <b-col>
                                <b-form-input v-model="formData.id" required
                                ></b-form-input>
                            </b-col>
                        </b-row>

                        <b-row class="mb-1">
                            <b-col cols="4">Order Date</b-col>
                            <b-col>
                                <b-form-datepicker v-model="formData.orderDate" required
                                ></b-form-datepicker>
                            </b-col>
                        </b-row>

                        <b-row class="mb-1">
                            <b-col cols="4">Description</b-col>
                            <b-col>
                                <b-form-input v-model="formData.description" required
                                ></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row class="mb-1">
                            <b-col cols="4">Payment Type</b-col>
                            <b-col>
                                <b-form-input v-model="formData.paymentType" required
                                ></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row class="mb-1">
                            <b-col cols="4">Order Details</b-col>
                            <b-col>
                                <b-form-textarea v-model="orderDetailsInput" required
                                ></b-form-textarea>
                            </b-col>
                        </b-row>
                        <b-row class="mb-1">
                            <b-col cols="4">Customer Name</b-col>
                            <b-col>
                                <b-form-input v-model="formData.customerName" type="text" required
                                ></b-form-input>
                            </b-col>
                        </b-row>
                    </b-container>

                    <template #modal-footer>
                        <div class="w-100">
                            <b-button
                                variant="primary"
                                size="sm"
                                class="float-right"
                                @click="formActionTitle === 'Add' ? onSubmit() : editOrderModal(editOrderParam) "
                            >
                                Submit
                            </b-button>
                        </div>
                    </template>
                </b-modal>
            </form>
        </div>

    </div>
</template>

<script>
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import axios from "axios";

export default {
    data() {
        return {
            show: false,
            formActionTitle : 'Add',
            orders : [],
            orderDetailsInput: '',
            editOrderParam: null,
            titles:{
                idTitle : "ID",
                orderDate : "Order Date",
                Description : "Description",
                paymentType : "Payment Type",
                orderDetails : "Order Details",
                customerName : "Customer Name",
            },
            formData: {
                id: null,
                orderDate: '',
                description: '',
                paymentType: '',
                orderDetails: [],
                customerName: '',
            }
        }
    },
    mounted() {
        $(document).ready(function () {
            $('#example').DataTable();
        });
        this.fetchProducts();
    },
    destroyed() {
        $(document).ready(function () {
            $('#example').DataTable().destroy();
        });
    },
    methods: {
        onSubmit(){
            this.formData.orderDetails = this.orderDetailsInput.split(',');
            axios.post("/orders",this.formData)
                .then(response =>{
                    console.log(response.data);
                    this.orders.push(this.formData);
                    this.clearFormData();
                })
                .catch(error=>{
                    console.log(error);
                })
            this.show=false
        },
        addOrder(){
            this.show = true;
            this.formActionTitle = 'Add'
            this.clearFormData();
        },
        deleteOrder(orderId) {
            axios.delete(`/orders/${orderId}`)
                .then(response =>{
                    const index = this.orders.findIndex(order => order.id === orderId);
                    if (index !== -1){
                        this.orders.splice(index,1);
                    }
                    console.log("Delete Success",response.data);
                })
                .catch(error=>{
                    console.log(error);
                })
        },
        editOrder(orderId){
            this.formActionTitle = 'Edit';
            this.show = true;
            this.editOrderParam = orderId;
            const editedOrder = this.orders.find(order => order.id === orderId)
            this.formData.id = editedOrder.id;
            this.formData.orderDate = editedOrder.orderDate;
            this.formData.description = editedOrder.description;
            this.formData.paymentType = editedOrder.paymentType;
            this.orderDetailsInput = editedOrder.orderDetails;
            this.formData.customerName = editedOrder.customerName;

        },
        editOrderModal(orderId){
            this.formData.orderDetails = this.orderDetailsInput.split(',');
                axios.put(`/orders/${orderId}`,this.formData)
                    .then(response=>{
                        console.log("Update Success");
                        console.log(response.data);
                        this.clearFormData();
                        this.show=false;
                        this.fetchProducts();
                })
                    .catch(error=>{
                        console.log(error)
                    })
            },
        fetchProducts() {
            axios.get("/orders")
                .then(response => {
                    this.orders = response.data.map(order => {
                        return {
                            id: order.id,
                            orderDate: order.orderDate,
                            description: order.description,
                            paymentType: order.paymentType,
                            orderDetails: order.orderDetails.join(","),
                            customerName: order.customerName
                        };
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        },
        clearFormData() {
            this.formData = {
                id : null,
                orderDate: '',
                description: '',
                paymentType: '',
                customerName: ''
            };
            this.orderDetailsInput = ''
        }
    }
}
</script>

<style>
.table-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.table-container table {
    margin-bottom: 10px;
}
</style>
