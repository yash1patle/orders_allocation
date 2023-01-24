const express = require('express');
const connection = require('../connection')
const router = express.Router();

router.post('/add',(req,res)=>{
	
    let department = req.body;
    query = "insert into departments(name,modified,created) values(?,Now(),Now())"

	connection.query(query,[department.name],(err,results) =>{

		if(!err){
			return res.status(200).json({message:"Department successfully Created"})
		}
		else{
			return res.status(500).json(err);
		}
	})
});	

router.get('/get',(req,res,next)=>{
    
    query = "select * from departments where delete_status = '0' order by id desc";

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
	
    let department = req.body;
    query = "update departments set name=? where id=?"

	connection.query(query,[department.name,department.id],(err,results) =>{

		if(!err){
			
			if(results.affectedRowws == 0)
			{
				return res.status(404).json({message:"Department id doses not found"})
			}
			
			return res.status(200).json({message:"Department successfully updated"})
		}
		else{
			return res.status(500).json(err);
		}
	})
});

module.exports = router;