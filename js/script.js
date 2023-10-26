const { createApp } = Vue

createApp({

    // Vue Data
    data() {
        return {
            contacts,
            currentContact: 0,
        }
    },

    // Vue Methods
    methods: {

        selectContact(index) {
            this.currentContact = index
        }

    },

    // Vue Lifecycle
    mounted() {
        console.log("It's Alive!")
    }
}).mount("#app")