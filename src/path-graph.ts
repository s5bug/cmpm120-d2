export type PathGraphOptions<V, E> = {
    nodes: Record<string, V>,
    edges: Record<string, [string, string, E]>
}

export default class PathGraph<V, E> {
    private readonly _nodes: Record<string, V>
    private readonly _edges: Record<string, E>
    private readonly _adjacencies: Record<string, [string, string]>
    private readonly spokes: Record<string, Record<string, string>>

    constructor(props: PathGraphOptions<V, E>) {
        this._nodes = props.nodes

        this._edges = {}
        this._adjacencies = {}
        this.spokes = {}
        for(let edge in props.edges) {
            let [p0, p1, data] = props.edges[edge]

            this._edges[edge] = data
            this._adjacencies[edge] = [p0, p1]

            if(!this.spokes[p0]) this.spokes[p0] = {}
            this.spokes[p0][edge] = p1

            if(!this.spokes[p1]) this.spokes[p1] = {}
            this.spokes[p1][edge] = p0
        }
    }

    get nodes(): Record<string, V> {
        return Object.freeze(this._nodes);
    }

    get edges(): Record<string, E> {
        return Object.freeze(this._edges);
    }

    get adjacencies(): Record<string, [string, string]> {
        return Object.freeze(this._adjacencies);
    }

    minEdgeBy(fn: (edge: string) => number): string | undefined {
        let minScore = Infinity
        let minEdge = undefined
        for (let edgeName in this.edges) {
            let score = fn(edgeName)
            if(score < minScore) {
                minEdge = edgeName
                minScore = score
            }
        }
        return minEdge
    }

    bfs(from: string, to: string, weight: (edge: string) => number): { weight: number, vertices: string[] } | undefined {
        type Path = { weight: number, vertices: string[] }

        let minimum: Path | undefined

        let queue: Path[] = [{ weight: 0, vertices: [from] }]
        let seen: Record<string, number> = {}

        while (queue.length > 0) {
            let process = queue.shift()!
            let mostRecent = process.vertices[process.vertices.length - 1]

            seen[mostRecent] = process.weight

            if(mostRecent == to) {
                if(minimum == undefined || minimum.weight < process.weight) {
                    minimum = process
                }
            }

            let spoke = this.spokes[mostRecent]
            for(let edge in spoke) {
                let pathWeight = process.weight + weight(edge)

                let extantWeight = seen[spoke[edge]] || Infinity

                if(extantWeight < pathWeight) {
                    let nextPath: Path = { weight: pathWeight, vertices: process.vertices.concat([spoke[edge]]) }
                    queue.push(nextPath)
                }
            }
        }

        return minimum
    }

}
