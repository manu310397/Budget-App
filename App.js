var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(currentValue) {
            sum += currentValue.value;
        });

        data.total[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //create new ID
            if(data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            else
                ID = 0;

            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.total.inc - data.total.exp;

            if(data.total.inc > 0)
                data.percentage = Math.round((data.total.exp/data.total.inc) * 100);
            else
                data.percentage = -1;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.total.inc,
                totalExpenses: data.total.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);
        }
    };
})();



var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element, fields, fieldsArr;

            if(type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function() {
            //querySelectorAll returns list
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + 
            DOMStrings.inputValue);

            //convert list into Array
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(currentValue, index, array) {
                currentValue.value = "";
            });
            fieldsArr[0].focus();
        },

        getDOMStrings: function() {
            return DOMStrings
        }
    };

})();



var appController = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function() {
        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        console.log(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;

        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();

            updateBudget();
        }
    };

    return {
        init: function() {
            setUpEventListeners();
        }
    }
})(budgetController, UIController);

appController.init();