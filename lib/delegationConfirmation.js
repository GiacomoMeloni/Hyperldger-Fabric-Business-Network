/**
 * Sample transaction for confirm a delegation request
 * @param {org.basicnet.Delegation_confirmation} Delegation_confirmation
 * @transaction
 
    Used to create some participant and assets 
 */
async function Delegation_confirmation(tx) {

    const factory = getFactory();
    const NS = 'org.basicnet';
    
  	return getParticipantRegistry(NS + '.Doctor')
  	.then (function(doctorRegistry){
    	return doctorRegistry.get(tx.to.cfD)
      	.then (function(doctor){
        	doctor.list_of_patients.push(tx.from);
          	return doctorRegistry.update(doctor)
          	.then (function(){
            	return getAssetRegistry(NS + '.Delegation')
              	.then (function (delegationRegistry){
                	return delegationRegistry.get("prova")
                  	.then (function (delegation){
                    	delegation.state = "CONFIRMED"
                        delegation.start = tx.delegation_date;
                        var finishDate = new Date (delegation.start);		
                        finishDate.setMonth(finishDate.getMonth() + 1);
                        delegation.finish = finishDate;
                        delegation.otp = makeid(30);
                      	return delegationRegistry.update(delegation);
                    });
                });
            });
        });
    });

}   
