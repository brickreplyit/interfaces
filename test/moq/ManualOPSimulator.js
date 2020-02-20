const axios = require('axios');

async function PerformPostCall(url, data) {
    return await axios.post(url, data);
}

async function PerformGetCall(url) {

    return await axios.get(url, {
        user: 'Simulator'
    });
}

const get_url = 'http://localhost:3030/work';
const post_url = 'http://localhost:3030/work';

setInterval(() => {
    let data = [];

    PerformGetCall(get_url).then((result) => {
        data = result.data;
        for(let elem of data){
            PerformPostCall(post_url, elem).then((result) => {
                console.log(result);
            }).catch((err) => { console.log(err); });
        }

    }).catch((err) => { console.log(err); });
}, 250);





