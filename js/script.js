const { createApp } = Vue

createApp({

    // Vue Data
    data() {
        return {
            contacts,
            currentContact: 0,
            newMessage: "",
        }
    },

    // Vue Methods
    methods: {

        selectContact(index) {
            this.currentContact = index
        },

        sendMessage() {

            // If valid, push to array
            if (this.newMessage) {

                this.contacts[this.currentContact].messages.push({
                    date: "...",
                    message: this.newMessage,
                    status: 'sent'
                })

                this.newMessage = ""
            }
        },

        receiveMessage() {

            const returnMessage = [
                "Ok!",
                "Sounds good!",
                "Not so sure..",
                "You tell me!",
                "Haha!",
                "I'm hungry"
            ]

            const n = Math.floor(Math.random() * returnMessage.length)

            setTimeout(() => {
                this.contacts[this.currentContact].messages.push({
                    date: "...",
                    message: returnMessage[n],
                    status: 'received'
                })
            }, 1000)

        },

    },

    // Vue Lifecycle
    mounted() {
        console.log("It's Alive!")
    }
}).mount("#app")