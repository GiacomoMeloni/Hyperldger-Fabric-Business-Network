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
        factory.newResource (NS, 'Patient', 'ProvaPat')
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
        factory.newResource (NS, 'Doctor', 'ProvaDoc')
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