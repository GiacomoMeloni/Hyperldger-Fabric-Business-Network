/**
 * Sample transaction to destroy a delegation
 * @param {org.basicnet.Destroy_delegation} Destroy_delegation
 * @transaction
 
    Used to delete a delegation
 */

async function Destroy_Delegation(tx) {
    var factory = getFactory();
    const NS = 'org.basicnet';
    
  	return getParticipantRegistry(NS + '.Doctor')
  	.then (function (doctorRegistry){
    	return doctorRegistry.get(tx.delegation.doctor.cfD)
      	.then (function (doctor){
        	var index = doctor.list_of_patients.indexOf(tx.delegation.patient);
          	doctor.list_of_patients.splice(index,1);
          	return doctorRegistry.update(doctor)
          	.then (function(){
            	 return getAssetRegistry(NS + '.Delegation')
                 .then (function(assetRegistry){
                      return assetRegistry.remove(tx.delegation);
                 });
            });
        });
    });
   
 }

