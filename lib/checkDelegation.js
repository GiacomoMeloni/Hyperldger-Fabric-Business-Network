
/**
 * Sample transaction to check delegation validity
 * @param {org.basicnet.Check_delegation} Check_delegation
 * @transaction
 
    Used to create some participant and assets 
 */
async function Check_delegation(tx) {
    var factory = getFactory();


    const current_Date = new Date (Date.now());

    if (tx.delegation.finish.getTime() <= current_Date)
    {
        var allert = factory.newEvent(NS, '.Emit_allert_delegation');
        allert.delegation = tx; 
        emit(allert);
    }else {
    	console.log("Delegation OK!");
    }
  	
}
