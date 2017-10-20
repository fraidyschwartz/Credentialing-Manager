import knex from './config';

async function getAllDoctors() {
    let doctors = await knex('doctors')
    .leftJoin('facilities as f', 'f.facilityId', '=', 'doctors.facilityId')
    .leftJoin('departments as d', 'd.departmentId', '=', 'doctors.departmentId')
    .select('doctors.doctorId',
            'doctors.name',
            'doctors.credentials',
            'doctors.isActive as status',
            'f.facility',
            'd.department');

    doctors.forEach(d => {
        if(d.status === 0) {
            d.status = "Inactive";
        }
        else {
            d.status = "Active";
        }
    })

    return doctors;
}

async function createDoctor(doctor) {
    let id = await knex('doctors').insert(doctor);
    let newDoctor = await knex('doctors').select().where('doctorId', id).first();
    let facilityInsurances = await knex('facility_insurances').select('insuranceId').where('facilityId', newDoctor.facilityId);
    facilityInsurances.forEach(f => {
        createDoctorInsurance(id, f.insuranceId);
    });
    return newDoctor;
}

async function createDoctorInsurance(doctorId, insuranceId) {
    return await knex('doctor_insurances')
                .insert({
                    doctorId: doctorId, 
                    insuranceId: insuranceId,
                    applicationStatusId: 1,
                    notes: ""});
}

async function deleteDoctor(doctorId) {
	return await knex('doctors').where('doctorId', doctorId).del();
}

async function editDoctor(doctor) {
    let originalDoctor = await knex('doctors').select().where('doctorId', doctor.doctorId).first();

    if(originalDoctor.facilityId !== doctor.facilityId) {
        deleteDoctorInsurancesNotInNewFacility(originalDoctor, doctor);
        createInsuranceForDoctorNewFacility(doctor);
    }
    await knex('doctors').update(doctor).where('doctorId', doctor.doctorId);
    return knex('doctors').select().where('doctorId', doctor.doctorId);
}

async function deleteDoctorInsurancesNotInNewFacility(originalDoctor, doctor) {
    let facilityInsurances = await knex('facility_insurances').select('insuranceId').where('facilityId', originalDoctor.facilityId);
    let insurances = [];
    for(var i = 0; i < facilityInsurances.length; i ++) {
        let data = await knex('facility_insurances').where('insuranceId', facilityInsurances[i].insuranceId).andWhere('facilityId', doctor.facilityId); 
        if(data.length === 0)
        {
            insurances.push(facilityInsurances[i].insuranceId); 
        }
    }
    await knex('doctor_insurances').whereIn('insuranceId', insurances).andWhere('doctorId', doctor.doctorId).del();
}

async function createInsuranceForDoctorNewFacility(doctor) {
    let doctorInsurances = await knex('doctor_insurances').select('insuranceId').where('doctorId', doctor.doctorId);
    let doctorInsurancesList = [];
    doctorInsurances.forEach(d => {
        doctorInsurancesList.push(d.insuranceId);
    })
    let insurancesToCreate = await knex('facility_insurances')
                                .whereNotIn('insuranceId', doctorInsurancesList)
                                .andWhere('facilityId', doctor.facilityId);

    insurancesToCreate.forEach(i => {
        createDoctorInsurance(doctor.doctorId, i.insuranceId);
    })
}

async function getDoctorById(doctorId) {
    let doctor = await knex('doctors')
    .leftJoin('facilities as f', 'f.facilityId', '=', 'doctors.facilityId')
    .leftJoin('departments as d', 'd.departmentId', '=', 'doctors.departmentId')
    .select('doctors.doctorId',
            'doctors.name',
            'doctors.credentials',
            'doctors.isActive as status',
            'f.facilityId as facility',
            'd.departmentId as department',
            'doctors.notes')
    .where('doctorId', doctorId)
    .first();
    return doctor;
}

async function getDoctorInsurances(doctorId) {
    let data = await knex('doctor_insurances as di')
    .leftJoin('insurances as i', 'i.insuranceId', '=', 'di.insuranceId')
    .leftJoin('application_statuses as a', 'a.applicationStatusId', '=', 'di.applicationStatusId')
    .select('di.doctorInsuranceId',
            'i.insuranceId',
            'i.name as insurance',
            'a.applicationStatusId',
            'di.effectiveDate',
            'di.notes')
    .where('di.doctorId', doctorId);

    for(var d = 0; d < data.length; d++) {
        data[d].applicationStatusHistory = await getDoctorInsuranceApplicationHistory(data[d].doctorInsuranceId);
        if(data[d].effectiveDate !== null)
        {
            data[d].effectiveDate = new Date(data[d].effectiveDate).toISOString().substring(0, 10);
        }
    }
    return data;
}

async function editDoctorInsurance(doctorInsurance) {
    let originalDoctorInsurance = await knex('doctor_insurances').where('doctorInsuranceId', doctorInsurance.doctorInsuranceId).first();
    if(originalDoctorInsurance.applicationStatusId != doctorInsurance.applicationStatusId) {
        //insert user to assignedBy field
        await knex('application_status_history').insert({doctorInsuranceId: doctorInsurance.doctorInsuranceId, applicationStatusId: doctorInsurance.applicationStatusId})
    }
    await knex('doctor_insurances').update({applicationStatusId: doctorInsurance.applicationStatusId, effectiveDate: doctorInsurance.effectiveDate, notes: doctorInsurance.notes}).where('doctorInsuranceId', doctorInsurance.doctorInsuranceId);
    return knex('doctor_insurances').select().where('doctorInsuranceId', doctorInsurance.doctorInsuranceId);
}

async function deleteDoctorInsurance(doctorInsuranceId) {
    return knex('doctor_insurances').where('doctorInsuranceId', doctorInsuranceId).del();
}

async function getAllFacilities() {
    return await knex('facilities').select();
}

async function getAllDepartments() {
    return await knex('departments').select();
}

async function getAllApplicationStatuses() {
    return await knex('application_statuses').select();
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

export {
    getAllDoctors,
    createDoctor,
    deleteDoctor,
    editDoctor,
    getDoctorById,
    getDoctorInsurances,
    editDoctorInsurance,
    getAllFacilities,
    getAllDepartments,
    getAllApplicationStatuses,
}