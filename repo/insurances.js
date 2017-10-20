import knex from './config';

async function getAllInsurances() {
    let data = await knex('insurances').select();
    return data;
}

async function createInsurance(insurance, insuranceFacilities) {
    let id = await knex('insurances').insert(insurance);
    let newInsurance = await knex('insurances').select().where('insuranceId', id).first();

    insuranceFacilities.forEach(f => {
       createFacilityInsurance(f, id); 
    });

    return newInsurance;
}

async function deleteInsurance(insuranceId) {
    deleteAllFacilityInsurances(insuranceId);
    deleteAllDoctorsInsurance(insuranceId);
    deleteAllInsuranceContacts(insuranceId);
	return await knex('insurances').where('insuranceId', insuranceId).del();
}

async function editInsurance(insurance) {
    await knex('insurances').update(insurance).where('insuranceId', insurance.insuranceId);
    return knex('insurances').select().where('insuranceId', insurance.insuranceId).first();
}

async function getInsuranceById(insuranceId) {
    return await knex('insurances as i')
                .select()
                .where('insuranceId', insuranceId)
                .first();
}

async function getInsuranceContacts(insuranceId) {
    return await knex('insurance_contacts').select().where('insuranceId', insuranceId);
}

async function getInsuranceFacilities(insuranceId) {
    let data = await knex('facility_insurances').select('facilityId').where('insuranceId', insuranceId);
    let insuranceFacilities = [];
    data.forEach(d => {
        insuranceFacilities.push(d.facilityId);
    });

    return insuranceFacilities;
}

async function getDoctorsOnInsurance(insuranceId) {
    let data = await knex('doctor_insurances as di')
    .leftJoin('doctors as d', 'd.doctorId', '=', 'di.doctorId')
    .leftJoin('application_statuses as a', 'a.applicationStatusId', '=', 'di.applicationStatusId')
    .select('di.doctorInsuranceId',
            'd.doctorId',
            'd.name',
            'd.credentials',
            'a.applicationStatusId',
            'di.effectiveDate',
            'di.notes')
    .where('di.insuranceId', insuranceId);

    for(var d = 0; d < data.length; d++) {
        data[d].applicationStatusHistory = await getDoctorInsuranceApplicationHistory(data[d].doctorInsuranceId);
        if(data[d].effectiveDate !== null)
        {
            data[d].effectiveDate = new Date(data[d].effectiveDate).toISOString().substring(0, 10);
        }
    }
    return data;
}

async function getDoctorInsuranceApplicationHistory(doctorInsuranceId) {
    let history = await knex('application_status_history as h')
        .innerJoin('application_statuses as a', 'a.applicationStatusId', '=', 'h.applicationStatusId')
        .select('a.applicationStatus',
                'h.assignedDate',
                'h.assignedBy')
        .where('doctorInsuranceId', doctorInsuranceId)
        .orderBy('h.applicationStatusHistoryId', 'desc');
        
    for(var h = 0; h < history.length; h++) {
        if(history[h].assignedDate !== null)
        {
            history[h].assignedDate = new Date(history[h].assignedDate).toLocaleString().substring(0, 9)
        }
    }
    return history;
}

async function compareInsuranceFacilities(newInsuranceFacilityList, insuranceId) {
    let originalInsuranceFacilities = await getInsuranceFacilities(insuranceId);
    let toDelete = await knex('facility_insurances').select().whereNotIn('facilityId', newInsuranceFacilityList).andWhere('insuranceId', insuranceId);

    toDelete.forEach(d => {
        deleteFacilityInsurance(d)
    })

    newInsuranceFacilityList.forEach(f => {
        let isCommon = false;
        for(var i = 0; i < originalInsuranceFacilities.length; i++)
        {
            if(originalInsuranceFacilities[i] === f)
            {
                isCommon = true;
                continue;
            }
        }
        if(!isCommon)
        {
            createFacilityInsurance(f, insuranceId);
        }
    });
}

async function createFacilityInsurance(facilityId, insuranceId) {
    let id = await knex('facility_insurances').insert({facilityId: facilityId, insuranceId: insuranceId});
    let doctorsInThisFacility = await knex('doctors').select('doctorId').where('facilityId', facilityId);

    doctorsInThisFacility.forEach(d => {
        createDoctorInsurance(d.doctorId, insuranceId)
    })
    return id;
}

async function createDoctorInsurance(doctorId, insuranceId) {
    return await knex('doctor_insurances')
                .insert({
                    doctorId: doctorId, 
                    insuranceId: insuranceId,
                    applicationStatusId: 1,
                    notes: ""});
}

async function deleteFacilityInsurance(facilityInsurance) {
    await knex('facility_insurances').where('facilityInsuranceId', facilityInsurance.facilityInsuranceId).del();

    let doctorInsurancesToDelete = await knex('doctor_insurances as di')
            .leftJoin('doctors as d', 'd.doctorId', '=', 'di.doctorId')
            .select('di.doctorInsuranceId')
            .where({'di.insuranceId': facilityInsurance.insuranceId,
                    'd.facilityId': facilityInsurance.facilityId});
    
    doctorInsurancesToDelete.forEach(d => {
        deleteDoctorInsurance(d.doctorInsuranceId);
    });
}

async function deleteDoctorInsurance(doctorInsuranceId) {
    return await knex('doctor_insurances').where('doctorInsuranceId', doctorInsuranceId).del();
}

async function deleteAllDoctorsInsurance(insuranceId) {
    return await knex('doctor_insurances').where('insuranceId', insuranceId).del();
}

async function deleteAllFacilityInsurances(insuranceId) {
    return await knex('facility_insurances').where('insuranceId', insuranceId).del();
}

async function createInsuranceContact(insuranceContact) {
    let id = await knex('insurance_contacts').insert(insuranceContact);
    return id;
}

async function deleteInsuranceContact(insuranceContactId) {
    return await knex('insurance_contacts').where('insuranceContactId', insuranceContactId).del();
}

async function deleteAllInsuranceContacts(insuranceId) {
    return await knex('insurance_contacts').where('insuranceId', insuranceId).del();
}

async function editInsuranceContact(insuranceContact) {
    await knex('insurance_contacts').update(insuranceContact).where('insuranceContactId', insuranceContact.insuranceContactId);
    return knex('insurance_contacts').select().where('insuranceContactId', insuranceContact.insuranceContactId);
}

export {
    getAllInsurances,
    createInsurance,
    deleteInsurance,
    editInsurance,
    getInsuranceById,
    getInsuranceContacts,
    getInsuranceFacilities,
    getDoctorsOnInsurance,
    compareInsuranceFacilities,
    createInsuranceContact,
    deleteInsuranceContact,
    editInsuranceContact
}