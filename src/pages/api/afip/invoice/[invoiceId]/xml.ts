import { NextApiRequest, NextApiResponse } from 'next';
import { AfipService } from '@/services/afip.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { invoiceId } = req.query;
        const afipService = new AfipService();
        
        // Generar XML
        const xml = await afipService.generateInvoiceXML(Number(invoiceId));
        
        // Transmitir a AFIP
        const afipResponse = await afipService.transmitToAfip(Number(invoiceId), xml);

        // Devolver respuesta completa
        res.status(200).json({
            xml,
            afipResponse,
            message: 'Factura procesada correctamente'
        });
    } catch (error) {
        console.error('Error processing invoice:', error);
        res.status(500).json({ 
            error: 'Error processing invoice',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
