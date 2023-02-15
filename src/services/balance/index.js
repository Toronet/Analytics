import axios from 'axios';

export const getBalance = async (address) => {
    const op = 'getaddrbalance';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=addr&params[0][value]=${address}`);
    return res.data
}