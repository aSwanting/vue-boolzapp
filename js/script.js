const { createApp } = Vue

createApp({

    // Vue Data
    data() {
        return {
            contacts,
            currentContact: 0,
            newMessage: "",
            messageSent: false,
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
                    date: (new Date().toLocaleString()),
                    message: this.newMessage,
                    status: 'sent'
                })
                this.messageSent = true
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

            if (this.messageSent) {

                const n = Math.floor(Math.random() * returnMessage.length)

                setTimeout(() => {
                    this.contacts[this.currentContact].messages.push({
                        date: (new Date().toLocaleString()),
                        message: returnMessage[n],
                        status: 'received'
                    })
                }, 1000)

                this.messageSent = false

            }


        },

        convertDate(date) {

            const splitDate = date.split("/")
            const convertedDate = `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}`
            return convertedDate

        },

        getCurrentTime() {

            const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            return currentTime
        },

        getTimeFromArray(index) {

            const convertedDate = this.convertDate(this.contacts[this.currentContact].messages[index].date)
            const time = new Date(convertedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            return time

        },

        getReceivedMessages(index) {

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

            const receivedMessages = this.getReceivedMessages(index)
            const lastMessage = receivedMessages[receivedMessages.length - 1].message
            return lastMessage

        },

        printLastMessageTime(index) {

            const receivedMessages = this.getReceivedMessages(index)
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