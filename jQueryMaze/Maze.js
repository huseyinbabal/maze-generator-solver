var Maze = {
    mazeCoords: [],
    correctPath: [],
    visited: [],
    startX: null,
    startY: null,
    endX: null,
    endY: null,
    initMazeObject: function(n) {
        for(var i = 0; i < n; i++) {
            Maze.mazeCoords[i] = {};
            Maze.visited[i] = {};
        }
    },
    initMazeArea: function(n) {
        jQuery.blockUI();
        jQuery.get("http://maze-generator-api.herokuapp.com/", function(response) {
            var mazeArr = response;
            var html = '<table>';
            for (var i = 0; i < n; i++) {
                html += '<tr>';
                for (var j = 0; j < n; j++) {
                    html += '<td class="cell ' + Maze.calculateClass(mazeArr[i][j]) + '" data-x="' + i + '" data-y="' + j + '" title="' + Number(mazeArr[i][j]).toString(2) + '"></td>';
                    Maze.mazeCoords[i][j] = Maze.pad(Number(mazeArr[i][j]).toString(2)).split('');
                }
                html += '</tr>';
            }
            html += '</table>';
            jQuery("#mazeArea").html(html);
            jQuery.unblockUI();
        });

    },
    findPossibleStartEndPoints: function() {

    },
    solveMaze: function(x, y) {
        if (x == this.endX && y == this.endY) return true;
        if (this.visited[x][y]) return false;
        this.visited[x][y] = true;

        if (this.mazeCoords[x][y][3] ) {
            // Check top
            if (this.solveMaze(x, y + 1)) {
                console.log([x, y+1]);
                return true;
            }
        }
        if (this.mazeCoords[x][y][1]) {
            // Check right
            if (this.solveMaze(x + 1, y)) {
                console.log([x+1, y]);
                return true;
            }
        }
        if (this.mazeCoords[x][y][2]) {
            // Check bottom
            if (this.solveMaze(x, y - 1)) {
                console.log([x, y-1]);
                return true;
            }
        }
        if (this.mazeCoords[x][y][0]) {
            // Check left
            if (this.solveMaze(x - 1, y)) {
                console.log([x-1, y]);
                return true;
            }
        }
        return false;
    },
    calculateClass: function(mazeVal) {
        var finalClass = "";
        var binaryValue = Maze.pad(Number(mazeVal).toString(2));
        if (binaryValue.charAt(0) == 0) finalClass += " left";
        if (binaryValue.charAt(1) == 0) finalClass += " right";
        if (binaryValue.charAt(2) == 0) finalClass += " bottom";
        if (binaryValue.charAt(3) == 0) finalClass += " top";
        return finalClass;
    },
    pad: function(num) {
        var s = num+"";
        while (s.length < 4) s = "0" + s;
        return s;
    },
    init: function() {
        Maze.initMazeObject(15);
        Maze.initMazeArea(15);
        jQuery("#generate").on("click", function() {
            Maze.initMazeArea(15);
        });
        //Maze.solveMaze(this.startX, this.startY);
        //console.log(this.correctPath);
    }

}