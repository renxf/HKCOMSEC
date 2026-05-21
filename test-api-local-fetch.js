import fetch from 'node-fetch';

(async () => {
    try {
        const url = 'https://data.cr.gov.hk/cr/api/api/v1/api_builder/local/search?current=1&size=10&query[0][key1]=Comp_name&query[0][key2]=begins_with&query[0][key3]=MAPKING';
        const res = await fetch(url);
        const data = await res.json();
        console.dir(data.data.result, { depth: null });
    } catch (e) {
        console.error(e.message);
    }
})();
