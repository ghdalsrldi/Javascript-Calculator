/**
 * Created by mkhong on 2017-05-17.
 */

var calcLib = function () {
    this.eventPool = [];
    this.constructor();
};

calcLib.prototype = {
    constructor: function () {
        this.currentNum = '';
        this.isDecimal = false;
        this.lastinputOperation = false;
        this.history = '';
        this.result = 0;
        this.historyOld = [];
        this.elements = {
            result_num: document.getElementById('result_num'),
            result_operation: document.getElementById('result_operation'),
            btn: {
                num: document.getElementsByClassName('btn-num'),
                operation: document.getElementsByClassName('btn-operation'),
                decimal: document.getElementsByClassName('btn-decimal'),
                result: document.getElementsByClassName('btn-result'),
                del: document.getElementsByClassName('btn-del'),
                clear: document.getElementsByClassName('btn-clear')
            }
        };
        this.eventPool = [];
        this.setEvent();
    },

    getHistory: function () {
        // todo 히스토리 출력 작업
        return this.history;
    },
    getResult: function (btn_ele, obj) {
        if (!obj) {
            obj = this;
        }

        if (!obj.lastinputOperation) {
            return;
        }

        var op = '(' + obj.result + ')' + obj.lastinputOperation + '(' + obj.currentNum + ')';
        obj.result = parseFloat(eval(op)).toFixed(6);
        if (obj.result % 1 === 0) {
            obj.result = parseInt(obj.result);
        }
        // obj.result = obj.result.toString();
        obj.result = parseFloat(String(obj.result));


        obj.currentNum = obj.result;
        obj.lastinputOperation = false;
        obj.isDecimal = false;
        obj.exportResult();
    },
    getNum: function (btn_ele, obj) {
        if (!obj) {
            obj = this;
        }
        var num = btn_ele.innerText;

        if (obj.lastinputOperation || (obj.currentNum === "0" && !obj.isDecimal)) {

            obj.currentNum = num;
        } else {
            obj.currentNum += num;
        }

        obj.exportResult(obj.currentNum);

        return btn_ele.innerText;
    },
    getOperation: function (btn_ele, obj) {
        if (!obj) {
            obj = this;
        }
        var operText = btn_ele.innerText;
        if (obj.currentNum === '') {
            obj.currentNum = operText;
        } else {
            obj.lastinputOperation = operText;

            obj.result = obj.currentNum;
        }

        obj.exportResult();
    },
    getDecimal: function (btn_ele, obj) {
        if (!obj) {
            obj = this;
        }
        if (obj.isDecimal) {
            return;
        }
        obj.isDecimal = true;
        obj.currentNum += ".";

        obj.exportResult(obj.currentNum);
    },
    setElement: function (obj) {
        // todo element 커스터마이징 작업
    },
    exportResult: function (num) {
        this.elements.result_num.innerText = String(num ? num : this.result);

    },
    setEvent: function () {
        var i, key;
        for (i in this.eventPool) {
            this.eventPool[i].removeEventListener('click');
        }

        var eventMapping = {
            num: this.getNum,
            operation: this.getOperation,
            decimal: this.getDecimal,
            result: this.getResult,
            del: this.del,
            clear: this.clear
        };

        var eventMappingKeys = Object.keys(eventMapping);

        for (key in eventMappingKeys) {
            var k = eventMappingKeys[key];

            for (i in this.elements.btn[k]) {
                if (this.elements.btn[eventMappingKeys[key]].hasOwnProperty(i) === false) {
                    continue;
                }
                var element = this.elements.btn[eventMappingKeys[key]][i];
                if (typeof element !== "object") {
                    continue;
                }
                try {
                    (function (obj, element, next) {
                        var parentObj = obj;
                        element.addEventListener('click', function () {
                            if (typeof next === "function") {
                                parentObj.eventPool.push(this);
                                next(this, obj);
                            }
                        });
                    }(this, element, eventMapping[eventMappingKeys[key]]))
                } catch (e) {
                }
            }
        }

    },
    clear: function (btn_ele, obj) {
        if (!obj) {
            obj = this;
        }
        obj.constructor();
        obj.exportResult();
    },
    del: function (btn_ele, obj) {
        if (!obj) {
            obj = this;
        }
        var del_char = obj.currentNum.substr(-1);
        obj.currentNum = obj.currentNum.substr(0, obj.currentNum.length - 1);
        if (del_char === '.') {
            obj.isDecimal = false;
        }
        obj.exportResult(obj.currentNum);
    }
};
// var calc;
document.addEventListener('DOMContentLoaded', function () {
    var calc = new calcLib();
});
