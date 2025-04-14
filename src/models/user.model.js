import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
{
    username: 
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    email: 
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    fullname:
    {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    avatar:
    {
        type: string,
        required: true,
    },

    coverImage:
    {
        type: string,
    },

    watchHistory:
    [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

    password:
    {
        type: String,
        required: [true, `Password is required`],
    },

    refreshToken:
    {
        type: String,
    },

},
{
    timestamps: true
}
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    // if(this.isNew){
    //     this.password = await bcrypt.hash(this.password, 10);
    //     return next();
    // }
    this.password = bcrypt.hash(this.password, 10);   
    next();
})

userSchema.methods.ispasswordcorrect = async function(password){
    return await bcrypt.compare(password, this.password)
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname,
            avatar: this.avatar,
            coverImage: this.coverImage,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    userSchema.methods.generateAccessToken = function(){
        return jwt.sign(
            {
                _id: this._id,
                // username: this.username,
                // email: this.email,
                // fullname: this.fullname,
                // avatar: this.avatar,
                // coverImage: this.coverImage,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        )
    }
}

export const User = mongoose.model("User", userSchema);