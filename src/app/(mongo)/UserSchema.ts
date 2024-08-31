import mongoose, { Schema } from 'mongoose';

const eventBlink: Schema= new Schema({
    userId: {type:String,required:true},
    userName: {type:String,required:true},
    userEmail : {type:String,required:true},
    userRole : {type:String,required:true},
});

// Check if the model is already compiled
const UserBlink = mongoose.models.userData || mongoose.model('userData', eventBlink);

export default UserBlink;