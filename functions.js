let gridSize = document.querySelector("#gridSizeSlider");
let penColor = document.querySelector("#penColor");
let eraser = document.querySelector("#eraser");
let gridsVisibleBtn = document.querySelector("#toggleGridLines");
let visibleGrid = false;
let rainbow = document.querySelector("#rainbowPenColor");
let rainbowPen = false;

gridSize.addEventListener('input', makeGrid);
eraser.addEventListener('click', () => penColor.value = "#EDC7B7");
rainbow.addEventListener('click', () => rainbowPen = !rainbowPen);

gridsVisibleBtn.addEventListener('click', () => {
    if(visibleGrid == false)
    {
        visibleGrid = true;
        gridsVisibleBtn.innerText = 'Hide Grids';
        makeGrid();
    }
    else
    {
        visibleGrid = false;
        gridsVisibleBtn.innerText = 'Show Grids';
        makeGrid();
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
            {
                gridCell.style.border = "0.1px solid black";
            }

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
        });    
    });
}

let resetBtn = document.querySelector("#resetBtn");
resetBtn.addEventListener('click', makeGrid);

function getRandomColor()
{
    return (Math.floor(Math.random() * 256));
}