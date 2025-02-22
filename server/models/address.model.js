import mongoose, { model } from "mongoose";
const addressSchema = new mongoose.Schema({
    address_line: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pincode: {
        type: String,
    },
    country: {
        type: String,
    },
    mobile: {
        type: Number,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})
const AddressModel = mongoose.Model("address", addressSchema)
export default AddressModel;