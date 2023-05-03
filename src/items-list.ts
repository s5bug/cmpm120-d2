type Item = {
    name: string,
    sprite: string
}

type ItemsList = Record<string, Item>

let items: ItemsList = {
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
