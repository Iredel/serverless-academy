const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/json-:id', (req, res) => {
    const jsonNumber = req.params.id
    switch (jsonNumber) {
        case '1':
            res.json({
                isDone: true,
            })
            break

        case '2':
            res.json({
                task: {
                    isDone: false,
                },
            })
            break

        case '3':
            res.json({
                data: {
                    status: {
                        isDone: true,
                    },
                },
            })
            break

        case '5':
            res.json({
                taskStatus: {
                    isDone: true,
                },
            })
            break

        case '6':
            res.json({
                result: {
                    completed: {
                        isDone: false,
                    },
                },
            })
            break

        case '7':
            res.json({
                details: {
                    a: {
                        b: {
                            c: {
                                g: {
                                    isDone: true,
                                },
                            },
                        },
                    },
                },
            })
            break

        case '8':
            res.json({
                statusDetails: {
                    isDones: false,
                    ban: {
                        ban: 23,
                    },
                    bndw: {
                        wfjen: {
                            isDone: false,
                        },
                    },
                },
            })
            break

        case '9':
            res.json({
                taskState: {
                    finished: {
                        isDone: true,
                    },
                },
            })
            break

        case '11':
            res.json({
                completedTask: {
                    isDone: true,
                },
            })
            break

        case '12':
            res.json({
                taskProgressStatus: {
                    isDone: false,
                },
            })
            break

        case '13':
            res.json({
                done: {
                    isDone: true,
                },
            })
            break

        case '14':
            res.json({
                resultStatus: {
                    isDone: false,
                },
            })
            break

        case '15':
            res.json({
                completion: {
                    isDone: true,
                },
            })
            break

        case '16':
            res.json({
                status: {
                    details: {
                        isDone: false,
                    },
                },
            })
            break

        case '18':
            res.json({
                taskStatusDetails: {
                    isDone: false,
                },
            })
            break

        case '19':
            res.json({
                stateDetails: {
                    finished: {
                        isDone: true,
                    },
                },
            })
            break

        case '20':
            res.json({
                doneTask: {
                    isDone: false,
                },
            })
            break
        default:
            res.status(404).send('Endpoint Not Found')
    }
})

app.listen(3000)
