import mongoose, { Schema } from 'mongoose';

const eventBlink: Schema= new Schema({
    userId: {type:String,required:true},
    eventId: {type:String,required:true},
    userName: {type:String,required:true},
    userEmail : {type:String,required:true},
    userRole : {type:String,required:true},
});

// Check if the model is already compiled
const UserBlink = mongoose.models.userBlinkDetails || mongoose.model('userBlinkDetails', eventBlink);

export default UserBlink;