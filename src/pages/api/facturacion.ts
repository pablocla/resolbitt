import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ 
      error: 'Debe iniciar sesión para acceder a esta funcionalidad' 
    });
  }

  if (req.method === 'POST') {
    try {
      const { customerId, products, amount, ...invoiceData } = req.body;

      // Validaciones
      if (!customerId || !products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          error: 'Datos inválidos',
          details: 'Se requiere customerId y al menos un producto'
        });
      }

      // Crear la factura con todas sus relaciones
      const invoice = await prisma.invoice.create({
        data: {
          amount: parseFloat(amount) || 0,
          customerId: parseInt(customerId),
          userId: session.user?.id,
          ...invoiceData,
          products: {
            create: products.map(p => ({
              quantity: parseInt(p.quantity),
              product: {
                connect: { id: parseInt(p.productId) }
              }
            }))
          }
        },
        include: {
          customer: true,
          products: {
            include: {
              product: true
            }
          }
        }
      });

      res.status(201).json(invoice);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else if (req.method === 'GET') {
    try {
      const invoices = await prisma.invoice.findMany({
        include: {
          customer: true,
          products: {
            include: {
              product: true
            }
          }
        }
      });
      res.status(200).json(invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'Error al obtener facturas' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
