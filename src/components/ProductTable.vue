<template>
    <div class="table-container">
        <table id="example" class="table table-striped" style="width:100%"  v-if="products.length > 0">
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
            <tr v-for="(product,index) in products" :key="index" >
                <td>
                    {{product.name}}
                </td>
                <td >
                    {{product.price}}
                </td>
                <td >
                    {{product.createDate}}
                </td>
                <td >
                    {{product.id}}
                <td>
                    <b-button class="mr-1" size="sm" @click="deleteProduct(product.id)">
                        <b-icon-trash-fill></b-icon-trash-fill>
                    </b-button>
                    <b-button size="sm" @click="editProduct(product.id)">
                        <b-icon-pencil-fill></b-icon-pencil-fill>
                    </b-button>
                </td>
            </tr>
            </tbody>
        </table>
        <div>
            <b-button @click="show=true" variant="dark">Add Product</b-button>
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
                            <b-col cols="4">Name</b-col>
                            <b-col>
                                <b-form-input v-model="formData.name" required
                                ></b-form-input>
                            </b-col>
                        </b-row>

                        <b-row class="mb-1">
                            <b-col cols="4">Price</b-col>
                            <b-col>
                                <b-form-input v-model="formData.price" required
                                ></b-form-input>
                            </b-col>
                        </b-row>

                        <b-row class="mb-1">
                            <b-col cols="4">Create Date</b-col>
                            <b-col>
                                <b-form-datepicker v-model="formData.createDate" required
                                ></b-form-datepicker>
                            </b-col>
                        </b-row>
                        <b-row class="mb-1">
                            <b-col cols="4">ID</b-col>
                            <b-col>
                                <b-form-input v-model="formData.id" required
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
                                @click="formActionTitle === 'Add' ? onSubmit() : editProductModal(editProductParam)"
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
            products: [],
            formActionTitle: 'Add',
            show: false,
            editProductParam: null,
            titles: {
                name: "Name",
                price: "Price",
                createDate: "Create Date",
                id: "ID",
            },
            formData: {
                name: '',
                price: null,
                createDate: '',
                id: null,
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
        onSubmit() {
            axios.post("/products", this.formData)
                .then(response => {
                    console.log("POST Success");
                    console.log(response.data);
                    this.clearFormData();
                    this.fetchProducts();
                })
                .catch(error => {
                    console.log(error)
                });
            this.show = false;
        },
        deleteProduct(productId) {
            axios.delete(`/products/${productId}`)
                .then(response => {
                    console.log("Delete Success",response);
                    this.fetchProducts();
                })
                .catch(error => {
                    console.log(error)
                })
        },
        editProduct(productId) {
            this.formActionTitle = 'Edit'
            this.show = true;
            this.editProductParam = productId;
        },
        editProductModal(productId) {
            axios.put(`/products/${productId}`, this.formData)
                .then(response => {
                    console.log("Update Success");
                    console.log(response.data);
                    this.clearFormData();
                    this.show = false;
                    this.fetchProducts();
                })
                .catch(error => {
                    console.log(error)
                })

        },
    fetchProducts() {
        axios.get("/products")
            .then(response => {
                this.products = response.data.map(product => {
                    return {
                        name: product.name,
                        price: product.price,
                        createDate: product.createDate,
                        id: product.id,
                    };
                });
            })
            .catch(error => {
                console.error(error);
            });
    },
        clearFormData(){
            this.formData = {
                name: '',
                price: null,
                createDate: '',
                id: null,
            }
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
