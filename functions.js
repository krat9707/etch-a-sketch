// assigning DOM elements 
let gridSize = document.querySelector("#gridSizeSlider");
let penColor = document.querySelector("#penColor");
let eraser = document.querySelector("#eraser");
let gridsVisibleBtn = document.querySelector("#toggleGridLines");
let rainbow = document.querySelector("#rainbowPenColor");
let dodgeBtn = document.querySelector("#dodge");
let burnBtn = document.querySelector("#burn");



//declaring booleans for button status
window.visibleGrid = false;
window.rainbowPen = false;
window.burn = false;
window.dodge = false;
window.eraserBool = false;



//declaring Map data structure to keep all the buttons and DOMelements of buttons in pair
const buttons = new Map([
    ['rainbowPen', rainbow],
    ['burn', burnBtn],
    ['dodge', dodgeBtn],
    ['eraserBool', eraser],
]);



//takes the button clicked as parameter and iterates through whole map and turns off all other buttons except the one click and toggles the clicked btn.
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



gridSize.addEventListener('input', makeGrid);
//saves the color that user selected(default to bgColor) 

let prevColorBeforeEraser = "#EDC7B7";
//saves the current color used by user while using eraser and assigns back once turned off
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
penColor.addEventListener('click', () => handleButtonClick('penColor'));
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


//clears off the container first and then start nested loop for the selected grid size
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
            //creates the element in memory first and class is assigned for gridCell css styles so that it's style can be manipulated directly 
            let gridCell = document.createElement("div");
            gridCell.classList.add("gridCell");
            gridCell.style.cssText = `width: ${100/gridSize.value}%; height: ${100/gridSize.value}%`; //with respect to selected size of grid, size of gridCell is calculated 
            gridCell.style.backgroundColor = '#EDC7B7'; //default color of background is selected. This color is preferred for theme of the website
                
            if(visibleGrid === true)    // if the grid button was set ON and size is changed, then we keep grids upon the creation of new Grid
                gridCell.style.border = "1px solid black";
            
            gridContainer.appendChild(gridCell); // finally appending to the DOM tree
        }
    }

    setupEventListener(); // calling this function to setup the eventListeners on newly created Cells and grid
}

function setupEventListener()
{
    //Boolean for tracking if click was made inside grid
    let clickInsideGrid = false;
    //DOMelements declared, gridCell is an Array of gridCells
    let gridCell = document.querySelectorAll(".gridCell");
    let grid = document.querySelector("#grid");    

    // below two eventListeners together achieves the click & drag logic
    grid.addEventListener('mousedown', function (event) {
        clickInsideGrid = true;
    });

    grid.addEventListener('mouseup', function(event) {
        clickInsideGrid = false;
    });

    // iterating through all the gridCell and assinging them eventListener
    gridCell.forEach(cell => {
        cell.addEventListener('mouseenter', function(event) {
            
            // if there was click inside grid and is being dragged over this cell then --
            if(clickInsideGrid === true)
            {
                // if dodge & burn wasnt the one clicked then we have to assign 100% opace color (let it either be random color or user preferred)
                if(dodge === false && burn === false)
                {
                    if(rainbowPen === false)
                    {
                        cell.style.backgroundColor = penColor.value;
                        cell.removeAttribute('data-shade'); // any previous shading done to color will be removed upon painting the cell with new color
                    }   
                    else
                    {
                        // get three random values from 0 <-> 255
                        let r = getRandomColor();
                        let g = getRandomColor();
                        let b = getRandomColor();

                        // assigning these three values to the cellColor
                        cell.style.backgroundColor = "rgb("+r+", "+g+", "+b+")";
                    }
                }
                else
                {
                    // if there was no shading done before we start off with assigning it with data-shade attribute set to 0
                    if(!cell.hasAttribute('data-shade'))
                    {
                        cell.setAttribute('data-shade', '0');
                    }
                    let shade = parseInt(cell.getAttribute('data-shade'));  // we access the data-shade current value of the cell

                    // we increase the shade or decrease depending on what button was clicked
                    if(dodge === true)  shade++;       
                    else    shade--;

                    //assigning new shade value to the cell so to maintain the shade value
                    cell.setAttribute('data-shade', `${shade}`);
                    cell.style.backgroundColor = adjust(rgbToHex, cell.style.backgroundColor, shade * -2);  // new value of color is calculated with current shade value
                }
            }
        });    
    });
}

// if reset is clicked new grid is made, discarding the old grid and no other buttons is turned off as this button doesnt need to stay active
let resetBtn = document.querySelector("#resetBtn");
resetBtn.addEventListener('click', makeGrid);

// returns the random value ranging from 0 <-> 255
function getRandomColor()
{
    return (Math.floor(Math.random() * 256));
}

// converts the RGB value into hex code which helps in manipulation of the shading value
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

// new shading value is calculated based on the amount parameter
// first the color is converted into hexCodes so to manipulate the code.
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
  
  

  