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
                doc.getElementById('mirror').src = data.ads[0].data.image_url;

                image.onload = function () {
                    var inbox_open = cachedData.session.beacons.inbox_open,
                        data = {};

                    facade.getJSONP(inbox_open, data);
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
                var el_content = doc.getElementById("main-content"),
                    ad_hide = cachedData.ads[0].beacons.ad_hide;
                    data = {};
                
                el_content.classList.add("hide");

                facade.getJSONP(ad_hide, data);
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
                    data = {};

                helper.setToStorage('like');

                facade.getJSONP(ad_like, data);
            },

            dislike: function() {
                helper.setToStorage('dislike');
            },

            stop: function() {
                var ad_hide = cachedData.ads[0].beacons.ad_hide,
                    data = {};

                helper.setToStorage('stop');

                facade.getJSONP(ad_hide, data);
            },

            share: function() {
                var ad_share = cachedData.ads[0].beacons.ad_share;
                    data = {};

                helper.setToStorage('share');

                facade.getJSONP(ad_share, data);
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
            var url = 'http://loopme.me/api/v2/ads?p=1&vt=3syja4w0tw&ak=6b1dcb4bef&pp=1',
                uri = 'publick/json/test_data.json'
                data = {},
                self = this;

            var successCallback = function(data){ 
                if (data && data.ads && data.session) {
                    cachedData = data;
                    self.init(); 
                } else {
                    facade.getResult("GET", uri, mockCallback);
                }               
            };

            function mockCallback(data) {
                cachedData = JSON.parse(data);
                self.init();
            };
            
            facade.getJSONP(url, data, successCallback);
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

    //with ajax 
    activeModule.loadData();
}
