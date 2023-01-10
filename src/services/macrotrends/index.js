import axios from "axios";

export const getTransactionCount = async (payload) => {
    const op = 'gettransactioncounts';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=startdate&params[0][value]=${payload.startDate}&params[1][name]=enddate&params[1][value]=${payload.endDate}`);
    return res.data
}

export const getActiveAddresses = async (count) => {
    const op = 'getactiveaddresses';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}&params[1][name]=countcutoff&params[1][value]=20`);
    return res.data
}

export const getTransactionCountEspees = async (payload) => {
    const op = 'gettransactioncounts_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=startdate&params[0][value]=${payload.startDate}&params[1][name]=enddate&params[1][value]=${payload.endDate}`);
    return res.data
}

export const getTransactionCountSumsEspees = async (payload) => {
    const op = 'gettransactioncountsandsums_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=startdate&params[0][value]=${payload.startDate}&params[1][name]=enddate&params[1][value]=${payload.endDate}`);
    return res.data
}

//@: macrotrends by address
export const getTransactionCountSumsAddrEspees = async (data)=> {
    const op = 'gettransactioncountsandsums_addresses_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=startdate&params[0][value]=${data.startDate}&params[1][name]=enddate&params[1][value]=${data.endDate}&params[2][name]=addr&params[2][value]=${data.addr}`);
    return res.data
}

export const getTransactionCountSumsAddrOutEspees = async (data) => {
    const op = 'gettransactioncountsandsums_addresses_out_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=startdate&params[0][value]=${data.startDate}&params[1][name]=enddate&params[1][value]=${data.endDate}&params[2][name]=addr&params[2][value]=${data.addr}`);
    return res.data
}

export const getTransactionCountSumsAddrInEspees = async (data) => {
    const op = 'gettransactioncountsandsums_addresses_in_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=startdate&params[0][value]=${data.startDate}&params[1][name]=enddate&params[1][value]=${data.endDate}&params[2][name]=addr&params[2][value]=${data.addr}`);
    return res.data
}