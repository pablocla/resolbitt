import { Request, Response } from 'express';
import { AfipService } from '../services/afip.service';

const afipService = new AfipService();

export class AfipController {
  async generateInvoiceXML(req: Request, res: Response) {
    try {
      const { invoiceId } = req.params;
      const xml = await afipService.generateInvoiceXML(parseInt(invoiceId));
      
      // Aquí irían las llamadas a los servicios web de AFIP
      // const afipResponse = await sendToAfip(xml);
      
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      res.status(500).json({
        error: 'Error al generar XML',
        message: (error instanceof Error ? error.message : 'Unknown error')
      });
    }
  }

  async getLastInvoiceNumber(req: Request, res: Response) {
    try {
      const { ptoVta, cbteTipo } = req.params;
      const result = await afipService.getLastInvoiceNumber(
        parseInt(ptoVta),
        parseInt(cbteTipo)
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Error al consultar AFIP',
        message: (error instanceof Error ? error.message : 'Unknown error')
      });
    }
  }
}
