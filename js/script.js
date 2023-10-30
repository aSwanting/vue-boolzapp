const { createApp } = Vue

createApp({

    // Vue Data
    data() {
        return {
            contacts,
            currentContact: 0,
            newMessage: "",
            randomResponses,
            contactSearched: "",
            currentDropdown: 0,
            dropdownOpen: false,
            // Bonus Properties
            secretMessage: false,
            circles: [],
            animationID: null,
        }
    },

    watch: {
        contactSearched() {
            // Per posterità
            // this.contacts.forEach(contact => !(contact.name.toLowerCase().includes(this.contactSearched.toLowerCase())) ? contact.visible = false : contact.visible = true)

            const lowercaseSearch = this.contactSearched.toLowerCase().split(' ').join('')

            if (lowercaseSearch) {
                this.contacts.forEach(contact => {

                    const lowercaseName = contact.name.toLowerCase().split(' ').join('')
                    lowercaseName.includes(lowercaseSearch) ? contact.visible = true : contact.visible = false

                })
            }
        },
    },

    // Vue Methods
    methods: {

        selectContact(index) {
            this.currentContact = index
        },

        toggleDropdown(index) {

            if (this.dropdownOpen && this.currentDropdown != index) this.hideDropdown()

            const currentMessage = this.contacts[this.currentContact].messages[index]
            currentMessage.dropdown = !currentMessage.dropdown

            if (currentMessage.dropdown) {
                this.dropdownOpen = true
                this.currentDropdown = index
            } else {
                this.dropdownOpen = false
            }

        },

        hideDropdown() {
            if (this.dropdownOpen) {
                const currentMessage = this.contacts[this.currentContact].messages[this.currentDropdown]
                if (currentMessage.dropdown) currentMessage.dropdown = false
                this.dropdownOpen = false
            }
        },

        deleteMessage(index) {
            const currentMessage = this.contacts[this.currentContact].messages[index]
            currentMessage.message = "Message deleted"
            currentMessage.deleted = true
        },

        checkMessage() {

            if (this.newMessage) {
                this.newMessage[0] === "/" ? this.interpretCommand() : this.sendMessage()
                this.newMessage = ""
            }
        },

        sendMessage() {

            this.contacts[this.currentContact].messages.push({
                date: (new Date().toLocaleString("en-GB")),
                message: this.newMessage,
                status: 'sent'
            })

            this.scrollToBottom()
            setTimeout(() => this.receiveMessage(), 1000)
        },

        receiveMessage(foo) {

            let response

            if (!foo) {
                const responseIndex = Math.floor(Math.random() * this.randomResponses.length)
                response = this.randomResponses[responseIndex]
            } else {
                response = foo
            }

            this.contacts[this.currentContact].messages.push({
                date: (new Date().toLocaleString("en-GB")),
                message: response,
                status: 'received'
            })

            this.scrollToBottom()
        },

        scrollToBottom() {
            const chat = this.$refs.chatBody
            setTimeout(() => chat.scrollTop = chat.scrollHeight - chat.clientHeight, 0)
        },

        convertDate(date) {
            const splitDate = date.split("/")
            const convertedDate = `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}`
            return convertedDate
        },

        getTimeFromArray(index) {
            const convertedDate = this.convertDate(this.contacts[this.currentContact].messages[index].date)
            const time = new Date(convertedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
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
            const time = new Date(convertedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
            return time
        },


        // Bonus Command Section
        interpretCommand() {
            const commandString = this.newMessage.split(" ")
            const [command, value] = commandString

            switch (command) {

                case "/commands":

                    this.receiveMessage("Type the following commands for bonus features")
                    this.receiveMessage("/circles number")
                    this.receiveMessage("/clearcircles")
                    this.receiveMessage("/rotate number")

                    break;

                case "/circles":
                    this.spawnCircles(value)
                    break;
                case "/clearcircles":
                    this.clearCircles()
                    break

                case "/rotate":
                    this.$refs.app.style.transform = `rotate(${value}deg)`
                    break

                default:
                    console.log("invalid command")
                    break;
            }
        },

        spawnCircles(ballCount) {

            for (let i = 1; i <= ballCount; i++) {
                this.circles.push(new Circle(this.$refs.chatBody))
            }

            if (this.animationID) cancelAnimationFrame(this.animationID)
            this.animateCircles
            this.animationID = requestAnimationFrame(this.animateCircles)
        },

        animateCircles() {
            this.circles.forEach(circle => circle.moveCircle())
            this.animationID = requestAnimationFrame(this.animateCircles)
        },

        clearCircles() {
            this.circles.forEach(circle => circle.deleteCircle())
            this.circles = []
            cancelAnimationFrame(this.animationID)
        }

    },

    // Vue Lifecycle
    mounted() {
        console.log("It's Alive!")
    }

}).mount("#app")