class HttpService {
    // eslint-disable-next-line class-methods-use-this
    ajax(method, url, data, headers) {
        const fetchHeaders = new Headers({"content-type": "application/json", ...(headers || {})});

        return fetch(url, {
            method,
            headers: fetchHeaders,
            body: JSON.stringify(data),
        }).then((x) => x.json());
    }
}

const httpService = new HttpService();
export default httpService;
