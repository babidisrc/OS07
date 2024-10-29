const windows = document.querySelectorAll(".window");
let topZIndex = 10;

windows.forEach((win) => {
    dragElement(win);
  
    const closeButton = win.querySelector(".closeButton");
    closeButton.addEventListener("click", () => hide(win), false);

    document.getElementById("showButton").addEventListener("click", () => show(win), false);

    win.addEventListener("click", bringToFront(win));
});

function bringToFront(win) {
    topZIndex++;
    win.style.zIndex = topZIndex;
}

function hide(divToHide) {
    if (divToHide) {
        divToHide.style.visibility = "hidden";
    }
}

function show(divToShow) {
    if (divToShow.style.visibility === "hidden") {
        divToShow.style.visibility = "visible";
    }
}

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    const handle = elmnt.querySelector(".header");
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
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}