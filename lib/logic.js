/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  

function randomDate(start, end) {
    var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function addPatientToDoctorList(tx){
    const NS = 'org.basicnet';

    return getParticipantRegistry(NS + '.Doctor')
    .then (function (doctorRegistry){
        return doctorRegistry.get(tx.to)
        .then (function (doctor){
            doctor.list_of_patients.push(tx.from);
            return doctorRegistry.update(doctor);
        });
    });
}

/**
 * Sample transaction
 * @param {org.basicnet.Setup_Demo} Setup_Demo
 * @transaction
 
    Used to create some participant and assets 
 */
async function Setup_Demo(tx) {

    const factory = getFactory();
    const NS = 'org.basicnet';

    const names = ['Sergio','Tony','Chris','Peter','Lois','Brian','Frodo','Sam'];
    const surnames = ['Who','Stark','Griffin','Brown','DeAngelis','Baggins','Gamgee'];

    const patients = [
        factory.newResource (NS, 'Patient', 'CWXFBR58A08C605P'),
        factory.newResource (NS, 'Patient', 'DKLQYM78P56E690U'),
        factory.newResource (NS, 'Patient', 'BRXNCX62T45B656L'),
        factory.newResource (NS, 'Patient', 'ZSVTSM40C46E570W'),
        factory.newResource (NS, 'Patient', 'provaPat')
    ]

    patients.forEach (function (patient) {
        var name = names[Math.floor(Math.random()*names.length)];
        patient.name = name;

        var surname = surnames[Math.floor(Math.random()*surnames.length)];
        patient.surname = surname;

        var date = randomDate(new Date(1945, 0, 1), new Date());
      	console.log (date);
        patient.date_of_birth = new Date (date);
    });

    const doctors = [
        factory.newResource (NS, 'Doctor', 'MCGRMI37S05I909L'),
        factory.newResource (NS, 'Doctor', 'VFDFMG70A52G697W'),
        factory.newResource (NS, 'Doctor', 'provaDoc')
    ]

    doctors.forEach (function (doctor) {
        var name = names[Math.floor(Math.random()*names.length)];
        doctor.name = name;

        var surname = surnames[Math.floor(Math.random()*surnames.length)];
        doctor.surname = surname;
      	
      	//var emptyList = new Array();
      	doctor.list_of_patients = [];
    });

    const patientRegistry = await getParticipantRegistry (NS + '.Patient');
    await patientRegistry.addAll(patients);

    const doctorRegistry = await getParticipantRegistry (NS + '.Doctor');
    await doctorRegistry.addAll(doctors);
}

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


    delegation.doctor = factory.newRelationship(NS, 'Doctor', "Prova Doc"); 
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
