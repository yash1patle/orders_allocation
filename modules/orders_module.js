const mysqlCon = require('../connection')
const https = require('https')
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const $ = require('jquery')(dom.window)
var moment = require('moment');

function getApiOrders(res,department,oes){
	
	get_OrdersFrom_Api(res,department,oes)
	.then(function(returnRes){
		
		if(returnRes.length > 0){
			
			var count = 0;
			
			$.each(returnRes, function(i, rowIndex) {
					
				var service = {
					"DeptName": 'Extraction',
					"Name": rowIndex.service, 
					"Dept": '0',               
					"Type": "",
					"api_id": rowIndex.id,
					"api_order_id": rowIndex.order_id,
					"api_order_created": rowIndex.date_created,
					"api_order_modified": rowIndex.date_modified,
					"api_order_status": rowIndex.status,
					"api_customer_name": rowIndex.customer,
					"api_service_name": rowIndex.service,
					"api_order_sku": rowIndex.sku
				};
				
				var orderMetaData = rowIndex.meta.split(",");
				var api_number_of_images = '';
				var api_order_name = '';
				var api_turnaround_time = '';
				var api_output_format = '';
				var api_contrast = '';
				var api_color_temperature = '';
				
				
					$.each(orderMetaData, function( index, value ) {
					
						var valueArr = value.split("=")						
						
						if(valueArr[0] === 'Number of Images'){
							api_number_of_images = valueArr[1]
						}
						else if(valueArr[0] === ' Number of Images'){
							api_number_of_images = valueArr[1]							
						}
						else if(valueArr[0] === 'Total number of people in all the images to be extracted'){
							api_number_of_images = valueArr[1]							
						}
						else if(valueArr[0] === 'Total number of images to be extracted'){
							api_number_of_images = valueArr[1]							
						}
						else if(valueArr[0] === 'Number of people per image'){
							
							var extractionNumber_of_Image = valueArr[1].split('');
							api_number_of_images = extractionNumber_of_Image[0]
						}
						
						if(valueArr[0] === 'Order Name'){
							api_order_name = valueArr[1]
						}
						
						if(valueArr[0] === 'Turnaround Time'){
							api_turnaround_time = valueArr[1]
						}
						if(valueArr[0] === 'Output Format'){
							api_output_format = valueArr[1]
						}
						if(valueArr[0] === 'Contrast'){
							api_contrast = valueArr[1]
						}
						if(valueArr[0] === 'Color Temperature'){
							api_color_temperature = valueArr[1]
						}
					});
					
					checkExistingOrder(service)
					.then(function(returnRes2){
						
						//if(countOrder == 2){ return false;}
						
						if(returnRes2 == 0)
						{
							addManualOrder(service,api_number_of_images,api_order_name,api_turnaround_time,api_output_format,api_contrast,api_color_temperature,rowIndex.meta,res)
							.then(function(lastInsertedOrderId){
								
								if(count == returnRes.length){
									//return res.status(200).json(returnRes)
								
									getAllOrders(res)
									.then(function(rows){
										
										return res.status(200).json(rows)	
									})
									.catch(function(err){
											//return res.status(500).json(err)
									})
								}	
							})
							.catch(function(err){
									return res.status(500).json(err)
							})	
						}	
						else{
							if(count == returnRes.length){
									
								getAllOrders(res)
								.then(function(rows){
									
									return res.status(200).json(rows)	
								})
								.catch(function(err){
										//return res.status(500).json(err)
								})
							}
						}
					})
					.catch(function(err){
						return err
					})
									
				
				count++;
			})
		}		
	})
	.catch(function(err){
		return err
	})					
}

