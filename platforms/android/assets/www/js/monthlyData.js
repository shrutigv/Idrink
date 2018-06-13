var monthlyData = function() {
    this.lastOpenedDate = {
        'day': null,
        'month': null,
        'year': null
    };
    this.curDate = {
        'day': null,
        'month': null,
        'year': null
    };
    ref = this;
    this.monthlyGoal = {};
    this.leapYear = function(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    };
    this.updateMonthlyData = function(j, c) {
        if (ref.curDate.day - j > 0) {
            if (typeof ref.monthlyGoal[ref.curDate.month + '' + (ref.curDate.day - j)] == 'undefined') {
                ref.monthlyGoal[ref.curDate.month + '' + (ref.curDate.day - j)] = 0;
            }
        } else {
            temp = ref.getTotalDays(ref.curDate.month);
            if (typeof ref.monthlyGoal[(ref.curDate.month - 1) + '' + (temp - c)] == 'undefined') {
                ref.monthlyGoal[(ref.curDate.month - 1) + '' + (temp - c)] = 0;
                c++;
            }
        }
        return c;
    };
    this.getLastOpenedDate = function() {
        var date = new Date();
        ref.lastOpenedDate.day = date.getDate();
        ref.lastOpenedDate.month = date.getMonth();
        ref.lastOpenedDate.year = date.getFullYear();
        return ref.lastOpenedDate;
    };
    this.getCurrentDate = function() {
        var date = new Date();
        ref.curDate.day = date.getDate();
        ref.curDate.month = date.getMonth();
        ref.curDate.year = date.getFullYear();
        return ref.curDate;
    };
    /*monthly goal is a asscociative array in format {'412':value} april12*/
    this.updateGoal = function(m) {
        ref.monthlyGoal = m;
        var iterate = null,
            counter = 0,
            temp = 0;
        if (ref.lastOpenedDate.month === null || ref.curDate.month - ref.lastOpenedDate.month > 1) {
            iterate = 30;
        } else if (ref.curDate.month - ref.lastOpenedDate.month == 0) {
            if (ref.curDate.day - ref.lastOpenedDate.day == 0) {
                return ref.monthlyGoal;
            } else {
                iterate = ref.curDate.day - ref.lastOpenedDate.day;
            }
        } else {
            iterate = (ref.getTotalDays(ref.lastOpenedDate.month + 1) - ref.lastOpenedDate.day) + ref.curDate.day;
        }
        if (iterate != null) {
            for (var j = 0; j < iterate; j++) {
                counter = ref.updateMonthlyData(j, counter);
            }
        }
        return ref.monthlyGoal;
    };
    /*return month in 3 letter format*/
    this.getMonth = function(m) {
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return month[m];
    };
    this.addToDailyGoal = function(val, res) {
        if (val + res <= 100) {
            val += res;
        } else {
            val = 100;
        }
        return val
    };
    this.delteFromDailyGoal = function(val, res) {
        val -= res;
        if(val < 0){
            val=0;
        }
        return val
    };
    this.addToMonthlyGoal = function(m) {
        ref.monthlyGoal[ref.curDate.month + '' + ref.curDate.day] = m;
        return ref.monthlyGoal;
    };
    /* return last 30 days value by summing up into 6 equal parts with date*/
    this.getMonthlyData = function(d, m, sum) {
        var data = [];
        var day = []
        var temp = 0,
            j = 0,
            i = 0;
        today = new Date();
        newdate = new Date();
        for (var k = 1; k < 31; k++) {
            if ((d.day - (k - 1)) > 0) {
                temp += m[d.month + '' + (d.day - (k - 1))];
            } else {
                temp += m[(d.month - 1) + '' + (ref.getTotalDays(d.month) - i)];
                i++;
            }
            if (k % sum == 0) {
                temp = Math.round(temp / sum);
                data.push(temp);
                newdate.setDate(today.getDate() - (k));
                day.push(newdate.getDate() + ' ' + ref.getMonth(newdate.getMonth()));
                temp = 0;
                j++;
                newdate = new Date();
            }
        }
        return {
            'data': data,
            'day': day
        }
    };
    /* return last seven days value with date*/
    this.getWeeklyData = function(d, m) {
        var data = [];
        var today = new Date(),
            newdate = new Date(),
            c = 0,
            dayVal = [];
        for (var i = 1; i < 8; i++) {
            if ((d.day - (i - 1)) > 0) {
                data.push(m[d.month + '' + (d.day - (i - 1))]);
            } else {
                data.push(m[(d.month - 1) + '' + (ref.getTotalDays(d.month) - c)]);
                c++;
            }
            newdate.setDate(today.getDate() - (i - 1));
            dayVal.push(newdate.getDate())
        }
        return {
            'data': data,
            'day': dayVal
        };
    };
    /*total number of days in given month*/
    this.getTotalDays = function(m) {
        var x = 0;
        if (m == 2) {
            if (ref.leapYear(ref.lastOpenedDate.year)) {
                x = 28;
            } else {
                x = 29;
            }
        } else {
            if (m % 2 == 0) {
                x = 30;
            } else {
                x = 31;
            }
        }
        return x;
    };
    return {
        getCurrentDate: this.getCurrentDate,
        getLastOpenedDate: this.getLastOpenedDate,
        getMonth: this.getMonth,
        getTotalDays: this.getTotalDays,
        updateGoal: this.updateGoal,
        addToDailyGoal: this.addToDailyGoal,
        delteFromDailyGoal: this.delteFromDailyGoal,
        addToMonthlyGoal: this.addToMonthlyGoal,
        getWeeklyData: this.getWeeklyData,
        getMonthlyData: this.getMonthlyData
    }
}