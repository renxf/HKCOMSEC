import fetch from 'node-fetch';

(async () => {
    try {
        const url_l = 'https://data.cr.gov.hk/cr/api/api/v1/api_builder/local/search?current=1&size=10&query[0][key1]=Comp_name&query[0][key2]=equal&query[0][key3]=MAPKING';
        const res_l = await fetch(url_l);
        const data_l = await res_l.json();
        console.log('Local count equal:', data_l.data.actualTotal);
        
        const url_f = 'https://data.cr.gov.hk/cr/api/api/v1/api_builder/foreign/search?current=1&size=10&query[0][key1]=Corp_name_full&query[0][key2]=equal&query[0][key3]=ALIBABA';
        const res_f = await fetch(url_f);
        const data_f = await res_f.json();
        console.log('Foreign count equal:', data_f.data.actualTotal);

    } catch (e) {
        console.error(e.message);
    }
})();
