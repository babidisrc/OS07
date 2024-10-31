const windows = document.querySelectorAll(".window");
let topZIndex = 10;

windows.forEach((win) => {
    dragElement(win);

    const closeButton = win.querySelector('[aria-label="Close"]');
    const minimizeButton = win.querySelector('[aria-label="Minimize"]');

    closeButton.addEventListener("click", () => hide(win));
    minimizeButton.addEventListener("click", () => hide(win));

    document.getElementById("showButton").addEventListener("click", () => showAllWindows());
    
    win.addEventListener("click", () => bringToFront(win));
});

function bringToFront(win) {
    topZIndex++;
    win.style.zIndex = topZIndex;
}

function hide(divToHide) {
    if (divToHide) {
        divToHide.classList.add("minimized");
        setTimeout(() => {
            divToHide.style.visibility = "hidden";
        }, 10); 
    }
}

function showAllWindows() {
    windows.forEach(win => {
        win.classList.remove("minimized");
        win.style.visibility = "visible"; 
    });
}


function dragElement(win) {
    const titleBar = win.querySelector('.title-bar');
    let offsetX, offsetY;

    titleBar.addEventListener('mousedown', (e) => {
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        bringToFront(win);
        document.addEventListener('mousemove', onMouseMove);
    });

    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onMouseMove);
    });

    function onMouseMove(e) {
        const OSRect = OS.getBoundingClientRect();
        const winRect = win.getBoundingClientRect();
        
        
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        if (newLeft < OSRect.left) {
            newLeft = OSRect.left;
        } else if (newLeft + winRect.width > OSRect.right) {
            newLeft = OSRect.right - winRect.width;
        }

        if (newTop < OSRect.top) {
            newTop = OSRect.top;
        } else if (newTop + winRect.height > OSRect.bottom) {
            newTop = OSRect.bottom - winRect.height;
        }

        win.style.left = `${newLeft}px`;
        win.style.top = `${newTop}px`;
    }
}


