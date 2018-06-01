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

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 10; i++)
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
    // const date_of_birth = [
    //     "1951-02-08","1952-07-10","1952-12-13","1953-02-09","1959-09-04","1960-08-26",
    //     "1962-04-11","1962-06-13","1963-02-08","1965-06-02","1969-08-25","1970-02-17",
    //     "1970-12-21","1972-05-18","1974-08-15","1975-02-01","1975-06-12","1979-08-25",
    //     "1980-09-14","1980-11-30","1982-09-29","1982-11-16","1984-03-02","1987-03-31",
    //     "1987-04-10","1988-05-06","1989-04-18","1992-03-19","1995-03-09","1996-02-10",
    // ];

    const patients = [
        factory.newResource (NS, 'Patient', 'CWXFBR58A08C605P'),
        factory.newResource (NS, 'Patient', 'DKLQYM78P56E690U'),
        factory.newResource (NS, 'Patient', 'BRXNCX62T45B656L'),
        factory.newResource (NS, 'Patient', 'ZSVTSM40C46E570W'),
        // factory.newResource (NS, 'Patient', 'ZQHVQL34M17B236J'),
        // factory.newResource (NS, 'Patient', 'DDCTFS80M18B058S'),
        // factory.newResource (NS, 'Patient', 'NLTGWG94P29L155D'),
        // factory.newResource (NS, 'Patient', 'SRHXHR61T15B682U')
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
    ]

    doctors.forEach (function (doctor) {
        var name = names[Math.floor(Math.random()*names.length)];
        doctor.name = name;

        var surname = surnames[Math.floor(Math.random()*surnames.length)];
        doctor.surname = surname;
      	
      	var emptyList = new Array();
      	doctor.list_of_patients = emptyList ;
    });

    const patientRegistry = await getParticipantRegistry (NS + '.Patient');
    await patientRegistry.addAll(patients);

    const doctorRegistry = await getParticipantRegistry (NS + '.Doctor');
    await doctorRegistry.addAll(doctors);
}

/**
 * Sample transaction for creation of delegation relationship 
 * @param {org.basicnet.Health_request} Health_request
 * @transaction
 
    Used to create some participant and assets 
 */
async function Health_request(tx) {

    const factory = getFactory();
    const NS = 'org.basicnet';
    var pass = false; 

    
    var tempDelID = makeid();
    // var query = buildQuery('SELECT org.basicnet.Delegation WHERE (dlID == _$checkID)');
    // return query (query, { checkID : tempDelID })
    //     .then (function(result){
    //         if (!result)
    //             {
                const delegation = factory.newResource(NS, 'Delegation', "prova");
    //     //         pass = true;
    //     //     }
    //     // });
    // }

    delegation.doctor = factory.newRelationship(NS, 'Doctor', "MCGRMI37S05I909L"); 
    delegation.patient = factory.newRelationship(NS, 'Patient', "DKLQYM78P56E690U");
    delegation.state = "WAITING";
    delegation.start = tx.request_date;

    var finishDate = new Date (delegation.start);		
	finishDate.setMonth(finishDate.getMonth() + 1);
  
  	delegation.finish = finishDate;
  	
    const delegationRegistry = await getAssetRegistry (NS + '.Delegation');
    await delegationRegistry.add(delegation);
}   

/**
 * Sample transaction for confirm a delegation request
 * @param {org.basicnet.Health_delegation} Health_delegation
 * @transaction
 
    Used to create some participant and assets 
 */
async function Health_delegation(tx) {

    const factory = getFactory();
    const NS = 'org.basicnet';
  
  	return getAssetRegistry(NS + '.Delegation')
  .then (function (assetRegistry){
    return assetRegistry.get("prova")
    .then (function (delegation) {
    		delegation.state = "CONFIRMED"
          	delegation.start = tx.delegation_date;
            var finishDate = new Date (delegation.start);		
	        finishDate.setMonth(finishDate.getMonth() + 1);
  	        delegation.finish = finishDate;
      		return assetRegistry.update(delegation);
    	});
    });

}   