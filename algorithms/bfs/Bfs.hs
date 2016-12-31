module Bfs where

import Queue

data TreeNode a = TreeNode a [TreeNode a] deriving Show

valueOf :: TreeNode a -> a
valueOf (TreeNode value _) = value

childrenOf :: TreeNode a -> [TreeNode a]
childrenOf (TreeNode _ children) = children


bfs :: TreeNode a -> [a]
bfs tree = bfs' (Queue [tree] [])
    where
        bfs' :: Queue (TreeNode a) -> [a]
        bfs' (Queue [] []) = []
        bfs' que = value:bfs' withChildren
            where
                pair = deq que
                value = valueOf $ fst pair
                withChildren = enqMany (childrenOf $ fst pair) (snd pair)
                

sample = TreeNode 1 [ 
                        TreeNode 2 [ TreeNode 4 [], TreeNode 5 [TreeNode 8 []] ]
                        , TreeNode 3 [ TreeNode 6 [], TreeNode 7 [] ] 
                    ]

main = print $ bfs sample