get_OrdersFrom_Api = function(res,department,oes) {
	
	/*var options = {
	   host: 'orders.rebooku.com',
	   path: '/orders.php?search=Extraction',
	   // authentication headers
	   headers: {
		  'Authorization': 'Basic ' + new Buffer('ck_952b21ba4a6df96a247bd4b396b1c22356bb0c07' + ':' + 'cs_e3c5dfb59f31289bca613f236f4ffbebc9a62824').toString('base64')
	   }   
	};	*/
	return new Promise(function(resolve, reject){
		
		//https.get('https://orders.rebooku.com/orders.php?status=processing&search='+myApp.employee["ActiveDepartment"], (resp) => {
			
		var pageNum = 1;
		
		var url = 'https://orders.rebooku.com/orders.php?search='+department+'&consumer_key=ck_952b21ba4a6df96a247bd4b396b1c22356bb0c07&consumer_secret=cs_e3c5dfb59f31289bca613f236f4ffbebc9a62824';
		
		if(oes == 'rbk'){
			
			url = 'https://orders.rebooku.com/orders.php?search='+department+'&consumer_key=ck_952b21ba4a6df96a247bd4b396b1c22356bb0c07&consumer_secret=cs_e3c5dfb59f31289bca613f236f4ffbebc9a62824';
		}
		
		if(oes == 'psm'){
			
			url = 'https://order.rebookuusa.com/orders.php?search='+department+'&consumer_key=ck_16feded66b0a2ad09adb1223e469e47d19c61c28&consumer_secret=cs_c357c5f36169ad3dca1803c7421d8b785e714333';
		}
		
		if(oes == 'fafa'){
			
			url = 'https://order.fotofafa.com/orders.php?search='+department+'&consumer_key=ck_b4a1ab6f675acf7e3c9141757872ebe995297ef7&consumer_secret=cs_317e1bb1ffb17ebfb4d071411582b7c69add9146';
		}
			
		//https.get('https://orders.rebooku.com/orders_erp.php?search=Extraction&per_page=100&order=desc&page=1', (resp) => {	
		
			
		https.get(url, (resp) => {	
		let data = '';

		// A chunk of data has been received.
		resp.on('data', (chunk) => {
			data += chunk;
		});

		// The whole response has been received. Print out the result.
		resp.on('end', () => {
			
			var parData = JSON.parse(data);
			//console.log(JSON.stringify(parData))
			if(parData.length > 0){
							
				return resolve(parData);
			}
			else{
					
				return 0;
			}
			
		});

		}).on("error", (err) => {
			return err;
		});
	})
	
}
checkExistingOrder = function(service) {
								
	var msQuery;
	
	msQuery = 'Select track_id from orders where track_id="'+service.api_order_id+'"';		
	
		
	return new Promise(function(resolve, reject){
		mysqlCon.query(
			msQuery, 
			function(err, rows){        				
				if(err){	
					return err
				}
				else{			
					return resolve(rows.length);
				}
			}
		)}
	)					
};

getAllOrders = function(res) {
							
	var msQuery;
	
	msQuery = 'Select ord.*,count(assign_ord.employee_id) totalAssign from orders ord left join assign_orders assign_ord on ord.track_id = assign_ord.order_id group by ord.track_id order by ord.id desc limit 100';		
	
		
	return new Promise(function(resolve, reject){
		mysqlCon.query(
			msQuery, 
			function(err, rows){        				
				if(err){	
					return res.status(500).json(err)
				}
				else{			
					return resolve(rows);
				}
			}
		)}
	)					
};

getOfflineDepartmentOrders = function(res,department) {
							
	var msQuery;
	
	msQuery = 'Select ord.*,count(assign_ord.employee_id) totalAssign from orders ord left join assign_orders assign_ord on ord.track_id = assign_ord.order_id where ord.online_offline_mode = "Offline" and ord.department_name = "Extraction" group by ord.track_id order by ord.id desc limit 100';		
	
		
	return new Promise(function(resolve, reject){
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
		)}
	)					
};

