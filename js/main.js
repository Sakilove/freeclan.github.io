var deleteLog = false;

$(document).ready(function() {
    $('#pagepiling').pagepiling({
        menu: '#menu',
        anchors: ['page1', 'page2'],
        navigation: {
            'textColor': '#f2f2f2',
            'bulletsColor': '#eef3f0',
            'position': 'left',
            'tooltips': ['Page 1', 'Page 2']
        },
        afterRender: function(){
            //playing the video
            $('video').get(0).play();
        }
    });
});
