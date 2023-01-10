import axios from 'axios';

export const getDailyUsers = async (count) => {
    const op = 'getdailyactiveusers';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}`);
    return res.data
}

export const getDailyEspeesUsers = async (count) => {
    const op = 'getdailyactiveusers_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}`);
    return res.data
}