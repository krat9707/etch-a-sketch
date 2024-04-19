let gridSize = document.querySelector("#gridSizeSlider");
let penColor = document.querySelector("#penColor");
let eraser = document.querySelector("#eraser");
let gridsVisibleBtn = document.querySelector("#toggleGridLines");
let rainbow = document.querySelector("#rainbowPenColor");
let dodgeBtn = document.querySelector("#dodge");
let burnBtn = document.querySelector("#burn");

window.visibleGrid = false;
window.rainbowPen = false;
window.burn = false;
window.dodge = false;
window.eraserBool = false;

const buttons = new Map([
    ['rainbowPen', rainbow],
    ['burn', burnBtn],
    ['dodge', dodgeBtn],
    ['eraserBool', eraser],
]);

function handleButtonClick(buttonName) {
    buttons.forEach((buttonElement, buttonKey) => {
        if (buttonKey !== buttonName) {
            buttonElement.classList.remove('activeBtn');
            window[buttonKey] = false;
        }
    });

    const currentButton = buttons.get(buttonName);

    if(currentButton)
    {
        window[buttonName] = !window[buttonName];
        currentButton.classList.toggle('activeBtn');
    }
} 

let prevColorBeforeEraser = "#EDC7B7";
gridSize.addEventListener('input', makeGrid);

penColor.addEventListener('click', () => handleButtonClick('penColor'));
eraser.addEventListener('click', () => {
    if(eraserBool === false)
    {
        prevColorBeforeEraser = penColor.value;
        penColor.value = "#EDC7B7";
    }
    else
    {   
        penColor.value = prevColorBeforeEraser;
    }   
    
    handleButtonClick('eraserBool');
});
rainbow.addEventListener('click', () => handleButtonClick('rainbowPen'));
burnBtn.addEventListener('click', () => handleButtonClick('burn'));
dodgeBtn.addEventListener('click', () => handleButtonClick('dodge'));

gridsVisibleBtn.addEventListener('click', () => {
    let gridCell = document.querySelectorAll(".gridCell");

    if(visibleGrid == false)
    {
        visibleGrid = true;
        gridsVisibleBtn.innerHTML = '&nbsp;&nbsp;Hide Grids';
        gridCell.forEach(cell => cell.style.border = "1px solid black"); 
    }
    else
    {
        visibleGrid = false;
        gridsVisibleBtn.innerHTML = '&nbsp;Show Grids';
        gridCell.forEach(cell => cell.style.border = ""); 
    }
});

makeGrid();

function makeGrid() 
{
    let gridContainer = document.querySelector("#grid");
    gridContainer.innerHTML = '';
    let currentGridSize = document.querySelector("#currentGridSize");
    currentGridSize.innerText = `${gridSize.value} x ${gridSize.value}`; 

    for(let i = 0; i < gridSize.value; ++i)
    {
        for(let j = 0; j < gridSize.value; ++j)
        {
            let gridCell = document.createElement("div");
            gridCell.classList.add("gridCell");
            gridCell.style.cssText = `width: ${100/gridSize.value}%; height: ${100/gridSize.value}%`; 
            gridCell.style.backgroundColor = '#EDC7B7';

            if(visibleGrid === true)
                gridCell.style.border = "1px solid black";
            
            gridContainer.appendChild(gridCell);
        }
    }

    setupEventListener();
}

function setupEventListener()
{
    let clickInsideGrid = false;
    let gridCell = document.querySelectorAll(".gridCell");
    let grid = document.querySelector("#grid");    

    grid.addEventListener('mousedown', function (event) {
        clickInsideGrid = true;
    });

    grid.addEventListener('mouseup', function(event) {
        clickInsideGrid = false;
    });

    gridCell.forEach(cell => {
        cell.addEventListener('mouseenter', function(event) {
        
            if(clickInsideGrid === true)
            {
                if(dodge === false && burn === false)
                {
                    if(rainbowPen === false)
                    {
                        cell.style.backgroundColor = penColor.value;
                        cell.removeAttribute('data-shade');
                    }
                    else
                    {
                        let r = getRandomColor();
                        let g = getRandomColor();
                        let b = getRandomColor();

                        cell.style.backgroundColor = "rgb("+r+", "+g+", "+b+")";
                    }
                }
                else
                {
                    if(!cell.hasAttribute('data-shade'))
                    {
                        cell.setAttribute('data-shade', '0');
                    }
                    let shade = parseInt(cell.getAttribute('data-shade'));

                    if(dodge === true)  shade++;       
                    else    shade--;

                    cell.setAttribute('data-shade', `${shade}`);
                    cell.style.backgroundColor = adjust(rgbToHex, cell.style.backgroundColor, shade * -2);
                }
            }
        });    
    });
}

let resetBtn = document.querySelector("#resetBtn");
resetBtn.addEventListener('click', makeGrid);

function getRandomColor()
{
    return (Math.floor(Math.random() * 256));
}

function rgbToHex(rgb) {
    let sep = rgb.indexOf(',') > -1 ? ',' : ' ';

    rgb = rgb.substr(4).split(')')[0].split(sep);
    
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
    
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    b = (+rgb[2]).toString(16);
    
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    return '#' + r + g + b;
}

function adjust(rgbToHex, rgb, amount) 
{
    let color = rgbToHex(rgb);
    return (
      '#' +
      color
        .replace(/^#/, '')
        .replace(/../g, (color) =>
          ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
        )
    );
}
  
  

  