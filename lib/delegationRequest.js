/**
 * Sample transaction for creation of delegation relationship 
 * @param {org.basicnet.Delegation_request} Delegation_request
 * @transaction
 
    Used to create some participant and assets 
 */
async function Delegation_request(tx) {

    const factory = getFactory();
    const NS = 'org.basicnet';
    var pass = false; 
    var queryID = buildQuery('SELECT org.basicnet.Delegation WHERE (dlID == _$checkID)');
  
	while (pass == false)
    {
      	var tempDelID = makeid(15);
    	let result = await query(queryID,{checkID: tempDelID});
      	console.log(result.length);
      	if (result.length == 0)
          pass = true;
    }
    
    const delegation = factory.newResource(NS, 'Delegation', "prova");
	//const delegation = factory.newResource(NS, 'Delegation', tempDelID);


    delegation.doctor = factory.newRelationship(NS, 'Doctor', "ProvaDoc"); 
    delegation.patient = factory.newRelationship(NS, 'Patient', "ProvaPat");
    delegation.state = "WAITING";
    delegation.start = tx.request_date;
    delegation.otp = ""; 

    var finishDate = new Date (delegation.start);		
	finishDate.setMonth(finishDate.getMonth() + 1);
  
  	delegation.finish = finishDate;
  	
    const delegationRegistry = await getAssetRegistry (NS + '.Delegation');
    await delegationRegistry.add(delegation);
}   
