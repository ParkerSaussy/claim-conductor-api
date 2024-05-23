/*
Simple file containing the basic CRUD operations for our database.

Normally these could live wherever we define the endpoints, but I'm extracting them here for readability.

Currently, there is ZERO detailed error reporting here. We can talk about how we'd like to add that later on, but for now, try/catch will suffice.
*/

export const createPerson = async (models, payload) => {
    try {
        let person = await models.Person.create({
            person_id: payload.person_id,
            name: payload.name,
            timestamp: payload.timestamp
        })
        return { person, success: true }
    } catch {
        return { person: null, success: false }
    }
}

export const renamePerson = async (models, payload) => {
    try {
        let person = await models.Person.update({
            name: payload.name,
            timestamp: payload.timestamp
        }).where({
            person_id: payload.person_id
        })
        return { person, success: true }
    } catch {
        return { person: null, success: false }
    }
}

export const deletePerson = async (models, payload) => {
    try {
        let person = await models.Person.destroy({
            where: {
                person_id: payload.person_id
            }
        })
        return { person, success: true }
    } catch {
        return { person: null, success: false }
    }
}

export const getPerson = async (models, payload) => {

}