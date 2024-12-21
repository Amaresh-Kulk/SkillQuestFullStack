module.exports = [
    {
        category: 'arrays',
        difficulty: 'easy',
        questionText: 'Find the maximum sum of a subarray of size k.',
        constraints: '1 <= arr.length <= 1000, 1 <= k <= arr.length',
        example: {
            input: '[2, 1, 5, 1, 3, 2], k=3',
            output: '9'
        },
        solution: 'You can use the sliding window technique to solve this problem efficiently.'
    },
    {
        category: 'trees',
        difficulty: 'medium',
        questionText: 'Given a binary tree, find its maximum depth.',
        constraints: 'The number of nodes in the tree is in the range [0, 10^4].',
        example: {
            input: 'root = [3,9,20,null,null,15,7]',
            output: '3'
        },
        solution: 'Use a depth-first search (DFS) or breadth-first search (BFS) to solve this problem.'
    },
    {
        category: 'dynamic-programming',
        difficulty: 'hard',
        questionText: 'Solve the "0/1 Knapsack" problem using dynamic programming.',
        constraints: 'The weights and values are positive integers, and the number of items can be large.',
        example: {
            input: 'values = [60, 100, 120], weights = [10, 20, 30], capacity = 50',
            output: '220'
        },
        solution: 'You need to use dynamic programming to fill a 2D table that stores the maximum value possible for each subproblem.'
    },
    {
        category: 'graphs',
        difficulty: 'medium',
        questionText: 'Find the shortest path in a weighted graph using Dijkstra\'s algorithm.',
        constraints: 'The graph is represented as an adjacency matrix or adjacency list.',
        example: {
            input: 'graph = [[0, 1, 4, 0, 0], [1, 0, 4, 2, 7], [4, 4, 0, 3, 5], [0, 2, 3, 0, 4], [0, 7, 5, 4, 0]], source = 0',
            output: '[0, 1, 4, 3, 7]'
        },
        solution: 'Use Dijkstra\'s algorithm to find the shortest path from the source node to all other nodes.'
    }
  ];
  