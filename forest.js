

class Vector2{
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;    
    }
}

class MapObject{
    mark;
    position;
    isFood;
    
    constructor(x, y, mark){
        this.isFood = false;

        this.position.x = x;
        this.position.y = y

        this.mark = mark;
    }
}

const Sex = {
    MALE,
    FEMALE
}

class Animal extends MapObject{
    speed;
    visionRadius;
    mateTime;
    foodToMate;

    target;
    mate;
    foodEaten;
    matingProgress;
    sex;

    currentState;

    predatorsNearby;
    preyNearby;
    plantsNearby;
    

    constructor(x, y, sex, mark){
        super(x, y,mark);
        this.sex = sex;

        this.currentState = new WalkingState();
        this.currentState.context = this;

        this.predatorsNearby = [];
        this.preyNearby = [];
        this.plantsNearby = [];
    }

    update(map){
        this.visibleObjects = map.getObjectsInMooreArea(this.visionRadius, this.position);
        analyseVision(this.visibleObjects);
    }

    switchState(newState){
        this.currentState = newState;
        this.currentState.context = this;
    }

    analyseVision(visibleObjects){

        this.predatorsNearby = [];
        this.preyNearby = [];
        this.plantsNearby = [];

        visibleObjects.foreach(obj => {
            if (obj instanceof Predator) this.predatorsNearby.push(obj);
            if (obj instanceof Prey) this.preyNearby.push(obj);
            if (obj instanceof Plant) this.plantsNearby.push(obj);
        })
    }
}

class Prey extends Animal{
    threat;

    constructor(x, y, sex, mark){ 
        super(x, y, sex, mark);
        this.isFood = true;
    }

    update(map){
        super.update(map);
        findNearestPredator();
        findNearestPlant();
    }

    findNearestPredator(){
        this.threat = null;
        let minDistance = Number.MAX_SAFE_INTEGER;

        this.predatorsNearby.foreach(predator =>{
            let distance = calculateDistance(this.position, predator.position);
            if (distance < minDistance){
                minDistance = distance;
                this.threat = predator;
            }
        });

        return minDistance;
    }

    findNearestPlant() {
        this.target = null;
        let minDistance = Number.MAX_SAFE_INTEGER;

        this.plantsNearby.foreach(plant =>{
            let distance = calculateDistance(this.position, plant.position);
            if (distance < minDistance){
                minDistance = distance;
                this.target = plant;
            }
        });

        return minDistance;
    }
}

class Rabbit extends Prey{
    constructor(x, y, sex, mark){ 
        super(x, y, sex, mark);

        this.speed = 2;
        this.visionRadius = 5;
        this.mateTime = 1;
        this.foodToMate = 1;
    }

    update(map){
        super.update(map);
        findNearestMate();
        this.currentState.handle();
    }

    findNearestMate(){
        this.mate = null;
        let minDistance = Number.MAX_SAFE_INTEGER;

        this.preyNearby.foreach(prey =>{
            if (!(prey instanceof Rabbit) || prey.sex == this.sex) return;

            let distance = calculateDistance(this.position, prey.position);
            if (distance < minDistance){
                minDistance = distance;
                this.mate = prey;
            }
        });

        return minDistance;
    }
}

class Predator extends Animal{
    huntStrategy;

    constructor(x, y, sex, mark){ 
        super(x, y, sex, mark);
    }

    update(map){
        super.update(map);
        findNearestPrey();
        //if (target != null)
        //{
        //    huntStrategy.hunt(target);
        //}
    }
   
    findNearestPrey(){
        this.target = null;
        let minDistance = Number.MAX_SAFE_INTEGER;

        this.preyNearby.foreach(prey =>{
            let distance = calculateDistance(this.position, prey.position);
            if (distance < minDistance){
                minDistance = distance;
                this.target = prey;
            }
        });

        return minDistance;
    }
}

class Tiger extends Predator{
    constructor(x, y, sex, mark){ 
        super(x, y, sex, mark);
        this.huntStrategy = new PassiveHunt();

        this.speed = 3;
        this.visionRadius = 2;
        this.mateTime  = 3;
        this.foodToMate = 4;
    }

    update(map){
        super.update(map);
        findNearestMate();
        this.currentState.handle();
    }

    findNearestMate(){
        this.mate = null;
        let minDistance = Number.MAX_SAFE_INTEGER;

        this.predatorsNearby.foreach(predator =>{
            if (!(predator instanceof Tiger) || predator.sex == this.sex) return;

            let distance = calculateDistance(this.position, predator.position);
            if (distance < minDistance){
                minDistance = distance;
                this.mate = predator;
            }
        });

        return minDistance;
    }
}

class Wolf extends Predator{

    constructor(x, y, sex, mark){ 
        super(x, y, sex, mark);
        this.huntStrategy = new ActiveHunt();

        this.speed = 2;
        this.visionRadius = 3;
        this.mateTime  = 2;
        this.foodToMate = 3;
    }

    update(map){
        super.update(map);
        findNearestMate();
        this.currentState.handle();
    }

    findNearestMate(){
        this.mate = null;
        let minDistance = Number.MAX_SAFE_INTEGER;

        this.predatorsNearby.foreach(predator =>{
            if (!(predator instanceof Wolf) || predator.sex == this.sex) return;

            let distance = calculateDistance(this.position, predator.position);
            if (distance < minDistance){
                minDistance = distance;
                this.mate = predator;
            }
        });

        return minDistance;
    }
}

class Plant extends MapObject{
    constructor(x, y, sex, mark){ 
        super(x, y, sex, mark);
        this.isFood = true;
    }
}

class HuntStrategy {
    hunt(prey) {
        throw new Error('You have to implement the method!');
    }
}

