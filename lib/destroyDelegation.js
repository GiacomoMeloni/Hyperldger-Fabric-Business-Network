/**
 * Sample transaction to destroy a delegation
 * @param {org.basicnet.Destroy_delegation} Destroy_delegation
 * @transaction
 
    Used to delete a delegation
 */

async function Destroy_Delegation(tx) {
    var factory = getFactory();
    const NS = 'org.basicnet';

    return getAssetRegistry(NS + '.Delegation')
    .then (function(assetRegistry){
        return assetRegistry.remove(tx.delegation);
    });
 }
