var bannerModule = function(options) {
    var params = options || {},
        doc = document,

        ui = {
            'close': doc.getElementById(options.close),
            'image': doc.getElementById(options.image),
            'download': doc.getElementById(options.download),
            'like': doc.getElementById(options.like),
            'dislike': doc.getElementById(options.dislike),
            'stop': doc.getElementById(options.stop),
            'share': doc.getElementById(options.share)
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
                    //triggered request
                
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
                        console.log(store)
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
            }
        },

        events = {
            close: function() {                
                var el_content = doc.getElementById("main-content");
                
                el_content.classList.add("hide");

                //triggered request
            },

            image: function() {
                console.log('Hi image')

            },

            download: function() {
                console.log('Hi download')
            },

            like: function() {
                helper.setToStorage('like');
            },

            dislike: function() {
                helper.setToStorage('dislike');
            },

            stop: function() {
                helper.setToStorage('stop');
            },

            share: function() {
                helper.setToStorage('share');
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
            var self = this;
            $.get('js/info_box.json', function(data) {
                cachedData = data;
            })
            .done(function() {
                self.init();
            });
        }
    };
};

window.onload = function() { 
    var activeModule = new bannerModule({
        close: 'close',
        image: 'image-responsive',
        download: 'download',
        like: 'like',
        dislike: 'dislike',
        stop: 'stop',
        share: 'share'
    });

    //with mock
    activeModule.setData(mockJSON);

    //with ajax 
    //activeModule.loadData();

}
