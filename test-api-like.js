import fetch from 'node-fetch';

(async () => {
    try {
        const url_l = 'https://data.cr.gov.hk/cr/api/api/v1/api_builder/local/search?current=1&size=10&query[0][key1]=Comp_name&query[0][key2]=like&query[0][key3]=MAPKING';
        const res_l = await fetch(url_l);
        const data_l = await res_l.json();
        console.log('Local count like:', data_l.data?.actualTotal);
        if (!data_l.data) console.log(data_l);
    } catch (e) {
        console.error(e.message);
    }
})();
