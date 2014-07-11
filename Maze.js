var Maze = {
    mazeCoords: [],
    correctPath: [],
    visited: [],
    startX: null,
    startY: null,
    endX: null,
    endY: null,
    possibleStartEndPoints: [],
    initMazeObject: function(n) {
        for(var i = 0; i < n; i++) {
            Maze.mazeCoords[i] = {};
        }
    },
    initMazeVisited: function(n) {
        for(var i = 0; i < n; i++) {
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
                    html += '<td class="cell ' + Maze.calculateClass(mazeArr[i][j]) + '" data-x="' + i + '" data-y="' + j + '"></td>';
                    Maze.mazeCoords[i][j] = Maze.pad(Number(mazeArr[i][j]).toString(2)).split('');
                }
                html += '</tr>';
            }
            html += '</table>';
            jQuery("#mazeArea").html(html);
            jQuery.unblockUI();
            Maze.findPossibleStartEndPoints();
        });

    },
    findPossibleStartEndPoints: function() {
        var mazeLength = Maze.mazeCoords.length;
        for (var i = 0; i < mazeLength; i++) {
            for (var j = 0; j < mazeLength; j++) {
                var binaryArr = Maze.mazeCoords[i][j];
                if (i == 0) {
                    if (j == 0) {
                        if (binaryArr[0] == 1 || binaryArr[3] == 1) {
                            Maze.possibleStartEndPoints.push([i, j]);
                            Maze.addPointerToCell(i, j);
                        }
                    } else if (j == mazeLength - 1) {
                        if (binaryArr[1] == 1 || binaryArr[3] == 1) {
                            Maze.possibleStartEndPoints.push([i, j]);
                            Maze.addPointerToCell(i, j);
                        }
                    } else {
                        if (binaryArr[3] == 1) {
                            Maze.possibleStartEndPoints.push([i, j]);
                            Maze.addPointerToCell(i, j);
                        }
                    }
                } else if (i == mazeLength - 1) {
                    if (j == 0) {
                        if (binaryArr[0] == 1 || binaryArr[2] == 1) {
                            Maze.possibleStartEndPoints.push([i, j]);
                            Maze.addPointerToCell(i, j);
                        }
                    } else if (j == mazeLength - 1) {
                        if (binaryArr[1] == 1 || binaryArr[2] == 1) {
                            Maze.possibleStartEndPoints.push([i, j]);
                            Maze.addPointerToCell(i, j);
                        }
                    } else {
                        if (binaryArr[2] == 1) {
                            Maze.possibleStartEndPoints.push([i, j]);
                            Maze.addPointerToCell(i, j);
                        }
                    }
                } else {
                    if (j == 0) {
                        if (binaryArr[0] == 1) {
                            Maze.possibleStartEndPoints.push([i, j]);
                            Maze.addPointerToCell(i, j);
                        }
                    } else if (j == mazeLength - 1) {
                        if (binaryArr[1] == 1) {
                            Maze.possibleStartEndPoints.push([i, j]);
                            Maze.addPointerToCell(i, j);
                        }
                    }
                }
            }
        }
    },
    addPointerToCell: function(x, y) {
        var currentSize = jQuery('.badge').length;
        jQuery('[data-x="' + x + '"][data-y="' + y + '"]')
            .on("mouseenter", function() {
                jQuery(this).css({'background-color': '#5bc0de'});
            }).on("mouseleave", function() {
                jQuery(this).css({'background-color': '#EEEEEE'});
            }).css({'cursor': 'pointer'});
        jQuery('<span>').appendTo('[data-x="' + x + '"][data-y="' + y + '"]')
            .html(currentSize + 1).attr("class", "badge").css({
            'background-color': '#428bca',
            'margin': 'auto'
        });
    },
    startSolve: function() {
        for (var i in Maze.possibleStartEndPoints) {
            for (var j in Maze.possibleStartEndPoints) {
                if (i != j) {
                    Maze.initMazeVisited(Maze.mazeCoords.length);
                    Maze.startX = Maze.possibleStartEndPoints[i][0];
                    Maze.startY = Maze.possibleStartEndPoints[i][1];
                    Maze.endX = Maze.possibleStartEndPoints[j][0];
                    Maze.endY = Maze.possibleStartEndPoints[j][1];
                    var result = Maze.solveMaze(Maze.startX, Maze.startY);
                    if (result) {
                        var pStart = '<label class="label label-success">' + jQuery('[data-x="' + Maze.startX + '"][data-y="' + Maze.startY + '"]').text() + '</label>';
                        var pEnd = '<label class="label label-success">' + jQuery('[data-x="' + Maze.endX + '"][data-y="' + Maze.endY + '"]').text() + '</label>';
                        var key = "" + Maze.startX + "" + Maze.startY + "" + Maze.endX + "" + Maze.endY;
                        jQuery("#results tbody").append('<tr><td>' + pStart + '</td><td>' + pEnd + '</td><td><button type="button" class="btn btn-primary show-result" data-index="' + key + '"><span class="glyphicon glyphicon-pencil"></span> Show</button></td></tr>');
                    }
                }
            }
        }
        jQuery(".show-result").on("click", function() {
            Maze.drawResult(jQuery(this).data("index"));
        });
    },
    solveMaze: function(x, y) {
        var mazeLength = Maze.mazeCoords.length;
        if (x > mazeLength - 1 || x < 0 || y > mazeLength - 1 || y < 0) return false;
        if (x == Maze.endX && y == Maze.endY) return true;
        if (Maze.visited[x][y]) return false;
        Maze.visited[x][y] = true;
        if (Maze.mazeCoords[x][y][3] == 1) {
            // Check top
            if (Maze.solveMaze(x - 1, y)) {
                Maze.addToCorrectPath(Maze.startX, Maze.startY, Maze.endX, Maze.endY, x - 1, y);
                return true;
            }
        }
        if (Maze.mazeCoords[x][y][1] == 1) {
            // Check right
            if (Maze.solveMaze(x, y + 1)) {
                Maze.addToCorrectPath(Maze.startX, Maze.startY, Maze.endX, Maze.endY, x, y + 1);
                return true;
            }
        }
        if (Maze.mazeCoords[x][y][2] == 1) {
            // Check bottom
            if (Maze.solveMaze(x + 1, y)) {
                Maze.addToCorrectPath(Maze.startX, Maze.startY, Maze.endX, Maze.endY, x + 1, y + 1);
                return true;
            }
        }
        if (Maze.mazeCoords[x][y][0] == 1) {
            // Check left
            if (Maze.solveMaze(x, y - 1)) {
                Maze.addToCorrectPath(Maze.startX, Maze.startY, Maze.endX, Maze.endY, x, y - 1);
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
    addToCorrectPath: function(startX, startY, endX, endY, x, y) {
        var key = "" + startX + "" + startY + "" + endX + "" + endY;
        if (typeof Maze.correctPath[key] != 'undefined') {
            Maze.correctPath[key].push([x, y]);
        } else {
            Maze.correctPath[key] = [[x, y]];
        }
    },
    drawResult: function(key) {
        var paper = Raphael(0, 0, 1200, 1200);
        var startX = null;
        var startY = null;
        var endX = null;
        var endY = null;
        for (var i = 0; i < Maze.correctPath[key].length; i++) {
            var center = Maze.getCenterCoordinates(Maze.correctPath[key][i][0], Maze.correctPath[key][i][1]);
            if (i == 0) {
                startX = center[0];
                startY = center[1];
                continue;
            } else if (i == 1) {
                endX = center[0];
                endY = center[1];
            } else {
                startX = endX;
                startY = endY;
                endX = center[0];
                endY = center[1];
            }
            var line = paper.path( "M" + startX + " " + startY );
            line.animate({path: [["M", startX, startY], ["L", endX, endY]], "stroke-width": 2}, 3000);
        }
    },
    getCenterCoordinates: function(x, y) {
        var cell = jQuery('[data-x="' + x + '"][data-y="' + y + '"]');
        var offset = cell.offset();
        var width = cell.width();
        var height = cell.height();

        var centerX = offset.left + width / 2;
        var centerY = offset.top + height / 2;
        return [centerX, centerY];
    },
    init: function() {
        Maze.initMazeObject(15);
        Maze.initMazeVisited(15);
        Maze.initMazeArea(15);
        jQuery("#generate").on("click", function() {
            Maze.initMazeArea(15);
        });
        jQuery("#solve").on("click", function() {
            Maze.startSolve();
        });

    }

}