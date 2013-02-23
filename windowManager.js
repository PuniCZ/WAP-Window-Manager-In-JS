/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function getParentDesktopElement(el)
{
    var p = el.parentNode;
    while (p && p.className.toString().toLowerCase() != "desktop")
    {
        p = p.parentNode;
    }
    return p;
}

function getParentWindowElement(el)
{
    var p = el.parentNode;
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
                <span class="title">' + win.title + '</span> \
                <a href="#" class="button close">X</a> \
                <a href="#" class="button maximize">☐</a> \
                <a href="#" class="button minimize">▂</a> \
            </div> \
        ';
}

function init()
{
    var desktops = document.querySelectorAll(".desktop");
    for (var desktops_i = 0; desktops_i < desktops.length; desktops_i++)
    {
        var desktop = desktops[desktops_i];
        
        var windows = desktop.querySelectorAll(".window");
        for (var windows_i = 0; windows_i < windows.length; windows_i++)
        {
            var win = windows[windows_i];
            
            drawBorders(win);
            drawHeader(win);
            
            var header = win.querySelectorAll(".header")[0];
            if (header)
            {
                header.onmousedown = function(){
                        if (win.className != "window maximized")
                        {
                            arguments[0].preventDefault();
                            win.clickPosX = arguments[0].layerX;
                            win.clickPosY = arguments[0].layerY;

                            win.isMoving = true;
                            document.body.style.cursor = "move";
                        }
                    };
                document.onmouseup = function(){
                        //alert("mouse up");
                        if (win.isMoving)
                        {
                            win.isMoving = false; 
                            document.body.style.cursor = "default";
                        }
                    };
                document.onmousemove = function(){
                        if (win.isMoving)
                        {
                            var mouseX = arguments[0].clientX + document.body.scrollLeft;
                            var mouseY = arguments[0].clientY + document.body.scrollTop;
                            
                            win.style.left = (mouseX - win.clickPosX - 10) + "px";
                            win.style.top = (mouseY - win.clickPosY - 10) + "px";
                            
                            document.onselectstart = null;
                        }
                    };
            }
            
            win.positionX = 0;
            win.positionY = 0;
            
            var headerButtons = win.querySelectorAll(".header a.button");
            for (var headerButtons_i = 0; headerButtons_i < headerButtons.length; headerButtons_i++)
            {
                var button = headerButtons[headerButtons_i];

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
                                var window = getParentWindowElement(this);
                                if (window.className.toLowerCase() == "window")
                                {
                                    win.positionX = win.style.left;
                                    win.positionY = win.style.top;
                                    
                                    win.style.left = "0px";
                                    win.style.top = "0px";
                                    window.setAttribute("class", "window maximized");
                                }
                                else
                                {
                                    window.setAttribute("class", "window");
                                    win.style.left = win.positionX;
                                    win.style.top = win.positionY;
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