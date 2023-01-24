const express = require('express');
const connection = require('../connection')
const router = express.Router();

const {
	
	getAssignOrders,
	getOperators,
	addUser,
	getRoles,
	editUser

} = require('../modules/operators')

router.get('/get_assigned_order',(req,res,next)=>{
    
    getAssignOrders(res,req.query.opt_id)
	next(err)
	//return res.status(200).json(resResult)
});

router.get('/get_operators',(req,res,next)=>{
    
    getOperators(res)
	next(err)
	//return res.status(200).json(resResult)
});

router.post('/addUser',(req,res,next)=>{
    
	let userData = req.body;
	
    addUser(res,userData)
	next(err)
	//return res.status(200).json(resResult)
});

router.post('/editUser',(req,res,next)=>{
    
	let userData = req.body;
	
    editUser(res,userData)
	next(err)
	//return res.status(200).json(resResult)
});

router.get('/get_roles',(req,res,next)=>{
    
    getRoles(res)
	next(err)
	//return res.status(200).json(resResult)
});

router.use(function(err,req,res,next){
	
	res.status(500);
	return res.status('Oops, Someting went wrong: '+err);
})

/* const {
	
	getApiOrders,
	orderDetailsById,
	getEmployees,
	getAssignedOperator,
	getOfflineDepartmentOrders,
	addOfflineOrders

} = require('../modules/orders_module')

router.get('/get',(req,res,next)=>{
    
    getApiOrders(res,req.query.department,req.query.oes)
	next(err)
	//return res.status(200).json(resResult)
});

router.get('/orderDetailsById',(req,res,next)=>{
    
    orderDetailsById(res,req.query.track_id)
	next(err)
	//return res.status(200).json(resResult)
});

router.get('/getEmployees',(req,res,next)=>{
    
    getEmployees(res)
	next(err)
	//return res.status(200).json(resResult)
});

router.get('/getAssignedOperator',(req,res,next)=>{
    
    getAssignedOperator(res,req.query.track_id)
	next(err)
	//return res.status(200).json(resResult)
});

router.get('/get_offline_orders',(req,res,next)=>{
    
    getOfflineDepartmentOrders(res,req.query.department)
	next(err)
	//return res.status(200).json(resResult)
});

router.post('/offline_order_add',(req,res)=>{
	
    let ordersData = req.body;
	    
	addOfflineOrders(res,ordersData)
	next(err)
});

router.use(function(err,req,res,next){
	
	res.status(500);
	return res.status('Oops, Someting went wrong: '+err);
}) */
	

module.exports = router;
