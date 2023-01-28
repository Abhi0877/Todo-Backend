const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const { v4: uuidV4 } = require("uuid")
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })



const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const randomSt = uuidV4();
        if (!name || !email || !password)
            return res.status(400).send({ status: false, msg: "mandatory field missing" })

        const duplicateEmail = await userModel.findOne({ email }).count()
        if (duplicateEmail == 1)
            return res.status(400).send({ status: false, msg: "Email is already registered" })



        const savedData = await userModel.create({ name, email, password })

        res.status(201).send({ status: "Success", msg: "Registration Done" })
    }
    catch (error) {
        res.status(500).send({ status:  "Failure", msg: "Internal Server Error" })
    }
}



const login = async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).send({ status: false, msg: "mandatory field missing" })

        const user = await userModel.findOne({ email, password }).select({ password: 0 }).lean()

        if (!user)
            return res.status(400).send({ status: false, msg: "invalid Credentials" })

        const token = jwt.sign({ id: user._id }, "extraSecurity")
        res.cookie("x-api-key", token,
            {
                expires: new Date((new Date).getTime() + (7 * 24 * 60 * 60 * 1000)),
            })
        return res.status(200).send({ status: "Success", msg: 'Login Successfull', data: user })

    } catch (error) {
        return res.status(500).send({ status: "Failure", msg: "Internal Server Error" })
    }


}

const sendResetPasswordLink = async (req, res) => {

    try {
        const { email } = req.body;
        const uuid = uuidV4()
        const isValidUser = await userModel.findOneAndUpdate({ email }, { randomPassSt: { st: uuid, date: new Date(new Date().getTime() + (20 * 60 * 1000)), used: false } }).lean()
        if (!isValidUser)
            return res.status(400).send({ status: false, msg: "this email is not a registerd email" })


        res.status(200).send({ status:  "Success", msg: "Reset Password Link has been sent. ", data:{token :uuid,userId:isValidUser._id} })

        // userModel.findByIdAndUpdate(isValidUser._id, )
    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }


}

const isValidRPLink = async (req, res) => {

    try {

        const { userId, randomSt } = req.params

        const isValid = await userModel.findOne({ _id: userId, isDeleted: false, "randomPassSt.st": randomSt, "randomPassSt.used": false }).lean()
        if (!isValid)
            return res.status(400).send({ status: false, msg: "invalid link" })

        if (isValid.randomPassSt.date.getTime() < new Date().getTime())
            return res.status(400).send({ status: false, msg: "This link is expired" })

        if (isValid.randomPassSt.used == true)
            return res.status(400).send({ status: false, msg: "This link can be used only once" })

        res.status(200).send({ status: "Success", msg:'Valid Link'  })

    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }


}

const resetPassword = async (req, res) => {

    try {
        const { userId, randomSt } = req.params
        const { password } = req.body
        const userData = await userModel.findOneAndUpdate({ _id: userId, _id: userId, isDeleted: false, "randomPassSt.st": randomSt, "randomPassSt.used": false }, { "randomPassSt.used": true, password })
        if (!userData)
            return res.status(400).send({ status: false, msg: "Invalid link" })

        return res.status(200).send({ status: true, msg: "Success", data: "Password Reset Successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }



}

module.exports = { register, login,  sendResetPasswordLink, isValidRPLink, resetPassword }