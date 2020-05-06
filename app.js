//Storage controller
const StorageCtrl = (() => {
  //Public methods
  return {
    //Get items array from storage
    getStorage: () => {
      let items = [];

      if (localStorage.getItem('items' === null)) {
        return items;
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        return items;
      }
    },

    //Adds an item to storage
    setToStorage: (item) => {
      let items = StorageCtrl.getStorage();
      items.push(item);
      localStorage.setItem('items', JSON.stringify(items));
    },

    //Updates an item in Storage
    updateItem: (newItem) => {
      let index;
      let items = StorageCtrl.getStorage();
      items.forEach((item, i) => {
        if (newItem.id === item.id) {
          index = i;
        }
      });
      items[index] = newItem;
      localStorage.setItem('items', JSON.stringify(items));
    },

    //Removes an item from storage
    removeFromStorage: (item) => {
      let items = StorageCtrl.getStorage();
      items.splice(item, 1);
      localStorage.setItem('items', JSON.stringify(items));
    },

    //Cleaes the storage
    emptyStorage: () => {
      let items = [];
      localStorage.setItem('items', JSON.stringify(items));
    },

    //Loads storage on load
    initStorage: () => {
      ItemCtrl.setItems(StorageCtrl.getStorage());
    },
  };
})();

//Item Controller
const ItemCtrl = (() => {
  const Item = function (id, name, calories) {
    this.name = name;
    this.calories = calories;
    this.id = id;
  };

  //Data Structure /State
  const data = {
    //Array that holds all itmes
    items: [],
    //The current item shown
    currentItem: null,
    //The sum of all the calories sumed
    totalCalories: 0,
  };

  return {
    //Prints the data struct in console
    logData: () => {
      return data;
    },

    //Returns the items array
    getItems: () => {
      return data.items;
    },

    setItems: (items) => {
      data.items = items;
    },

    //Adds item to the array
    addItem: (name, calories) => {
      //Generate ID
      let ID;
      if (data.items.length === 0) {
        ID = 0;
      } else {
        ID = data.items[data.items.length - 1].id + 1;
      }

      //Parse calories to Int
      calories = parseInt(calories);

      //Make item
      const newItem = new Item(ID, name, calories);

      //Add item to array of items
      data.items.push(newItem);

      //Add item to local storage
      StorageCtrl.setToStorage(newItem);

      return newItem;
    },

    //Set the current item to the one passed
    setCurrentItem: (item) => {
      data.currentItem = item;
    },

    //Gets the current item
    getCurrentItem: () => {
      return data.currentItem;
    },

    //Gets the total calories
    getTotalCalories: () => {
      let total = 0;

      data.items.forEach((item) => {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },

    //Returns the item corresponding to the id passed
    getItemById: (id) => {
      let index;
      data.items.forEach((item, i) => {
        if (item.id == id) {
          index = i;
        }
      });
      return data.items[index];
    },

    //Update item
    updateItem: (name, calories) => {
      //Turn calories to number
      calories = parseInt(calories);

      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          StorageCtrl.updateItem(item);
        }
      });
    },

    //Removes an item from array
    removeItem: (item) => {
      //Finds index of item
      let index = data.items.indexOf(item);

      //Removes item
      data.items.splice(index, 1);

      //Remove from local storage
      StorageCtrl.removeFromStorage(item);
    },

    //Clears the items array
    clearItems: () => {
      data.items = [];
      StorageCtrl.emptyStorage();
    },
  };
})();

