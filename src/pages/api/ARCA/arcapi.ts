import Afip from '@afipsdk/afip.js';

interface WebServiceOptions {
    WSDL: string;
    WSDL_TEST: string;
    URL: string;
    URL_TEST: string;
    soapV1_2: boolean;
}

interface AuthRequest {
    token: string;
    sign: string;
    cuitRepresentada: number;
}

interface RequestData {
    authRequest: AuthRequest;
    codigoTipoComprobante: number;
    numeroPuntoVenta: number;
}

interface ErrorDescription {
    codigo: string;
    descripcion: string;
}

interface AfipResponse {
    consultarUltimoComprobanteAutorizadoReturn: {
        arrayErrores?: {
            codigoDescripcion: ErrorDescription | ErrorDescription[];
        };
        [key: string]: any;
    };
}

const CUIT = 20409378472;
const afip = new Afip({ CUIT });

const WSDL_TEST = 'https://fwshomo.afip.gov.ar/wsct/CTService?wsdl';
const WSDL = 'https://serviciosjava.afip.gob.ar/wsct/CTService?wsdl';
const URL = 'https://serviciosjava.afip.gob.ar/wsct/CTService';
const URL_TEST = 'https://fwshomo.afip.gov.ar/wsct/CTService';
const soapV1_2 = false;
const servicio = 'wsct';

const options: WebServiceOptions = {
    WSDL,
    WSDL_TEST,
    URL,
    URL_TEST,
    soapV1_2
};

const genericWebService = afip.WebService(servicio, options);

(async () => {
    try {
        const ta = await genericWebService.getTokenAuthorization();
        
        const data: RequestData = {
            authRequest: {
                token: ta.token,
                sign: ta.sign,
                cuitRepresentada: afip.CUIT
            },
            codigoTipoComprobante: 195,
            numeroPuntoVenta: 1
        };

        const result = await genericWebService.executeRequest('consultarUltimoComprobanteAutorizado', data) as AfipResponse;
        const response = result.consultarUltimoComprobanteAutorizadoReturn;

        if (response.arrayErrores) {
            const error = Array.isArray(response.arrayErrores.codigoDescripcion) 
                ? response.arrayErrores.codigoDescripcion[0] 
                : response.arrayErrores.codigoDescripcion;
            throw new Error(`(${error.codigo}) ${error.descripcion}`);
        }

        console.log(response);
    } catch (error) {
        console.error(error);
    }
})();