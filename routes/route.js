const express = require("express")
const router = express.Router();
const {authentication} = require("../middleware/auth")
const userController = require("../controller/userController")
const dashboardController = require('../controller/dashboardController')

router.post("/api/users/login",userController.login)

router.post("/api/users",userController.register)


router.get("/api/users/:userId/isvrpl/:randomSt",userController.isValidRPLink)
router.post("/api/users/:userId/rp/:randomSt",userController.resetPassword)
router.post("/api/users/resetPasswordLink",userController.sendResetPasswordLink)

router.get('/api/tasks',dashboardController.getTasks)
router.post('/api/tasks',dashboardController.createTask)
router.put('/api/tasks',dashboardController.editTask)
router.delete('/api/tasks',dashboardController.deleteTask)
module.exports =router