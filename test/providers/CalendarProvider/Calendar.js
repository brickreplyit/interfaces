const DB = require('./Calendar.data.json');
const OneDay = 24*60*60*1000;

class CalendarProvider{
    constructor(){
    }

    getDays(){
        return DB.Day;
    }

    getShifts(from, to){
        var diffDays = Math.round(Math.abs((from.getTime() - to.getTime())/(OneDay)));
        var startDay = from.getDay();
        var days = this.getDays();
        var calendar = [];
        for(var i = 0; i < diffDays; i++){
            var index = (startDay + i) % 7;
            calendar.push({
                Day: days[index]
                ,Hours: index === 6 || index === 0 ? 0 : 8
            });
        }
        return calendar;
    }
}

module.exports = CalendarProvider;