//UI Controller
const UICtrl = (() => {
  //Private methods and attributes
  //Selectors from markup
  const UISelectors = {
    itemsList: '#items-list',
    addBtn: '.add-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    totalCalories: '.total-calories',
    editBtn: '.edit-btn',
    removeBtn: '.remove-btn',
    backBtn: '.back-btn',
    clearAllBtn: '.btn-clear',
  };

  //Public methods
  return {
    //Displays all items
    populateItemList: (items) => {
      let html = '';

      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}"> 
         <strong>${item.name}: </strong> <em>${item.calories} calories</em>
         <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
       </li>`;
      });

      //Insert lis to html
      document.querySelector(UISelectors.itemsList).innerHTML = html;
    },

    //Sets the Item name and calorie amount of an item in the ui
    addItemToForm: () => {
      document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    //Returns the UI selectors
    getSelectos: () => {
      return UISelectors;
    },

    //Gets the input from the forms
    getInput: () => {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value,
      };
    },

    //Clears the input forms
    clearInput: () => {
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemCalories).value = '';
    },

    //Sets the default state of the UI
    setInitialState: () => {
      UICtrl.clearInput();
      document.querySelector(UISelectors.editBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.removeBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    //Adds an item to the UI
    addListItem: (item) => {
      //Create li item
      const li = document.createElement('li');
      //Add class
      li.className = 'collection-item';
      //Add ID
      li.id = `item-${item.id}`;
      //Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
      //Insert item
      document.querySelector(UISelectors.itemsList).insertAdjacentElement('beforeend', li);
    },

    //Displays total calories
    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    //Shows the edit state
    showEditState: () => {
      document.querySelector(UISelectors.editBtn).style.display = 'inline';
      document.querySelector(UISelectors.removeBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    //Update the UI when an item is editied
    updateItemUI: () => {
      //Update the UI List
      UICtrl.populateItemList(ItemCtrl.getItems());

      //Update total calories
      UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    },
  };
})();

//App Controller
const App = ((ItemCtrl, UICtrl, StorageCtrl) => {
  //Loads all event listeners
  const loadEventListeners = () => {
    const selectors = UICtrl.getSelectos();

    //Submit button
    document.querySelector(selectors.addBtn).addEventListener('click', itemAddSubmit);
    //Edit button next to item
    document.querySelector(selectors.itemsList).addEventListener('click', itemEditClicked);
    //Update item button
    document.querySelector(selectors.editBtn).addEventListener('click', itemUpdateSubmit);
    //Back Button
    document.querySelector(selectors.backBtn).addEventListener('click', itemBackClicked);
    //Delete Button
    document.querySelector(selectors.removeBtn).addEventListener('click', itemRemoveClicked);
    //Clear All Button
    document.querySelector(selectors.clearAllBtn).addEventListener('click', clearAll);
    //Prevents enter
    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 13 || e.which == 13) {
        e.preventDefault();
        return false;
      }
    });
  };

  //Adds an item when the submit button is pressed
  const itemAddSubmit = (e) => {
    //Get from input from UIController
    const input = UICtrl.getInput();

    //Validate input
    if (input.name !== '' && input.calories !== '') {
      //Make a new item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Add the new item to the list
      UICtrl.addListItem(newItem);
    } else {
      //Alert user
      window.alert('Please enter name and calories');
    }

    //Clear inputs
    UICtrl.clearInput();

    e.preventDefault();
  };

  //Changes the state to an edit state when user wants to edit an item
  const itemEditClicked = (e) => {
    if (e.target.classList.contains('edit-item')) {
      //Get LI ID
      const listId = e.target.parentNode.parentNode.id;

      //Break to array
      const listIdArr = listId.split('-');

      //Actual ID
      const id = parseInt(listIdArr[1]);

      //Get item to edit
      const itemToEdit = ItemCtrl.getItemById(id);

      //Set Current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm(itemToEdit);
    }

    e.preventDefault();
  };

  //Submit edited changes to item
  const itemUpdateSubmit = (e) => {
    //Gather input
    const input = UICtrl.getInput();

    //Update item
    ItemCtrl.updateItem(input.name, input.calories);

    //Update UI
    UICtrl.updateItemUI();

    //Clear edit state
    UICtrl.setInitialState();

    e.preventDefault();
  };

  //Goes back from edit state when back is clicked
  const itemBackClicked = (e) => {
    //Set initial UI
    UICtrl.setInitialState();

    e.preventDefault();
  };

  //Removes an item
  const itemRemoveClicked = (e) => {
    //Remove item
    ItemCtrl.removeItem(ItemCtrl.getCurrentItem());

    //Update UI
    UICtrl.updateItemUI();

    //Update staate
    UICtrl.setInitialState();

    e.preventDefault();
  };

  const clearAll = (e) => {
    //Clear array
    ItemCtrl.clearItems();

    //Update UI after items are removed
    UICtrl.updateItemUI();

    //Set Initial State
    UICtrl.setInitialState();

    e.preventDefault();
  };

  //Public Methods
  return {
    //Runs the app
    init: () => {
      //Set intial state
      UICtrl.setInitialState();

      //Load storage
      StorageCtrl.initStorage();

      //Fetch items from Item Controller
      const items = ItemCtrl.getItems();

      //Display items
      UICtrl.populateItemList(items);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
