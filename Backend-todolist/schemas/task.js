const Ajv = require("ajv");
const addFormats=require("ajv-formats");

const ajv = new Ajv({allErros:true});
addFormats(ajv);

const schema={
    type:"object",
    properties:{
        name:{type:"string",maxLength:255},
        status:{type:"string",enum:["OPEN","IN PROGRESS","DONE"]},
        priority:{type:"string",enum:["LOW","MEDIUM","HIGH"]},
    },
    required:["name","status","priority"],
    additionalProperties:false,
}

module.exports=ajv.compile(schema);