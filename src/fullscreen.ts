
var requestedfs = false;
export default function RequestFullscreen(target: HTMLElement) {
    let el: any = target || document.body;
    let d = document as any;
    let requestMethod = el.requestFullscreen || el.webkitRequestFullscreen 
        || el.mozRequestFullScreen || el.msRequestFullscreen || el.oRequestFullscreen;
    let fullscreenElement = document.fullscreenElement || d.webkitFullscreenElement
        || d.mozFullScreenElement || d.msFullscreenElement;
    let cancelMethod = document.exitFullscreen || d.webkitExitFullscreen
        || d.mozCancelFullScreen || d.msExitFullscreen;

    if (fullscreenElement) {
        if (cancelMethod) {
            cancelMethod.call(document);
        }
    } else {
        if (requestMethod) {
            // Native full screen.
            requestMethod.call(el);
        }
    }
}
