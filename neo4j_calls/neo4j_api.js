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

exports.get_mother_by_document_number = async function(documentNumber) {
    let session = driver.session();
    let mother = "No Mother Was Found";
    try {
      mother = await session.run('MATCH (n:mother {documentNumber: $docNum}) RETURN n', {
        docNum: documentNumber
      });
    } catch (err) {
      console.error(err);
      return mother;
    }
    return mother.records[0].get(0).properties;
  };




exports.update_mother = async function (docNum, fName, updatedData) {
    let session = driver.session();
    try {
      const result = await session.run(
        'MATCH (n:mother {documentNumber: $docNum, firstName: $fName}) SET n += $updatedData RETURN n',
        { docNum, fName, updatedData }
      );
      console.log(`Mother with documentNumber "${docNum}" and firstName "${fName}" has been updated successfully.`);
      return result.records[0].get('n').properties;
    } catch (error) {
      console.log(`Error updating mother with documentNumber "${docNum}" and firstName "${fName}": ${error}`);
      throw error;
    } finally {
      await session.close();
    }
  };


exports.delete_mother = async function (documentNumber) {
    let session = driver.session();
    try {
        await session.run('MATCH (n:mother {documentNumber: $docNum}) DELETE n', {
            docNum: documentNumber
        });
        console.log(`Node with firstName "${documentNumber}" has been deleted successfully.`);
    } catch (error) {
        console.log(`Error deleting node with firstName "${documentNumber}": ${error}`);
    } finally {
        await session.close();
    }
};