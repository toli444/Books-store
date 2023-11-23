/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import StatusController from './status.controller';

const router = express.Router();

const statusController = new StatusController();

router.get('/', statusController.get);

export default router;
