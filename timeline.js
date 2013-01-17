(function(window) {

// empty function
function Empty() {};
// 时间轴类
var Timeline = function(options) {
    // private vars
    var interval = null,
        percent,
        startTime,
        running = false;

    options = options || {};

    // public vars
    // 持续时间
    this.duration = options.duration === undefined ? Infinity : options.duration;
    // 变换方向
    this.direction = options.direction === undefined ? 1 : options.direction;
    // 50 ~ 60 fps is recommended
    this.fps = options.fps === undefined ? 50 : options.fps;

    // private functions

    // privileged functions
    // 时间进度
    this.getPercent = function() {
        return percent || 0;
    };
    this.setPercent = function(p) {
        percent = p;
    };
    this.getRunning = function() {
        return running;
    };
    this.setRunning = function(isRunning) {
        running = isRunning;
    };
    this.setIntv = function(intV) {
        interval = intV;
    };
    this.getIntv = function() {
        return interval;
    };
    this.clearIntv = function() {
        interval = null;
        
        delete interval;
    };
    this.setStartTime = function(timestamps) {
        startTime = timestamps;
    };
    this.getStartTime = function() {
        return startTime;
    };

    // events
    this.onstart = (typeof options.onstart === 'function') ? options.onstart : Empty;
    this.onstep = (typeof options.onstep === 'function') ? options.onstep : Empty;
    this.oncomplete = (typeof options.oncomplete === 'function') ? options.oncomplete : Empty;
};
// public functions
Timeline.prototype = {
    constructor: Timeline,
    start: function() {
        var running = this.getRunning(),
            interval,
            me = this;

        if(!running) {
            this.setRunning(true);
            this.setStartTime(new Date().getTime());
            this.setPercent(0);

            if(this.onstart() !== false) {
                interval = window.setInterval(function() {
                    me.step();
                }, 1 / this.fps * 1000);

                this.setIntv(interval);
            }
        }

        return interval;
    },
    stop: function() {
        var interval = this.getIntv();

        interval && (clearInterval(interval));
        this.clearIntv();

        this.setRunning(false);
    },
    step: function() {
        var startTime = this.getStartTime(),
            spend = new Date().getTime() - startTime,
            duration = this.duration,
            percent = spend < duration ? ((spend % duration) / duration) : 1;

        if(!this.getRunning()) {
            throw new Error('timeline was not started yet! Please start a timeline firstly!');
        }
        if(this.direction < 0) {
            percent = 1 - percent;
        }

        this.setPercent(percent);

        if(spend < duration) {
            this.onstep(spend);
        } else {
            this.stop();

            this.onstep(duration);
            this.oncomplete();
        }
    }
};


// explose
window.Timeline = Timeline;

})(this);
