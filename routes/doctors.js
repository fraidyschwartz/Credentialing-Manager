import express from 'express-promise-router';
const router = express();
import db from '../repo';

router.get('/alldoctors', async (req, res) => {
    let results = await db.doctors.getAllDoctors();
    res.json(results);
})

router.post('/newdoctor', async (req, res) => {
    let doctor = {
        name: req.body.name,
        credentials: req.body.credentials,
        isActive: req.body.status,
        facilityId: req.body.facility,
        departmentId: req.body.department,
        notes: req.body.notes
    }
    let newDoctor = await db.doctors.createDoctor(doctor);
    res.json(newDoctor);
})

router.post('/deletedoctor', async (req, res) => {
    let doctorId = req.body.doctorId;
	await db.doctors.deleteDoctor(doctorId);
	res.json('success');
})

router.post('/editdoctor', async (req, res) => {
    let doctor = {
        doctorId: req.body.doctorId,
        name: req.body.name,
        credentials: req.body.credentials,
        isActive: req.body.status,
        facilityId: req.body.facility,
        departmentId: req.body.department,
        notes: req.body.notes
    }
	let editedDoctor = await db.doctors.editDoctor(doctor)
	res.json(editedDoctor);
})

router.get('/getdoctor', async(req, res) => {
    let doctorId = req.query.doctorId;

    let doctor = await db.doctors.getDoctorById(doctorId);
    let doctorInsurances = await db.doctors.getDoctorInsurances(doctorId);

    res.json({doctor: doctor, insurances: doctorInsurances});
})

router.get('/getdoctorinsurances', async(req, res) => {
    let doctorInsurances = await db.doctors.getDoctorInsurances(req.query.doctorId);

    res.json(doctorInsurances);
})

router.post('/editdoctorinsurance', async (req, res) => {
	let editedDoctorInsurance = await db.doctors.editDoctorInsurance(req.body)
	res.json(editedDoctorInsurance);
})

router.get('/allfacilities', async (req, res) => {
    let facilities = await db.doctors.getAllFacilities();
    res.json(facilities);
})

router.get('/alldepartments', async (req, res) => {
    let departments = await db.doctors.getAllDepartments();
    res.json(departments);
})

router.get('/allapplicationstatuses', async (req, res) => {
    let applicationStatuses = await db.doctors.getAllApplicationStatuses();
    res.json(applicationStatuses);
})

export default {
    router
}