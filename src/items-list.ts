type Item = {
    name: string,
    sprite: string
}

type ItemsList = Record<string, Item>

let items: ItemsList = {
    'soccer-ball': {
        name: "Soccer Ball",
        sprite: 'soccer-ball'
    }
}

export default items
