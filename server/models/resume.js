
import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    title:{type:String, default:'Untitle Resume'},
    public:{type:String, default:false},
    templates:{type:String, default:'classsic'},
    accent_color:{type:String, default:'#3B82F6'},
    professional_summary:{type:String, default:''},
    skills:[{type:String}],
    personal_info:{
        image:{type:String,default:''},
        full_name:{type:String,default:''},
        profession:{type:String,default:''},
        email:{type:String,default:''},
        phone:{type:String,default:''},
        location:{type:String,default:''},
        linkedin:{type:String,default:''},
        website:{type:String,default:''},
    },

    experience:[
        {
            company:{type:String},
            position:{type:String},
            start_date:{type:String},
            end_date:{type:String},
            description:{type:String},
            is_current:{type:Boolean},
        }
    ],
    project:[
        {
            name:{type:String},
            type:{type:String},
            description:{type:String},
        }
    ],
    education:[
        {
            institution:{type:String},
            degree:{type:String},
            filed:{type:String},
            graduation_date:{type:String},
            gap:{type:String},
        }
    ],

},{timestamps:true, minimize:false})

const Resume = mongoose.model('Resume', ResumeSchema)

export default Resume;