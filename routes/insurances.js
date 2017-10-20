import express from 'express-promise-router';
const router = express();
import db from '../repo';

router.get('/allinsurances', async (req, res) => {
    let results = await db.insurances.getAllInsurances();
    res.json(results);
})

router.post('/newinsurance', async (req, res) => {
    let newInsurance = req.body.insurance;
    let insuranceFacilities = req.body.insuranceFacilities;
    let insurance = await db.insurances.createInsurance(newInsurance, insuranceFacilities);
    res.json(insuranceFacilities);
})

router.post('/deleteinsurance', async (req, res) => {
    let insuranceId = req.body.insuranceId;
	await db.insurances.deleteInsurance(insuranceId);
	res.json('success');
})

router.post('/editinsurance', async (req, res) => {
	let insurance = await db.insurances.editInsurance(req.body.insurance);
    
    let insuranceFacilities = await db.insurances.compareInsuranceFacilities(req.body.insuranceFacilities, req.body.insurance.insuranceId);
	res.json(insurance);
})

router.get('/getinsurance', async(req, res) => {
    let insuranceId = req.query.insuranceId;

    let insurance = await db.insurances.getInsuranceById(insuranceId);
    let insuranceFacilities = await db.insurances.getInsuranceFacilities(insuranceId);

    res.json({insurance: insurance, insuranceFacilities: insuranceFacilities});
})

router.get('/getinsurancedoctors', async(req, res) => {
    let doctorsOnInsurance = await db.insurances.getDoctorsOnInsurance(req.query.insuranceId);

    res.json(doctorsOnInsurance);
})

router.post('/newinsurancecontact', async (req, res) => {
    let newInsuranceContact = await db.insurances.createInsuranceContact(req.body);
    res.json(newInsuranceContact);
})

router.post('/deleteinsurancecontact', async (req, res) => {
	await db.insurances.deleteInsuranceContact(req.body.insuranceContactId);
	res.json('success');
})

router.post('/editinsurancecontact', async (req, res) => {
	let insuranceContact = await db.insurances.editInsuranceContact(req.body)
	res.json(insuranceContact);
})

router.get('/getinsurancecontacts', async(req, res) => {
    let insuranceContacts = await db.insurances.getInsuranceContacts(req.query.insuranceId);

    res.json(insuranceContacts);
})

export default {
    router
}