type Item = {
    name: string,
    sprite: string
}

type ItemsList = Record<string, Item>

let items: ItemsList = {
    'con-coyolis': {
        name: "Co'n Co'yoli's",
        sprite: 'con-coyolis'
    },
    'con-coyolis-exit-door': {
        name: "Exit",
        sprite: 'con-coyolis-exit-door'
    },
    'con-coyolis-tunnel-door': {
        name: "Back Door",
        sprite: 'con-coyolis-tunnel-door'
    },
    'docks': {
        name: "Boat Docks",
        sprite: 'docks'
    },
    'fishgirl': {
        name: "Aly",
        sprite: 'fishgirl'
    },
    'guy': {
        name: "Guy",
        sprite: 'guy'
    },
    'lecture-hall': {
        name: "Lecture Hall",
        sprite: 'lecture-hall'
    },
    'leviathan-gateway': {
        name: "Sealed Gate",
        sprite: 'leviathan-gateway'
    },
    'personage-a': {
        name: "Personage A",
        sprite: 'personage-a'
    },
    'personage-b': {
        name: "Personage B",
        sprite: 'personage-b'
    },
    'river-of-time': {
        name: "The River of Time",
        sprite: 'river-of-time'
    },
    'soccer-ball': {
        name: "Soccer Ball",
        sprite: 'soccer-ball'
    }
}

export default items
