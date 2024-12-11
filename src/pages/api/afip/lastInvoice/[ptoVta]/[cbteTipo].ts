import { NextApiRequest, NextApiResponse } from 'next';
import { AfipService } from '@/services/afip.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { ptoVta, cbteTipo } = req.query;
        const afipService = new AfipService();
        
        const result = await afipService.getLastInvoiceNumber(
            Number(ptoVta),
            Number(cbteTipo)
        );
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error consulting AFIP:', error);
        res.status(500).json({ 
            error: 'Error consulting AFIP',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
