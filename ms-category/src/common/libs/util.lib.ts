import {Like} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {format} from 'date-fns-tz';
import * as process from 'process';
import axios from 'axios';
import {parse} from "date-fns";

export class UtilLib {
    timeZone: any
    constructor() {
        this.timeZone = process.env.WS_COMPANY_NAME_DEFAULT
    }
    whereBuilder({whereModel, codes}) {
        const model = {};
        if (whereModel) {
            for (const k of Object.keys(whereModel)) {
                const v = whereModel[k];
                if (v !== 'null') {
                    if (codes.includes(k) && v) {
                        model[k] = v
                    } else {
                        model[k] = Like('%' + v + '%');
                    }
                }
            }
        }
        return model;
    }

    filterBuilder(model: any) {
        const {page, limit} = model.filters
        delete model.filters.page
        delete model.filters.limit
        console.log({page, limit}, 'limit')
        return {whereModel: model.filters, take: limit, skip: (page - 1)*limit, idCompany: model.idCompany}
    }

    resultTransformer(result: any) {
        return {rows: result?.length > 0 ? result[0] : [], count: result?.length > 1 ? result[1] : 0}
    }

    getUuid(){
        return uuidv4()
    }
    getNowDate(){
        return format(new Date(), 'yyyy-MM-dd HH:mm:ss', {timeZone: this.timeZone});
    }

    formatDate(date: any, formatKey: string){
        return format(date, formatKey, {timeZone: this.timeZone});
    }

    textToDate(date: any){
        return parse(date, "yyyy-MM-dd", new Date())
    }

    formatPhone(phoneNumber: string): string {
        // Verifica si el número empieza con '0' y lo elimina
        if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.substring(1);
        }
        const countryCode = '593';
        return `${countryCode}${phoneNumber}`;
    }
    transformBaseAtMime(b64: string): string {
        const signatures: Record<string, string> = {
            JVBERi0: "application/pdf",
            R0lGODdh: "image/gif",
            R0lGODlh: "image/gif",
            iVBORw0KGgo: "image/png",
            "/9j/": "image/jpeg" // Corregido 'jpg' a 'jpeg'
        };

        for (const s of Object.keys(signatures)) {
            if (b64.startsWith(s)) {
                return signatures[s];
            }
        }

        // Añadir retorno por defecto para cubrir todos los casos
        return 'application/octet-stream'; // o lanzar error si prefieres
    }
    calculateYearsBetween(startDate: string, endDate: string): number {
        const start = new Date(startDate);
        const end = new Date(endDate);

        let yearsDifference = end.getFullYear() - start.getFullYear();

        if (
            end.getMonth() < start.getMonth() ||
            (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
        ) {
            yearsDifference--;
        }

        return yearsDifference;
    }
    postRequest({url, route, body, token}) {
        return new Promise((resolve, reject) => {
            let config = {
                headers: {}
            }
            if (token) {
                config.headers = {
                    Authorization: `Bearer ${token}`
                }
            }
            axios.request({
                url: `${url}${route}`,
                data: body,
                method: 'POST',
                headers: config.headers
            }).then((data: any)=>{
                resolve(data?.data)
            }).catch((err)=>{
                console.log(err, 'MI')
                reject(err)
            })
        })
    }

}
