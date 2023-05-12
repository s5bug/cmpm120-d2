export type AdventureState<T> = {
    setup: (scene: T) => void,
    teardown: (scene: T) => void,
}

export type AdventureStory<T> = {
    states: Record<string, AdventureState<T>>
}
