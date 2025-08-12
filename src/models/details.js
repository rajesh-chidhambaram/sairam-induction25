import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
    id: { 
        type: String,
        required: [true, 'Admission ID is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Admission ID must be at least 3 characters'],
        maxlength: [20, 'Admission ID cannot exceed 20 characters'],
        match: [/^[A-Za-z0-9]+$/, 'Admission ID can only contain letters and numbers']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    parentCount: {
        type: Number,
        default: 0,
        min: [0, 'Accompanying count cannot be negative'],
        max: [10, 'Maximum 10 people can accompany'],
        validate: {
            validator: Number.isInteger,
            message: 'Accompanying count must be a whole number'
        }
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

// Pre-save middleware to update the updatedAt field
userDetailsSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Instance method to get sanitized user data for response
userDetailsSchema.methods.toResponseJSON = function() {
    return {
        id: this.id,
        name: this.name,
        parentCount: this.parentCount,
        updatedAt: this.updatedAt
    };
};

export default mongoose.models.UserDetails || mongoose.model("UserDetails", userDetailsSchema);