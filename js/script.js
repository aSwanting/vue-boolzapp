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

            // Convert searched string to lowercase, remove spaces
            const lowercaseSearch = this.contactSearched.toLowerCase().split(' ').join('')

            // Iterate through sidebar contacts
            if (lowercaseSearch) {
                this.contacts.forEach(contact => {

                    // Convert contact name to lower case, remove spaces
                    const lowercaseName = contact.name.toLowerCase().split(' ').join('')

                    // Compare searched string to contact name 
                    lowercaseName.includes(lowercaseSearch) ? contact.visible = true : contact.visible = false

                })
            }
        },
    },

    // Vue Methods
    methods: {

        // Keep track of current contact being displayed
        selectContact(index) {
            this.currentContact = index
        },

        // Toggle dropdown when clicking chevron
        toggleDropdown(index) {

            // Check if the dropdown is already open elsewhere
            if (this.dropdownOpen && this.currentDropdown != index) this.hideDropdown()

            // Get current message and toggle dropdown
            const currentMessage = this.contacts[this.currentContact].messages[index]
            currentMessage.dropdown = !currentMessage.dropdown

            // Keep track of which dropdown is currently open
            if (currentMessage.dropdown) {
                this.dropdownOpen = true
                this.currentDropdown = index
            } else {
                this.dropdownOpen = false
            }

        },

        // Hide any open dropdown
        hideDropdown() {

            // Check for open dropdown
            if (this.dropdownOpen) {

                // Check if current message has an open dropdown, if yes close it
                const currentMessage = this.contacts[this.currentContact].messages[this.currentDropdown]
                if (currentMessage.dropdown) currentMessage.dropdown = false
                this.dropdownOpen = false
            }
        },

        // Delete selected message        
        deleteMessage(index) {

            // Get currently selected message
            const currentMessage = this.contacts[this.currentContact].messages[index]

            // Replace message text, add deleted property to message
            currentMessage.message = "Message deleted"
            currentMessage.deleted = true
        },

        // Check user chat input
        checkUserChatInput() {

            // If input is empty do nothing
            if (this.newMessage) {

                // If message begins with "/", treat message as slash command, else send message
                this.newMessage[0] === "/" ? this.interpretCommand() : this.sendMessage()

                // Clear input
                this.newMessage = ""
            }
        },

        // Send message, await response
        sendMessage() {

            // Push user message to object, get current time from date
            this.contacts[this.currentContact].messages.push({
                date: (new Date().toLocaleString("en-GB")),
                message: this.newMessage,
                status: 'sent'
            })

            // If needed, scroll message into view
            this.scrollToBottom()

            // Await 1 second, call message response function
            setTimeout(() => this.receiveMessage(), 1000)
        },


        // Function to receive message response
        receiveMessage(slashCommand) {

            // Declare response variable
            let response

            // Check if message was a slash command
            if (!slashCommand) {

                // If no, get a random response from the randomResponses array
                const responseIndex = Math.floor(Math.random() * this.randomResponses.length)
                response = this.randomResponses[responseIndex]
            } else {

                // If yes, get response from slash command responses
                response = slashCommand
            }

            // Push message to object, get current time from date
            this.contacts[this.currentContact].messages.push({
                date: (new Date().toLocaleString("en-GB")),
                message: response,
                status: 'received'
            })

            // If needed, scroll message into view
            this.scrollToBottom()
        },

        // Scroll to bottom when new message is created
        scrollToBottom() {

            // Get chatBody html element
            const chat = this.$refs.chatBody

            // Set timeout to make sure scroll happens after message render
            setTimeout(() => chat.scrollTop = chat.scrollHeight - chat.clientHeight, 0)
        },

        // Convert date to accepted javascript format (month before day)
        convertDate(date) {

            // Split the date string
            const splitDate = date.split("/")

            // Create new date string, moving months before days
            const convertedDate = `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}`

            // Return concatenated date string
            return convertedDate
        },

        // Get Time from array, convert to correct format, extract 24H time
        getTimeFromArray(index) {

            // Get the converted date 
            const convertedDate = this.convertDate(this.contacts[this.currentContact].messages[index].date)

            // Extract time from date
            const time = new Date(convertedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })

            // Return time in 24H format
            return time
        },

        // Generate array of received messages
        getReceivedMessages(index) {

            // Get messages for current contact
            const messages = this.contacts[index].messages

            // Declare empty array
            let receivedMessages = []

            // Check each message, if status is "received", push to new array
            messages.forEach(message => {
                if (message.status === "received") {
                    receivedMessages.push(message)
                }
            })

            // Return array of received messages
            return receivedMessages
        },

        // Print the last received message for each contact
        printLastMessage(index) {

            // Assign received messages array to variable
            const receivedMessages = this.getReceivedMessages(index)

            // Get last message from array
            const lastMessage = receivedMessages[receivedMessages.length - 1].message

            // Return last message
            return lastMessage
        },


        // Print the time of last received message for each contact
        printLastMessageTime(index) {

            // Assign received messages array to variable
            const receivedMessages = this.getReceivedMessages(index)

            // Get the converted date for last message
            const convertedDate = this.convertDate(receivedMessages[receivedMessages.length - 1].date)

            // Extract the message time from date
            const time = new Date(convertedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })

            // Return the message time in 24H format
            return time
        },


        /////////////////////////////////////// BONUS COMMAND SECTION ///////////////////////////////////////
        // This section includes some bonus slash commands added for experimentation

        // Interpret the received slash command
        interpretCommand() {

            // Split and destructure the slash command
            const commandString = this.newMessage.split(" ")
            const [command, value] = commandString

            // Check if command matches, if yes respond with correct action
            switch (command) {

                // Print a list of possible commands in chat
                case "/commands":
                    this.receiveMessage("Type the following commands for bonus features")
                    this.receiveMessage("/circles number")
                    this.receiveMessage("/clearcircles")
                    this.receiveMessage("/rotate number")
                    break;

                // Command to spawn animated circles that bounce around the chat window
                case "/circles":
                    this.spawnCircles(value)
                    break;

                // Command to clear all spawned circles
                case "/clearcircles":
                    this.clearCircles()
                    break

                // Command to rotate the app by chosen amount in degrees
                case "/rotate":
                    this.$refs.app.style.transform = `rotate(${value}deg)`
                    break

                // If command doesn't match, respond with invalid command message
                default:
                    this.receiveMessage("Invalid command, type /commands to see list of possible slash commands")
                    break;
            }
        },

        // Function to spawn circles based on input from user
        spawnCircles(circleCount) {

            // Get number of circles wanted, push to array, spawning them
            for (let i = 1; i <= circleCount; i++) {
                this.circles.push(new Circle(this.$refs.chatBody))
            }

            // Check if animation is running, if yes cancel it
            if (this.animationID) cancelAnimationFrame(this.animationID)

            // Run animation
            this.animateCircles
            this.animationID = requestAnimationFrame(this.animateCircles)
        },

        // Loop circle animation
        animateCircles() {

            // Run moveCircle method from Circle class
            this.circles.forEach(circle => circle.moveCircle())
            this.animationID = requestAnimationFrame(this.animateCircles)
        },

        // Clear circles and stop running animation
        clearCircles() {

            // Loop through array of circles, deleting them
            this.circles.forEach(circle => circle.deleteCircle())

            // Empty circles array
            this.circles = []

            // Stop animation
            cancelAnimationFrame(this.animationID)
        }

    },

    // Vue Lifecycle
    mounted() {
        console.log("It's Alive!")
    }

}).mount("#app")