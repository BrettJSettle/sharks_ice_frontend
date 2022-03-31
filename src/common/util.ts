import queryString from 'query-string'

export function getSeason() {
    let url = window.location.href;
    url = url.substring(url.search('\\?'));
    let queries = queryString.parse(url);
    if ('season' in queries) {
        return queries['season'];
    }
    return 'current';
}

export const eventBus = {
    // @ts-ignore
    on(event, callback) {
      document.addEventListener(event, (e) => callback(e.detail));
    },
    // @ts-ignore
    dispatch(event, data) {
      document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
    // @ts-ignore
    remove(event, callback) {
      document.removeEventListener(event, callback);
    },
  };
  