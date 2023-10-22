import inquirer from "inquirer"
import fs from 'fs'

let users = []

//loads data from txt file into users[]
const loadUsers = () => {
    const data = fs.readFileSync('users.txt', 'utf8')
    users = JSON.parse(data)
}

//saves users[] in txt file like array with json objects
const saveUsers = (data) => {
    fs.writeFileSync('users.txt', JSON.stringify(data, null, 2))
}

//asks the user for the data he wants to add to the database.
const addUser = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the user`s name (press Enter to exit):',
        },
        {
            type: 'list',
            name: 'gender',
            message: 'Select the user`s gender:',
            choices: ['Male', 'Female', 'Walmart bag'],
            when: (answers) => answers.name !== ''
        },
        {
            type: 'input',
            name: 'age',
            message: 'Enter the user`s age:',
            when: (answers) => answers.name !== '',
            validate: (answers) =>{
                if(answers === '' || isNaN(answers)){
                    return "Enter a valid age"
                } else{
                    return true
                }
            }
        },
    ])
    .then((answers) => {
        if (answers.name === '') {
            searchUser()
            return
        }
        users.push(answers) 
        saveUsers(users)
        addUser()
    })
}

//asks the user to search for a record by name and executes the query depending on the answer. 
const searchUser = () => {
    console.log(users)
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'search',
            message: 'Search for a user by name?',
        }
    ])
    .then((answer) => {
        if (answer.search) {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'searchName',
                    message: 'Enter the name to search for:',
                }
            ])
            .then((searchValue) => {
                const foundUsers = users.filter(user => user.name.toLowerCase()
                .includes(searchValue.searchName
                    .toLowerCase()))

                if (foundUsers.length === 0) {
                    console.log('User not found in the database.')
                } else {
                    console.log('Found users:', foundUsers)
                }
            })
        } else {
            console.log('Goodbye!')
        }
    })
}

loadUsers()
addUser()
