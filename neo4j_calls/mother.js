let neo4j = require('neo4j-driver');
let { creds } = require("./../config/credentials");
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));

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
        },{name:firstName});
    }
    catch (err) {
        console.error(err);
        return mother;
    }
    return mother.records[0].get(0).properties;
};


