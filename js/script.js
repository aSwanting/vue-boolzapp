const { createApp } = Vue

createApp({

    // Vue Data
    data() {
        return {
            contacts,
            currentContact: 0,
            newMessage: "",
            messageSent: false,
            randomResponses,
            contactSearched: "",
            currentDropdown: 0,

        }
    },

    watch: {
        contactSearched() {
            // Per posterità
            // this.contacts.forEach(contact => !(contact.name.toLowerCase().includes(this.contactSearched.toLowerCase())) ? contact.visible = false : contact.visible = true)
            const lowercaseSearch = this.contactSearched.toLowerCase()
            this.contacts.forEach(contact => {
                const lowercaseName = contact.name.toLowerCase()
                lowercaseName.includes(lowercaseSearch) ? contact.visible = true : contact.visible = false
            })
        },
    },

    // Vue Methods
    methods: {

        selectContact(index) {
            this.currentContact = index
        },

        toggleDropdown(index) {
            this.hideDropdown()
            const currentMessage = this.contacts[this.currentContact].messages[index]
            currentMessage.dropdown = !currentMessage.dropdown
            this.currentDropdown = index
        },

        hideDropdown() {
            const currentMessage = this.contacts[this.currentContact].messages[this.currentDropdown]
            if (currentMessage.dropdown) currentMessage.dropdown = false
        },

        deleteMessage(index) {
            this.contacts[this.currentContact].messages[index].message = "Message deleted"
            this.contacts[this.currentContact].messages[index].deleted = true
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
            if (this.messageSent) {
                const responseIndex = Math.floor(Math.random() * this.randomResponses.length)
                setTimeout(() => {
                    this.contacts[this.currentContact].messages.push({
                        date: (new Date().toLocaleString()),
                        message: this.randomResponses[responseIndex],
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