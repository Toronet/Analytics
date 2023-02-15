import axios from 'axios';

//@: Transactions
export const getDailyTransactions = async (count) => {
    const op = 'getdailytransactioncounts';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}`);
    return res.data
}

export const getDailyTransactionsVol = async (count) => {
    const op = 'getdailytransactioncountsvol';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}`);
    return res.data
}

export const getHourlyTransactions = async (count) => {
    const op = 'gethourlytransactioncounts';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}`);
    return res.data
}

export const getMonthlyTransactions = async (count) => {
    const op = 'getmonthlytransactioncounts';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}`);
    return res.data
}

export const getTransactionsCountByRange = async (payload) => {
    const op = 'gettransactioncounts_amountrange';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=startdate&params[0][value]=${payload.startDate}&params[1][name]=enddate&params[1][value]=${payload.endDate}&params[2][name]=rangestart&params[2][value]=${payload.amountStart}&params[3][name]=rangeend&params[3][value]=${payload.amountEnd}`);
    return res.data
}

export const getRecentTransactions = async (addr) => {
    const op = 'getaddrtransactions';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=addr&params[0][value]=${addr}&params[1][name]=count&params[1][value]=${5}`);
    return res.data
}

export const getToroTransactions = async (count=20) => {
    const op = 'gettransactions_toro';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}`);
    return res.data
}

//@: Transactions by address
export const getDailyAddrTransactions = async (payload) => {
    const op = 'getdailytransactioncounts_address';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=addr&params[0][value]=${payload.addr}&params[1][name]=count&params[1][value]=${payload.count}`);
    return res.data
}

export const getHourlyAddrTransactions = async (payload) => {
    const op = 'gethourlytransactioncounts_address';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=addr&params[0][value]=${payload.addr}&params[1][name]=count&params[1][value]=${payload.count}`);
    return res.data
}

export const getMonthlyAddrTransactions = async (payload) => {
    const op = 'getmonthlytransactioncounts_address';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=addr&params[0][value]=${payload.addr}&params[1][name]=count&params[1][value]=${payload.count}`);
    return res.data
}

export const getAddrTransactionsCountByRange = async (payload) => {
    const op = 'gettransactioncounts_amountrange_address';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=startdate&params[0][value]=${payload.startDate}&params[1][name]=enddate&params[1][value]=${payload.endDate}&params[2][name]=rangestart&params[2][value]=${payload.amountStart}&params[3][name]=rangeend&params[3][value]=${payload.amountEnd}&params[4][name]=addr&params[4][value]=${payload.addr}`);
    return res.data
}

//@: Token transactions
export const getDailyEspeesTransactions = async (count) => {
    const op = 'getdailytransactioncounts_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}`);
    return res.data
}

export const getHourlyEspeesTransactions = async (count) => {
    const op = 'gethourlytransactioncounts_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}`);
    return res.data
}

export const getMonthlyEspeesTransactions = async (count) => {
    const op = 'getmonthlytransactioncounts_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=count&params[0][value]=${count}`);
    return res.data
}

export const getEspeesTransactionsCountByRange = async (payload) => {
    const op = 'gettransactioncounts_amountrange_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=startdate&params[0][value]=${payload.startDate}&params[1][name]=enddate&params[1][value]=${payload.endDate}&params[2][name]=rangestart&params[2][value]=${payload.amountStart}&params[3][name]=rangeend&params[3][value]=${payload.amountEnd}`);
    return res.data
}

//@: Token transactions by address
export const getDailyEspeesAddrTransactions = async (payload)=> {
    const op = 'getdailytransactioncounts_espees_address';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=addr&params[0][value]=${payload.addr}&params[1][name]=count&params[1][value]=${payload.count}`);
    return res.data
}

export const getHourlyEspeesAddrTransactions = async (payload) => {
    const op = 'gethourlytransactioncounts_espees_address';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=addr&params[0][value]=${payload.addr}&params[1][name]=count&params[1][value]=${payload.count}`);
    return res.data
}

export const getMonthlyEspeesAddrTransactions = async (payload) => {
    const op = 'getmonthlytransactioncounts_espees_address';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=addr&params[0][value]=${payload.addr}&params[1][name]=count&params[1][value]=${payload.count}`);
    return res.data
}

export const getEspeesAddrTransactionsCountByRange = async (payload) => {
    const op = 'gettransactioncounts_amountrange_address_espees';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=startdate&params[0][value]=${payload.startDate}&params[1][name]=enddate&params[1][value]=${payload.endDate}&params[2][name]=rangestart&params[2][value]=${payload.amountStart}&params[3][name]=rangeend&params[3][value]=${payload.amountEnd}&params[4][name]=addr&params[4][value]=${payload.addr}`);
    return res.data
}