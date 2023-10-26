const { createApp } = Vue

createApp({

    // Vue Data
    data() {
        return {
            contacts
        }
    },

    // Vue Methods
    methods: {

    },

    // Vue Lifecycle
    mounted() {
        console.log("It's Alive!")
    }
}).mount("#app")