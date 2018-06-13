function ProfileView(model,x) {
    this._model = model;
    this.isPage=x;
    this._elements = {
        save: $('#submit'),
        toggle: $('.toggle span'),
        weightInput: $('#weight'),
        dailyGoals: $('.weightText')
    };

    this.weightSubmited = new Event(this);
    var _this = this;

    // attach listeners to HTML controls

    this._elements.save.click(function() {
        _this.validate();
    });
    this._elements.toggle.click(function(e) {
        _this.toggle(e);
    });
}

ProfileView.prototype = {
    toggle: function(e) {
        this._elements.toggle.removeClass('selected');
        $(e.target).addClass('selected');
        this._elements.dailyGoals.text($(e.target).attr('data-attr'));
        e.stopImmediatePropagation();
    },
    validate: function() {
        var weight = this._elements.weightInput.val();
        if (weight > 0) {
            this.weightSubmited.notify();
            $('.error').hide();
        } else {
            $('.error').show();
        }
    }
};

function ProfileController(model, view) {
    this._model = model;
    this._view = view;
    var _this = this;
    this._view.weightSubmited.attach(function() {
        _this.onSubmit();
    });
}

ProfileController.prototype = {
    calcDailyNeeds: function(weight, u) {
        if (u == 'oz') {
            this._model.setUnit('oz');
            this._model.setDailyNeeds(weight * 0.536);

        } else {
            this._model.setUnit('ml');
            this._model.setDailyNeeds(weight * 35);
        }
    },
    onSubmit: function() {
        var weight = this._view._elements.weightInput.val();
        this._model.setWeight(weight);
        this.calcDailyNeeds(weight, $('.toggle span.selected').attr('data-unit'));
        if(this._view.isPage){
            this._model.saveData();
            window.open('hydrate.html');
        }
        else{
            this._model.modelUpdated.notify();
        }

    }
};