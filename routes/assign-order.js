const express = require('express');
const connection = require('../connection')
const router = express.Router();

router.post('/add',(req,res)=>{
	
    let orderData = req.body;
	
	//{"track_id":"R0334184","number_of_images":"8","order_remaining":"5","id":137,"operator_remaining":"323","allocate_images":"55","target_hours":"66","tl_comments":"fsf sfsdf"}
		
    query = "insert into assign_orders (order_id,employee_id,no_of_images,order_remaining,operators_remaining,	target_hours,allocate_images,assign_date,tl_comments,modified,created) values(?,?,?,?,?,?,?,Now(),?,Now(),Now())"

	connection.query(query,[orderData.track_id,orderData.id,orderData.number_of_images,orderData.order_remaining,orderData.operator_remaining,orderData.target_hours,orderData.allocate_images,orderData.tl_comments],(err,results) =>{

		if(!err){
			return res.status(200).json({message:"Order assigned successfully"})
		}
		else{
			return res.status(500).json(err);
		}
	})
});	


module.exports = router;