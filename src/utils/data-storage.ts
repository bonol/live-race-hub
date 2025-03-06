export function fetchData(key: string): string | null {
    return localStorage.getItem(key);
}

export function saveData(key: string, data: string): void {
    localStorage.setItem(key, data);
}

export function removeData(key: string): void {
    localStorage.removeItem(key);
}
