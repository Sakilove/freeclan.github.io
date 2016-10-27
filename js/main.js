var deleteLog = false;
var isVideoLoaded = false;
var loadingCheck;
var loadingProgress = 0;
var loadingAnimationComplete = false;
var loadingAnimationSpeedUp = false;
var video;

$(document).ready(function() {
    video = $('#myVideo')[0];
    loadingCheck = setInterval(videoLoading,200);
    loadingAnimation();
});
function videoLoading() {

    loadingProgress = video.buffered.end(0)/video.duration;
    console.log(loadingProgress);
    if(loadingProgress > 0.8){
        loadingAnimationSpeedUp = true;
    }
    if(loadingAnimationComplete && !isVideoLoaded){
        isVideoLoaded = true;
        loadingEnd();
        window.clearInterval(loadingCheck);
    }
}
function loadingEnd() {
    animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
    };
    // animation end event name
    animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
    $("#loading").addClass("pt-page-scaleDown");
    $("#main-page").addClass("pt-page-current");
    $("#main-page").addClass("pt-page-scaleUpDown");
    $("#main-page").addClass("pt-page-delay300");
    $("#loading").on(animEndEventName,function () {
        $("#loading").removeClass("pt-page-current");

    });



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
}
function loadingAnimation() {
    var $body = document.body,
        $wrap = document.getElementById('wrap'),

        areawidth = window.innerWidth,
        areaheight = window.innerHeight,

        canvassize = 500,

        length = 30,
        radius = 5.6,

        rotatevalue = 0.035,
        acceleration = 0,
        animatestep = 0,
        bgColor = 0x1abc9c,
        bgColorStr = "#1ABC9C",

        pi2 = Math.PI*2,

        group = new THREE.Group(),
        mesh, ringcover, ring,

        camera, scene, renderer;


    camera = new THREE.PerspectiveCamera(65, 1, 1, 10000);
    camera.position.z = 150;

    scene = new THREE.Scene();
    // scene.add(new THREE.AxisHelper(30));
    scene.add(group);

    mesh = new THREE.Mesh(
        new THREE.TubeGeometry(new (THREE.Curve.create(function() {},
            function(percent) {

                var x = length*Math.sin(pi2*percent),
                    y = radius*Math.cos(pi2*3*percent),
                    z, t;

                t = percent%0.25/0.25;
                t = percent%0.25-(2*(1-t)*t* -0.0185 +t*t*0.25);
                if (Math.floor(percent/0.25) == 0 || Math.floor(percent/0.25) == 2) {
                    t *= -1;
                }
                z = radius*Math.sin(pi2*2* (percent-t));

                return new THREE.Vector3(x, y, z);

            }
        ))(), 200, 1.1, 2, true),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
            // , wireframe: true
        })
    );
    group.add(mesh);

    ringcover = new THREE.Mesh(new THREE.PlaneGeometry(50, 15, 1), new THREE.MeshBasicMaterial({color: bgColor, opacity: 0, transparent: true}));
    ringcover.position.x = length+1;
    ringcover.rotation.y = Math.PI/2;
    group.add(ringcover);

    ring = new THREE.Mesh(new THREE.RingGeometry(4.3, 5.55, 32), new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0, transparent: true}));
    ring.position.x = length+1.1;
    ring.rotation.y = Math.PI/2;
    group.add(ring);

    // fake shadow
    (function() {
        var plain, i;
        for (i = 0; i < 10; i++) {
            plain = new THREE.Mesh(new THREE.PlaneGeometry(length*2+1, radius*3, 1), new THREE.MeshBasicMaterial({color: bgColor, transparent: true, opacity: 0.13}));
            plain.position.z = -2.5+i*0.5;
            group.add(plain);
        }
    })();

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvassize, canvassize);
    renderer.setClearColor(bgColorStr);

    $wrap.appendChild(renderer.domElement);


    animate();


    function tilt(percent) {
        group.rotation.y = percent*0.5;
    }

    function render() {

        var progress;

        animatestep = Math.max(0, Math.min(240, loadingAnimationSpeedUp ? animatestep+1 : animatestep-4));
        acceleration = easing(animatestep, 0, 1, 240);

        if (acceleration > 0.35) {
            progress = (acceleration-0.35)/0.65;
            group.rotation.y = -Math.PI/2 *progress;
            group.position.z = 50*progress;
            progress = Math.max(0, (acceleration-0.97)/0.03);
            mesh.material.opacity = 1-progress;
            ringcover.material.opacity = ring.material.opacity = progress;
            ring.scale.x = ring.scale.y = 0.9 + 0.1*progress;
            if(progress >= 1){
                loadingAnimationComplete = true;
            }
        }

        renderer.render(scene, camera);

    }

    function animate() {
        mesh.rotation.x += (rotatevalue + acceleration + (loadingProgress/0.8*0.103));
        render();
        requestAnimationFrame(animate);
    }

    function easing(t,b,c,d) {if((t/=d/2)<1)return c/2*t*t+b;return c/2*((t-=2)*t*t+2)+b;}
}
