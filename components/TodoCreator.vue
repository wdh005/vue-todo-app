<template>
    <div>
        <button @click="createTodo">
            <i class="material-icons">add</i>
        </button>
        <input
            :value="title"
            :placeholder="placeholder"
            type="text"
            @input="title = $event.target.value"
            @keypress.enter="createTodo"
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: "",
            placeholder: "add task",
        };
    },
    methods: {
        createTodo() {
            const validatedTitle = this.title && this.title.trim();
            if (!validatedTitle) {
                alert("task를 입력해 주세요");
                this.title = this.title.trim();
                return;
            }
            //this.$emit("create-todo", this.title);
            this.$store.dispatch("todoApp/createTodo", this.title);
            this.title = "";

            this.$nextTick(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
        },
    },
};
</script>
