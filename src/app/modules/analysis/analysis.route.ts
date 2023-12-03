import express from 'express';

import { AnalysisServices } from './analysis.services';

const router = express.Router();

router.get('/', AnalysisServices.getAnalysis);

export const AnalysisRoutes = router;
