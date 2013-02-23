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

function init()
{
    desktops = document.querySelectorAll(".desktop");
    for (desktops_i = 0; desktops_i < desktops.length; desktops_i++)
    {
        desktop = desktops[desktops_i];
        
        windows = desktop.querySelectorAll(".window");
        for (windows_i = 0; windows_i < windows.length; windows_i++)
        {
            win = windows[windows_i];
            
            drawBorders(win);
            drawHeader(win);
            
            header = win.querySelectorAll(".header")[0];
            if (header)
            {
                header.onmousedown = function(){
                        sender = (arguments[0] && arguments[0].target) || (window.event && window.event.srcElement);
                        winl = getParentWindowElement(sender);
                        if (winl && winl.className != "window maximized")
                        {
                            document.body.movingWindow = winl;
                            arguments[0].preventDefault();
                            winl.clickPosX = arguments[0].layerX;
                            winl.clickPosY = arguments[0].layerY;

                            winl.isMoving = true;
                            document.body.style.cursor = "move";
                        }
                    };
                document.onmouseup = function(){
                        sender = (arguments[0] && arguments[0].target) || (window.event && window.event.srcElement);
                        winl = document.body.movingWindow;
                        if (winl && winl.isMoving)
                        {
                            winl.isMoving = false; 
                            document.body.style.cursor = "default";
                            document.body.movingWindow = null;
                        }
                    };
                document.onmousemove = function(){
                        sender = (arguments[0] && arguments[0].target) || (window.event && window.event.srcElement);
                        winl = document.body.movingWindow;
                        if (winl && winl.isMoving)
                        {
                            mouseX = arguments[0].clientX + document.body.scrollLeft;
                            mouseY = arguments[0].clientY + document.body.scrollTop;
                            
                            winl.style.left = (mouseX - winl.clickPosX - 14) + "px";
                            winl.style.top = (mouseY - winl.clickPosY - 14) + "px";
                            
                            document.onselectstart = null;
                        }
                    };
            }
            
            win.positionX = 0;
            win.positionY = 0;
            
            headerButtons = win.querySelectorAll(".header a.button");
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
                        button.onclick = function(){
                                sender = (arguments[0] && arguments[0].target) || (window.event && window.event.srcElement);
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
                                
                            };
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