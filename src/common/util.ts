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
  