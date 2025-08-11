import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
    id:{ 
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    parentCount:{
        type: Number,
        default: 0,
    }
});

export default mongoose.models.UserDetails || mongoose.model("UserDetails", userDetailsSchema);