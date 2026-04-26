import mongoose from "mongoose";
import { GenderEnums, ProviderEnums, RoleEnums } from '../../common/enums/enum.service';
import { type } from "node:os";

const userSchema = new mongoose.Schema({
   firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
   },
   lastName: {
     type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
   },
   email: {
    type: String,
    required: true,
    unique: true,
   },
   isVerfied: {
    type: Boolean,
    default: false
   },
   password: {
    type: String,
    required: true
   },
   age: {
    type: Number,
    required: true
   },
   sharedProfileName: {
    type: String,
    required: true,
    unique: true
   },
   image: {
    type: String
   },
   phone: String,
   DOB: String,
   gender: {
    type: String,
    enum: Object.values(GenderEnums),
    default: GenderEnums.Male
   },
   provider: {
    type: String,
    enum: object.values(ProviderEnums),
    default: ProviderEnums.System 
   },
   role:{
    type: String,
    enum: object.values(RoleEnums),
    default: RoleEnums.System
   },
   viewsCount: {
    type: Number,
    default: 0
   },
   twoStepVerfication: {
    type: Boolean,
    default: false
   },
},{
    timestamps: true
})


userSchema.virtual('userName').set(function (value) {//Bebo Ahmed => ['bebo, 'Ahmed']
    let [firstName , lastName] = value.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
}).get(function(){
    return `${this.firstName} ${this.lastName}`;
})

export const userModel = mongoose.model('users',userSchema);