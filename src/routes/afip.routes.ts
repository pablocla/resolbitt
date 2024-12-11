import { Router } from 'express';
import { AfipController } from '../controllers/afip.controller';

const router = Router();
const afipController = new AfipController();

router.get('/invoice/:invoiceId/xml', afipController.generateInvoiceXML);
router.get('/lastInvoice/:ptoVta/:cbteTipo', afipController.getLastInvoiceNumber);

export default router;
