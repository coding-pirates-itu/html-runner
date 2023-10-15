const nof_lanes = 3;
const init_steps = 5;
const game_steps = 50;
const start_speed = 0.1;
const coinProb = 0.15;
const blockProb = 0.07;
const block_price = 5;
const speed_incr = 1.01;
const app = angular.module("game", []);

app.controller("game", function ($scope, $interval) {
    $scope.isRunning = false;

    function createLane() {
        const lane = [];

        for (let i = 0; i < init_steps; i++) {
            lane.push('');
        }
        for (let i = 0; i < game_steps; i++) {
            const rnd = Math.random();
            if (rnd < coinProb) {
                lane.push('coin');
            } else if (rnd - coinProb < blockProb) {
                lane.push('block');
            } else {
                lane.push('');
            }
        }

        return lane;
    }

    $scope.keyPressed = function (e) {
        // code [string], key [char], keyCode [int]
        if (e.code == 'KeyZ' && $scope.xpos > 0) {
            $scope.xpos--;
        }
        else if (e.code == 'KeyX' && $scope.xpos < nof_lanes - 1) {
            $scope.xpos++;
        }
    }

    $scope.init = function () {
        $scope.lanes = new Array(nof_lanes).fill().map(createLane);
        $scope.coins = 0;
        $scope.xpos = 1;
        $scope.xorigin = 0;
        $scope.xtranslate = 0;
        $scope.ypos = 0;
        $scope.speed = start_speed;
        $scope.ytranslate = 0;
        $scope.characterPos1 = true;
        $scope.isRunning = true;
        $scope.win = false;
        $scope.lost = false;
    }

    $interval(function () {
        if ($scope.isRunning) {
            if ($scope.ypos >= game_steps + init_steps) {
                $scope.isRunning = false;
                $scope.win = true;
            } else {
                // Move the road
                $scope.ypos += $scope.speed;
                const cell = angular.element(document.getElementsByClassName("cell")[0])[0];
                $scope.ytranslate = $scope.ypos * cell.offsetHeight;
                $scope.speed *= speed_incr;
                // Set character position
                $scope.xorigin = cell.offsetParent.offsetLeft + cell.offsetWidth / 2 - 64;
                $scope.xtranslate = $scope.xpos * cell.offsetWidth;
                // Animate character
                $scope.characterPos1 = !$scope.characterPos1;
                // React on character movement
                const ypos = Math.floor($scope.ypos + 0.1)
                const item = $scope.lanes[$scope.xpos][ypos];
                if (item != '') {
                    $scope.lanes[$scope.xpos][ypos] = '';
                    switch (item) {
                        case 'coin':
                            $scope.coins++;
                            break;

                        case 'block':
                            $scope.coins = Math.max(0, $scope.coins - block_price);
                            if ($scope.coins == 0) {
                                $scope.isRunning = false;
                                $scope.lost = true;
                            }
                            break;
                    }
                }
            }
        }
    }, 100);

    $scope.init();
    document.addEventListener("keypress", $scope.keyPressed);
});
