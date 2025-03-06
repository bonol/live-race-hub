export function fetchData(key) {
    return localStorage.getItem(key);
}
export function saveData(key, data) {
    localStorage.setItem(key, data);
}
export function removeData(key) {
    localStorage.removeItem(key);
}
