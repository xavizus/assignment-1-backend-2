window.addEventListener('DOMContentLoaded', (event) => {
    Vue.component('addtask', {
        data: function () {
            return {
                task: undefined
            }
        },
        methods: {
            addTask: function (event) {
                event.preventDefault();
                let value = this.task.trim()
                if (value == ''){
                    return;
                }

                this.postAddItem(value);
            },
            postAddItem: function(value) {
                let object = {}
                object['title'] = value;
                fetch(`/api/v1/addTodoItem`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(object)
                }).then(async response => {
                    let status = response.status;
                    let result = await response.json();
                    if (status !== 200) {
                        throw new Error(result.msg)
                    }
                    this.$root.$emit('newTodoItem', result);

                }).catch(async error => {
                    this.value = this.value_;
                    console.error(error);
                });
            }
        },
        template: `
          <div class="row">
          <form class="form-inline mb-2 mr-sm-2 mt-1" @submit="this.addTask">
            <div class="input-group">
              <input class="form-control autoSizingInput" v-model="task" name="task" placeholder="task" type="text">
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="submit">Add task</button>
              </div>
            </div>
          </form>
          </div>
        `
    });

    const inputField = Vue.component('inputField', {
        data: function() {
          return {
              tag: 'p',
              onEvent: {
                  blur: this.revert,
                  keyup: this.revert
              },
              value_: undefined,
              blocked: false
          }
        },
        methods: {
            revert: function(event) {
                if(this.blocked) {
                    return;
                }
                if(event.type === 'keyup' && event.key !== "Enter") {
                    return;
                }
                if(this.tag === 'p'){
                    this.tag = 'input';
                } else if(this.tag === 'input'){
                    if(event.type ==='click') {
                        return ;
                    }
                    this.tag = 'p';
                    this.blocked = true;
                    this.unblockTimeout();
                    if(event.target.value.trim() == '') {
                        return;
                    }
                    this.value_ = this.value;
                    this.value = event.target.value
                    if(this.value !== this.value_) {
                        this.postUpdate('title', this.value);
                    }
                }
            },
            unblockTimeout: function () {
              setTimeout(() => {
                  this.blocked = false;
              },200)
            },
            postUpdate: function(type, value) {
                let object = {}
                object[type] = value;
                fetch(`/api/v1/updateTodoItem/${this.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(object)
                }).then(async response =>
                {
                    let status = response.status;
                    let result = await response.json();
                    if (status !== 200) {
                        throw new Error(result.msg)
                    }

                }).catch(async error => {
                    this.value = this.value_;
                    console.error(error);
                });
            }
        },
        updated() {
            this.$refs.input.focus();
            let temp = this.$refs.input.value;
            this.$refs.input.value = '';
            this.$refs.input.value = temp;
        },
        render: function(createElement){
            let attrs = {}
            let textContent;
            if (this.tag == 'input') {
                attrs.value = this.value;
                attrs.class = "form-control";
            }
            if (this.tag == 'p') {
                textContent = this.value;
            }
          return createElement(
              'td',
              {
                  on: {
                      click: this.revert
                  },
                ref:'td'
              },
              [
                  createElement(this.tag, {
                          attrs: attrs,
                          on: this.onEvent,
                          ref: 'input',
                      }, textContent),

              ])
        },
       props : ['value', 'id']
    });

    Vue.component('todotable', {
       data: function() {
           return {
               columns: ['Title', 'Done', 'Created', 'Last updated', "Manage"],
               todoItems: undefined,
               formatDate: formatDate,
               modalInstance: new BSN.Modal('#myModal'),
               sortColumn: 'createdAt',
               sortDirection: 'DESC'
           }
       },
        components: {
            inputField: inputField
        },
        mounted() {
           fetch('/api/v1/allTodoItems').then(async response =>
           {
               this.todoItems = await response.json()
           });
           this.$root.$on('newTodoItem',  async (todoObject)  => {
               this.todoItems.pop();
               this.todoItems.unshift(todoObject);
           });
        },
        methods: {
            displayModal: function(event) {
                let modalTitle = document.getElementById('myModalTitle');
                let modalContent = document.getElementById('myModalContent');
                let target = event.target;
                this.modalInstance.show();
            },
            update: function (event) {
                let target = event.target;
                let id = target.id;
                let isChecked = event.target.checked;
                let object = {}
                object['done'] = isChecked;
                fetch(`/api/v1/updateTodoItem/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(object)
                }).then(async response =>
                {
                    let status = response.status;
                    let result = await response.json();
                    if (status !== 200) {
                        throw new Error(result.msg)
                    }
                }).catch(async error => {
                    target.checked = !isChecked;
                    console.error(error);
                });

            }
        },
        template: `            
            <p v-if="!Array.isArray(todoItems) || todoItems.length === 0">
            No data found
            </p>
        <table class="table table-hover" v-else>
          <thead>
          <th v-for="column in columns">
            <tr>{{column}}</tr>
          </th>
          </thead>
          <tbody>
            <tr v-for="todoItem in todoItems">
              <inputField :value="todoItem.title" :id="todoItem._id"></inputField>
              <td class="col-1 text-center">
                <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" @input="update($event)" :id="todoItem._id" :checked="todoItem.done">
                  <label class="custom-control-label" :for="todoItem._id"></label>
                </div>
              </td>
              <td class="col-2">{{formatDate.formatString(new Date(todoItem.createdAt), '%Y-%m-%d')}}</td>
              <td class="col-2">{{formatDate.formatString(new Date(todoItem.updatedAt), '%Y-%m-%d')}}</td>
              <td class="col-1"><button class="btn btn-sm btn-danger" :data-id="todoItem._id" @click="displayModal"><i class="material-icons">delete</i></button></td>
            </tr>
          </tbody>
        </table>
        `
    });

    const vueApp = new Vue({
        el: '#app',
    });
});

class formatDate {
    static formatString (date, format) {
        const keys = {
            '%Y': date.getFullYear(),
            '%m': formatDate.convertToDoubleDigit(Number(date.getMonth())+1),
            '%d': formatDate.convertToDoubleDigit(date.getDate()),
            '%h': formatDate.convertToDoubleDigit(date.getHours()),
            '%M': formatDate.convertToDoubleDigit(date.getMinutes()),
            '%S': formatDate.convertToDoubleDigit(date.getSeconds())
        }
        let newString = format;
        for (let formatKey in keys) {
            newString = newString.replace(formatKey, keys[formatKey]);
        }
        return newString
    }
    static convertToDoubleDigit (digit){
        return (digit >= 10) ? digit : "0"+String(digit);
    }
}
