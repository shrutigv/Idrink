function HydrateView(model) {
    this._model = model;
    this._elements = {
        add: $('.addWater'),
        addQuantity: $('#myModal .addWater'),
        delQuantity: $('#delete .addWater'),
        toggle: $('.navigate li'),
        weeklyStats: $('.weekly li'),
        weeklyStatsLine: $('.weekly .line span'),
        monthlyStats: $('.monthly li'),
        monthlyStatsLine: $('.month .line span'),
        percentageInput: $('.percentage'),
        closePopup: $('.close'),
        dateInput: $('.date')
    };
    this.ref = null;
    this.isDel=null;
    var _this = this;

    this.addGoal = new Event(this);

    $('.settings').click(function() {
        window.plugins.socialsharing.share('Hey Idrink app helped me maintain my hydration level! give it a try https://play.google.com/store/apps/details?id=com.idrink.app', 'Your goal', '')
    });

    this._elements.add.click(function(e) {
        _this.ref = $(e.target).parent().parent().attr('data-attr');
        if($('.modal:visible').attr('id') =='delete'){
            _this.isDel=true;
        }
        else{
             _this.isDel=false;
        }
        _this.addGoal.notify();
    });

    this._elements.toggle.click(function(e) {
        $(this).parent().find('li').removeClass('selected');
        if ($(e.target).parent().hasClass('stats')) {
            $('.stats.content').removeClass('active');
        } else {
            $('.main.content').removeClass('active');
        }
        $('.' + $(this).attr('class') + '.content').addClass('active');
        $(this).addClass('selected');
        e.stopImmediatePropagation();
    });
}

HydrateView.prototype = {
    init: function() {
        this.setDom(this);
    },
    setDom: function(x) {
        var template = new Template();
        $('.requirement').text(this._model.getDailyNeeds().toFixed(2) + this._model.getUnit());
        this._elements.addQuantity.each(function(i) {
            $(this).attr('data-attr', template.unit[x._model.getUnit()][i]).find('.quantity').text(template.unit[x._model.getUnit()][i]);
        });
        this._elements.delQuantity.each(function(i) {
            $(this).attr('data-attr', template.unit[x._model.getUnit()][i]).find('.quantity').text(template.unit[x._model.getUnit()][i]);
        });
    }
};

function HydrateController(model, view) {
    this._model = model;
    this._view = view;
    var _this = this;
    this.monthlyGoalRef = new monthlyData();

    this._view.addGoal.attach(function(e) {
        _this.addGoal(e);
    });

    this._model.modelUpdated.attach(function() {
        _this._view.init();
        _this.reset();
        _this._view._elements.closePopup.trigger('click');
    });

    this.initialize();
}

HydrateController.prototype = {
    reset: function(){
            this._model.setCurDate(this.monthlyGoalRef.getCurrentDate());
            this._model.setMonthlyGoal(this.monthlyGoalRef.updateGoal(this._model.getMonthlyGoal()));
            this._view._elements.dateInput.text(this.monthlyGoalRef.getMonth((this._model.getCurDate()).month) + ' ' + (this._model.getCurDate()).day);
            this._view.init();
    },
    initialize: function() {
        this.reset();
        this.refreshStats();
    },
    updateLastOpenedDate: function() {
        this._model.setLastOpened(this.monthlyGoalRef.getLastOpenedDate());
    },

    addGoal: function(del) {
        var percentage = 0;
        percentage = Math.round(parseInt(this._view.ref / this._model.getDailyNeeds() * 100));
        if(this._view.isDel){
            this._model.setMetGoal(this.monthlyGoalRef.delteFromDailyGoal(this._model.getMetGoal(), percentage));
        }
        else{
            this._model.setMetGoal(this.monthlyGoalRef.addToDailyGoal(this._model.getMetGoal(), percentage));
        }
        if (this._model.getMetGoal() <= 100) {
           this._view._elements.percentageInput.text(this._model.getMetGoal() + '%').parent().attr('class','').addClass('p' + this._model.getMetGoal() +' blue circle big');
        }
        else {
           this._view._elements.percentageInput.text(100 + '%').parent().attr('class','').addClass('p' + 100 +' blue circle big');
        }
        this._model.setMonthlyGoal(this.monthlyGoalRef.addToMonthlyGoal(this._model.getMetGoal()));
        this.refreshBarCharts();
        this._view._elements.closePopup.trigger('click');
       /* if(AdMob) AdMob.createBanner({
                              adId: admobid.banner,
                              position: AdMob.AD_POSITION.TOP_CENTER,
                              autoShow: true });*/

    },
    refreshBarCharts: function() {
        this.weeklyGoal();
        this.monthlyGoal();
    },
    monthlyGoal: function() {
        var temp = this.monthlyGoalRef.getMonthlyData(this._model.getCurDate(), this._model.getMonthlyGoal(), 5);
        for (var i = 0; i < 6; i++) {
            $(this._view._elements.monthlyStats[i]).attr('data-cp-size', temp.data[i]).text(temp.data[i]);
            $(this._view._elements.monthlyStatsLine[i]).text(temp.day[i]);
        }
    },
    weeklyGoal: function() {
        var temp = this.monthlyGoalRef.getWeeklyData(this._model.getCurDate(), this._model.getMonthlyGoal());
        for (var i = 0; i < 7; i++) {
            $(this._view._elements.weeklyStats[i]).attr('data-cp-size', temp.data[i]).text(temp.data[i]);
            $(this._view._elements.weeklyStatsLine[i]).text(temp.day[i]);
        }
    },
    refreshStats: function() {
        if( ((this._model.getCurDate()).day) != ((this._model.getLastOpened()).day)   ) {
            this._model.setMetGoal(0);
        }
        this.refreshBarCharts();
        this.resetDailyGoalChart(this._model.getMetGoal());
    },
    resetDailyGoalChart: function(x) {
        this._view._elements.percentageInput.text(x + '%').parent().attr('class', '').addClass('blue circle big p' + x);
    }
};