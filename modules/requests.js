import { wait } from './messageUtils.js';


const isFirstRequest = (id, skinId) => {
    return global.requests[skinId][0] == id;
};

const init = (id, skinId) => {
    if (!global.requests[skinId]) global.requests[skinId] = [id];
    else global.requests[skinId].push(id);
    return global.requests[skinId];
};

/**
 * Process requests
 * @param {Number} skinId
 * @returns Promise<User>
 */
const processRequests = async(skinId) => {
    await wait(10000);
    const firstUser = global.requests[skinId][0];
    delete global.requests[skinId];
    console.log(`closed request queue for ${skinId}`);
    return firstUser;
};

export { isFirstRequest, init, processRequests };
