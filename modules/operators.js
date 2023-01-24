const mysqlCon = require('../connection')
const https = require('https')
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const $ = require('jquery')(dom.window)
var moment = require('moment');


function getAssignOrders(res,operator_id){
	
	var msQuery = 'Select assign_ord.*,emp.first_name,emp.last_name,emp.username from assign_orders assign_ord left join employees emp on assign_ord.employee_id = emp.id where emp.id="'+operator_id+'"';
	
	mysqlCon.query(
			msQuery, 
			function(err, rows){        				
				if(err){	
					return res.status(500).json(err)
				}
				else{			
					return res.status(200).json(rows)
				}
			}
		)
}

function getOperators(res){
	
	var msQuery = 'SELECT emp.*,ewin.department_id,ewin.department_names,ewin.role_id,ewin.role_name,ewin.report_to_id,ewin.report_to_name,ewin.id_with_department_name,ewin.id_with_roles_name,ewin.id_with_report_to_name,ewin.active from employees as emp left join emp_worksin_another as ewin on emp.id = ewin.employee_id where emp.delete_status=0 order by emp.id desc'
	mysqlCon.query(
		msQuery, 
		function(err, rows){        				
			if(err){	
				return res.status(500).json(err)
			}
			else{			
				return res.status(200).json(rows)
			}
		}
	)
}

function getRoles(res){
	
	var msQuery = 'SELECT * from roles'
	mysqlCon.query(
		msQuery, 
		function(err, rows){        				
			if(err){	
				return res.status(500).json(err)
			}
			else{			
				return res.status(200).json(rows)
			}
		}
	)
}

function addUser(res,userData){
	
	insertUserDetails(res,userData)
	.then(function(lastInsertedId){
		
		if(lastInsertedId){
			
			insertEmployeeWorksInAnother(res,userData,lastInsertedId)
			.then(function(returnRes){
				
				if(returnRes == 'Success'){
					
					return res.status(200).json({message:'User successfully created'})	
				}
			})
			.catch(function(err){
				return res.status(500).json({message:err})
			})
		}
	})
	.catch(function(err){
		return res.status(500).json({message:err})
	})
	
}

function editUser(res,userData){
	
	editUserDetails(res,userData)
	.then(function(lastInsertedId){
		
		if(lastInsertedId == 'Success'){
			
			editEmployeeWorksInAnother(res,userData)
			.then(function(returnRes){
				
				if(returnRes == 'Success'){
					
					return res.status(200).json({message:'User successfully updated'})	
				}
			})
			.catch(function(err){
				return res.status(500).json({message:err})
			})
		}
	})
	.catch(function(err){
		return res.status(500).json({message:err})
	})
	
}

insertUserDetails = function(res,userData) {
								
	var msQuery;
	
	var msQuery = "Insert into employees(first_name,last_name,username,password,gender,email,mobile,target,shift,modified,created) values('"+userData.first_name+"','"+userData.last_name+"','"+userData.username+"','"+userData.password+"','"+userData.gender+"','"+userData.email+"','"+userData.mobile+"','"+userData.target+"','"+userData.shift+"',Now(),Now())";
	
		
	return new Promise(function(resolve, reject){
		mysqlCon.query(
			msQuery, 
			function(err, rows){        				
				if(err){	
					return res.status(500).json({message:err})
				}
				else{			
					return resolve(rows.insertId);
				}
			}
		)}
	)					
};
insertEmployeeWorksInAnother = function(res,userData,lastInsertedId) {
								
	var departmentId = '';
	var departmentName = '';
	
	var roleId = '';
	var roleName = '';
	
	var report_to_id = '';
	var report_to_name = '';
	
	var concat_depart_id = '';
	var concat_depart_name = '';
	
	var concat_role_id = '';
	var concat_role_name = '';
	
	var concat_report_to_id = '';
	var concat_report_to_name = '';
	
	var id_with_department_name = '';
	var id_with_roles_name = '';
	var id_with_report_to_name = '';
	
	var concat_id_with_department_name = '';
	var concat_id_with_roles_name = '';
	var concat_id_with_report_to_name = '';
	
	$.each(userData.department, function(i, deprt) {
		
		var splitDept = deprt.split('~')
		
		departmentId += concat_depart_id+splitDept[0];
		concat_depart_id = ',';
		
		id_with_department_name += concat_id_with_department_name+deprt;
		concat_id_with_department_name = ',';
	})

	$.each(userData.department, function(i, deprt) {
		
		var splitDept = deprt.split('~')
		
		departmentName += concat_depart_name+splitDept[1];
		concat_depart_name = ',';
	})	
	
	$.each(userData.role, function(i, role) {
		
		var splitRole = role.split('~')
		
		roleId += concat_role_id+splitRole[0];
		concat_role_id = ',';
		
		id_with_roles_name += concat_id_with_roles_name+role;
		concat_id_with_roles_name = ',';
	})
	
	$.each(userData.role, function(i, role) {
		
		var splitRole = role.split('~')
		
		roleName += concat_role_name+splitRole[1];
		concat_role_name = ',';
	})
	
	$.each(userData.report_to, function(i, reportTo) {
		
		var splitReportTo = reportTo.split('~')
		
		report_to_id += concat_report_to_id+splitReportTo[0];
		concat_report_to_id = ',';
		
		id_with_report_to_name += concat_id_with_report_to_name+reportTo;
		concat_id_with_report_to_name = ',';
	})
	
	$.each(userData.report_to, function(i, reportTo) {
		
		var splitReportTo = reportTo.split('~')
		
		report_to_name += concat_report_to_name+splitReportTo[1];
		concat_report_to_name = ',';
	})
	
	var msQuery = "Insert into emp_worksin_another(employee_id,department_id,department_names,role_id,role_name,report_to_id,report_to_name,id_with_department_name,id_with_roles_name,id_with_report_to_name,modified,created) values('"+lastInsertedId+"','"+departmentId+"','"+departmentName+"','"+roleId+"','"+roleName+"','"+report_to_id+"','"+report_to_name+"','"+id_with_department_name+"','"+id_with_roles_name+"','"+id_with_report_to_name+"',Now(),Now())";
	
		
	return new Promise(function(resolve, reject){
		mysqlCon.query(
			msQuery, 
			function(err, rows){        				
				if(err){	
					return res.status(500).json({message:err})
				}
				else{			
					return resolve('Success');
				}
			}
		)}
	)					
};

