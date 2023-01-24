const express = require('express');
const connection = require('../connection')
const router = express.Router();

const {
	
	getApiOrders,
	orderDetailsById,
	getEmployees,
	getAssignedOperator,
	getOfflineDepartmentOrders,
	addOfflineOrders,
	getImportOfflineOrdersAndSave

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
	
    //query = "insert into services(name,department_id,order_from_id,modified,created) values(?,?,?,Now(),Now())"
	
	/* connection.query(query,[service.name,service.department,service.order_from],(err,results) =>{

		if(!err){
			return res.status(200).json({message:"Service successfully Created"})
		}
		else{
			return res.status(500).json(err);
		}
	}) */
	
	addOfflineOrders(res,ordersData)
	next(err)
});

router.post('/get_import_offline_orders',(req,res,next)=>{
    
	let importOrdersData = req.body;
	
    getImportOfflineOrdersAndSave(res,importOrdersData)
	next(err)
	//return res.status(200).json(resResult)
});

router.use(function(err,req,res,next){
	
	res.status(500);
	return res.status('Oops, Someting went wrong: '+err);
})
	

module.exports = router;


// Old_and_Initial key value of orders.rebooku.com API
//Username: ck_5fdc039ae348ebe63976cb499dac1ed428568598
//Password: cs_13f9048780b7a15b0e94264da7e0f94c0a30022a

//orders.rebooku.com
//--------------------------------------------
//ck_952b21ba4a6df96a247bd4b396b1c22356bb0c07

//cs_e3c5dfb59f31289bca613f236f4ffbebc9a62824

//https://order.fotofafa.com/orders.php?search=Extraction&consumer_key=ck_b4a1ab6f675acf7e3c9141757872ebe995297ef7&consumer_secret=cs_317e1bb1ffb17ebfb4d071411582b7c69add9146 (FotoFaFA
//--------------------------------------------
//consumer_key=ck_b4a1ab6f675acf7e3c9141757872ebe995297ef7

//consumer_secret=cs_317e1bb1ffb17ebfb4d071411582b7c69add9146

//https://order.rebookuusa.com/wp-json/wc/v3/orders?consumer_key=ck_16feded66b0a2ad09adb1223e469e47d19c61c28&consumer_secret=cs_c357c5f36169ad3dca1803c7421d8b785e714333 (PSM)
//https://order.rebookuusa.com/wp-json/wc/v3/orders?consumer_key=ck_16feded66b0a2ad09adb1223e469e47d19c61c28&consumer_secret=cs_c357c5f36169ad3dca1803c7421d8b785e714333 (PSM)

//consumer_key=ck_16feded66b0a2ad09adb1223e469e47d19c61c28

//consumer_secret=cs_c357c5f36169ad3dca1803c7421d8b785e714333

/* Extraction 
RBK (orders.rebooku.com)
PSM (order.rebookuusa.com)
GBSE (orders.rebooku.com)
OFFLINE (Link IMport)

Retouching 
RBK(orders.rebooku.com)
FAFA (order.fotofafa.com)
OFFLINE (Link IMport)

Album
RBK (orders.rebooku.com)
PSM (order.rebookuusa.com)
FAFA (order.fotofafa.com)
OFFLINE (Link IMport)

Wedding
RBK (orders.rebooku.com)
FAFA (order.fotofafa.com) */