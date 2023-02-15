import axios from 'axios';

export const loginUser = async (address) => {
    const op = 'isaddress';
    const res = await axios.get(`https://toronet.org/api/util?op=${op}&params[0][name]=addr&params[0][value]=${address}`);
    return res.data
}

export const verifyUser = async (payload) => {
    const res = await axios.get(`https://toronet.org/api/keystore?op=verifykey&params[0][name]=addr&params[0][value]=${payload.address}&params[1][name]=pwd&params[1][value]=${payload.password}`);
    return res.data
}

export const getAddrRole = async (address) => {
    const op = 'getaddrrole';
    const res = await axios.get(`https://toronet.org/api/query?op=${op}&params[0][name]=addr&params[0][value]=${address}`);
    return res.data
}