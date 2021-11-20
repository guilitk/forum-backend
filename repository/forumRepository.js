const mariadb = require('mariadb');
const { v4 } = require('uuid');

async function getConnectionPool() {

    return await mariadb.createConnection({ host: process.env.DB_HOST, port: process.env.DB_PORT, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_SCHEMA, ssl: false });

}

async function executeQuery(query, values) {

    const connection = await getConnectionPool()

    try {
        return values ? await connection.query(query, values) : await connection.query(query);
    } finally {
        connection?.destroy()
    }
}

async function getAllMessages() {
    const query = "SELECT * FROM message";

    try {
        return { messages: await executeQuery(query) }
    } catch (error) {

    }

}

async function getMessageById(id) {
    const query = "SELECT * FROM message WHERE id = ?";

    try {
        let result = await executeQuery(query, id);

        if (result.length <= 0) {
            throw { status: 404 }
        } else {
            return { message: result[0] }
        }

    } catch (error) {
        console.log(error);
        throw error
    }

}

async function createMessage({ user, message }) {
    const query = "INSERT INTO message VALUES (?,?,?,?)";
    const id = v4()
    const currentDate = new Date()

    try {
        const result = await executeQuery(query, [id, user, message, currentDate]);

        if (result.affectedRows >= 1) {
            return id
        } else {
            throw new Error("Unable to create new message")
        }
    } catch (error) {
        console.log(error);
        throw error
    }


}

async function deletePerson(id) {
    const query = "DELETE FROM person WHERE id = ?";
    let result = await executeQuery(query, id);
    result = JSON.parse(result)

    if (result.affectedRows < 1) {
        throw new Error(`Person with id ${id} was not deleted`);
    } else {
        return result;
    }
}

async function updatePerson(data, id) {
    const person = new Person(data);
    const query = "UPDATE person SET ? WHERE id = ?";
    let result = await executeQuery(query, [person, id]);
    result = JSON.parse(result)

    if (result.affectedRows < 1) throw new Error(`Person with id ${id} was not updated`);
}

exports.forumRepository = {
    getAllMessages,
    getMessageById,
    createMessage
};