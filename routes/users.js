const express = require('express');
const connection = require('../connection')
const router = express.Router();

router.post('/signup',(req,res)=>{
    let user = req.body;
    query = "select email,password,role,status from user where email=?";

    connection.query(query,[user.email],(err,results)=>{
        
        if(!err){

            if(results.length <=0){
                query = "insert into user(name,contact_number,email,password,status,role,modified) values(?,?,?,?, 'false','user',Now())"

                connection.query(query,[user.name,user.contact_number,user.email,user.password],(err,results) =>{

                    if(!err){
                        return res.status(200).json({message:"Successfully Registered"})
                    }
                    else{
                        return res.status(500).json(err);
                    }
                })
            }
            else{
                return res.status(400).json({message:"Email Already Exist"})
            }
        }
        else{
            return res.status(500).json(err)
        }
    })
});

router.post('/login',(req,res)=>{
    let user = req.body;
    //query = "select username,password from employees where username=? and password=?";
	
	query =  'SELECT emp.*,ewin.department_id,ewin.department_names,ewin.role_id,ewin.role_name,ewin.report_to_id,ewin.report_to_name,ewin.id_with_department_name,ewin.id_with_roles_name,ewin.id_with_report_to_name,ewin.active from employees as emp left join emp_worksin_another as ewin on emp.id = ewin.employee_id where emp.username=? and emp.password=?'
	
    connection.query(query,[user.username,user.password],(err,results)=>{
        
        if(!err){

            if(results.length > 0){
                //return res.status(200).json({message:"Successfully Login"})
				return res.status(200).json(results[0])
            }
            else{
                return res.status(400).json({message:"Please check username and password"})
            }
        }
        else{
            return res.status(500).json(err)
        }
    })
});

module.exports = router;