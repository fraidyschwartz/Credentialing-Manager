import express from 'express-promise-router';
const router = express();
import doctorRoutes from './doctors';
import insuranceRoutes from './insurances';

router.use('/doctors', doctorRoutes.router);
router.use('/insurances', insuranceRoutes.router);

export {
    router
}