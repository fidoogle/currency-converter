import axios from 'axios';

const MIN_FETCH_TIME = 2500;
function sleep(t = MIN_FETCH_TIME) {
    t = Math.random() * t + MIN_FETCH_TIME
    return new Promise(resolve => setTimeout(resolve, t))
}
function randomError() {
    const rnd = Math.floor(Math.random() * 10); // integer between 0 and 9
    return (rnd%5===0)
}

const fetchCommonCurrency = async (delay=false) => {
    //const url = '/data/common-currency.json';
    const url = 'https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json'

    try {
        const response = await axios({
            method: 'get',
            url: url,
        });
        if (delay) {
            await sleep();
        }
        //if (randomError()) {
        //     throw new Error('Random error');
        // }
        return response.data;
    } catch(e) {
        console.error('Request for fetchCommonCurrency failed');
        throw e;
    }
};

const fetchRates = async (base, delay=false) => {
    if (!base) {
        throw new Error('base empty in fetchRates');
    }
    const url = `https://api.exchangeratesapi.io/latest?base=${base}`;

    try {
        const response = await axios({
            method: 'get',
            url: url
        });
        if (delay) {
            await sleep();
        }
        // if (randomError()) {
        //     throw new Error('Random error');
        // }
        return response.data;
    } catch(e) {
        console.error('Request for fetchRates failed');
        throw e;
    }
};

export { fetchCommonCurrency, fetchRates }