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
    window[buttonName] = !window[buttonName];
    console.log(buttonName);
    currentButton.classList.toggle('activeBtn');
} 

gridSize.addEventListener('input', makeGrid);
eraser.addEventListener('click', () => {handleButtonClick('eraserBool'), penColor.value = "#EDC7B7"});
rainbow.addEventListener('click', () => handleButtonClick('rainbowPen'));
burnBtn.addEventListener('click', () => handleButtonClick('burn'));
dodgeBtn.addEventListener('click', () => handleButtonClick('dodge'));

gridsVisibleBtn.addEventListener('click', () => {
    let gridCell = document.querySelectorAll(".gridCell");

    if(visibleGrid == false)
    {
        visibleGrid = true;
        gridsVisibleBtn.innerHTML = '&nbsp;&nbsp;Hide Grids';
        gridCell.forEach(cell => cell.style.border = "0.1px solid black"); 
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

            if(visibleGrid === true)
                gridCell.style.border = "0.1px solid black";

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
        cell.addEventListener('mousemove', function(event) {
        
            if(clickInsideGrid === true)
            {
                if(dodge === false && burn === false)
                {
                    if(rainbowPen === false)
                        cell.style.backgroundColor = penColor.value;
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
