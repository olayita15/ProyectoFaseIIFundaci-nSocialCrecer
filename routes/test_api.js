const express = require('express');
const router = express.Router();
const neo4j_calls = require('./../neo4j_calls/neo4j_api');

router.get('/', async function (req, res, next) {
    res.status(200).send("Root Response from :8080/test_api")
    return 700000;
})

router.get('/neo4j_get', async function (req, res, next) {
    let result = await neo4j_calls.get_num_nodes();
    console.log("RESULT IS", result)
    res.status(200).send({ result })    //Can't send just a Number; encapsulate with {} or convert to String.     
    return { result };
})

router.post('/neo4j_post', async function (req, res, next) {
    //Passing in "name" parameter in body of POST request
    let { name } = req.body;
    let string = await neo4j_calls.create_user(name);
    res.status(200).send("User named " + string + " created")
    return 700000;
    //res.status(200).send("test delete")
})

router.post('/neo4j_post_relation', async function (req, res, next) {
    let { user1, user2, relation } = req.body;
    let result = await neo4j_calls.create_user_relation(user1, user2, relation);
    if (result === "No Relation Was Created") {
        res.status(500).send("Error creating relation");
    } else {
        res.status(200).send("Relation " + relation + " created between users " + user1 + " and " + user2);
    }
})

router.post('/neo4j_post_mother', async function (req, res, next) {
    // Obtener parámetros del cuerpo de la solicitud POST
    const {
        motherDocumentType,
        motherDocumentNumber,
        motherFirstName,
        motherSecondName,
        motherFirstLastname,
        motherSecondLastname,
        motherBirthdate,
        motherBirthCountry,
        motherBirthDepartment,
        motherBirthCity
    } = req.body;

    // Crear un nuevo nodo "mother" en Neo4j
    const result = await neo4j_calls.create_mother(
        motherDocumentType,
        motherDocumentNumber,
        motherFirstName,
        motherSecondName,
        motherFirstLastname,
        motherSecondLastname,
        motherBirthdate,
        motherBirthCountry,
        motherBirthDepartment,
        motherBirthCity
    );

    // Enviar respuesta de éxito con el resultado del query
    res.status(200).send(result);
});


router.put('/neo4j_update_mother', async function (req, res, next) {
    // Obtener parámetros del cuerpo de la solicitud POST
    const {
        motherDocumentType,
        motherDocumentNumber,
        motherFirstName,
        motherSecondName,
        motherFirstLastname,
        motherSecondLastname,
        motherBirthdate,
        motherBirthCountry,
        motherBirthDepartment,
        motherBirthCity
    } = req.body;

    // Crear un nuevo nodo "mother" en Neo4j
    const result = await neo4j_calls.update_mother(
        motherDocumentType,
        motherDocumentNumber,
        motherFirstName,
        motherSecondName,
        motherFirstLastname,
        motherSecondLastname,
        motherBirthdate,
        motherBirthCountry,
        motherBirthDepartment,
        motherBirthCity
    );

    // Enviar respuesta de éxito con el resultado del query
    res.status(200).send(result);
});

router.delete('/neo4j_delete_mother/:documentNumber', async function (req, res, next) {
    const documentNumber = req.params.documentNumber;

    try {
        await neo4j_calls.delete_mother(documentNumber);
        res.status(200).send(`Node with documentNumber"${documentNumber}" has been deleted successfully.`);
    } catch (error) {
        res.status(500).send(`Error deleting node with documentNumber "${documentNumber}": ${error}`);
    }
});


module.exports = router;

