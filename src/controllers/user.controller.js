import { asyncHandler } from "../untils/asyncHandler";
import {ApiError} from "../untils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadcloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../untils/ApiResponse.js";

const register = asyncHandler(async (req, res) => {
    // {
    //      res.status(200).json({
    //         message: "ok",
    //         // user: req.body
    //     });
    // }



   const {fullname, email, username, password } = req.body 
   console.log("fullname", fullname);
    // console.log("email", email);
    // console.log("username", username);

    // if(fullname ===""){
    //     throw new ApiError(400, "fullname is required")
    // }
    

    if(
        [fullname, email, username, password].some( (field) => field?.trim() === "" )
    )
    {
        throw new ApiError(400, "All fields are required")
    }

   const existedUser = User.findOne({
        $or: [
            {
                username
            }, 
            {
                email
            }
        ]
    }) 
    if(existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path  

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

   const user = await User.create ({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase(),
    })


    user.findById(user._id).select("-password -refreshToken")

    if(!createduser)
 
        {
            throw new ApiError(500, "Something went wrong while registering user")
        }

        return res.status(201).json(
            new ApiResponse(200, createUuser, "User created successfully")
        ) 
});


//get user details from frontend
// validation - not empty
// checkif user already exists : email, user name
//check images, check for avatar
// upload them to cloudainary , avatar
// create user object - create entry in db
// remove password and refresh token field from responce
// check for user creation
// return res


export {registerUser}