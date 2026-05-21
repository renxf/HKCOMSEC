import fetch from 'node-fetch';

(async () => {
    try {
        const url_f = 'https://data.cr.gov.hk/cr/api/api/v1/api_builder/foreign/search?current=1&size=10&query[0][key1]=Comp_name&query[0][key2]=begins_with&query[0][key3]=ALIBABA';
        const res_f = await fetch(url_f);
        const data_f = await res_f.json();
        console.log(data_f);
    } catch (e) {
        console.error(e.message);
    }
})();
