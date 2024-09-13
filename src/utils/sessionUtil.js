const SESSION_KEY = 'lastLoginTimestamp';
const SESSION_DURATION = 4 * 60 * 1000; // 4 minutes in milliseconds

export const setLoginTimestamp = () => {
    sessionStorage.setItem(SESSION_KEY, Date.now().toString());
};

export const checkSessionValidity = () => {
    const lastLoginTimestamp = sessionStorage.getItem(SESSION_KEY);
    if (!lastLoginTimestamp) return false;

    const currentTime = Date.now();
    const timeDifference = currentTime - parseInt(lastLoginTimestamp, 10);

    return timeDifference < SESSION_DURATION;
};

export const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
};