const windows = document.querySelectorAll(".window");
const files = document.querySelectorAll(".file-item");
const iframes = document.querySelectorAll("iframe");
let topZIndex = 10;

windows.forEach((win) => {
    dragElement(win);

    const closeButton = win.querySelector('[aria-label="Close"]');
    const minimizeButton = win.querySelector('[aria-label="Minimize"]');
    const maximizeButton = win.querySelector('[aria-label="Maximize"]');

    closeButton.addEventListener("click", () => close(win));
    minimizeButton.addEventListener("click", () => minimized(win));
    maximizeButton.addEventListener("click", () => maximize(win));
    
    win.addEventListener("click", () => active(win));

    iframes.forEach((iframe) => { 
        const windowBody = iframe.closest(".window-body");
        iframe.onload = function() {
            iframe.style.height = windowBody.clientHeight + 'px';
            iframe.style.width = windowBody.clientWidth + 'px';
        }
        
        iframe.addEventListener("mousedown", () => {
            const parentWindow = iframe.closest(".window");
            if (parentWindow) {
                active(parentWindow);
            }
        });
    });
        
});

files.forEach((fi) => fi.addEventListener("click", clickItem));

function clickItem() {
    const item = this;

    if (!item.classList.contains('selected')) {
        item.classList.add('selected');
        item.classList.remove('hoverable');
        document.addEventListener("click", handleClick);
    } else {
        openWin(item.id);
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

function openWin(id) {
    const winToOpen = document.getElementById("window_" + id);
    const iframe = document.getElementById("iframe_" + id);

    if (!winToOpen.classList.contains("minimized")) {
        winToOpen.style.top = `${winToOpen.dataset.previousTop}px`;      
        winToOpen.style.left = `${winToOpen.dataset.previousLeft}px`;
        iframe.src = iframe.src.split('?')[0] + '?' + new Date().getTime();
    }

    winToOpen.classList.remove("closed");
    winToOpen.style.top = '100px'; 
    winToOpen.style.left = '100px';
    winToOpen.classList.remove("minimized");
    winToOpen.classList.add("active");
    winToOpen.style.zIndex = ++topZIndex;
    
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

        
        const iframe = win.querySelector("iframe");

        if (iframe) {
            iframe.onload = function() { 
            const iframeContentHeight = iframe.contentWindow.document.body.scrollHeight;
            const iframeContentWidth = iframe.contentWindow.document.body.scrollWidth;

            win.style.height = iframeContentHeight + 'px';
            win.style.width = iframeContentWidth + 'px';
        };
    }
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

function previousSettingsWin (win, windowBody, iframe) {
    win.style.height = `${win.dataset.previousHeight}px`;
    win.style.width = `${win.dataset.previousWidth}px`; 
    win.style.top = `${win.dataset.previousTop}px`;      
    win.style.left = `${win.dataset.previousLeft}px`;

    windowBody.style.height = `${win.dataset.previousHeight}px`;
    windowBody.style.width = `${win.dataset.previousWidth - 28}px`; 

    iframe.style.height = `${win.dataset.previousHeight - 55}px`;
    iframe.style.width =  `${win.dataset.previousWidth - 28}px`;
}

function maximize(win) {
    const OSRect = OS.getBoundingClientRect();
    const taskBar = OS.querySelector("#taskbar-area");
    const windowBody = win.querySelector(".window-body");
    const iframe = win.querySelector("iframe");
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

        windowBody.style.height = `${OSRect.height - taskBar.offsetHeight - 50}px`;
        windowBody.style.width = `${OSRect.width - 28}px`;

        iframe.style.height = `${OSRect.height - taskBar.offsetHeight - 50}px`;
        iframe.style.width = `${OSRect.width - 28}px`;

    }
    else if (win && win.classList.contains("maximized")) {
        win.classList.remove("maximized");
        previousSettingsWin(win, windowBody, iframe);
    }
}

function minimized(divToHide) {
    if (divToHide) {
        divToHide.classList.remove("active");
        divToHide.classList.remove("maximized");
        divToHide.classList.add("minimized");
        setTimeout(() => {
        }, 10); 
    }
}

function close(divToHide) {
        divToHide.classList.remove("maximized");
        const windowBody = divToHide.querySelector(".window-body");
        const iframe = divToHide.querySelector("iframe");
        previousSettingsWin(divToHide, windowBody, iframe);
        
        divToHide.classList.add("closed");
        divToHide.style.top = '100px';
        divToHide.style.left = '100px';
}

function dragElement(win) {
    const titleBar = win.querySelector('.title-bar');
    const windowBody = win.querySelector(".window-body");
    const iframe = win.querySelector("iframe");
    let offsetX, offsetY;

    titleBar.addEventListener('mousedown', (e) => {
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;

        if (win.classList.contains("maximized")) {
            previousSettingsWin(win, windowBody, iframe);
            win.classList.remove("maximized");
            
        }

        if (!win.classList.contains("active")) {
            active(win);
        }
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

        if (iframe) {
            iframe.style.height = (win.clientHeight - 55) + 'px';
            iframe.style.width = (win.clientWidth - 28) + 'px';
        }
    }
}


