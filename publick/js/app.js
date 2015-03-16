var bannerModule = function(options) {
    var params = options || {},
        doc = document,
        facade = new Facade();

        ui = {
            'close': doc.getElementById(params.close),
            'image': doc.getElementById(params.image),
            'download': doc.getElementById(params.download),
            'like': doc.getElementById(params.like),
            'dislike': doc.getElementById(params.dislike),
            'stop': doc.getElementById(params.stop),
            'share': doc.getElementById(params.share)
        },

        helper = {
            socialBar: {
                'like': 0,
                'dislike': 0,
                'stop': 0,
                'share': 0
            },

            applyData: function(options) {
                var data = options || {},
                    image = ui.image;
                
                image.src = data.ads[0].data.image_url;

                image.onload = function () {
                    //triggered requesыt
                    console.log('IMG Load')
                    var inbox_open = cachedData.session.beacons.inbox_open;

                    facade.getResult("GET", inbox_open, helper.successCallback)
                
                };   
            },

            setCounter: function(name, data) {
                var count = helper.socialBar,
                    store;

                if (count[name] == 0) {
                    store = localStorage.getItem(name);

                    if (store === null) {
                        count[name] += 1;
                    } else {
                        count[name] = +store + 1; // '+store' its conver to number 
                    }
                } else {
                    count[name] += 1;
                }

                return count[name]; 
            },

            setToStorage: function(nameStore) {
                if(typeof(Storage) !== "undefined") {
                    var count = helper.setCounter(nameStore);

                    localStorage.setItem(nameStore, count);
                } else {
                    console.log('No Storage');
                }
            },

            successCallback: function(data) {
                console.log(data)
            }
        },

        events = {
            close: function() {                
                var el_content = doc.getElementById("main-content");
                
                el_content.classList.add("hide");
            },

            image: function() {
                var click_url = cachedData.ads[0].data.click_url;

                window.location.replace(click_url);
            },

            download: function() {
                console.log('Hi download')
            },

            like: function() {                
                var ad_like = cachedData.ads[0].beacons.ad_like,
                    script = doc.createElement("script"),
                    head;
                
                script.type = "text/javascript";
                script.src = ad_like;

                head = doc.getElementsByTagName('head')[0];

                head.appendChild(script);

                helper.setToStorage('like');

                //facade.getResult("GET", ad_like, helper.successCallback)
            },

            dislike: function() {
                helper.setToStorage('dislike');
            },

            stop: function() {
                var ad_hide = cachedData.ads[0].beacons.ad_hide;

                helper.setToStorage('stop');

                facade.getResult("GET", ad_hide, helper.successCallback)
            },

            share: function() {
                var ad_share = cachedData.ads[0].beacons.ad_share;
                helper.setToStorage('share');

                facade.getResult("GET", ad_share, helper.successCallback)
            },
        },

    cachedData = [];

    //events mapping
    for (var key in ui) {
        ui[key].onclick = (function(key){
            return function(event) {                
                events[key]();
            };
        })(key);
    };

    return {
        setData: function(data) {
            cachedData = data;
            this.init();
        },
        init: function() {
            helper.applyData(cachedData);
        },
        loadData: function() {
            var uri = 'publick/json/test_data.json';
            var self = this;
            
            function successCallback(data) {
                cachedData = JSON.parse(data);
                self.init(); // may be use underscore.js
            };

            facade.getResult("GET", uri, successCallback);
        }
    };
};

window.onload = function() { 
    var activeModule = new bannerModule({
        close: 'close',
        image: 'image',
        download: 'download',
        like: 'like',
        dislike: 'dislike',
        stop: 'stop',
        share: 'share'
    });

    //with mock
    //activeModule.setData(mockJSON);

    //with ajax 
    activeModule.loadData();
}
