const windows = document.querySelectorAll(".window");
const files = document.querySelectorAll(".file-item");
let topZIndex = 10;

windows.forEach((win) => {
    dragElement(win);

    const closeButton = win.querySelector('[aria-label="Close"]');
    const minimizeButton = win.querySelector('[aria-label="Minimize"]');
    const maximizeButton = win.querySelector('[aria-label="Maximize"]');

    closeButton.addEventListener("click", () => hide(win));
    minimizeButton.addEventListener("click", () => hide(win));
    maximizeButton.addEventListener("click", () => maximize(win));
    
    win.addEventListener("click", () => active(win));
});

files.forEach((fi) => fi.addEventListener("click", clickItem));

function clickItem() {
    const item = this;

    if (!item.classList.contains('selected')) {
        item.classList.add('selected');
        item.classList.remove('hoverable');
        document.addEventListener("click", handleClick);
    } else {
        alert("AAAAAAAAAAAAAAAAA");
        item.classList.remove('selected');
        item.classList.add('hoverable');
        document.removeEventListener("click", handleClick);
    }

    function handleClick(evt) {
        if (!item.contains(evt.target)) {
            item.classList.remove('selected');
            item.classList.add('hoverable');
            document.removeEventListener("click", handleClick);
        }
    }
}

function openProgram() {

}

function winLimits(win, OSRect, winRect, newLeft, newTop) {
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

window.addEventListener('resize', () => {
    windows.forEach(win => {
        const OSRect = OS.getBoundingClientRect();
        const winRect = win.getBoundingClientRect();

        let newLeft = winRect.left;
        let newTop = winRect.top;

        winLimits(win, OSRect, winRect, newLeft, newTop);

    });
});


function active(win) {
    windows.forEach(winunfocus => {
        winunfocus.classList.remove("active");
    });
    win.classList.add("active");
    topZIndex++;
    win.style.zIndex = topZIndex;
}

function maximize(win) {
    const OSRect = OS.getBoundingClientRect();
    const taskBar = OS.querySelector("#taskbar-area");
    if (win && !win.classList.contains("maximized")) {
        win.classList.add("maximized");

        win.dataset.previousWidth = win.offsetWidth;
        win.dataset.previousHeight = win.offsetHeight;
        win.dataset.previousLeft = win.offsetLeft;
        win.dataset.previousTop = win.offsetTop;

        win.style.height = `${OSRect.height - taskBar.offsetHeight}px`;
        win.style.width = `${OSRect.width}px`; 
        win.style.top = `${OSRect.top }px`;      
        win.style.left = `${OSRect.left - 3}px`;
    }
    else if (win && win.classList.contains("maximized")) {
        win.classList.remove("maximized");
        win.style.height = `${win.dataset.previousHeight}px`;
        win.style.width = `${win.dataset.previousWidth}px`; 
        win.style.top = `${win.dataset.previousTop}px`;      
        win.style.left = `${win.dataset.previousLeft}px`;
    }
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
        active(win);
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

        winLimits(win, OSRect, winRect, newLeft, newTop);
    }
}


