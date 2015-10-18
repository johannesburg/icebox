/*
--------------------------------
imgur Upload
--------------------------------
+ https://github.com/pinceladasdaweb/imgur-upload
+ version 1.1
+ Copyright 2014 Pedro Rogerio
+ Licensed under the MIT license
+ Documentation: https://github.com/pinceladasdaweb/imgur-upload
*/

var Imgur = (function (d) {
    "use strict";
    /*jslint browser: true*/
    var module = {
        xhr: function () {
            return new XMLHttpRequest();
        },
        create: function (name, props) {
            var el = d.createElement(name), p;
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    el[p] = props[p];
                }
            }
            return el;
        },
        remove: function (els) {
            while (els.hasChildNodes()) {
                els.removeChild(els.lastChild);
            }
        },
        upload: function (file, callback) {
            var xhttp    = module.xhr(),
                status   = d.querySelector('.status'),
                self     = this,
                fd       = new FormData();

            fd.append('image', file);
            xhttp.open('POST', 'https://api.imgur.com/3/image');
            xhttp.setRequestHeader('Authorization', 'Client-ID 1e560a1d3b0f4a9'); //Get yout Client ID here: http://api.imgur.com/
            xhttp.onreadystatechange = function () {
                if (xhttp.status === 200 && xhttp.readyState === 4) {
                    var res = JSON.parse(xhttp.responseText), link, p, a, t;

                    self.remove(status);

                    link = res.data.link;
                    p    = self.create('p');
                    a    = self.create('a', {
                        href: link,
                        target: '_blank'
                    });
                    t    = d.createTextNode(link);

                    a.appendChild(t);
                    p.appendChild(a);
                    status.appendChild(p);

                    callback(xhttp);
                }
            };
            xhttp.send(fd);
        }
    };

    return {
        upload: module.upload
    };
}(document));