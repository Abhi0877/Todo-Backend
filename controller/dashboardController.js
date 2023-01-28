
const userModel = require("../models/userModel")
const taskModel = require("../models/taskModel")

const createTask = async (req,res)=> {
    try {
        const {title,description,priority,status} = req.body

        if(!title || !description || !priority || !status) return res.status(400).send({status:'Failure',msg:'Provide valid task '})

        const savedTask = await taskModel.create({title,description,priority,status})

        res.status(201).send({status:'Success',msg:'Task Created'})

    } catch (error) {
        res.status(500).send({status:'Failure',msg:'Internal Server Error'})
    }
}
const getTasks = async (req,res)=> {
    try {
        const tasks = await taskModel.find({isDeleted:false})
        res.status(200).send({status:'Success',msg:'Task Fetched',data:tasks})
    } catch (error) {
        res.status(500).send({status:'Failure',msg:'Internal Server Error'})
    }
}

const editTask = async (req,res)=> {
    try {
        const {title,description,priority,status,id} = req.body

        if(!title || !description || !priority || !status) return res.status(400).send({status:'Failure',msg:'Provide valid task '})

        const savedTask = await taskModel.findOneAndUpdate({_id:id,isDeleted:false},{title,description,priority,status})

        if(!savedTask)
        res.status(404).send({status:'Success',msg:'No Task Found'})

        res.status(200).send({status:'Success',msg:'Task Updated'})

    } catch (error) {
        res.status(500).send({status:'Failure',msg:'Internal Server Error'})
    }
}

const deleteTask = async (req,res)=> {
    try {
        const {id} = req.body


        const savedTask = await taskModel.findOneAndUpdate({_id:id,isDeleted:false},{isDeleted:true})

        if(!savedTask)
         return res.status(404).send({status:'Success',msg:'No Task Found'})

        res.status(200).send({status:'Success',msg:'Task Deleted'})

    } catch (error) {
        res.status(500).send({status:'Failure',msg:'Internal Server Error'})
    }
}



module.exports = { createTask, getTasks ,editTask,deleteTask}