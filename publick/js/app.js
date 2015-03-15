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
            applyData: function(options) {
                var data = options || {};
                console.log(data.ads[0].data.image_url);
                // ui.description.text(data.description);
                // ui.header.text(data.title);
                // ui.notes.text(data.note);
                ui.image.find('.img').attr('src', 'img/' + data.ads[0].data.image_url);
            }
        },

        events = {
            close: function() {
                console.log('Hi close')
            },

            image: function() {
                console.log('Hi image')

            },

            download: function() {
                console.log('Hi download')
            },

            like: function() {
                console.log('Hi like')
            },

            dislike: function() {
                console.log('Hi dislike')
            },

            stop: function() {
                console.log('Hi stop')
            },

            share: function() {
                console.log('Hi share')
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
