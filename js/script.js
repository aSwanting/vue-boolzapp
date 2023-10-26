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

        convertDate(date) {

            const splitDate = date.split("/")
            const convertedDate = `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}`
            return convertedDate

        },

        getTime(index) {

            const convertedDate = this.convertDate(this.contacts[this.currentContact].messages[index].date)
            const time = new Date(convertedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            return time

        },

        getLastMessage(index) {

            const messages = this.contacts[index].messages
            let receivedMessages = []

            messages.forEach(message => {
                if (message.status === "received") {
                    receivedMessages.push(message)
                }
            })

            return receivedMessages

        },

        printLastMessage(index) {

            const receivedMessages = this.getLastMessage(index)
            const lastMessage = receivedMessages[receivedMessages.length - 1].message
            return lastMessage

        },

        printLastMessageTime(index) {

            const receivedMessages = this.getLastMessage(index)
            const convertedDate = this.convertDate(receivedMessages[receivedMessages.length - 1].date)
            const time = new Date(convertedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            return time

        },

    },

    // Vue Lifecycle
    mounted() {
        console.log("It's Alive!")
    }
}).mount("#app")