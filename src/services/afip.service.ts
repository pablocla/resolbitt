import { PrismaClient } from '@prisma/client';
import Afip from '@afipsdk/afip.js';
import { Builder } from 'xml2js';

const prisma = new PrismaClient();
const CUIT = 20409378472;

export class AfipService {
  private afip: Afip;
  private genericWebService: { getTokenAuthorization: () => Promise<{ token: string; sign: string }>; executeRequest: (operation: string, data: any) => Promise<any> } = { getTokenAuthorization: async () => ({ token: '', sign: '' }), executeRequest: async () => ({}) };

  constructor() {
    this.afip = new Afip({ CUIT });
    this.initializeWebService();
  }

  private initializeWebService() {
    const options = {
      'WSDL': 'https://serviciosjava.afip.gob.ar/wsct/CTService?wsdl',
      'WSDL_TEST': 'https://fwshomo.afip.gov.ar/wsct/CTService?wsdl',
      'URL': 'https://serviciosjava.afip.gob.ar/wsct/CTService',
      'URL_TEST': 'https://fwshomo.afip.gov.ar/wsct/CTService',
      'soapV1_2': false
    };
    this.genericWebService = this.afip.WebService('wsct', options);
  }

  async getLastInvoiceNumber(ptoVta: number, cbteTipo: number) {
    try {
      const ta = await this.genericWebService.getTokenAuthorization();
      
      const data = {
        'authRequest': {
          'token': ta.token,
          'sign': ta.sign,
          'cuitRepresentada': this.afip.CUIT
        },
        'codigoTipoComprobante': cbteTipo,
        'numeroPuntoVenta': ptoVta
      };

      const result = await this.genericWebService.executeRequest('consultarUltimoComprobanteAutorizado', data);
      return result.consultarUltimoComprobanteAutorizadoReturn;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error AFIP: ${errorMessage}`);
    }
  }

  async generateInvoiceXML(invoiceId: number) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        products: {
          include: {
            product: true
          }
        }
      }
    });

    if (!invoice) {
      throw new Error(`Factura ${invoiceId} no encontrada`);
    }

    if (!invoice.customer) {
      throw new Error(`Cliente no encontrado para la factura ${invoiceId}`);
    }

    // Validaciones adicionales
    if (!invoice.ptoVta || !invoice.cbteTipo) {
      throw new Error('Punto de venta o tipo de comprobante no definido');
    }

    const xmlBuilder = new Builder({
      rootName: 'FeCAEReq',
      headless: true,
    });

    // Obtener último número de comprobante
    const lastInvoiceNumber = await this.getLastInvoiceNumber(invoice.ptoVta, invoice.cbteTipo);
    const nextNumber = (lastInvoiceNumber?.numero || 0) + 1;

    const xmlObject = {
      FeCabReq: {
        CantReg: 1,
        PtoVta: invoice.ptoVta,
        CbteTipo: invoice.cbteTipo
      },
      FeDetReq: {
        FECAEDetRequest: {
          Concepto: invoice.concepto,
          DocTipo: invoice.docTipo,
          DocNro: invoice.docNro,
          CbteDesde: nextNumber,
          CbteHasta: nextNumber,
          ImpTotal: invoice.impTotal,
          ImpNeto: invoice.impNeto,
          ImpIVA: invoice.impIVA
        }
      }
    };

    const xmlString = xmlBuilder.buildObject(xmlObject);

    // Guardar el XML generado
    await this.saveAfipResponse(invoiceId, {
        status: 'PENDING',
        message: 'XML generado',
        response: xmlObject,
        requestXml: xmlString
    });

    return xmlString;
  }

  async transmitToAfip(invoiceId: number, xmlString: string) {
    try {
        const ta = await this.genericWebService.getTokenAuthorization();
        
        // Aquí va la lógica de transmisión a AFIP
        const afipResponse = await this.genericWebService.executeRequest('FECAESolicitar', {
            auth: {
                Token: ta.token,
                Sign: ta.sign,
                Cuit: CUIT
            },
            feReq: xmlString
        });

        // Guardar la respuesta de AFIP
        await this.saveAfipResponse(invoiceId, {
            status: 'COMPLETED',
            message: 'Respuesta AFIP recibida',
            response: afipResponse,
            responseXml: JSON.stringify(afipResponse)
        });

        return afipResponse;
    } catch (error) {
        // Guardar el error
        await this.saveAfipResponse(invoiceId, {
            status: 'ERROR',
            message: error instanceof Error ? error.message : 'Error desconocido',
            response: error,
            responseXml: JSON.stringify(error)
        });
        throw error;
    }
}

  async saveAfipResponse(invoiceId: number, data: {
    status: string;
    message: string;
    response: any;
    requestXml?: string;
    responseXml?: string;
}) {
    return prisma.afipResponse.create({
        data: {
            invoiceId,
            status: data.status,
            message: data.message,
            response: data.response,
            requestXml: data.requestXml,
            responseXml: data.responseXml
        }
    });
  }
}