addManualOrder = function(service,api_number_of_images,api_order_name,api_turnaround_time,api_output_format,api_contrast,api_color_temperature,api_order_meta,res) {
			
		
		var orderInsertUpdateQuery;
		var orderLastInsertId = '';
		
		var serv_api_customer_name = service.api_customer_name.replace(/(["'])/g, "\\$1");
	
		if(service.api_order_id != '')
		{	
			var serv_api_order_id = service.api_order_id.replace(/(["'])/g, "\\$1");
		}
		else
		{
			var serv_api_order_id = '';
		}	
		
		/* if(service.api_id != '')
		{	
			var serv_api_id = service.api_id.replace(/(["'])/g, "\\$1");
			
		}
		else{
			var serv_api_id = 0;
		}	 */
			
		var serv_api_order_created = (service.api_order_created) ? service.api_order_created.replace(/(["'])/g, "\\$1"): '';
		var serv_api_order_modified = (service.api_order_modified) ? service.api_order_modified.replace(/(["'])/g, "\\$1"): '';
		var serv_api_order_status = (service.api_order_status) ? service.api_order_status.replace(/(["'])/g, "\\$1"): '';
		var serv_api_customer_name = (service.api_customer_name) ? service.api_customer_name.replace(/(["'])/g, "\\$1"): '';
		var serv_api_service_name = (service.api_service_name) ? service.api_service_name.replace(/(["'])/g, "\\$1"): '';
		var serv_api_order_sku = (service.api_order_sku) ? service.api_order_sku.replace(/(["'])/g, "\\$1"): '';
		
		
		
		api_number_of_images = api_number_of_images.replace(/(["'])/g, "\\$1");
		api_number_of_images.split('"').join('');
		
		api_order_name = api_order_name.replace(/(["'])/g, "\\$1");
		api_order_name.split('"').join('');
		
		api_turnaround_time = api_turnaround_time.replace(/(["'])/g, "\\$1");
		api_turnaround_time.split('"').join('');
		
		api_output_format = api_output_format.replace(/(["'])/g, "\\$1");
		api_output_format.split('"').join('');
		
		api_contrast = api_contrast.replace(/(["'])/g, "\\$1");
		api_contrast.split('"').join('');
		
		api_color_temperature = api_color_temperature.replace(/(["'])/g, "\\$1");	
		api_color_temperature.split('"').join('');
		
		api_order_meta = api_order_meta.replace(/(["'])/g, "\\$1");
		api_order_meta.split('"').join('');
		
		if(api_number_of_images == ''){
			
			api_number_of_images = 0;
		}
	
		orderInsertUpdateQuery = 'Insert Into orders(`track_id`,`employee_id`,`client_name`,`number_of_images`,`order_date`,`api_id`,`api_order_id`,`api_order_created`,`api_order_modified`,`api_order_status`,`api_customer_name`,`api_service_name`,`api_number_of_images`,`api_order_name`,`api_turnaround_time`,`api_output_format`,`api_contrast`,`api_color_temperature`,`api_order_sku`,`api_order_meta`,`modified`,`created`)Values("'+service.api_order_id+'","0","'+serv_api_customer_name+'","'+api_number_of_images+'",NOW(),"'+service.api_id+'","'+service.api_order_id+'","'+serv_api_order_created+'","'+serv_api_order_modified+'","'+serv_api_order_status+'","'+serv_api_customer_name+'","'+serv_api_service_name+'","'+api_number_of_images+'","'+api_order_name+'","'+api_turnaround_time+'","'+api_output_format+'","'+api_contrast+'","'+api_color_temperature+'","'+serv_api_order_sku+'","'+api_order_meta+'",NOW(),NOW())';
		
		//orderInsertUpdateQuery = orderInsertUpdateQuery.replaceAll('\\', '');
		
		//orderInsertUpdateQuery = orderInsertUpdateQuery.replace(/\//g, "")
				
		
		return new Promise(function(resolve, reject){
			mysqlCon.query(
				orderInsertUpdateQuery, 
				function(err, rows){        
				
					if(err){	

						return err						
					}
					else{
						
						return resolve(rows.insertId);
					}
				}
			)}
		)
};

function addOfflineOrders(res,ordersData){
	
	var msQuery = "Insert into orders(track_id,client_name,order_date,batch_status,order_status,order_from,department_name,	number_of_images,meta_data,order_comment,online_offline_mode,modified,created) values(?,?,?,?,?,?,?,?,?,?,'Offline',Now(),Now())"
	
	var orderDate = moment(ordersData.order_date).format('YYYY-MM-DD HH:mm:ss')
	
	mysqlCon.query(msQuery,[ordersData.order_id,ordersData.client_name,orderDate,ordersData.batch_status,ordersData.order_status,ordersData.order_from,ordersData.department_name,ordersData.total_images,ordersData.meta_data,ordersData.order_comment],(err,results) =>{

		if(!err){
			return res.status(200).json({message:"Offline order successfully created"})
		}
		else{
			return res.status(500).json(err);
		}
	})
}

function add_Import_Offline_Orders(res,ordersData){
	
	var msQuery = "Insert into orders(track_id,client_name,order_date,batch_status,order_status,department_name,	number_of_images,order_comment,online_offline_mode,import_from_excel,modified,created) values(?,?,?,?,?,?,?,?,'Offline','Yes',Now(),Now())"
	
	var orderDate = moment(ordersData.order_date).format('YYYY-MM-DD HH:mm:ss')
	
	mysqlCon.query(msQuery,[ordersData.order_id,ordersData.client_name,orderDate,ordersData.batch_status,ordersData.order_status,ordersData.order_from,ordersData.department_name,ordersData.total_images,ordersData.meta_data,ordersData.order_comment],(err,results) =>{

		if(!err){
			return res.status(200).json({message:"Offline order successfully created"})
		}
		else{
			return res.status(500).json(err);
		}
	})
}
	
function orderDetailsById(res,track_id){
	
	var msQuery = 'Select ord.* from orders ord where ord.track_id="'+track_id+'" limit 1';
	
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
function getEmployees(res){
	
	var msQuery = 'Select * from employees';
	
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
function getAssignedOperator(res,track_id){
	
	var msQuery = 'Select assign_ord.*,emp.first_name,emp.last_name,emp.username from assign_orders assign_ord left join employees emp on assign_ord.employee_id = emp.id where assign_ord.order_id="'+track_id+'"';
	
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

function getImportOfflineOrdersAndSave(res,importOrdersData){
	
	//return res.status(200).json(importOrdersData.ImportFileData[0]['Order Id'])
	
	var count = 1;
	$.each(importOrdersData.ImportFileData, function(i, rowIndex) {
		
		//console.log(rowIndex['Client Name']);
		
		if(count == importOrdersData.ImportFileData.length){
			
			return res.status(200).json({message:"Import offline orders successfully completed"})
		}
		
		addImportOfflineOrder(rowIndex)
		.then(function(retRes){
			
			
		})
		.catch(function(err){
			return res.status(500).json(err)
		})	
		
		count++;
	})	
}
function addImportOfflineOrder(orderDetails){
		
	var msQuery = "Insert into orders(track_id,client_name,order_date,batch_status,order_status,department_name,	number_of_images,order_comment,online_offline_mode,import_from_excel,modified,created) values(?,?,?,?,?,?,?,?,'Offline','Yes',Now(),Now())"
	
	var orderDate = moment(orderDetails['Order Date']).format('YYYY-MM-DD HH:mm:ss')
	
	return new Promise(function(resolve, reject){
		
			mysqlCon.query(msQuery,[orderDetails['Order Id'],orderDetails['Client Name'],orderDate,orderDetails['Batch Status'],orderDetails['Order Status'],orderDetails['Department'],orderDetails['Images'],orderDetails['Order Comment']],(err,results) =>{

				if(!err){
					//return res.status(200).json({message:"Offline order successfully created"})
					return resolve('Success')
				}
				else{
					return res.status(500).json(err);
				}
			})
		}
	)
}

module.exports = {
	getApiOrders,
	orderDetailsById,
	getEmployees,
	getAssignedOperator,
	getOfflineDepartmentOrders,
	addOfflineOrders,
	getImportOfflineOrdersAndSave
};	