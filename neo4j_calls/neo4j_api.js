let neo4j = require('neo4j-driver');
let { creds } = require("./../config/credentials");
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));

exports.get_num_nodes = async function () {
    let session = driver.session();
    const num_nodes = await session.run('MATCH (n) RETURN n', {
    });
    session.close();
    console.log("RESULT", (!num_nodes ? 0 : num_nodes.records.length));
    return (!num_nodes ? 0 : num_nodes.records.length);
};

exports.create_user = async function (name) {
    let session = driver.session();
    let user = "No User Was Created";
    try {
        user = await session.run('MERGE (n:user {name: $id}) RETURN n', {
            id: name
        });
    }
    catch (err) {
        console.error(err);
        return user;
    }
    return user.records[0].get(0).properties.name;
};

exports.create_user_relation = async function (user1, user2, relation) {
    let session = driver.session();
    let result = "No Relation Was Created";
    try {
        result = await session.run('MATCH (a:user {name: $user1}), (b:user {name: $user2}) MERGE (a)-[r:' + relation + ']->(b) RETURN r', {
            user1: user1,
            user2: user2
        });
    }
    catch (err) {
        console.error(err);
        return result;
    }
    return result.records[0].get(0);
};

exports.create_mother = async function (documentType, documentNumber, firstName, secondName, firstLastname, secondLastname, birthdate, birthCountry, birthDepartment, birthCity) {
    let session = driver.session();
    let mother = "No Mother Was Created";
    try {
        mother = await session.run('MERGE (n:mother {documentType: $docType, documentNumber: $docNum, firstName: $fName, secondName: $sName, firstLastname: $fLastname, secondLastname: $sLastname, birthdate: $birthdate, birthCountry: $birthCountry, birthDepartment: $birthDepartment, birthCity: $birthCity}) RETURN n', {
            docType: documentType,
            docNum: documentNumber,
            fName: firstName,
            sName: secondName,
            fLastname: firstLastname,
            sLastname: secondLastname,
            birthdate: birthdate,
            birthCountry: birthCountry,
            birthDepartment: birthDepartment,
            birthCity: birthCity
        });
    }
    catch (err) {
        console.error(err);
        return mother;
    }
    return mother.records[0].get(0).properties;
};
