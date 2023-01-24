const express = require('express');
const connection = require('../connection')
const router = express.Router();

router.post('/add',(req,res)=>{
	
    let service = req.body;
    query = "insert into services(name,department_id,order_from_id,modified,created) values(?,?,?,Now(),Now())"

	connection.query(query,[service.name,service.department,service.order_from],(err,results) =>{

		if(!err){
			return res.status(200).json({message:"Service successfully Created"})
		}
		else{
			return res.status(500).json(err);
		}
	})
});	

router.get('/get',(req,res,next)=>{
    
    query = "select s.*,d.name as department,ord.order_from from services s inner join departments d on s.department_id = d.id inner join order_from ord on s.order_from_id = ord.id order by s.id desc";

    connection.query(query,(err,results)=>{
        
        if(!err){

            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err)
        }
    })
});

router.get('/get_order_from',(req,res,next)=>{
    
    query = "select * from order_from order by id desc";

    connection.query(query,(err,results)=>{
        
        if(!err){

            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err)
        }
    })
});

router.patch('/update',(req,res)=>{
	
    let service = req.body;
    query = "update services set name=?,department_id=?,order_from_id=? where id=?"

	connection.query(query,[service.name,service.department,service.order_from,service.id],(err,results) =>{

		if(!err){
			
			if(results.affectedRowws == 0)
			{
				return res.status(404).json({message:"Service id does not found"})
			}
			
			return res.status(200).json({message:"Service successfully updated"})
		}
		else{
			return res.status(500).json(err);
		}
	})
});

module.exports = router;