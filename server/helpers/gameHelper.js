exports.checkForWinner = (totalSize, cellsData) => {
    let isWinner;
    let cellsWinning = [];
    const rowSize = totalSize ** 0.5; // root square

    //Check Horizontal
    for(let i = 0; i<totalSize; i+=rowSize){
        isWinner = true;
        for(let j = i + 1; j < i + rowSize; j++ ) {
            if(!cellsData[i].data || cellsData[i].data !== cellsData[j].data) {
                isWinner = false
                break;
            }
        }
        if(isWinner) {
            cellsWinning = [...Array(i + rowSize).keys()].map(x => {
                return x + i
            })
            return cellsWinning;
        }
    }

    //Check Vertical
    for(let i = 0; i< rowSize; i++){
        isWinner = true;
        for(let j = i + rowSize; j < totalSize; j+=rowSize ) {
            if(!cellsData[i].data || cellsData[i].data !== cellsData[j].data) {
                isWinner = false
                break;
            }
        }
        if(isWinner) {
            cellsWinning = [...Array(i + rowSize).keys()].map((x, index) => {
                return index * rowSize + i
            })
            return cellsWinning 
        }
    }

        //First diagonal
        let first = 0;
        isWinner = true;
        
        for(let next = rowSize + 1; next < totalSize; next += rowSize + 1 ) {
            if(!cellsData[first].data || cellsData[first].data !== cellsData[next].data) {
                isWinner = false;
                break;
            }
        }

        if(isWinner) {
            cellsWinning = [...Array(rowSize).keys()].map((x, index) => {
                return index * (rowSize + 1)
            })
            return cellsWinning;
        }

        //Second diagonal
        isWinner = true;
        first = rowSize - 1;
        for(let next = first * 2; next < totalSize - (rowSize - 1); next += first ) {
            if(!cellsData[first].data || cellsData[first].data !== cellsData[next].data) {
                isWinner = false;
                break;
            }
        }

        if(isWinner) {
            cellsWinning = [...Array(rowSize).keys()].map((x, index) => {
                return first * (index + 1)
            })
            return cellsWinning
        }

    return null
    
}
