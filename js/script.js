const { createApp } = Vue

createApp({

    // Vue Data
    data() {
        return {
            contacts,
            currentContactIndex: 0,
            newMessage: "",
            randomResponses,
            contactSearched: "",
            currentDropdownIndex: -1,
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
            this.contacts.forEach((contact, index) => {

                // Convert contact name to lower case, remove spaces
                const lowercaseName = contact.name.toLowerCase().split(' ').join('')

                // Compare searched string to contact name 
                if (lowercaseName.includes(lowercaseSearch)) {

                    // Set visible property to true
                    contact.visible = true

                    // Get index of first matching character
                    const firstCharIndex = lowercaseName.indexOf(lowercaseSearch)
                    
                    // Create string before, including and after found characters
                    const foundCharsBefore = contact.name.slice(0, firstCharIndex)
                    const foundChars = contact.name.slice(firstCharIndex, firstCharIndex + lowercaseSearch.length)
                    const foundCharsAfter = contact.name.slice(firstCharIndex + lowercaseSearch.length)

                    // Style found characters using span with found-characters class
                    this.$refs.contactName[index].innerHTML = `${foundCharsBefore}<span class="found-characters">${foundChars}</span>${foundCharsAfter}`

                } else {

                    contact.visible = false

                }

            })
        },
    },

    // Vue Methods
    methods: {

        // Keep track of current contact being displayed
        selectContact(index) {
            this.currentContactIndex = index
        },

        // Keep track of current dropdown being opened
        updateCurrentDropdown(index) {
            this.currentDropdownIndex = index
        },

        // Delete selected message        
        deleteMessage(index) {

            // Get currently selected message
            const currentMessage = this.contacts[this.currentContactIndex].messages[index]

            // Replace message text, add deleted to message status
            currentMessage.message = "Message deleted"
            currentMessage.status += " deleted"
        },

        // Check user chat input
        checkUserChatInput() {

            // If input is empty do nothing
            if (this.newMessage) {

                // If message begins with "/", treat message as slash command, else send message
                this.newMessage.startsWith("/") ? this.interpretCommand() : this.sendMessage()

                // Clear input
                this.newMessage = ""
            }
        },

        // Send message, await response
        sendMessage() {

            // Push user message to object, get current time from date
            this.contacts[this.currentContactIndex].messages.push({
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
            this.contacts[this.currentContactIndex].messages.push({
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
            const convertedDate = this.convertDate(this.contacts[this.currentContactIndex].messages[index].date)

            // Extract time from date
            const time = new Date(convertedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })

            // Return time in 24H format
            return time
        },

        // Generate array of received messages
        getReceivedMessages(index) {

            // Get messages for current contact
            const messages = this.contacts[index].messages

            // Filter messages by status (keep "received")
            const receivedMessages = messages.filter((message) => message.status.includes("received"))

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
                    this.receiveMessage("/circles number (eg. /circles 10)")
                    this.receiveMessage("/clearcircles")
                    this.receiveMessage("/rotate number (eg. /rotate 45)")
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