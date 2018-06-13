function StoreModel() {
    this.weightAdded = new Event(this);
    this.modelUpdated = new Event(this);
    this.unitAdded = new Event(this);
    this.dailyNeedsAdded = new Event(this);
    this.metGoalAdded = new Event(this);
    this.monthlyGoalAdded = new Event(this);
    this.curOpenedAdded= new Event(this);
    this.lastOpenedAdded= new Event(this);
    this.db= new StoreData();
    this.store = this.getData() || {lastOpened: {'day': null,'month': null,'year': null} ,curDate: {'day': null,'month': null,'year': null},  unit: '',weight: 0,dailyNeeds: 0,metGoal: 0,monthlyGoal: {},time:['07:00','10:00',,'13:00','16:00','19:00']}

}

StoreModel.prototype = {
    getTime : function(){
        return this.store.time;
    },
    setTime : function(t){
        this.store.time=t;
    },
    getData : function(){
        return this.db.getData();
    },
    saveData : function(){
        this.db.setData(this.store);
    },
    getWeight : function () {
        return (this.store.weight);
    },
    setWeight : function (t) {
        this.store.weight=t;
        this.weightAdded.notify({weight : this.store.weight });
    },
    getLastOpened : function () {
        return (this.store.lastOpened);
    },
    setLastOpened : function (t) {
        this.store.lastOpened=t;
        this.lastOpenedAdded.notify({lastOpened : this.store.lastOpened });
    },
    getCurDate : function () {
        return (this.store.curDate);
    },
    setCurDate : function (t) {
        this.store.curDate=t;
        this.curOpenedAdded.notify({curDate : this.store.curDate });
    },
    getUnit : function () {
         return (this.store.unit);
    },
    setUnit : function (t) {
         this.store.unit=t;
         this.unitAdded.notify({ unit : this.store.unit });
    },
    getDailyNeeds : function () {
         return (this.store.dailyNeeds);
    },
    setDailyNeeds : function (t) {
         this.store.dailyNeeds=t;
         this.dailyNeedsAdded.notify({ dailyNeeds : this.store.dailyNeeds });
    },
    getMetGoal : function () {
         return (this.store.metGoal);
    },
    setMetGoal : function (t) {
         this.store.metGoal=t;
         this.metGoalAdded.notify({ metGoal : this.store.metGoal });
    },
    getMonthlyGoal : function () {
         return (this.store.monthlyGoal);
    },
    setMonthlyGoal : function (t) {
         this.store.monthlyGoal=t;
         this.monthlyGoalAdded.notify({ monthlyGoal : this.store.monthlyGoal });
    }
};