window.addEventListener('DOMContentLoaded', (event) => {
    const startIndex = 1

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
                if (value == '') {
                    return;
                }

                this.postAddItem(value);
            },
            postAddItem: function (value) {
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
        data: function () {
            return {
                tag: 'p',
                onEvent: {
                    blur: this.revert,
                    keyup: this.revert
                },
                value_: undefined,
                blocked: false,
                value: this.text
            }
        },
        methods: {
            revert: function (event) {
                if (this.blocked) {
                    return;
                }
                if (event.type === 'keyup' && event.key !== "Enter") {
                    return;
                }
                if (this.tag === 'p') {
                    this.tag = 'input';
                } else if (this.tag === 'input') {
                    if (event.type === 'click') {
                        return;
                    }
                    this.tag = 'p';
                    this.blocked = true;
                    this.unblockTimeout();
                    if (event.target.value.trim() == '') {
                        return;
                    }
                    this.value_ = this.value;
                    this.value = event.target.value
                    if (this.value !== this.value_) {
                        this.postUpdate('title', this.value);
                    }
                }
            },
            unblockTimeout: function () {
                setTimeout(() => {
                    this.blocked = false;
                }, 200)
            },
            postUpdate: function (type, value) {
                let object = {}
                object[type] = value;
                fetch(`/api/v1/updateTodoItem/${this.id}`, {
                    method: 'PUT',
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
                    this.$root.$emit('updatedObject',{updatedAt: result.updatedAt, _id: result._id});
                }).catch(async error => {
                    this.value = this.value_;
                    console.error(error);
                });
            }
        },
        updated() {
            if(this.tag == 'input') {
                this.$refs.input.focus();
                let temp = this.$refs.input.value;
                this.$refs.input.value = '';
                this.$refs.input.value = temp;
            }
        },
        render: function (createElement) {
            let attrs = {}
            let textContent;
            if (this.tag == 'input') {
                attrs.value = this.value;
                attrs.class = "form-control";
            } else if (this.tag == 'p') {
                textContent = this.value;
            }
            return createElement(
                'td',
                {
                    on: {
                        click: this.revert
                    },
                    ref: 'td'
                },
                [
                    createElement(this.tag, {
                        attrs: attrs,
                        on: this.onEvent,
                        ref: 'input',
                    }, textContent),

                ])
        },
        watch: {
            text: function(newVal, oldVal) { // watch it
                this.value = newVal;
            }
        },
        props: ['text', 'id']
    });

    const pagination = Vue.component('pagination', {
        data: function() {
            return {
                totalPages: 0,
                currentPage: 0,
                totalOffset: 2,
                indexConvertion: 1
            }
        },
        mounted() {
            this.getPagiationData();
            this.$root.$on('newTodoItem', async (todoObject) => {
                this.getPagiationData();
            });

        },
        computed: {
          generateNav() {
              let totalPages = this.totalPages;
              let totalOffset = this.totalOffset;
              let currentPage = this.currentPage;
              let navArray = [];
              currentPage++;
              /**
               * Check if we are close to the start based of the offset value
               */
              if(currentPage - totalOffset <= startIndex) {
                  for(let index = startIndex; index <= totalOffset+currentPage && index <= totalPages; index++){
                      navArray.push(index);
                  }
                  /**
                   * If we are larger than the offsetvalue
                   * and lesser than total pages
                   */
              } else if (currentPage - totalOffset > startIndex) {
                  navArray.push(startIndex);
                  if(currentPage - totalOffset > totalOffset) {
                      navArray.push('...');
                  }
              }
              /**
               * check if we are lose to the end based of the offset value
               */
              if(currentPage - totalOffset >= totalOffset) {
                  for(let index = currentPage-totalOffset; index <= currentPage+totalOffset && index <= totalPages; index++){
                      navArray.push(index);
                  }
              }
              /**
               * check if we are less than the offsetvalue
               */
              if(currentPage < totalPages-totalOffset){
                  if(currentPage < totalPages-totalOffset-startIndex) {
                      navArray.push('...');
                  }
                  navArray.push(totalPages);
              }
              return navArray;
          }
        },
        methods: {
            nextPage: function () {
                if (this.currentPage+this.indexConvertion >= this.totalPages) {
                    return;
                }
                this.currentPage++;
                this.emitPageChangeEvent();
            },
            previousPage: function () {
                if (this.currentPage+this.indexConvertion <= startIndex) {
                    return;
                }
                this.currentPage--;
                this.emitPageChangeEvent();
            },
            gotoPage: function(event){
                this.currentPage = Number(event.target.getAttribute('value'))-this.indexConvertion;
                this.emitPageChangeEvent();
            },
            getPagiationData: function() {
                fetch(`/api/v1/pagination`).then(async response => {
                    let results = await response.json();
                    this.totalPages = results.totalPages;
                });
            },
            emitPageChangeEvent: function (){
                this.$root.$emit('changePage', this.currentPage);
            }
        },
        template: `
       <nav aria-label="Page navigation example">
       <ul class="pagination">
         <li class="page-item" :class="{'disabled' : (this.currentPage+this.indexConvertion) <= 1}" @click="previousPage">
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
            </a>
        </li>
         <li class="page-item" v-for="index in this.generateNav" :class="{'active' : index == (currentPage+indexConvertion), 'disabled' : index == '...'}">
           <a class="page-link" @click="gotoPage" :value="index">{{index}}</a>
         </li>
         <li class="page-item" :class="{'disabled' : this.currentPage+this.indexConvertion >= this.totalPages}" @click="nextPage">
          <a class="page-link" href="#" aria-label="Next" >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
</nav>
       `
    });

    Vue.component('todotable', {
        data: function () {
            return {
                columns: ['Title', 'Done', 'Created', 'Last updated', "Manage"],
                todoItems: [],
                formatDate: formatDate,
                modalInstance: new BSN.Modal('#myModal'),
                sortColumn: 'createdAt',
                sortDirection: 'DESC',
                currentPage: 0,
                maxTodosPerPage: 10,
                translate: {
                    'createdAt': 'Created',
                    'updatedAt': 'Last updated'
                }
            }
        },
        components: {
            inputField: inputField,
            pagination: pagination
        },
        mounted() {
            this.getPageData();
            this.$root.$on('newTodoItem', async (todoObject) => {
                if (this.sortDirection === 'DESC' && this.currentPage == 0) {
                    if(this.todoItems.length >= this.maxTodosPerPage) {
                        this.todoItems.pop();
                    }
                    this.todoItems.unshift(todoObject);
                } else {
                    this.getPageData();
                }
            });
            this.$root.$on('changePage', async (page) => {
                this.currentPage = page;
                this.getPageData();
            });
            this.$root.$on('updatedObject', async(updatedObject) => {
                let objectIndex = await this.todoItems.findIndex(object => object._id == updatedObject._id);
                this.todoItems[objectIndex].updatedAt = updatedObject.updatedAt;
            });
        },
        methods: {
            displayModal: function (event) {
                let modalTitle = document.getElementById('myModalTitle');
                let modalContent = document.getElementById('myModalContent');
                let target = event.target;
                this.modalInstance.show();
            },
            updateCheckbox: function (event) {
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
                }).then(async response => {
                    let status = response.status;
                    let result = await response.json();
                    if (status !== 200) {
                        throw new Error(result.msg)
                    }
                    this.$root.$emit('updatedObject',{updatedAt: result.updatedAt, _id: result._id});
                }).catch(async error => {
                    target.checked = !isChecked;
                    console.error(error);
                });

            },
            getPageData: function () {
                fetch(`/api/v1/allTodoItems/${this.currentPage}?sortDir=${this.sortDirection}&sortColumn=${this.sortColumn}`).then(async response => {
                    let result = await response.json();
                    if(!Array.isArray(result)) {
                        return;
                    }
                    this.todoItems = result;
                });
            },
            setSortColumn: function(column) {
                if(this.translate[this.sortColumn] != column) {
                    this.sortDirection = 'DESC';
                    this.sortColumn = Object.keys(this.translate).find(key => this.translate[key] === column);
                } else {
                    this.sortDirection = this.sortDirection == 'DESC' ? 'ASC' : 'DESC';
                }
                this.getPageData();
            },
            getSortDirection: function(column){
                if(this.translate[this.sortColumn] != column){
                    return 'left';
                }
                if(this.sortDirection == 'DESC'){
                    return 'down';
                } else if(this.sortDirection == 'ASC'){
                    return 'up';
                }

            }
        },
        template: `
          <div class="w-100">
          <p v-if="!Array.isArray(todoItems) || todoItems.length === 0">
          No data found
          </p>
          <table class="table table-hover" v-else>
          <thead>
          <th v-for="column in columns">
            <tr v-if="column == 'Created' || column == 'Last updated'" @click="setSortColumn(column)" class="pointer">{{ column }} <i class="arrow" :class="getSortDirection(column)"></i></tr>
            <tr v-else>{{ column }} </tr>
          </th>
          </thead>
          <tbody>
          <tr v-for="todoItem in todoItems">
            <inputField :text="todoItem.title" :id="todoItem._id"></inputField>
            <td class="col-1 text-center">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" @input="updateCheckbox($event)" :id="todoItem._id"
                       :checked="todoItem.done">
                <label class="custom-control-label" :for="todoItem._id"></label>
              </div>
            </td>
            <td class="col-2">{{ formatDate.formatString(new Date(todoItem.createdAt), '%Y-%m-%d') }}</td>
            <td class="col-2">{{ formatDate.formatString(new Date(todoItem.updatedAt), '%Y-%m-%d') }}</td>
            <td class="col-1">
              <button class="btn btn-sm btn-danger" :data-id="todoItem._id" @click="displayModal"><i
                  class="material-icons">delete</i></button>
            </td>
          </tr>
          </tbody>
          </table>
          <pagination></pagination>
          </div>
        `
    });

    const vueApp = new Vue({
        el: '#app',
    });
});

class formatDate {
    static formatString(date, format) {
        const keys = {
            '%Y': date.getFullYear(),
            '%m': formatDate.convertToDoubleDigit(Number(date.getMonth()) + 1),
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

    static convertToDoubleDigit(digit) {
        return (digit >= 10) ? digit : "0" + String(digit);
    }
}
