function unflattenIndex(index) {

    const makeObject = (name) => {
        return {name: name, children: []}
    }

    const objectMap = {}

    for (let key of Object.keys(index)) {

        let obj
        if (objectMap.hasOwnProperty(key)) {
            obj = objectMap[key]
        } else {
            obj = makeObject(key)
            objectMap[key] = obj
        }

        const tmp = index[key]
        for (let childName of Object.keys(tmp)) {
            let child
            const childKey = key + (key.endsWith('/') ? '' : '/') + childName
            if (objectMap.hasOwnProperty(childKey)) {
                child = objectMap[childKey]
            } else {
                child = makeObject(childKey)
                objectMap[childKey] = child
            }
            obj.children.push(child)
        }

    }

    const rootObject = objectMap['/']

    return rootObject

}

export {unflattenIndex}