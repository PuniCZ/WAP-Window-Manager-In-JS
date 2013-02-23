/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function getParentDesktopElement(el)
{
    p = el.parentNode;
    while (p && p.className.toString().toLowerCase() != "desktop")
    {
        p = p.parentNode;
    }
    return p;
}

function getParentWindowElement(el)
{
    p = el.parentNode;
    while (p && p.className.toString().toLowerCase().split(" ")[0] != "window")
    {
        p = p.parentNode;
    }
    return p;
}

function drawBorders(win)
{
    win.innerHTML += '\
            <div class="resize rn"></div>  \
            <div class="resize rs"></div>  \
            <div class="resize rw"></div>  \
            <div class="resize re"></div>  \
            <div class="resize rne"></div> \
            <div class="resize rse"></div> \
            <div class="resize rnw"></div> \
            <div class="resize rsw"></div> \
        ';
}

function drawHeader(win)
{
    win.innerHTML += '\
            <div class="header"> \
                <span class="title">' + win.getAttribute("data-title") + '</span> \
                <a href="#" class="button close">X</a> \
                <a href="#" class="button maximize">☐</a> \
                <a href="#" class="button minimize">▂</a> \
            </div> \
        ';
}

function maximizeClick(e)
{
    sender = (e && e.target) || (window.event && window.event.srcElement);
    if (!sender)
        return;
    
    deskl = getParentDesktopElement(sender);
    winl = getParentWindowElement(sender);
    if (winl.className.toLowerCase() == "window")
    {
        winl.positionX = winl.style.left;
        winl.positionY = winl.style.top;

        winl.style.left = "0px";
        winl.style.top = "0px";
        winl.setAttribute("class", "window maximized");

        wins = deskl.querySelectorAll(".window");
        for (wins_i = 0; wins_i < wins.length; wins_i++)
        {
            if (wins[wins_i] != winl)
            {
                wins[wins_i].style.display = "none";
            }
        }
    }
    else
    {
        winl.setAttribute("class", "window");
        winl.style.left = winl.positionX;
        winl.style.top = winl.positionY;

        wins = deskl.querySelectorAll(".window");
        for (wins_i = 0; wins_i < wins.length; wins_i++)
        {
            if (wins[wins_i] != winl)
            {
                wins[wins_i].style.display = "block";
            }
        }
    }
}

function mouseDown(e)
{
    sender = (e && e.target) || (window.event && window.event.srcElement);
    if (!sender)
        return;

    //get window
    winl = getParentWindowElement(sender);

    //resize only if not maximized
    if (winl && winl.className != "window maximized")
    {
        //get current window on top
        if (document.body.onTopWindow != winl)
            winl.style.zIndex = ++document.body.curZIndex;
        document.body.onTopWindow = winl;

        //mark window as currenly moved
        document.body.movingWindow = winl;
        winl.isMoving = true;

        //get mouse position
        mouseX = e.clientX + document.body.scrollLeft;
        mouseY = e.clientY + document.body.scrollTop;

        //remember on-click position
        winl.clickPosX = e.layerX;
        winl.clickPosY = e.layerY;    
        //alert(e.screenX);

        //prevent default action (text selection change cursor) and set move cursor
        arguments[0].preventDefault();
        document.body.style.cursor = "move";
    }
}

function mouseUp(e)
{
    //get currently moved window
    winl = document.body.movingWindow;
    
    //if is moving
    if (winl && winl.isMoving)
    {
        //stop moving and change cursor to default
        winl.isMoving = false; 
        document.body.style.cursor = "default";
        document.body.movingWindow = null;
    }
}

function mouseMove(e)
{
    //get currently moved window
    winl = document.body.movingWindow;
    
    //if is moving
    if (winl && winl.isMoving)
    {
        deskl = getParentDesktopElement(winl);
        //get mouse position
        mouseX = e.clientX + document.body.scrollLeft;
        mouseY = e.clientY + document.body.scrollTop;
        
        //calculate position
        wleft = (mouseX - findPosX(deskl)) - winl.clickPosX - 6;
        wtop = (mouseY - findPosY(deskl)) - winl.clickPosY - 6;
        if (wleft < 0) wleft = 0;
        if (wtop < 0) wtop = 0;
        if (wleft > deskl.offsetWidth - winl.offsetWidth - 12) wleft = deskl.offsetWidth - winl.offsetWidth - 12;
        if (wtop > deskl.offsetHeight - winl.offsetHeight - 12) wtop = deskl.offsetHeight - winl.offsetHeight - 12;
        
        //move window
        winl.style.left = wleft + "px";
        winl.style.top = wtop + "px";
    }
}

function findPosX(obj) {
    curleft = 0;
    if (obj.offsetParent) {
        while (1) {
            curleft+=obj.offsetLeft;
            if (!obj.offsetParent) {
                break;
            }
            obj=obj.offsetParent;
        }
    } else if (obj.x) {
        curleft+=obj.x;
    }
    return curleft;
}

function findPosY(obj) {
    curtop = 0;
    if (obj.offsetParent) {
        while (1) {
            curtop+=obj.offsetTop;
            if (!obj.offsetParent) {
                break;
            }
            obj=obj.offsetParent;
        }
    } else if (obj.y) {
        curtop+=obj.y;
    }
    return curtop;
}

function init()
{
    //foreach desktop
    desktops = document.querySelectorAll(".desktop");
    for (desktops_i = 0; desktops_i < desktops.length; desktops_i++)
    {
        desktop = desktops[desktops_i];
        //foreach window in desktop
        windows = desktop.querySelectorAll(".window");
        for (windows_i = 0; windows_i < windows.length; windows_i++)
        {
            win = windows[windows_i];
            
            //set proper z-index
            document.body.onTopWindow = win;
            document.body.curZIndex = windows_i;
            
            //wrap content and create controls
            content = win.innerHTML;
            win.innerHTML = "";
            drawBorders(win);
            drawHeader(win);
            win.innerHTML += '<div class="content">'+content+'</div>';
            
            //move window to position
            win.style.left = 10 + (25 * (windows_i)) + "px";
            win.style.top = 10 + (25 * (windows_i)) + "px";
            win.positionX = win.style.left;
            win.positionY = win.style.top;
            
            //hook movement events
            header = win.querySelectorAll(".header")[0];
            if (header)
            {
                header.onmousedown = function(e){ mouseDown(e); };
                document.onmouseup = function(e){ mouseUp(e); };
                document.onmousemove = function(e){ mouseMove(e); };
            }
            
            //hook control buttons events
            headerButtons = win.querySelectorAll(".header a.button");
            //foreach button
            for (headerButtons_i = 0; headerButtons_i < headerButtons.length; headerButtons_i++)
            {
                button = headerButtons[headerButtons_i];

                switch(button.className)
                {
                    case "button close":
                        button.onclick = function(){
                                alert("close");
                                return false;
                            };
                        break;
                    case "button maximize":
                        button.onclick = function(e){ maximizeClick(e); };
                        break;
                    case "button minimize":
                        button.onclick = function(){
                                alert("min");
                            };
                        break;
                }
            }
        }
    }
}