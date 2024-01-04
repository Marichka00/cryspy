let conditions = ["normal", "eating", "being eaten", "haunting", "being haunted",
    "reproducing", "newborn", "died"];

var map = new Array(70), predators = [], preys = [], apples = [];
var predatorPosition = [], preyPosition = [], applePosition = [];
var howMuchPredators = 3, howMuchPreys = 6, howMuchApples = 20;

/*--------------------------------Manager-------------------------------- */
class Manager {
    constructor() {
        this.ItemsInMap = map;
        this.numbOfPredators = predators;
        this.numbOfPreys = preys;
        this.numbOfApples = apples;
    }

    static itemsPosition(id) {
        for (let i = 0; i < 70; i++)
            map[i] = new Array(70);

        for (var m = 0; m < 70; m++)
            for (var n = 0; n < 70; n++)
                map[m][n] = undefined;

        for (let k = 0; k < predators.length; k++)
            map[Manager.randomNumb(0, 70)][Manager.randomNumb(0, 70)] = predators[k];

        for (let k = 0; k < preys.length; k++)
            map[Manager.randomNumb(0, 70)][Manager.randomNumb(0, 70)] = preys[k];

        for (let k = 0; k < apples.length; k++)
            map[Manager.randomNumb(0, 70)][Manager.randomNumb(0, 70)] = apples[k];
    }

    static randomNumb(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    get numbOfAnimal() {
        return this.predators.length + this.preys.length;
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class Animal {
    constructor(id, sex, speed, vision, pregnancyTime) {
        this.id = id;
        this.sex = sex;
        this.speed = speed;
        this.vision = vision;
        this.condition = "normal";
        if (sex == "woman") {
            this.pregnancyTime = pregnancyTime;
        }
    }
    /*каждый имеет разную скорость*/
    static changeSpeed(amount) {
        this.speed = Math.round(this.speed * amount);
    }
}

/*--------------------------------Predator-------------------------------- */
class Predator extends Animal {

    static born(id) {
        let sex = ""; let child;
        for (let i = 0; i < howMuchPredators; ++i) {
            let k = Manager.randomNumb(1, 100);
            (k > 0 && k < 50) ? sex = "woman" : (k > 50 && k < 100) ? sex = "man" : sex = undefined;
            child = new Fox(id, sex)
            predators.push(child);
        }
    }

    get allPredators() {
        return predators;
    }

    get numberOfPredators() {
        return predators.length;
    }
}
/*--------------------------------Fox-------------------------------- */
class Fox extends Predator {
    constructor(id, sex) {
        super(id, sex);
        this.speed = 1;
        this.vision = 6;
        this.hauntsFor = "rabbit";
    }

    static foxPosition() {
        for (let m = 0; m < map.length; m++)
            for (let n = 0; n < map.length + 1; n++) {
                for (let i = 0; i < predators.length; i++) {
                    if (predators[i] == map[m][n]) {
                        predatorPosition[i] = [m, n]; //fox position
                    }
                }
            }
    }

   

    foxDie(m, n) {
        delete predators[m][n];
    }

    static vision(predatorPosition) {
        let vision = 3;
        for (let i = 0; i < Manager.foxes.length; i++) {//итерируемся по длине массива всех лис
            if (Manager.foxes[predatorPosition] == i) {//находим нужную лисичку
                for (let k = predatorPosition; k < predatorPosition + vision; k++) {//смотрим на три шага вперед от позиции лисички
                    if (k == Manager.rabbits[k]) delete Manager.rabbits[k];//если видим кролика - едим
                    else if (k != Manager.rabbits[k]) {//если не видим
                        for (let g = predatorPosition; g < predatorPosition - vision; g++) {//вращаем голову и ищем там поесть
                            if (g == Manager.rabbits[g]) delete Manager.rabbits[g];//если есть – едим
                        }
                    }
                    else Manager.foxes[predatorPosition]++;//идем вперед, если ничего нигде не увидели
                }
            }
        }
    }
}

/*--------------------------------Prey-------------------------------- */
class Prey extends Animal {

    static born(id) {
        let sex = ""; let child;
        for (let i = 0; i < howMuchPreys; ++i) {
            let k = Manager.randomNumb(1, 100);
            (k > 0 && k < 50) ? sex = "woman" : (k > 50 && k < 100) ? sex = "man" : sex = undefined;
            child = new Rabbit(id, sex)
            preys.push(child);
        }
    }

    get allPreys() {
        return preys;
    }

    get numberOfPreys() {
        return preys.length;
    }
}
/*--------------------------------Rabbit-------------------------------- */
class Rabbit extends Prey {
    constructor(id, sex) {
        super(id, sex);
        this.speed = 5;
        this.vision = 6;
        this.hauntsFor = "apple";
    }

    static rabbitPosition() {
        for (let m = 0; m < map.length; m++)
            for (let n = 0; n < map.length + 1; n++) {
                for (let i = 0; i < preys.length; i++) {
                    if (preys[i] == map[m][n]) {
                        preyPosition[i] = [m, n];
                    }
                }
            }
    }

    rabbitDie(m, n) {
        delete preys[m][n];
    }

    vision() {

    }
}
/*--------------------------------Apple-------------------------------- */
class Apple {
    constructor(id) {
        this.id = id;
    }

    static randomAmountOfApples(id) {
        let child;
        for (let i = 0; i < howMuchApples; ++i) {
            child = new Apple(id);
            apples.push(child);
        }
    }

    static applePosition() {
        for (let m = 0; m < map.length; m++)
            for (let n = 0; n < map.length + 1; n++) {
                for (let i = 0; i < apples.length; i++) {
                    if (apples[i] == map[m][n]) {
                        applePosition[i] = [m, n];
                    }
                }
            }
    }

    appleWasEatten(m, n) {
        delete apples[m][n];
    }

    get allPreys() {
        return preys;
    }

    get numberOfPreys() {
        return preys.length;
    }
}

var manager = new Manager();
console.log(manager);

Predator.born(1);
Prey.born(2);
Apple.randomAmountOfApples(3);
Manager.itemsPosition();
Fox.foxPosition();
Rabbit.rabbitPosition();
Apple.applePosition();

setInterval(() => {
    console.log(map);
}, 1000)