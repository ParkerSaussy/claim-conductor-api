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
        let person = await models.Person.findOne({
            where: {
                person_id: payload.person_id
            }
        })
        person.name = payload.name
        person.save();
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

// This is really just a subset of the renamePerson function
// Whereas here we just return the name rather than conducting a mutation
export const getPersonName = async (models, payload) => {
    try {
        let person = await models.Person.findOne({
            where: {
                person_id: payload.person_id
            }
        })
        return { name: person.name, success: true }
    } catch {
        return { name: null, success: false }
    }
}

// Added an extra function here to return all models
// Using this exclusively for the frontend
export const getAllPeople = async (models) => {
    try {
        // Normally it'd be smart to apply a limit or something here, but there's no shot we'll have enough data to warrant that
        let people = await models.Person.findAll()
        return { people, success: true }
    } catch {
        return { people: null, success: false }
    }
}