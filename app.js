const app = require('express')();
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose= require('mongoose');
const port = process.env.PORT || 3030

mongoose.connect

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('*', (req, res) => {
  res.send('This is a USSD for hack jos by team Code fire')
})
app.post('*', (req, res) => {
    let {sessionId, feedback, phoneNumber, text} = req.body
    if (text == '') {
      // This is the first request. Note how we start the response with CON
      let response = `CON What would you want to track
      1. Track project
      2. About follow the money`
      res.send(response)
    } else if (text == '1') {
      // Business logic for first level response
      let response = `CON Choose the sector information you want to view
      1. Education
      2. Agriculture`
      res.send(response)
    } else if (text == '2') {
      // Business logic for first level response
      let response = `END Follow the money non governmental organization that dedicates itself in ensuring public funds are utilized feel free to visit us at ifollowthemoney.com`
      res.send(response)
    } else if (text == '1*1') {
      // Business logic for first level response
      let response = `CON here are the current projects in Education
      1. Buiding School in Daura
      2. provision of blackboard in 6 communities`
 // This is a terminal request. Note how we start the response with END
  res.send(response)
} else if (text == '1*2') {
 // This is a second level response where the user selected 1 in the first instance
 let response = `CON here are the current projects in Agriculture
      1. Farmers loan
      2. Distribution of fertilizer in Bokkos plateau state`
 // This is a terminal request. Note how we start the response with END
 res.send(response)
}else if(text == '1*1*1'){
  let response = "END the federal government has realese 200 million naira for the construction of a primary school in Daura"
  res.send(response)
}else if(text == '1*1*2'){
  let response = "END the federal government has realese 100 million naira for the provision of blackboard in 6 communities in the north east"
  res.send(response)
} else if(text == '1*2*1'){
  let response = "END the federal government has realese 500 million naira as loan to farmers who owns at leat 2parsel of land accross in bauchi"
  res.send(response)
}else if(text == '1*2*2'){
  let response = "END the federal government are currently distributing fertilizers to farmers in Bokkos plateau state so as to improve yield of irish potatoes"
  res.send(response)
} else {
 res.status(400).send('Bad request!')
}
})

app.listen(port, () => {
console.log(`Server running on port ${port}`)
})  