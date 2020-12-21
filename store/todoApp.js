import Vue from "vue";
import lowdb from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage";
import cryptoRandomString from "crypto-random-string";
import _cloneDeep from "lodash/cloneDeep";
import _find from "lodash/find";
import _assign from "lodash/assign";
import _findIndex from "lodash/findIndex";
import _forEachRight from "lodash/forEachRight";

export default {
    namespaced: true,
    state: () => ({
        db: null,
        todos: [],
        filter: "all",
    }),
    getters: {
        filteredTodos(state) {
            switch (state.filter) {
                case "all":
                default:
                    return state.todos;
                case "active":
                    return state.todos.filter((todo) => !todo.done);
                case "completed":
                    return state.todos.filter((todo) => todo.done);
            }
        },
        total(state) {
            return state.todos.length;
        },
        activeCount(state) {
            return state.todos.filter((todo) => !todo.done).length;
        },
        completedCount(state, getters) {
            return getters.total - getters.activeCount;
        },
    },
    mutations: {
        assignDB(state, db) {
            state.db = db;
        },
        createDB(state, newTodo) {
            state.db
                .get("todos")
                .push(newTodo)
                .write();
        },
        updateDB(state, { todo, value }) {
            state.db
                .get("todos")
                .find({ id: todo.id })
                .assign(value)
                .write();
        },
        deleteDB(state, todo) {
            state.db
                .get("todos")
                .remove({ id: todo.id })
                .write();
        },
        assignTodos(state, todos) {
            state.todos = todos;
        },
        pushTodo(state, newTodo) {
            state.todos.push(newTodo);
        },
        assignTodo(state, { foundTodo, value }) {
            _assign(foundTodo, value);
        },
        deleteTodo(state, foundIndex) {
            Vue.delete(state.todos, foundIndex);
        },
        updateTodo(state, { todo, key, value }) {
            todo[key] = value;
        },
        updateFilter(state, filter) {
            state.filter = filter;
        },
    },
    actions: {
        initDB({ state, commit }) {
            const adapter = new LocalStorage("todo-app");
            //state.db = lowdb(adapter);
            commit("assignDB", lowdb(adapter));
            const hasTodos = state.db.has("todos").value();

            if (hasTodos) {
                //state.todos = _cloneDeep(state.db.getState().todos);
                commit("assignTodos", _cloneDeep(state.db.getState().todos));
            } else {
                //Local DB초기화
                state.db
                    .defaults({
                        todos: [], //Collection
                    })
                    .write();
            }
        },
        createTodo({ state, commit }, title) {
            const newTodo = {
                id: cryptoRandomString({ length: 10 }),
                title,
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false,
            };
            //Create DB
            commit("createDB", newTodo);
            //Create Client
            commit("pushTodo", newTodo);
        },
        updateTodo({ state, commit }, { todo, value }) {
            //Update DB
            commit("updateDB", { todo, value });

            const foundTodo = _find(state.todos, { id: todo.id });

            commit("assignTodo", { foundTodo, value });
        },
        deleteTodo({ state, commit }, todo) {
            //Delete DB
            commit("deleteDB", todo);
            const foundIndex = _findIndex(state.todos, { id: todo.id });

            //Delete Cliemt
            commit("deleteTodo", foundIndex);
        },
        completeAll({ state, commit }, checked) {
            //DB 갱신
            const newTodos = state.db
                .get("todos")
                .forEach((todo) => {
                    //todo.done = checked;
                    commit("updateTodo", {
                        todo,
                        key: "done",
                        value: checked,
                    });
                })
                .write();

            //Local todos 갱신
            // this.todos.forEach(todo => {
            //     todo.done = checked
            // })
            //state.todos = _cloneDeep(newTodos);
            commit("assignTodos", _cloneDeep(newTodos));
        },
        clearCompleted({ state, dispatch }) {
            // this.todos.forEach(todo => {
            //     if(todo.done) {
            //         this.deleteTodo(todo)
            //     }
            // }) 배열을 삭제할 때는 뒤에서 부터 삭제 될 수 있도록 로직을 작성한다.

            // this.todos
            //     .reduce((list, todo, index) => {
            //         if (todo.done) {
            //             list.push(index);
            //         }
            //         return list;
            //     }, [])
            //     .reverse()
            //     .forEach((index) => {
            //         this.deleteTodo(this.todos[index]);
            //     });

            //라이브러리 사용 (오른쪽부터 forEach를 적용한다.)
            _forEachRight(state.todos, (todo) => {
                if (todo.done) {
                    //this.deleteTodo(todo);
                    dispatch("deleteTodo", todo);
                }
            });
        },
    },
};
