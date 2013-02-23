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
        winl.sizeX = winl.style.width;
        winl.sizeY = winl.style.height;

        winl.style.left = "0px";
        winl.style.top = "0px";
        winl.style.width = null;
        winl.style.height = null;
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
        winl.style.width = winl.sizeX;
        winl.style.height = winl.sizeY;

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
    
    if (winl)
    {
        if (sender.className.toString().toLowerCase().split(" ")[0] == "resize")
        {
            document.body.movingWindow = winl;
            arguments[0].preventDefault();
            //get mouse position
            winl.clickPosX = e.clientX + document.body.scrollLeft;
            winl.clickPosY = e.clientY + document.body.scrollTop;
            winl.clickSizeWidth = winl.offsetWidth;
            winl.clickSizeHeight = winl.offsetHeight;
            winl.clickWinPosX = winl.offsetLeft;
            winl.clickWinPosY = winl.offsetTop;

            //resize
            if (sender.className == "resize rs")
                winl.isMoving = "S";
            if (sender.className == "resize rsw")
                winl.isMoving = "SW";
            if (sender.className == "resize rse")
                winl.isMoving = "SE";
            
            if (sender.className == "resize rn")
                winl.isMoving = "N";
            if (sender.className == "resize rnw")
                winl.isMoving = "NW";
            if (sender.className == "resize rne")
                winl.isMoving = "NE";
            
            if (sender.className == "resize re")
                winl.isMoving = "E";
            if (sender.className == "resize rw")
                winl.isMoving = "W";
            
            //TODO change cursor
        }
        else if (winl.className != "window maximized")
        {
            //get current window on top
            //TODO: move to entire window click
            if (document.body.onTopWindow != winl)
                winl.style.zIndex = ++document.body.curZIndex;
            document.body.onTopWindow = winl;

            //mark window as currenly moved
            document.body.movingWindow = winl;
            winl.isMoving = "Yes";
            
            //remember on-click position
            winl.clickPosX = e.layerX;
            winl.clickPosY = e.layerY;  
            
            //prevent default action (text selection change cursor) and set move cursor
            arguments[0].preventDefault();
            document.body.style.cursor = "move";
        }
    }
}

function mouseUp(e)
{
    //get currently moved window
    winl = document.body.movingWindow;
    
    //if is moving
    if (winl && winl.isMoving != "No")
    {
        //stop moving and change cursor to default
        winl.isMoving = "No"; 
        document.body.style.cursor = "default";
        document.body.movingWindow = null;
    }
}

function mouseMove(e)
{
    //get currently moved window
    winl = document.body.movingWindow;
    if (!winl)
        return;

    deskl = getParentDesktopElement(winl);
    //if is moving
    if (winl.isMoving == "Yes")
    {
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
    
    //if is moving
    if (winl.isMoving == "S" || winl.isMoving == "SE" || winl.isMoving == "SW")
    {
        //get mouse position
        mouseY = e.clientY + document.body.scrollTop;
        if (mouseY > deskl.offsetTop + deskl.offsetHeight - 4) mouseY = deskl.offsetTop + deskl.offsetHeight - 4;
        
        //calculate position
        hPos = (mouseY - winl.clickPosY);
        height = winl.clickSizeHeight + hPos;
        if (height < 30) height = 30;
        
        //move window
        winl.style.height = height + "px";
    }
    if (winl.isMoving == "N" || winl.isMoving == "NE" || winl.isMoving == "NW")
    {
        //get mouse position
        mouseY = e.clientY + document.body.scrollTop;
        if (mouseY < deskl.offsetTop + 4) mouseY = deskl.offsetTop + 4;
        
        //calculate position
        hPos = (mouseY - winl.clickPosY);
        height = winl.clickSizeHeight - hPos;
        if (height < 30) 
        {
            height = 30;
            hPos = winl.clickSizeHeight - height;
        }
        wTop = winl.clickWinPosY + hPos - 4;
        
        //move window
        winl.style.height = height + "px";
        winl.style.top = wTop + "px";
    }
    
    if (winl.isMoving == "E" || winl.isMoving == "SE" || winl.isMoving == "NE")
    {
        //get mouse position
        mouseX = e.clientX + document.body.scrollLeft;
        if (mouseX > deskl.offsetLeft + deskl.offsetWidth - 4) mouseX = deskl.offsetLeft + deskl.offsetWidth - 4;
        
        //calculate position
        vPos = (mouseX - winl.clickPosX);
        width = winl.clickSizeWidth + vPos;
        if (width < 200) width = 200;
        
        //move window
        winl.style.width = width + "px";
    }
    
    if (winl.isMoving == "W" || winl.isMoving == "SW" || winl.isMoving == "NW")
    {
        //get mouse position
        mouseX = e.clientX + document.body.scrollLeft;
        if (mouseX < deskl.offsetLeft + 4) mouseX = deskl.offsetLeft + 4;
        
        //calculate position
        vPos = (mouseX - winl.clickPosX);
        width = winl.clickSizeWidth - vPos;
        if (width < 200) 
        {
            width = 200;      
            vPos = winl.clickSizeWidth - width;
        }
        wLeft = winl.clickWinPosX + vPos - 4;
        
        //move window
        winl.style.width = width + "px";
        winl.style.left = wLeft + "px";
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
            win.isMoving = "No";
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
                        button.onclick = function(e){
                                sender = (e && e.target) || (window.event && window.event.srcElement);
                                if (!sender)
                                    return;
                                winl = getParentWindowElement(sender);
                                if (winl)
                                    winl.parentNode.removeChild(winl);
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
            
            //hook resize controls events
            resizeCntrls = win.querySelectorAll(".resize");
            //foreach button
            for (resizeCntrls_i = 0; resizeCntrls_i < resizeCntrls.length; resizeCntrls_i++)
            {
                resizeCntrls[resizeCntrls_i].onmousedown = function(e){ mouseDown(e); };
            }
            
        }
    }
}