editUserDetails = function(res,userData) {
								
	var msQuery;
	
	//var msQuery = "Insert into employees(first_name,last_name,username,password,gender,email,mobile,target,shift,modified,created) values('"+userData.first_name+"','"+userData.last_name+"','"+userData.username+"','"+userData.password+"','"+userData.gender+"','"+userData.email+"','"+userData.mobile+"','"+userData.target+"','"+userData.shift+"',Now(),Now())";
	
	var msQuery = "Update employees set first_name='"+userData.first_name+"',last_name='"+userData.last_name+"',username='"+userData.username+"',password='"+userData.password+"',gender='"+userData.gender+"',email='"+userData.email+"',mobile='"+userData.mobile+"',target='"+userData.target+"',shift='"+userData.shift+"',modified=NOW() where id = '"+userData.employee_id+"'";
	
		
	return new Promise(function(resolve, reject){
		mysqlCon.query(
			msQuery, 
			function(err, rows){        				
				if(err){	
					return res.status(500).json({message:err})
				}
				else{			
					return resolve('Success');
				}
			}
		)}
	)					
};

editEmployeeWorksInAnother = function(res,userData) {
								
	var departmentId = '';
	var departmentName = '';
	
	var roleId = '';
	var roleName = '';
	
	var report_to_id = '';
	var report_to_name = '';
	
	var concat_depart_id = '';
	var concat_depart_name = '';
	
	var concat_role_id = '';
	var concat_role_name = '';
	
	var concat_report_to_id = '';
	var concat_report_to_name = '';
	
	var id_with_department_name = '';
	var id_with_roles_name = '';
	var id_with_report_to_name = '';
	
	var concat_id_with_department_name = '';
	var concat_id_with_roles_name = '';
	var concat_id_with_report_to_name = '';
	
	$.each(userData.department, function(i, deprt) {
		
		var splitDept = deprt.split('~')
		
		departmentId += concat_depart_id+splitDept[0];
		concat_depart_id = ',';
		
		id_with_department_name += concat_id_with_department_name+deprt;
		concat_id_with_department_name = ',';
	})

	$.each(userData.department, function(i, deprt) {
		
		var splitDept = deprt.split('~')
		
		departmentName += concat_depart_name+splitDept[1];
		concat_depart_name = ',';
	})	
	
	$.each(userData.role, function(i, role) {
		
		var splitRole = role.split('~')
		
		roleId += concat_role_id+splitRole[0];
		concat_role_id = ',';
		
		id_with_roles_name += concat_id_with_roles_name+role;
		concat_id_with_roles_name = ',';
	})
	
	$.each(userData.role, function(i, role) {
		
		var splitRole = role.split('~')
		
		roleName += concat_role_name+splitRole[1];
		concat_role_name = ',';
	})
	
	$.each(userData.report_to, function(i, reportTo) {
		
		var splitReportTo = reportTo.split('~')
		
		report_to_id += concat_report_to_id+splitReportTo[0];
		concat_report_to_id = ',';
		
		id_with_report_to_name += concat_id_with_report_to_name+reportTo;
		concat_id_with_report_to_name = ',';
	})
	
	$.each(userData.report_to, function(i, reportTo) {
		
		var splitReportTo = reportTo.split('~')
		
		report_to_name += concat_report_to_name+splitReportTo[1];
		concat_report_to_name = ',';
	})
	
	//var msQuery = "Insert into emp_worksin_another(employee_id,department_id,department_names,role_id,role_name,report_to_id,report_to_name,id_with_department_name,id_with_roles_name,id_with_report_to_name,modified,created) values('"+lastInsertedId+"','"+departmentId+"','"+departmentName+"','"+roleId+"','"+roleName+"','"+report_to_id+"','"+report_to_name+"','"+id_with_department_name+"','"+id_with_roles_name+"','"+id_with_report_to_name+"',Now(),Now())";
	
	var msQuery = "Update emp_worksin_another set department_id='"+departmentId+"',department_names='"+departmentName+"',role_id='"+roleId+"',role_name='"+roleName+"',report_to_id='"+report_to_id+"',report_to_name='"+report_to_name+"',id_with_department_name='"+id_with_department_name+"',id_with_roles_name='"+id_with_roles_name+"',id_with_report_to_name='"+id_with_report_to_name+"',modified=NOW() where employee_id = '"+userData.employee_id+"'";
	
	
	return new Promise(function(resolve, reject){
		mysqlCon.query(
			msQuery, 
			function(err, rows){        				
				if(err){	
					return res.status(500).json({message:JSON.string(err)})
				}
				else{			
					return resolve('Success');
				}
			}
		)}
	)					
};

module.exports = {
	getAssignOrders,
	getOperators,
	addUser,
	getRoles,
	editUser
};