const windows = document.querySelectorAll(".window");
let topZIndex = 10;
const OS = document.getElementById("OS")
let OSHeight = OS.offsetHeight;
let OSWidth = OS.offsetWidth;
 
windows.forEach((win) => {
    dragElement(win);
 
    const closeButton = win.querySelector('[aria-label="Close"]');
    const minimizeButton = win.querySelector('[aria-label="Minimize"]');
    closeButton.addEventListener("click", () => hide(win), false);
    minimizeButton.addEventListener("click", () => hide(win), false);

    document.getElementById("showButton").addEventListener("click", () => show(win), false);
 
    win.addEventListener("click", () => bringToFront(win));
});
 
function updateDocDimensions() {
    OSHeight = OS.offsetHeight;
    OSWidth = OS.offsetWidth;
}
 
window.addEventListener('resize', updateDocDimensions);
 
function bringToFront(win) {
    topZIndex++;
    win.style.zIndex = topZIndex;
}
 
function hide(divToHide) {
    if (divToHide) {
        divToHide.classList.add("minimized");
        setTimeout(() => {
            divToHide.style.visibility = "hidden";
        }, 1000);
    }
}
 
function show(divToShow) {
    if (divToShow.style.visibility === "hidden") {
        divToShow.style.visibility = "visible";
        divToShow.classList.remove("minimized");
    }
}
 
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
 
    const handle = elmnt.querySelector(".title-bar");
 
    if (handle) {
        handle.onmousedown = (e) => {
            bringToFront(elmnt);
            dragMouseDown(e);
        };
    }
 
    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
 
    }
 
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
 
 
        let newTop = elmnt.offsetTop - pos2;
        let newLeft = elmnt.offsetLeft - pos1;
 
        const maxTop = OSHeight - elmnt.offsetHeight;
        const maxLeft = OSWidth - elmnt.offsetWidth;
 
        newTop = Math.max(0, Math.min(newTop, maxTop));
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
 
        elmnt.style.top = newTop + "px";
        elmnt.style.left = newLeft + "px";
    }
 
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}