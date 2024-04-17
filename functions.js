let gridSize = document.querySelector("#gridSizeSlider");
gridSize.addEventListener('input', makeGrid);

makeGrid();

function makeGrid() 
{
    let gridContainer = document.querySelector("#grid");
    gridContainer.innerHTML = '';

    for(let i = 0; i < gridSize.value; ++i)
    {
        for(let j = 0; j < gridSize.value; ++j)
        {
            let gridCell = document.createElement("div");
            gridCell.classList.add("gridCell");
            gridCell.style.cssText = `width: ${100/gridSize.value}%; height: ${100/gridSize.value}%`; 

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
            console.log('mousemove event, clickInsideGrid:', clickInsideGrid);
        
            if(clickInsideGrid === true)
                cell.style.backgroundColor = "black";
        });    
    });
}
