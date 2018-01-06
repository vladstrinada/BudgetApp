var budgetController = (function(){

    var Expense = function(id, description, value, percentage){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalIncome){
        
        if (totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome)*100);
        }else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    }
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
        percentageLight: -1 
    };
    
    return {
        addItem: function(type, des, val){
            
            var newItem, ID;
            //create new id
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            } 
            //create item based on inc or exp
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            //push the data into an array
            
            data.allItems[type].push(newItem);
            
            //return new element of the array
            return newItem;
        },
        deleteItem: function(type, id){
            var ids, index;
            
             ids = data.allItems[type].map(function(current){
                return current.id; 
            });
            
            index = ids.indexOf(id);
            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        testing: function(){
            console.log(data);
        },
        
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
            cur.calcPercentage(data.totals.inc);
            });
        },
        
        getPercentages: function(){
          var allPerc = data.allItems.exp.map(function(cur){
              return cur.getPercentage();
          })
          return allPerc;
        },
        
        calculateBudget: function(){
            
            //calculate total incomes and exp
            calculateTotal('exp');
            calculateTotal('inc');
            
            //calculate the budget
             data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the percentage
            data.percentage = Math.round((data.totals.exp / data.totals.inc)*100); 
            
            //calculate the percentage of expenses
            
            //data.percentageLight = Math.round((data.allItems.exp/ data.totals.exp)*100);
            
            
        },
        getBudget: function(){
        return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
       
};
    }
    }
    }
 )();



var UIController =(function(){
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
        
    };
       var formatNumber = function(num, type){
          var numSplit, int, dec, type;
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length); //from 2333 to 2,333
        }
            dec = numSplit[1];
           return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
            
        };
     var nodeListForEach = function(list,callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i],i);
                }
            };
    return {
        getinput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,
             description: document.querySelector(DOMStrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            //create html string with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';  
            }else if (type === 'exp'){
                element = DOMStrings.expensesContainer;
                 
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace placeholder with some data
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            //insert Html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
             
        },
        
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        clearFields: function(){
            var fields,fieldsArr;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
             fieldsArr.forEach(function(current, index, array){
                 current.value = "";
             });
            fieldsArr[0].focus();
        }
        
        ,displayBudget: function(obj){
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
                document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
                document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
    
            if(obj.percentage > 0){
              document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';  
            }else {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;
            }
            
            
            
        },
        
        displayPercentages: function(percentages){
            
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            
            
            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
                
            });
            
        },
        displayMonth : function(){
          var now, year, month, months;
             now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'];
            month= now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' '+ year;
            
        },
        changedType: function(){
            var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
            
        }
    }
})();




var controller = (function(budgetCtrl, UICtrl){
    var setUpEventListeners = function(){
        var Dom = UICtrl.getDOMStrings();
         document.querySelector(Dom.inputBtn).addEventListener('click',ctrlAddItem);
    document.addEventListener('keypress',function(event){
        if(event.keyCode === 13){
            ctrlAddItem();
        }
    });
        document.querySelector(Dom.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(Dom.inputType).addEventListener('change',UICtrl.changedType);
        
    };
    
    var updateBudget = function(){
//calculate budget
    budgetCtrl.calculateBudget();
        
        //return budget
        var budget = budgetCtrl.getBudget();
        //display date
        UICtrl.displayMonth();
        //display on the UI
        UICtrl.displayBudget(budget);
}
    
    var updatePercentages = function(){
        //calculate percentages
        budgetCtrl.calculatePercentages();
        //read from budgetcontroller
        var percentages = budgetCtrl.getPercentages();
        //update the UI
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function(){
        var input, newItem;
        
        //get the input data
         input = UICtrl.getinput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
              //add the new item into the budget controller
         newItem = budgetCtrl.addItem(input.type, input.description, input.value);
       //add new item to UI
        UICtrl.addListItem(newItem,input.type);
        //clear fields
        UICtrl.clearFields();
            
            //update budget
            updateBudget();
            
            //update percentages
            updatePercentages();
            
            
        }
             
    };
    
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //delete item from data structure
    budgetCtrl.deleteItem(type, ID);
            
            //delete from UI
            UICtrl.deleteListItem(itemID);
        
            //update the budget
            updateBudget();
            
            //update percentages
            updatePercentages();
        }
    };
   
return {
    init: function(){
        console.log('Application has started.');
        UICtrl.displayMonth();
        UICtrl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: '___'
        });
        setUpEventListeners();
        
    }
};
   
})(budgetController,UIController);
controller.init();