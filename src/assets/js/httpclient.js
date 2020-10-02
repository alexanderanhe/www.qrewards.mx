$(function() {
    var HttpClient = function(API_URL) {

        function init(params) {
            var args = {
                url: API_URL + params.url,
                method: params.method
            };
            if (params.data) {
                args.data = params.data;
            }
            if (params.headers) {
                args.headers = params.headers;
            }
            if (params.options) {
                for (var attr in params.options) {
                    args[attr] = params.options[attr];
                }
            }
            return args;
        };

        return {
            get: function(url, data, headers, options) {
                return $.ajax(init({
                    method: 'GET',
                    url: url,
                    data: data,
                    headers: headers
                }));
            },
            post: function(url, data, headers, options) {
                return $.ajax(init({
                    method: 'POST',
                    url: url,
                    data: data,
                    headers: headers,
                    options: options
                }));
            },
            put: function(url, data, headers, options) {
                return $.ajax(init({
                    method: 'PUT',
                    url: url,
                    data: data,
                    headers: headers
                }));
            }
        }
    };
    window.HttpClient = HttpClient;
});