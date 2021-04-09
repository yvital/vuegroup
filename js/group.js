window.onload = function () {
    Vue.component("modal", {
        props: ['index'], 
        template: `
          <transition name="modal" id="modal-template"><div class="modal-mask"><div class="modal-wrapper">\
          <div class="modal-container"><div class="modal-header"><slot name="header"></slot>\
          </div> <div class="modal-body"><slot name="body">Вы действитель хотите удалить карточку?</slot>\
          </div><div class="modal-footer"><slot name="footer"></slot><slot name="footer-left">\
          <button class="modal-default-button bluebtn" @click="$emit('close')">Отмена</button>\
          </slot></div></div></div></div></transition>
        `
    });

    Vue.component('option-groups', {
      props: ['post'], 
      template:`\
        <option>{{ post.title }}</option>
      `
    }); 

    let cardPost = Vue.component('card-post', {
      props: ['post', 'groups'],      
      template: `\
        <div class="card-post">\
          <span class="mini-font">Название: </span><span class="blue">{{ post.title }}.</span>\
          <span class="mini-font">Статус: </span>\
          <p><select id="new-card-state-up" v-model="value" @input="$emit('input', $event.target.value)" @change="upState" class="input300">\
          <option active value="1">Не сделано</option><option value="2">Cделано</option></select></p>\
          <span class="mini-font">Группа: </span>\
          <p><select id="new-card-group-up" v-model="value2" @input="$emit('input', $event.target.value)" @change="upGroup" class="input300">\
          <option-groups v-for="(post, index) in groups" :value="post.id"  v-bind:key="post.id" v-bind:post="post"> </option-groups></select></p>\ 
          <span class="mini-font">Описание: </span>\ 
          <p id="description" class="description" @click="filterOff" >{{ post.description | formatDescription(reduction) }}</p>\                  
          <button id="show-modal" class="btn" @click="showmodal = true">Удалить</button>\
          <modal v-if="showmodal" @close="showmodal = false"><h3 slot="header">Удаление карточки</h3>\ 
          <span slot="footer"><button class="modal-default-button-left bluebtn" @click="$emit('remove')">Да</button>\
          </span>\
          </modal>\          
        </div>\
      `,
      data: function() {
        return {
          value: this.selectedState(),
          value2: this.selectedGroup(),
          showmodal: false,
          reduction: true
        };
      },

      methods: {
        upState: function () {
          if (this.value == 1){
            this.post.state = "Не сделано";
          }
          else {
            this.post.state = "Сделано";
          }
        },
        upGroup: function () {
          let findGroupTitle = this.groups.find(item => item.id == this.value2);     

          findGroupTitle = 0;

          if (findGroupTitle.title === undefined) {
             this.post.group = '';
          } else {
            this.post.group = findGroupTitle.title;
          }

        },

        selectedState: function () {
          if (this.post.state === "Не сделано")
            return 1;
          else return 2;
        },

        selectedGroup: function () {

          let findGroup = this.groups.find(item => item.title == this.post.group);

          if (findGroup === undefined){
            return -1;
          }
          else{
            return findGroup.id; 
          }         
        },

        filterOff: function () {
            this.reduction = false;
        } 

      },

      filters: {
        formatDescription(description, let_reduction ) {
          if (let_reduction) {
              return description.slice( 0, 80) + ' ...';
          }
          else{
            return description;
          }
        }
      }

    });    

    let groupPost = Vue.component('group-post', {
      props: ['post'],      
      template: `\
        <div class="group-post">\
          <p><span class="mini-font">Название: </span><span>{{ post.title }}</span></p>\        
          <button class="btn" v-on:click="$emit(\'remove\')">Удалить</button>\
        </div>\
      `
    });      

    let VM = new Vue({
      el: '#app',   

      components: {
        "card-post": cardPost,
        "group-post": groupPost
      },

      data: {

        siteName: "Vue.js - Группы карточек",       
        stateList: [
          { "value": "Не сделано" },
          { "value": "Cделано" }
        ],
        newTodoText: '',
        newTodoState: '',
        newTodoGroup: '',
        newTodoDescription: '',        
        searchName: '',
        searchState: '',

        cards: [
          { 
            id: 1, 
            title: 'Покормить мышь', 
            state: 'Сделано',
            group: 'Грызуны',
            description: 'В дикой природе мыши в основном растительноядные. В теплый сезон они поедают фрукты, ягоды и семена. В холодные зимние месяцы мыши будут есть корни растений и кору деревьев.'
          },
          { 
            id: 2, 
            title: 'Покормить кота', 
            state: 'Не сделано', 
            group: 'Плотоядные',
            description: 'Питание домашних кошек должно быть разнообразным, сбалансированным по содержанию белков, углеводов, жиров, питательным. В рационе в необходимой концентрации должны присутствовать незаменимые кислоты, витамины, макро- и микроэлементы, необходимые для нормального роста, развития, физиологического состояния.'
          }, 
          { 
            id: 3, 
            title: 'Покормить собаку', 
            state: 'Cделано',
            group: 'Плотоядные',
            description: 'Правильно подобранный рацион питания собаки – один из важнейших факторов, влияющих на здоровье вашего питомца. Собаки – животные непритязательные, им чужд утонченный вкус, поэтому задача хозяина подобрать не только вкусную, но и полезную пищу в соответствии с физиологическими потребностями питомца. Потребности индивидуальны: они зависят от возраста, рабочих нагрузок, места проживания, времени года.'            
          }
        ],
        groups: [
          { 
            id: 1001, 
            title: 'Грызуны'
          },
          { 
            id: 1002, 
            title: 'Травоядные'
          },
          { 
            id: 1003, 
            title: 'Плотоядные'
          }
        ],

        nextTodoId: 4,         
        nextGroupId: 1004   
      
      },

      methods: {     
        addNewCard: function () {
          this.cards.push({
            id: this.nextTodoId++,
            title: this.newTodoText,
            state: this.newTodoState,
            group: this.newTodoGroup,
            description: this.newTodoDescription
          })
          this.newTodoText = '';
          this.newTodoState = '';
          this.newTodoGroup = '';
          this.newTodoDescription = '';
        },             
        addNewGroup: function () {
          this.groups.push({
            id: this.nextGroupId++,
            title: this.newTodoGroup,
          })
          this.newTodoGroup = '';
        }

      },
      computed:{
        filterCards: function(){
          let loc_title = this.searchName.toLowerCase();
          let loc_state = this.searchState.toLowerCase();
          if ( loc_title.length > 0 ){
            return this.cards.filter(function (elem) {                 
              if(loc_title==='') return true;
                else return elem.title.toLowerCase().indexOf(loc_title) > -1;              
            })
          }
          else {
              return this.cards.filter(function (elem) {                 
                if(loc_state==='') return true;
                  else return elem.state.toLowerCase().indexOf(loc_state) > -1;
              })
          }
        }
      }
     
    });
}