class ActiveHunt extends HuntStrategy {
    hunt(prey) {
        throw new Error('You have to implement the method!');
    }
}

class PassiveHunt extends HuntStrategy{
    hunt(prey) {
        throw new Error('You have to implement the method!');
    }
}

class State {
    context;

    handle() {
        throw new Error('You have to implement the method!');
    }
}

class WalkingState extends State{
    handle()
    {
        if (this.context.foodEaten == this.context.foodToMate && this.context.mate != null){
            this.context.switchState(new ChaseingState());
        }
        else if (this.context.foodEaten != this.context.foodToMate && this.context.target != null){
            this.context.switchState(new ChaseingState());
        }
        else{
            //random move
        }
    }
}

class ChaseingState extends State{
    handle(){
        if (this.context == null) return;

        if (this.context.mate == null && this.context.target == null){
            this.context.switchState(new WalkingState());
            return;
        }
        if (calculateDistance(this.context.position, this.context.mate.position) == 1){
            this.context.switchState(new MatingState());
            return;
        }
        if (calculateDistance(this.context.position, this.context.target.position) == 1){
            this.context.switchState(new EatingState());
            return;
        }
    }
}

class EatingState extends State{
    handle() {
        throw new Error('You have to implement the method!');
    }
}

class MatingState extends State{
    handle() {
        throw new Error('You have to implement the method!');
    }
}

class FleeingState extends State{
    handle() {
        throw new Error('You have to implement the method!');
    }
}

class Map{

    map;
    animals = []; 

    predatorCount;
    preyCount;
    plantCount;

    constructor(width, height){
        this.map = [...Array(height)].map(e => Array(width));
    }

    animate(){
        spawnPlants();
        spawnPreys();
        spawnPredators();
    }

    update(){
        this.animals.forEach(animal => {
            animal.update(this);
        });
    }

    print(){
        for (let i = 0; i < map.length; i++) {
            let row = "";
            let horizontalBound = i == 0 || i == map.length - 1;
            for (let j = 0; j < map[i].length; j++) {
                let verticalBound = j == 0 || j == map[i].length - 1;

                if (verticalBound && horizontalBound){
                    row += '+';
                }
                else if (verticalBound){
                    row += '|';
                }
                else if (horizontalBound){
                    row += '-';
                }
                else{
                    if (this.map[i][j] != null){
                        row += this.map[i][j].mark;
                    }
                    else{
                        row += ' ';
                    }   
                }
            }
            console.log(row);
        }
        console.log();
    } 

    getObjectsInMooreArea(radius, origin){
        let objects = [];
        for (let i = origin.y - radius; i <= origin.y + radius; i++){
            for (let j = origin.x - radius; j <= origin.x + radius; j++){
                if (i == origin.y && j == origin.x) continue;
                if (this.map[i][j] != null){
                    objects.push(this.map[i][j]);
                }
            }
        }
        return objects;
    }

    spawnPredators(){
        for (let i = 0; i < this.predatorCount; i++){
            let sex;
            if (Math.random() < 0.5) sex = Sex.MALE;
            else sex = Sex.FEMALE;

            let posX = 0;
            let posY = 0;

            while (map[posY][posX] != null){
                posX = Math.random() * (this.map[0].length - 1) + 1;
                posY = Math.random() * (this.map.length - 1) + 1;
            }

            let predator;
            if (Math.random() * 2 == 0){
                let mark = sex == Sex.MALE ? 'W' : 'w';
                predator = new Wolf(posX, posY, sex, mark);
            }
            else{
                let mark = sex == Sex.MALE ? 'T' : 't';
                predator = new Tiger(posX, posY, sex, mark);
            }

            this.map[posY][posX] = predator;
            this.animals.push(predator);
        }
    }

    spawnPreys(){
        for (let i = 0; i < this.preyCount; i++){
            let sex;
            if (Math.random() < 0.5) sex = Sex.MALE;
            else sex = Sex.FEMALE;

            let posX = 0;
            let posY = 0;

            while (map[posY][posX] != null){
                posX = Math.random() * (this.map[0].length - 1) + 1;
                posY = Math.random() * (this.map.length - 1) + 1;
            }

            let mark = sex == Sex.MALE ? 'R' : 'r';
            let prey = new Rabbit(posX, posY, sex, mark);

            this.map[posY][posX] = prey;
            this.animals.push(prey);
        }
    }

    spawnPlants(){
        for (let i = 0; i < this.plantCount; i++){
            let posX = 0;
            let posY = 0;

            while (map[posY][posX] != null){
                posX = Math.random() * (this.map[0].length - 1) + 1;
                posY = Math.random() * (this.map.length - 1) + 1;
            }

            let plant = new Plant(posX, posY, '*');
            this.map[posY][posX] = plant;

        }
    }
}


let steps = 130;

map = new Map(80, 40);

map.plantCount = 30;
map.preyCount = 15;
map.predatorCount = 8;

map.animate();

while (steps > 0){
    map.print();
    //map.update();
    steps--;
}

function calculateDistance(from, to) {
    let x = 0;
    let y = 0;

    let deltaX = Math.abs(to.x - from.x);
    let deltaY = Math.abs(to.y - from.y);
    let signX = from.x < to.x ? 1 : -1;
    let signY = from.y < to.y ? 1 : -1;
    let error = deltaX - deltaY;

    while (Math.abs(from.x + x) - Math.abs(to.x) != 1 || Math.abs(from.y + y) - Math.abs(to.y) != 1){
        let error2 = error * 2;
        if (error2 > -deltaY){
            error -= deltaY;
            x += signX;
        }
        if (error2 < deltaX){
            error += deltaX;
            y += signY;
        }
    }

    return x + y;
}
