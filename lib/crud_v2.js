/*
V2 version of the original CRUD functions.

Note that V2 in this case just means the intended functionality of preserving each name-change operation as a row
*/

export const createPerson_v2 = async (models, payload) => {
    try {
        let action = await models.Action.findOrCreate({
            where: {
                person_id: payload.person_id,
                action: 'PersonAdded'
            },
            defaults: {
                name: payload.name,
                timestamp: payload.timestamp,
                action: 'PersonAdded'
            }
        })
        return { action, success: true }
    } catch {
        return { action: null, success: false }
    }
}

export const renamePerson_v2 = async (models, payload) => {
    // We only allow renames if an original creation action exists
    let existingPerson = await models.Action.findOne({
        where: {
            person_id: payload.person_id,
            action: 'PersonAdded'
        }
    })
    if (!existingPerson) {
        return { action: null, success: false }
    }   
    try {
        let action = await models.Action.create({
            person_id: payload.person_id,
            name: payload.name,
            timestamp: payload.timestamp,
            action: 'PersonRenamed'
        })
        return { action, success: true }
    } catch {
        return { action: null, success: false }
    }
}

export const deletePerson_v2 = async (models, payload) => {
    // I thought about adding "delete" actions, but I think it's better to just remove the person from the DB entirely
    // This might have been a stipulation in the prompt, but we can speak to it further
    // Handily, this will delete every action associated with the person's ID
    try {
        let person = await models.Action.destroy({
            where: {
                person_id: payload.person_id
            }
        })
        return { person, success: true }
    } catch {
        return { person: null, success: false }
    }
}

export const getPersonName_v2 = async (models, payload) => {
    try {
        let actions = await models.Action.findAll({
            where: {
                person_id: payload.person_id
            },
            order: [['timestamp', 'DESC']],
        })
        let latestName = actions[0].name // Descending order by timestamp ensures we get the newest name
        return { name: latestName, success: true }
    } catch {
        return { name: null, success: false }
    }
}

// Added an extra function here to return all models
// Using this exclusively for the frontend
export const getAllPeople_v2 = async (models) => {
    try {
        // Normally it'd be smart to apply a limit or something here, but there's no shot we'll have enough data to warrant that
        let actions = await models.Action.findAll()
        return { actions, success: true }
    } catch {
        return { actions: null, success: false }
    }
}