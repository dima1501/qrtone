const express = require('express')
const router = express.Router()

router.get('/api/get-sitemap-routes/', async (req, res) => {
    try {
        const users = await req.db.collection("users").find( {} ).toArray()
        const placesArr = await users.map(e => e.places.map(i => i.link)).reduce((a, b) => a.concat(b) )

        res.status(200).send(placesArr)
    } catch (error) {
        console.error(error)
    }
})

module.exports = router
