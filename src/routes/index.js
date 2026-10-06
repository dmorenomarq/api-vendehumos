const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const VendehumoRoutes = require('./vendehumo.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/vendehumos', new VendehumoRoutes().router);

module.exports = router;
