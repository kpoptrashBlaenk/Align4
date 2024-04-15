window.addEventListener("load", () => {

    const table = document.getElementById('table')
    const btnStart = document.getElementById('start')
    const inputRows = document.getElementById('rows')
    const inputColumns = document.getElementById('columns')
    const labelRows = document.getElementById('labelRows')
    const labelColumns = document.getElementById('labelColumns')

    btnStart.addEventListener('click', () => {
        const height = inputRows.value
        const length = inputColumns.value
        if (height >= 4 && height <= 10 && length >= 4 && length <= 10) {
            createTable(height, length);
            const holes = document.querySelectorAll('td')

            for (let i = 0; i < holes.length; i++) {
                holesAll.push({
                    hole: holes[i], value: 2, fill: 0, line: Math.ceil((i + 1) / length - 1), column: i % length
                })
            }

            for (let i = 0; i < holes.length; i++) {
                holes[i].addEventListener('click', () => {
                    let botHole = gravity(i, holes);
                    let position = botHole['column'] + botHole['line'] * length
                    addHole(position, holes[position]);
                    checkSolution(position, holes);
                    solDiagonalRight(position, holes, height, length);
                    solDiagonalLeft(position, holes, height, length)
                    turn++;
                })
            }
        } else {
            alert("Not valid!")
        }
    })

    const playerColor = ['red', 'blue']

    let turn = 0

    let holesAll = [];

    //add piece
    function addHole(n, hole) {
        hole.style.backgroundColor = playerColor[turn % 2];
        holesAll[n]['value'] = turn % 2;
        holesAll[n]['fill'] = 1;
    }

    function createTable(length, height) {
        for (let i = 0; i < length; i++) {
            let row = document.createElement('tr');

            for (let j = 0; j < height; j++) {
                let cell = document.createElement('td');
                cell.classList.add('container');
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        table.style.display = 'block'
        btnStart.style.display = 'none'
        inputRows.style.display = 'none'
        inputColumns.style.display = 'none'
        labelRows.style.display = 'none'
        labelColumns.style.display = 'none'
    }

    //solve diagonal1
    function solDiagonalRight(n, holes, height, length) {

        length = Number(length)
        let lineLength = holesAll[n]['line']
        let diff = holesAll[n]['line'] - holesAll[n]['column']
        if (diff < 0) {
            diff = 0
        }
        for (let i = 0; i < holes.length; i++) {
            if (holesAll[i]['column'] === holesAll[n]['column'] - lineLength + diff && holesAll[i]['line'] === diff) {
                let holesDiagonal = [];
                for (let j = i; j < holes.length; j) {
                    holesDiagonal.push(holesAll[j])
                    j = j + length + 1
                }
                checkWin(holesDiagonal)
            }
        }
    }

    //solve diagonal2
    function solDiagonalLeft(n, holes, height, length) {

        length = Number(length)
        let currentLine
        let currentColumn

        if (holesAll[n]['column'] + holesAll[n]['line'] > (length - 1)) {
            currentLine = holesAll[n]['line'] - (length - 1) + holesAll[n]['column']
            currentColumn = (length - 1)
        } else {
            currentLine = 0
            currentColumn = holesAll[n]['line'] + holesAll[n]['column']
        }
        let tempDiff = 0
        for (let i = 0; i < holesAll.length; i++) {
            if (holesAll[i]['column'] === currentColumn && holesAll[i]['line'] === currentLine) {
                tempDiff = i
            }
        }

        let holesDiagonal = []
        for (let i = 0; i < holes.length; i++) {
            if (holesAll[tempDiff]['column'] === holesAll[i]['column'] && holesAll[tempDiff]['line'] === holesAll[i]['line']) {
                holesDiagonal.push(holesAll[i])
                if (holesAll[tempDiff]['column'] !== 0) {
                    tempDiff = tempDiff + (length - 1)
                }
                if (tempDiff >= holes.length) {
                    break;
                }
            }
        }
        checkWin(holesDiagonal)
    }

    //solve horizontal and vertical
    function solHorizVertical(items) {
        for (let i = 0; i < items.length - 3; i++) {
            if (items[i]['fill'] !== 0 && items[i + 1]['fill'] !== 0 && items[i + 2]['fill'] !== 0 && items[i + 3]['fill'] !== 0) {
                if (items[i]['value'] === items[i + 1]['value'] && items[i]['value'] === items[i + 2]['value'] && items[i]['value'] === items[i + 3]['value']) {
                    alert('Winner Winner Chicken Dinner')
                    window.location.reload();
                    break;
                }
            }
        }
    }

    //solve horizontal and vertical preparation (one time horiz, one time vertical)
    function checkSolution(n, holes) {
        let holesLine = [];
        let holesColumn = [];
        let line = holesAll[n]['line'];
        let column = holesAll[n]['column'];
        for (let i = 0; i < holes.length; i++) {
            if (holesAll[i]['line'] === line) {
                holesLine.push(holesAll[i])
            }
            if (holesAll[i]['column'] === column) {
                holesColumn.push(holesAll[i])
            }
        }
        solHorizVertical(holesLine)
        solHorizVertical(holesColumn)
    }

    //gravity later added because forgot
    function gravity(n, holes) {
        let holesColumn = [];
        let column = holesAll[n]['column'];
        for (let i = 0; i < holes.length; i++) {
            if (holesAll[i]['column'] === column && holesAll[i]['fill'] === 0) {
                holesColumn.push(holesAll[i])
            }
        }
        return holesColumn[holesColumn.length - 1]
    }

    function checkWin(holesDiagonal) {

        if (holesDiagonal.length >= 4) {
            for (let j = 0; j < holesDiagonal.length - 3; j++) {
                if (holesDiagonal[j]['value'] === holesDiagonal[j + 1]['value'] && holesDiagonal[j]['value'] === holesDiagonal[j + 2]['value'] && holesDiagonal[j]['value'] === holesDiagonal[j + 3]['value'] && holesDiagonal[j]['fill'] !== 0) {
                    alert('Winner Winner Chicken Dinner')
                    window.location.reload();
                }
            }
        }
    }

});