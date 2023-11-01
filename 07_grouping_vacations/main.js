const vacationsData = require('./data.json')

const groupVacations = (data) => {
    const gruopedData = data.reduce((acc, obj) => {
        const existingUser = acc.find((user) => user.userId === obj.user._id)
        if (existingUser) {
            existingUser.vacations.push({
                usedDays: obj.usedDays,
                startDate: obj.startDate,
                endDate: obj.endDate,
                status: obj.status,
            })
        } else {
            const user = (obj = {
                userId: obj.user._id,
                userName: obj.user.name,
                vacations: [
                    {
                        usedDays: obj.usedDays,
                        startDate: obj.startDate,
                        endDate: obj.endDate,
                        status: obj.status,
                    },
                ],
            })
            acc.push(user)
        }
        return acc
    }, [])

    return gruopedData
}

console.log(groupVacations(vacationsData))
