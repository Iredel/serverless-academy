const fs = require('fs').promises
const path = require('path')

const currentFolder = './db'

//read all files and return array
const readdirAndReadFiles = async (dirname) => {
    const filenames = await fs.readdir(dirname)
    const fileDataArray = await Promise.all(
        filenames.map(async (file) => {
            const data = await fs.readFile(path.join(dirname, file), 'utf-8')
               return new Set(data.split('\n'))
        })
    )
    return fileDataArray
}

//returns usernames occurring at least once in any of the files
const uniqueValues = async (folderPath) => {
    const data = await readdirAndReadFiles(folderPath)
    const allUsernames = new Set()
    data.forEach(set => {
        set.forEach(username => allUsernames.add(username))
    })
    return allUsernames.size
}

//returns usernames occur in all 20 files
const existInAllFiles = async (folderPath) => {
    const usernameSets = await readdirAndReadFiles(folderPath)
    let commonUsernames = new Set([...usernameSets[0]])
    for (let i = 1; i < usernameSets.length; i++) {
        commonUsernames = new Set([...commonUsernames].filter(username => usernameSets[i].has(username)))
    }
    return commonUsernames.size
}

//returns usernames occur in at least 10 files
const existInAtleastTen = async (folderPath) => { 
    const usernameSets = await readdirAndReadFiles(folderPath)
    const usernameCounts = new Map()
    usernameSets.forEach((set) => {
        set.forEach(username => {
            if (usernameCounts.has(username)) {
                usernameCounts.set(username, usernameCounts.get(username) + 1)
            } else {
                usernameCounts.set(username, 1)
            }
        })
    })
    const usernamesInAtLeastTen = [...usernameCounts].filter(([username, count]) => count >= 10)
    return usernamesInAtLeastTen.length
}

async function main(){
    console.time("Execution Time")
    console.log("uniqueValues:" + await uniqueValues(currentFolder))
    console.log("existInAllFiles:" + await existInAllFiles(currentFolder))
    console.log("inAtleastTen:" + await existInAtleastTen(currentFolder))
    console.timeEnd("Execution Time")
}

main()